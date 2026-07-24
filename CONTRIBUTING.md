# Contributing to TinyDI

Thanks for considering a contribution to TinyDI. This document covers local setup, code conventions, and how to propose changes.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you're expected to uphold it.

## Local setup

```bash
git clone https://github.com/CodeCube0/TinyDI.git
cd TinyDI
npm install
npm test
```

Useful commands (see [CLAUDE.md](CLAUDE.md) for the full list):

```bash
npm run build          # tsup -> dist/ (ESM + CJS + .d.ts)
npm test               # vitest run
npm run test:coverage  # vitest run --coverage (thresholds: 95% lines/functions/branches/statements)
npm run lint           # eslint .
npm run format         # prettier --write .
```

Run a single test file: `npx vitest run tests/container.test.ts`
Run a single test by name: `npx vitest run -t "circular dependency"`

Every one of these must pass before a PR is merged — CI runs the same commands on Node 18, 20, and 22.

## Project scope

TinyDI is deliberately minimal ("explicit over magic"): no decorators, no reflection, no automatic constructor injection, zero runtime dependencies in the core (`src/`). Please read [CLAUDE.md](CLAUDE.md) before proposing architectural changes — it documents the invariants that are intentional design choices, not oversights (e.g. why there's no `Scoped` lifetime yet, why factories take the container as an explicit parameter). Larger ideas belong in [ROADMAP.md](ROADMAP.md) first; open an issue to discuss before sending a large PR.

## Code conventions

- TypeScript strict mode, one concern per file under `src/`, everything wired through `src/index.ts` (the public API surface — anything not exported there is internal).
- Every public API member needs full JSDoc: signature, params, return, a usage `@example`, and relevant edge cases.
- No new runtime dependencies in the core package without discussing it in an issue first — "zero external dependencies in `src/`" is a hard project constraint. Dev tooling dependencies are fine.
- Match the existing code style; `npm run lint:fix` and `npm run format` handle most of it automatically.
- Add or update tests for any behavior change. Coverage must stay at or above 95% on lines/functions/branches/statements.

## Commit messages

This repository follows [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`, ...). Pull requests are checked in CI for conformance. This keeps history readable and lets tooling infer version bumps.

## Changesets (versioning)

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and `CHANGELOG.md`. If your PR changes the published behavior of the `tinydi-container` package (anything under `src/`), add a changeset:

```bash
npx changeset
```

Follow the prompts to describe the change and pick a semver bump (patch/minor/major, per [Semantic Versioning](https://semver.org/)). Docs-only or example-only changes don't need a changeset.

## Proposing changes

1. Open an issue first for anything beyond a small fix, using the Bug Report or Feature Request template.
2. Fork the repo and create a branch from `main`.
3. Make your change, with tests and a changeset if applicable.
4. Make sure `npm run lint`, `npm test`, and `npm run build` all pass locally.
5. Open a pull request against `main`, filling in the PR template.

## Examples and docs site

`examples/**` and `docs-app/**` are independent packages with their own tooling (see their respective READMEs and the root `CLAUDE.md`). They're excluded from the root ESLint config and don't need a changeset.
