<script setup>
import { pullRequestRecords } from "../../lib/wiki-records.mjs";
import { revisions as allRecords } from "../../lib/revisions.mjs";
import { recordSources } from "../../lib/wiki-records.mjs";
import { useWiki } from "../composables/use-wiki.js";
import RecordList from "../components/RecordList.vue";
const revisions = pullRequestRecords(allRecords);
const { t } = useWiki();
const sources = recordSources(revisions);
</script>
<template>
  <article class="index-article">
    <div class="breadcrumbs">{{ t.product }} / {{ t.sources }}</div>
    <h1>{{ t.sources }}</h1>
    <p class="page-intro">{{ t.sourceBody }}</p>
    <section
      v-for="(source, index) in sources"
      :id="`source-${index}`"
      :key="source.id"
      class="article-section"
    >
      <h2>
        <a
          v-if="source.url"
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          >{{ source.name }} ↗</a
        ><template v-else>{{ t.local }}</template>
      </h2>
      <p v-if="!source.url" class="muted">{{ t.localNote }}</p>
      <RecordList :records="source.records" />
    </section>
  </article>
</template>
