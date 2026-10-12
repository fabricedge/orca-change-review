import groups from "../data/asttsp-groups.json" with { type: "json" };

export const asttspGroups = groups;
export function asttspText(value, locale = "en") {
  return value?.[locale] ?? value?.en ?? "";
}
export function asttspPath(id, locale = "en") {
  return `/${locale}/asttsp/${id}/`;
}
export function groupsForRecord(record) {
  return groups.filter((group) => record.asttsp?.includes(group.id));
}
export function asttspMembers(group, records) {
  return records.filter((record) => record.pullRequest && !record.comparison && record.asttsp?.includes(group.id));
}
export function validateAsttspTags(record) {
  if (record.asttsp === undefined) return;
  if (!Array.isArray(record.asttsp) || new Set(record.asttsp).size !== record.asttsp.length ||
      record.asttsp.some((id) => !groups.some((group) => group.id === id))) {
    throw new Error(`${record.slug}: asttsp must contain unique registered group IDs`);
  }
  if (record.asttsp.length && !record.pullRequest) {
    throw new Error(`${record.slug}: ASTTSP membership requires a pull request`);
  }
}
