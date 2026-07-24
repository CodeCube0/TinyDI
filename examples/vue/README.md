# Vue Example

Uses TinyDI inside a Vue 3 app through the idiomatic `provide`/`inject` mechanism.

## What it demonstrates

- `src/di/container.ts` — the composition root, completely framework-agnostic: it creates a `Container` and registers services, with no Vue import at all.
- `src/di/plugin.ts` — a small Vue plugin (`createContainerPlugin`) that `provide()`s the container once at the app root, plus a `useService(token)` composable that `inject()`s it and calls `resolve()`.
- `src/App.vue` — a component that calls `useService(GreeterToken)` during `setup()`, exactly like any other Vue composable.

## Run it

```bash
# From the repository root, build the core library once:
npm run build

# Then, from this folder:
npm install
npm run dev
```

Open the printed local URL — you'll see a greeting resolved from the TinyDI container.

To type-check and produce a production build: `npm run build`.
