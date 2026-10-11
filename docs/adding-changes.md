# Adding changes

Each change has a stable page under `/revisoes/SLUG`. Built-in records live in `lib/revisions.mjs`; developer records saved by MCP live in `data/reviews.json`. A record must reference an issue, a problem-first issue draft, a PR or at least one commit. Branches and a video alone are not references. An issue does not require a PR or an implementation. A comparison may group related alternatives, but each alternative also has its own record and source references.

Use the existing Linux service PR record for a documented PR, or one of the generated tab-copy entries for a commit-only change. Include:

- `slug`: unique, lowercase words separated by hyphens; keep it stable when the title changes.
- `title`, `summary`, `kind`, `status`, `implementation`: user-facing description and the actual validation state.
- `pullRequest`: optional HTTPS PR URL.
- `issue`: optional HTTPS issue URL (GitHub and GitLab issue paths are supported).
- `issueDraft`: structured local issue draft; see the [MCP guide](mcp.md) for required problem, evidence and guideline fields. It is never labeled as published automatically.
- `commits`: an array of `{ id, label }`; can be empty for an issue, issue draft or PR-only record.
- `repository`: GitHub `OWNER/REPO` when commits are published there. Omit it for local commits so the site does not invent broken public links.
- `branches`: array, including an empty array for a PR with no recorded branch.
- `sections`: arrays of paragraphs, files, commands, checks and limitations; use the existing section shapes.

Run before updating the site:

```sh
node scripts/check-revisions.mjs
npm run build
```

The catalog searches titles, repository names, branches, commit IDs, issue problems and issue/PR URLs. It filters by change kind. Each page shows its source references prominently. Local review decisions use commit IDs, a PR URL, or the issue/draft identity and update timestamp.

The three tab-copy pages use `variantIds` to select their own video and screenshots from the shared Release manifest. The combined comparison retains all three. Release files are evidence for those specific changes, not substitutes for source references. See [GitHub Releases](github-releases.md) for publishing media.
