export interface IMailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

export interface GraphApiMailServiceConfig {
  tenantId: string;
  senderAddress: string;
}

/**
 * A mail service backed by the Microsoft Graph API. The actual HTTP call is
 * simulated here (there is no real Graph client) to keep the example
 * self-contained and runnable without credentials.
 */
export class GraphApiMailService implements IMailService {
  constructor(private readonly config: GraphApiMailServiceConfig) {}

  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(
      `[GraphApiMailService] Sending as ${this.config.senderAddress} (tenant ${this.config.tenantId})`,
    );
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body: ${body}`);
    await Promise.resolve();
  }
}

/**
 * A no-op mail service, useful for local development or dry runs where you
 * don't want to actually send anything.
 */
export class NoOpMailService implements IMailService {
  async send(to: string, subject: string): Promise<void> {
    console.log(`[NoOpMailService] Would send "${subject}" to ${to} (no-op, nothing sent)`);
    await Promise.resolve();
  }
}
