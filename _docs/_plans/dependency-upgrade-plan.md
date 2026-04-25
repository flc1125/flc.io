# Dependency Upgrade Plan

## Context

The project is a Hexo site with npm-managed production dependencies only.
`package-lock.json` already resolves direct dependencies to their current latest
versions, but several `package.json` ranges are older than the locked versions.
`npm audit --package-lock-only` reports 13 vulnerabilities, mostly from older
transitive dependencies pulled in by `hexo-tag-aplayer` and `hexo-admonition`.

## Phase 1: Low-risk direct dependency sync

Goal: align `package.json` direct dependency ranges with the latest versions
already resolved in `package-lock.json`.

Checklist:

- [ ] Update `hexo` from `^8.0.0` to `^8.1.1`.
- [ ] Update `hexo-renderer-marked` from `^7.0.0` to `^7.0.1`.
- [ ] Update `hexo-theme-icarus` from `^6.1.0` to `^6.1.1`.
- [ ] Update `hexo-theme-landscape` from `^1.0.0` to `^1.1.0`.
- [ ] Run `npm install --package-lock-only`.
- [ ] Confirm only `package.json` and `package-lock.json` changed.

## Phase 2: Fix lockfile-level security updates

Goal: update vulnerable transitive dependencies when the existing upstream
semver ranges already permit safe patch or minor upgrades.

Checklist:

- [ ] Update `dompurify` from `3.3.3` to `3.4.1` or newer.
- [ ] Update `fast-xml-parser` from `5.5.10` to `5.7.2` or newer.
- [ ] Run `npm audit --package-lock-only`.
- [ ] Confirm whether the `dompurify` and `fast-xml-parser` findings are gone.
- [ ] Keep a note of any remaining audit findings after the lockfile refresh.

## Phase 3: Old plugin risk review

Goal: decide how to handle vulnerabilities that cannot be fixed by normal npm
updates because they come from stale direct plugins.

Checklist:

- [ ] Review actual usage of `hexo-tag-aplayer` in site content and templates.
- [ ] Decide whether `hexo-tag-aplayer` can be removed or replaced.
- [ ] Review actual usage of `hexo-admonition` in site content and templates.
- [ ] Decide whether `hexo-admonition` can be removed, replaced, or kept.
- [ ] If either plugin must stay, test npm `overrides` in a separate commit.
- [ ] Avoid merging broad `overrides` unless `npm run build` passes and affected
      generated pages are inspected.

## Phase 4: Verification

Goal: make sure dependency changes do not break site generation.

Checklist:

- [ ] Run `npm install`.
- [ ] Run `npm run clean`.
- [ ] Run `npm run build`.
- [ ] Run `npm audit --package-lock-only`.
- [ ] Inspect `git diff -- package.json package-lock.json`.
- [ ] Summarize remaining audit findings and any accepted risk.

## Phase 5: Release preparation

Goal: leave the branch ready for review and deployment.

Checklist:

- [ ] Commit low-risk dependency range and lockfile updates separately from any
      plugin replacement or override work.
- [ ] Include build and audit results in the commit or PR summary.
- [ ] If stale plugins remain, document why they were kept and what risk remains.
