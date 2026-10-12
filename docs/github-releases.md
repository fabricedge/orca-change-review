# GitHub Releases media

The public repository is intended to be named `orca-change-review`. Site code, change records and a small JSON manifest are committed to Git. Videos and screenshots are uploaded as release assets, outside Git history.

## Create the repository and publish recordings

Install GitHub CLI and sign in with `gh auth login`. Configure your Git name/email if necessary. Run from the installed site folder:

```sh
bash scripts/publish-github.sh
```

By default this creates `YOUR_ACCOUNT/orca-change-review` as a public repository, commits and pushes the site, creates a uniquely dated release, uploads the three complete Orca recordings and screenshots, and commits `media/releases.json` containing their download URLs. It refuses to overwrite an existing release or push to an unrelated origin. Review recordings before running: published assets are public.

To specify the repository, tag and recording directory:

```sh
bash scripts/publish-github.sh YOUR_ACCOUNT/orca-change-review recordings-2026-10-11 /path/to/orca/artifacts/tab-copy-prs/images/videos
```

Requires Bash (Linux/macOS, or Git Bash on Windows), Node 24, Git, GitHub CLI and network access. The source must contain `capture.json` with `kind: orca-app` and all three nonempty WebM recordings. Run the Orca recorder first if any are missing. Nothing is published until local assets pass validation. The default source assumes the Orca repository is next to the site; pass the third argument if it is elsewhere.

When the release manifest exists, the site reads it instead of locally imported media, and the automatic importer skips local imports. `npm run dev` or a rebuilt deployment uses the external video URLs. No token is sent to the browser. The release repository must be public. The video player uses standard cross-origin video loading without credentialed fetches, and retains a download link if playback fails.

Create a new tag for subsequent recordings; old releases remain intact. Commit the updated manifest to deploy the new URLs. To return to local media, remove `media/releases.json` and run `npm run import:orca`.

This publishes the repository and media. Publishing the Vue site on GitHub Pages still requires static export and its deployment workflow; creating a Release alone does not deploy a website.

## Documentation

- [GitHub CLI release creation](https://cli.github.com/manual/gh_release_create)
- [GitHub release assets](https://docs.github.com/en/rest/releases/assets)

Remote upload and browser playback must be verified after publishing. This environment could not connect to the GitHub API; no repository or release was created here.
