export const meta = {
  title: 'Designing type-safe tokens without explicit generics',
  description:
    'How createToken<T> lets container.resolve(token) infer the exact service type, using a phantom type that never exists at runtime.',
};

export const blocks = [
  {
    type: 'p',
    html: 'A DI container needs some way to identify a service. String keys are the obvious choice, and the easiest to get wrong: two unrelated modules can pick the same string for two different things, and a typo in the string surfaces as a runtime error instead of a compile error.',
  },
  {
    type: 'p',
    html: 'TinyDI uses <strong>tokens</strong> instead. The interesting part is not that tokens exist — plenty of containers have some notion of a token. It is how a TinyDI token lets <code>resolve()</code> know the exact return type, without you ever writing <code>resolve&lt;IMailService&gt;(token)</code>.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-problem',
    text: 'The problem: inferring T with no explicit generic',
  },
  {
    type: 'p',
    html: 'The goal was for this to just work, with the type on the right entirely inferred from <code>MailServiceToken</code>:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `// No explicit generic needed — inferred as IMailService.
const mailService = container.resolve(MailServiceToken);`,
  },
  {
    type: 'p',
    html: 'That means the token itself has to carry <code>IMailService</code> somehow, at the type level, even though at runtime a token is just an identifier — there is nothing to "carry" once the program is actually running.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-token-shape',
    text: 'The token shape: symbol identity, phantom type',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `export interface Token<T> {
  readonly symbol: symbol;
  readonly description: string;
  readonly __type?: T;
}

export function createToken<T>(description: string): Token<T> {
  return {
    symbol: Symbol(description),
    description,
  };
}`,
  },
  {
    type: 'p',
    html: '<code>__type</code> is the whole trick: it is declared in the interface purely for the type checker, marked optional, and <strong>never assigned in the implementation</strong>. <code>createToken</code> returns an object with only <code>symbol</code> and <code>description</code> — no <code>__type</code> property exists on the actual runtime object. TypeScript still uses it to carry <code>T</code> through the type, which is exactly what lets <code>resolve(token: Token&lt;T&gt;): T</code> infer the right return type from whatever token you pass it.',
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'A detail that almost snuck in',
    html: "The first working version of <code>createToken</code> cast its return value explicitly as <code>Token&lt;T&gt;</code>. ESLint's <code>no-unnecessary-type-assertion</code> rule flagged it: the object literal <code>{ symbol, description }</code> is already structurally assignable to <code>Token&lt;T&gt;</code>, because <code>__type</code> is optional. The cast was pure noise — deleting it changed nothing about what the type checker accepts.",
  },
  {
    type: 'heading',
    level: 2,
    id: 'symbol-not-string',
    text: 'Identity is the symbol, not the description',
  },
  {
    type: 'p',
    html: '<code>description</code> is a plain string, used only as a human-readable label in error messages ("No registration found for token ..."). It is never used as a lookup key. The container maps registrations by <code>token.symbol</code>, so two tokens created with the same description are still two distinct registrations:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `const a = createToken<string>('name');
const b = createToken<string>('name');
a.symbol !== b.symbol; // true — distinct tokens, no collision`,
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'Consequences' },
  {
    type: 'p',
    html: 'This rules out an entire category of bug that string-keyed containers have to work around by convention (namespacing keys, linting for duplicates): here it is structurally impossible for two unrelated <code>createToken</code> calls to collide, because JavaScript guarantees every <code>Symbol()</code> call produces a unique value.',
  },
  {
    type: 'p',
    html: 'The cost is close to zero — one extra allocation per token, created once at module load time, not per resolution. That is a rare shape for a trade-off: usually a stronger guarantee costs you something, in runtime overhead or in ergonomics, and here neither cost applies.',
  },
  {
    type: 'p',
    html: 'This was one of two spots in the core library that needed actual design work instead of an obvious default — the token shape here, and figuring out, after a cycle is detected, how to <a href="detecting-circular-dependencies.html">explain it back to a developer</a>.',
  },
];
