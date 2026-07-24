# Changelog

## 0.1.3

### Patch Changes

- cbefc5b: Update `package.json`'s `homepage` field to point to the published documentation site (https://codecube0.github.io/TinyDI/) instead of the GitHub README anchor.

## 0.1.2

### Patch Changes

- 552bb1a: Rename the published package from `tinydi` to `tinydi-container` (the unscoped name `tinydi` was blocked by npm's anti-typosquatting policy for being too similar to the pre-existing package `tiny-di`). Updated all documentation (README, docs website) to reference the new package name and fixed a stale "ESM only" claim left over from the move to a dual ESM/CommonJS build. Added npm version and monthly downloads badges to the README.

## 0.1.1

### Patch Changes

- 3ab543a: Initial release: minimal, type-safe, decorator-free Dependency Injection container for TypeScript (Container with `registerInstance`/`registerFactory`/`resolve`/`has`/`remove`/`clear`, `Singleton`/`Transient` lifetimes, type-safe tokens, circular dependency detection).

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Entries below `## [Unreleased]` are managed automatically by
[Changesets](https://github.com/changesets/changesets) as pull requests merge
— see [CONTRIBUTING.md](CONTRIBUTING.md#changesets-versioning). Do not edit
this file by hand for a version that's already been released.

## [Unreleased]

TinyDI has not been published to npm yet. The first entry here will
correspond to the `0.1.0` (or later) initial release.
