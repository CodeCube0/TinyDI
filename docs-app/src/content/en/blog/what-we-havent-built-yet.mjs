export const meta = {
  title: "What we haven't built yet (and why)",
  description:
    'Scoped lifetimes, child containers, async resolution and plugins are not in TinyDI today — a deliberate minimalism, not an oversight, and what it would take to add each one.',
};

export const blocks = [
  {
    type: 'p',
    html: 'TinyDI ships with exactly two lifetimes (<code>Singleton</code>, <code>Transient</code>), no child containers, no async resolution API, and no plugin system. None of these are accidental gaps — each one is a deliberate scope cut, made explicit in the core library\'s own source comments and expanded on in <a href="../docs/faq.html">the FAQ</a> and the project <code>ROADMAP.md</code>. This post is about the actual reasoning, not a vague "maybe later".',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-principle',
    text: 'The general rule: minimalism wins when it conflicts with future-proofing',
  },
  {
    type: 'p',
    html: 'Wherever staying minimal today and staying open to a specific future extension pulled in different directions, minimalism won — that was the explicit priority throughout the core library work. It is an easy priority to state and a harder one to hold to: "this would be useful" is true of almost any feature you could add to a DI container, which is exactly why it cannot be the bar.',
  },
  {
    type: 'p',
    html: 'What makes the cuts below defensible, rather than just "we ran out of time," is that each of the four extensions was checked against the current design and found to still be reachable without a breaking change. An irreversible scope cut is a much riskier bet than one you can still walk back later.',
  },
  { type: 'heading', level: 2, id: 'scoped', text: 'Scoped lifetime' },
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
    html: "A per-request or per-operation lifetime is the most commonly requested extension in reflection-based containers, and it's the one users ask about most (see the FAQ). It did not make it into this version because it changes the shape of resolution itself: <code>resolveFactory</code>'s singleton caching would need to become scope-aware instead of being a single boolean per registration. Mostly additive, but not free.",
  },
  { type: 'heading', level: 2, id: 'child-containers', text: 'Child containers' },
  {
    type: 'p',
    html: 'This one is nearly free, and it is free specifically because of the factory signature decision described in <a href="why-no-reflect-metadata.html">the reflect-metadata post</a>. Since a <code>Factory&lt;T&gt;</code> already receives the container explicitly rather than closing over module-level state, nothing internally assumes there is only ever one container instance in play. A parent/child relationship — a child falling back to its parent\'s registrations when it has none of its own — is additive on top of what exists today, not a redesign.',
  },
  { type: 'heading', level: 2, id: 'async', text: 'Async resolution' },
  {
    type: 'p',
    html: '<code>Factory&lt;T&gt;</code> is synchronous by design: <code>(container: Container) =&gt; T</code>, not <code>=&gt; Promise&lt;T&gt;</code>. This is the one extension of the four that genuinely is not free. Singleton caching today stores <code>T | undefined</code> plus a boolean flag; supporting async factories properly means also caching the in-flight <code>Promise&lt;T&gt;</code>, so two concurrent <code>resolve()</code> calls for the same not-yet-built singleton await the same promise instead of racing to build two instances. That is a real internal change to <code>resolveFactory</code>, not just an added method.',
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'The workaround today',
    html: 'You can resolve a promise-returning value as the service itself — <code>Token&lt;Promise&lt;T&gt;&gt;</code> — and await it at the call site. It works, but it does not get you the "await once, cache once" behavior a real async API would provide.',
  },
  { type: 'heading', level: 2, id: 'plugins', text: 'Plugins' },
  {
    type: 'p',
    html: 'A plugin system is the most "free" of the four: a plugin would just be a function that calls <code>registerInstance</code>/<code>registerFactory</code> on a container it\'s handed, using only public API that already exists. Fully additive, no internal change required — it just hasn\'t been built because nothing in the current scope needs it yet.',
  },
  { type: 'heading', level: 2, id: 'why-this-matters', text: 'Why write this down at all' },
  {
    type: 'p',
    html: 'A roadmap that just lists feature names ("Scoped", "Child Containers", "Async", "Plugins") reads as a wish list. Stating for each one whether it\'s additive or requires a redesign is a more honest signal to anyone deciding whether to depend on TinyDI today: three of these four extensions can land as 2.x-style additions without breaking existing code; one of them (async) is an open question that would need real design work before it ships.',
  },
  {
    type: 'p',
    html: 'That distinction matters more than the feature list itself, and it generalizes past this one library: any project keeping a "not yet" list should be able to say, for each item, whether it is additive or would need a redesign. If you cannot say which, you do not actually know what that scope cut is costing you.',
  },
];
