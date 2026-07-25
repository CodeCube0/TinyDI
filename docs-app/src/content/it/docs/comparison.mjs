export const meta = {
  title: 'Confronto',
  description:
    'Come si confronta TinyDI con TSyringe, InversifyJS e una composition root scritta a mano.',
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
  {
    type: 'heading',
    level: 2,
    id: 'composition-root',
    text: 'TinyDI vs. una composition root scritta a mano',
  },
  {
    type: 'p',
    html: 'Molti developer esperti evitano del tutto un container DI: un unico file collega ogni dipendenza a mano con semplici chiamate a funzione. È proprio quella composition root, non un altro container, il vero concorrente di TinyDI nella maggior parte dei casi.',
  },
  {
    type: 'compare-table',
    headers: ['', 'TinyDI', 'Composition root scritta a mano'],
    rows: [
      [
        'Scoperta delle dipendenze',
        'Esplicita, tramite factory',
        'Esplicita, tramite semplici chiamate a funzione',
      ],
      [
        'Rilevamento dipendenze circolari',
        'Automatico — lancia <code>CircularDependencyError</code> con il ciclo completo',
        "Manuale — un ciclo lancia un errore runtime non correlato oppure si risolve silenziosamente in <code>undefined</code>, a seconda dell'ordine di caricamento dei moduli",
      ],
      [
        'Gestione dei lifetime',
        'Integrata: Singleton o Transient, scelta per ogni registrazione',
        'Scritta a mano: i singleton sono tipicamente costanti a livello di modulo, i transient richiedono una funzione factory manuale',
      ],
      [
        'Sostituire implementazioni nei test',
        '<code>remove()</code> + <code>registerInstance()</code> su qualsiasi token',
        'Di solito richiede di modificare la composition root stessa, o un punto di passaggio manuale dei parametri',
      ],
      [
        'Costo a runtime',
        'Una lookup su <code>Map</code> per ogni chiamata a <code>resolve()</code>',
        'Nessuno — chiamate a funzione dirette',
      ],
      [
        'Concetti da imparare',
        'Token, Container, ServiceLifetime',
        'Nessuno — è il linguaggio che già conosci',
      ],
    ],
  },
  {
    type: 'p',
    html: 'Una composition root scritta a mano è una scelta perfettamente valida per un progetto piccolo con poche dipendenze. TinyDI ripaga soprattutto quando il debug delle dipendenze circolari, la gestione coerente dei lifetime, o la sostituzione di finte implementazioni nei test iniziano a costare tempo reale da fare a mano.',
  },
];
