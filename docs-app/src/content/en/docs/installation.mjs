export const meta = {
  title: 'Installation',
  description:
    'Install TinyDI, a zero-dependency, type-safe Dependency Injection container for TypeScript.',
};

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI ships as a single ESM package with zero runtime dependencies. Install it with your package manager of choice.',
  },
  { type: 'heading', level: 2, id: 'npm-install', text: 'Install via npm' },
  { type: 'code', lang: 'bash', code: 'npm install tinydi' },
  {
    type: 'p',
    html: 'The same package works with <code>pnpm add tinydi</code>, <code>yarn add tinydi</code>, or <code>bun add tinydi</code> — there is nothing npm-specific about it.',
  },
  { type: 'heading', level: 2, id: 'requirements', text: 'Requirements' },
  {
    type: 'list',
    items: [
      '<strong>Runtime</strong>: Node.js, Bun, Deno, or any modern browser.',
      "<strong>TypeScript</strong>: 6.0 or later, if you consume TinyDI's type declarations. The compiled JavaScript output itself has no TypeScript-version requirement.",
      'No compiler flags to enable. TinyDI works under plain <code>strict</code> TypeScript — no <code>experimentalDecorators</code>, no <code>emitDecoratorMetadata</code>.',
    ],
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Nothing else to install',
    html: 'TinyDI has zero runtime dependencies. After installing it, <code>npm ls tinydi</code> pulls in nothing beyond the package itself.',
  },
  { type: 'heading', level: 2, id: 'module-format', text: 'Module format' },
  {
    type: 'p',
    html: 'TinyDI is distributed as ESM only (<code>"type": "module"</code>), tree-shakable, with a single entry point exporting everything you need: <code>Container</code>, <code>createToken</code>, <code>ServiceLifetime</code>, and the error classes.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: "import { Container, createToken, ServiceLifetime } from 'tinydi';",
  },
];
