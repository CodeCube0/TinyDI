# Releasing a new version

This is the step-by-step runbook for publishing a new version of `tinydi-container` to npm. The release pipeline is fully automated (Changesets + GitHub Actions + npm Trusted Publishing) — in the normal case you never run `npm publish` yourself.

## TL;DR

```bash
npx changeset          # describe your change, pick patch/minor/major
git add .changeset
git commit -m "..."
git push
```

Then on GitHub: wait for the **"chore: release"** PR to appear/update, approve its workflow runs if GitHub asks you to, review it, and **merge it**. That merge publishes to npm automatically. No `NPM_TOKEN`, no OTP, nothing else to do.

---

## Step by step

### 1. Make your change

Normal development: branch, code, tests, `npm run lint` / `npm test` / `npm run build` all green, PR against `main` as usual.

### 2. Add a changeset (if the change affects the published package)

Only needed if your change touches `src/` (i.e. changes what gets published to npm). Docs-only, examples-only, or CI/tooling-only changes don't need one.

```bash
npx changeset
```

This asks:

- Which package changed — there's only one (`tinydi-container`), just confirm it.
- Bump type — **patch** (bug fix, no API change), **minor** (new backwards-compatible API), or **major** (breaking change). Follow [Semantic Versioning](https://semver.org/).
- A summary of the change — this text becomes the `CHANGELOG.md` entry, so write it for someone reading the changelog, not for yourself.

This creates a new file under `.changeset/*.md`. Commit it together with your code change (in the same PR is fine, or a separate one — it just needs to land on `main` before the release workflow can pick it up).

```bash
git add .changeset
git commit -m "..."
git push
```

You can add **multiple changesets** for multiple independent changes before releasing — they all get bundled into the same version bump.

To preview what a release would look like without publishing anything:

```bash
npx changeset status
```

### 3. Merge your PR to `main` as normal

Once your PR (with its changeset) is merged, `.github/workflows/release.yml` runs automatically on the push to `main`.

### 4. The "Version Packages" PR appears

Because there's now a pending changeset, the workflow opens (or updates, if one already exists) a pull request titled **"chore: release"** from a `changeset-release/main` branch. It:

- Bumps the version in `package.json` according to the changeset(s)
- Moves the changeset content into `CHANGELOG.md`
- Deletes the consumed `.changeset/*.md` files

**This PR does not publish anything by itself.** It's just a preview — review the version bump and the `CHANGELOG.md` diff before merging. If you add more changesets to `main` before merging it, the PR updates itself to include them.

> **First-time-per-PR quirk**: GitHub may show the PR's `CI`/`Commitlint` checks as **"Action required"** instead of running them, because they're triggered by a PR opened by `github-actions[bot]`. If you see this: go to the [Actions tab](https://github.com/CodeCube0/TinyDI/actions), find the runs in that state, and click **"Approve and run workflow"**. This has to be done once per new "Version Packages" PR (not once ever).

### 5. Merge the "Version Packages" PR

When you're ready to actually release:

```
Merge pull request → "chore: release"
```

This push to `main` re-triggers `release.yml`. This time there's no pending changeset, so instead of opening another PR it runs the actual publish: `npm run build && changeset publish`, authenticated via **npm Trusted Publishing (OIDC)** — no token, no interactive step.

### 6. Verify

```bash
npm view tinydi-container version
```

should show the new version. You can also check:

- The [Actions run](https://github.com/CodeCube0/TinyDI/actions/workflows/release.yml) for that push — the `release` job should be green, with the publish step showing `npm notice Publishing to https://registry.npmjs.org ...` and no error.
- [npmjs.com/package/tinydi-container](https://www.npmjs.com/package/tinydi-container) — new version listed, provenance badge present.
- A GitHub Release is created automatically for the new tag.

---

## Manual/emergency release (fallback)

If the automated pipeline is ever broken and you need to publish by hand:

```bash
npm login                 # only if not already logged in; may prompt for OTP in the browser
npm whoami                # sanity check you're authenticated as the right account
npm run build
npm publish                # may prompt again for a browser OTP approval — open the printed URL
```

Note the version published is whatever is currently in `package.json` — if you're doing this because the automated "Version Packages" step didn't run, bump the version and update `CHANGELOG.md` yourself first, and still add/commit a changeset afterwards so the repo's history stays consistent with what changesets expects.

## Troubleshooting

- **The "Version Packages" PR never appears after pushing a changeset to `main`.** Check the `release.yml` run in the Actions tab — if it's stuck on "Action required", approve it (see step 4). If it ran but did nothing, confirm your `.changeset/*.md` file actually made it into the `main` branch (`git log -- .changeset`).
- **The publish step fails with an npm auth/permission error.** The Trusted Publisher configuration on `npmjs.com/package/tinydi-container/access` must exactly match this repo (`CodeCube0/TinyDI`) and workflow filename (`release.yml`) — if either the repo or the workflow file is ever renamed, update it there too.
- **You need to change the version number without a real code change** (e.g. re-triggering a broken release): `npx changeset` still works fine for that — describe it honestly (e.g. "fix release pipeline configuration") rather than skipping the changelog entry.

## See also

- [CONTRIBUTING.md](CONTRIBUTING.md) — how changesets fit into the day-to-day contribution flow
- [CHANGELOG.md](CHANGELOG.md) — the released history this process maintains
- [CLAUDE.md](CLAUDE.md) — "CI, release, and governance" section, for the full technical wiring behind this pipeline (why Trusted Publishing instead of a token, npm version requirements, etc.)
