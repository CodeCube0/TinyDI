export const meta = {
  title: 'API Reference',
  description:
    'Every public TinyDI API: exact TypeScript signatures, parameters, return types, examples and edge cases.',
};

export const blocks = [
  {
    type: 'p',
    html: "Based directly on TinyDI's implementation — every signature below is real, not illustrative.",
  },

  { type: 'heading', level: 2, id: 'createtoken', text: 'createToken' },
  { type: 'code', lang: 'ts', code: 'function createToken<T>(description: string): Token<T>' },
  {
    type: 'p',
    html: '<strong>Parameters:</strong> <code>description</code> — a human-readable label used in error messages. Does not need to be unique.<br><strong>Returns:</strong> a <code>Token&lt;T&gt;</code>, usable with <code>registerInstance</code>, <code>registerFactory</code> and <code>resolve</code>.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `interface IMailService {
  send(to: string, body: string): Promise<void>;
}

const MailServiceToken = createToken<IMailService>('MailService');`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Edge case',
    html: 'Two tokens created with the same <code>description</code> are still distinct registrations — identity is the underlying <code>symbol</code>, never the description string.',
  },

  { type: 'heading', level: 2, id: 'servicelifetime', text: 'ServiceLifetime' },
  {
    type: 'code',
    lang: 'ts',
    code: `enum ServiceLifetime {
  Singleton,
  Transient,
}`,
  },
  {
    type: 'p',
    html: 'Only these two values exist. <code>Singleton</code> is the default used by <code>registerFactory</code> when no lifetime is given. See <a href="/docs/lifetimes.html">Lifetimes</a> for the full explanation.',
  },

  { type: 'heading', level: 2, id: 'container', text: 'Container' },
  {
    type: 'api-table',
    headers: ['Method', 'Description'],
    rows: [
      [
        '<code>registerInstance&lt;T&gt;(token, instance): void</code>',
        'Registers an already-created instance. Always Singleton.',
      ],
      [
        '<code>registerFactory&lt;T&gt;(token, factory, lifetime?): void</code>',
        'Registers a factory, built lazily. <code>lifetime</code> defaults to Singleton.',
      ],
      ['<code>resolve&lt;T&gt;(token): T</code>', 'Resolves the service, fully typed.'],
      ['<code>has(token): boolean</code>', 'Checks whether a token is registered.'],
      ['<code>remove(token): void</code>', "Removes a token's registration, if present."],
      ['<code>clear(): void</code>', 'Removes every registration.'],
    ],
  },

  { type: 'heading', level: 3, id: 'registerinstance', text: 'registerInstance' },
  {
    type: 'code',
    lang: 'ts',
    code: 'registerInstance<T>(token: Token<T>, instance: T): void',
  },
  {
    type: 'p',
    html: '<strong>Parameters:</strong> <code>token</code> — the service identifier; <code>instance</code> — the value returned on every resolution.<br><strong>Returns:</strong> <code>void</code>.<br><strong>Throws:</strong> <code>RegistrationError</code> if <code>token</code> is already registered.',
  },

  { type: 'heading', level: 3, id: 'registerfactory', text: 'registerFactory' },
  {
    type: 'code',
    lang: 'ts',
    code: 'registerFactory<T>(token: Token<T>, factory: (container: Container) => T, lifetime?: ServiceLifetime): void',
  },
  {
    type: 'p',
    html: '<strong>Parameters:</strong> <code>token</code> — the service identifier; <code>factory</code> — builds the instance, receiving the container so it can resolve its own dependencies; <code>lifetime</code> — <code>Singleton</code> (default) or <code>Transient</code>.<br><strong>Returns:</strong> <code>void</code>.<br><strong>Throws:</strong> <code>RegistrationError</code> if <code>token</code> is already registered.',
  },

  { type: 'heading', level: 3, id: 'resolve', text: 'resolve' },
  { type: 'code', lang: 'ts', code: 'resolve<T>(token: Token<T>): T' },
  {
    type: 'p',
    html: '<strong>Parameters:</strong> <code>token</code> — the service identifier to resolve.<br><strong>Returns:</strong> the resolved instance, typed as <code>T</code>.<br><strong>Throws:</strong> <code>ResolutionError</code> if unregistered; <code>CircularDependencyError</code> if resolving it requires resolving itself again, directly or transitively.',
  },

  { type: 'heading', level: 3, id: 'has-remove-clear', text: 'has / remove / clear' },
  {
    type: 'code',
    lang: 'ts',
    code: `has(token: Token<unknown>): boolean
remove(token: Token<unknown>): void
clear(): void`,
  },
  {
    type: 'p',
    html: '<code>remove</code> on an unregistered token, and <code>clear</code> on an empty container, are both safe no-ops — neither throws.',
  },

  { type: 'heading', level: 2, id: 'errors', text: 'Errors' },
  {
    type: 'p',
    html: 'Every error extends the abstract <code>ContainerError</code>, which carries the involved <code>token</code> (except <code>CircularDependencyError</code>, which additionally exposes the full cycle).',
  },
  {
    type: 'api-table',
    headers: ['Class', 'Thrown when'],
    rows: [
      ['<code>ContainerError</code>', 'Abstract base class. Never thrown directly.'],
      ['<code>RegistrationError</code>', 'Registering a token that is already registered.'],
      ['<code>ResolutionError</code>', 'Resolving a token with no registration.'],
      [
        '<code>CircularDependencyError</code>',
        'Resolving a token that (transitively) depends on itself.',
      ],
    ],
  },
  {
    type: 'p',
    html: '<code>CircularDependencyError</code> exposes the full cycle as <code>.path</code> (an array of the involved tokens) and renders it in <code>.message</code> as:',
  },
  {
    type: 'code',
    lang: 'text',
    noLines: true,
    code: `Circular dependency detected:

A
 -> B
 -> C
 -> A`,
  },
];
