export const meta = {
  title: 'Rilevare le dipendenze circolari',
  description:
    "Come TinyDI intercetta A -> B -> C -> A al momento della risoluzione con un semplice stack di percorso, e perché il formato del messaggio d'errore è stato progettato così.",
};

export const blocks = [
  {
    type: 'p',
    html: 'Una dipendenza circolare si verifica quando risolvere il servizio A richiede risolvere B, che richiede risolvere C, che richiede di nuovo A — un ciclo che, se non intercettato, ricorre finché lo stack va in overflow con un messaggio che non dice nulla su quali servizi siano coinvolti. Rilevare il ciclo per tempo, e riportare esattamente quali token lo compongono, è stato uno dei due problemi della libreria core che hanno richiesto un design vero (l\'altro è raccontato in <a href="type-safe-tokens-without-generics.html">il post sui token</a>).',
  },
  {
    type: 'heading',
    level: 2,
    id: 'how-it-works',
    text: 'Come funziona il rilevamento: uno stack del percorso di risoluzione',
  },
  {
    type: 'p',
    html: 'Poiché ogni factory riceve il container in modo esplicito (vedi <a href="why-no-reflect-metadata.html">il post su reflect-metadata</a>) invece di risolvere le dipendenze tramite un meccanismo implicito, il container sa sempre esattamente quale token è attualmente in corso di risoluzione. Mantiene un semplice array, <code>resolutionPath</code>, e vi inserisce il token corrente prima di invocare una factory, rimuovendolo quando la factory restituisce il risultato:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `private resolveFactory<T>(registration: FactoryRegistration<T>): T {
  if (registration.lifetime === ServiceLifetime.Singleton && registration.hasCachedInstance) {
    return registration.cachedInstance as T;
  }

  const cycleStartIndex = this.resolutionPath.findIndex(
    (pathToken) => pathToken.symbol === registration.token.symbol,
  );
  if (cycleStartIndex !== -1) {
    throw new CircularDependencyError([...this.resolutionPath, registration.token]);
  }

  this.resolutionPath.push(registration.token);
  try {
    const instance = registration.factory(this);
    if (registration.lifetime === ServiceLifetime.Singleton) {
      registration.cachedInstance = instance;
      registration.hasCachedInstance = true;
    }
    return instance;
  } finally {
    this.resolutionPath.pop();
  }
}`,
  },
  {
    type: 'p',
    html: 'Se il token che sta per essere risolto è già presente da qualche parte in <code>resolutionPath</code>, significa che siamo già a metà della sua risoluzione — ecco il ciclo. Il blocco <code>try</code>/<code>finally</code> garantisce che il token venga rimosso anche se la factory lancia un errore, così una risoluzione fallita non lascia mai una voce residua per la prossima, non correlata, chiamata a <code>resolve()</code>.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-error-format',
    text: "La parte che ha davvero richiesto iterazione: il formato dell'errore",
  },
  {
    type: 'p',
    html: "Rilevare il ciclo è stata la metà facile. La domanda più difficile è stata come dovesse apparire il messaggio d'errore risultante — uno stack trace che punta a <code>resolveFactory</code> non aiuta uno sviluppatore che deve sapere <em>quali servizi</em> formano il ciclo. Il formato scelto mostra l'intera catena, un token per riga, con ogni voce successiva alla prima preceduta da una freccia:",
  },
  {
    type: 'code',
    lang: 'text',
    code: `Circular dependency detected:

A
 -> B
 -> C
 -> A`,
  },
  {
    type: 'code',
    lang: 'ts',
    code: `private static formatPath(path: Token<unknown>[]): string {
  return path
    .map((token, index) => (index === 0 ? token.description : \` -> \${token.description}\`))
    .join('\\n');
}`,
  },
  {
    type: 'p',
    html: "Il primo token non ha prefisso; tutti quelli successivi — incluso il token ripetuto che richiude il ciclo — hanno il prefisso <code>-&gt;</code>. Quest'ultima voce ripetuta è importante: senza di essa il messaggio si legge come una linea retta A → B → C, e il lettore deve dedurre da sé che C dipende anche da A. Ripeterla rende il ciclo visibile senza costringere il lettore a tenere a mente l'intera catena.",
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Testato come stringa esatta, non solo "contiene"',
    html: "La suite di test verifica questo formato esatto con un controllo di uguaglianza sull'intera stringa, non con un più permissivo <code>toContain()</code>. Un'asserzione più permissiva passerebbe felicemente anche se il prefisso a freccia sparisse silenziosamente dal primo token, o se il token di chiusura smettesse di ripetersi — regressioni che emergerebbero solo a uno sviluppatore reale che legge un errore reale, non alla suite di test.",
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'Perché vale un intero post' },
  {
    type: 'p',
    html: "È una funzione piccola — una dozzina di righe, nessun algoritmo elaborato — ma è un buon esempio di dove si annidi il costo reale di una funzionalità. Rilevare <em>che</em> un ciclo esiste è costato una chiamata a <code>findIndex</code>; decidere <em>come spiegarlo</em> a una persona ha richiesto il resto dello sforzo di design, ed è la parte che determina davvero se l'errore sia utile il giorno in cui qualcuno lo incontra in un codebase reale.",
  },
];
