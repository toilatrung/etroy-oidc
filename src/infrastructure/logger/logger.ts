import pino, {
  type LevelWithSilent,
  type LevelWithSilentOrString,
  type Logger,
  type LoggerOptions,
} from 'pino';

import { config } from '../../config/config.js';

const LOG_LEVEL_BY_ENVIRONMENT: Readonly<Record<typeof config.app.environment, LevelWithSilent>> =
  Object.freeze({
    development: 'debug',
    test: 'warn',
    production: 'info',
  });

const resolveLogLevel = (): LevelWithSilent => LOG_LEVEL_BY_ENVIRONMENT[config.app.environment];

const BASE_LOGGER_OPTIONS: Readonly<LoggerOptions> = Object.freeze({
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const createLogger = (options: LoggerOptions = {}): Logger => {
  const { level: providedLevel, ...restOptions } = options;
  const level: LevelWithSilentOrString = providedLevel ?? resolveLogLevel();

  return pino({
    ...BASE_LOGGER_OPTIONS,
    ...restOptions,
    level,
  });
};

export const logger: Logger = createLogger();
