export const meta = {
  title: 'Tokens',
  description:
    "How TinyDI's type-safe token system works, and why identity is a symbol, not a string.",
};

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI identifies services with <strong>tokens</strong>, not with strings or classes. A token is created once, and used both to register a service and to resolve it.',
  },
  { type: 'heading', level: 2, id: 'creating-a-token', text: 'Creating a token' },
  {
    type: 'code',
    lang: 'ts',
    code: `interface IMailService {
  send(to: string, body: string): Promise<void>;
}

const MailServiceToken = createToken<IMailService>('MailService');`,
  },
  {
    type: 'p',
    html: '<code>createToken&lt;T&gt;(description)</code> returns a <code>Token&lt;T&gt;</code>. The <code>description</code> string is a human-readable label used only in error messages — it does not need to be unique.',
  },
  { type: 'heading', level: 2, id: 'symbol-identity', text: 'Why a symbol, not a string' },
  {
    type: 'p',
    html: 'Every token wraps a unique JavaScript <code>symbol</code> as its real identity. Two tokens created with the same description are still two distinct registrations:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `const a = createToken<string>('Name');
const b = createToken<string>('Name');

a.symbol !== b.symbol; // true — distinct tokens, no collision`,
  },
  {
    type: 'p',
    html: 'This rules out an entire category of bugs that string-keyed containers have to work around: two unrelated modules accidentally choosing the same string identifier for different services.',
  },
  { type: 'heading', level: 2, id: 'type-inference', text: 'Type inference without generics' },
  {
    type: 'p',
    html: 'The service type <code>T</code> is carried by the token itself, through an optional <code>__type?: T</code> property that exists only at the type level — it is never assigned or read at runtime. Because of it, <code>container.resolve(token)</code> infers the exact return type automatically:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `// No explicit generic needed — inferred as IMailService.
const mailService = container.resolve(MailServiceToken);`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Type your token with an interface',
    html: 'Always parameterize <code>createToken</code> with an interface (<code>IMailService</code>), not a concrete class. Code that depends on <code>MailServiceToken</code> should never need to import the concrete implementation behind it.',
  },
];
