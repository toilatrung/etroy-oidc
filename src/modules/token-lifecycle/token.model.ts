import mongoose, { type Model } from 'mongoose';

const { model, models, Schema } = mongoose;

export const TOKEN_PURPOSE_EMAIL_VERIFICATION = 'email_verification' as const;

export type TokenPurpose = typeof TOKEN_PURPOSE_EMAIL_VERIFICATION;

export interface TokenDocument {
  userId: string;
  purpose: TokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
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
      enum: [TOKEN_PURPOSE_EMAIL_VERIFICATION],
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
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

tokenSchema.index({ purpose: 1, tokenHash: 1, usedAt: 1, expiresAt: 1 });
tokenSchema.index({ userId: 1, purpose: 1 });

export const TokenModel =
  (models.TokenLifecycle as Model<TokenDocument> | undefined) ??
  model<TokenDocument>('TokenLifecycle', tokenSchema);
