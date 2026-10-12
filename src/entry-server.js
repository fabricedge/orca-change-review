import { renderToString } from "@vue/server-renderer";
import { createApp } from "./create-app.js";
export async function render(url) {
  const { app, router } = createApp(true);
  await router.push(url);
  await router.isReady();
  return renderToString(app);
}
