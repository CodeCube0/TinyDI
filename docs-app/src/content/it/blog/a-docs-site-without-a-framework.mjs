export const meta = {
  title: 'Costruire un sito di documentazione senza framework',
  description:
    'Perché questo sito è un generatore statico Node scritto a mano invece di 11ty/Astro/Next, e tre bug reali emersi solo aprendo un browser vero.',
};

export const blocks = [
  {
    type: 'p',
    html: 'Questo sito — quello su cui stai leggendo — non ha alcun framework di build sotto il cofano. Niente 11ty, niente Astro, niente Next. <code>docs-app/build.mjs</code> è qualche centinaio di righe di Node puro che legge moduli di contenuto e funzioni template e scrive HTML/CSS/JS statico dentro <code>dist/</code>. È stata una lettura deliberata del vincolo della specifica, e ha prodotto la sua quota di bug molto reali, trovati tutti nello stesso modo: aprendo il sito in un browser vero.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'reading-the-constraint',
    text: 'Cosa significava davvero "niente framework"',
  },
  {
    type: 'p',
    html: "La specifica escludeva un framework a runtime per il sito consegnato — nulla lato client che faccia routing, hydration o rendering. Non escludeva un piccolo script eseguito in fase di build che trasforma contenuto strutturato in file statici, che è una cosa del tutto diversa da ciò che il browser di chi legge deve eseguire.",
  },
  {
    type: 'p',
    html: "<code>docs-app/src/lib/highlight.mjs</code> (un tokenizzatore a regex scritto a mano per l'evidenziazione della sintassi) e <code>src/scripts/search.js</code> (uno scorer di sottostringhe scritto a mano su un indice JSON precostruito) seguono la stessa lettura: niente Fuse.js, niente libreria di syntax highlighting lato client, tutto fatto in fase di build o con JavaScript vanilla puro.",
  },
  { type: 'heading', level: 2, id: 'content-as-data', text: 'Il contenuto è dato, non markup' },
  {
    type: 'p',
    html: "Ogni pagina di documentazione e del blog è un piccolo modulo <code>.mjs</code> che esporta <code>meta</code> e un array <code>blocks</code> — un piccolo DSL (<code>heading</code>/<code>p</code>/<code>list</code>/<code>code</code>/<code>callout</code>/...) che un'unica funzione <code>renderBlocks(blocks, lang)</code> trasforma in HTML. La stessa funzione estrae anche i chunk dell'indice di ricerca (uno per ogni heading) dalla stessa identica fonte usata per renderizzare la pagina, così contenuto e indice di ricerca non possono strutturalmente disallinearsi come accadrebbe con due fonti mantenute separatamente.",
  },
  { type: 'heading', level: 2, id: 'real-bugs', text: 'Tre bug trovati solo aprendo il browser' },
  {
    type: 'p',
    html: 'Nessuno di questi tre è emerso leggendo il codice. Tutti e tre sono stati scoperti navigando davvero sul sito renderizzato:',
  },
  {
    type: 'list',
    items: [
      "<strong>Icone SVG senza dimensione.</strong> L'icona di GitHub nell'header veniva renderizzata alla sua dimensione intrinseca grezza (~300×150) invece che a una normale dimensione da icona, perché nulla impostava una larghezza/altezza esplicita. Risolto con una regola difensiva di fallback, <code>svg { width: 1em; height: 1em; }</code>, in <code>base.css</code> — ogni icona ha comunque bisogno di una regola di dimensione esplicita da qualche parte, ma ora una mancante fallisce silenziosamente invece che in modo vistoso.",
      "<strong><code>IntersectionObserver</code> che lancia un <code>SyntaxError</code> silenzioso.</strong> Il primo tentativo per lo scroll-spy \"in questa pagina\" usava <code>rootMargin: '-5rem'</code>. <code>rootMargin</code> accetta solo pixel o percentuali, mai <code>rem</code> — il browser lancia un errore, ma solo in console, in nessun punto che un ricaricamento della pagina renderebbe visibile. È stato riscritto come un semplice listener di scroll throttlato con <code>requestAnimationFrame</code>, il che ha risolto anche un problema di UX: una voce del sommario ora resta attiva per tutto il tempo in cui la sua sezione è a schermo, non solo nell'istante in cui il suo heading attraversa il viewport.",
      "<strong>Un H1 in inglese hardcoded nella homepage italiana.</strong> Un bug di contenuto, non di logica — l'heading dell'hero aveva una stringa inglese incorporata anche quando si serviva <code>/it/</code>. Visibile solo caricando davvero la pagina italiana.",
    ],
  },
  {
    type: 'callout',
    kind: 'warning',
    title: 'Uno schema che merita un nome',
    html: 'Tutti e tre i bug sopra — più un quarto trovato successivamente (un pulsante "cancella" nativo e uno personalizzato entrambi renderizzati sul campo di ricerca) — condividono una proprietà: erano invisibili nel sorgente e visibili solo una volta renderizzati. Type checking e test unitari non intercettano una regola CSS di dimensione mancante o la violazione di un contratto di un\'API specifica del browser. È l\'argomento concreto, dalla storia stessa di questo progetto, per aprire davvero la pagina invece di fidarsi di un lint/type-check pulito.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'deliberate-non-decisions',
    text: 'Un compromesso deliberato: nessun redirect automatico di lingua',
  },
  {
    type: 'p',
    html: 'La lingua scelta persiste in <code>localStorage</code>, ma una pagina non corrispondente mostra solo un banner richiudibile ("Continue in English" / "Continua in italiano") — non fa mai un redirect forzato. Un redirect forzato è dannoso per i link diretti, rompe la navigazione all\'indietro, e ostacola attivamente i crawler che cercano di valutare correttamente i tag <code>hreflang</code>. È stato un compromesso consapevole tra comodità e correttezza, e ha vinto la correttezza.',
  },
  {
    type: 'p',
    html: "Questi tre non sono stati gli ultimi bug che questo sito ha prodotto allo stesso modo. Un giro successivo, dopo che il sito è andato davvero online, ne ha fatto emergere un'altra tornata, indipendente, raccontata <a href=\"what-the-phase-4-plan-couldnt-predict.html\">nel post sulla release</a> — una build pulita non è la stessa cosa di una pagina che funziona davvero, e a questo progetto è toccato impararlo due volte.",
  },
];
