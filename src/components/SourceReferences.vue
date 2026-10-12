<script setup>
import { repositoryHref, commitHref } from "../../lib/review-references.mjs";
import { useWiki } from "../composables/use-wiki.js";
defineProps({ record: { type: Object, required: true } });
const { t } = useWiki();
</script>
<template>
  <div class="source-references">
    <div class="compact-actions">
      <a
        v-if="repositoryHref(record)"
        :href="repositoryHref(record)"
        target="_blank"
        rel="noopener noreferrer"
        >{{ record.repository || repositoryHref(record) }} ↗</a
      ><a
        v-if="record.pullRequest"
        :href="record.pullRequest"
        target="_blank"
        rel="noopener noreferrer"
        >PR #{{ record.pullRequest.split("/").at(-1) }} ↗</a
      ><a
        v-if="record.issue"
        :href="record.issue"
        target="_blank"
        rel="noopener noreferrer"
        >Issue #{{ record.issue.split("/").at(-1) }} ↗</a
      >
    </div>
    <ul class="commit-list">
      <li v-for="commit in record.commits" :key="commit.id">
        <a
          v-if="commitHref(record, commit)"
          :href="commitHref(record, commit)"
          :title="commit.id"
          target="_blank"
          rel="noopener noreferrer"
          ><code>{{
            commit.id.length > 12 ? commit.id.slice(0, 12) : commit.id
          }}</code>
          ↗</a
        ><code v-else :title="commit.id">{{
          commit.id.length > 12 ? commit.id.slice(0, 12) : commit.id
        }}</code
        ><span>{{ commit.label }}</span>
      </li>
    </ul>
    <p v-if="!repositoryHref(record) && record.commits.length" class="muted">
      {{ t.localNote }}
    </p>
  </div>
</template>
