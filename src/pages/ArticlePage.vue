<script setup>
import { computed, ref } from "vue";
import { findRevision, revisions } from "../../lib/revisions.mjs";
import {
  relatedRecords,
  formatDate,
  recordDate,
} from "../../lib/wiki-records.mjs";
import { useWiki } from "../composables/use-wiki.js";
import RecordSections from "../components/RecordSections.vue";
import ArticleToc from "../components/ArticleToc.vue";
import SourceReferences from "../components/SourceReferences.vue";
import RevisionHistory from "../components/RevisionHistory.vue";
import ReviewDecision from "../components/ReviewDecision.vue";
import RecordList from "../components/RecordList.vue";
import TabComparison from "../components/TabComparison.vue";
import VideoEvidence from "../components/VideoEvidence.vue";
import NotFoundPage from "./NotFoundPage.vue";
const { locale, t, route } = useWiki();
const record = computed(() =>
  findRevision(route.params.slug || "copia-de-abas"),
);
const related = computed(() =>
  record.value ? relatedRecords(record.value, revisions) : [],
);
const copied = ref("");
async function copy() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = t.value.copied;
  } catch {
    copied.value = t.value.copyError;
  }
}
</script>
<template>
  <div v-if="record" class="article-layout">
    <article id="change-article">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <router-link :to="`/${locale}/sources/`">{{ t.sources }}</router-link
        ><span>/</span><span>{{ record.repository || t.local }}</span
        ><span>/</span><span>{{ record.kind }}</span>
      </nav>
      <header class="article-header">
        <h1>{{ record.title }}</h1>
        <p class="record-meta">
          <span class="record-kind">{{ record.kind }}</span
          ><span>{{ record.status }}</span>
        </p>
        <dl class="article-metadata">
          <div v-if="record.createdAt">
            <dt>{{ t.created }}</dt>
            <dd>
              <time :datetime="record.createdAt" :title="record.createdAt">{{
                formatDate(record.createdAt, locale)
              }}</time>
            </dd>
          </div>
          <div v-if="recordDate(record)">
            <dt>{{ t.updated }}</dt>
            <dd>
              <time :datetime="recordDate(record)">{{
                formatDate(recordDate(record), locale)
              }}</time>
            </dd>
          </div>
          <div v-if="record.base">
            <dt>{{ t.base }}</dt>
            <dd>
              <code>{{ record.base }}</code>
            </dd>
          </div>
          <div>
            <dt>{{ t.branches }}</dt>
            <dd>
              <code v-for="branch in record.branches" :key="branch">{{
                branch
              }}</code>
            </dd>
          </div>
        </dl>
        <div class="compact-actions">
          <a
            v-if="record.pullRequest || record.issue"
            :href="record.pullRequest || record.issue"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t.original }} ↗</a
          ><button @click="copy">{{ t.copy }}</button
          ><span role="status">{{ copied }}</span>
        </div>
      </header>
      <section id="summary" class="article-summary">
        <h2>{{ t.summary }}</h2>
        <p>{{ record.summary }}</p>
        <p v-if="record.implementation" class="muted">
          {{ record.implementation }}
        </p>
      </section>
      <RecordSections :record="record" />
      <section
        v-if="record.issueDraft"
        id="issue-draft"
        class="article-section"
      >
        <h2>{{ t.problem }}</h2>
        <p class="muted">{{ t.draft }}</p>
        <dl class="issue-draft">
          <template v-for="(value, key) in record.issueDraft" :key="key"
            ><dt>{{ t[key] || key }}</dt>
            <dd>
              <ul v-if="Array.isArray(value)">
                <li v-for="item in value" :key="item">{{ item }}</li>
              </ul>
              <p v-else>{{ value }}</p>
            </dd></template
          >
        </dl>
      </section>
      <TabComparison v-if="record.comparison" :ids="record.variantIds" />
      <section
        v-if="record.testEvidence"
        id="test-evidence"
        class="article-section"
      >
        <h2>{{ t.evidence }}</h2>
        <p>
          <strong>{{ record.testEvidence.outcome }}</strong>
        </p>
        <p class="muted">{{ t.evidenceNote }}</p>
        <pre><code>{{ JSON.stringify(record.testEvidence,null,2) }}</code></pre>
        <VideoEvidence
          v-for="video in record.testEvidence.videoUrls || []"
          :key="typeof video === 'string' ? video : video.url"
          :video="typeof video === 'string' ? video : video.url"
          :title="record.title"
        />
      </section>
      <RevisionHistory :record="record" />
      <section id="sources-evidence" class="article-section">
        <h2>{{ t.references }}</h2>
        <SourceReferences :record="record" />
      </section>
      <section
        v-if="related.length"
        id="related-records"
        class="article-section"
      >
        <h2>{{ t.related }}</h2>
        <RecordList :records="related" />
      </section>
      <ReviewDecision :record="record" />
    </article>
    <ArticleToc target="change-article" />
  </div>
  <NotFoundPage v-else />
</template>
