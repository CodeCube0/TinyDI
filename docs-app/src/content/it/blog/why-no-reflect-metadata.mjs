export const meta = {
  title: 'Perché niente reflect-metadata',
  description:
    'La scelta "explicit over magic" dietro TinyDI: cosa offre la DI basata su reflection, cosa costa, e perché abbiamo collegato le dipendenze a mano.',
};

export const blocks = [
  {
    type: 'p',
    html: 'Il primo vincolo nella specifica di TinyDI non era una funzionalità, ma un divieto: niente <code>reflect-metadata</code>, niente decorator, niente constructor injection automatica, niente scansione delle classi. Tutto ciò su cui si basano i container DI TypeScript più diffusi (TSyringe, InversifyJS) era esplicitamente escluso. Questo articolo racconta il perché, e come si presenta davvero questo compromesso una volta che il container è costruito.',
  },
  { type: 'heading', level: 2, id: 'the-problem', text: 'Cosa offre la DI basata su reflection' },
  {
    type: 'p',
    html: "TSyringe e InversifyJS permettono di scrivere una classe, cospargerla di decorator <code>@injectable()</code>/<code>@inject()</code> e far ispezionare al container, a runtime, i tipi dei parametri del costruttore (tramite <code>reflect-metadata</code> e il flag <code>emitDecoratorMetadata</code> di TypeScript) per costruire da solo l'intero grafo delle dipendenze. Non scrivi mai tu <code>new UserService(repo, logger)</code> — il container scopre cosa serve a una classe e glielo fornisce.",
  },
  {
    type: 'p',
    html: 'È genuinamente comodo per grafi di classi ampi. Ma non è gratis: richiede un flag di compilazione specifico che molte configurazioni TypeScript moderne (specialmente con <code>isolatedModules</code> o un transpiler diverso da <code>tsc</code>, come esbuild/SWC) non abilitano di default, un polyfill di metadata solo a runtime, e un modo di collegare le dipendenze che resta invisibile a meno di sapere già che il decorator è lì.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-decision',
    text: 'La decisione: passare il container in modo esplicito',
  },
  {
    type: 'p',
    html: 'Le factory di TinyDI ricevono il container come argomento esplicito, invece di catturarlo da una closure o riceverlo via reflection:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `export type Factory<T> = (container: Container) => T;

container.registerFactory(
  UserServiceToken,
  (c) => new UserService(c.resolve(DatabaseToken)),
);`,
  },
  {
    type: 'p',
    html: "Ogni dipendenza di cui un servizio ha bisogno compare come una chiamata <code>c.resolve(...)</code>, direttamente nel corpo della factory. Non esiste un passaggio in cui il container capisce da solo cosa passare: lo vedi sempre. È esattamente l'idea dietro il payoff di TinyDI, <em>explicit over magic</em>.",
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'Conseguenze e trade-off' },
  {
    type: 'p',
    html: 'Il compromesso è concreto, non solo retorico, e si è manifestato in due punti precisi incontrati costruendo il resto del progetto. Primo: il rilevamento delle dipendenze circolari. Poiché ogni risoluzione passa dalla stessa chiamata esplicita <code>resolve()</code>, tracciare quale token è in corso di costruzione è solo un push/pop su un array attorno a una chiamata di funzione — non serve ricostruire un grafo di dipendenze implicito a partire da metadata dei decorator. Secondo: l\'integrazione con i framework. Ciascuno dei sette <a href="../docs/examples.html">esempi</a> — Vue, Nuxt e React inclusi — collega TinyDI al meccanismo DI-like proprio di quel framework (<code>provide</code>/<code>inject</code>, un plugin Nuxt, il Context di React) con poche righe di codice-ponte scritto a mano. Un container basato su reflection avrebbe bisogno di conoscenza specifica su come ciascuno di questi sistemi costruisce gli oggetti; il nostro non ha bisogno di saperne nulla.',
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Cosa si perde',
    html: 'Si scrive più codice: ogni argomento del costruttore è esplicitato al momento della registrazione invece di essere dedotto dai tipi dei parametri. Per una manciata di servizi è irrilevante; per un grafo di classi molto ampio, è il costo reale di questo design. La scommessa di TinyDI è che l\'esplicitezza si ripaghi in debuggabilità e indipendenza dal framework — vedi <a href="../docs/comparison.html">Confronto</a> per la tabella completa dei trade-off con TSyringe/InversifyJS.',
  },
];
