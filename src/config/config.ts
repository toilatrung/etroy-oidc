import { validatedEnv } from './env.js';

export interface AppConfig {
  app: {
    environment: 'development' | 'test' | 'production';
    port: number;
    isDevelopment: boolean;
    isTest: boolean;
    isProduction: boolean;
  };
  infrastructure: {
    mongodb: {
      uri: string;
    };
    redis: {
      url: string;
    };
  };
}

const environment = validatedEnv.NODE_ENV;

export const config: Readonly<AppConfig> = Object.freeze({
  app: Object.freeze({
    environment,
    port: validatedEnv.PORT,
    isDevelopment: environment === 'development',
    isTest: environment === 'test',
    isProduction: environment === 'production',
  }),
  infrastructure: Object.freeze({
    mongodb: Object.freeze({
      uri: validatedEnv.MONGO_URI,
    }),
    redis: Object.freeze({
      url: validatedEnv.REDIS_URL,
    }),
  }),
});
