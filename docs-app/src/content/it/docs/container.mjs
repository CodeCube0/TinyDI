export const meta = {
  title: 'Container',
  description:
    'Ogni metodo di Container: registerInstance, registerFactory, resolve, has, remove, clear.',
};

export const blocks = [
  {
    type: 'p',
    html: "<code>Container</code> è l'unica classe che TinyDI ha. Un'istanza possiede un insieme di registrazioni, indicizzate per token.",
  },
  { type: 'code', lang: 'ts', code: 'const container = new Container();' },
  { type: 'heading', level: 2, id: 'registerinstance', text: 'registerInstance' },
  {
    type: 'p',
    html: "Registra un'istanza già creata. È sempre trattata come Singleton — ogni chiamata a <code>resolve()</code> restituisce esattamente quell'oggetto.",
  },
  {
    type: 'code',
    lang: 'ts',
    code: `const ConfigToken = createToken<Config>('Config');
container.registerInstance(ConfigToken, { apiUrl: 'https://example.com' });`,
  },
  { type: 'heading', level: 2, id: 'registerfactory', text: 'registerFactory' },
  {
    type: 'p',
    html: 'Registra una factory usata per costruire il servizio in modo lazy, alla prima risoluzione. La factory riceve il container stesso, così può risolvere le proprie dipendenze in modo esplicito.',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.registerFactory(
  UserServiceToken,
  (c) => new UserService(c.resolve(UserRepositoryToken)),
);`,
  },
  {
    type: 'p',
    html: 'Il terzo argomento, opzionale, è un <a href="/it/docs/lifetimes.html"><code>ServiceLifetime</code></a> — di default è <code>Singleton</code>.',
  },
  { type: 'heading', level: 2, id: 'resolve', text: 'resolve' },
  {
    type: 'p',
    html: 'Risolve il servizio registrato sotto un token, completamente tipizzato senza generic esplicito.',
  },
  { type: 'code', lang: 'ts', code: 'const userService = container.resolve(UserServiceToken);' },
  {
    type: 'callout',
    kind: 'warning',
    title: 'Casi limite',
    html: 'Lancia <code>ResolutionError</code> se il token non è mai stato registrato, e <code>CircularDependencyError</code> se risolverlo richiederebbe di risolvere se stesso di nuovo — vedi <a href="/it/docs/api-reference.html#errors">API Reference</a> per la forma esatta degli errori.',
  },
  { type: 'heading', level: 2, id: 'has-remove-clear', text: 'has, remove, clear' },
  {
    type: 'p',
    html: "Gestisci direttamente l'insieme delle registrazioni: <code>has(token)</code> controlla se un token è registrato, <code>remove(token)</code> rimuove una singola registrazione, e <code>clear()</code> le rimuove tutte.",
  },
  {
    type: 'code',
    lang: 'ts',
    code: `container.has(ConfigToken); // true

container.remove(ConfigToken);
container.has(ConfigToken); // false

container.clear(); // rimuove tutte le registrazioni`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Sostituire una registrazione',
    html: "Registrare un token già registrato lancia <code>RegistrationError</code>, di proposito. Chiama prima <code>remove()</code> — utile deliberatamente per sostituire un'implementazione finta tra un test e l'altro.",
  },
];
