export const meta = {
  title: 'Comparison',
  description: 'How TinyDI compares to TSyringe and InversifyJS.',
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
];
