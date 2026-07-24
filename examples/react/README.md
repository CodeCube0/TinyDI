# React Example

Uses TinyDI inside a React app through a `DIProvider` Context Provider and a `useService` hook.

## What it demonstrates

- `src/di/container.ts` — the composition root, completely framework-agnostic: it creates a `Container` and registers services, with no React import at all.
- `src/di/DIProvider.tsx` — a `DIProvider` component exposing the container via React Context, plus a `useService(token)` hook that reads it from context and calls `resolve()`.
- `src/App.tsx` — a component that calls `useService(GreeterToken)`, exactly like any other React hook.

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
