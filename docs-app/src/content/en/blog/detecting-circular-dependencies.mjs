export const meta = {
  title: 'Detecting circular dependencies',
  description:
    'How TinyDI catches A -> B -> C -> A at resolution time with a simple resolution-path stack, and why the error message format was designed the way it is.',
};

export const blocks = [
  {
    type: 'p',
    html: 'A circular dependency happens when resolving service A requires resolving B, which requires resolving C, which requires resolving A again — a cycle that, left unchecked, recurses until the stack overflows with an error message that tells you nothing about which services are actually involved. Detecting the cycle early, and reporting exactly which tokens form it, was one of the two problems in the core library that needed real design thought (the other is covered in <a href="type-safe-tokens-without-generics.html">the tokens post</a>).',
  },
  {
    type: 'heading',
    level: 2,
    id: 'how-it-works',
    text: 'How detection works: a resolution-path stack',
  },
  {
    type: 'p',
    html: 'Because every factory receives the container explicitly (see <a href="why-no-reflect-metadata.html">the reflect-metadata post</a>) instead of resolving dependencies through some implicit mechanism, the container always knows exactly which token is currently mid-resolution. It keeps a simple array, <code>resolutionPath</code>, and pushes the current token onto it before invoking a factory, popping it back off when the factory returns:',
  },
  {
    type: 'code',
    lang: 'ts',
    code: `private resolveFactory<T>(registration: FactoryRegistration<T>): T {
  if (registration.lifetime === ServiceLifetime.Singleton && registration.hasCachedInstance) {
    return registration.cachedInstance as T;
  }

  const cycleStartIndex = this.resolutionPath.findIndex(
    (pathToken) => pathToken.symbol === registration.token.symbol,
  );
  if (cycleStartIndex !== -1) {
    throw new CircularDependencyError([...this.resolutionPath, registration.token]);
  }

  this.resolutionPath.push(registration.token);
  try {
    const instance = registration.factory(this);
    if (registration.lifetime === ServiceLifetime.Singleton) {
      registration.cachedInstance = instance;
      registration.hasCachedInstance = true;
    }
    return instance;
  } finally {
    this.resolutionPath.pop();
  }
}`,
  },
  {
    type: 'p',
    html: 'If the token about to be resolved is already somewhere in <code>resolutionPath</code>, we are mid-way through resolving it already — that is the cycle. The <code>try</code>/<code>finally</code> guarantees the token is popped even if the factory throws, so a failed resolution never leaves a stale entry behind for the next, unrelated <code>resolve()</code> call.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-error-format',
    text: 'The part that actually took iteration: the error format',
  },
  {
    type: 'p',
    html: 'Detecting the cycle was the easy half. The harder question was what the resulting error message should look like — a stack trace pointing at <code>resolveFactory</code> is useless to a developer who needs to know <em>which services</em> form the loop. The chosen format renders the full chain, one token per line, with every entry after the first prefixed by an arrow:',
  },
  {
    type: 'code',
    lang: 'text',
    code: `Circular dependency detected:

A
 -> B
 -> C
 -> A`,
  },
  {
    type: 'code',
    lang: 'ts',
    code: `private static formatPath(path: Token<unknown>[]): string {
  return path
    .map((token, index) => (index === 0 ? token.description : \` -> \${token.description}\`))
    .join('\\n');
}`,
  },
  {
    type: 'p',
    html: 'The first token is unprefixed; every subsequent one — including the repeated closing token that shows where the cycle actually closes — gets the <code>-&gt;</code> prefix. That last, repeated entry matters: without it, the message reads as a straight line A → B → C, and the reader has to infer for themselves that C also depends on A. Repeating it makes the loop visible without requiring the reader to hold the whole chain in their head.',
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Tested as an exact string, not just "contains"',
    html: 'The test suite asserts this exact format with a full string-equality check, not a looser <code>toContain()</code>. A looser assertion would happily pass even if the arrow prefix silently disappeared from the first token, or the closing token stopped repeating — regressions that would only show up to an actual developer reading a real error, not to the test suite.',
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'Why this is worth a whole post' },
  {
    type: 'p',
    html: "This is a small function — a dozen lines, no clever algorithm — but it is a good example of where the real cost of a feature sits. Detecting <em>that</em> a cycle exists took one <code>findIndex</code> call; deciding <em>how to explain it</em> to a human took the rest of the design effort, and it's the part that actually determines whether the error is useful the day someone hits it in a real codebase.",
  },
];
