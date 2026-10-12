import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { readImportedMedia } from "./lib/read-imported-media.mjs";
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, import.meta.dirname, ""), ...process.env };
  const base = `${(env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "")}/`;
  return {
    base,
    plugins: [
      vue(),
      {
        name: "orca-evidence",
        resolveId(id) {
          if (id === "virtual:orca-media") return "\0orca-media";
        },
        async load(id) {
          if (id === "\0orca-media")
            return `export default ${JSON.stringify(await readImportedMedia(import.meta.dirname))}`;
        },
      },
    ],
    define: {
      "process.env.NEXT_PUBLIC_SITE_REPOSITORY": JSON.stringify(env.NEXT_PUBLIC_SITE_REPOSITORY || ""),
      "process.env.NEXT_PUBLIC_SITE_COMMIT": JSON.stringify(env.NEXT_PUBLIC_SITE_COMMIT || ""),
      "env.NEXT_PUBLIC_SITE_REPOSITORY": JSON.stringify(
        env.NEXT_PUBLIC_SITE_REPOSITORY || "",
      ),
      "env.NEXT_PUBLIC_SITE_COMMIT": JSON.stringify(
        env.NEXT_PUBLIC_SITE_COMMIT || "",
      ),
      "env.NEXT_PUBLIC_BASE_PATH": JSON.stringify(
        env.NEXT_PUBLIC_BASE_PATH || "",
      ),
    },
    server: { host: "0.0.0.0", port: 3100, strictPort: true },
    preview: { host: "0.0.0.0", port: 3100, strictPort: true },
    build: { outDir: "out" },
  };
});
