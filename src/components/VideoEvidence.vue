<script setup>
import { ref } from "vue";
import { useWiki } from "../composables/use-wiki.js";
defineProps({
  video: String,
  poster: String,
  title: { type: String, required: true },
});
const { t, locale } = useWiki();
const failed = ref(false);
const base = import.meta.env.BASE_URL;
function mediaUrl(value) {
  return value?.startsWith("/media/") ? `${base}${value.slice(1)}` : value;
}
</script>
<template>
  <figure class="recording">
    <template v-if="video"
      ><video
        controls
        playsinline
        preload="metadata"
        :poster="mediaUrl(poster)"
        :aria-label="title"
        @error="failed = true"
      >
        <source :src="mediaUrl(video)" type="video/webm" />
      </video>
      <figcaption>
        <span>{{ title }}</span
        ><a
          :href="mediaUrl(video)"
          download
          target="_blank"
          rel="noopener noreferrer"
          >{{ t.download }} ↗</a
        >
      </figcaption>
      <p v-if="failed" role="alert">
        {{ t.videoError }} <a :href="mediaUrl(video)">{{ t.download }}</a>
      </p></template
    >
    <p v-else class="empty-state">
      {{ t.videoMissing }}
      <router-link :to="`/${locale}/workflow/`">{{ t.plan }}</router-link>
    </p>
  </figure>
</template>
