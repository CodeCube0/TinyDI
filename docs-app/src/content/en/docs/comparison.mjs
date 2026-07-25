export const meta = {
  title: 'Comparison',
  description: 'How TinyDI compares to TSyringe, InversifyJS, and a hand-rolled composition root.',
};

export const blocks = [
  {
    type: 'p',
    html: 'Most DI containers in the TypeScript ecosystem lean on <code>reflect-metadata</code> and decorators for automatic dependency discovery. TinyDI takes the opposite stance — here is exactly how that trade-off compares.',
  },
  { type: 'heading', level: 2, id: 'tsyringe', text: 'TinyDI vs. TSyringe' },
  {
    type: 'compare-table',
    headers: ['', 'TinyDI', 'TSyringe'],
    rows: [
      [
        'Dependency discovery',
        'Explicit, via factories',
        'Automatic, via decorators + reflect-metadata',
      ],
      ['Decorators required', 'No', 'Yes (@injectable, @inject, ...)'],
      ['Compiler flags required', 'None', 'experimentalDecorators, emitDecoratorMetadata'],
      ['Runtime dependencies', 'None', 'reflect-metadata'],
      ['Token identity', 'symbol-backed Token&lt;T&gt;', 'String tokens or classes'],
      [
        'Lifetimes',
        'Singleton, Transient',
        'Singleton, Transient, ResolutionScoped, ContainerScoped',
      ],
    ],
  },
  {
    type: 'p',
    html: "TSyringe is a great choice if you want automatic constructor injection and don't mind decorators and <code>reflect-metadata</code> in your project. TinyDI trades that convenience for explicitness and a smaller surface area.",
  },
  { type: 'heading', level: 2, id: 'inversifyjs', text: 'TinyDI vs. InversifyJS' },
  {
    type: 'compare-table',
    headers: ['', 'TinyDI', 'InversifyJS'],
    rows: [
      [
        'Dependency discovery',
        'Explicit, via factories',
        'Automatic, via decorators + reflect-metadata',
      ],
      ['Decorators required', 'No', 'Yes (@injectable, @inject, ...)'],
      ['Compiler flags required', 'None', 'experimentalDecorators, emitDecoratorMetadata'],
      ['Runtime dependencies', 'None', 'reflect-metadata'],
      [
        'Concepts to learn',
        'Token, Container, ServiceLifetime',
        'Containers, modules, bindings, scopes, middleware',
      ],
      ['Lifetimes', 'Singleton, Transient', 'Singleton, Transient, Request, custom scopes'],
    ],
  },
  {
    type: 'p',
    html: 'InversifyJS offers a much larger feature set (modules, middleware, multi-injection, tagging) at the cost of a larger API surface and a runtime dependency on reflection. TinyDI intentionally covers a much smaller, simpler slice of that problem space.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'composition-root',
    text: 'TinyDI vs. a hand-rolled composition root',
  },
  {
    type: 'p',
    html: 'Many experienced developers skip a DI container entirely: one file wires every dependency by hand with plain function calls. That composition root, not another container, is what TinyDI actually competes with most often.',
  },
  {
    type: 'compare-table',
    headers: ['', 'TinyDI', 'Hand-rolled composition root'],
    rows: [
      [
        'Dependency discovery',
        'Explicit, via factories',
        'Explicit, via plain function calls',
      ],
      [
        'Circular dependency detection',
        'Automatic — throws <code>CircularDependencyError</code> with the full cycle',
        "Manual — a cycle either throws an unrelated runtime error or silently resolves to <code>undefined</code>, depending on module load order",
      ],
      [
        'Lifetime management',
        'Built in: Singleton or Transient, chosen per registration',
        'Hand-written: singletons are typically module-level constants, transients need a manual factory function',
      ],
      [
        'Swapping implementations in tests',
        '<code>remove()</code> + <code>registerInstance()</code> on any token',
        'Usually requires editing the composition root itself, or a manual parameter-passing seam',
      ],
      ['Runtime cost', 'One <code>Map</code> lookup per <code>resolve()</code> call', 'None — direct function calls'],
      [
        'Concepts to learn',
        'Token, Container, ServiceLifetime',
        "None — it's the language you already know",
      ],
    ],
  },
  {
    type: 'p',
    html: "A hand-rolled composition root is a perfectly valid choice for a small project with few services. TinyDI mainly earns its keep once circular-dependency debugging, consistent lifetime management, or swapping fakes in tests start costing real time to do by hand.",
  },
];
