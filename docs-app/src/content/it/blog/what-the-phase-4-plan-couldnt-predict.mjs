export const meta = {
  title: 'Quello che il piano di rilascio non poteva prevedere: pubblicare per davvero',
  description:
    'Il nome del pacchetto npm bloccato proprio al momento della pubblicazione, lo stallo tra OTP e CI che ne è seguito, e alcuni bug del docs-app rivelati solo da traffico reale (o da un browser vero).',
};

export const blocks = [
  {
    type: 'p',
    html: "Tutti gli altri post di questa serie parlano di una decisione presa deliberatamente, in anticipo. Questo parla del contrario: tre cose andate storte solo nel momento in cui il progetto ha smesso di pianificare e ha davvero provato a pubblicare — un nome di pacchetto rifiutato, una pipeline CI che non riusciva ad autenticarsi, e alcuni bug del docs-app emersi solo con un deploy reale. Nessuna di queste era stata anticipata dalla fase che l'ha preceduta; tutte e tre erano reali, e tutte e tre sono state risolte nello stesso giorno.",
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-name',
    text: 'Il nome del pacchetto che npm view non poteva segnalare',
  },
  {
    type: 'p',
    html: '<code>npm view tinydi</code> restituiva un 404 durante la pianificazione — letto, ragionevolmente, come "il nome è libero". Al momento reale della pubblicazione, npm ha comunque rifiutato il nome non-scoped <code>tinydi</code>: non perché esistesse già, ma perché giudicato troppo simile al pacchetto preesistente <code>tiny-di</code>, secondo la policy anti-typosquatting di npm. <code>npm view</code> controlla solo una corrispondenza esatta del nome — non ha modo di segnalare un controllo di similarità che scatta solo al momento effettivo della pubblicazione.',
  },
  {
    type: 'p',
    html: 'La correzione è stata un rename completo a <strong><code>tinydi-container</code></strong> in ogni file che faceva riferimento al nome del pacchetto npm — entrambi i README, entrambe le lingue del docs-app, gli esempi, CONTRIBUTING.md — mantenendo deliberatamente "TinyDI" come nome del progetto e del brand ovunque altrove. È cambiato solo lo specificatore npm; nessuno importa <code>tinydi</code> e nessuno lo farà mai.',
  },
  { type: 'heading', level: 2, id: 'the-otp-standoff', text: 'Lo stallo tra 2FA/OTP e la CI' },
  {
    type: 'p',
    html: "La modalità a due fattori dell'account npm richiede un'approvazione interattiva via browser a ogni singola pubblicazione. È fondamentalmente incompatibile con un job CI non interattivo — nessun token, di alcuno scope, soddisfa un prompt OTP interattivo. <code>tinydi-container@0.1.1</code> è stato pubblicato manualmente, da una sessione locale autenticata, come unico modo per aggirare il problema per una prima release. Nell'inseguire un percorso automatizzato per la successiva sono emersi altri due problemi:",
  },
  {
    type: 'list',
    items: [
      "<code>changesets/action</code> legge il proprio token npm da una variabile d'ambiente chiamata letteralmente <code>NPM_TOKEN</code> — un workflow che invece la esportava come <code>NODE_AUTH_TOKEN</code> (la convenzione usata da <code>actions/setup-node</code> stesso) falliva silenziosamente invece che in modo vistoso, perché l'action ricadeva semplicemente su qualunque autenticazione riuscisse a trovare.",
      'Il Trusted Publishing (OIDC) di npm ha restituito brevemente un 404 sul passaggio di pubblicazione reale per una versione di pacchetto pubblicata così per la prima volta — una stranezza nota di npm quando si richiede la provenance per una versione mai pubblicata prima, non un problema di permessi.',
    ],
  },
  {
    type: 'p',
    html: 'La correzione definitiva è stata passare interamente al Trusted Publishing di npm: rimuovere <code>NPM_TOKEN</code> dal workflow del tutto (così non c\'è alcun token su cui ricadere silenziosamente), portare il job CI a npm CLI ≥11.5.1 tramite un passaggio esplicito di auto-aggiornamento (il Trusted Publishing lo richiede), e configurare una voce Trusted Publisher corrispondente su npmjs.com per esattamente questo repository e questo file di workflow. <code>tinydi-container@0.1.2</code> è stato pubblicato completamente in automatico attraverso questo percorso — PR "Version Packages" unita, workflow eseguito, pubblicazione reale, nessun passaggio OTP manuale. <code>RELEASE.md</code> ora documenta l\'intero runbook per chi curerà la prossima release.',
  },
  {
    type: 'callout',
    kind: 'warning',
    title: 'Il filo conduttore',
    html: 'Né il rifiuto del nome né i fallimenti dell\'OTP erano cose che una lettura attenta del piano avrebbe potuto cogliere in anticipo — entrambi esistono solo nel momento reale in cui si parla davvero con l\'infrastruttura di npm. "Ha funzionato in fase di pianificazione" e "funziona quando pubblichi davvero" si sono rivelate due affermazioni diverse.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'docs-app-bugs',
    text: 'Una seconda ondata, dopo che il sito è andato online',
  },
  {
    type: 'p',
    html: 'Un giro successivo sul sito di documentazione già pubblicato ha fatto emergere un\'altra serie di bug visibili solo in produzione, oltre ai tre già raccontati <a href="a-docs-site-without-a-framework.html">nel post sul sito di documentazione</a>:',
  },
  {
    type: 'list',
    items: [
      "<strong>Il pulsante di copia dei code block cancellava la propria icona.</strong> L'handler del click impostava <code>button.textContent</code> direttamente per mostrare \"Copied!\" — il che cancella silenziosamente l'icona <code>&lt;svg&gt;</code> accanto all'etichetta, dato che un SVG non contribuisce in alcun modo a <code>textContent</code>. L'icona non tornava più dopo il primo click. Risolto facendo scambiare il testo solo allo <code>&lt;span&gt;</code> dell'etichetta, mai al pulsante stesso.",
      '<strong>Dodici link interni assoluti, in sei file in entrambe le lingue.</strong> Link scritti come <code>href="/docs/lifetimes.html"</code> funzionano bene in sviluppo locale, dove <code>BASE_PATH</code> è vuoto — e danno 404 sul deploy reale su GitHub Pages, dove il sito è servito da <code>/TinyDI</code>. Invisibile finché il sito pubblicato non è stato davvero navigato con dei click.',
      "Le View Transitions cross-documento (<code>@view-transition { navigation: auto; }</code>) sono state provate per rendere più fluida la navigazione tra pagine e ritirate lo stesso giorno — anche la sola at-rule, senza alcuno stile personalizzato, lanciava un'eccezione reale in console a ogni navigazione se testata in un browser vero. Un tentativo di miglioramento, non un miglioramento rilasciato.",
    ],
  },
  {
    type: 'p',
    html: 'Nessuno di questi tre è stato intercettato da <code>npm run lint</code>, <code>npm run build</code>, o dalla suite di test — sempre tutti verdi. Sono stati scoperti navigando davvero le pagine pubblicate, la stessa lezione già insegnata dai bug precedenti del sito di documentazione, riconfermata da un secondo giro indipendente di bug reali.',
  },
  {
    type: 'p',
    html: "Se c'è una cosa da cambiare nel processo, più che nel codice, è questa: un giro manuale di verifica sul sito live dovrebbe seguire ogni deploy che tocca comportamento visibile all'utente, non solo il primo. Il primo lancio riceve attenzione per default, perché tutti lo stanno guardando da vicino; il quinto deploy no, ed è esattamente lì che una regressione come quella del pulsante di copia passerebbe inosservata.",
  },
];
