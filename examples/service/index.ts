import { Container, createToken } from 'tinydi-container';
import { GraphApiMailService, NoOpMailService, type IMailService } from './mail-service.js';

const MailServiceToken = createToken<IMailService>('MailService');

async function withRegisterFactory(): Promise<void> {
  console.log('--- registerFactory (production-like: built lazily, config-driven) ---');
  const container = new Container();

  container.registerFactory(
    MailServiceToken,
    () =>
      new GraphApiMailService({
        tenantId: 'contoso.onmicrosoft.com',
        senderAddress: 'notifications@contoso.com',
      }),
  );

  const mailService = container.resolve(MailServiceToken);
  await mailService.send('user@example.com', 'Welcome!', 'Thanks for signing up.');
}

async function withRegisterInstance(): Promise<void> {
  console.log('--- registerInstance (dry-run mode: instance created upfront) ---');
  const container = new Container();

  container.registerInstance(MailServiceToken, new NoOpMailService());

  const mailService = container.resolve(MailServiceToken);
  await mailService.send('user@example.com', 'Welcome!', 'Thanks for signing up.');
}

await withRegisterFactory();
await withRegisterInstance();
