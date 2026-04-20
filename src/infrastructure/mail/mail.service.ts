export interface MailSendRequest {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface MailSendResult {
  messageId: string;
  accepted: string[];
}

export interface MailProvider {
  send(request: MailSendRequest): Promise<MailSendResult>;
}

const ensureRecipient = (recipient: string): string => {
  const normalized = recipient.trim();
  if (normalized.length === 0) {
    throw new Error('Mail recipient is required.');
  }
  return normalized;
};

export class PlaceholderMailProvider implements MailProvider {
  async send(request: MailSendRequest): Promise<MailSendResult> {
    const to = ensureRecipient(request.to);

    return {
      messageId: `placeholder-${Date.now()}`,
      accepted: [to],
    };
  }
}

export class MailService {
  constructor(private provider: MailProvider) {}

  setProvider(provider: MailProvider): void {
    this.provider = provider;
  }

  getProvider(): MailProvider {
    return this.provider;
  }

  send(request: MailSendRequest): Promise<MailSendResult> {
    return this.provider.send(request);
  }
}

export const createMailService = (provider: MailProvider = new PlaceholderMailProvider()): MailService =>
  new MailService(provider);

export const mailService = createMailService();
