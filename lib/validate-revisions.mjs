export function validateRevisions(revisions) {
  const slugs = new Set()
  for (const revision of revisions) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(revision.slug) || slugs.has(revision.slug)) {
      throw new Error(`Slug inválido ou repetido: ${revision.slug}`)
    }
    slugs.add(revision.slug)
    for (const key of ['title', 'summary', 'kind', 'status', 'implementation']) {
      if (typeof revision[key] !== 'string' || !revision[key].trim()) {
        throw new Error(`${revision.slug}: ${key} obrigatório`)
      }
    }
    if (
      !Array.isArray(revision.branches) ||
      !Array.isArray(revision.commits) ||
      !Array.isArray(revision.sections)
    ) {
      throw new Error(`${revision.slug}: branches, commits e sections devem ser listas`)
    }
    if (!revision.pullRequest && revision.commits.length === 0) {
      throw new Error(`${revision.slug}: informe um PR ou pelo menos um commit`)
    }
    if (revision.pullRequest) {
      const url = new URL(revision.pullRequest)
      if (url.protocol !== 'https:' || !/\/(pull|merge_requests)\/\d+$/.test(url.pathname)) {
        throw new Error(`${revision.slug}: URL de PR inválida`)
      }
    }
    for (const commit of revision.commits) {
      if (!/^[a-f0-9]{7,40}$/.test(commit.id)) {
        throw new Error(`${revision.slug}: commit inválido`)
      }
    }
    const sections = new Set()
    for (const section of revision.sections) {
      if (!section.id || sections.has(section.id) || !section.title) {
        throw new Error(`${revision.slug}: seção inválida`)
      }
      sections.add(section.id)
    }
  }
  return revisions
}
