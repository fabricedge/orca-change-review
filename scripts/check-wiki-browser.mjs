import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve, join } from "node:path";
import { mkdir } from "node:fs/promises";
import { revisions } from "../lib/revisions.mjs";
const args = process.argv.slice(2);
const option = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const url = option("--url", "http://127.0.0.1:3100/");
const target = new URL(url);
if (!["http:", "https:"].includes(target.protocol))
  throw new Error("Use an HTTP or HTTPS site URL.");
const source = resolve(process.env.ORCA_SOURCE || "../orca");
const { chromium } = createRequire(join(source, "package.json"))("playwright");
const output = resolve(option("--output", "artifacts/wiki-qa"));
await mkdir(output, { recursive: true });
process.env.ORCA_BACKGROUND_LAUNCH = "1";
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, width, height] of [
    ["mobile", 375, 812],
    ["tablet", 820, 1180],
    ["desktop", 1440, 1000],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const path = (route) =>
      new URL(route.replace(/^\//, ""), url.endsWith("/") ? url : `${url}/`)
        .href;
    for (const route of [
      "en/overview/",
      "en/changes/servico-linux/",
      "en/tab-copy/",
    ]) {
      await page.goto(path(route), { waitUntil: "domcontentloaded" });
      await page.locator("h1").waitFor();
      await page.waitForFunction(
        () =>
          document.querySelector("#app")?.hasAttribute("data-v-app") ||
          document.querySelector(".wiki-topbar"),
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${name}: horizontal overflow on ${route}`,
      );
      await page.screenshot({
        path: join(output, `${name}-${route.split("/")[1]}.png`),
        fullPage: true,
      });
    }
    await page.goto(path("en/changes/"));
    await page.locator("#catalog-search").fill("b4799ad");
    await page.waitForFunction(
      () => document.querySelectorAll(".record-list>li").length === 1,
    );
    await page.locator("#catalog-search").fill("no-such-record");
    await page.locator(".empty-state").waitFor();
    if (width < 1024) {
      await page
        .getByRole("button", { name: "Open navigation", exact: true })
        .click();
      await page.locator("dialog[open]").waitFor();
      await page
        .locator("dialog")
        .getByRole("link", { name: "Sources", exact: true })
        .click();
      await page.waitForURL("**/en/sources/");
      assert.equal(
        await page.locator("dialog").evaluate((dialog) => dialog.open),
        false,
      );
    }
    for (const record of revisions) {
      await page.goto(path(`revisoes/${record.slug}/`));
      await page
        .getByRole("heading", { level: 1, name: record.title, exact: true })
        .waitFor();
      if (record.pullRequest)
        assert.ok(
          await page.locator(`a[href="${record.pullRequest}"]`).count(),
        );
    }
    assert.deepEqual(errors, [], `${name}: JavaScript errors`);
    await page.close();
  }
  console.log(
    `Desktop, tablet and mobile browser checks passed. Screenshots: ${output}`,
  );
} finally {
  await browser.close();
}
