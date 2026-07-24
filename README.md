# TinyDI

A minimal, type-safe, decorator-free Dependency Injection container for TypeScript.

[![npm version](https://img.shields.io/npm/v/tinydi-container.svg)](https://www.npmjs.com/package/tinydi-container)
[![npm downloads](https://img.shields.io/npm/dm/tinydi-container.svg)](https://www.npmjs.com/package/tinydi-container)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Introduction

TinyDI is a small Dependency Injection (DI) container for TypeScript, Node.js, Bun, Deno and modern browsers. It gives you a `Container` you register services on and resolve them from, with full type inference and zero runtime dependencies — no reflection, no decorators, no metadata, no automatic constructor injection.

```ts
import { Container, createToken } from 'tinydi-container';

interface IGreeter {
  greet(name: string): string;
}

class EnglishGreeter implements IGreeter {
  greet(name: string): string {
    return `Hello, ${name}!`;
  }
}

const GreeterToken = createToken<IGreeter>('Greeter');

const container = new Container();
container.registerInstance(GreeterToken, new EnglishGreeter());

const greeter = container.resolve(GreeterToken); // typed as IGreeter, no generic needed
console.log(greeter.greet('TinyDI'));
```

## Why TinyDI

Most DI containers in the TypeScript ecosystem (TSyringe, InversifyJS, ...) lean on `reflect-metadata` and decorators to discover and inject dependencies automatically. That's powerful, but it comes with real costs: a runtime dependency on metadata reflection, `experimentalDecorators`/`emitDecoratorMetadata` compiler flags that affect your whole project, and wiring that happens implicitly, driven by constructor parameter types instead of code you can read top to bottom.

TinyDI takes the opposite stance: every registration and every dependency is written out by hand, once, in a composition root. There is more typing up front, and in exchange you get:

- Zero runtime dependencies, zero decorators, zero `reflect-metadata`.
- No special TypeScript compiler flags — TinyDI works under plain `strict` TypeScript.
- Dependency graphs you can `Cmd+Click` through, because the wiring is ordinary function calls.
- A resolution error or circular dependency that points at exactly the token involved, not a stack trace through a metadata reflection library.

## Philosophy: "Explicit over magic"

TinyDI does **not** use:

- `reflect-metadata`
- `experimentalDecorators` / `emitDecoratorMetadata`
- decorators
- runtime reflection
- automatic constructor injection
- class scanning / automatic dependency discovery

Every service is registered explicitly with `registerInstance` or `registerFactory`, and every dependency a factory needs is resolved explicitly from the `Container` it receives. If you can't find where something is wired up, it's because it hasn't been wired up yet — not because a decorator did it somewhere else.

## Installation

```bash
npm install tinydi-container
```

TinyDI ships as ESM, tree-shakable, with full TypeScript type declarations. It targets Node.js, Bun, Deno and modern browsers, and requires **TypeScript 6.0 or later** if you consume its types (the compiled JavaScript output has no such requirement).

## Quick Start

```ts
import { Container, createToken, ServiceLifetime } from 'tinydi-container';

interface IClock {
  now(): Date;
}

class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}

const ClockToken = createToken<IClock>('Clock');

const container = new Container();
container.registerFactory(ClockToken, () => new SystemClock(), ServiceLifetime.Singleton);

const clock = container.resolve(ClockToken);
console.log(clock.now());
```

## Token System

TinyDI identifies services with **tokens**, not with strings or classes:

```ts
const MailServiceToken = createToken<IMailService>('MailService');
```

`createToken<T>(description)` returns a `Token<T>` whose identity is a unique `symbol` — the `description` is only a human-readable label used in error messages, not the identifier itself. Two tokens created with the same description are still distinct registrations. Because `T` is carried by the token's type, `container.resolve(MailServiceToken)` infers `IMailService` automatically: you never write `resolve<IMailService>(...)`.

## Container

`Container` is the only class you need:

```ts
const container = new Container();
```

A container owns a set of registrations, keyed by token. You register services with `registerInstance` or `registerFactory`, resolve them with `resolve`, and manage the registration set with `has`, `remove` and `clear`.

## Singleton

The default lifetime. The first time a token is resolved, its factory runs once; every later `resolve()` call for the same token returns that same instance.

```ts
container.registerFactory(ClockToken, () => new SystemClock()); // Singleton by default
container.resolve(ClockToken) === container.resolve(ClockToken); // true
```

`registerInstance` is always Singleton, since you're handing the container an instance that already exists.

## Transient

A new instance is created on every `resolve()` call.

```ts
container.registerFactory(RequestIdToken, () => crypto.randomUUID(), ServiceLifetime.Transient);
container.resolve(RequestIdToken) === container.resolve(RequestIdToken); // false
```

## API Reference

### `createToken<T>(description: string): Token<T>`

Creates a type-safe token identifying a service of type `T`. `description` is used in error messages; it does not need to be unique.

### `ServiceLifetime`

```ts
enum ServiceLifetime {
  Singleton,
  Transient,
}
```

### `class Container`

| Method                                                                                                        | Description                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `registerInstance<T>(token: Token<T>, instance: T): void`                                                     | Registers an already-created instance. Always treated as Singleton.                                                                                                                    |
| `registerFactory<T>(token: Token<T>, factory: (container: Container) => T, lifetime?: ServiceLifetime): void` | Registers a factory, built lazily on first resolution. `lifetime` defaults to `ServiceLifetime.Singleton`. The factory receives the container, so it can resolve its own dependencies. |
| `resolve<T>(token: Token<T>): T`                                                                              | Resolves the service registered under `token`, fully typed. Throws `ResolutionError` if unregistered, `CircularDependencyError` if resolving it requires resolving itself again.       |
| `has(token: Token<unknown>): boolean`                                                                         | Checks whether a token has a registration.                                                                                                                                             |
| `remove(token: Token<unknown>): void`                                                                         | Removes a token's registration, if present.                                                                                                                                            |
| `clear(): void`                                                                                               | Removes every registration.                                                                                                                                                            |

Registering a token that is already registered — with either method, in any combination — throws `RegistrationError`. Call `remove()` first if you want to replace a registration.

### Errors

```ts
ContainerError; // abstract base class; carries the involved `token`
RegistrationError; // registering an already-registered token
ResolutionError; // resolving an unregistered token
CircularDependencyError; // resolving a token that (transitively) depends on itself
```

`CircularDependencyError` exposes the full cycle as `.path` (an array of the involved tokens) and renders it in its `.message` as:

```text
Circular dependency detected:

A
 -> B
 -> C
 -> A
```

## Examples

Runnable, self-contained examples live in [`examples/`](./examples):

- [`examples/basic`](./examples/basic) — the smallest possible program: register an instance, resolve it.
- [`examples/service`](./examples/service) — `IMailService` / `GraphApiMailService`, comparing `registerInstance` and `registerFactory`.
- [`examples/repository-pattern`](./examples/repository-pattern) — `IUserRepository` / `UserRepository` / `UserService`, composing multiple dependencies.
- [`examples/vue`](./examples/vue) — using the container in Vue via `provide`/`inject`.
- [`examples/nuxt`](./examples/nuxt) — a Nuxt plugin (`plugins/di.ts`) exposing the container as `$container`.
- [`examples/react`](./examples/react) — a React Context Provider and a `useService` hook.
- [`examples/node-backend`](./examples/node-backend) — a small backend scenario: logger, repository and service layer composed through the container.

Each example has its own README with run instructions.

## Best Practices

- **Have one composition root.** Register your services in a single place (e.g. `container.ts`), close to your application's entry point. Everything else should only `resolve()`.
- **Depend on interfaces, not concrete classes.** Type your tokens with an interface (`Token<IUserRepository>`), and never import the concrete implementation from consuming code.
- **Prefer `registerFactory` over `registerInstance` for anything with dependencies.** Factories receive the container, so they can resolve their own dependencies explicitly instead of requiring you to build a whole graph by hand before registering it.
- **Keep lifetimes intentional.** Default to Singleton for stateless services and shared resources; reach for Transient only when each resolution genuinely needs a fresh instance (e.g. a per-operation request id).
- **Let `resolve()` throw.** A missing registration is a programming error, not a recoverable condition — don't wrap every `resolve()` call in a `try`/`catch`; fix the registration instead.

## FAQ

**Does TinyDI support automatic constructor injection?**
No, by design. You wire up constructor arguments yourself inside a factory (`(c) => new UserService(c.resolve(UserRepositoryToken))`). This is the core trade-off TinyDI makes: more explicit code, no reflection.

**Can I register the same token twice, to override it?**
Not directly — a second registration on an already-registered token throws `RegistrationError`. Call `container.remove(token)` first (or `container.clear()` to reset everything), then register again. This is useful for swapping implementations in tests.

**Does TinyDI support scoped (per-request) lifetimes?**
Not in this version — only `Singleton` and `Transient` exist today. The design intentionally doesn't preclude adding a scoped lifetime later, but it isn't part of the current API.

**Does TinyDI support child containers?**
Not in this version. Each `Container` is fully self-contained with no shared global state, which leaves the door open for a parent/child relationship in a future version without requiring a redesign.

**Is TinyDI tied to Node.js?**
No — it has zero runtime dependencies and uses no Node-specific APIs, so it runs unmodified on Bun, Deno and in the browser.

## Comparison with TSyringe

|                         | TinyDI                     | TSyringe                                                |
| ----------------------- | -------------------------- | ------------------------------------------------------- |
| Dependency discovery    | Explicit, via factories    | Automatic, via decorators + `reflect-metadata`          |
| Decorators required     | No                         | Yes (`@injectable`, `@inject`, ...)                     |
| Compiler flags required | None                       | `experimentalDecorators`, `emitDecoratorMetadata`       |
| Runtime dependencies    | None                       | `reflect-metadata`                                      |
| Token identity          | `symbol`-backed `Token<T>` | String tokens or classes                                |
| Lifetimes               | Singleton, Transient       | Singleton, Transient, ResolutionScoped, ContainerScoped |

TSyringe is a great choice if you want automatic constructor injection and don't mind decorators and `reflect-metadata` in your project. TinyDI trades that convenience for explicitness and a smaller surface area.

## Comparison with InversifyJS

|                         | TinyDI                                  | InversifyJS                                       |
| ----------------------- | --------------------------------------- | ------------------------------------------------- |
| Dependency discovery    | Explicit, via factories                 | Automatic, via decorators + `reflect-metadata`    |
| Decorators required     | No                                      | Yes (`@injectable`, `@inject`, ...)               |
| Compiler flags required | None                                    | `experimentalDecorators`, `emitDecoratorMetadata` |
| Runtime dependencies    | None                                    | `reflect-metadata`                                |
| Concepts to learn       | `Token`, `Container`, `ServiceLifetime` | Containers, modules, bindings, scopes, middleware |
| Lifetimes               | Singleton, Transient                    | Singleton, Transient, Request, custom scopes      |

InversifyJS offers a much larger feature set (modules, middleware, multi-injection, tagging) at the cost of a larger API surface and a runtime dependency on reflection. TinyDI intentionally covers a much smaller, simpler slice of that problem space.

## Performance

TinyDI does no reflection, no metadata parsing and no class scanning at any point — `resolve()` is a `Map` lookup plus, for factories, a plain function call. There is no startup cost to "discover" your dependency graph, because there is no discovery: the graph is exactly the factory calls you wrote. The only bookkeeping `resolve()` does beyond the lookup is maintaining a small internal stack of in-flight resolutions, used purely to detect circular dependencies.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute.
