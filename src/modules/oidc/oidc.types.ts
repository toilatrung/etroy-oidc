export interface AccessTokenIssueResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface AccessTokenProvider {
  issueAccessToken(): AccessTokenIssueResult;
}

export interface AuthorizationCodeEntity {
  id: string;
  subject: string;
  clientId: string;
  redirectUri: string;
  codeHash: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  expiresAt: Date;
  usedAt: Date | null;
}

export interface CreateAuthorizationCodeInput {
  subject: string;
  clientId: string;
  redirectUri: string;
  codeHash: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  expiresAt: Date;
}
