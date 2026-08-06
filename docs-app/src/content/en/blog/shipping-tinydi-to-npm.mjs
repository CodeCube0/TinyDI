export const meta = {
  title: 'Preparing TinyDI for npm: package.json, the exports map, and tree-shaking',
  description:
    'What actually publishing a zero-dependency ESM/CJS library involves: a dual-package build with tsup, a double-condition exports map, and a build-tool quirk that wasn’t ours to fix.',
};

export const blocks = [
  {
    type: 'p',
    html: 'Writing the core library is one problem. Shipping it as a package other projects can <code>npm install</code> and import from either ESM or CJS, with correct types on both sides, is a different one. This post is about the actual mechanics: switching bundlers, the <code>exports</code> map, and one bug that came from the tooling, not from us.',
  },
  { type: 'heading', level: 2, id: 'the-bundler', text: 'From plain tsc to tsup' },
  {
    type: 'p',
    html: "The build moved from a straight per-file <code>tsc</code> emit to <code>tsup</code>, producing a genuine dual ESM+CJS package: <code>dist/index.js</code> (ESM), <code>dist/index.cjs</code> (CJS), and matching <code>dist/index.d.ts</code>/<code>dist/index.d.cts</code> declaration files. A plain <code>tsc</code> emit gives you one module format; a real dual package needs the build tool to bundle and emit both, with separate type declarations, since ESM and CJS type resolution aren't quite the same thing.",
  },
  {
    type: 'heading',
    level: 2,
    id: 'exports-map',
    text: 'The exports map: two conditions, each with its own types',
  },
  {
    type: 'code',
    lang: 'json',
    code: `{
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  }
}`,
  },
  {
    type: 'p',
    html: 'Each condition — <code>import</code> for ESM consumers, <code>require</code> for CJS ones — carries its own <code>types</code> entry, not a shared one. Get this wrong (e.g. one shared <code>.d.ts</code> for both) and a CJS consumer can end up with type errors from ESM-specific type resolution, or vice versa, in a way that only shows up in their build, not in ours.',
  },
  { type: 'heading', level: 2, id: 'zero-deps', text: 'Zero dependencies, one peer dependency' },
  {
    type: 'p',
    html: "<code>package.json</code> has no <code>dependencies</code> field at all — only <code>devDependencies</code> (tooling) and an optional <code>peerDependencies.typescript: \">=6.0.0\"</code>. That's not an incidental detail; it's the whole point of the library. Anyone auditing what they're pulling in by adding TinyDI to a project gets a real answer: nothing.",
  },
  { type: 'heading', level: 2, id: 'not-our-bug', text: "A bug that was the tooling's, not ours" },
  {
    type: 'p',
    html: "<code>tsup</code>'s declaration-bundling step synthesizes an internal <code>baseUrl</code> option, which TypeScript 6.0 hard-errors on as <code>TS5101: Option 'baseUrl' is deprecated</code>. This has nothing to do with anything in this project's own <code>tsconfig.json</code> — it's an interaction between <code>tsup</code>/<code>rollup-plugin-dts</code> internals and TypeScript 6's stricter deprecation policy. The fix is one line, added to <code>tsconfig.build.json</code> specifically (not the base <code>tsconfig.json</code> used for editor/lint/type-check):",
  },
  {
    type: 'code',
    lang: 'json',
    code: `{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}`,
  },
  {
    type: 'callout',
    kind: 'tip',
    title: 'Why this matters beyond the one-line fix',
    html: "Recognizing that an error comes from the build tool's internals rather than your own configuration changes how you fix it: the alternative would have been chasing a nonexistent <code>baseUrl</code> setting in our own <code>tsconfig.json</code> files, where it was never the actual problem.",
  },
  { type: 'heading', level: 2, id: 'consequences', text: 'What this bought, concretely' },
  {
    type: 'p',
    html: "The result is a package that tree-shakes cleanly (ESM output, no side-effecting module-level code) and works the same whether a consumer's bundler picks the <code>import</code> or <code>require</code> condition — verified in practice by the seven examples in this project, which cover both a Vite-based frontend toolchain and plain Node <code>tsx</code> scripts, all resolving the same package correctly.",
  },
  {
    type: 'p',
    html: 'Getting the package itself right turned out to be necessary but not sufficient. Actually publishing it — the point where a package.json meets npm\'s real infrastructure — surfaced a separate set of problems none of this predicted, covered in <a href="what-the-phase-4-plan-couldnt-predict.html">the release post</a>.',
  },
];
