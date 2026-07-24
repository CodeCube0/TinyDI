# Service Example

Shows both ways TinyDI can register a service — `registerFactory` and `registerInstance` — using a realistic `IMailService` / `GraphApiMailService` pair.

## What it demonstrates

- `container.registerFactory(token, factory)` — the service is built lazily from config, useful when construction has parameters (here: tenant id, sender address).
- `container.registerInstance(token, instance)` — an already-created instance is registered directly, here used to swap in a `NoOpMailService` for a dry run, without touching any code that depends on `IMailService`.
- Consumers only ever depend on the `IMailService` interface via `MailServiceToken` — never on `GraphApiMailService` or `NoOpMailService` directly.

## Run it

```bash
# From the repository root, build the core library once:
npm run build

# Then, from this folder:
npm install
npm start
```

You'll see both registration styles run one after another, each printing what the resolved `IMailService` would send.
