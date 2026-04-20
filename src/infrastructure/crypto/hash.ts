import { createHash, timingSafeEqual } from 'node:crypto';

const HASH_ALGORITHM = 'sha256';

const toDigest = (value: string): string =>
  createHash(HASH_ALGORITHM).update(value, 'utf-8').digest('hex');

const normalizeInput = (value: string): string => {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error('Hash input must be a non-empty string.');
  }
  return normalized;
};

export const hashValue = (value: string): string => {
  const normalized = normalizeInput(value);
  return `${HASH_ALGORITHM}:${toDigest(normalized)}`;
};

export const verifyHash = (value: string, hashedValue: string): boolean => {
  const normalized = normalizeInput(value);
  const parts = hashedValue.split(':');

  if (parts.length !== 2) {
    return false;
  }

  const [algorithm, storedDigest] = parts;
  if (algorithm !== HASH_ALGORITHM || !storedDigest) {
    return false;
  }

  const computedDigest = toDigest(normalized);
  const expectedBuffer = Buffer.from(storedDigest, 'hex');
  const actualBuffer = Buffer.from(computedDigest, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
};
