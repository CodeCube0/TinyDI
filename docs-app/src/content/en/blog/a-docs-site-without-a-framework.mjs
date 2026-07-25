export const meta = {
  title: 'Building a documentation site without a framework',
  description:
    'Why this site is a hand-written Node static-site generator instead of 11ty/Astro/Next, and three real bugs that only showed up in an actual browser.',
};

export const blocks = [
  {
    type: 'p',
    html: "This site — the one you're reading this on — has no build framework underneath it. No 11ty, no Astro, no Next. <code>docs-app/build.mjs</code> is a few hundred lines of plain Node that reads content modules and template functions and writes plain HTML/CSS/JS into <code>dist/</code>. That was a deliberate reading of the spec's constraint, and it produced its own share of very real bugs, all found the same way: opening the site in an actual browser.",
  },
  {
    type: 'heading',
    level: 2,
    id: 'reading-the-constraint',
    text: 'What "no framework" actually meant',
  },
  {
    type: 'p',
    html: "The spec ruled out a runtime framework for the shipped site — nothing client-side doing routing, hydration, or rendering. It did not rule out a small build-time script that turns structured content into static files, which is a different thing entirely from what a reader's browser has to execute. <code>docs-app/src/lib/highlight.mjs</code> (a hand-rolled regex tokenizer for syntax highlighting) and <code>src/scripts/search.js</code> (a hand-written substring scorer over a prebuilt JSON index) follow the same reading: no Fuse.js, no client-side highlighting library, both done at build time or with plain vanilla JS.",
  },
  { type: 'heading', level: 2, id: 'content-as-data', text: 'Content is data, not markup' },
  {
    type: 'p',
    html: 'Every doc and blog page is a small <code>.mjs</code> module exporting <code>meta</code> and a <code>blocks</code> array — a tiny DSL (<code>heading</code>/<code>p</code>/<code>list</code>/<code>code</code>/<code>callout</code>/…) that a single <code>renderBlocks(blocks, lang)</code> function turns into HTML. The same function extracts the search-index chunks (one per heading) from the exact same source used to render the page, so content and search index structurally cannot drift apart the way two independently maintained sources would.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'real-bugs',
    text: 'Three bugs found only by opening the browser',
  },
  {
    type: 'p',
    html: 'None of these three showed up from reading the code. All three were caught by actually clicking around the rendered site:',
  },
  {
    type: 'list',
    items: [
      '<strong>Unsized SVG icons.</strong> The GitHub icon in the header rendered at its raw ~300×150 intrinsic size instead of a normal icon size, because nothing set an explicit width/height on it. Fixed with a defensive fallback rule, <code>svg { width: 1em; height: 1em; }</code>, in <code>base.css</code> — every icon still needs an explicit size rule somewhere, but a missing one now fails quietly instead of loudly.',
      '<strong><code>IntersectionObserver</code> throwing a silent <code>SyntaxError</code>.</strong> The "on this page" scroll-spy was first attempted with <code>rootMargin: \'-5rem\'</code>. <code>rootMargin</code> only accepts pixels or percent, never <code>rem</code> — the browser throws, but only to the console, not anywhere a page reload would surface. It was rewritten as a plain <code>requestAnimationFrame</code>-throttled scroll listener instead, which also fixed a UX issue: a TOC entry now stays active for the whole time its section is on screen, not only the instant its heading crosses the viewport.',
      '<strong>A hardcoded English H1 on the Italian homepage.</strong> A content bug, not a logic bug — the hero heading had an English string baked in even when serving <code>/it/</code>. Only visible by actually loading the Italian page.',
    ],
  },
  {
    type: 'callout',
    kind: 'warning',
    title: 'A pattern worth naming',
    html: 'All three bugs above — plus a fourth found later (a native and a custom "clear" button both rendering on the search input) — share one property: they were invisible in the source and only visible once rendered. Type checking and unit tests do not catch a missing CSS size rule or a browser-specific API contract violation. This is the concrete argument, from this project\'s own history, for actually opening the page instead of trusting a clean lint/type-check run.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'deliberate-non-decisions',
    text: 'One deliberate compromise: no language auto-redirect',
  },
  {
    type: 'p',
    html: 'The chosen language persists in <code>localStorage</code>, but a mismatched page only ever shows a dismissible banner ("Continue in English" / "Continua in italiano") — it never force-redirects. A forced redirect is bad for deep links, breaks back-navigation, and actively fights crawlers trying to evaluate <code>hreflang</code> tags correctly. This was a conscious trade-off between convenience and correctness, and correctness won.',
  },
];
