# https://flc.io

个人博客，[博客说明](https://flc.io/hello-world/)。

## Links

- [首页](https://flc.io/)
- [归档](https://flc.io/archives/)
- [分类](https://flc.io/categories/)
- [标签](https://flc.io/tags/)
- [开源](https://flc.io/open-source/)
- [关于](https://flc.io/about/)

## Development

Requires Node.js `>=20.19.0`. Keep `package-lock.json` committed.

- `npm ci`: install the exact dependency versions in the lockfile.
- `npm install`: install or update dependencies when intentionally changing them.
- `npm run server`: start local Hexo server.
- `npm run build`: generate static output.
- `npm run clean`: remove generated output and cache.

### Verify a change

```bash
npm ci
npm run clean
npm run build
npm audit --package-lock-only
```

For visible site changes, also run `npm run server` and inspect the affected pages.
Review audit findings separately from build results; do not apply dependency fixes
without checking their scope. Do not commit generated `public/` output, caches, or
local plans and notes under `.docs/`.

## Releases

Site versions use Git tags, independently of `package.json`'s package version and
the Icarus theme version. [v3.5](https://github.com/flc1125/flc.io/releases/tag/v3.5)
records the site with Icarus `6.1.1`.

Before publishing another version:

1. Confirm the deployment platform, build environment, and automatic deployment
   triggers before pushing or merging. Do not assume `npm run deploy` is configured.
2. Check local tags, remote tags, and GitHub Releases for an available version:

   ```bash
   git tag --list
   git ls-remote --tags origin
   gh release list
   ```

3. Verify the intended `main` commit using the steps above. Create an annotated
   tag on that commit, push the tag, and publish a GitHub Release with the changes
   and validation results. Never move or overwrite an existing release tag.

### Roll back a change

Create a branch from the current `main` and use `git revert` on the upgrade commit.
For a merge commit, verify its parents before selecting `-m`. Restore the dependency
declaration, lockfile, and theme configuration together. Verify the result, open a
rollback PR, and deploy through the confirmed deployment workflow.

Prefer reverting the upgrade over resetting the repository to an older tag, so
that newer posts and unrelated changes are preserved. To rebuild the complete
`v3.5` release without changing the current working tree:

```bash
git fetch origin tag v3.5
git worktree add --detach ../flc-v3.5 v3.5
```

Run the verification steps from that separate worktree. If a previous deployment
is restored directly on the hosting platform, also revert the faulty upgrade in
Git so the next build does not publish it again.

## Repository

- [flc1125/flc.io](https://github.com/flc1125/flc.io)

## Powered by

© 2017-2026 Flc
