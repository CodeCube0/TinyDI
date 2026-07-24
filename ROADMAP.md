# TinyDI Roadmap

This document describes where TinyDI is today and where it's headed. It's a
statement of intent, not a commitment to dates — items move as design work and
real-world feedback justify them. See [CONTRIBUTING.md](CONTRIBUTING.md) if
you'd like to help with any of this.

For each 2.x/3.x item we note whether the current core architecture (`src/`,
as of the 1.x line) already supports it without a breaking change, or whether
it needs internal revision first.

## TinyDI 1.x — current

- `Singleton` and `Transient` service lifetimes.
- Type-safe tokens (`createToken<T>`), with type inference on `resolve()`
  requiring no explicit generic.
- `Container` API: `registerInstance`, `registerFactory`, `resolve`, `has`,
  `remove`, `clear`.
- Circular dependency detection with a readable cycle path in the error
  message.
- Full test suite (>95% coverage), examples for plain Node/TS, Vue, Nuxt, and
  React, and a documentation website.

## TinyDI 2.x

### Scoped lifetime

`ServiceLifetime.Scoped`, with its own instance cache per scope while sharing
the container's `Singleton` instances — created via `container.createScope()`.

**Architectural impact**: mostly additive (new enum member, new `Scope`
type/method), but the internal caching in `resolveFactory` currently assumes
a single, container-wide cache living directly on each `FactoryRegistration`
(`cachedInstance`/`hasCachedInstance`). Supporting `Scoped` means that cache
location must become a function of _which_ scope is resolving, not just the
registration — so `resolveFactory`'s caching branch needs to be parameterized
(check/write the registration's own cache for `Singleton`, a per-scope cache
for `Scoped`, nothing for `Transient`) before this lands. No breaking change
to the existing public API.

### Child containers

`container.createChildContainer()`: inherits the parent's registrations, can
override them locally, and never mutates the parent.

**Architectural impact**: this is largely already enabled by an existing 1.x
design decision — factories receive the container explicitly
(`(container) => T`) rather than closing over it, specifically so dependency
resolution stays visible and composable. A child container just needs its own
registration map and a "look up locally, else delegate to the parent" fallback
in `resolve()`; the factory-receives-container pattern means an overridden
registration in a child is automatically visible to transitive dependencies
resolved through that same child. Whether an inherited (non-overridden)
`Singleton` shares its cached instance with the parent or gets its own is a
design question to settle, but doesn't require a breaking change either way.

### Async resolution

`container.resolveAsync()`, with support for asynchronous factories.

**Architectural impact**: the one 2.x item that needs a real internal
revision, not just an addition. `Factory<T>` is currently synchronous
(`(container) => T`); introducing async factories means:

- The `Singleton` caching in `resolveFactory` currently stores `T | undefined`
  — it would need to also cache the in-flight `Promise<T>` for async
  factories, so concurrent `resolveAsync()` calls don't invoke the factory
  twice.
- `resolve()` (sync) needs well-defined, non-silent behavior when it
  encounters a token registered with an async factory — most likely a new
  error type, rather than returning an unresolved `Promise` typed as `T`.

This doesn't break the existing synchronous API for existing synchronous
registrations, but it's the item most likely to touch `container.ts`'s
internals rather than just add to them.

## TinyDI 3.x

### Plugin system

`container.use(plugin)`, with a `ContainerPlugin { install(container): void }`
contract — intended to let framework integration packages (a future TinyDI
Vue/Nuxt/React/Express/Fastify) hook into the container without core changes.

**Architectural impact**: fully additive. `install()` just calls the
container's existing public methods (`registerInstance`/`registerFactory`/
etc.); no change to `resolve()` internals is required for this alone.

### Middleware pipeline / interceptors

Hooks that run before/after a factory is invoked (logging, timing, validation,
etc.), composable across plugins.

**Architectural impact**: additive at the public API level (a new
registration-time or container-wide hook API), but it does require an
internal revision of `resolveFactory` — today it's a single private method
with no extension points; supporting interceptors means restructuring it into
an explicit pipeline that hooks can be inserted into.

### Resource disposal

`Disposable { dispose(): void }`, `container.dispose()` — calls `dispose()`
on every cached instance that implements it.

**Architectural impact**: fully additive and already supported by the current
architecture as-is. Every instance that would need disposing (`cachedInstance`
on `FactoryRegistration`, `value` on `InstanceRegistration`) already lives in
the container's private registrations map; `dispose()` just needs to iterate
it and duck-type-check for a `dispose` method. The only new behavior is
deciding what `resolve()` should do after a container has been disposed
(most likely throw a new error).

---

Have a use case that isn't covered here, or think an item should be
reprioritized? Open an issue — see [CONTRIBUTING.md](CONTRIBUTING.md).
