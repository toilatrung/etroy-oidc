import { createHash, createPrivateKey, createPublicKey, type KeyObject } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_KEYS_DIRECTORY = resolve(process.cwd(), 'keys');
const PRIVATE_KEY_FILE_NAME = 'private.pem';
const PUBLIC_KEY_FILE_NAME = 'public.pem';

export interface KeyLoadOptions {
  keysDirectory?: string;
}

export interface RsaKeyPair {
  privateKeyPem: string;
  publicKeyPem: string;
  privateKey: KeyObject;
  publicKey: KeyObject;
  keyId: string;
}

const resolveKeysDirectory = (options: KeyLoadOptions = {}): string =>
  options.keysDirectory ?? DEFAULT_KEYS_DIRECTORY;

const readPemFile = (path: string, label: string): string => {
  try {
    const content = readFileSync(path, 'utf-8').trim();
    if (content.length === 0) {
      throw new Error(`${label} is empty.`);
    }
    return content;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown file read error.';
    throw new Error(`Failed to read ${label}: ${message}`);
  }
};

const toBase64Url = (buffer: Buffer): string =>
  buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

export const loadPrivateKeyPem = (options: KeyLoadOptions = {}): string => {
  const keysDirectory = resolveKeysDirectory(options);
  return readPemFile(resolve(keysDirectory, PRIVATE_KEY_FILE_NAME), PRIVATE_KEY_FILE_NAME);
};

export const loadPublicKeyPem = (options: KeyLoadOptions = {}): string => {
  const keysDirectory = resolveKeysDirectory(options);
  return readPemFile(resolve(keysDirectory, PUBLIC_KEY_FILE_NAME), PUBLIC_KEY_FILE_NAME);
};

export const deriveKeyIdFromPublicKey = (publicKey: KeyObject): string => {
  const der = publicKey.export({ type: 'spki', format: 'der' }) as Buffer;
  const digest = createHash('sha256').update(der).digest();
  return toBase64Url(digest);
};

export const loadRsaKeyPair = (options: KeyLoadOptions = {}): RsaKeyPair => {
  const privateKeyPem = loadPrivateKeyPem(options);
  const publicKeyPem = loadPublicKeyPem(options);

  try {
    const privateKey = createPrivateKey(privateKeyPem);
    const publicKey = createPublicKey(publicKeyPem);
    const keyId = deriveKeyIdFromPublicKey(publicKey);

    return {
      privateKeyPem,
      publicKeyPem,
      privateKey,
      publicKey,
      keyId,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown RSA parse error.';
    throw new Error(`Failed to load RSA key material: ${message}`);
  }
};
