import { randomBytes } from 'node:crypto';

const DEFAULT_TOKEN_BYTES = 32;

export const generateSecureToken = (size: number = DEFAULT_TOKEN_BYTES): string => {
  if (!Number.isInteger(size) || size < 16) {
    throw new Error('Token size must be an integer greater than or equal to 16 bytes.');
  }

  return randomBytes(size).toString('hex');
};
