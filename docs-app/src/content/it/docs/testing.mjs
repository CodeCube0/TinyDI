export const meta = {
  title: 'Testing',
  description:
    'Come sostituire una dipendenza reale con una finta nei test — TypeScript puro, nessun framework di mocking, nessuna API di test specifica di TinyDI.',
};

const freshContainerExample = `import { Container, createToken } from 'tinydi-container';

interface IMailService {
  send(to: string, body: string): Promise<void>;
}

const MailServiceToken = createToken<IMailService>('MailService');

class FakeMailService implements IMailService {
  sent: { to: string; body: string }[] = [];
  async send(to: string, body: string): Promise<void> {
    this.sent.push({ to, body });
  }
}

let container: Container;
let mail: FakeMailService;

beforeEach(() => {
  container = new Container();
  mail = new FakeMailService();
  container.registerInstance(MailServiceToken, mail);
});

test('invia una email di benvenuto alla registrazione', async () => {
  await onSignup(container, 'user@example.com');
  expect(mail.sent).toHaveLength(1);
});`;

const swapMidTestExample = `// Più avanti nello stesso file di test, un altro test ha bisogno che
// l'implementazione reale fallisca, per verificare il percorso di errore:
container.remove(MailServiceToken);
container.registerInstance(MailServiceToken, new FailingMailService());`;

export const blocks = [
  {
    type: 'p',
    html: "TinyDI non ha un'API specifica per i test, e non ne ha bisogno. Registrazione e risoluzione sono semplici chiamate a metodo, quindi testare è normale TypeScript: costruisci un container, registra una finta implementazione al posto di quella reale, risolvi, verifica.",
  },
  { type: 'heading', level: 2, id: 'fresh-container-per-test', text: 'Un container nuovo per ogni test' },
  {
    type: 'p',
    html: "L'istanza in cache di un Singleton vive sul <code>Container</code> da cui è stata costruita, non in una variabile globale. Creare un nuovo <code>Container</code> nel setup di ogni test basta a garantire che nessuno stato sopravviva tra un test e l'altro — non esiste un passaggio <code>reset()</code> da ricordare.",
  },
  { type: 'code', lang: 'ts', code: freshContainerExample },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Nessuna libreria di mocking necessaria',
    html: "Una finta implementazione è solo una classe o un oggetto che implementa la stessa interfaccia — TypeScript la verifica strutturalmente in fase di compilazione, esattamente come l'implementazione reale. Non c'è nulla da importare oltre a <code>tinydi-container</code> stesso.",
  },
  { type: 'heading', level: 2, id: 'swapping-mid-test', text: 'Sostituire una finta implementazione a metà test' },
  {
    type: 'p',
    html: "<a href=\"container.html#has-remove-clear\"><code>remove()</code></a> esiste apposta per questo: registrare un token già registrato lancia <code>RegistrationError</code>, di proposito, quindi chiama <code>remove()</code> prima di ri-registrarlo con una finta implementazione diversa.",
  },
  { type: 'code', lang: 'ts', code: swapMidTestExample },
  { type: 'heading', level: 2, id: 'what-this-does-not-cover', text: 'Cosa non copre' },
  {
    type: 'p',
    html: "TinyDI non fornisce spy, conteggio delle chiamate o generazione automatica di mock. Abbinalo alla libreria di asserzioni del tuo test runner (l'<code>expect</code> di Vitest, l'<code>expect</code> di Jest, o simili) per quello — una finta implementazione registrata con <code>registerInstance</code> è un oggetto semplice, quindi qualsiasi libreria di asserzioni funziona su di essa senza modifiche.",
  },
];
