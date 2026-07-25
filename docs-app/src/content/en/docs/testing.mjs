export const meta = {
  title: 'Testing',
  description:
    'How to swap a real dependency for a fake in tests — plain TypeScript, no mocking framework, no TinyDI-specific test API.',
};

const freshContainerExample = `import { Container, createToken } from 'tinydi-container';

interface IMailService {
  send(to: string, body: string): Promise<void>;
}

const MailServiceToken = createToken<IMailService>('MailService');

class FakeMailService implements IMailService {
  sent: { to: string; body: string }[] = [];
  async send(to: string, body: string): Promise<void> {
    this.sent.push({ to, body });
  }
}

let container: Container;
let mail: FakeMailService;

beforeEach(() => {
  container = new Container();
  mail = new FakeMailService();
  container.registerInstance(MailServiceToken, mail);
});

test('sends a welcome email on signup', async () => {
  await onSignup(container, 'user@example.com');
  expect(mail.sent).toHaveLength(1);
});`;

const swapMidTestExample = `// Later in the same test file, a different test needs the real
// implementation to fail so it can assert on the error path:
container.remove(MailServiceToken);
container.registerInstance(MailServiceToken, new FailingMailService());`;

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI has no test-specific API, and does not need one. Registration and resolution are ordinary method calls, so testing looks like ordinary TypeScript: build a container, register a fake instead of the real implementation, resolve, assert.',
  },
  { type: 'heading', level: 2, id: 'fresh-container-per-test', text: 'A fresh container per test' },
  {
    type: 'p',
    html: "A Singleton's cached instance lives on the <code>Container</code> it was built from, not in a global. Creating a new <code>Container</code> in each test's setup is enough to guarantee no state leaks between tests — there is no <code>reset()</code> step to remember.",
  },
  { type: 'code', lang: 'ts', code: freshContainerExample },
  {
    type: 'callout',
    kind: 'tip',
    title: 'No mocking library needed',
    html: 'A fake is just a plain class or object implementing the same interface — TypeScript checks it structurally at compile time, exactly like the real implementation. There is nothing to import beyond <code>tinydi-container</code> itself.',
  },
  { type: 'heading', level: 2, id: 'swapping-mid-test', text: 'Swapping a fake mid-test' },
  {
    type: 'p',
    html: '<a href="container.html#has-remove-clear"><code>remove()</code></a> exists specifically for this: registering an already-registered token throws <code>RegistrationError</code>, on purpose, so call <code>remove()</code> first before re-registering it with a different fake.',
  },
  { type: 'code', lang: 'ts', code: swapMidTestExample },
  { type: 'heading', level: 2, id: 'what-this-does-not-cover', text: 'What this does not cover' },
  {
    type: 'p',
    html: "TinyDI does not provide spies, call-count assertions, or automatic mock generation. Pair it with your test runner's own assertion library (Vitest's <code>expect</code>, Jest's <code>expect</code>, or similar) for that — a fake registered via <code>registerInstance</code> is a plain object, so any assertion library works against it unchanged.",
  },
];
