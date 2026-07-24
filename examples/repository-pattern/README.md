# Repository Pattern Example

Shows how TinyDI composes multiple dependencies together: an `IUserRepository` / `UserRepository` pair, and a `UserService` that depends on it.

## What it demonstrates

- Composing dependencies: `UserService`'s factory resolves `IUserRepository` from the same container it's given, instead of constructing it itself.
- Depending on the interface (`IUserRepository`), not the concrete class (`UserRepository`) — `UserService` never imports `UserRepository`.
- A single "composition root" (the `index.ts` file) is the only place aware of which concrete implementation backs each interface.

## Run it

```bash
# From the repository root, build the core library once:
npm run build

# Then, from this folder:
npm install
npm start
```

Expected output: the two registered users, then the profile for user `"1"`.
