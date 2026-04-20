import type { JsonWebKey, KeyObject } from 'node:crypto';

import { loadRsaKeyPair, type KeyLoadOptions } from './keys.js';

export interface JwksRsaKey {
  kty: 'RSA';
  use: 'sig';
  alg: 'RS256';
  kid: string;
  n: string;
  e: string;
}

export interface JsonWebKeySet {
  keys: JwksRsaKey[];
}

const toJwksRsaKey = (publicKey: KeyObject, kid: string): JwksRsaKey => {
  const jwk = publicKey.export({ format: 'jwk' }) as JsonWebKey;

  if (jwk.kty !== 'RSA' || typeof jwk.n !== 'string' || typeof jwk.e !== 'string') {
    throw new Error('Public key is not a valid RSA JWK source.');
  }

  return {
    kty: 'RSA',
    use: 'sig',
    alg: 'RS256',
    kid,
    n: jwk.n,
    e: jwk.e,
  };
};

export const createJwks = (options: KeyLoadOptions = {}): JsonWebKeySet => {
  const keyPair = loadRsaKeyPair(options);

  return {
    keys: [toJwksRsaKey(keyPair.publicKey, keyPair.keyId)],
  };
};
