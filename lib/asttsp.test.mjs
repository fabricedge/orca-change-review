import test from "node:test";
import assert from "node:assert/strict";
import { asttspGroups, asttspMembers, groupsForRecord, asttspPath } from "./asttsp.mjs";
import { revisions } from "./revisions.mjs";
import { filterRecords, staticRoutes } from "./wiki-records.mjs";
import { validateRevisions } from "./validate-revisions.mjs";

test("ASTTSP membership groups only the three alternative PRs", () => {
  const group = asttspGroups.find((entry) => entry.id === "tab-context");
  assert.deepEqual(asttspMembers(group, revisions).map((record) => record.pullRequest.split("/").at(-1)), ["5", "6", "7"]);
  assert.deepEqual(groupsForRecord(revisions.find((record) => record.slug === "servico-linux")), []);
  assert.equal(groupsForRecord(revisions.find((record) => record.slug === "cli-only"))[0].id, group.id);
});

test("ASTTSP filters compose with search and ordinary topics", () => {
  assert.equal(filterRecords(revisions, { asttsp: "*" }).length, 3);
  assert.equal(filterRecords(revisions, { query: "ASTTSP" }).length, 3);
  assert.equal(filterRecords(revisions, { asttsp: "tab-context", query: "2391609" }).length, 1);
  assert.equal(filterRecords(revisions, { asttsp: "tab-context", topic: "remote-services" }).length, 0);
  assert.equal(filterRecords(revisions, { asttsp: "missing" }).length, 0);
});

test("every registered group has localized static pages and problem descriptions", () => {
  const routes = staticRoutes(revisions);
  for (const locale of ["en", "pt-BR"]) {
    assert.ok(routes.includes(`/${locale}/asttsp/`));
    for (const group of asttspGroups) {
      assert.ok(routes.includes(asttspPath(group.id, locale)));
      assert.ok(group.title[locale] && group.problem[locale] && group.shared[locale]);
    }
  }
});

test("unknown, duplicate and non-PR tags are rejected before publication", () => {
  const record = revisions.find((entry) => entry.slug === "cli-only");
  for (const asttsp of [["missing"], ["tab-context", "tab-context"], "tab-context", [null]]) {
    assert.throws(() => validateRevisions([{ ...record, asttsp }]), /asttsp/);
  }
  assert.throws(() => validateRevisions([{ ...record, pullRequest: undefined }]), /requires a pull request/);
  assert.doesNotThrow(() => validateRevisions([{ ...record, asttsp: [] }]));
});
