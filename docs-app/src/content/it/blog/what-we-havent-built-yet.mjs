export const meta = {
  title: 'Cosa non abbiamo ancora costruito (e perché)',
  description:
    'Lifetime scoped, child container, risoluzione asincrona e plugin non fanno parte di TinyDI oggi — un minimalismo deliberato, non una dimenticanza, e cosa servirebbe per aggiungere ciascuno.',
};

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI arriva con esattamente due lifetime (<code>Singleton</code>, <code>Transient</code>), nessun child container, nessuna API di risoluzione asincrona e nessun sistema di plugin. Nessuna di queste è una lacuna accidentale — ognuna è un taglio di scope deliberato, reso esplicito nei commenti del codice sorgente della libreria core e approfondito nella <a href="../docs/faq.html">FAQ</a> e nel <code>ROADMAP.md</code> del progetto. Questo post racconta il ragionamento reale, non un vago "forse più avanti".',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-principle',
    text: 'La regola generale: il minimalismo vince quando è in conflitto con la predisposizione a estensioni future',
  },
  {
    type: 'p',
    html: 'Ovunque restare minimali oggi e restare aperti a una specifica estensione futura tirassero in direzioni diverse, ha vinto il minimalismo — è stata la priorità esplicita per tutto il lavoro sulla libreria core. È una priorità facile da dichiarare e più difficile da rispettare: "sarebbe utile" è vero per quasi ogni funzionalità che si potrebbe aggiungere a un container DI, ed è esattamente per questo che non può essere il criterio.',
  },
  {
    type: 'p',
    html: "Ciò che rende difendibili i tagli qui sotto, e non solo un \"non abbiamo fatto in tempo\", è che ciascuna delle quattro estensioni è stata verificata rispetto al design attuale ed è risultata comunque raggiungibile senza un breaking change. Un taglio di scope irreversibile è una scommessa molto più rischiosa di uno che si può ancora disfare più avanti.",
  },
  { type: 'heading', level: 2, id: 'scoped', text: 'Lifetime Scoped' },
  {
    type: 'code',
    lang: 'ts',
    code: `export enum ServiceLifetime {
  Singleton,
  Transient,
  // Scoped is a natural future extension (per-request/per-operation
  // instances), but it is not implemented here — see the project ROADMAP.
}`,
  },
  {
    type: 'p',
    html: "Un lifetime per-request o per-operazione è l'estensione più richiesta nei container basati su reflection, ed è quella su cui gli utenti chiedono di più (vedi la FAQ). Non è entrata in questa versione perché cambia la forma stessa della risoluzione: il caching del singleton in <code>resolveFactory</code> dovrebbe diventare consapevole dello scope invece di essere un semplice booleano per registrazione. Per lo più additiva, ma non gratuita.",
  },
  { type: 'heading', level: 2, id: 'child-containers', text: 'Child container' },
  {
    type: 'p',
    html: 'Questa è quasi gratis, ed è gratis proprio grazie alla decisione sulla firma della factory descritta in <a href="why-no-reflect-metadata.html">il post su reflect-metadata</a>. Dato che una <code>Factory&lt;T&gt;</code> riceve già il container in modo esplicito invece di catturare stato a livello di modulo, nulla internamente presuppone che ci sia sempre e solo un\'istanza di container in gioco. Una relazione parent/child — un child che ricade sulle registrazioni del parent quando non ha le proprie — è additiva rispetto a quanto esiste oggi, non un redesign.',
  },
  { type: 'heading', level: 2, id: 'async', text: 'Risoluzione asincrona' },
  {
    type: 'p',
    html: "<code>Factory&lt;T&gt;</code> è sincrona per scelta di design: <code>(container: Container) =&gt; T</code>, non <code>=&gt; Promise&lt;T&gt;</code>. Questa è l'unica delle quattro estensioni che non è davvero gratuita. Oggi il caching del singleton memorizza <code>T | undefined</code> più un flag booleano; supportare correttamente factory asincrone significa anche mettere in cache la <code>Promise&lt;T&gt;</code> in corso, in modo che due chiamate concorrenti a <code>resolve()</code> per lo stesso singleton non ancora costruito attendano la stessa promise invece di correre a costruire due istanze. È un vero cambiamento interno a <code>resolveFactory</code>, non solo un metodo aggiunto.",
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'La soluzione alternativa oggi',
    html: 'Puoi risolvere come servizio stesso un valore che restituisce una promise — <code>Token&lt;Promise&lt;T&gt;&gt;</code> — e fare l\'await al punto di chiamata. Funziona, ma non offre il comportamento "await una volta, cache una volta" che una vera API asincrona garantirebbe.',
  },
  { type: 'heading', level: 2, id: 'plugins', text: 'Plugin' },
  {
    type: 'p',
    html: 'Un sistema di plugin è la più "gratuita" delle quattro estensioni: un plugin sarebbe semplicemente una funzione che chiama <code>registerInstance</code>/<code>registerFactory</code> su un container che gli viene passato, usando solo API pubbliche già esistenti. Completamente additiva, nessun cambiamento interno richiesto — semplicemente non è stata ancora costruita perché nulla nello scope attuale ne ha bisogno.',
  },
  { type: 'heading', level: 2, id: 'why-this-matters', text: 'Perché scriverlo, in fondo' },
  {
    type: 'p',
    html: 'Una roadmap che elenca solo nomi di funzionalità ("Scoped", "Child Container", "Async", "Plugin") si legge come una wish list. Dichiarare per ciascuna se è additiva o richiede un redesign è un segnale più onesto per chiunque debba decidere se dipendere da TinyDI oggi: tre di queste quattro estensioni possono arrivare come aggiunte in stile 2.x senza rompere codice esistente; una (l\'async) è una domanda aperta che richiederebbe un vero lavoro di design prima di essere rilasciata.',
  },
  {
    type: 'p',
    html: 'Questa distinzione conta più della lista di funzionalità in sé, e vale oltre questa singola libreria: qualunque progetto che tiene una lista di "non ancora" dovrebbe poter dire, per ciascuna voce, se è additiva o richiede un redesign. Se non sai dirlo, non sai davvero quanto ti stia costando quel taglio di scope.',
  },
];
