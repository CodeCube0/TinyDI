export const meta = {
  title: 'Lifetimes',
  description: 'Singleton vs. Transient in TinyDI, and when to reach for each.',
};

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI supports exactly two lifetimes, via the <code>ServiceLifetime</code> enum. There is no third option, and no automatic detection — you state the lifetime you want.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `enum ServiceLifetime {
  Singleton,
  Transient,
}`,
  },
  { type: 'heading', level: 2, id: 'singleton', text: 'Singleton' },
  {
    type: 'p',
    html: 'The default. The first time a token is resolved, its factory runs once; every later <code>resolve()</code> call for the same token returns that same instance.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.registerFactory(ClockToken, () => new SystemClock()); // Singleton by default

container.resolve(ClockToken) === container.resolve(ClockToken); // true`,
  },
  {
    type: 'p',
    html: '<code>registerInstance</code> is always Singleton — you are handing the container an instance that already exists, so there is nothing else it could be.',
  },
  { type: 'heading', level: 2, id: 'transient', text: 'Transient' },
  {
    type: 'p',
    html: 'A new instance is created on every <code>resolve()</code> call.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.registerFactory(RequestIdToken, () => crypto.randomUUID(), ServiceLifetime.Transient);

container.resolve(RequestIdToken) === container.resolve(RequestIdToken); // false`,
  },
  { type: 'heading', level: 2, id: 'choosing', text: 'Choosing between them' },
  {
    type: 'list',
    items: [
      'Default to <strong>Singleton</strong> for stateless services and shared resources (repositories, HTTP clients, loggers).',
      'Reach for <strong>Transient</strong> only when each resolution genuinely needs a fresh instance — a per-operation identifier, a builder object that accumulates state during one use.',
    ],
  },
  {
    type: 'callout',
    kind: 'warning',
    title: 'No Scoped lifetime yet',
    html: 'This version deliberately ships only Singleton and Transient. A future <code>Scoped</code> lifetime (per-request instances) is a natural extension the design does not preclude, but it is not part of the current API.',
  },
];
