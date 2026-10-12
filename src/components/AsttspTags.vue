<script setup>
import { groupsForRecord, asttspPath, asttspText } from "../../lib/asttsp.mjs";
import { useWiki } from "../composables/use-wiki.js";
defineProps({ record: { type: Object, required: true } });
const { locale } = useWiki();
</script>
<template>
  <div v-if="record.asttsp?.length" class="asttsp-tags">
    <router-link v-for="group in groupsForRecord(record)" :key="group.id"
      :to="asttspPath(group.id, locale)" class="asttsp-tag">
      <strong>ASTTSP</strong><span>{{ asttspText(group.title, locale) }}</span>
    </router-link>
  </div>
</template>
