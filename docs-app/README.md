# docs-app

TinyDI's documentation and project site. Plain HTML/CSS/JS — no frontend framework. `build.mjs` is a small Node static-site generator (dev-time only) that reads `src/content` + `src/templates` and emits the deployable site into `dist/`.

**Live at <https://codecube0.github.io/TinyDI/>** (EN) / <https://codecube0.github.io/TinyDI/it/> (IT), deployed automatically by `.github/workflows/docs.yml` on every push to `main` that touches `docs-app/**`.

## Run it

```bash
npm install     # also fetches the two self-hosted font files (postinstall)
npm run build   # src/ -> dist/
npm run serve   # serves dist/ at http://localhost:4550
# or just:
npm run dev     # build + serve
```

## Layout

- `src/styles/` — design tokens (`tokens.css`), reset (`base.css`), components (`components.css`), self-hosted `@font-face` (`fonts.css`).
- `src/scripts/` — runtime JS shipped as-is: theme toggle, language switcher, client-side search, code-block copy button, mobile nav/scroll-spy.
- `src/lib/` — build-time helpers: the content-block renderer (`blocks.mjs`), the hand-rolled syntax highlighter (`highlight.mjs`), the SVG resolution-graph diagram (`graph-diagram.mjs`), the icon set (`icons.mjs`).
- `src/templates/` — `layout.mjs` (header/sidebar/footer/search dialog/drawer shell) and `home.mjs` (homepage sections).
- `src/content/{en,it}/docs/*.mjs` — one file per documentation page, per language, as a small block-based DSL (see `src/lib/blocks.mjs`).
- `src/nav.mjs` — the single source of truth for the docs nav, per-language strings, and route helpers.
- `tools/` — dev-only scripts: `copy-fonts.mjs` (postinstall) and `contrast-check.mjs` (manual WCAG contrast verification for the tokens in `DESIGN.md`).

See the repository root `PRODUCT.md` and `DESIGN.md` for the strategic and visual-design rationale behind this site, and `reports/03-docs-website.md` for what was built in this phase and what wasn't.
