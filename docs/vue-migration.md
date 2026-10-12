# Vue technical wiki migration

The React/Next.js presentation was replaced with Vue 3 and Vite. The shared record model, source references, local review decisions, MCP tools, recording scripts and Release media remain in place.

## Routes

- `/` and `/en/overview/`: documentation index.
- `/en/news/`: recent records.
- `/en/changes/`: searchable catalog, with real type and topic filters.
- `/en/changes/<slug>/`: permanent article.
- `/en/sources/`: real source repositories and unpublished local change sets.
- `/en/tab-copy/`: existing comparison workflow.
- `/en/workflow/`: recording and issue guidance.
- `/pt-BR/`: the same navigation in Portuguese.
- `/revisoes/` and `/revisoes/<slug>/`: existing links remain available.

The build pre-renders these routes into `out/<route>/index.html`. Vue Router uses normal URL history. Direct links on GitHub Pages work because every catalog route has a real HTML file. A `404.html` is also generated.

## Local use

Requires Node.js 24 or newer.

```sh
npm install
npm run deploy:local -- --port 3100
```

For Tailscale, pass the actual tailnet IP using `--host`. The script does not stop processes on occupied ports. Browser preferences keep the existing `orca-review:local-preview:v1` storage key. Local decisions keep their previous `orca-decision:<slug>:<references>` keys.

```sh
npm test
npm --prefix mcp install
npm --prefix mcp test
NEXT_PUBLIC_BASE_PATH=/orca-change-review npm run build
NEXT_PUBLIC_BASE_PATH=/orca-change-review node scripts/check-pages-export.mjs
```

## Validation scope

Production Vue client and server builds and all exported routes were checked locally. DOM-level checks cover hydration, record search, empty results, article navigation, video references, saved decisions, language switching and README mode. These checks are not screenshot or browser rendering tests.

This execution environment prohibits listening on a localhost port and starting Chromium (`EPERM`). Desktop, tablet and mobile screenshots must still be reviewed on an unrestricted host before publication. GitHub publication was not performed in this environment.

## Safe installation from Orca artifacts

```sh
node ../orca/artifacts/install-orca-changes-stuff.mjs --update-site .
```

The installer stages the Vue project, preserves developer records, `.env.local` and media, installs its dependencies and builds before replacing the active source. It backs up replaced files and rolls back a failed replacement. Legacy `app/` and `next.config.mjs` files are moved into the backup after validation. Stop the development server while applying the update.

## Rendered browser checks

The optional browser script reuses Playwright from your Orca checkout. Set `ORCA_SOURCE` when that checkout is not next to the website. Install the matching Chromium browser using Orca's existing Playwright setup, then keep the local website running in another terminal.

```sh
ORCA_BACKGROUND_LAUNCH=1 node scripts/check-wiki-browser.mjs --url http://127.0.0.1:3100/
```

It checks real article routes, search, empty results, mobile navigation, horizontal overflow and JavaScript errors at mobile, tablet and desktop widths. It saves screenshots to `artifacts/wiki-qa/` for manual inspection. Browser checks have not passed in the restricted execution environment described above.

## Validation performed on this migration

- Vue 3.5.43 and Vite 7.3.1 client and server builds passed. Temporary test dependencies came from npm registry tarballs verified against their published integrity hashes.
- 32 static routes passed rendered HTML, source reference and repository asset-prefix checks.
- DOM checks passed with desktop and mobile navigation modes: hydration, content search, empty results, routing, Release video references, saved-review recovery, language switching and README mode.
- Catalog, local-preview, media, MCP handler and recording-plan regression tests passed.
- A real Vue build inside a temporary installation passed, and the previous Next page was preserved in its backup. Invalid catalogs and failed builds left the active installation intact.
- Bash syntax checks passed for deployment and publication scripts.

Prepared source lives in the writable Orca artifacts directory. The sibling website checkout was read-only in this environment, so it was not replaced and no GitHub deployment was performed. Use the installation command above from your normal terminal to apply the migration.
