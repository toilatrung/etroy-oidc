import mongoose, { type HydratedDocument } from 'mongoose';

import { TokenModel, type TokenDocument, type TokenPurpose } from './token.model.js';

const { isValidObjectId } = mongoose;

export interface TokenEntity {
  id: string;
  userId: string;
  purpose: TokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
}

export interface CreateTokenRecordInput {
  userId: string;
  purpose: TokenPurpose;
  tokenHash: string;
  expiresAt: Date;
}

const toTokenEntity = (document: HydratedDocument<TokenDocument>): TokenEntity => {
  const token: TokenEntity = {
    id: document._id.toString(),
    userId: document.userId,
    purpose: document.purpose,
    tokenHash: document.tokenHash,
    expiresAt: document.expiresAt,
  };

  if (document.usedAt !== undefined) {
    token.usedAt = document.usedAt;
  }

  return token;
};

export class TokenRepository {
  async createToken(input: CreateTokenRecordInput): Promise<TokenEntity> {
    const token = await TokenModel.create(input);
    return toTokenEntity(token);
  }

  async findByPurposeAndTokenHash(
    purpose: TokenPurpose,
    tokenHash: string,
  ): Promise<TokenEntity | null> {
    const token = await TokenModel.findOne({ purpose, tokenHash }).exec();
    return token === null ? null : toTokenEntity(token);
  }

  async consumeToken(id: string, usedAt: Date = new Date()): Promise<TokenEntity | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const token = await TokenModel.findOneAndUpdate(
      { _id: id, usedAt: null },
      { $set: { usedAt } },
      { new: true },
    ).exec();

    return token === null ? null : toTokenEntity(token);
  }
}
