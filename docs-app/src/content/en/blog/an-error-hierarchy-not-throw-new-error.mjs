export const meta = {
  title: 'An error hierarchy, instead of throw new Error(...)',
  description:
    'Why TinyDI has ContainerError, RegistrationError, ResolutionError and CircularDependencyError instead of one generic error type, and what that decision actually implied.',
};

export const blocks = [
  {
    type: 'p',
    html: "The easiest way to signal a failure in a small library is <code>throw new Error('something went wrong')</code>. TinyDI instead has a small class hierarchy: an abstract <code>ContainerError</code> base, and three concrete subclasses — <code>RegistrationError</code>, <code>ResolutionError</code>, <code>CircularDependencyError</code>. The interesting part of this story is not the hierarchy itself, it is a design decision the spec implied but never spelled out.",
  },
  { type: 'heading', level: 2, id: 'the-hierarchy', text: 'The hierarchy' },
  {
    type: 'code',
    lang: 'ts',
    code: `export abstract class ContainerError extends Error {
  protected constructor(
    message: string,
    public readonly token?: Token<unknown>,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RegistrationError extends ContainerError { /* ... */ }
export class ResolutionError extends ContainerError { /* ... */ }
export class CircularDependencyError extends ContainerError { /* ... */ }`,
  },
  {
    type: 'p',
    html: '<code>ContainerError</code> carries the <code>Token</code> involved in the failure (when there is one), so a catch-all handler can log which token caused the problem without caring which concrete subclass it caught:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `try {
  container.resolve(SomeToken);
} catch (error) {
  if (error instanceof ContainerError) {
    console.error(\`DI failure for "\${error.token?.description}": \${error.message}\`);
  }
}`,
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-real-decision',
    text: 'The decision the spec left implicit',
  },
  {
    type: 'p',
    html: 'The task spec named <code>RegistrationError</code> as part of the expected hierarchy, but it never said exactly when it should fire. The obvious design question: what happens when you register the same token twice? Two reasonable answers exist — silently let the second registration win ("last write wins", the more permissive option), or throw. TinyDI throws:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `private assertNotRegistered(token: Token<unknown>): void {
  if (this.registrations.has(token.symbol)) {
    throw new RegistrationError(
      token,
      \`Token "\${token.description}" is already registered. \` +
        'Call remove() first to replace it, or clear() to reset the container.',
    );
  }
}`,
  },
  {
    type: 'p',
    html: 'This was a deliberate choice, not the only reasonable one: a class of error the spec had declared but not described still needed a design decision to actually be honored as a public contract, rather than left to whatever the implementation happened to do first.',
  },
  {
    type: 'p',
    html: 'Silent overwrite is a footgun in a DI container. Accidentally registering the same token twice — once in application code, once in a test setup that forgot to clean up, most commonly — is exactly the kind of bug that is loud and obvious the moment it happens with an explicit throw, and silent and hard to trace if the second registration just wins. Throwing costs a little convenience; letting it slide costs a debugging session weeks later, tracing why the wrong implementation is somehow the one that got resolved.',
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'The escape hatch',
    html: 'Because overwriting throws, swapping an implementation — most commonly in tests — requires an explicit <code>container.remove(token)</code> (or <code>container.clear()</code>) before registering again. That extra step is the cost of this decision; it also means "I meant to replace this" is always visible in the code as its own line, not implicit in a second registration call.',
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'What this means for consumers' },
  {
    type: 'p',
    html: 'A four-class hierarchy over a flat <code>Error</code> is a small amount of extra code, but it lets consumers branch on failure kind when they need to (e.g. treat a <code>ResolutionError</code> for an optional service differently from a <code>RegistrationError</code> surfaced during app bootstrap) while still being able to catch everything DI-related with one <code>instanceof ContainerError</code> check. <code>CircularDependencyError</code>, the fourth subclass, gets <a href="detecting-circular-dependencies.html">its own post</a> — the interesting part there was not the class itself but the message format. See the <a href="../docs/api-reference.html">API Reference</a> for the full error surface.',
  },
];
