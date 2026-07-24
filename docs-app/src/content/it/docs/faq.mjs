export const meta = {
  title: 'FAQ',
  description:
    'Domande frequenti su TinyDI: injection automatica, sovrascrittura delle registrazioni, lifetime scoped, child container.',
};

export const blocks = [
  {
    type: 'faq-list',
    items: [
      {
        id: 'faq-constructor-injection',
        q: 'TinyDI supporta la constructor injection automatica?',
        a: 'No, per scelta di design. Colleghi tu stesso gli argomenti del costruttore dentro una factory (<code>(c) => new UserService(c.resolve(UserRepositoryToken))</code>). Questo è il compromesso centrale di TinyDI: più codice esplicito, zero reflection.',
      },
      {
        id: 'faq-override-token',
        q: 'Posso registrare lo stesso token due volte, per sovrascriverlo?',
        a: 'Non direttamente — una seconda registrazione su un token già registrato lancia <code>RegistrationError</code>. Chiama prima <code>container.remove(token)</code> (oppure <code>container.clear()</code> per azzerare tutto), poi registra di nuovo. È utile per sostituire le implementazioni nei test.',
      },
      {
        id: 'faq-scoped',
        q: 'TinyDI supporta i lifetime scoped (per-request)?',
        a: "Non in questa versione — oggi esistono solo <code>Singleton</code> e <code>Transient</code>. Il design non preclude intenzionalmente l'aggiunta di un lifetime scoped in futuro, ma non fa parte dell'API attuale.",
      },
      {
        id: 'faq-child-containers',
        q: 'TinyDI supporta i child container?',
        a: 'Non in questa versione. Ogni <code>Container</code> è completamente autonomo e senza stato globale condiviso, il che lascia aperta la porta a una relazione parent/child in una versione futura, senza richiedere un redesign.',
      },
      {
        id: 'faq-node',
        q: 'TinyDI è legato a Node.js?',
        a: 'No — ha zero dipendenze a runtime e non usa API specifiche di Node, quindi gira senza modifiche su Bun, Deno e nel browser.',
      },
      {
        id: 'faq-async',
        q: 'Una factory può essere asincrona?',
        a: "<code>Factory&lt;T&gt;</code> è sincrona per scelta di design (<code>(container: Container) =&gt; T</code>). Se devi costruire qualcosa in modo asincrono, risolvi come servizio un valore che restituisce una promise (<code>Token&lt;Promise&lt;T&gt;&gt;</code>) e fai l'await al punto di chiamata — TinyDI al momento non offre un'API di risoluzione asincrona dedicata.",
      },
    ],
  },
];
