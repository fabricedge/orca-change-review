<script setup>
import { computed, ref, onMounted } from "vue";
import { variants } from "../../lib/tab-copy-variants.mjs";
import media from "virtual:orca-media";
import { getMessages } from "../../lib/i18n.mjs";
import { useWiki } from "../composables/use-wiki.js";
import VideoEvidence from "./VideoEvidence.vue";
import { articlePath } from "../../lib/wiki-records.mjs";
const props = defineProps({
  ids: { type: Array, default: () => variants.map((v) => v.id) },
});
const { locale, t } = useWiki();
const available = computed(() =>
  variants
    .map((v, index) => ({ ...v, ...getMessages(locale.value).variants[index] }))
    .filter((v) => props.ids.includes(v.id)),
);
const left = ref(available.value[0]?.id);
const right = ref(available.value[1]?.id);
onMounted(() => {
  const id = window.location.hash.slice(1);
  if (available.value.some((v) => v.id === id)) left.value = id;
});
const selected = computed(() =>
  available.value.length > 1
    ? [...new Set([left.value, right.value])]
        .map((id) => available.value.find((v) => v.id === id))
        .filter(Boolean)
    : available.value,
);
function asset(url) {
  return url?.startsWith("/")
    ? `${import.meta.env.BASE_URL}${url.replace(/^\//, "")}`
    : url;
}
</script>
<template>
  <section id="comparison" class="article-section">
    <h2>{{ t.compare }}</h2>
    <div v-if="available.length > 1" class="comparison-selectors">
      <label
        >{{ t.compare }} A<select v-model="left">
          <option
            v-for="variant in available"
            :key="variant.id"
            :value="variant.id"
          >
            {{ variant.title }}
          </option>
        </select></label
      ><label
        >{{ t.compare }} B<select v-model="right">
          <option
            v-for="variant in available"
            :key="variant.id"
            :value="variant.id"
          >
            {{ variant.title }}
          </option>
        </select></label
      >
    </div>
    <div class="comparison-grid">
      <section
        v-for="(variant, index) in selected"
        :key="`${variant.id}-${index}`"
        :id="variant.id"
      >
        <h3>
          <router-link :to="articlePath(variant.id, locale)">{{
            variant.title
          }}</router-link>
        </h3>
        <p>{{ variant.behavior }}</p>
        <VideoEvidence
          :video="
            media.captureKind === 'orca-app'
              ? media.variants?.[variant.id]?.video
              : undefined
          "
          :poster="
            media.captureKind === 'orca-app'
              ? media.variants?.[variant.id]?.menu
              : undefined
          "
          :title="variant.title"
        />
        <details
          v-if="
            media.captureKind === 'orca-app' &&
            media.variants?.[variant.id]?.menu
          "
        >
          <summary>{{ t.screenshot }}</summary>
          <a
            v-for="(url, name) in Object.fromEntries(
              Object.entries(media.variants[variant.id]).filter(([key]) =>
                ['menu', 'tooltip', 'copied'].includes(key),
              ),
            )"
            :key="name"
            :href="asset(url)"
            target="_blank"
            rel="noopener noreferrer"
            ><img
              :src="asset(url)"
              :alt="`${variant.title}: ${name}`"
              loading="lazy"
          /></a>
        </details>
        <code class="wrap">{{ variant.branch }}</code>
      </section>
    </div>
  </section>
</template>
