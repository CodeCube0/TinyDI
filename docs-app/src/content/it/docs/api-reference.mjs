export const meta = {
  title: 'API Reference',
  description:
    'Ogni API pubblica di TinyDI: firme TypeScript esatte, parametri, tipi di ritorno, esempi e casi limite.',
};

export const blocks = [
  {
    type: 'p',
    html: "Basata direttamente sull'implementazione di TinyDI — ogni firma qui sotto è reale, non illustrativa.",
  },

  { type: 'heading', level: 2, id: 'createtoken', text: 'createToken' },
  { type: 'code', lang: 'ts', code: 'function createToken<T>(description: string): Token<T>' },
  {
    type: 'p',
    html: "<strong>Parametri:</strong> <code>description</code> — un'etichetta leggibile usata nei messaggi di errore. Non deve essere univoca.<br><strong>Restituisce:</strong> un <code>Token&lt;T&gt;</code>, utilizzabile con <code>registerInstance</code>, <code>registerFactory</code> e <code>resolve</code>.",
  },
  {
    type: 'code',
    lang: 'ts',
    code: `interface IMailService {
  send(to: string, body: string): Promise<void>;
}

const MailServiceToken = createToken<IMailService>('MailService');`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Caso limite',
    html: "Due token creati con la stessa <code>description</code> restano comunque registrazioni distinte — l'identità è il <code>symbol</code> sottostante, mai la stringa description.",
  },

  { type: 'heading', level: 2, id: 'servicelifetime', text: 'ServiceLifetime' },
  {
    type: 'code',
    lang: 'ts',
    code: `enum ServiceLifetime {
  Singleton,
  Transient,
}`,
  },
  {
    type: 'p',
    html: 'Esistono solo questi due valori. <code>Singleton</code> è il default usato da <code>registerFactory</code> quando non viene fornito alcun lifetime. Vedi <a href="/it/docs/lifetimes.html">Lifetime</a> per la spiegazione completa.',
  },

  { type: 'heading', level: 2, id: 'container', text: 'Container' },
  {
    type: 'api-table',
    headers: ['Metodo', 'Descrizione'],
    rows: [
      [
        '<code>registerInstance&lt;T&gt;(token, instance): void</code>',
        "Registra un'istanza già creata. Sempre Singleton.",
      ],
      [
        '<code>registerFactory&lt;T&gt;(token, factory, lifetime?): void</code>',
        'Registra una factory, costruita in modo lazy. <code>lifetime</code> di default è Singleton.',
      ],
      ['<code>resolve&lt;T&gt;(token): T</code>', 'Risolve il servizio, completamente tipizzato.'],
      ['<code>has(token): boolean</code>', 'Controlla se un token è registrato.'],
      ['<code>remove(token): void</code>', 'Rimuove la registrazione di un token, se presente.'],
      ['<code>clear(): void</code>', 'Rimuove tutte le registrazioni.'],
    ],
  },

  { type: 'heading', level: 3, id: 'registerinstance', text: 'registerInstance' },
  {
    type: 'code',
    lang: 'ts',
    code: 'registerInstance<T>(token: Token<T>, instance: T): void',
  },
  {
    type: 'p',
    html: "<strong>Parametri:</strong> <code>token</code> — l'identificatore del servizio; <code>instance</code> — il valore restituito ad ogni risoluzione.<br><strong>Restituisce:</strong> <code>void</code>.<br><strong>Lancia:</strong> <code>RegistrationError</code> se <code>token</code> è già registrato.",
  },

  { type: 'heading', level: 3, id: 'registerfactory', text: 'registerFactory' },
  {
    type: 'code',
    lang: 'ts',
    code: 'registerFactory<T>(token: Token<T>, factory: (container: Container) => T, lifetime?: ServiceLifetime): void',
  },
  {
    type: 'p',
    html: "<strong>Parametri:</strong> <code>token</code> — l'identificatore del servizio; <code>factory</code> — costruisce l'istanza, ricevendo il container così può risolvere le proprie dipendenze; <code>lifetime</code> — <code>Singleton</code> (default) o <code>Transient</code>.<br><strong>Restituisce:</strong> <code>void</code>.<br><strong>Lancia:</strong> <code>RegistrationError</code> se <code>token</code> è già registrato.",
  },

  { type: 'heading', level: 3, id: 'resolve', text: 'resolve' },
  { type: 'code', lang: 'ts', code: 'resolve<T>(token: Token<T>): T' },
  {
    type: 'p',
    html: "<strong>Parametri:</strong> <code>token</code> — l'identificatore del servizio da risolvere.<br><strong>Restituisce:</strong> l'istanza risolta, tipizzata come <code>T</code>.<br><strong>Lancia:</strong> <code>ResolutionError</code> se non registrato; <code>CircularDependencyError</code> se risolverlo richiede di risolvere se stesso di nuovo, direttamente o transitivamente.",
  },

  { type: 'heading', level: 3, id: 'has-remove-clear', text: 'has / remove / clear' },
  {
    type: 'code',
    lang: 'ts',
    code: `has(token: Token<unknown>): boolean
remove(token: Token<unknown>): void
clear(): void`,
  },
  {
    type: 'p',
    html: '<code>remove</code> su un token non registrato, e <code>clear</code> su un container vuoto, sono entrambi no-op sicuri — nessuno dei due lancia errori.',
  },

  { type: 'heading', level: 2, id: 'errors', text: 'Errori' },
  {
    type: 'p',
    html: "Ogni errore estende l'astratta <code>ContainerError</code>, che espone il <code>token</code> coinvolto (eccetto <code>CircularDependencyError</code>, che espone anche il ciclo completo).",
  },
  {
    type: 'api-table',
    headers: ['Classe', 'Lanciato quando'],
    rows: [
      ['<code>ContainerError</code>', 'Classe base astratta. Mai lanciata direttamente.'],
      ['<code>RegistrationError</code>', 'Si registra un token già registrato.'],
      ['<code>ResolutionError</code>', 'Si risolve un token senza registrazione.'],
      [
        '<code>CircularDependencyError</code>',
        'Si risolve un token che dipende (transitivamente) da se stesso.',
      ],
    ],
  },
  {
    type: 'p',
    html: '<code>CircularDependencyError</code> espone il ciclo completo in <code>.path</code> (un array dei token coinvolti) e lo rende in <code>.message</code> come:',
  },
  {
    type: 'code',
    lang: 'text',
    noLines: true,
    code: `Circular dependency detected:

A
 -> B
 -> C
 -> A`,
  },
];
