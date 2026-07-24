export const meta = {
  title: 'Confronto',
  description: 'Come si confronta TinyDI con TSyringe e InversifyJS.',
};

export const blocks = [
  {
    type: 'p',
    html: "La maggior parte dei container DI nell'ecosistema TypeScript si appoggia a <code>reflect-metadata</code> e ai decorator per la scoperta automatica delle dipendenze. TinyDI prende la posizione opposta — ecco esattamente come si confronta questo compromesso.",
  },
  { type: 'heading', level: 2, id: 'tsyringe', text: 'TinyDI vs. TSyringe' },
  {
    type: 'compare-table',
    headers: ['', 'TinyDI', 'TSyringe'],
    rows: [
      [
        'Scoperta delle dipendenze',
        'Esplicita, tramite factory',
        'Automatica, tramite decorator + reflect-metadata',
      ],
      ['Decorator richiesti', 'No', 'Sì (@injectable, @inject, ...)'],
      [
        'Flag del compilatore richiesti',
        'Nessuno',
        'experimentalDecorators, emitDecoratorMetadata',
      ],
      ['Dipendenze a runtime', 'Nessuna', 'reflect-metadata'],
      ['Identità dei token', 'Token&lt;T&gt; basato su symbol', 'Token stringa o classi'],
      [
        'Lifetime',
        'Singleton, Transient',
        'Singleton, Transient, ResolutionScoped, ContainerScoped',
      ],
    ],
  },
  {
    type: 'p',
    html: "TSyringe è un'ottima scelta se vuoi la constructor injection automatica e non ti dispiace avere decorator e <code>reflect-metadata</code> nel progetto. TinyDI scambia quella comodità con esplicitezza e una superficie più piccola.",
  },
  { type: 'heading', level: 2, id: 'inversifyjs', text: 'TinyDI vs. InversifyJS' },
  {
    type: 'compare-table',
    headers: ['', 'TinyDI', 'InversifyJS'],
    rows: [
      [
        'Scoperta delle dipendenze',
        'Esplicita, tramite factory',
        'Automatica, tramite decorator + reflect-metadata',
      ],
      ['Decorator richiesti', 'No', 'Sì (@injectable, @inject, ...)'],
      [
        'Flag del compilatore richiesti',
        'Nessuno',
        'experimentalDecorators, emitDecoratorMetadata',
      ],
      ['Dipendenze a runtime', 'Nessuna', 'reflect-metadata'],
      [
        'Concetti da imparare',
        'Token, Container, ServiceLifetime',
        'Container, moduli, binding, scope, middleware',
      ],
      ['Lifetime', 'Singleton, Transient', 'Singleton, Transient, Request, scope personalizzati'],
    ],
  },
  {
    type: 'p',
    html: 'InversifyJS offre un set di funzionalità molto più ampio (moduli, middleware, multi-injection, tagging) al costo di una superficie API più grande e di una dipendenza a runtime dalla reflection. TinyDI copre intenzionalmente una fetta molto più piccola e semplice dello stesso problema.',
  },
];
