<script setup>
import {
  articlePath,
  formatDate,
  recordDate,
} from "../../lib/wiki-records.mjs";
import { useWiki } from "../composables/use-wiki.js";
defineProps({ records: { type: Array, required: true } });
const { locale, t } = useWiki();
</script>
<template>
  <ol class="record-list">
    <li v-for="record in records" :key="record.slug">
      <div class="record-heading">
        <router-link :to="articlePath(record.slug, locale)">{{
          record.title
        }}</router-link
        ><span class="record-kind">{{ record.kind }}</span>
      </div>
      <p>{{ record.summary }}</p>
      <div class="record-meta">
        <a v-if="record.pullRequest" :href="record.pullRequest" target="_blank" rel="noopener noreferrer">PR #{{ record.pullRequest.split("/").filter(Boolean).at(-1) }}</a><span>{{ record.repository || t.local }}</span
        ><time v-if="recordDate(record)" :datetime="recordDate(record)"
          >{{ t.updated }} {{ formatDate(recordDate(record), locale) }}</time
        >
      </div>
    </li>
  </ol>
</template>
