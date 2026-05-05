import { createVerify, sign as rsaSign } from 'node:crypto';

import { loadRsaKeyPair, type KeyLoadOptions } from './keys.js';

export interface JwtHeader {
  alg: 'RS256';
  typ: 'JWT';
  kid: string;
}

export type JwtPayload = Record<string, unknown>;

export interface VerifiedJwt {
  header: JwtHeader;
  payload: JwtPayload;
}

const invalidJwt = (message: string): never => {
  throw new Error(`Invalid JWT: ${message}`);
};

const parseJwtPartJson = <T>(value: string, label: string): T => {
  try {
    const decoded = Buffer.from(value, 'base64url').toString('utf8');
    return JSON.parse(decoded) as T;
  } catch {
    return invalidJwt(`${label} is not valid base64url JSON.`);
  }
};

const toCompactJsonBase64Url = (value: unknown): string =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

const parseHeader = (value: unknown): JwtHeader => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return invalidJwt('header must be an object.');
  }

  const header = value as Record<string, unknown>;
  const { alg, typ, kid } = header;

  if (alg !== 'RS256') {
    return invalidJwt('alg must be RS256.');
  }

  if (typ !== 'JWT') {
    return invalidJwt('typ must be JWT.');
  }

  if (typeof kid !== 'string' || kid.length === 0) {
    return invalidJwt('kid is required.');
  }

  return {
    alg,
    typ,
    kid,
  };
};

const parsePayload = (value: unknown): JwtPayload => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return invalidJwt('payload must be an object.');
  }

  return value as JwtPayload;
};

export const signJwtRs256 = (payload: JwtPayload, options: KeyLoadOptions = {}): string => {
  const { privateKey, keyId } = loadRsaKeyPair(options);

  const header: JwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
    kid: keyId,
  };

  const encodedHeader = toCompactJsonBase64Url(header);
  const encodedPayload = toCompactJsonBase64Url(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = rsaSign('RSA-SHA256', Buffer.from(signingInput, 'utf8'), privateKey);

  return `${signingInput}.${signature.toString('base64url')}`;
};

export const verifyJwtRs256 = (token: string, options: KeyLoadOptions = {}): VerifiedJwt => {
  if (typeof token !== 'string' || token.length === 0) {
    return invalidJwt('token is required.');
  }

  const segments = token.split('.');
  if (segments.length !== 3) {
    return invalidJwt('token must have exactly 3 segments.');
  }

  const [encodedHeader, encodedPayload, encodedSignature] = segments as [string, string, string];
  if (encodedHeader.length === 0 || encodedPayload.length === 0 || encodedSignature.length === 0) {
    return invalidJwt('token segments must not be empty.');
  }

  const header = parseHeader(parseJwtPartJson<unknown>(encodedHeader, 'header'));
  const payload = parsePayload(parseJwtPartJson<unknown>(encodedPayload, 'payload'));
  const { publicKey, keyId } = loadRsaKeyPair(options);

  if (header.kid !== keyId) {
    return invalidJwt('kid does not match active key.');
  }

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = Buffer.from(encodedSignature, 'base64url');
  const verifier = createVerify('RSA-SHA256');
  verifier.update(signingInput, 'utf8');
  verifier.end();

  const isValid = verifier.verify(publicKey, signature);
  if (!isValid) {
    return invalidJwt('signature verification failed.');
  }

  return {
    header,
    payload,
  };
};
