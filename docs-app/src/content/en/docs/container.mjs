export const meta = {
  title: 'Container',
  description:
    'Every method on Container: registerInstance, registerFactory, resolve, has, remove, clear.',
};

export const blocks = [
  {
    type: 'p',
    html: '<code>Container</code> is the only class TinyDI has. An instance owns a set of registrations, keyed by token.',
  },
  { type: 'code', lang: 'ts', code: 'const container = new Container();' },
  { type: 'heading', level: 2, id: 'registerinstance', text: 'registerInstance' },
  {
    type: 'p',
    html: 'Registers an instance you already created. It is always treated as Singleton — every <code>resolve()</code> call returns that exact object.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `const ConfigToken = createToken<Config>('Config');
container.registerInstance(ConfigToken, { apiUrl: 'https://example.com' });`,
  },
  { type: 'heading', level: 2, id: 'registerfactory', text: 'registerFactory' },
  {
    type: 'p',
    html: 'Registers a factory used to build the service lazily, on first resolution. The factory receives the container itself, so it can resolve its own dependencies explicitly.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.registerFactory(
  UserServiceToken,
  (c) => new UserService(c.resolve(UserRepositoryToken)),
);`,
  },
  {
    type: 'p',
    html: 'The third, optional argument is a <a href="/docs/lifetimes.html"><code>ServiceLifetime</code></a> — it defaults to <code>Singleton</code>.',
  },
  { type: 'heading', level: 2, id: 'resolve', text: 'resolve' },
  {
    type: 'p',
    html: 'Resolves the service registered under a token, fully typed with no explicit generic.',
  },
  { type: 'code', lang: 'ts', code: 'const userService = container.resolve(UserServiceToken);' },
  {
    type: 'callout',
    kind: 'warning',
    title: 'Edge cases',
    html: 'Throws <code>ResolutionError</code> if the token was never registered, and <code>CircularDependencyError</code> if resolving it would require resolving itself again — see the <a href="/docs/api-reference.html#errors">API Reference</a> for the exact error shapes.',
  },
  { type: 'heading', level: 2, id: 'has-remove-clear', text: 'has, remove, clear' },
  {
    type: 'p',
    html: 'Manage the registration set directly: <code>has(token)</code> checks whether a token is registered, <code>remove(token)</code> removes a single registration, and <code>clear()</code> removes all of them.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.has(ConfigToken); // true

container.remove(ConfigToken);
container.has(ConfigToken); // false

container.clear(); // removes every registration`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Replacing a registration',
    html: 'Registering an already-registered token throws <code>RegistrationError</code>, on purpose. Call <code>remove()</code> first — this is deliberately useful for swapping in a fake implementation between tests.',
  },
];
