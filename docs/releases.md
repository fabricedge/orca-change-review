# Versioning and releases

Use one semantic version for the website and MCP: PATCH for fixes, MINOR for compatible features, MAJOR for breaking configuration or tool changes. While below 1.0, document breaking changes prominently in the changelog. MCP initialization reads its package version rather than a hardcoded string.

```sh
npm run version:set -- 0.2.0
```

This updates both package versions and existing npm lockfile root versions. It does not install, commit, tag, push or publish. Move the relevant Unreleased entries into a dated release section in CHANGELOG.md, run the checks in CONTRIBUTING.md, review the diff, and create a focused commit. Then tag that commit `v0.2.0` and push the tag when ready. Use GitHub Releases for release notes; use separate `recordings-…` releases for large media.

GitHub Pages remains the static site deployment. MCP runs on the developer's machine, not on Pages. The CI workflow verifies the source and export; it does not automatically publish recordings or claim a real Orca test was executed.
