import type { NextFunction, Request, Response } from 'express';

import { oidcService, type AuthorizeRequestContext } from './oidc.service.js';

interface AuthorizeResponseBody {
  data: AuthorizeRequestContext;
}

export const authorizeHandler = (
  request: Request,
  response: Response<AuthorizeResponseBody>,
  next: NextFunction,
): void => {
  try {
    const result = oidcService.validateAuthorizeRequest(request.query);
    response.status(200).json({ data: result });
  } catch (error: unknown) {
    next(error);
  }
};
