import mongoose, { type Model } from 'mongoose';

const { model, models, Schema } = mongoose;

export const TOKEN_PURPOSES = ['email_verification', 'password_reset'] as const;

export type TokenPurpose = (typeof TOKEN_PURPOSES)[number];

export interface TokenDocument {
  userId: string;
  purpose: TokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
}

const tokenSchema = new Schema<TokenDocument>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: TOKEN_PURPOSES,
    },
    tokenHash: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

tokenSchema.index({ purpose: 1, tokenHash: 1 }, { unique: true });
tokenSchema.index({ userId: 1, purpose: 1 });
tokenSchema.index({ expiresAt: 1 });

export const TokenModel =
  (models.LifecycleToken as Model<TokenDocument> | undefined) ??
  model<TokenDocument>('LifecycleToken', tokenSchema);
