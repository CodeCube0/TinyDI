export const meta = {
  title: 'Lifetime',
  description: "Singleton vs. Transient in TinyDI, e quando scegliere l'uno o l'altro.",
};

export const blocks = [
  {
    type: 'p',
    html: "TinyDI supporta esattamente due lifetime, tramite l'enum <code>ServiceLifetime</code>. Non c'è una terza opzione, né rilevamento automatico — dichiari tu il lifetime che vuoi.",
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
    html: 'Il default. La prima volta che un token viene risolto, la sua factory viene eseguita una volta sola; ogni chiamata successiva a <code>resolve()</code> per lo stesso token restituisce la stessa istanza.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.registerFactory(ClockToken, () => new SystemClock()); // Singleton di default

container.resolve(ClockToken) === container.resolve(ClockToken); // true`,
  },
  {
    type: 'p',
    html: "<code>registerInstance</code> è sempre Singleton — stai passando al container un'istanza già esistente, quindi non potrebbe essere altro.",
  },
  { type: 'heading', level: 2, id: 'transient', text: 'Transient' },
  {
    type: 'p',
    html: 'Viene creata una nuova istanza ad ogni chiamata a <code>resolve()</code>.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.registerFactory(RequestIdToken, () => crypto.randomUUID(), ServiceLifetime.Transient);

container.resolve(RequestIdToken) === container.resolve(RequestIdToken); // false`,
  },
  { type: 'heading', level: 2, id: 'choosing', text: 'Come scegliere' },
  {
    type: 'list',
    items: [
      'Usa <strong>Singleton</strong> di default per servizi stateless e risorse condivise (repository, client HTTP, logger).',
      "Ricorri a <strong>Transient</strong> solo quando ogni risoluzione ha davvero bisogno di un'istanza nuova — un identificatore per-operazione, un builder che accumula stato durante un solo utilizzo.",
    ],
  },
  {
    type: 'callout',
    kind: 'warning',
    title: 'Nessun lifetime Scoped, per ora',
    html: "Questa versione include deliberatamente solo Singleton e Transient. Un futuro lifetime <code>Scoped</code> (istanze per-request) è un'estensione naturale che il design non preclude, ma non fa parte dell'API attuale.",
  },
];
