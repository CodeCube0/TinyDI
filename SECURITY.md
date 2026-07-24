# Security Policy

## Supported Versions

TinyDI has not yet published a 1.0 release. Until then, only the latest
published version on npm (and the `main` branch) receives security fixes.

| Version      | Supported          |
| ------------ | ------------------ |
| latest (0.x) | :white_check_mark: |
| older 0.x    | :x:                |

Once TinyDI reaches 1.0, this table will be updated to reflect the supported
major versions (see [ROADMAP.md](ROADMAP.md)).

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use [GitHub's private vulnerability reporting](https://github.com/CodeCube0/TinyDI/security/advisories/new)
for this repository (Security tab → "Report a vulnerability"). This creates a
private advisory visible only to maintainers until a fix is ready.

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce (a minimal repro is ideal, given TinyDI's small API
  surface)
- The affected version(s)

### What to expect

- Acknowledgment of the report within a few days.
- An assessment of the impact and, if confirmed, a plan for a fix and
  coordinated disclosure timeline.
- Credit in the release notes / `CHANGELOG.md`, unless you prefer to remain
  anonymous.

Given TinyDI has zero runtime dependencies in the core (`src/`), the most
likely vulnerability class is in tooling (build, CI, npm publishing) rather
than the library's runtime code itself — reports about the build/release
pipeline are just as welcome as reports about `src/`.
