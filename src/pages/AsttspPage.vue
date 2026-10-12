<script setup>
import { computed } from "vue";
import { revisions } from "../../lib/revisions.mjs";
import { asttspGroups, asttspMembers, asttspPath, asttspText } from "../../lib/asttsp.mjs";
import { articlePath } from "../../lib/wiki-records.mjs";
import { useWiki } from "../composables/use-wiki.js";
import TabComparison from "../components/TabComparison.vue";
import NotFoundPage from "./NotFoundPage.vue";
const { locale, t, route } = useWiki();
const group = computed(() => asttspGroups.find((entry) => entry.id === route.params.group));
const members = computed(() => group.value ? asttspMembers(group.value, revisions) : []);
</script>
<template>
  <NotFoundPage v-if="route.params.group && !group" />
  <article v-else class="index-article asttsp-page">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <router-link :to="`/${locale}/overview/`">{{ t.overview }}</router-link>
      <span>/</span><router-link v-if="group" :to="`/${locale}/asttsp/`">ASTTSP</router-link>
      <span v-else>ASTTSP</span>
    </nav>
    <router-link v-if="group" :to="`/${locale}/asttsp/`" class="asttsp-tag"><strong>ASTTSP</strong><span>{{ members.length }} {{ t.asttspAlternatives }}</span></router-link>
    <h1>{{ group ? asttspText(group.title, locale) : t.asttspTitle }}</h1>
    <p class="page-intro">{{ t.asttspDescription }}</p>
    <template v-if="group">
      <section class="article-summary">
        <h2>{{ t.asttspProblem }}</h2>
        <p>{{ asttspText(group.problem, locale) }}</p>
      </section>
      <section class="article-section">
        <h2>{{ t.asttspShared }}</h2>
        <p>{{ asttspText(group.shared, locale) }}</p>
      </section>
      <section class="article-section">
        <h2>{{ t.compare }}</h2>
        <ol v-if="members.length" class="record-list">
          <li v-for="record in members" :key="record.slug">
            <div class="record-heading">
              <router-link :to="articlePath(record.slug, locale)">{{ asttspText(group.approachTitles?.[record.slug], locale) || record.title }}</router-link>
              <a :href="record.pullRequest" target="_blank" rel="noopener noreferrer">PR #{{ record.pullRequest.split('/').at(-1) }}</a>
            </div>
            <p>{{ asttspText(group.approaches?.[record.slug], locale) || record.summary }}</p>
            <router-link :to="articlePath(record.slug, locale)">{{ t.asttspReview }}</router-link>
          </li>
        </ol>
        <p v-else class="empty-state">{{ t.asttspEmpty }}</p>
      </section>
      <template v-if="group.variantIds?.length">
        <p class="article-section muted">{{ t.asttspVideoScope }}</p>
        <TabComparison :ids="group.variantIds" :heading="t.asttspRecordings" />
      </template>
      <router-link class="asttsp-catalog-link" :to="{path: `/${locale}/changes/`, query: {asttsp: group.id}}">{{ t.asttspFilter }}</router-link>
    </template>
    <template v-else>
      <ol v-if="asttspGroups.length" class="record-list">
        <li v-for="entry in asttspGroups" :key="entry.id">
          <router-link :to="asttspPath(entry.id, locale)" class="asttsp-tag"><strong>ASTTSP</strong><span>{{ asttspText(entry.title, locale) }}</span></router-link>
          <p>{{ asttspText(entry.problem, locale) }}</p>
          <p>{{ asttspMembers(entry, revisions).length }} {{ t.asttspAlternatives }}</p>
        </li>
      </ol>
      <p v-else class="empty-state">{{ t.asttspEmpty }}</p>
    </template>
  </article>
</template>
