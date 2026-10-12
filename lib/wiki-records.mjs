import { repositoryHref } from "./review-references.mjs";
export const topicNames = {
  en: {
    "tabs-layout": "Tabs and layout",
    "remote-services": "Remote execution and services",
    general: "Development",
  },
  "pt-BR": {
    "tabs-layout": "Abas e layout",
    "remote-services": "Execução remota e serviços",
    general: "Desenvolvimento",
  },
};
export function topicLabel(topic = "general", locale = "en") {
  return topicNames[locale]?.[topic] ?? topic;
}
export function recordDate(record) {
  return record.updatedAt ?? record.createdAt ?? record.recordedAt;
}
export function formatDate(value, locale = "en") {
  return value
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(new Date(value))
    : "—";
}
export function filterRecords(
  records,
  { query = "", kind = "", topic = "", outcome = "", sort = "recent" } = {},
) {
  const normalize = (value) =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const needle = normalize(query.trim());
  return records
    .filter(
      (record) =>
        (!kind || record.kind === kind) &&
        (!topic || (record.topic || "general") === topic) &&
        (!outcome || (record.testEvidence?.outcome ?? "not-run") === outcome) &&
        normalize(
          [
            record.title,
            record.summary,
            record.repository ?? "",
            record.status,
            record.topic ?? "",
            ...record.branches,
            ...record.commits.map((commit) => `${commit.id} ${commit.label}`),
            record.pullRequest ?? "",
            record.issue ?? "",
            JSON.stringify(record.sections),
            JSON.stringify(record.issueDraft ?? {}),
          ].join(" "),
        ).includes(needle),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : ((Date.parse(recordDate(b)) || 0) -
            (Date.parse(recordDate(a)) || 0)) *
          (sort === "oldest" ? -1 : 1),
    );
}
export function relatedRecords(record, records) {
  return records.filter(
    (other) =>
      other.slug !== record.slug &&
      (other.branches.some((branch) => record.branches.includes(branch)) ||
        other.commits.some((commit) =>
          record.commits.some((own) => own.id === commit.id),
        )),
  );
}
export function recordSources(records) {
  const sources = new Map();
  for (const record of records) {
    const url = repositoryHref(record);
    const key = url ?? "local";
    if (!sources.has(key))
      sources.set(key, {
        id: key,
        name:
          record.repository ?? (url ? new URL(url).pathname.slice(1) : null),
        url,
        records: [],
      });
    sources.get(key).records.push(record);
  }
  return [...sources.values()];
}
export function articlePath(slug, locale = "en") {
  return `/${locale}/changes/${slug}/`;
}
export function staticRoutes(records) {
  return [
    "/",
    "/404/",
    "/revisoes/",
    ...records.map((r) => `/revisoes/${r.slug}/`),
    ...["en", "pt-BR"].flatMap((locale) => [
      `/${locale}/`,
      ...["overview", "news", "changes", "sources", "tab-copy", "workflow"].map(
        (page) => `/${locale}/${page}/`,
      ),
      ...records.map((r) => articlePath(r.slug, locale)),
    ]),
  ];
}
