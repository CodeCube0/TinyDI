export const meta = {
  title: 'Quick Start',
  description:
    'Register your first service and resolve it — the entire TinyDI mental model in one page.',
};

const fullExample = `import { Container, createToken, ServiceLifetime } from 'tinydi';

interface IClock {
  now(): Date;
}

class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}

const ClockToken = createToken<IClock>('Clock');

const container = new Container();
container.registerFactory(ClockToken, () => new SystemClock(), ServiceLifetime.Singleton);

const clock = container.resolve(ClockToken);
console.log(clock.now());`;

export const blocks = [
  {
    type: 'p',
    html: 'There is no hidden step in TinyDI. This page is the entire mental model: create a container, register a service, resolve it.',
  },
  { type: 'heading', level: 2, id: 'the-example', text: 'The example' },
  { type: 'code', lang: 'ts', code: fullExample },
  { type: 'heading', level: 2, id: 'what-is-happening', text: 'What is happening here' },
  {
    type: 'list',
    ordered: true,
    items: [
      "<code>createToken&lt;IClock&gt;('Clock')</code> creates a type-safe identifier. The generic <code>&lt;IClock&gt;</code> is the only place the type is written down — everything downstream infers it.",
      '<code>container.registerFactory(...)</code> tells the container how to build the service, lazily, the first time it is asked for. <code>ServiceLifetime.Singleton</code> is the default and could be omitted here.',
      '<code>container.resolve(ClockToken)</code> returns the service, typed as <code>IClock</code> with no explicit generic.',
    ],
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'No decorators, no reflection',
    html: 'Every wiring decision above is an ordinary function call you can <code>Cmd+Click</code> through. Nothing here relies on <code>reflect-metadata</code>, and there is no compiler flag to enable.',
  },
  { type: 'heading', level: 2, id: 'next-steps', text: 'Next steps' },
  {
    type: 'example-grid',
    items: [
      {
        title: 'Tokens',
        description:
          'How the type-safe token system works, and why identity is a symbol, not a string.',
        href: '/docs/tokens.html',
        cta: 'Read Tokens',
      },
      {
        title: 'Container',
        description:
          'Every method on Container: registerInstance, registerFactory, resolve, has, remove, clear.',
        href: '/docs/container.html',
        cta: 'Read Container',
      },
      {
        title: 'Lifetimes',
        description: 'Singleton vs. Transient, and when to reach for each.',
        href: '/docs/lifetimes.html',
        cta: 'Read Lifetimes',
      },
    ],
  },
];
