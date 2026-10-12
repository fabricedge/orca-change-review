# After-change evidence automation

Use Orca Review Changes after a feature, fix, refactor, or investigation. Select a relevant existing E2E spec and describe the behavior you want to demonstrate. A recording complements code review; it does not replace it. Do not invent a passing outcome for code that has no suitable test.

## From your MCP client

Save this optional instruction in your project's agent configuration:

> After an Orca code change, identify the relevant existing Electron E2E test and explain what it proves. Use record_orca_test with checkOnly first. When recording is requested, run that test, poll get_recording, inspect the report and video, and save_review with the actual PR, commit or issue references. Record failures and limitations honestly. Do not publish, commit or push unless requested. For changes with no relevant rendered behavior, save text evidence of the checks actually run instead of fabricating a video.

The MCP uses `ORCA_REVIEW_TARGET` to select the execution checkout. For folder workspaces or SSH, configure the paths on the execution host; do not assume the viewing device owns the process.

## From a terminal or task runner

Install MCP dependencies first. Set `ORCA_REVIEW_TARGET` in your shell or task configuration to the absolute Orca checkout path. Then:

```sh
npm --prefix mcp run after-change -- --test tests/e2e/your-feature.spec.ts
npm --prefix mcp run after-change -- --test tests/e2e/your-feature.spec.ts --record
npm --prefix mcp run after-change -- --test tests/e2e/your-feature.spec.ts --record --review review.json
```

The first command validates only. Replace the example test path with an existing spec; it is not a bundled example test. On Linux without a graphical session, run the recording command through `xvfb-run -a`. The runner calls the same MCP tools through the SDK's in-memory transport, so it avoids a separate stdio process while preserving tool validation. It prints the recording ID, report, outcome and video paths; failed or incomplete recordings return a nonzero exit status.

`review.json` contains a `save_review` payload: `review` plus `expectedUpdatedAt` when updating an existing record. Use the schema and examples in [mcp.md](mcp.md). The runner attaches the new recording ID itself. It saves completed failed tests as failed evidence too. No publication, commits or uploads happen. Local video paths remain local until you review and publish the files.

## Optional hooks and CI

Prefer an explicit IDE task, package script or agent instruction. Electron builds and recordings are too expensive for a default pre-commit hook. To opt into a post-feature task, invoke the command above after your normal checks. Run one relevant spec per invocation; do not launch overlapping recordings against the same checkout.

For CI, use an isolated runner with Orca's dependencies and display requirements. Save `recordings/` as a CI artifact even when the command fails. Keep publication separate from test execution. This repository's CI checks the site and MCP; it does not pretend to record a real Orca app without a configured checkout.

Before public release, inspect video contents and text, publish the selected media, update actual source links, rebuild Pages and perform the normal PR review. This automation has unit and SDK handler coverage; validate an actual recording on your development host before relying on it for your workflow.
