export const meta = {
  title: 'Token',
  description:
    "Come funziona il sistema di token type-safe di TinyDI, e perché l'identità è un symbol, non una stringa.",
};

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI identifica i servizi con dei <strong>token</strong>, non con stringhe o classi. Un token viene creato una volta sola, e usato sia per registrare un servizio sia per risolverlo.',
  },
  { type: 'heading', level: 2, id: 'creating-a-token', text: 'Creare un token' },
  {
    type: 'code',
    lang: 'ts',
    code: `interface IMailService {
  send(to: string, body: string): Promise<void>;
}

const MailServiceToken = createToken<IMailService>('MailService');`,
  },
  {
    type: 'p',
    html: "<code>createToken&lt;T&gt;(description)</code> restituisce un <code>Token&lt;T&gt;</code>. La stringa <code>description</code> è un'etichetta leggibile usata solo nei messaggi di errore — non deve essere univoca.",
  },
  { type: 'heading', level: 2, id: 'symbol-identity', text: 'Perché un symbol, non una stringa' },
  {
    type: 'p',
    html: 'Ogni token racchiude un <code>symbol</code> JavaScript univoco come sua vera identità. Due token creati con la stessa description restano comunque due registrazioni distinte:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `const a = createToken<string>('Name');
const b = createToken<string>('Name');

a.symbol !== b.symbol; // true — token distinti, nessuna collisione`,
  },
  {
    type: 'p',
    html: "Questo elimina un'intera categoria di bug che i container basati su stringhe devono gestire con attenzione: due moduli non correlati che scelgono per caso lo stesso identificatore stringa per servizi diversi.",
  },
  { type: 'heading', level: 2, id: 'type-inference', text: 'Inferenza di tipo senza generics' },
  {
    type: 'p',
    html: 'Il tipo del servizio <code>T</code> è trasportato dal token stesso, tramite una proprietà opzionale <code>__type?: T</code> che esiste solo a livello di tipo — non viene mai assegnata né letta a runtime. Grazie a questo, <code>container.resolve(token)</code> inferisce automaticamente il tipo di ritorno esatto:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `// Nessun generic esplicito necessario — inferito come IMailService.
const mailService = container.resolve(MailServiceToken);`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: "Tipizza il tuo token con un'interfaccia",
    html: "Parametrizza sempre <code>createToken</code> con un'interfaccia (<code>IMailService</code>), non con una classe concreta. Il codice che dipende da <code>MailServiceToken</code> non dovrebbe mai aver bisogno di importare l'implementazione concreta che c'è dietro.",
  },
];
