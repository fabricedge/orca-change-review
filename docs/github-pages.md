# GitHub Pages deployment

The site can be exported without a Node server. GitHub Actions builds the English/Portuguese tab pages, change catalog and all change pages ahead of time. Videos remain in public GitHub Releases; only their manifest is stored in the site repository.

From the Orca checkout, run:

```sh
bash artifacts/deploy-orca-pages.sh
```

This updates the installed sibling site after validating it, installs the Pages workflow, validates the static export with the repository path, commits the changes, enables GitHub Pages with Actions and pushes to `fabricedge/orca-change-review`. Requires GitHub CLI authenticated with repository administration and workflow permissions. The script requires `main` and checks origin before pushing. It preserves the release manifest and creates the normal site-update backup.

Deployment progress: https://github.com/fabricedge/orca-change-review/actions/workflows/pages.yml

Expected public URL after a successful workflow: https://fabricedge.github.io/orca-change-review/

Future pushes to `main` redeploy automatically. Update `media/releases.json` when publishing new recordings; the deployment does not record Orca or download videos. Local development remains `npm run dev`, without a repository prefix.

For another site checkout/repository:

```sh
bash artifacts/deploy-orca-pages.sh /path/to/site OWNER/REPO
```

The workflow derives the public base path from the repository name. All route parameters are generated from `lib/i18n.mjs` and `lib/revisions.mjs`; new changes need no separate route files. Root navigation is a static HTML refresh with a link fallback. Pages uses trailing-slash URLs so refreshing a nested page works.

The Pages export check ensures expected HTML files exist, asset paths include the repository prefix and videos use public Release URLs. Local font assets are bundled into the site. Static mode is enabled only with `ORCA_GITHUB_PAGES=1`; local server workflows remain available.

GitHub Pages setup: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
