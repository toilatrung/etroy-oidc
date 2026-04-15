import dotenv from 'dotenv';
import { env as processEnv } from 'node:process';
import type { ZodIssue } from 'zod';

import { envSchema, type EnvSchema } from './schema.js';

class ConfigValidationError extends Error {
  constructor(issues: ZodIssue[]) {
    const details = issues
      .map((issue) => {
        const variableName = issue.path.length > 0 ? issue.path.join('.') : '<root>';
        return `- ${variableName}: ${issue.message}`;
      })
      .join('\n');

    super(
      [
        'Configuration validation failed.',
        'Fix these environment variables before starting the application:',
        details,
      ].join('\n'),
    );
    this.name = 'ConfigValidationError';
  }
}

let isLoaded = false;

const loadRawEnvironment = (): Record<string, string | undefined> => {
  if (!isLoaded) {
    const loadResult = dotenv.config();
    if (loadResult.error) {
      throw new Error(
        `Configuration bootstrap failed: unable to load .env file (${loadResult.error.message}).`,
      );
    }
    isLoaded = true;
  }

  return processEnv;
};

const parseValidatedEnv = (): EnvSchema => {
  const parseResult = envSchema.safeParse(loadRawEnvironment());

  if (!parseResult.success) {
    throw new ConfigValidationError(parseResult.error.issues);
  }

  return parseResult.data;
};

export const validatedEnv = Object.freeze(parseValidatedEnv());
