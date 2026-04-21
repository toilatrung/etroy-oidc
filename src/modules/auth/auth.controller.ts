import type { NextFunction, Request, Response } from 'express';

import { authService, type AuthenticatedIdentity } from './auth.service.js';
import { validateLoginInput, type LoginInput } from './auth.validator.js';

interface AuthResponseBody {
  data: AuthenticatedIdentity;
}

const sendAuthenticatedIdentity = (
  response: Response<AuthResponseBody>,
  identity: AuthenticatedIdentity,
): void => {
  response.status(200).json({ data: identity });
};

export const loginHandler = async (
  request: Request<Record<string, never>, AuthResponseBody, LoginInput>,
  response: Response<AuthResponseBody>,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = validateLoginInput(request.body);
    const identity = await authService.validateCredentials(input.email, input.password);
    sendAuthenticatedIdentity(response, identity);
  } catch (error: unknown) {
    next(error);
  }
};
