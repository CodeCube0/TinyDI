export const meta = {
  title: 'Progettare token type-safe senza generics espliciti',
  description:
    'Come createToken<T> permette a container.resolve(token) di inferire il tipo esatto del servizio, usando un phantom type che a runtime non esiste mai.',
};

export const blocks = [
  {
    type: 'p',
    html: 'Un container DI ha bisogno di un modo per identificare un servizio. Le chiavi stringa sono la scelta più ovvia, ed è anche la più facile da sbagliare: due moduli non correlati possono scegliere la stessa stringa per due cose diverse, e un refuso nella stringa emerge come errore a runtime invece che in compilazione.',
  },
  {
    type: 'p',
    html: 'TinyDI usa invece i <strong>token</strong>. La parte interessante non è che i token esistano — molti container hanno una qualche nozione di token. È nel modo in cui un token di TinyDI permette a <code>resolve()</code> di conoscere il tipo di ritorno esatto, senza mai scrivere <code>resolve&lt;IMailService&gt;(token)</code>.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-problem',
    text: 'Il problema: inferire T senza generics espliciti',
  },
  {
    type: 'p',
    html: "L'obiettivo era che questo funzionasse così com'è, con il tipo a destra dedotto interamente da <code>MailServiceToken</code>:",
  },
  {
    type: 'code',
    lang: 'ts',
    code: `// Nessun generic esplicito necessario — inferito come IMailService.
const mailService = container.resolve(MailServiceToken);`,
  },
  {
    type: 'p',
    html: 'Questo significa che il token stesso deve trasportare <code>IMailService</code> in qualche modo, a livello di tipo, anche se a runtime un token è solo un identificatore — non c\'è nulla da "trasportare" una volta che il programma è effettivamente in esecuzione.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-token-shape',
    text: 'La forma del token: identità tramite symbol, tipo fantasma',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `export interface Token<T> {
  readonly symbol: symbol;
  readonly description: string;
  readonly __type?: T;
}

export function createToken<T>(description: string): Token<T> {
  return {
    symbol: Symbol(description),
    description,
  };
}`,
  },
  {
    type: 'p',
    html: "<code>__type</code> è tutto il trucco: è dichiarato nell'interfaccia unicamente per il type checker, marcato come opzionale, e <strong>non viene mai assegnato nell'implementazione</strong>. <code>createToken</code> restituisce un oggetto con solo <code>symbol</code> e <code>description</code> — nessuna proprietà <code>__type</code> esiste sull'oggetto reale a runtime. TypeScript lo usa comunque per trasportare <code>T</code> attraverso il tipo, ed è esattamente ciò che permette a <code>resolve(token: Token&lt;T&gt;): T</code> di inferire il tipo di ritorno corretto da qualunque token gli venga passato.",
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Un dettaglio che per poco non è passato inosservato',
    html: "La prima versione funzionante di <code>createToken</code> effettuava un cast esplicito del valore di ritorno come <code>Token&lt;T&gt;</code>. La regola ESLint <code>no-unnecessary-type-assertion</code> lo ha segnalato: l'oggetto letterale <code>{ symbol, description }</code> è già strutturalmente assegnabile a <code>Token&lt;T&gt;</code>, perché <code>__type</code> è opzionale. Il cast era puro rumore — rimuoverlo non ha cambiato nulla di ciò che il type checker accetta.",
  },
  {
    type: 'heading',
    level: 2,
    id: 'symbol-not-string',
    text: "L'identità è il symbol, non la description",
  },
  {
    type: 'p',
    html: '<code>description</code> è una semplice stringa, usata solo come etichetta leggibile nei messaggi di errore ("No registration found for token ..."). Non viene mai usata come chiave di lookup. Il container mappa le registrazioni su <code>token.symbol</code>, quindi due token creati con la stessa description restano due registrazioni distinte:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `const a = createToken<string>('name');
const b = createToken<string>('name');
a.symbol !== b.symbol; // true — token distinti, nessuna collisione`,
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'Conseguenze' },
  {
    type: 'p',
    html: "Questo esclude un'intera categoria di bug che i container a chiave stringa devono aggirare per convenzione (namespacing delle chiavi, lint per i duplicati): qui è strutturalmente impossibile che due chiamate <code>createToken</code> non correlate collidano, perché JavaScript garantisce che ogni chiamata a <code>Symbol()</code> produca un valore unico.",
  },
  {
    type: 'p',
    html: "Il costo è quasi nullo — un'allocazione in più per token, creata una sola volta al caricamento del modulo, non a ogni risoluzione. È una forma rara per un compromesso: di solito una garanzia più forte costa qualcosa, a runtime o in ergonomia, e qui nessuno dei due costi si applica.",
  },
  {
    type: 'p',
    html: 'Questo è stato uno dei due punti della libreria core che hanno richiesto un vero lavoro di design invece di una scelta ovvia — la forma del token qui, e capire, dopo aver rilevato un ciclo, come <a href="detecting-circular-dependencies.html">spiegarlo a chi lo legge</a>.',
  },
];
