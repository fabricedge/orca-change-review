import { build } from "vite";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { staticRoutes } from "../lib/wiki-records.mjs";
import { revisions, findRevision } from "../lib/revisions.mjs";
import { asttspGroups, asttspText } from "../lib/asttsp.mjs";
await build();
const serverDir = resolve(".ssr-build");
try {
  await build({
    build: {
      ssr: "src/entry-server.js",
      outDir: serverDir,
      rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
    },
  });
  const { render } = await import(
    pathToFileURL(join(serverDir, "entry-server.mjs"))
  );
  const template = await readFile("out/index.html", "utf8");
  for (const url of staticRoutes(revisions)) {
    const html = await render(url);
    const slug = url.split("/").filter(Boolean).at(-1);
    const record = findRevision(slug);
    const group = url.includes("/asttsp/") ? asttspGroups.find((entry) => entry.id === slug) : null;
    const locale = url.startsWith("/pt-BR") ? "pt-BR" : "en";
    const title = record
      ? `${record.title} — Orca Change Review`
      : group
        ? `ASTTSP: ${asttspText(group.title, locale)} | Orca Change Review`
        : url.includes("/asttsp/") ? "ASTTSP | Orca Change Review" : "Orca Change Review";
    const escape = (value) =>
      value.replace(
        /[&<>"']/g,
        (char) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[char],
      );
    const page = template
      .replace("<!--app-html-->", html)
      .replace(
        "<title>Orca Change Review</title>",
        `<title>${escape(title)}</title>`,
      )
      .replace(
        '<html lang="en">',
        `<html lang="${url.startsWith("/pt-BR") || url.startsWith("/revisoes") ? "pt-BR" : "en"}">`,
      );
    const directory = join("out", url);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, "index.html"), page);
    if (url === "/404/") await writeFile("out/404.html", page);
  }
} finally {
  await rm(serverDir, { recursive: true, force: true });
}
