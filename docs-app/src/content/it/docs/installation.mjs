export const meta = {
  title: 'Installazione',
  description:
    'Installa TinyDI, un container di Dependency Injection type-safe per TypeScript, senza dipendenze.',
};

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI viene distribuito come un unico pacchetto ESM con zero dipendenze a runtime. Installalo con il package manager che preferisci.',
  },
  { type: 'heading', level: 2, id: 'npm-install', text: 'Installazione via npm' },
  { type: 'code', lang: 'bash', code: 'npm install tinydi' },
  {
    type: 'p',
    html: "Lo stesso pacchetto funziona con <code>pnpm add tinydi</code>, <code>yarn add tinydi</code> o <code>bun add tinydi</code> — non c'è nulla di specifico per npm.",
  },
  { type: 'heading', level: 2, id: 'requirements', text: 'Requisiti' },
  {
    type: 'list',
    items: [
      '<strong>Runtime</strong>: Node.js, Bun, Deno o qualsiasi browser moderno.',
      '<strong>TypeScript</strong>: 6.0 o superiore, se consumi le dichiarazioni di tipo di TinyDI. Il JavaScript compilato in sé non ha alcun requisito di versione TypeScript.',
      'Nessun flag del compilatore da abilitare. TinyDI funziona con TypeScript <code>strict</code> puro — niente <code>experimentalDecorators</code>, niente <code>emitDecoratorMetadata</code>.',
    ],
  },
  {
    type: 'callout',
    kind: 'tip',
    title: "Nient'altro da installare",
    html: 'TinyDI ha zero dipendenze a runtime. Dopo averlo installato, <code>npm ls tinydi</code> non porta nulla oltre al pacchetto stesso.',
  },
  { type: 'heading', level: 2, id: 'module-format', text: 'Formato dei moduli' },
  {
    type: 'p',
    html: 'TinyDI viene distribuito solo come ESM (<code>"type": "module"</code>), tree-shakable, con un unico entry point che esporta tutto ciò che serve: <code>Container</code>, <code>createToken</code>, <code>ServiceLifetime</code> e le classi di errore.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: "import { Container, createToken, ServiceLifetime } from 'tinydi';",
  },
];
