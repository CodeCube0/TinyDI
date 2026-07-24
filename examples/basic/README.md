# Basic Example

The smallest possible TinyDI program: define a service interface, create a token for it, register an instance, and resolve it.

This is the right starting point if you've never used TinyDI before.

## What it demonstrates

- `createToken<T>()` — creating a type-safe token
- `container.registerInstance(token, instance)` — registering an already-created instance
- `container.resolve(token)` — resolving it back, fully typed as `IGreeter` with no explicit generic

## Run it

```bash
# From the repository root, build the core library once:
npm run build

# Then, from this folder:
npm install
npm start
```

Expected output:

```text
Hello, TinyDI!
```
