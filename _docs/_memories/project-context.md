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
  are declared.
- `package.json` declares `engines.node >=20.19.0` to match the current Hexo
  dependency floor.
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
- `hexo-theme-landscape` was removed because the site uses `theme: icarus` and
  no repository files reference Landscape outside dependency metadata.
- The old `_config.landscape.yml` file was removed after the Landscape package
  was removed.
- `hexo-renderer-ejs` was removed because the active Icarus theme uses
  JSX/Inferno and the repository has no first-party `.ejs` templates.
- `hexo-tag-aplayer` was removed because it is stale and pulled vulnerable
  older transitive dependencies through `hexo-fs`, `hexo-util`, `chokidar`,
  `micromatch`, `braces`, and `highlight.js`.
- Two posts previously using `{% meting %}` no longer embed music players.
- `hexo-admonition` was removed because no posts used its `!!!` syntax and it
  pulled an older vulnerable `markdown-it` range.
- npm `overrides` were tested for `hexo-tag-aplayer`, but broad overrides broke
  plugin loading or Hexo/Icarus dependency checks. Prefer plugin replacement
  over overrides for this specific package.
- Current dependency cleanup target: `npm audit --package-lock-only` should
  report 0 vulnerabilities after install.

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
- After removing music embeds, inspect generated `public/follow-your-dream/`
  and `public/ponder/` output to confirm they no longer contain `meting-js`,
  APlayer, or MetingJS resource tags.

## Local Planning Conventions

- Files in `_docs/_plans/` should use ordered, dated, status-bearing names:
  `NNN-YYYY-MM-DD-status-short-topic.md`.
- Use three-digit sequence numbers to preserve chronological order, such as
  `001`, `002`, and `003`.
- Use the plan creation date in local calendar format, such as `2026-04-25`.
- Use status values that describe the current execution state:
  `planned`, `in-progress`, `blocked`, or `completed`.
- When a plan status changes, rename the file to keep the filename status in
  sync with the checklist state.

## Branching Notes

- A dependency upgrade branch named `upgrade-dependencies` was created from
  `master`.
- Slash-separated branch names may fail in this local checkout due to Git ref
  creation behavior; a simple non-slash branch name worked.
