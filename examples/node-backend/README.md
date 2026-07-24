# Node Backend Example

A small but realistic backend scenario: an `ILogger`, an `ITaskRepository` and a `TaskService` composed through a TinyDI container and exposed over a plain Node.js HTTP server (no framework).

## What it demonstrates

- A dedicated composition root (`container.ts`) separate from the HTTP layer (`server.ts`).
- Multiple services composed together: `TaskService` depends on both `ILogger` (registered with `registerInstance`) and `ITaskRepository` (registered with `registerFactory`), resolved through the container passed into its factory.
- The `TaskService` Singleton is resolved once per request but is the same instance across requests, so tasks created via `POST` are visible in subsequent `GET` calls.

## Run it

```bash
# From the repository root, build the core library once:
npm run build

# Then, from this folder:
npm install
npm start
```

Then, in another terminal:

```bash
curl http://localhost:3000/tasks

curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write docs"}'

curl http://localhost:3000/tasks
```

Stop the server with `Ctrl+C`.
