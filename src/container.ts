import { CircularDependencyError, RegistrationError, ResolutionError } from './errors.js';
import { ServiceLifetime } from './service-lifetime.js';
import type { Token } from './token.js';

/**
 * A factory function that builds an instance of `T`, given the container it
 * was resolved from. Receiving the container explicitly (rather than
 * capturing it implicitly) keeps dependency wiring visible at the call site
 * and lets the container track resolution paths for circular dependency
 * detection.
 *
 * @example
 * ```ts
 * container.registerFactory(UserServiceToken, (c) => new UserService(c.resolve(DatabaseToken)));
 * ```
 */
export type Factory<T> = (container: Container) => T;

interface InstanceRegistration<T> {
  readonly kind: 'instance';
  readonly token: Token<T>;
  readonly value: T;
}

interface FactoryRegistration<T> {
  readonly kind: 'factory';
  readonly token: Token<T>;
  readonly factory: Factory<T>;
  readonly lifetime: ServiceLifetime;
  cachedInstance: T | undefined;
  hasCachedInstance: boolean;
}

type Registration<T> = InstanceRegistration<T> | FactoryRegistration<T>;

/**
 * A minimal, type-safe Dependency Injection container.
 *
 * TinyDI is explicit by design: there is no reflection, no decorators and no
 * automatic constructor injection. Every dependency is wired by hand through
 * {@link Container.registerInstance} or {@link Container.registerFactory},
 * and resolved through {@link Container.resolve}.
 *
 * @example
 * ```ts
 * const container = new Container();
 *
 * const LoggerToken = createToken<Logger>('Logger');
 * container.registerInstance(LoggerToken, new ConsoleLogger());
 *
 * const UserServiceToken = createToken<UserService>('UserService');
 * container.registerFactory(UserServiceToken, (c) => new UserService(c.resolve(LoggerToken)));
 *
 * const userService = container.resolve(UserServiceToken);
 * ```
 */
export class Container {
  private readonly registrations = new Map<symbol, Registration<unknown>>();
  private readonly resolutionPath: Token<unknown>[] = [];

  /**
   * Registers an already-created instance under the given token. The
   * instance is always treated as a Singleton: every `resolve()` call
   * returns the exact same object.
   *
   * @param token - The token identifying the service.
   * @param instance - The instance to return on every resolution.
   * @throws {RegistrationError} If `token` is already registered.
   *
   * @example
   * ```ts
   * const ConfigToken = createToken<Config>('Config');
   * container.registerInstance(ConfigToken, { apiUrl: 'https://example.com' });
   * ```
   */
  public registerInstance<T>(token: Token<T>, instance: T): void {
    this.assertNotRegistered(token);
    this.registrations.set(token.symbol, {
      kind: 'instance',
      token,
      value: instance,
    } satisfies InstanceRegistration<T>);
  }

  /**
   * Registers a factory used to lazily build the service on resolution.
   *
   * @param token - The token identifying the service.
   * @param factory - A function that builds the instance, receiving the
   * container so it can resolve the service's own dependencies.
   * @param lifetime - `ServiceLifetime.Singleton` (default) reuses the first
   * built instance for every subsequent resolution; `ServiceLifetime.Transient`
   * builds a new instance on every `resolve()` call.
   * @throws {RegistrationError} If `token` is already registered.
   *
   * @example
   * ```ts
   * container.registerFactory(ClockToken, () => new SystemClock());
   * container.registerFactory(RequestIdToken, () => crypto.randomUUID(), ServiceLifetime.Transient);
   * ```
   */
  public registerFactory<T>(
    token: Token<T>,
    factory: Factory<T>,
    lifetime: ServiceLifetime = ServiceLifetime.Singleton,
  ): void {
    this.assertNotRegistered(token);
    this.registrations.set(token.symbol, {
      kind: 'factory',
      token,
      factory,
      lifetime,
      cachedInstance: undefined,
      hasCachedInstance: false,
    } satisfies FactoryRegistration<T>);
  }

  /**
   * Resolves the service registered under the given token.
   *
   * @param token - The token identifying the service to resolve.
   * @returns The resolved instance, typed as `T` without an explicit generic.
   * @throws {ResolutionError} If `token` has no registration.
   * @throws {CircularDependencyError} If resolving `token` requires resolving
   * itself again, directly or transitively.
   *
   * @example
   * ```ts
   * const mailService = container.resolve(MailServiceToken); // typed as IMailService
   * ```
   */
  public resolve<T>(token: Token<T>): T {
    const registration = this.registrations.get(token.symbol) as Registration<T> | undefined;
    if (!registration) {
      throw new ResolutionError(
        token,
        `No registration found for token "${token.description}". ` +
          'Register it with registerInstance() or registerFactory() before resolving it.',
      );
    }

    if (registration.kind === 'instance') {
      return registration.value;
    }

    return this.resolveFactory(registration);
  }

  private resolveFactory<T>(registration: FactoryRegistration<T>): T {
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
  }

  /**
   * Checks whether a token has a registration in this container.
   *
   * @param token - The token to check.
   * @returns `true` if the token is registered, `false` otherwise.
   *
   * @example
   * ```ts
   * if (!container.has(LoggerToken)) {
   *   container.registerInstance(LoggerToken, new ConsoleLogger());
   * }
   * ```
   */
  public has(token: Token<unknown>): boolean {
    return this.registrations.has(token.symbol);
  }

  /**
   * Removes the registration for the given token, if present. Resolving the
   * token afterwards throws {@link ResolutionError} until it is registered
   * again.
   *
   * @param token - The token whose registration should be removed.
   *
   * @example
   * ```ts
   * container.remove(LoggerToken);
   * container.has(LoggerToken); // false
   * ```
   */
  public remove(token: Token<unknown>): void {
    this.registrations.delete(token.symbol);
  }

  /**
   * Removes every registration from this container, resetting it to an
   * empty state.
   *
   * @example
   * ```ts
   * container.clear();
   * container.has(LoggerToken); // false
   * ```
   */
  public clear(): void {
    this.registrations.clear();
  }

  private assertNotRegistered(token: Token<unknown>): void {
    if (this.registrations.has(token.symbol)) {
      throw new RegistrationError(
        token,
        `Token "${token.description}" is already registered. ` +
          'Call remove() first to replace it, or clear() to reset the container.',
      );
    }
  }
}
