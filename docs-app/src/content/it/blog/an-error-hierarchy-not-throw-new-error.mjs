export const meta = {
  title: 'Una gerarchia di errori, invece di throw new Error(...)',
  description:
    'Perché TinyDI ha ContainerError, RegistrationError, ResolutionError e CircularDependencyError invece di un unico tipo di errore generico, e cosa ha davvero comportato questa decisione.',
};

export const blocks = [
  {
    type: 'p',
    html: "Il modo più semplice per segnalare un fallimento in una libreria piccola è <code>throw new Error('qualcosa è andato storto')</code>. TinyDI ha invece una piccola gerarchia di classi: una base astratta <code>ContainerError</code>, e tre sottoclassi concrete — <code>RegistrationError</code>, <code>ResolutionError</code>, <code>CircularDependencyError</code>. La parte interessante di questa storia non è la gerarchia in sé, ma una decisione di design che la specifica lasciava intuire ma non esplicitava mai.",
  },
  { type: 'heading', level: 2, id: 'the-hierarchy', text: 'La gerarchia' },
  {
    type: 'code',
    lang: 'ts',
    code: `export abstract class ContainerError extends Error {
  protected constructor(
    message: string,
    public readonly token?: Token<unknown>,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RegistrationError extends ContainerError { /* ... */ }
export class ResolutionError extends ContainerError { /* ... */ }
export class CircularDependencyError extends ContainerError { /* ... */ }`,
  },
  {
    type: 'p',
    html: '<code>ContainerError</code> trasporta il <code>Token</code> coinvolto nel fallimento (quando esiste), così un gestore generico può registrare quale token ha causato il problema senza doversi preoccupare di quale sottoclasse concreta abbia intercettato:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `try {
  container.resolve(SomeToken);
} catch (error) {
  if (error instanceof ContainerError) {
    console.error(\`DI failure for "\${error.token?.description}": \${error.message}\`);
  }
}`,
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-real-decision',
    text: 'La decisione che la specifica lasciava implicita',
  },
  {
    type: 'p',
    html: 'La specifica del task nominava <code>RegistrationError</code> come parte della gerarchia attesa, ma non diceva mai esattamente quando dovesse scattare. La domanda di design ovvia: cosa succede se registri lo stesso token due volte? Esistono due risposte ragionevoli — lasciare che la seconda registrazione vinca silenziosamente ("vince l\'ultima scrittura", l\'opzione più permissiva), oppure lanciare un errore. TinyDI lancia un errore:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `private assertNotRegistered(token: Token<unknown>): void {
  if (this.registrations.has(token.symbol)) {
    throw new RegistrationError(
      token,
      \`Token "\${token.description}" is already registered. \` +
        'Call remove() first to replace it, or clear() to reset the container.',
    );
  }
}`,
  },
  {
    type: 'p',
    html: "È stata una scelta deliberata, non l'unica ragionevole: una classe di errore dichiarata dalla specifica ma non descritta richiedeva comunque una decisione di design per essere onorata come un contratto pubblico vero, invece di essere lasciata a quello che l'implementazione avrebbe fatto per prima.",
  },
  {
    type: 'p',
    html: "La sovrascrittura silenziosa è una trappola in un container DI. Registrare per sbaglio lo stesso token due volte — una volta nel codice applicativo, una volta in un setup di test che ha dimenticato di ripulire, nel caso più comune — è esattamente il tipo di bug che diventa rumoroso e ovvio nel momento stesso in cui accade con un throw esplicito, e silenzioso e difficile da tracciare se la seconda registrazione vince e basta. Lanciare un errore costa un po' di comodità; lasciarlo correre costa una sessione di debug, settimane dopo, per capire perché viene risolta l'implementazione sbagliata.",
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'La via di uscita',
    html: 'Poiché sovrascrivere lancia un errore, sostituire un\'implementazione — più comunemente nei test — richiede un <code>container.remove(token)</code> esplicito (oppure <code>container.clear()</code>) prima di registrare di nuovo. Quel passaggio in più è il costo di questa decisione; significa anche che "volevo sostituire questo" è sempre visibile nel codice come una riga a sé, non implicito in una seconda chiamata di registrazione.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'consequences',
    text: 'Cosa comporta per chi consuma la libreria',
  },
  {
    type: 'p',
    html: 'Una gerarchia di quattro classi al posto di un <code>Error</code> piatto è poco codice in più, ma permette a chi consuma la libreria di distinguere il tipo di fallimento quando serve (per esempio trattare un <code>ResolutionError</code> per un servizio opzionale in modo diverso da un <code>RegistrationError</code> emerso durante il bootstrap dell\'app), pur potendo intercettare tutto ciò che riguarda la DI con un solo controllo <code>instanceof ContainerError</code>. <code>CircularDependencyError</code>, la quarta sottoclasse, ha <a href="detecting-circular-dependencies.html">un post tutto suo</a> — lì la parte interessante non era la classe in sé ma il formato del messaggio. Vedi la <a href="../docs/api-reference.html">API Reference</a> per la superficie completa degli errori.',
  },
];
