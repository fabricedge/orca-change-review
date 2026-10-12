<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useWiki } from "../composables/use-wiki.js";
const props = defineProps({ target: { type: String, required: true } });
const { t } = useWiki();
const headings = ref([]);
const active = ref("");
let observer;
onMounted(async () => {
  await nextTick();
  const nodes = [
    ...(document.getElementById(props.target)?.querySelectorAll("h2") || []),
  ];
  headings.value = nodes.map((node, index) => {
    const id =
      node.id || node.closest("section[id]")?.id || `section-${index + 1}`;
    if (!document.getElementById(id)) node.id = id;
    return { id, title: node.textContent, node: document.getElementById(id) };
  });
  if (!headings.value.length) return;
  active.value = headings.value[0].id;
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) active.value = visible[0].target.id;
    },
    { rootMargin: "-80px 0px -65% 0px" },
  );
  headings.value.forEach((heading) => observer.observe(heading.node));
});
onUnmounted(() => observer?.disconnect());
</script>
<template>
  <aside v-if="headings.length > 1" class="wiki-toc">
    <nav :aria-label="t.page">
      <h2>{{ t.page }}</h2>
      <a
        v-for="heading in headings"
        :key="heading.id"
        :href="`#${heading.id}`"
        :aria-current="active === heading.id ? 'location' : undefined"
        @click="active = heading.id"
        >{{ heading.title }}</a
      >
    </nav>
  </aside>
</template>
