<script setup>
import { ref, onErrorCaptured, watch } from "vue";
import WikiSidebar from "./components/WikiSidebar.vue";
import WikiTools from "./components/WikiTools.vue";
import { siteRepositoryUrl } from "../lib/review-site.mjs";
import { useWiki } from "./composables/use-wiki.js";
const { t, route, locale } = useWiki();
const error = ref(false);
const commit = process.env.NEXT_PUBLIC_SITE_COMMIT || "";
onErrorCaptured((problem) => {
  console.error(problem);
  error.value = true;
  return false;
});
watch(
  () => route.fullPath,
  () => {
    error.value = false;
    if (typeof document !== "undefined")
      document.documentElement.lang = locale.value;
  },
);
function reload() {
  window.location.reload();
}
</script>
<template>
  <a class="skip-link" href="#main-content">{{
    locale === "en" ? "Skip to content" : "Ir ao conteúdo"
  }}</a
  ><WikiSidebar />
  <div class="wiki-main">
    <WikiTools />
    <main id="main-content" tabindex="-1">
      <div v-if="error" role="alert">
        <h1>{{ t.error }}</h1>
        <p>{{ t.errorBody }}</p>
        <button @click="reload">{{ t.reload }}</button
        ><router-link :to="`/${locale}/changes/`">{{ t.all }}</router-link>
      </div>
      <router-view v-else v-slot="{ Component }"
        ><Suspense
          ><component :is="Component" :key="route.path" /><template #fallback
            ><p role="status">{{ t.loading }}</p></template
          ></Suspense
        ></router-view
      >
      <footer class="wiki-disclaimer">
        <strong>{{ t.noticeTitle }}</strong>
        <p>{{ t.notice }}</p>
        <a
          v-if="/^[a-f0-9]{7,40}$/.test(commit)"
          :href="`${siteRepositoryUrl}/commit/${commit}`"
          target="_blank"
          rel="noopener noreferrer"
          >{{ t.reference }}: <code>{{ commit.slice(0, 7) }}</code></a
        >
      </footer>
    </main>
  </div>
</template>
