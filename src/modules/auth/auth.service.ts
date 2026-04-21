import { verifyHash } from '../../infrastructure/crypto/index.js';
import { BaseError } from '../../shared/errors/index.js';
import {
  userService,
  type UserCredentialIdentity,
  type UserService,
} from '../users/user.service.js';

import { validateLoginInput } from './auth.validator.js';

export interface AuthenticatedIdentity {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  avatar_url?: string;
}

type UserCredentialReader = Pick<UserService, 'getCredentialIdentityByEmail'>;

const invalidCredentials = (): BaseError =>
  new BaseError('Invalid credentials.', {
    code: 'INVALID_CREDENTIALS',
    statusCode: 401,
  });

const toAuthenticatedIdentity = (user: UserCredentialIdentity): AuthenticatedIdentity => {
  const identity: AuthenticatedIdentity = {
    sub: user.sub,
    email: user.email,
    email_verified: user.email_verified,
  };

  if (user.name !== undefined) {
    identity.name = user.name;
  }

  if (user.avatar_url !== undefined) {
    identity.avatar_url = user.avatar_url;
  }

  return identity;
};

export class AuthService {
  constructor(private readonly users: UserCredentialReader = userService) {}

  async validateCredentials(email: unknown, password: unknown): Promise<AuthenticatedIdentity> {
    const input = validateLoginInput({ email, password });
    const user = await this.users.getCredentialIdentityByEmail(input.email);

    if (user === null || !verifyHash(input.password, user.passwordHash)) {
      throw invalidCredentials();
    }

    return toAuthenticatedIdentity(user);
  }
}

export const authService = new AuthService();
