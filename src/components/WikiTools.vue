<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWiki } from "../composables/use-wiki.js";
import {
  defaultPreview,
  previewStorageKey,
  previewUrl,
  restorePreview,
} from "../../lib/local-preview.mjs";
import {
  siteRepositoryUrl,
  siteOwner,
  siteVersion,
} from "../../lib/review-site.mjs";
const { locale, t, route } = useWiki();
const router = useRouter();
const style = ref("showcase");
const preview = ref({ ...defaultPreview });
const message = ref("");
const command = "npm install && npm run deploy:local";
onMounted(() => {
  style.value = document.documentElement.dataset.siteStyle || "showcase";
  try {
    preview.value = {
      ...restorePreview(
        JSON.parse(localStorage.getItem(previewStorageKey) || "null"),
      ),
    };
  } catch {
    message.value = t.value.storageError;
  }
});
function language(event) {
  const next = event.target.value;
  router.push({
    path: route.path.startsWith("/revisoes")
      ? route.params.slug
        ? `/${next}/changes/${route.params.slug}/`
        : `/${next}/changes/`
      : route.path === "/"
        ? `/${next}/overview/`
        : route.path.replace(/^\/(en|pt-BR)(?=\/|$)/, `/${next}`),
    query: route.query,
    hash: route.hash,
  });
}
function toggle() {
  style.value = style.value === "readme" ? "showcase" : "readme";
  document.documentElement.dataset.siteStyle = style.value;
  try {
    localStorage.setItem("orca-review:site-style:v1", style.value);
  } catch {
    message.value = t.value.storageError;
  }
}
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
    message.value = t.value.copied;
  } catch {
    message.value = t.value.copyError;
  }
}
function save() {
  try {
    const next = {
      mode: preview.value.mode,
      localhost: previewUrl(preview.value.localhost),
      tailscale: preview.value.tailscale.trim()
        ? previewUrl(preview.value.tailscale)
        : "",
    };
    if (!next[next.mode]) throw new Error("empty");
    preview.value = next;
    try {
      localStorage.setItem(previewStorageKey, JSON.stringify(next));
      message.value = t.value.preferenceSaved;
    } catch {
      message.value = t.value.storageError;
    }
  } catch {
    message.value = t.value.invalidUrl;
  }
}
function href() {
  try {
    return previewUrl(preview.value[preview.value.mode]);
  } catch {
    return null;
  }
}
</script>
<template>
  <header class="wiki-topbar">
    <span class="wiki-topbar-title">@{{ siteOwner }} · {{ t.knowledge }}</span>
    <div class="wiki-topbar-actions">
      <a
        class="topbar-version"
        :href="`${siteRepositoryUrl}/blob/HEAD/CHANGELOG.md`"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`${t.version}: ${siteVersion}`"
        >v{{ siteVersion }}</a
      >
      <label class="language-control"
        ><span class="sr-only">{{ t.language }}</span
        ><select :value="locale" @change="language">
          <option value="en">English</option>
          <option value="pt-BR">Português</option>
        </select></label
      >
      <details class="wiki-tools">
        <summary>{{ t.tools }}</summary>
        <div class="tools-content">
          <button
            type="button"
            :aria-pressed="style === 'readme'"
            @click="toggle"
          >
            {{ style === "readme" ? t.wiki : t.readme }}
          </button>
          <details>
            <summary>{{ t.preview }}</summary>
            <form @submit.prevent="save">
              <p class="muted">{{ t.previewHelp }}</p>
              <label
                >{{ t.preferred
                }}<select v-model="preview.mode">
                  <option value="localhost">Localhost</option>
                  <option value="tailscale">Tailscale</option>
                </select></label
              ><label
                >{{ t.localUrl
                }}<input
                  v-model="preview.localhost"
                  placeholder="http://localhost:3100"
                  spellcheck="false"
                  autocapitalize="none" /></label
              ><label
                >{{ t.tailUrl
                }}<input
                  v-model="preview.tailscale"
                  placeholder="http://100.x.y.z:3100"
                  spellcheck="false"
                  autocapitalize="none"
              /></label>
              <div class="compact-actions">
                <button type="submit">{{ t.savePreference }}</button
                ><a
                  v-if="href()"
                  :href="href()"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ t.open }} {{ preview.mode }} ↗</a
                >
              </div>
              <p class="muted wrap">{{ href() }}</p>
            </form>
          </details>
          <details>
            <summary>{{ t.deploy }}</summary>
            <p>{{ t.setup }}</p>
            <pre><code>{{ command }}</code></pre>
            <button @click="copy(command)">{{ t.copyCommand }}</button
            ><a
              :href="`${siteRepositoryUrl}/blob/HEAD/docs/local-development.md`"
              target="_blank"
              rel="noopener noreferrer"
              >{{ t.setupGuide }} ↗</a
            >
          </details>
          <a
            :href="`${siteRepositoryUrl}#create-your-own-orca-review`"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t.create }} ↗</a
          ><a
            :href="siteRepositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            >{{ t.repository }} ↗</a
          >
          <p role="status">{{ message }}</p>
        </div>
      </details>
    </div>
  </header>
</template>
