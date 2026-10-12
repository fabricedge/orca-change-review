import { createSSRApp, createApp as createClientApp } from "vue";
import App from "./App.vue";
import { makeRouter } from "./router.js";
export function createApp(ssr = false) {
  const hydrate =
    ssr ||
    (typeof document !== "undefined" &&
      document.getElementById("app")?.hasChildNodes());
  const app = hydrate ? createSSRApp(App) : createClientApp(App);
  const router = makeRouter(ssr);
  app.use(router);
  app.config.globalProperties.$base = import.meta.env.BASE_URL;
  return { app, router };
}
