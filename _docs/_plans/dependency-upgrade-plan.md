# Dependency Upgrade Plan

## Context

The project is a Hexo site with npm-managed production dependencies only.
`package-lock.json` already resolves direct dependencies to their current latest
versions, but several `package.json` ranges are older than the locked versions.
Initial `npm audit --package-lock-only` reported 13 vulnerabilities, mostly
from older transitive dependencies pulled in by `hexo-tag-aplayer` and
`hexo-admonition`. The implemented path removed those stale plugins and brought
the audit result to 0 vulnerabilities.

## Phase 1: Low-risk direct dependency sync

Goal: align `package.json` direct dependency ranges with the latest versions
already resolved in `package-lock.json`.

Checklist:

- [x] Update `hexo` from `^8.0.0` to `^8.1.1`.
- [x] Update `hexo-renderer-marked` from `^7.0.0` to `^7.0.1`.
- [x] Update `hexo-theme-icarus` from `^6.1.0` to `^6.1.1`.
- [x] Update `hexo-theme-landscape` from `^1.0.0` to `^1.1.0`.
- [x] Run `npm install --package-lock-only`.
- [x] Confirm only `package.json` and `package-lock.json` changed for this
      phase.

## Phase 2: Fix lockfile-level security updates

Goal: update vulnerable transitive dependencies when the existing upstream
semver ranges already permit safe patch or minor upgrades.

Checklist:

- [x] Update `dompurify` from `3.3.3` to `3.4.1` or newer.
- [x] Update `fast-xml-parser` from `5.5.10` to `5.7.2` or newer.
- [x] Run `npm audit --package-lock-only`.
- [x] Confirm whether the `dompurify` and `fast-xml-parser` findings are gone.
- [x] Keep a note of any remaining audit findings after the lockfile refresh.

Result: `dompurify` resolved to `3.4.1`, `fast-xml-parser` resolved to `5.7.2`,
and the remaining audit findings were isolated to stale plugin chains.

## Phase 3: Old plugin risk review

Goal: decide how to handle vulnerabilities that cannot be fixed by normal npm
updates because they come from stale direct plugins.

Checklist:

- [x] Review actual usage of `hexo-tag-aplayer` in site content and templates.
- [x] Decide whether `hexo-tag-aplayer` can be removed or replaced.
- [x] Review actual usage of `hexo-admonition` in site content and templates.
- [x] Decide whether `hexo-admonition` can be removed, replaced, or kept.
- [x] If either plugin must stay, test npm `overrides` in a separate commit.
- [x] Avoid merging broad `overrides` unless `npm run build` passes and affected
      generated pages are inspected.

Result: `hexo-admonition` had no content usage and was removed with its unused
CSS. `hexo-tag-aplayer` was used by two posts, but the music embeds were removed
instead of replaced. npm `overrides` were tested but rejected because they broke
plugin loading or Hexo/Icarus dependency checks.

## Phase 4: Verification

Goal: make sure dependency changes do not break site generation.

Checklist:

- [x] Run `npm install`.
- [x] Run `npm run clean`.
- [x] Run `npm run build`.
- [x] Run `npm audit --package-lock-only`.
- [x] Inspect `git diff -- package.json package-lock.json`.
- [x] Summarize remaining audit findings and any accepted risk.

Result: build succeeded and `npm audit --package-lock-only` reports 0
vulnerabilities. The generated `follow-your-dream` and `ponder` pages no longer
contain APlayer or MetingJS markup.

## Phase 5: Release preparation

Goal: leave the branch ready for review and deployment.

Checklist:

- [ ] Commit low-risk dependency range and lockfile updates separately from any
      plugin replacement or override work.
- [ ] Include build and audit results in the commit or PR summary.
- [x] If stale plugins remain, document why they were kept and what risk remains.

Result: no stale vulnerable plugins remain in `package-lock.json`.
