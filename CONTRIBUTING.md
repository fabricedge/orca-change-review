# Contributing

Keep changes focused on recording Orca tests, explaining results and linking evidence to code. Evidence pages never replace proper source-code review.

1. Describe the user problem and expected behavior in an issue or focused PR.
2. Reuse existing recording and MCP tools. Keep local execution separate from publication.
3. Run `npm run check:changes`, `npm run test:preview`, and `npm --prefix mcp test` after installing both dependency sets. For site changes, also run `npm run build`.
4. State what you tested, what failed and what remains unverified. Do not include private recordings or logs in Git.

See [automation](docs/automation.md) and [release process](docs/releases.md). Changes should work on macOS, Linux and Windows; remote paths belong to the execution host.
