import { computed } from "vue";
import { useRoute } from "vue-router";
import { wikiMessages } from "../../lib/wiki-messages.mjs";
export function useWiki() {
  const route = useRoute();
  const locale = computed(() =>
    route.params.locale === "pt-BR" || route.path.startsWith("/revisoes")
      ? "pt-BR"
      : "en",
  );
  const t = computed(() => wikiMessages(locale.value));
  return { locale, t, route };
}
