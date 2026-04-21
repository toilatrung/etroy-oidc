import { z } from 'zod';

import { BaseError } from '../../shared/errors/index.js';

export interface LoginInput {
  email: string;
  password: string;
}

const loginInputSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().refine((value) => value.trim().length > 0),
  })
  .strict();

const invalidLoginInput = (): BaseError =>
  new BaseError('Invalid login input.', {
    code: 'INVALID_INPUT',
    statusCode: 400,
  });

export const validateLoginInput = (input: unknown): LoginInput => {
  const parsed = loginInputSchema.safeParse(input);

  if (!parsed.success) {
    throw invalidLoginInput();
  }

  return parsed.data;
};
