<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { revisions } from "../../lib/revisions.mjs";
import { topicLabel, articlePath } from "../../lib/wiki-records.mjs";
import {
  siteOwner,
  siteVersion,
  siteRepositoryUrl,
} from "../../lib/review-site.mjs";
import { useWiki } from "../composables/use-wiki.js";
const { locale, t, route } = useWiki();
const router = useRouter();
const drawer = ref(null);
const query = ref("");
const mobile = ref(false);
let mediaQuery;
function placeNavigation() {
  mobile.value = mediaQuery.matches;
  if (!mobile.value) drawer.value?.close();
}
onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 1023px)");
  placeNavigation();
  mediaQuery.addEventListener("change", placeNavigation);
});
onUnmounted(() => mediaQuery?.removeEventListener("change", placeNavigation));
const topics = [
  ...new Set(revisions.map((record) => record.topic || "general")),
];
const links = computed(() => [
  ["overview", t.value.overview],
  ["news", t.value.recent],
  ["changes", t.value.all],
  ["sources", t.value.sources],
  ["tab-copy", t.value.compare],
  ["workflow", t.value.plan],
]);
function search() {
  router.push({
    path: `/${locale.value}/changes/`,
    query: query.value ? { q: query.value } : {},
  });
  drawer.value?.close();
}
function closeLinks(event) {
  if (event.target.closest("a")) drawer.value?.close();
}
</script>
<template>
  <button
    class="wiki-menu-button"
    type="button"
    :aria-label="t.menu"
    @click="drawer.showModal()"
  >
    ☰
  </button>
  <dialog ref="drawer" class="wiki-nav-dialog" :aria-label="t.navigation">
    <button class="drawer-close" @click="drawer.close()">{{ t.close }}</button>
    <div id="mobile-navigation"></div>
  </dialog>
  <Teleport to="#mobile-navigation" :disabled="!mobile"
    ><aside class="wiki-sidebar">
      <router-link :to="`/${locale}/overview/`" class="wiki-brand"
        ><span class="wiki-logo"
          ><img
            :src="`${$base}orca-logo.svg`"
            alt=""
            width="28"
            height="20" /></span
        ><span
          >{{ t.product }}<small>{{ t.knowledge }}</small></span
        ></router-link
      >
      <form class="sidebar-search" role="search" @submit.prevent="search">
        <label for="wiki-search">{{ t.search }}</label>
        <div>
          <input
            id="wiki-search"
            v-model="query"
            type="search"
            :placeholder="t.searchHint"
          /><button :aria-label="t.go" type="submit">↵</button>
        </div>
      </form>
      <nav :aria-label="t.navigation" @click="closeLinks">
        <router-link
          v-for="[id, label] in links"
          :key="id"
          :to="`/${locale}/${id}/`"
          :aria-current="
            route.path.replace(/\/$/, '') === `/${locale}/${id}`
              ? 'page'
              : undefined
          "
          >{{ label }}</router-link
        >
        <h2>{{ t.topics }}</h2>
        <router-link
          v-for="topic in topics"
          :key="topic"
          :to="{ path: `/${locale}/changes/`, query: { topic } }"
          :aria-current="route.query.topic === topic ? 'page' : undefined"
          >{{ topicLabel(topic, locale) }}</router-link
        >
        <details class="sidebar-records">
          <summary>{{ t.records }}</summary>
          <router-link
            v-for="record in revisions"
            :key="record.slug"
            :to="articlePath(record.slug, locale)"
            :aria-current="
              route.params.slug === record.slug ? 'page' : undefined
            "
            >{{ record.title }}</router-link
          >
        </details>
      </nav>
      <div class="sidebar-footer">
        <span
          >{{ t.subtitle }}
          <a
            :href="`https://github.com/${siteOwner}`"
            target="_blank"
            rel="noopener noreferrer"
            >@{{ siteOwner }}</a
          ></span
        ><a
          :href="`${siteRepositoryUrl}/blob/HEAD/CHANGELOG.md`"
          target="_blank"
          rel="noopener noreferrer"
          >v{{ siteVersion }} · {{ t.version }} ↗</a
        >
      </div>
    </aside></Teleport
  >
</template>
