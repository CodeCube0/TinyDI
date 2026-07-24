import type { Token } from './token.js';

/**
 * Base class for every error thrown by TinyDI's {@link Container}.
 *
 * Catch this type to handle any DI-related failure without having to
 * enumerate every concrete subclass.
 *
 * @example
 * ```ts
 * try {
 *   container.resolve(SomeToken);
 * } catch (error) {
 *   if (error instanceof ContainerError) {
 *     console.error(`DI failure for "${error.token?.description}": ${error.message}`);
 *   }
 * }
 * ```
 */
export abstract class ContainerError extends Error {
  /**
   * @param message - A clear, human-readable description of the failure.
   * @param token - The token involved in the failure, when applicable.
   */
  protected constructor(
    message: string,
    public readonly token?: Token<unknown>,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a registration operation cannot be completed, for example
 * when registering a token that is already registered in the container.
 *
 * @example
 * ```ts
 * const token = createToken<string>('Greeting');
 * container.registerInstance(token, 'hello');
 * container.registerInstance(token, 'hi'); // throws RegistrationError
 * ```
 */
export class RegistrationError extends ContainerError {
  /**
   * @param token - The token that could not be registered.
   * @param message - A clear, human-readable description of the failure.
   */
  constructor(token: Token<unknown>, message: string) {
    super(message, token);
  }
}

/**
 * Thrown by {@link Container.resolve} when the requested token has no
 * matching registration.
 *
 * @example
 * ```ts
 * const token = createToken<string>('Missing');
 * container.resolve(token); // throws ResolutionError
 * ```
 */
export class ResolutionError extends ContainerError {
  /**
   * @param token - The token that could not be resolved.
   * @param message - A clear, human-readable description of the failure.
   */
  constructor(token: Token<unknown>, message: string) {
    super(message, token);
  }
}

/**
 * Thrown by {@link Container.resolve} when resolving a token would require
 * resolving itself again, directly or transitively (e.g. A -> B -> C -> A).
 *
 * The error message renders the full dependency path that produced the
 * cycle, in the form:
 *
 * ```text
 * Circular dependency detected:
 *
 * A
 *  -> B
 *  -> C
 *  -> A
 * ```
 */
export class CircularDependencyError extends ContainerError {
  /** The full chain of tokens that produced the cycle, in resolution order. */
  public readonly path: readonly Token<unknown>[];

  /**
   * @param path - The chain of tokens being resolved when the cycle was
   * detected, ending with the token that closes the cycle (i.e. the first
   * and last entries share the same token).
   */
  constructor(path: Token<unknown>[]) {
    super(`Circular dependency detected:\n\n${CircularDependencyError.formatPath(path)}`, path[0]);
    this.path = path;
  }

  private static formatPath(path: Token<unknown>[]): string {
    return path
      .map((token, index) => (index === 0 ? token.description : ` -> ${token.description}`))
      .join('\n');
  }
}
