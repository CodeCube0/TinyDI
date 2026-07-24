export const meta = {
  title: 'FAQ',
  description:
    'Frequently asked questions about TinyDI: automatic injection, overriding registrations, scoped lifetimes, child containers.',
};

export const blocks = [
  {
    type: 'faq-list',
    items: [
      {
        id: 'faq-constructor-injection',
        q: 'Does TinyDI support automatic constructor injection?',
        a: 'No, by design. You wire up constructor arguments yourself inside a factory (<code>(c) => new UserService(c.resolve(UserRepositoryToken))</code>). This is the core trade-off TinyDI makes: more explicit code, no reflection.',
      },
      {
        id: 'faq-override-token',
        q: 'Can I register the same token twice, to override it?',
        a: 'Not directly — a second registration on an already-registered token throws <code>RegistrationError</code>. Call <code>container.remove(token)</code> first (or <code>container.clear()</code> to reset everything), then register again. This is useful for swapping implementations in tests.',
      },
      {
        id: 'faq-scoped',
        q: 'Does TinyDI support scoped (per-request) lifetimes?',
        a: "Not in this version — only <code>Singleton</code> and <code>Transient</code> exist today. The design intentionally doesn't preclude adding a scoped lifetime later, but it isn't part of the current API.",
      },
      {
        id: 'faq-child-containers',
        q: 'Does TinyDI support child containers?',
        a: 'Not in this version. Each <code>Container</code> is fully self-contained with no shared global state, which leaves the door open for a parent/child relationship in a future version without requiring a redesign.',
      },
      {
        id: 'faq-node',
        q: 'Is TinyDI tied to Node.js?',
        a: 'No — it has zero runtime dependencies and uses no Node-specific APIs, so it runs unmodified on Bun, Deno and in the browser.',
      },
      {
        id: 'faq-async',
        q: 'Can a factory be asynchronous?',
        a: '<code>Factory&lt;T&gt;</code> is synchronous by design (<code>(container: Container) =&gt; T</code>). If you need to build something asynchronously, resolve a promise-returning value as the service itself (<code>Token&lt;Promise&lt;T&gt;&gt;</code>) and await it at the call site — TinyDI does not currently ship a dedicated async resolution API.',
      },
    ],
  },
];
