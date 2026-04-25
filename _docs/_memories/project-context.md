# Project Context Memory

## Repository Identity

- Repository: `flc1125/flc.io`.
- Site URL: `https://flc.io/`.
- Project type: personal Hexo blog and static site.
- Primary language/content locale: Chinese, configured as `zh-CN`.
- Timezone: `Asia/Shanghai`.
- Default branch observed locally: `master`.

## Runtime And Build Model

- Package manager: npm, with `package-lock.json` committed.
- The project currently has production dependencies only; no `devDependencies`
  or `engines` are declared.
- Main scripts:
  - `npm run clean` runs `hexo clean`.
  - `npm run build` runs `hexo generate`.
  - `npm run server` runs `hexo server`.
  - `npm run deploy` runs `hexo deploy`.
- Hexo source directory is `source`; generated output goes to `public`.
- Hexo theme is `icarus`.

## Routing And Deployment Notes

- `www.flc.io` redirects permanently to `https://flc.io/$1`.
- `blog.flc.io` redirects permanently to `https://flc.io/$1`.
- `/labs/filament-manager/(.*)` redirects permanently to `https://fil.flc.io/$1`.
- `_config.yml` skips Hexo rendering for `labs/**` and `shared/**`.

## Release Notes

- Releases use version-like tags such as `v3.1`, `v3.2`, and `v3.3`.
- `v3.3` was created on GitHub from `master` after `v3.2`.
- When preparing future releases, check both local tags and GitHub releases
  before creating a new tag.

## Dependency Maintenance Notes

- Direct npm dependencies are mostly Hexo core packages, Hexo generators,
  renderers, themes, and plugins.
- `package-lock.json` may already contain newer resolved versions than the
  ranges in `package.json`; compare both before assuming an upgrade is needed.
- Recent dependency review found these direct ranges worth syncing:
  - `hexo`: `^8.0.0` to `^8.1.1`
  - `hexo-renderer-marked`: `^7.0.0` to `^7.0.1`
  - `hexo-theme-icarus`: `^6.1.0` to `^6.1.1`
  - `hexo-theme-landscape`: `^1.0.0` to `^1.1.0`
- `hexo-tag-aplayer` is old and still latest at `3.0.4`; it pulls vulnerable
  older transitive dependencies through `hexo-fs`, `hexo-util`, `chokidar`,
  `micromatch`, `braces`, and `highlight.js`.
- `hexo-admonition` is old and still latest at `1.1.2`; it pulls an older
  `markdown-it` range.
- For dependency work, prefer low-risk direct range and lockfile refreshes
  first, then separately evaluate stale plugin replacement or npm `overrides`.

## Verification Habits

- For dependency changes, run:
  - `npm install`
  - `npm run clean`
  - `npm run build`
  - `npm audit --package-lock-only`
- If `node_modules` is absent, `npm list --depth=0` reports missing packages;
  use `package-lock.json` for installed/resolved version inspection until
  dependencies are installed.
- For security work, separate findings that npm can fix through lockfile
  updates from findings that require plugin replacement or explicit overrides.

## Branching Notes

- A dependency upgrade branch named `upgrade-dependencies` was created from
  `master`.
- Slash-separated branch names may fail in this local checkout due to Git ref
  creation behavior; a simple non-slash branch name worked.
