import { config, type OidcClient } from '../../config/config.js';
import { BaseError } from '../../shared/errors/index.js';
import { authService, type AuthenticatedIdentity } from '../auth/auth.service.js';

export interface AuthorizeRequestContext {
  accepted: true;
  requiresAuthentication: true;
  client: {
    clientId: string;
  };
  redirectUri: string;
}

export type AuthResult = AuthenticatedIdentity;

export interface AuthBridge {
  validateCredentials(email: unknown, password: unknown): Promise<AuthResult>;
}

// Sprint 08 exposes this contract surface only; /authorize must not execute it.
// Credential-validation continuation belongs to later approved flow scope.
export const defaultAuthBridge: AuthBridge = authService;

const PKCE_S256 = 'S256';
const CODE_CHALLENGE_PATTERN = /^[A-Za-z0-9_-]{43,128}$/u;

const invalidInput = (message: string): BaseError =>
  new BaseError(message, {
    code: 'INVALID_INPUT',
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

export class OidcService {
  constructor(private readonly clients: readonly OidcClient[] = config.oidc.clients) {}

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
      client: {
        clientId,
      },
      redirectUri,
    };
  }
}

export const oidcService = new OidcService();
