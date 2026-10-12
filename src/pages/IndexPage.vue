<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { revisions } from "../../lib/revisions.mjs";
import { filterRecords, topicLabel } from "../../lib/wiki-records.mjs";
import { useWiki } from "../composables/use-wiki.js";
import RecordList from "../components/RecordList.vue";
const { locale, t, route } = useWiki();
const router = useRouter();
const hydrated = ref(false);
onMounted(() => {
  hydrated.value = true;
});
const view = computed(() => route.meta.view || "overview");
const title = computed(() =>
  view.value === "overview"
    ? t.value.overviewTitle
    : view.value === "news"
      ? t.value.recent
      : t.value.all,
);
const description = computed(() =>
  view.value === "overview"
    ? t.value.overviewBody
    : view.value === "news"
      ? t.value.recentBody
      : t.value.allBody,
);
const filters = computed(() =>
  !hydrated.value
    ? {}
    : {
        query: String(route.query.q || ""),
        kind: String(route.query.kind || ""),
        topic: String(route.query.topic || ""),
        outcome: String(route.query.outcome || ""),
        sort: String(route.query.sort || "recent"),
      },
);
const records = computed(() => filterRecords(revisions, filters.value));
const kinds = [...new Set(revisions.map((r) => r.kind))];
const topics = [...new Set(revisions.map((r) => r.topic || "general"))];
const outcomes = [
  ...new Set(revisions.map((r) => r.testEvidence?.outcome).filter(Boolean)),
];
function filter(key, event) {
  const query = { ...route.query, [key]: event.target.value };
  if (!query[key]) delete query[key];
  router.replace({ path: route.path, query });
}
</script>
<template>
  <article class="index-article">
    <div class="breadcrumbs">
      {{ t.product }} / {{ view === "overview" ? t.overview : title }}
    </div>
    <h1>{{ title }}</h1>
    <p class="page-intro">{{ description }}</p>
    <form class="catalog-search" role="search" @submit.prevent>
      <label for="catalog-search">{{ t.search }}</label
      ><input
        id="catalog-search"
        :value="filters.query"
        type="search"
        :placeholder="t.searchHint"
        @input="filter('q', $event)"
      />
    </form>
    <div class="catalog-filters">
      <label
        >{{ t.type
        }}<select :value="filters.kind" @change="filter('kind', $event)">
          <option value="">{{ t.allTypes }}</option>
          <option v-for="kind in kinds" :key="kind">{{ kind }}</option>
        </select></label
      ><label
        >{{ t.topics
        }}<select :value="filters.topic" @change="filter('topic', $event)">
          <option value="">{{ t.allTopics }}</option>
          <option v-for="topic in topics" :key="topic" :value="topic">
            {{ topicLabel(topic, locale) }}
          </option>
        </select></label
      ><label v-if="outcomes.length"
        >{{ t.result
        }}<select :value="filters.outcome" @change="filter('outcome', $event)">
          <option value="">{{ t.allResults }}</option>
          <option v-for="outcome in outcomes" :key="outcome">
            {{ outcome }}
          </option>
        </select></label
      ><label
        >{{ t.sort
        }}<select :value="filters.sort" @change="filter('sort', $event)">
          <option value="recent">{{ t.newest }}</option>
          <option value="oldest">{{ t.oldest }}</option>
          <option value="title">{{ t.title }}</option>
        </select></label
      >
    </div>
    <nav v-if="view === 'overview'" class="index-navigation">
      <router-link :to="`/${locale}/sources/`">{{ t.sources }}</router-link
      ><router-link :to="`/${locale}/tab-copy/`">{{ t.compare }}</router-link
      ><router-link :to="`/${locale}/workflow/`">{{ t.plan }}</router-link>
    </nav>
    <section>
      <div class="list-label">
        <h2>{{ view === "changes" ? t.all : t.recent }}</h2>
        <span role="status">{{ records.length }} {{ t.results }}</span>
      </div>
      <RecordList v-if="records.length" :records="records" />
      <div v-else class="empty-state">
        <h2>{{ t.empty }}</h2>
        <p>{{ t.emptyBody }}</p>
        <router-link :to="route.path">{{ t.clear }}</router-link>
      </div>
    </section>
  </article>
</template>
