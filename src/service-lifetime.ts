/**
 * Defines the lifetime of a service registered in a {@link Container}.
 *
 * TinyDI intentionally supports only two lifetimes in this version. A
 * `Scoped` lifetime is a natural future extension (per-request/per-operation
 * instances), but it is not implemented here — see the project ROADMAP.
 *
 * @example
 * ```ts
 * container.registerFactory(LoggerToken, () => new ConsoleLogger(), ServiceLifetime.Singleton);
 * container.registerFactory(RequestIdToken, () => crypto.randomUUID(), ServiceLifetime.Transient);
 * ```
 */
export enum ServiceLifetime {
  /**
   * A single instance is created on first resolution and reused for every
   * subsequent `resolve()` call on the same container. This is the default
   * lifetime used by {@link Container.registerFactory} when none is given.
   */
  Singleton,

  /**
   * A new instance is created on every `resolve()` call.
   */
  Transient,
}
