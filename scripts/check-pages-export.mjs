import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { revisions } from "../lib/revisions.mjs";
import { staticRoutes } from "../lib/wiki-records.mjs";
import { readImportedMedia } from "../lib/read-imported-media.mjs";
const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
for (const route of staticRoutes(revisions)) {
  const html = await readFile(join("out", route, "index.html"), "utf8");
  assert.ok(html.includes("<h1"), `Missing rendered article: ${route}`);
  assert.ok(
    html.includes(`${base}/assets/`),
    `Incorrect asset prefix: ${route}`,
  );
  assert.ok(
    !html.includes('href="/revisoes'),
    `Unprefixed legacy link: ${route}`,
  );
  if (base)
    assert.ok(
      !/href="\/(?:en|pt-BR)\//.test(html),
      `Unprefixed article link: ${route}`,
    );
  assert.ok(!html.includes("<!--app-html-->"), `Unrendered route: ${route}`);
}
for (const record of revisions) {
  const html = await readFile(
    join("out", "en/changes", record.slug, "index.html"),
    "utf8",
  );
  assert.ok(html.includes(record.title), `Missing real title: ${record.slug}`);
  if (record.pullRequest)
    assert.ok(
      html.includes(record.pullRequest),
      `Missing source: ${record.slug}`,
    );
  for (const commit of record.commits)
    assert.ok(html.includes(commit.id), `Missing commit: ${record.slug}`);
}
const manifest = await readImportedMedia();
for (const variant of Object.values(manifest.variants || {})) {
  if (variant.video && manifest.repository)
    assert.ok(
      variant.video.startsWith("https://github.com/"),
      "Release URL required",
    );
}
await stat("out/404.html");
console.log(
  `${staticRoutes(revisions).length} rendered routes, real records, source links and asset paths verified.`,
);
