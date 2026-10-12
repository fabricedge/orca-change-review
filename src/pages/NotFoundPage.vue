<script setup>
import { useWiki } from "../composables/use-wiki.js";
const { locale, t } = useWiki();
</script>
<template>
  <article>
    <h1>{{ t.notFound }}</h1>
    <p>{{ t.notFoundBody }}</p>
    <router-link :to="`/${locale}/changes/`">{{ t.all }}</router-link>
  </article>
</template>
