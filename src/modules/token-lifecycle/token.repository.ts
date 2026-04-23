import mongoose, { type HydratedDocument } from 'mongoose';

import { TokenModel, type TokenDocument, type TokenPurpose } from './token.model.js';

const { isValidObjectId } = mongoose;

export interface TokenEntity {
  id: string;
  userId: string;
  purpose: TokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface CreateTokenRecordInput {
  userId: string;
  purpose: TokenPurpose;
  tokenHash: string;
  expiresAt: Date;
}

const toTokenEntity = (document: HydratedDocument<TokenDocument>): TokenEntity => ({
  id: document._id.toString(),
  userId: document.userId,
  purpose: document.purpose,
  tokenHash: document.tokenHash,
  expiresAt: document.expiresAt,
  usedAt: document.usedAt ?? null,
});

export class TokenRepository {
  async createTokenRecord(input: CreateTokenRecordInput): Promise<TokenEntity> {
    const token = await TokenModel.create({
      userId: input.userId,
      purpose: input.purpose,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      usedAt: null,
    });

    return toTokenEntity(token);
  }

  async findValidTokenByHashAndPurpose(
    tokenHash: string,
    purpose: TokenPurpose,
    now: Date,
  ): Promise<TokenEntity | null> {
    const token = await TokenModel.findOne({
      tokenHash,
      purpose,
      expiresAt: { $gt: now },
      usedAt: null,
    }).exec();

    return token === null ? null : toTokenEntity(token);
  }

  async findTokenByHashAndPurpose(
    tokenHash: string,
    purpose: TokenPurpose,
  ): Promise<TokenEntity | null> {
    const token = await TokenModel.findOne({
      tokenHash,
      purpose,
    }).exec();

    return token === null ? null : toTokenEntity(token);
  }

  async consumeTokenAtomic(tokenId: string, usedAt: Date): Promise<TokenEntity | null> {
    if (!isValidObjectId(tokenId)) {
      return null;
    }

    const token = await TokenModel.findOneAndUpdate(
      { _id: tokenId, usedAt: null },
      { $set: { usedAt } },
      { new: true },
    ).exec();

    return token === null ? null : toTokenEntity(token);
  }
}
