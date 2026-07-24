# Design

Visual system for `docs-app/`, TinyDI's documentation and project site. Read alongside `PRODUCT.md` (strategy) — this file is "how it looks."

## Visual Theme

**Direction:** Vite-like — dark-first, high-contrast, a single saturated accent against a near-black surface. Energy of a fast, precise developer tool, not a corporate SaaS brochure. Light theme is a fully polished alternative (user-toggled, persisted), not an afterthought.

**Color strategy:** Committed. One accent (a warm signal coral-red) carries emphasis and interactivity; the rest of the palette is a disciplined, near-monochrome cool-neutral ramp (never warm/cream-tinted — that reads as "safe AI default", not as this brand).

**Reference:** Vite's own site (vite.dev) for energy and contrast; deliberately a different hue family (no purple, no yellow — those are literally Vite's colors) and no gradient/starfield imagery (that's Astro's move). Flat, solid color; precision over spectacle.

## Color Palette (OKLCH)

Defined as CSS custom properties, switched via `:root[data-theme="dark"]` / `:root[data-theme="light"]`. Dark is the default on first visit (no stored preference); the choice persists in `localStorage`.

### Dark (default)

| Token             | Value                  | Use                                             |
| ----------------- | ---------------------- | ----------------------------------------------- |
| `--bg`            | `oklch(0.16 0.02 260)` | Page background                                 |
| `--surface`       | `oklch(0.21 0.02 260)` | Raised panels, code blocks, callouts            |
| `--surface-2`     | `oklch(0.27 0.02 260)` | Hover/active surface, table stripes             |
| `--border`        | `oklch(0.33 0.02 260)` | Hairline borders                                |
| `--ink`           | `oklch(0.96 0.01 260)` | Primary text                                    |
| `--ink-muted`     | `oklch(0.74 0.02 260)` | Secondary text, captions                        |
| `--accent`        | `oklch(0.72 0.19 40)`  | Links, active nav, primary buttons, focus rings |
| `--accent-strong` | `oklch(0.65 0.21 36)`  | Accent hover/active                             |
| `--accent-ink`    | `oklch(0.16 0.02 260)` | Text/icons on top of an accent-filled surface   |

### Light

| Token             | Value                    | Use                                             |
| ----------------- | ------------------------ | ----------------------------------------------- |
| `--bg`            | `oklch(0.985 0.003 260)` | Page background (true near-white, not cream)    |
| `--surface`       | `oklch(0.955 0.004 260)` | Raised panels, code blocks, callouts            |
| `--surface-2`     | `oklch(0.91 0.006 260)`  | Hover/active surface, table stripes             |
| `--border`        | `oklch(0.85 0.007 260)`  | Hairline borders                                |
| `--ink`           | `oklch(0.20 0.02 260)`   | Primary text                                    |
| `--ink-muted`     | `oklch(0.42 0.02 260)`   | Secondary text, captions                        |
| `--accent`        | `oklch(0.54 0.20 35)`    | Links, active nav, primary buttons, focus rings |
| `--accent-strong` | `oklch(0.47 0.21 32)`    | Accent hover/active                             |
| `--accent-ink`    | `oklch(0.99 0.004 260)`  | Text/icons on top of an accent-filled surface   |

Contrast is verified (WCAG AA, ≥4.5:1 body / ≥3:1 large text) for `--ink`/`--ink-muted` on `--bg`/`--surface`, and `--accent-ink` on `--accent`, in both themes — see `docs-app/scripts/contrast-check.mjs` (dev-only script, not shipped) used to validate this table.

Semantic-only additions: `--danger` (`oklch(0.62 0.22 25)` dark / `oklch(0.5 0.2 25)` light) for error states in code samples; no other hues are introduced. One accent, used with intent.

## Typography

**Fonts** (self-hosted, no CDN — same zero-external-dependency ethic as the library itself):

- **Display/UI — Archivo Variable** (`@fontsource-variable/archivo`). Headings use the `wdth` axis pushed toward expanded (~120) at `wght` 700–800: a technical-signage character (think engineering nameplates, not a generic grotesk). Body UI uses the same family at `wdth` 100, `wght` 400–600 — one family, two axes, instead of an arbitrary second family.
- **Code — Spline Sans Mono Variable** (`@fontsource-variable/spline-sans-mono`), `wght` 400/500. Clean, unambiguous 0/O and 1/l/I, earned here because this genuinely is a code-heavy developer tool (not "mono as technical costume").

**Scale** (fluid, ratio ≳1.33, `clamp()` on headings, hero ceiling ≤6rem, `letter-spacing` never below `-0.03em`):

| Token         | Value                                   |
| ------------- | --------------------------------------- |
| `--text-xs`   | `0.8125rem`                             |
| `--text-sm`   | `0.9375rem`                             |
| `--text-base` | `1.0625rem`                             |
| `--text-lg`   | `1.25rem`                               |
| `--text-xl`   | `1.5rem`                                |
| `--text-2xl`  | `clamp(1.75rem, 1.5rem + 1vw, 2.25rem)` |
| `--text-3xl`  | `clamp(2.25rem, 1.75rem + 2vw, 3rem)`   |
| `--text-hero` | `clamp(2.75rem, 2rem + 4.5vw, 4.75rem)` |

`text-wrap: balance` on all headings; `text-wrap: pretty` on prose paragraphs. Prose measure capped at 68ch. Dark-theme body copy gets +0.06 `line-height` (light type on dark reads lighter-weight, needs more room).

## Spacing, Radius, Elevation

**Spacing scale** (rem, one geometric-ish progression, used directly — no ad hoc values): `0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12`. Section vertical padding is fluid: `clamp(3rem, 6vw, 8rem)`.

**Radius**: small and functional, not bubbly (matches "precise, direct" — rounded-everything reads as friendly-SaaS). `--radius-sm: 4px` (badges, inline code), `--radius-md: 8px` (buttons, inputs, callouts), `--radius-lg: 12px` (code blocks, cards).

**Elevation**: dark theme avoids drop shadows (they read muddy on near-black) and uses a 1px `--border` plus, for interactive focus/hover, a soft accent-tinted glow: `--glow-accent: 0 0 0 3px oklch(0.72 0.19 40 / 0.35)`. Light theme uses soft neutral shadows: `--shadow-sm: 0 1px 2px oklch(0.2 0.02 260 / 0.06)`, `--shadow-md: 0 8px 24px oklch(0.2 0.02 260 / 0.10)`.

## Layout & Breakpoints

Mobile-first. Sidebar navigation collapses to a togglable drawer below `--bp-lg`; search and language switcher stay reachable at every size.

| Token      | Value    | Meaning                                        |
| ---------- | -------- | ---------------------------------------------- |
| `--bp-sm`  | `480px`  | Large phone                                    |
| `--bp-md`  | `768px`  | Tablet                                         |
| `--bp-lg`  | `1024px` | Sidebar becomes persistent, 2-col docs layout  |
| `--bp-xl`  | `1280px` | Wide desktop                                   |
| `--bp-2xl` | `1600px` | Ultra-wide: content stays capped, extra gutter |

Docs pages: persistent left sidebar (`--bp-lg`+) + content column capped at 68ch + optional right-hand "on this page" outline on `--bp-xl`+. Homepage: full-bleed sections, generous fluid spacing, one dominant idea per section (no repeated identical card grids — feature list uses a single asymmetric grid, not N identical tiles).

## Motion

`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`, durations `--duration-fast: 150ms`, `--duration-base: 250ms`, `--duration-slow: 450ms`. One orchestrated hero entrance (staggered reveal + the architecture diagram drawing itself in); everything else (nav, theme/lang toggles, copy-button feedback) is a quick, single-property transition. Every animation has a `prefers-reduced-motion: reduce` fallback (instant state, no transition).

## Signature visual motif

A hand-built SVG "resolution graph" (nodes = tokens, edges = `resolve()` calls) used both as hero imagery and as the homepage Architecture-section diagram, animating in once on load (nodes/edges draw in, staggered). This is the site's one piece of bespoke imagery in place of stock photography — appropriate for a library whose actual product is exactly this graph (Token → Container → Factory → Resolution). No stock photos; a code-driven diagram is the more honest visual for this brand.

## Components (see `docs-app/styles/` for implementation)

Header (logo, primary nav, search trigger, language switcher, theme toggle) · collapsible Sidebar/nav tree with active-item indicator · client-side Search (overlay, keyboard-navigable results) · Hero · Feature list (asymmetric, not a uniform card grid) · Code block (line numbers, copy button, hand-built syntax highlighting, themed) · Callout (`tip` / `warning`, full-tint background + icon, no side-stripe border) · API reference table · Example card (links out to `examples/`) · Footer.
