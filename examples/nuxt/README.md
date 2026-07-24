# Nuxt Example

Uses TinyDI inside a Nuxt 4 app through a dedicated `plugins/di.ts` Nuxt plugin.

## What it demonstrates

- `plugins/di.ts` — the composition root: creates a `Container`, registers services, and exposes it as `$container` via Nuxt's plugin `provide` mechanism, with an explicit `NuxtApp` type augmentation (`declare module '#app'`) so `$container` is fully typed.
- `composables/useService.ts` — a small composable wrapping `useNuxtApp().$container.resolve(token)`, so pages/components never touch `useNuxtApp()` or the container directly.
- `pages/index.vue` — calls `useService(GreeterToken)` during `<script setup>`, exactly like any other Nuxt composable.

## Run it

```bash
# From the repository root, build the core library once:
npm run build

# Then, from this folder:
npm install
npm run dev
```

`npm install` runs `nuxt prepare` automatically (via `postinstall`), which is required once before Nuxt's generated types are available.

Open the printed local URL — you'll see a greeting resolved from the TinyDI container.

To produce a production build: `npm run build`.
