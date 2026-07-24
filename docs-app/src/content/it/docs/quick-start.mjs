export const meta = {
  title: 'Quick Start',
  description:
    "Registra il tuo primo servizio e risolvilo — l'intero modello mentale di TinyDI in una pagina.",
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
    html: "In TinyDI non c'è nessun passaggio nascosto. Questa pagina è l'intero modello mentale: crea un container, registra un servizio, risolvilo.",
  },
  { type: 'heading', level: 2, id: 'the-example', text: "L'esempio" },
  { type: 'code', lang: 'ts', code: fullExample },
  { type: 'heading', level: 2, id: 'what-is-happening', text: 'Cosa succede qui' },
  {
    type: 'list',
    ordered: true,
    items: [
      "<code>createToken&lt;IClock&gt;('Clock')</code> crea un identificatore type-safe. Il generic <code>&lt;IClock&gt;</code> è l'unico punto in cui il tipo viene scritto — tutto il resto lo inferisce.",
      '<code>container.registerFactory(...)</code> dice al container come costruire il servizio, in modo lazy, la prima volta che viene richiesto. <code>ServiceLifetime.Singleton</code> è il default e qui potrebbe essere omesso.',
      '<code>container.resolve(ClockToken)</code> restituisce il servizio, tipizzato come <code>IClock</code> senza generic esplicito.',
    ],
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Nessun decorator, nessuna reflection',
    html: "Ogni decisione di cablaggio qui sopra è una normale chiamata a funzione che puoi seguire con <code>Cmd+Click</code>. Nulla qui si basa su <code>reflect-metadata</code>, e non c'è alcun flag del compilatore da abilitare.",
  },
  { type: 'heading', level: 2, id: 'next-steps', text: 'Prossimi passi' },
  {
    type: 'example-grid',
    items: [
      {
        title: 'Token',
        description:
          "Come funziona il sistema di token type-safe, e perché l'identità è un symbol, non una stringa.",
        href: '/it/docs/tokens.html',
        cta: 'Leggi Token',
      },
      {
        title: 'Container',
        description:
          'Ogni metodo di Container: registerInstance, registerFactory, resolve, has, remove, clear.',
        href: '/it/docs/container.html',
        cta: 'Leggi Container',
      },
      {
        title: 'Lifetime',
        description: "Singleton vs. Transient, e quando scegliere l'uno o l'altro.",
        href: '/it/docs/lifetimes.html',
        cta: 'Leggi Lifetime',
      },
    ],
  },
];
