import type { NextFunction, Request, Response } from 'express';

import { verificationService, type VerificationRequestResult } from './verification.service.js';
import type { UserProfile } from '../users/user.service.js';

interface VerificationRequestBody {
  userId?: unknown;
}

interface VerificationConfirmBody {
  token?: unknown;
}

interface VerificationRequestResponseBody {
  data: VerificationRequestResult;
}

interface VerificationConfirmResponseBody {
  data: UserProfile;
}

export const requestVerificationHandler = async (
  request: Request<Record<string, never>, VerificationRequestResponseBody, VerificationRequestBody>,
  response: Response<VerificationRequestResponseBody>,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await verificationService.requestVerification(request.body?.userId);
    response.status(200).json({ data: result });
  } catch (error: unknown) {
    next(error);
  }
};

export const confirmVerificationHandler = async (
  request: Request<Record<string, never>, VerificationConfirmResponseBody, VerificationConfirmBody>,
  response: Response<VerificationConfirmResponseBody>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await verificationService.verifyEmail(request.body?.token);
    response.status(200).json({ data: user });
  } catch (error: unknown) {
    next(error);
  }
};
