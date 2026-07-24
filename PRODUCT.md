# Product

## Register

brand

## Users

TypeScript/JavaScript developers across Node.js, Bun, Deno and the browser who are either evaluating TinyDI against alternatives (TSyringe, InversifyJS, hand-rolled composition roots) or already using it and need to look something up. Two concrete contexts: (1) a developer skimming the homepage in a few minutes deciding whether to adopt it, and (2) an existing user mid-task, jumping straight to an API signature or example via search. Both are experienced engineers, not beginners to programming — they don't need DI explained from first principles, they need TinyDI's specific trade-offs explained fast.

## Product Purpose

The official documentation and project site for TinyDI: it is both the public face that earns adoption (homepage, philosophy, comparisons) and the reference a user returns to constantly (API reference, guides, examples). Success looks like: a developer understands "explicit over magic" and TinyDI's exact API surface within minutes, without reading source code, in either English or Italian.

## Brand Personality

Precise and direct — engineer-to-engineer tone. Short sentences. Zero hype and zero adjective-stacking; confidence is shown through real code and exact signatures, not through claims. This mirrors TinyDI's own core philosophy ("explicit over magic"): the site should not oversell what the library deliberately does NOT do (no reflection, no decorators, no automatic injection).

Visual direction: Vite-like — dark-first, high-contrast, a single saturated accent against a near-black surface, energy of a fast modern developer tool. Light theme is a fully supported, equally polished alternative (user toggle), not an afterthought.

## Anti-references

- Generic AI-SaaS aesthetic: purple/violet gradients on white or cream backgrounds, gradient text, glassmorphism used decoratively.
- The "hero-metric" template (big stat + small label + supporting stats row).
- Tiny uppercase tracked eyebrows above every section ("DOCS" / "FEATURES" / "GET STARTED").
- Numbered section markers (01 / 02 / 03) used as generic scaffolding rather than an actual sequence.
- Identical same-sized icon+heading+text card grids repeated across the homepage.
- Default system fonts (Inter, Roboto, system-ui) with no typographic point of view.
- Cream/sand/parchment near-white backgrounds as a stand-in for "warmth".
- Any external CDN dependency (fonts, icons, analytics, search service) — TinyDI itself ships zero runtime dependencies; the docs site should hold itself to the same standard: self-contained, fast, offline-capable.

## Design Principles

1. **Explicit over magic, visually too.** No decorative element exists "just because sites like this have one." Every visual choice (a border, an icon, a card) earns its place or is removed.
2. **Show, don't hype.** Real code samples and exact API signatures do the persuading. Copy states what TinyDI does and does not do, plainly, instead of selling it with adjectives.
3. **One accent, used with intent.** A single saturated accent color carries emphasis and interactive affordance; everything else is a disciplined near-monochrome ramp (true near-black / near-white, not warm-tinted "safe" neutrals).
4. **Docs are a tool, not a brochure.** The homepage carries the brand identity; documentation pages inside prioritize density, scanability and fast lookup over marketing flourish, within the same visual language.
5. **Own the whole stack.** No external fonts, CDNs, or third-party search/analytics services. Search, syntax highlighting, and theming are all hand-built, consistent with TinyDI's zero-dependency ethic.

## Accessibility & Inclusion

- WCAG AA minimum: body text ≥4.5:1 contrast, large text/UI components ≥3:1, in both the dark (default) and light themes.
- Full keyboard navigation with visible focus states throughout (header, sidebar nav, search, language switcher, code block copy buttons).
- Semantic landmarks (`header`, `nav`, `main`, `footer`), a skip-to-content link, and screen-reader-friendly labeling for the language switcher and search.
- `prefers-reduced-motion` alternative for every animation (instant/crossfade fallback).
- Fully bilingual: English (default) and Italian, both complete — not English-plus-partial-translation.
