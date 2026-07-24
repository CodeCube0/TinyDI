---
'tinydi-container': patch
---

Rename the published package from `tinydi` to `tinydi-container` (the unscoped name `tinydi` was blocked by npm's anti-typosquatting policy for being too similar to the pre-existing package `tiny-di`). Updated all documentation (README, docs website) to reference the new package name and fixed a stale "ESM only" claim left over from the move to a dual ESM/CommonJS build. Added npm version and monthly downloads badges to the README.
