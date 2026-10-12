<script setup>
import { computed } from "vue";
import { formatDate } from "../../lib/wiki-records.mjs";
import { useWiki } from "../composables/use-wiki.js";
const props = defineProps({ record: { type: Object, required: true } });
const { locale, t } = useWiki();
const entries = computed(() =>
  [
    { date: props.record.createdAt, label: t.value.creation },
    ...(props.record.updatedAt &&
    props.record.updatedAt !== props.record.createdAt
      ? [{ date: props.record.updatedAt, label: t.value.update }]
      : []),
  ].filter((entry) => entry.date),
);
</script>
<template>
  <section v-if="entries.length" id="revision-history" class="article-section">
    <h2>{{ t.history }}</h2>
    <p class="muted">{{ t.historyNote }}</p>
    <ol class="revision-history">
      <li v-for="(entry, index) in entries" :key="entry.date">
        <time :datetime="entry.date" :title="entry.date">{{
          formatDate(entry.date, locale)
        }}</time
        ><span>{{ entry.label }}</span
        ><strong v-if="index === entries.length - 1">{{ t.current }}</strong>
      </li>
    </ol>
  </section>
</template>
