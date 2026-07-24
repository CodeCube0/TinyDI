# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

TinyDI is a minimal, type-safe, decorator-free Dependency Injection container for TypeScript ("Explicit over magic") — no reflection, no decorators, no automatic constructor injection, zero runtime dependencies. The core library (`src/`) is complete; `examples/` and the root `README.md`/`README.it.md` (Phase 2) are also done. Docs website, governance/CI/npm publishing and the blog (Phases 3-5) are not yet implemented — see "Repository layout notes" below.

## Commands

```bash
npm run build          # tsc -p tsconfig.build.json -> dist/
npm test                # vitest run (all tests)
npm run test:watch      # vitest (watch mode)
npm run test:coverage   # vitest run --coverage (v8, thresholds: 95% lines/functions/branches/statements)
npm run lint            # eslint .
npm run lint:fix
npm run format           # prettier --write .
npm run format:check
```

Run a single test file: `npx vitest run tests/container.test.ts`
Run a single test by name: `npx vitest run -t "circular dependency"`

There is no bundler: the build is a straight `tsc` emit to `dist/`, so `dist/` mirrors `src/` file-for-file.

### Running an example

Every folder under `examples/` is an independent package that depends on the core via `"tinydi": "file:../.."` (not an npm workspace) — build the core first, then install/run the example:

```bash
npm run build                 # from the repo root, once (or after any src/ change)
cd examples/<name>
npm install                   # re-run after core changes too, to refresh the file: dependency
npm start                     # basic, service, repository-pattern, node-backend (tsx scripts)
npm run dev                   # vue, nuxt, react (dev server)
```

`examples/**` is excluded from the root `eslint.config.js` and has no lint config of its own — each example only type-checks via its own `tsconfig.json` (`vue-tsc` for the Vue example, plain `tsc` for React/Node ones, Nuxt's generated `.nuxt/tsconfig.json` for Nuxt). Each example's `package-lock.json` **is** committed (unlike the root's, which is gitignored) so the exact dependency set that was verified to work stays reproducible.

## Architecture

Everything lives in `src/`, one concern per file, wired together in `src/index.ts` (the public API surface — anything not exported there is internal):

- **`token.ts`** — `createToken<T>(description)` returns a `Token<T>` keyed by a `symbol` (identity), not by its `description` string (which is only a debug label — two tokens with the same description are distinct registrations). The type `T` is carried via an optional `__type?: T` phantom property that is never actually assigned at runtime; this is what lets `container.resolve(token)` infer the return type with no explicit generic. When touching `Token`, preserve this: don't add a real runtime-assigned field for `T`.
- **`service-lifetime.ts`** — `ServiceLifetime` enum, only `Singleton` (default) and `Transient`. **Do not add `Scoped` here** — it's an intentional future extension, not in scope for the current version (see `task/01_core_library.md` for the reasoning).
- **`errors.ts`** — error hierarchy: abstract `ContainerError` (base, carries the involved `Token`) → `RegistrationError`, `ResolutionError`, `CircularDependencyError`. `CircularDependencyError` renders the full cycle path as `A\n -> B\n -> C\n -> A`; that exact format is asserted in tests, so if you touch `CircularDependencyError.formatPath`, keep the first token unprefixed and every subsequent one prefixed with `' -> '`, including the repeated closing token.
- **`container.ts`** — the `Container` class. Key internal invariants:
  - Registering the same token twice (`registerInstance` or `registerFactory`, in any combination) throws `RegistrationError`. This is a deliberate design choice (not obvious from the task spec) made to give `RegistrationError` an actual purpose — see `reports/01-core-library.md` for the rationale. To replace a registration, callers must `remove()` first (or `clear()`).
  - Factories have the signature `(container: Container) => T` — the container is passed explicitly to the factory (not captured via closure) so dependency wiring stays visible and so the container can track the resolution path.
  - Circular dependency detection works via an internal `resolutionPath: Token<unknown>[]` stack pushed/popped around each factory invocation; when a token already on the stack is requested again, it throws `CircularDependencyError` with the stack plus the repeated token.
  - Singleton factories cache their built instance on the internal registration record (`cachedInstance`/`hasCachedInstance`); Transient factories never cache.

`examples/` holds 7 independent demo packages (`basic`, `service`, `repository-pattern`, `node-backend`, `vue`, `nuxt`, `react`), each with its own `package.json`/`tsconfig.json`/README. In every framework example (`vue`, `nuxt`, `react`) the DI composition root (`di/container.ts` or `services/*.ts` + `plugins/di.ts`) stays framework-agnostic — it never imports Vue/Nuxt/React — and a thin, framework-idiomatic adapter (`di/plugin.ts` for Vue, `plugins/di.ts` + `composables/useService.ts` for Nuxt, `di/DIProvider.tsx` for React) is the only place that bridges the container into that framework's own DI-like mechanism (`provide`/`inject`, Nuxt plugin `provide`, React Context). Keep that separation when touching these examples.

## Design decisions to preserve

- No dependency arrays in `package.json` — only `devDependencies` (tooling) and an optional `peerDependencies.typescript: ">=6.0.0"`. Don't introduce a runtime dependency without discussing it first; "zero external dependencies in the core" is a hard constraint from the project spec.
- Minimum supported TypeScript is **6.0** (`devDependencies.typescript` is pinned to `^6.0.3`, capped below the range `typescript-eslint@8.65.0` supports, which is `>=4.8.4 <6.1.0`). If bumping TypeScript past 6.1, `typescript-eslint` needs a compatibility check first.
- Every public API member needs full JSDoc (signature, params, return, a usage `@example`, relevant edge cases) — this is enforced by convention, not by a lint rule, so check for it in review.
- `eslint.config.js` and `vitest.config.ts` are deliberately excluded from typed linting (`*.config.js`/`*.config.ts` override with `disableTypeChecked`) because they aren't covered by `tsconfig.json`'s `include`. `tsconfig.json` (base, no `rootDir`) covers `src` + `tests` for editor/lint/type-check; `tsconfig.build.json` adds `rootDir: "src"` and excludes tests, and is what `npm run build` actually uses to emit `dist/`.
- `examples/**` is in the root `eslint.config.js` `ignores` list. Without it, `npm run lint`'s `projectService: true` tries to type-check every example's own `dist`/`.output`/`.nuxt` build artifacts too (they aren't covered by any `tsconfig.json`), producing hundreds of parse errors unrelated to the core.
- Coverage target is >95%; the current suite is at 100% on all `src/*.ts` (excluding `index.ts`, which is pure re-exports).

## Repository layout notes

- `task/` and `reports/` exist locally but are **gitignored** (`/task`, `/reports` in `.gitignore`) — they hold the phased project spec and the end-of-phase reports and are intentionally not pushed to the remote. They still exist on disk in this working directory and are worth reading for context (e.g. `task/01_core_library.md`/`task/02_examples_and_readme.md` for the original spec and constraints, `reports/01-core-library.md`/`reports/02-examples-and-readme.md` for what was actually built, problems hit, and scope trade-offs), but don't assume a fresh clone of the repo will have them.
- The task spec describes further phases not yet implemented: a docs website (`task/03_...`), governance/CI/npm publishing + `ROADMAP.md` (`task/04_...`), and an internal blog + closing write-up (`task/05_...`). The package has never been published to npm yet — `README.md`/`README.it.md` document `npm install tinydi` as the intended future install path; until Phase 4 publishes it, consume the local build via `file:` (as `examples/` does) or `npm link`.

## Keeping this file updated

Update this file whenever a change affects the guidance above: new public modules under `src/`, changes to lifetimes/error hierarchy/circular-dependency format, dependency or TypeScript version floor changes, or new top-level directories (e.g. when `examples/`, `docs-app/` land in later phases).
