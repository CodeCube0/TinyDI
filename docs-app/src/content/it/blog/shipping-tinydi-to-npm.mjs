export const meta = {
  title: 'Preparare TinyDI per npm: package.json, exports map e tree-shaking',
  description:
    'Cosa comporta davvero pubblicare una libreria ESM/CJS a dipendenze zero: una build dual-package con tsup, una exports map a doppia condizione, e una stranezza del build tool che non era compito nostro risolvere.',
};

export const blocks = [
  {
    type: 'p',
    html: 'Scrivere la libreria core è un problema. Distribuirla come pacchetto che altri progetti possano installare con <code>npm install</code> e importare sia da ESM sia da CJS, con i tipi corretti su entrambi i lati, è un problema diverso. Questo post parla della meccanica reale: il cambio di bundler, la mappa <code>exports</code>, e un bug che veniva dal tooling, non da noi.',
  },
  { type: 'heading', level: 2, id: 'the-bundler', text: 'Da tsc puro a tsup' },
  {
    type: 'p',
    html: "La build è passata da un'emissione diretta per-file con <code>tsc</code> a <code>tsup</code>, producendo un vero pacchetto dual ESM+CJS: <code>dist/index.js</code> (ESM), <code>dist/index.cjs</code> (CJS), e i corrispondenti file di dichiarazione <code>dist/index.d.ts</code>/<code>dist/index.d.cts</code>. Un'emissione <code>tsc</code> diretta produce un solo formato di modulo; un vero pacchetto dual richiede che il build tool impacchetti ed emetta entrambi, con dichiarazioni di tipo separate, dato che la risoluzione dei tipi in ESM e CJS non è esattamente la stessa cosa.",
  },
  {
    type: 'heading',
    level: 2,
    id: 'exports-map',
    text: 'La exports map: due condizioni, ciascuna con i propri tipi',
  },
  {
    type: 'code',
    lang: 'json',
    code: `{
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  }
}`,
  },
  {
    type: 'p',
    html: 'Ogni condizione — <code>import</code> per i consumatori ESM, <code>require</code> per quelli CJS — ha una propria voce <code>types</code>, non condivisa. Sbagliare questo (ad esempio un unico <code>.d.ts</code> condiviso per entrambi) può far sì che un consumatore CJS finisca con errori di tipo derivati dalla risoluzione dei tipi specifica di ESM, o viceversa, in un modo che emerge solo nella sua build, non nella nostra.',
  },
  { type: 'heading', level: 2, id: 'zero-deps', text: 'Zero dipendenze, una peer dependency' },
  {
    type: 'p',
    html: '<code>package.json</code> non ha affatto un campo <code>dependencies</code> — solo <code>devDependencies</code> (tooling) e una <code>peerDependencies.typescript: ">=6.0.0"</code> opzionale. Non è un dettaglio marginale: è l\'intero punto della libreria. Chiunque verifichi cosa si porta dietro aggiungendo TinyDI a un progetto ottiene una risposta reale: niente.',
  },
  { type: 'heading', level: 2, id: 'not-our-bug', text: 'Un bug che era del tooling, non nostro' },
  {
    type: 'p',
    html: "Il passaggio di bundling delle dichiarazioni di <code>tsup</code> sintetizza internamente un'opzione <code>baseUrl</code>, su cui TypeScript 6.0 lancia un errore bloccante, <code>TS5101: Option 'baseUrl' is deprecated</code>. Questo non ha nulla a che fare con il <code>tsconfig.json</code> di questo progetto — è un'interazione tra gli interni di <code>tsup</code>/<code>rollup-plugin-dts</code> e la politica di deprecazione più severa di TypeScript 6. La correzione è una riga sola, aggiunta specificamente a <code>tsconfig.build.json</code> (non al <code>tsconfig.json</code> base usato per editor/lint/type-check):",
  },
  {
    type: 'code',
    lang: 'json',
    code: `{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Perché questo conta oltre la correzione di una riga',
    html: "Riconoscere che un errore proviene dagli interni del build tool piuttosto che dalla propria configurazione cambia il modo in cui lo risolvi: l'alternativa sarebbe stata inseguire un'inesistente impostazione <code>baseUrl</code> nei nostri stessi file <code>tsconfig.json</code>, dove non è mai stato il problema reale.",
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'Il risultato concreto' },
  {
    type: 'p',
    html: 'Il risultato è un pacchetto che fa tree-shaking in modo pulito (output ESM, nessun codice a livello di modulo con side-effect) e funziona allo stesso modo indipendentemente dal fatto che il bundler di chi consuma scelga la condizione <code>import</code> o <code>require</code> — verificato in pratica dai sette esempi di questo progetto, che coprono sia una toolchain frontend basata su Vite sia semplici script Node <code>tsx</code>, tutti in grado di risolvere correttamente lo stesso pacchetto.',
  },
  {
    type: 'p',
    html: 'Sistemare il pacchetto in sé si è rivelato necessario ma non sufficiente. Pubblicarlo per davvero — il punto in cui un package.json incontra l\'infrastruttura reale di npm — ha fatto emergere una serie di problemi separati che nulla di tutto questo aveva previsto, raccontati <a href="what-the-phase-4-plan-couldnt-predict.html">nel post sulla release</a>.',
  },
];
