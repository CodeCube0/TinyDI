export const meta = {
  title: "What the release plan couldn't predict: publishing for real",
  description:
    'The npm package name getting blocked at the actual publish moment, the OTP/CI standoff that followed, and a handful of docs-app bugs only production traffic (or a real browser) revealed.',
};

export const blocks = [
  {
    type: 'p',
    html: "Every other post in this series is about a decision made deliberately, ahead of time. This one is about the opposite: three things that went wrong only once the project stopped planning and actually tried to ship — a rejected package name, a CI pipeline that couldn't authenticate, and a handful of docs-app bugs that only a live deploy surfaced. None of these were anticipated by the phase that preceded them; all three were real, and all three got fixed the same day.",
  },
  {
    type: 'heading',
    level: 2,
    id: 'the-name',
    text: "The package name npm view couldn't have warned about",
  },
  {
    type: 'p',
    html: '<code>npm view tinydi</code> returned a 404 during planning — read, reasonably, as "the name is free." At the actual moment of publishing, npm rejected the unscoped name <code>tinydi</code> anyway: not because it existed, but because it was judged too similar to the pre-existing package <code>tiny-di</code>, under npm\'s anti-typosquatting policy. <code>npm view</code> only ever checks for an exact name match — it has no way to warn you about a similarity check that only runs at actual publish time.',
  },
  {
    type: 'p',
    html: 'The fix was a full rename to <strong><code>tinydi-container</code></strong> across every file that referenced the npm package name — both READMEs, both docs-app languages, examples, CONTRIBUTING.md — while deliberately keeping "TinyDI" as the project and brand name everywhere else. Only the npm specifier changed; nobody imports <code>tinydi</code> and nobody ever will.',
  },
  { type: 'heading', level: 2, id: 'the-otp-standoff', text: 'The 2FA/OTP standoff with CI' },
  {
    type: 'p',
    html: "The npm account's two-factor mode requires an interactive browser approval on every single publish. That is fundamentally incompatible with a non-interactive CI job — no token, of any scope, satisfies an interactive OTP prompt. <code>tinydi-container@0.1.1</code> shipped manually, from an authenticated local session, as the only way around it for a first release. Two more issues turned up chasing an automated path for the next one:",
  },
  {
    type: 'list',
    items: [
      '<code>changesets/action</code> reads its npm token from an env var literally named <code>NPM_TOKEN</code> — a workflow that instead exported it as <code>NODE_AUTH_TOKEN</code> (the convention <code>actions/setup-node</code> itself uses) failed silently rather than loudly, because the action just fell back to whatever auth it could find.',
      'npm Trusted Publishing (OIDC) briefly returned a 404 on the actual publish step for a package version being published this way for the first time — a known npm quirk when provenance is requested for a never-before-published version, not a permissions problem.',
    ],
  },
  {
    type: 'p',
    html: 'The durable fix was switching fully to npm Trusted Publishing: removing <code>NPM_TOKEN</code> from the workflow entirely (so there is no token to silently fall back to), bumping the CI job to npm CLI ≥11.5.1 via an explicit self-update step (Trusted Publishing requires it), and configuring a matching Trusted Publisher entry on npmjs.com for this exact repo and workflow file. <code>tinydi-container@0.1.2</code> published fully automatically through this path — Version Packages PR merged, workflow ran, real publish, no manual OTP step. <code>RELEASE.md</code> now documents the whole runbook for whoever cuts the next release.',
  },
  {
    type: 'callout',
    kind: 'warning',
    title: 'The common thread',
    html: 'Neither the naming rejection nor the OTP failures were things a careful reading of the plan could have caught in advance — both only exist at the actual moment of talking to npm\'s real infrastructure. "It worked in planning" and "it works when you actually publish" turned out to be different claims.',
  },
  {
    type: 'heading',
    level: 2,
    id: 'docs-app-bugs',
    text: 'A second wave, after the site went live',
  },
  {
    type: 'p',
    html: 'A later pass over the deployed docs site turned up its own crop of production-only bugs, on top of the three already covered in <a href="a-docs-site-without-a-framework.html">the docs-site post</a>:',
  },
  {
    type: 'list',
    items: [
      '<strong>The code-block copy button deleted its own icon.</strong> The click handler set <code>button.textContent</code> directly to show "Copied!" — which silently wipes out the icon <code>&lt;svg&gt;</code> sitting next to the label, since an SVG contributes nothing to <code>textContent</code>. The icon never came back after the first click. Fixed by only ever swapping the label <code>&lt;span&gt;</code>\'s text, never the button\'s.',
      '<strong>Twelve absolute internal links, across six files in both languages.</strong> Links written as <code>href="/docs/lifetimes.html"</code> work fine in local dev, where <code>BASE_PATH</code> is empty — and 404 on the real GitHub Pages deploy, where the site is served from <code>/TinyDI</code>. Invisible until the deployed site was actually clicked through.',
      'Cross-document View Transitions (<code>@view-transition { navigation: auto; }</code>) were tried for smoother page-to-page navigation and reverted the same day — even the bare at-rule, with zero custom styling, threw a real console exception on every navigation when tested in a browser. An attempted improvement, not a shipped one.',
    ],
  },
  {
    type: 'p',
    html: 'None of these three were caught by <code>npm run lint</code>, <code>npm run build</code>, or the test suite — all green throughout. They were caught by clicking through the actual deployed pages, which is the same lesson the earlier docs-site bugs already taught, reconfirmed by a second, independent round of real bugs.',
  },
];
