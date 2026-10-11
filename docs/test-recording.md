# Record Orca test evidence

Orca Review Changes creates evidence pages with automated recordings of the real app, test results and explanatory text attached to a PR, commit or issue. Every page states that these artifacts do not replace proper review of the GitHub PR, its code, tests and CI results. A video alone is not proof that a test passed.

## Record and create a page

1. [Configure the MCP server](mcp.md), setting `ORCA_REVIEW_TARGET` to the Orca checkout containing the feature and its E2E spec. Install that checkout's dependencies normally. The spec must use Orca's recording-capable Electron fixture (`tests/e2e/helpers/orca-app.ts`). A recording of an isolated menu or an unrelated browser page does not demonstrate the actual app.
2. Call `record_orca_test` with `testFile: "tests/e2e/your-feature.spec.ts"` and `checkOnly: true`. Confirm the intended checkout and test.
3. Call it again without `checkOnly`. The tool returns a recording ID immediately. It invokes Orca's existing Playwright configuration and global setup, rebuilding the app, selecting `electron-headless`, using one worker and no retries, and setting `ORCA_E2E_RECORD_VIDEO=1`, `ORCA_E2E_HEADLESS=1` and `ORCA_BACKGROUND_LAUNCH=1`. Inherited headful and skip-build overrides are removed. This executes repository test code; use a checkout and test you trust.
4. Poll `get_recording` with the ID while it runs. Keep the MCP process alive. Artifacts live in the review clone's ignored `recordings/ID/` directory: videos, `report.json`, `capture.json` and `run.log`.
5. Watch the video and inspect the report. A successful process needs a nonempty passing report, no unexpected/flaky/skipped tests and a video to earn `passed`; other runs are failed or incomplete. After a server restart, an unfinished run is `unverifiable`, never assumed dead.
6. Upload reviewed WebM files to GitHub Releases. For generic test recordings, create a release with `gh release create TAG --repo OWNER/REPO --title "Test evidence" --notes "Selected Orca test recording"`, then upload each exact path using `gh release upload TAG "PATH_TO_VIDEO.webm" --repo OWNER/REPO`. Copy the HTTPS download links from the release. The existing `publish:github` script remains specialized for the three tab-copy variants. Do not publish raw logs automatically; inspect videos for private data.
7. Call `save_review` with the normal review payload plus `recordingId` and optional `videoUrls`. The server attaches the completed capture's outcome, spec, timestamp, commit, tracked-change flag and report counts. It does not infer success from your description. Existing records require their last `updatedAt` as `expectedUpdatedAt`; text-only edits preserve existing evidence.
8. Review locally, commit `data/reviews.json` and deploy Pages. Remote Release URLs supply the videos; local artifacts remain outside Git. Link the evidence page from the PR while keeping the PR's own explanation and proper review.

Suggested agent request:

> Record this feature's E2E spec in the real Orca app. Show the test report and video, describe what the assertions prove and what remains untested, then save an evidence page linked to this PR or commit. Do not call a video proof of success unless the report supports it. Do not publish without my instruction.

## Scope and execution host

If Linux has no display, run the MCP server under an isolated Xvfb display: configure the client to launch `xvfb-run` with arguments `-a`, `node` and the absolute server path. Native-focus and visible-window tests remain excluded. The server captures hidden renderers through the existing Orca fixture, not the user's desktop.

The runner executes one existing spec from the selected checkout. It does not automatically test every platform, native focus, or a remote Orca runtime. On SSH, run the MCP on the host containing the checkout and review data. Folder checkouts are supported; when Git metadata is unavailable, the source commit is unknown. The dirty flag checks tracked files only; untracked files are not attested.

Only one recording starts at a time per MCP process. Do not run separate recorders concurrently against the same build output. There is no automatic upload, commit or push. GitHub Pages hosts static evidence pages; the MCP runs on the developer's host.

The report is generated with [Playwright's JSON reporter](https://playwright.dev/docs/test-reporters#json-reporter). A successful report documents only what the selected assertions tested. Explain missing coverage and environmental limits in the page's text.
