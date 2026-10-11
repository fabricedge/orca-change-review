# Adding changes

Each change has its own record in `lib/revisions.mjs` and a stable page under `/revisoes/SLUG`. A record must reference a PR or at least one commit; branches and a video alone are not references. A comparison may group related alternatives, but each alternative also has its own record and commit history.

Use the existing Linux service PR record for a documented PR, or one of the generated tab-copy entries for a commit-only change. Include:

- `slug`: unique, lowercase words separated by hyphens; keep it stable when the title changes.
- `title`, `summary`, `kind`, `status`, `implementation`: user-facing description and the actual validation state.
- `pullRequest`: optional HTTPS PR URL.
- `commits`: an array of `{ id, label }`; required to be nonempty when there is no PR.
- `repository`: GitHub `OWNER/REPO` when commits are published there. Omit it for local commits so the site does not invent broken public links.
- `branches`: array, including an empty array for a PR with no recorded branch.
- `sections`: arrays of paragraphs, files, commands, checks and limitations; use the existing section shapes.

Run before updating the site:

```sh
node scripts/check-revisions.mjs
npm run build
```

The catalog searches titles, repository names, branches, commit IDs and PR URLs. It filters by change kind. Each page shows its PR and/or commits prominently. Local review decisions are tied to the commit IDs, or to the PR URL for a PR-only record.

The three tab-copy pages use `variantIds` to select their own video and screenshots from the shared Release manifest. The combined comparison retains all three. Release files are evidence for those specific changes, not substitutes for source references. See [GitHub Releases](github-releases.md) for publishing media.
