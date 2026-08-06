export const meta = {
  title: 'Why no reflect-metadata',
  description:
    'The "explicit over magic" call behind TinyDI: what reflection-based DI buys you, what it costs, and why we wired dependencies by hand instead.',
};

export const blocks = [
  {
    type: 'p',
    html: 'The very first constraint in the TinyDI spec was not a feature — it was a prohibition: no <code>reflect-metadata</code>, no decorators, no automatic constructor injection, no class scanning. Everything most popular TypeScript DI containers (TSyringe, InversifyJS) are built around was explicitly off the table. This post is about why, and what that trade-off actually looks like once the container is built.',
  },
  { type: 'heading', level: 2, id: 'the-problem', text: 'What reflection-based DI buys you' },
  {
    type: 'p',
    html: "TSyringe and InversifyJS let you write a class, sprinkle it with <code>@injectable()</code>/<code>@inject()</code> decorators, and have the container inspect the constructor's parameter types at runtime (via <code>reflect-metadata</code> and TypeScript's <code>emitDecoratorMetadata</code>) to build the whole dependency graph for you. You never write <code>new UserService(repo, logger)</code> yourself — the container discovers what a class needs and supplies it.",
  },
  {
    type: 'p',
    html: 'That is genuinely convenient for large graphs of classes. It is also not free: it requires a specific compiler flag most modern TypeScript setups (especially anything targeting <code>isolatedModules</code> or a non-<code>tsc</code> transpiler like esbuild/SWC) do not enable by default, a runtime-only metadata polyfill, and a way of wiring dependencies that is invisible unless you already know the decorator is there.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-decision',
    text: 'The decision: pass the container explicitly',
  },
  {
    type: 'p',
    html: "TinyDI's factories receive the container as an explicit argument instead of capturing it from a closure or having it injected via reflection:",
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
    html: "Every dependency a service needs shows up as a <code>c.resolve(...)</code> call, right there in the factory body. There is no step where the container silently figures out what to pass — you always see it. This is the entire idea behind TinyDI's tagline, <em>explicit over magic</em>.",
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'Consequences and trade-offs' },
  {
    type: 'p',
    html: 'The trade-off is real, not just rhetorical, and it shows up in two concrete places we hit while building the rest of the project.',
  },
  {
    type: 'p',
    html: 'First: <a href="detecting-circular-dependencies.html">circular dependency detection</a>. Because every resolution goes through the same explicit <code>resolve()</code> call, tracking which token is currently being built is just an array push/pop around a function call — no need to reconstruct an implicit dependency graph from decorator metadata.',
  },
  {
    type: 'p',
    html: 'Second: framework integration. Each of the seven <a href="../docs/examples.html">examples</a> — including Vue, Nuxt and React — bridges TinyDI into that framework\'s own DI-like mechanism (<code>provide</code>/<code>inject</code>, a Nuxt plugin, React Context) with a few lines of hand-written adapter code. A reflection-based container would need framework-specific knowledge of how each of those systems constructs objects; ours doesn\'t need to know anything about them at all. Neither of these was the point of the decision — they were a consequence of it, discovered after the fact rather than designed for in advance.',
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'What you give up',
    html: 'You do write more code: every constructor argument is spelled out at the registration site instead of inferred from parameter types. For a handful of services this is a non-issue; for a very large graph of classes, it is the actual cost of this design. TinyDI\'s bet is that explicitness pays for itself in debuggability and framework independence — see <a href="../docs/comparison.html">Comparison</a> for the fuller TSyringe/InversifyJS trade-off table.',
  },
];
