import mongoose, { type ConnectOptions, type Mongoose } from 'mongoose';

import { config } from '../../config/config.js';

const CONNECT_OPTIONS: Readonly<ConnectOptions> = Object.freeze({
  serverSelectionTimeoutMS: 5000,
});

let connectionPromise: Promise<Mongoose> | null = null;

const formatConnectionError = (error: unknown): Error => {
  const message = error instanceof Error ? error.message : 'Unknown MongoDB connection error.';
  return new Error(`MongoDB connection failed: ${message}`);
};

export const connectDatabase = async (): Promise<Mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise !== null) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(config.infrastructure.mongodb.uri, CONNECT_OPTIONS)
    .catch((error: unknown) => {
      connectionPromise = null;
      throw formatConnectionError(error);
    });

  return connectionPromise;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (connectionPromise === null && mongoose.connection.readyState === 0) {
    return;
  }

  try {
    await mongoose.disconnect();
  } finally {
    connectionPromise = null;
  }
};

export const resetDatabaseConnectionForTest = (): void => {
  connectionPromise = null;
};
