import test from "node:test";
import assert from "node:assert/strict";
import {
  pullRequestRecords,
  filterRecords,
  relatedRecords,
  staticRoutes,
  recordSources,
} from "./wiki-records.mjs";
import { repositoryHref, commitHref } from "./review-references.mjs";
import { revisions } from "./revisions.mjs";
test("search finds commit identifiers and technical article content", () => {
  assert.equal(
    filterRecords(revisions, { query: "b4799ad" })[0].slug,
    "servico-linux",
  );
  assert.ok(
    filterRecords(revisions, { query: "systemd" }).some(
      (r) => r.slug === "servico-linux",
    ),
  );
  assert.equal(
    filterRecords(revisions, { query: "nonexistent-string" }).length,
    0,
  );
});
test("filters use real topics and kinds", () => {
  assert.deepEqual(
    filterRecords(revisions, { kind: "PR", topic: "remote-services" }).map(
      (r) => r.slug,
    ),
    ["servico-linux"],
  );
});
test("related records require an actual branch or commit relationship", () => {
  assert.equal(relatedRecords(revisions[0], revisions).length, 0);
  const combined = revisions.find((r) => r.slug === "copia-de-abas");
  assert.equal(relatedRecords(combined, revisions).length, 3);
});
test("all legacy and localized articles have static routes", () => {
  const routes = staticRoutes(revisions);
  assert.equal(new Set(routes).size, routes.length);
  for (const record of revisions)
    for (const prefix of ["/revisoes", "/en/changes", "/pt-BR/changes"])
      assert.ok(routes.includes(`${prefix}/${record.slug}/`));
});
test("unpublished commits stay unlinked and GitLab sources retain their provider", () => {
  const local = { commits: [{ id: "abcdef0" }] };
  assert.equal(repositoryHref(local), null);
  assert.equal(commitHref(local, local.commits[0]), null);
  const gitlab = {
    repository: "team/project",
    pullRequest: "https://gitlab.com/team/project/-/merge_requests/9",
  };
  assert.equal(repositoryHref(gitlab), "https://gitlab.com/team/project");
  assert.equal(
    commitHref(gitlab, { id: "abcdef0" }),
    "https://gitlab.com/team/project/-/commit/abcdef0",
  );
  assert.ok(recordSources([local]).some((source) => !source.url));
});

test("PR compendium includes published alternatives and excludes aggregate comparisons", () => {
  const records = pullRequestRecords(revisions);
  assert.deepEqual(records.map(record => record.slug), ["servico-linux", "cli-only", "split-control", "two-columns"]);
  assert.ok(records.every(record => record.pullRequest && !record.comparison));
});

test("each published tab alternative links to its own PR and public commits", () => {
  for (const [slug, number] of [["cli-only", 5], ["split-control", 6], ["two-columns", 7]]) {
    const record = revisions.find((entry) => entry.slug === slug);
    assert.equal(record.pullRequest, `https://github.com/fabricedge/orca/pull/${number}`);
    assert.equal(repositoryHref(record), "https://github.com/fabricedge/orca");
    assert.equal(commitHref(record, record.commits[0]), `https://github.com/fabricedge/orca/commit/${record.commits[0].id}`);
    assert.equal(record.kind, "PR");
    assert.equal(record.base, "feat/agent-tab-layout");
    assert.ok(!record.implementation.includes("não há link público"));
  }
});
