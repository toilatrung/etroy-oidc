import Redis, { type RedisOptions } from 'ioredis';

import { config } from '../../config/config.js';

const REDIS_OPTIONS: Readonly<RedisOptions> = Object.freeze({
  lazyConnect: true,
  maxRetriesPerRequest: 0,
  enableOfflineQueue: false,
  connectTimeout: 5000,
});

let redisClient: Redis | null = null;
let initializationPromise: Promise<Redis> | null = null;
let isInitialized = false;

const formatRedisError = (error: unknown): Error => {
  const message = error instanceof Error ? error.message : 'Unknown Redis initialization error.';
  return new Error(`Redis initialization failed: ${message}`);
};

const createClient = (): Redis => new Redis(config.infrastructure.redis.url, REDIS_OPTIONS);

export const getRedisClient = async (): Promise<Redis> => {
  if (redisClient !== null && isInitialized) {
    return redisClient;
  }

  if (initializationPromise !== null) {
    return initializationPromise;
  }

  if (redisClient === null) {
    redisClient = createClient();
  }

  initializationPromise = (async () => {
    if (redisClient === null) {
      throw new Error('Redis client is unavailable during initialization.');
    }

    try {
      await redisClient.connect();
      await redisClient.ping();
      isInitialized = true;
      return redisClient;
    } catch (error: unknown) {
      redisClient.disconnect();
      redisClient = null;
      isInitialized = false;
      throw formatRedisError(error);
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
};

export const disconnectRedisClient = async (): Promise<void> => {
  if (redisClient === null) {
    return;
  }

  try {
    if (isInitialized) {
      await redisClient.quit();
    } else {
      redisClient.disconnect();
    }
  } finally {
    redisClient = null;
    initializationPromise = null;
    isInitialized = false;
  }
};

export const resetRedisClientForTest = (): void => {
  if (redisClient !== null) {
    redisClient.disconnect();
  }

  redisClient = null;
  initializationPromise = null;
  isInitialized = false;
};
