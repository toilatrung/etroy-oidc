export interface BaseErrorMetadata {
  [key: string]: unknown;
}

export interface BaseErrorShape {
  name: string;
  code: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
  metadata: BaseErrorMetadata;
}

export interface BaseErrorOptions {
  code?: string;
  statusCode?: number;
  isOperational?: boolean;
  metadata?: BaseErrorMetadata;
}

const DEFAULT_CODE = 'INTERNAL_ERROR';
const DEFAULT_STATUS_CODE = 500;

export class BaseError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly metadata: BaseErrorMetadata;

  constructor(message: string, options: BaseErrorOptions = {}) {
    super(message);

    this.name = 'BaseError';
    this.code = options.code ?? DEFAULT_CODE;
    this.statusCode = options.statusCode ?? DEFAULT_STATUS_CODE;
    this.isOperational = options.isOperational ?? true;
    this.metadata = Object.freeze({ ...(options.metadata ?? {}) });
  }

  toJSON(): BaseErrorShape {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      metadata: this.metadata,
    };
  }

  static isBaseError(value: unknown): value is BaseError {
    return value instanceof BaseError;
  }
}
