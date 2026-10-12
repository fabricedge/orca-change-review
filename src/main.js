import { createApp } from "./create-app.js";
import "./wiki.css";
const { app, router } = createApp();
router.isReady().then(() => app.mount("#app"));
