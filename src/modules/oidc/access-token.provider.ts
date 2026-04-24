import { randomBytes } from 'node:crypto';

import type { AccessTokenIssueResult, AccessTokenProvider } from './oidc.types.js';

const DEFAULT_ACCESS_TOKEN_TTL_SECONDS = 300;
const ACCESS_TOKEN_BYTE_LENGTH = 32;

export class BaselineAccessTokenProvider implements AccessTokenProvider {
  constructor(
    private readonly expiresInSeconds: number = DEFAULT_ACCESS_TOKEN_TTL_SECONDS,
    private readonly byteLength: number = ACCESS_TOKEN_BYTE_LENGTH,
  ) {}

  issueAccessToken(): AccessTokenIssueResult {
    return {
      accessToken: randomBytes(this.byteLength).toString('base64url'),
      tokenType: 'Bearer',
      expiresIn: this.expiresInSeconds,
    };
  }
}
