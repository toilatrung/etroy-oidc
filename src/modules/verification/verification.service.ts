import { mailService, type MailService } from '../../infrastructure/mail/index.js';
import { BaseError } from '../../shared/errors/index.js';
import { tokenService, type TokenService } from '../token-lifecycle/token.service.js';
import { userService, type UserProfile, type UserService } from '../users/user.service.js';

const EMAIL_VERIFICATION_PURPOSE = 'email_verification' as const;

export interface VerificationRequestResult {
  status: 'verification_requested' | 'already_verified';
}

type VerificationUsers = Pick<UserService, 'getUserById' | 'markEmailAsVerified'>;

type VerificationTokens = Pick<TokenService, 'generateToken' | 'validateToken' | 'consumeToken'>;

type VerificationMail = Pick<MailService, 'send'>;

const invalidInput = (message: string): BaseError =>
  new BaseError(message, {
    code: 'INVALID_INPUT',
    statusCode: 400,
  });

const requiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string') {
    throw invalidInput(`${fieldName} is required.`);
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    throw invalidInput(`${fieldName} is required.`);
  }

  return normalized;
};

// The docs approve outbound email content with the raw token, but do not define link construction yet.
const buildVerificationEmailText = (rawToken: string): string =>
  [
    'Use this verification token to confirm your email address:',
    rawToken,
    'This token expires and can only be used once.',
  ].join('\n\n');

const verificationRequested = (): VerificationRequestResult => ({
  status: 'verification_requested',
});

const alreadyVerified = (): VerificationRequestResult => ({
  status: 'already_verified',
});

export class VerificationService {
  constructor(
    private readonly users: VerificationUsers = userService,
    private readonly tokens: VerificationTokens = tokenService,
    private readonly mail: VerificationMail = mailService,
  ) {}

  async requestVerification(userId: unknown): Promise<VerificationRequestResult> {
    const normalizedUserId = requiredString(userId, 'userId');
    const user = await this.users.getUserById(normalizedUserId);

    if (user.email_verified) {
      return alreadyVerified();
    }

    const generatedToken = await this.tokens.generateToken(
      normalizedUserId,
      EMAIL_VERIFICATION_PURPOSE,
    );

    await this.mail.send({
      to: user.email,
      subject: 'Verify your email',
      text: buildVerificationEmailText(generatedToken.rawToken),
    });

    return verificationRequested();
  }

  async verifyEmail(token: unknown): Promise<UserProfile> {
    const normalizedToken = requiredString(token, 'token');
    const validatedToken = await this.tokens.validateToken(
      normalizedToken,
      EMAIL_VERIFICATION_PURPOSE,
    );
    const user = await this.users.markEmailAsVerified(validatedToken.userId);

    await this.tokens.consumeToken(validatedToken.tokenId);

    return user;
  }
}

export const verificationService = new VerificationService();
