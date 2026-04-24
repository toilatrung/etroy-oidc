import { config, type OidcClient } from '../../config/config.js';
import { hashValue } from '../../infrastructure/crypto/index.js';
import { BaseError } from '../../shared/errors/index.js';
import { authService, type AuthenticatedIdentity } from '../auth/auth.service.js';
import { randomBytes, createHash } from 'node:crypto';

import { BaselineAccessTokenProvider } from './access-token.provider.js';
import { AuthorizationCodeRepository } from './authorization-code.repository.js';
import type { AccessTokenProvider, AuthorizationCodeEntity } from './oidc.types.js';

export interface AuthorizeRequestContext {
  accepted: true;
  requiresAuthentication: true;
  responseType: 'code';
  client: {
    clientId: string;
  };
  redirectUri: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  state?: string;
}

export type AuthResult = AuthenticatedIdentity;

export interface AuthBridge {
  validateCredentials(email: unknown, password: unknown): Promise<AuthResult>;
}

// Sprint 08 exposes this contract surface only; /authorize must not execute it.
// Credential-validation continuation belongs to later approved flow scope.
export const defaultAuthBridge: AuthBridge = authService;

const PKCE_S256 = 'S256';
const AUTHORIZATION_CODE_BYTE_LENGTH = 32;
const AUTHORIZATION_CODE_TTL_MS = 5 * 60 * 1000;
const CODE_CHALLENGE_PATTERN = /^[A-Za-z0-9_-]{43,128}$/u;
const CODE_VERIFIER_PATTERN = /^[A-Za-z0-9\-._~]{43,128}$/u;
const AUTHORIZATION_CODE_PATTERN = /^[A-Za-z0-9_-]{43,128}$/u;

export interface AuthorizeContinueResult {
  redirectTo: string;
}

export interface TokenExchangeResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

const invalidInput = (message: string): BaseError =>
  new BaseError(message, {
    code: 'INVALID_INPUT',
    statusCode: 400,
  });

const invalidGrant = (): BaseError =>
  new BaseError('Authorization code exchange is invalid.', {
    code: 'INVALID_GRANT',
    statusCode: 400,
  });

const readSingleString = (
  source: Record<string, unknown>,
  field: string,
  message: string = `${field} is required.`,
): string => {
  const value = source[field];

  if (typeof value !== 'string') {
    throw invalidInput(message);
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    throw invalidInput(message);
  }

  return normalized;
};

const readOptionalString = (source: Record<string, unknown>, field: string): string | undefined => {
  const value = source[field];
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw invalidInput(`${field} must be a string.`);
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    throw invalidInput(`${field} must not be empty.`);
  }

  return normalized;
};

const assertOpenIdScope = (scope: string): void => {
  const scopes = scope.split(/\s+/u).filter((item) => item.length > 0);
  if (!scopes.includes('openid')) {
    throw invalidInput('scope must include openid.');
  }
};

const assertPkceChallenge = (challenge: string): void => {
  if (!CODE_CHALLENGE_PATTERN.test(challenge)) {
    throw invalidInput('code_challenge must be URL-safe base64 and between 43 and 128 characters.');
  }
};

const assertPkceVerifier = (verifier: string): void => {
  if (!CODE_VERIFIER_PATTERN.test(verifier)) {
    throw invalidInput('code_verifier must be 43-128 chars and use unreserved characters only.');
  }
};

const assertAuthorizationCodeFormat = (code: string): void => {
  if (!AUTHORIZATION_CODE_PATTERN.test(code)) {
    throw invalidGrant();
  }
};

const findClient = (clients: readonly OidcClient[], clientId: string): OidcClient => {
  const client = clients.find((item) => item.clientId === clientId);
  if (client === undefined) {
    throw invalidInput('client_id is invalid.');
  }

  return client;
};

const assertRedirectUri = (client: OidcClient, redirectUri: string): void => {
  if (!client.redirectUris.includes(redirectUri)) {
    throw invalidInput('redirect_uri is invalid.');
  }
};

const toQueryRecord = (query: unknown): Record<string, unknown> => {
  if (typeof query !== 'object' || query === null || Array.isArray(query)) {
    throw invalidInput('authorize query must be an object.');
  }

  return query as Record<string, unknown>;
};

const ensureUnconsumed = (authorizationCode: AuthorizationCodeEntity): void => {
  if (authorizationCode.usedAt !== null) {
    throw invalidGrant();
  }
};

const ensureNotExpired = (authorizationCode: AuthorizationCodeEntity, now: Date): void => {
  if (authorizationCode.expiresAt.getTime() <= now.getTime()) {
    throw invalidGrant();
  }
};

const ensureAuthorizationCodeClientContext = (
  authorizationCode: AuthorizationCodeEntity,
  clientId: string,
  redirectUri: string,
): void => {
  if (authorizationCode.clientId !== clientId || authorizationCode.redirectUri !== redirectUri) {
    throw invalidGrant();
  }
};

const ensurePkceVerifierMatches = (
  codeVerifier: string,
  authorizationCode: AuthorizationCodeEntity,
): void => {
  if (authorizationCode.codeChallengeMethod !== PKCE_S256) {
    throw invalidGrant();
  }

  const computedChallenge = createHash('sha256').update(codeVerifier, 'utf8').digest('base64url');
  if (computedChallenge !== authorizationCode.codeChallenge) {
    throw invalidGrant();
  }
};

export class OidcService {
  constructor(
    private readonly clients: readonly OidcClient[] = config.oidc.clients,
    private readonly authBridge: AuthBridge = defaultAuthBridge,
    private readonly authorizationCodeRepository: AuthorizationCodeRepository = new AuthorizationCodeRepository(),
    private readonly accessTokenProvider: AccessTokenProvider = new BaselineAccessTokenProvider(),
    private readonly getNow: () => Date = () => new Date(),
  ) {}

  validateAuthorizeRequest(query: unknown): AuthorizeRequestContext {
    const queryRecord = toQueryRecord(query);
    const responseType = readSingleString(queryRecord, 'response_type');
    if (responseType !== 'code') {
      throw invalidInput('response_type must be code.');
    }

    const clientId = readSingleString(queryRecord, 'client_id');
    const redirectUri = readSingleString(queryRecord, 'redirect_uri');
    const scope = readSingleString(queryRecord, 'scope');
    const codeChallenge = readSingleString(queryRecord, 'code_challenge');
    const codeChallengeMethod = readSingleString(queryRecord, 'code_challenge_method');
    const state = readOptionalString(queryRecord, 'state');

    if (codeChallengeMethod !== PKCE_S256) {
      throw invalidInput('code_challenge_method must be S256.');
    }

    assertOpenIdScope(scope);
    assertPkceChallenge(codeChallenge);

    const client = findClient(this.clients, clientId);
    assertRedirectUri(client, redirectUri);

    return {
      accepted: true,
      requiresAuthentication: true,
      responseType: 'code',
      client: {
        clientId,
      },
      redirectUri,
      scope,
      codeChallenge,
      codeChallengeMethod: PKCE_S256,
      ...(state === undefined ? {} : { state }),
    };
  }

  async continueAuthorize(input: unknown): Promise<AuthorizeContinueResult> {
    const inputRecord = toQueryRecord(input);
    const email = readSingleString(inputRecord, 'email');
    const password = readSingleString(inputRecord, 'password');
    const context = this.validateAuthorizeRequest(inputRecord);
    const identity = await this.authBridge.validateCredentials(email, password);
    const issuedAuthorizationCode = await this.issueAuthorizationCode(context, identity.sub);

    const redirectUrl = new URL(context.redirectUri);
    redirectUrl.searchParams.set('code', issuedAuthorizationCode.rawCode);
    if (context.state !== undefined) {
      redirectUrl.searchParams.set('state', context.state);
    }

    return {
      redirectTo: redirectUrl.toString(),
    };
  }

  async exchangeAuthorizationCode(input: unknown): Promise<TokenExchangeResponse> {
    const inputRecord = toQueryRecord(input);
    const grantType = readSingleString(inputRecord, 'grant_type');
    if (grantType !== 'authorization_code') {
      throw invalidInput('grant_type must be authorization_code.');
    }

    const rawAuthorizationCode = readSingleString(inputRecord, 'code');
    const clientId = readSingleString(inputRecord, 'client_id');
    const redirectUri = readSingleString(inputRecord, 'redirect_uri');
    const codeVerifier = readSingleString(inputRecord, 'code_verifier');

    assertAuthorizationCodeFormat(rawAuthorizationCode);
    assertPkceVerifier(codeVerifier);

    const client = findClient(this.clients, clientId);
    assertRedirectUri(client, redirectUri);

    const codeHash = hashValue(rawAuthorizationCode);
    const authorizationCode = await this.authorizationCodeRepository.findByCodeHash(codeHash);
    if (authorizationCode === null) {
      throw invalidGrant();
    }

    const now = this.getNow();
    ensureUnconsumed(authorizationCode);
    ensureNotExpired(authorizationCode, now);
    ensureAuthorizationCodeClientContext(authorizationCode, clientId, redirectUri);
    ensurePkceVerifierMatches(codeVerifier, authorizationCode);

    const consumed = await this.authorizationCodeRepository.consumeAuthorizationCodeAtomic(
      authorizationCode.id,
      now,
    );
    if (consumed === null) {
      throw invalidGrant();
    }

    const issuedAccessToken = this.accessTokenProvider.issueAccessToken();
    return {
      access_token: issuedAccessToken.accessToken,
      token_type: issuedAccessToken.tokenType,
      expires_in: issuedAccessToken.expiresIn,
    };
  }

  private async issueAuthorizationCode(
    context: AuthorizeRequestContext,
    subject: string,
  ): Promise<{ rawCode: string }> {
    const rawCode = randomBytes(AUTHORIZATION_CODE_BYTE_LENGTH).toString('base64url');
    const now = this.getNow();
    const expiresAt = new Date(now.getTime() + AUTHORIZATION_CODE_TTL_MS);
    const codeHash = hashValue(rawCode);

    await this.authorizationCodeRepository.createAuthorizationCodeRecord({
      subject,
      clientId: context.client.clientId,
      redirectUri: context.redirectUri,
      codeHash,
      codeChallenge: context.codeChallenge,
      codeChallengeMethod: context.codeChallengeMethod,
      expiresAt,
    });

    return { rawCode };
  }
}

export const oidcService = new OidcService();
