---
target: docs-app documentation pages (EN+IT)
total_score: 30
max_score: 40
na_heuristics:
p0_count: 1
p1_count: 3
timestamp: 2026-07-25T07-10-50Z
slug: docs-app-documentation-pages-en-it
---

Method: dual-agent (A: a96deef75193b71a0 · B: a334f694faca16754)

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                |
| --------- | ------------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3         | Only signal is the sidebar "aria-current" highlight + scroll-spy TOC; nothing else       |
| 2         | Match System / Real World       | 4         | Real signatures, real error class names, no marketing filter                             |
| 3         | User Control and Freedom        | 3         | Esc closes dialogs/drawer well; language banner dismissal is session-only                |
| 4         | Consistency and Standards       | 3         | Block DSL consistent across pages; mobile shows sidebar AND drawer with the same 9 links |
| 5         | Error Prevention                | 3         | Mostly n/a for Read mode; search always shows hints                                      |
| 6         | Recognition Rather Than Recall  | 3         | Sidebar always visible on desktop, but 9 flat links with zero grouping                   |
| 7         | Flexibility and Efficiency      | 2         | Cmd+K works well; zero visible keyboard focus indicators anywhere tested                 |
| 8         | Aesthetic and Minimalist Design | 4         | Confirmed live: one accent, no shadows, no decorative clutter                            |
| 9         | Error Recovery                  | 2         | No troubleshooting/error-lookup page for real runtime errors (ResolutionError, etc.)     |
| 10        | Help and Documentation          | 3         | Solid core coverage, very uneven depth page to page                                      |
| **Total** |                                 | **30/40** | **Good, with real gaps**                                                                 |

## Design Specificity Verdict

**LLM assessment (Assessment A):** The content is authentically specific to TinyDI, not generic docs boilerplate — real signatures (`registerFactory<T>(token, factory, lifetime?)`), real error class names, an FAQ that answers "No, by design" instead of hedging, and a Comparison page that argues with concrete facts (compiler flags, runtime deps) instead of vague claims. The homepage and the bespoke SVG diagram reinforce the same register.

**Deterministic scan (Assessment B):** `detect.mjs` returned 5 findings on the built `dist/` (exit code 2): `single-font` ×2, `em-dash-overuse` ×2, `aphoristic-cadence` ×1. `single-font` is a false positive — DESIGN.md commits deliberately to one typeface family (Archivo Variable) for hierarchy via weight/width instead of a second font. `em-dash-overuse` and `aphoristic-cadence` are legitimate copy-tone flags, unrelated to the intentional visual system.

**Browser evidence:** Console-level detector injection succeeded on all 5 sampled pages (EN home, `/docs/installation.html`, `/docs/api-reference.html`, `/docs/comparison.html`, IT home) and surfaced real, mechanically-confirmed issues layered under the visual-identity level: a WCAG contrast failure, a text-occlusion bug, cramped table padding, and an oversized/overlong hero heading. The evidence tabs were closed after each page's check to move to the next, so no overlay remains open right now for you to look at — the findings below are the captured console evidence, not a live overlay.

## Overall Impression

The writing and technical precision are genuinely on-brand — this reads as documentation written by someone who actually built the library, not templated developer-docs copy. The gap is entirely at the mechanical/structural layer: real keyboard-accessibility and contrast defects that directly contradict this project's own stated accessibility commitments, plus an information architecture that's still a flat list of 9 equally-weighted pages even though the content itself clearly splits into "get going" vs "reference" vs "decide to adopt" clusters. Fix the accessibility defects first — they're concrete WCAG failures, not taste — then regroup the nav before adding any new page.

## What's Working

- **Voice discipline**: `faq.mjs` (EN+IT) answers with exact error-class names and "no hedging" phrasing — exactly the "precise and direct, zero hype" register PRODUCT.md asks for.
- **The Quick Start promise holds up**: the single end-to-end example on the homepage and in `quick-start.mjs`, verified live, genuinely delivers "there is no step you are not seeing."
- **EN/IT parity is real, not superficial**: `tokens.mjs`, `api-reference.mjs`, `comparison.mjs`, `faq.mjs` in Italian match the English version's structure and depth — no thinner translation.

## Priority Issues

**[P0] Keyboard focus is invisible across the entire site.** Confirmed by direct Tab-key testing on `faq.html`: the skip-link, logo, primary nav, search trigger, and EN/IT switch show no visible focus indicator at any point; the "Docs" highlight is current-page state, not focus. This directly breaks DESIGN.md's own accessibility commitment ("full keyboard navigation with visible focus states throughout") and WCAG 2.4.7, and hard-blocks a keyboard-only user. Fix: add a real `:focus-visible` rule (2px accent outline + offset) to every interactive element in `components.css`; make the skip-link actually appear on focus. Suggested command: `/impeccable harden`.

**[P1] Accent-background text fails contrast — mechanically confirmed, identical on both languages.** The detector measured 2.4:1 (needs ≥3:1 even for large text) on a heading rendered in `#eef2f9` over the accent color `#ff723a`, in the homepage's headline feature card — identical reading on both the EN and IT home. DESIGN.md already defines `--accent-ink` specifically for text on accent-filled surfaces; this spot is very likely using `--ink` instead. Fix: swap the color to `--accent-ink` on that card. Suggested command: `/impeccable harden` (or a one-line CSS fix directly).

**[P1] Code sample content is cropped on the very first thing a new user reads.** `docs/installation.html`'s `npm install`/`yarn add` code block shows ~37% of the line ("yarn add tinydi-containe...") covered by an opaque element — the first code a prospective adopter sees. Fix: check `code-block.js`/`components.css` for an overflow or copy-button z-index/positioning bug on narrow code lines. Suggested command: `/impeccable audit` (then fix directly).

**[P1] The docs sidebar renders twice on mobile.** Confirmed at 390×844: the full 9-link sidebar appears in-flow above the content on `api-reference.html`, in addition to the identical list inside the hamburger drawer — Casey has to scroll past two copies of the same navigation before reaching any content. Fix: hide `.docs-sidebar` below the drawer breakpoint in `components.css`, leaving only the drawer. Suggested command: `/impeccable layout`.

**[P2] Nine flat sidebar entries, no grouping; no troubleshooting/testing/migration content.** The content itself already implies three clusters (Installation/Quick Start/Tokens/Container/Lifetimes = guide, API Reference = reference, Examples/FAQ/Comparison = adopt), but `docsNav` in `nav.mjs` renders them as one undifferentiated list. Separately, there's no dedicated page for "what do I do when I hit `ResolutionError`/`CircularDependencyError`", no "Testing" page (only a passing mention in `container.mjs` that `remove()` helps swap fakes in tests), and Comparison only argues against decorator-heavy libraries (TSyringe/InversifyJS), not against the hand-rolled composition root many experienced adopters are actually choosing between. Fix: group `docsNav` into labeled clusters; add a short Testing page and an error-lookup section reusing the existing `api-table`/`faq-list` block types. Suggested command: content edit, not a visual command.

## Persona Red Flags

**Sam (Accessibility-dependent user)**: Directly tested via keyboard — zero focus indicators anywhere, skip-link never becomes visible even when it should be focused first in tab order. This is a hard block, not a nitpick — confirmed on both the LLM review and (via the contrast finding) the mechanical scan.

**Alex (Impatient power user)**: Cmd+K search works well (typing "circular" surfaces `resolve`/error docs immediately) — but navigating by keyboard out of habit, Alex never sees where focus currently is, forcing a fallback to the mouse. That's a direct contradiction of the site's own "for experienced developers" positioning.

**Casey (Distracted mobile user)**: Confirmed at 390px — landing on any docs page shows the full 9-item sidebar before the content, then the same list again inside the drawer.

## Minor Observations

- Hero `<h1>` measured at 76px / 56 characters spanning ~46% of viewport height, with body copy running ~89 characters/line — the 68ch prose-measure cap defined in DESIGN.md doesn't appear to reach the hero lede.
- `api-table-wrap` / `compare-table-wrap` content sits flush against its container edge on both `api-reference.html` and `comparison.html` (cramped padding, same component, two pages).
- The homepage hero eyebrow ("v0.1.3 · Zero dependencies") sits in mild tension with PRODUCT.md's own anti-reference against "tiny uppercase tracked eyebrows" — worth a deliberate call, not an automatic removal, since it appears once (hero only), not above every section.
- Detector flagged `em-dash-overuse` (10-11 in `api-reference.html` body, both languages) and `aphoristic-cadence` (4 constructions on the homepage) — legitimate copy-tone signals worth a pass, unrelated to the visual system.
- Version badge, FAQ first-item-open default, and the `container.mjs` → API Reference `#errors` cross-link all check out correctly.

## Questions to Consider

- If "explicit over magic" is the core claim, why is the site's own navigation the least explicit interaction on it — no visible signal of where keyboard focus currently is?
- The homepage promises "there is no step you are not seeing" — does that promise still hold when a developer hits a real `CircularDependencyError` on a 6-service graph, backed by only one paragraph and a 4-line example?
- Comparison only engages TSyringe/InversifyJS (decorator-heavy) — does leaving out the hand-rolled composition-root alternative dodge TinyDI's actual closest competitor?
- With 9 sibling pages and zero grouping, should "Lifetimes" and "Tokens" really sit at the same nav level as "FAQ" and "Comparison", or would two-three labeled clusters (Guide / Reference / Adopt) better match how the content is actually used?
