<script setup>
import { repositoryHref } from "../../lib/review-references.mjs";
defineProps({ record: { type: Object, required: true } });
function fileUrl(record, file) {
  const repository = repositoryHref(record);
  if (!repository) return null;
  const host = new URL(repository).hostname;
  if (
    host !== "github.com" &&
    !(record.issue || record.pullRequest || "").includes("/-/")
  )
    return null;
  return `${repository}/${host === "github.com" ? "" : "-/"}blob/${record.commits[0]?.id ?? record.base ?? "HEAD"}/${file.path}`;
}
</script>
<template>
  <section
    v-for="section in record.sections"
    :id="section.id"
    :key="section.id"
    class="article-section"
  >
    <h2>{{ section.title }}</h2>
    <p v-for="paragraph in section.paragraphs" :key="paragraph">
      {{ paragraph }}
    </p>
    <ul v-if="section.files" class="file-list">
      <li v-for="file in section.files" :key="file.path">
        <a
          v-if="fileUrl(record, file)"
          :href="fileUrl(record, file)"
          target="_blank"
          rel="noopener noreferrer"
          ><code>{{ file.path }}</code> ↗</a
        ><code v-else>{{ file.path }}</code>
        <p class="muted">{{ file.description }}</p>
      </li>
    </ul>
    <figure v-if="section.code">
      <figcaption v-if="section.codeCaption" class="muted">
        {{ section.codeCaption }}
      </figcaption>
      <pre><code>{{ section.code }}</code></pre>
    </figure>
    <ul v-if="section.items" class="article-list">
      <li v-for="item in section.items" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
