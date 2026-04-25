# Repository Guidelines

## Project Structure & Module Organization

This repository is a Hexo 8 static blog for `https://flc.io`, primarily written in Chinese. Blog content lives in `source/_posts/`, usually grouped by year such as `source/_posts/2025/`. Drafts live in `source/_drafts/` and are not published until moved or published by Hexo. Static pages are under directories such as `source/about/` and `source/open-source/`. Site assets live in `source/assets/`. `source/labs/**` and `source/shared/**` are excluded from Hexo rendering via `_config.yml` and should be treated as standalone static content. Do not edit generated `public/` output directly.

Project working notes live under `_docs/`. Use `_docs/_plans/` for task plans, phased checklists, and execution notes that help coordinate longer work. The `_docs/_plans/` directory is tracked, but individual plan files are local-only and should stay ignored. Use `_docs/_memories/` for reusable project context that should survive across long-running tasks.

## Plans & Memories

When working on a long task, read relevant local files in `_docs/_plans/` and tracked files in `_docs/_memories/` before making assumptions. If you discover generally useful project information during execution, dynamically update `_docs/_memories/` so future work can reuse it. Keep memories global and durable: prefer project conventions, dependency constraints, release practices, validation habits, and known architectural facts over one-off command logs or temporary status.

## Build, Test, and Development Commands

- `npm install`: install Hexo and theme/plugin dependencies.
- `npm run server`: start the local Hexo server, normally at `http://localhost:4000`.
- `npm run build`: generate the static site into `public/`.
- `npm run clean`: remove Hexo cache and generated output before a fresh build.
- `npm run deploy`: run Hexo deploy; confirm deployment settings before using it.

There is no dedicated test script. Use `npm run build` as the main validation step for content, config, and template changes.

## Coding Style & Naming Conventions

Use Markdown for posts with YAML front matter. Keep post filenames lowercase, URL-friendly, and descriptive, for example `source/_posts/2025/go-sync-pool.md`. Follow the existing front matter shape:

```yaml
---
title: "Post Title"
date: YYYY-MM-DD HH:mm:ss
categories:
- 编程
tags:
- Go
toc: true
---
```

Match the existing indentation style of the surrounding file for YAML arrays, such as four-space indentation in `_config.yml` or no-indent lists in post front matter. There is currently no shared custom CSS file; prefer theme configuration first, and only add a dedicated CSS asset when a site-wide style change needs it.

## Testing Guidelines

Before opening a pull request, run `npm run build`. For visual changes, also run `npm run server` and inspect the affected page locally. When editing `source/labs/` or `source/shared/`, verify the static HTML directly because those paths bypass Hexo rendering.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits, often with scopes: `docs(blog): ...`, `fix(vercel): ...`, `build(deps): ...`, `feat(shared): ...`. Match that pattern and keep the subject imperative and concise. Pull requests should describe the content or config change, list validation performed, link related issues when applicable, and include screenshots for visible page or styling updates.

## Security & Configuration Tips

Do not commit secrets or local deployment credentials. Vercel redirects live in `vercel.json`; Hexo site metadata, permalink behavior, skipped render paths, sitemap, and feed settings live in `_config.yml`.
