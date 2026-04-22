import { generateSecureToken, hashValue } from '../../infrastructure/crypto/index.js';
import { BaseError } from '../../shared/errors/index.js';

import { TokenRepository, type CreateTokenRecordInput } from './token.repository.js';
import { TOKEN_PURPOSES, type TokenPurpose } from './token.model.js';

const DEFAULT_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export interface GeneratedToken {
  rawToken: string;
  expiresAt: Date;
}

export interface ValidatedToken {
  tokenId: string;
  userId: string;
  expiresAt: Date;
}

type RawTokenFactory = () => string;

type TokenStore = Pick<
  TokenRepository,
  'createToken' | 'findByPurposeAndTokenHash' | 'consumeToken'
>;

const invalidInput = (message: string): BaseError =>
  new BaseError(message, {
    code: 'INVALID_INPUT',
    statusCode: 400,
  });

const invalidToken = (): BaseError =>
  new BaseError('Invalid token.', {
    code: 'INVALID_TOKEN',
    statusCode: 400,
  });

const expiredToken = (): BaseError =>
  new BaseError('Token expired.', {
    code: 'TOKEN_EXPIRED',
    statusCode: 400,
  });

const usedToken = (): BaseError =>
  new BaseError('Token already used.', {
    code: 'TOKEN_ALREADY_USED',
    statusCode: 400,
  });

const requiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string') {
    throw invalidInput(`${fieldName} is required.`);
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    throw invalidInput(`${fieldName} is required.`);
  }

  return normalized;
};

const normalizePurpose = (value: unknown): TokenPurpose => {
  if (typeof value !== 'string' || !TOKEN_PURPOSES.includes(value as TokenPurpose)) {
    throw invalidInput('purpose is invalid.');
  }

  return value as TokenPurpose;
};

const isExpired = (expiresAt: Date): boolean => expiresAt.getTime() <= Date.now();

export class TokenService {
  constructor(
    private readonly tokenStore: TokenStore = new TokenRepository(),
    private readonly rawTokenFactory: RawTokenFactory = () => generateSecureToken(),
  ) {}

  async generateToken(userId: string, purpose: TokenPurpose): Promise<GeneratedToken> {
    const normalizedUserId = requiredString(userId, 'userId');
    const normalizedPurpose = normalizePurpose(purpose);
    const rawToken = this.rawTokenFactory();
    const expiresAt = new Date(Date.now() + DEFAULT_TOKEN_TTL_MS);
    const createInput: CreateTokenRecordInput = {
      userId: normalizedUserId,
      purpose: normalizedPurpose,
      tokenHash: hashValue(rawToken),
      expiresAt,
    };

    await this.tokenStore.createToken(createInput);

    return {
      rawToken,
      expiresAt,
    };
  }

  async validateToken(rawToken: string, purpose: TokenPurpose): Promise<ValidatedToken> {
    const normalizedRawToken = requiredString(rawToken, 'token');
    const normalizedPurpose = normalizePurpose(purpose);
    const tokenHash = hashValue(normalizedRawToken);
    const token = await this.tokenStore.findByPurposeAndTokenHash(normalizedPurpose, tokenHash);

    if (token === null) {
      throw invalidToken();
    }

    if (token.usedAt !== undefined) {
      throw usedToken();
    }

    if (isExpired(token.expiresAt)) {
      throw expiredToken();
    }

    return {
      tokenId: token.id,
      userId: token.userId,
      expiresAt: token.expiresAt,
    };
  }

  async consumeToken(tokenId: string): Promise<void> {
    const normalizedTokenId = requiredString(tokenId, 'tokenId');
    const token = await this.tokenStore.consumeToken(normalizedTokenId);

    if (token === null) {
      throw usedToken();
    }
  }
}

export const tokenService = new TokenService();
