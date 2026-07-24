import { describe, expect, it } from 'vitest';
import { Container } from '../src/container.js';
import { CircularDependencyError } from '../src/errors.js';
import { createToken } from '../src/token.js';

describe('circular dependency detection', () => {
  it('detects a direct self-cycle (A -> A)', () => {
    const container = new Container();
    const aToken = createToken<unknown>('A');

    container.registerFactory(aToken, (c) => c.resolve(aToken));

    expect(() => container.resolve(aToken)).toThrow(CircularDependencyError);
  });

  it('detects a transitive cycle (A -> B -> C -> A) with the exact message format', () => {
    const container = new Container();
    const aToken = createToken<unknown>('A');
    const bToken = createToken<unknown>('B');
    const cToken = createToken<unknown>('C');

    container.registerFactory(aToken, (c) => ({ b: c.resolve(bToken) }));
    container.registerFactory(bToken, (c) => ({ c: c.resolve(cToken) }));
    container.registerFactory(cToken, (c) => ({ a: c.resolve(aToken) }));

    let thrown: CircularDependencyError | undefined;
    try {
      container.resolve(aToken);
    } catch (error) {
      thrown = error as CircularDependencyError;
    }

    expect(thrown).toBeInstanceOf(CircularDependencyError);
    expect(thrown?.message).toBe('Circular dependency detected:\n\nA\n -> B\n -> C\n -> A');
    expect(thrown?.path.map((t) => t.description)).toEqual(['A', 'B', 'C', 'A']);
  });

  it('does not falsely flag diamond-shaped, non-circular dependency graphs', () => {
    const container = new Container();
    const sharedToken = createToken<string>('Shared');
    const leftToken = createToken<string>('Left');
    const rightToken = createToken<string>('Right');
    const topToken = createToken<string>('Top');

    container.registerFactory(sharedToken, () => 'shared');
    container.registerFactory(leftToken, (c) => `left(${c.resolve(sharedToken)})`);
    container.registerFactory(rightToken, (c) => `right(${c.resolve(sharedToken)})`);
    container.registerFactory(
      topToken,
      (c) => `top(${c.resolve(leftToken)}, ${c.resolve(rightToken)})`,
    );

    expect(container.resolve(topToken)).toBe('top(left(shared), right(shared))');
  });

  it('allows resolving the same singleton twice sequentially without false positives', () => {
    const container = new Container();
    const token = createToken<object>('Reusable');
    container.registerFactory(token, () => ({}));

    const first = container.resolve(token);
    const second = container.resolve(token);

    expect(first).toBe(second);
  });

  it('recovers cleanly after a circular dependency error, allowing further resolutions', () => {
    const container = new Container();
    const aToken = createToken<unknown>('A');
    const bToken = createToken<unknown>('B');
    const okToken = createToken<string>('Ok');

    container.registerFactory(aToken, (c) => c.resolve(bToken));
    container.registerFactory(bToken, (c) => c.resolve(aToken));
    container.registerFactory(okToken, () => 'fine');

    expect(() => container.resolve(aToken)).toThrow(CircularDependencyError);
    expect(container.resolve(okToken)).toBe('fine');
  });
});
