import { randomBytes } from 'node:crypto';

import { hashValue } from '../../infrastructure/crypto/index.js';
import { BaseError } from '../../shared/errors/index.js';

import { TOKEN_PURPOSE_EMAIL_VERIFICATION, type TokenPurpose } from './token.model.js';
import { TokenRepository } from './token.repository.js';

export interface GeneratedToken {
  tokenId: string;
  userId: string;
  purpose: TokenPurpose;
  rawToken: string;
  expiresAt: Date;
}

export interface ValidatedToken {
  tokenId: string;
  userId: string;
  purpose: TokenPurpose;
  expiresAt: Date;
}

const TOKEN_BYTE_LENGTH = 32;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,}$/u;

const invalidInput = (message: string): BaseError =>
  new BaseError(message, {
    code: 'INVALID_INPUT',
    statusCode: 400,
  });

const tokenInvalid = (): BaseError =>
  new BaseError('Token is invalid.', {
    code: 'TOKEN_INVALID',
    statusCode: 400,
  });

const tokenExpired = (): BaseError =>
  new BaseError('Token has expired.', {
    code: 'TOKEN_EXPIRED',
    statusCode: 400,
  });

const tokenUsed = (): BaseError =>
  new BaseError('Token has already been used.', {
    code: 'TOKEN_USED',
    statusCode: 400,
  });

const parsePurpose = (purpose: string): TokenPurpose => {
  if (purpose !== TOKEN_PURPOSE_EMAIL_VERIFICATION) {
    throw invalidInput('Unsupported token purpose.');
  }

  return purpose;
};

const normalizeRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string') {
    throw invalidInput(`${fieldName} is required.`);
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    throw invalidInput(`${fieldName} is required.`);
  }

  return normalized;
};

const normalizeTokenInput = (rawToken: unknown): string => {
  const normalized = normalizeRequiredString(rawToken, 'token');
  if (!TOKEN_PATTERN.test(normalized)) {
    throw tokenInvalid();
  }
  return normalized;
};

export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository = new TokenRepository()) {}

  async generateToken(userId: unknown, purpose: string): Promise<GeneratedToken> {
    const normalizedUserId = normalizeRequiredString(userId, 'userId');
    const parsedPurpose = parsePurpose(purpose);

    const rawToken = randomBytes(TOKEN_BYTE_LENGTH).toString('base64url');
    const nowMs = Date.now();
    const expiresAt = new Date(nowMs + EMAIL_VERIFICATION_TTL_MS);
    const tokenHash = hashValue(rawToken);
    const token = await this.tokenRepository.createTokenRecord({
      userId: normalizedUserId,
      purpose: parsedPurpose,
      tokenHash,
      expiresAt,
    });

    return {
      tokenId: token.id,
      userId: token.userId,
      purpose: token.purpose,
      rawToken,
      expiresAt: token.expiresAt,
    };
  }

  async validateToken(rawToken: unknown, purpose: string): Promise<ValidatedToken> {
    const parsedPurpose = parsePurpose(purpose);
    const normalizedToken = normalizeTokenInput(rawToken);
    const tokenHash = hashValue(normalizedToken);
    const nowMs = Date.now();
    const now = new Date(nowMs);
    const validToken = await this.tokenRepository.findValidTokenByHashAndPurpose(
      tokenHash,
      parsedPurpose,
      now,
    );

    if (validToken !== null) {
      return {
        tokenId: validToken.id,
        userId: validToken.userId,
        purpose: validToken.purpose,
        expiresAt: validToken.expiresAt,
      };
    }

    const matchedToken = await this.tokenRepository.findTokenByHashAndPurpose(
      tokenHash,
      parsedPurpose,
    );
    if (matchedToken === null) {
      throw tokenInvalid();
    }

    if (matchedToken.usedAt !== null) {
      throw tokenUsed();
    }

    if (matchedToken.expiresAt.getTime() <= nowMs) {
      throw tokenExpired();
    }

    throw tokenInvalid();
  }

  async consumeToken(tokenId: unknown): Promise<void> {
    const normalizedTokenId = normalizeRequiredString(tokenId, 'tokenId');
    const consumedToken = await this.tokenRepository.consumeTokenAtomic(
      normalizedTokenId,
      new Date(Date.now()),
    );

    if (consumedToken === null) {
      throw tokenUsed();
    }
  }
}

export const tokenService = new TokenService();
