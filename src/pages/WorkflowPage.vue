<script setup>
import { computed } from "vue";
import { workflowContent } from "../../lib/workflow-content.mjs";
import { siteRepositoryUrl } from "../../lib/review-site.mjs";
import { useWiki } from "../composables/use-wiki.js";
import ArticleToc from "../components/ArticleToc.vue";
const { locale, t } = useWiki();
const content = computed(() => workflowContent[locale.value]);
</script>
<template>
  <div class="article-layout">
    <article id="workflow-article">
      <div class="breadcrumbs">{{ t.product }} / {{ t.plan }}</div>
      <h1>{{ content.title }}</h1>
      <p class="page-intro">{{ content.intro }}</p>
      <section id="issue-guidance" class="article-section">
        <h2>{{ content.issueTitle }}</h2>
        <ol class="article-list">
          <li v-for="step in content.steps" :key="step">{{ step }}</li>
        </ol>
        <a
          href="https://github.com/stablyai/orca/tree/main/.github/ISSUE_TEMPLATE"
          target="_blank"
          rel="noopener noreferrer"
          >{{ content.template }} ↗</a
        >
      </section>
      <section id="mcp-recording" class="article-section">
        <h2>{{ content.mcpTitle }}</h2>
        <p>{{ content.mcpBody }}</p>
        <p class="article-summary">{{ content.mcpLimit }}</p>
        <a
          :href="`${siteRepositoryUrl}/blob/HEAD/docs/mcp.md`"
          target="_blank"
          rel="noopener noreferrer"
          >{{ content.setup }} ↗</a
        >
        <pre><code>npm run check:changes
node mcp/after-change.mjs --help</code></pre>
      </section>
    </article>
    <ArticleToc target="workflow-article" />
  </div>
</template>
