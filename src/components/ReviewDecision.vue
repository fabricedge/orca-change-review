<script setup>
import { computed, ref, onMounted } from "vue";
import { useWiki } from "../composables/use-wiki.js";
const props = defineProps({ record: { type: Object, required: true } });
const { t } = useWiki();
const fingerprint = computed(
  () =>
    props.record.commits.map((commit) => commit.id).join(",") ||
    props.record.pullRequest ||
    `${props.record.issue ?? props.record.slug}:${props.record.updatedAt}`,
);
const key = computed(
  () => `orca-decision:${props.record.slug}:${fingerprint.value}`,
);
const decision = ref("pendente"),
  reason = ref(""),
  message = ref("");
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(key.value) || "null");
    if (
      saved &&
      typeof saved.reason === "string" &&
      ["pendente", "aprovar", "revisar", "descartar"].includes(saved.decision)
    ) {
      decision.value = saved.decision;
      reason.value = saved.reason;
      message.value = t.value.recovered;
    }
  } catch {
    message.value = t.value.storageError;
  }
});
function value() {
  return {
    revision: props.record.slug,
    commits: props.record.commits,
    issue: props.record.issue,
    updatedAt: props.record.updatedAt,
    decision: decision.value,
    reason: reason.value,
    recordedAt: new Date().toISOString(),
  };
}
function save() {
  try {
    localStorage.setItem(key.value, JSON.stringify(value()));
    message.value = t.value.saved;
  } catch {
    message.value = t.value.storageError;
  }
}
function download() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value(), null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `decisao-${props.record.slug}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>
<template>
  <section id="review-decision" class="article-section">
    <h2>{{ t.review }}</h2>
    <p class="muted">{{ t.reviewNote }}</p>
    <p class="wrap">
      <code>{{ fingerprint }}</code>
    </p>
    <form class="review-form" @submit.prevent="save">
      <label
        >{{ t.outcome
        }}<select v-model="decision">
          <option value="pendente">{{ t.pending }}</option>
          <option value="aprovar">{{ t.approve }}</option>
          <option value="revisar">{{ t.revise }}</option>
          <option value="descartar">{{ t.discard }}</option>
        </select></label
      ><label
        >{{ t.reason
        }}<textarea v-model="reason" rows="4" maxlength="6000"></textarea>
      </label>
      <div class="compact-actions">
        <button type="submit" class="primary">{{ t.save }}</button
        ><button type="button" @click="download">{{ t.export }}</button>
      </div>
      <p role="status">{{ message }}</p>
    </form>
  </section>
</template>
