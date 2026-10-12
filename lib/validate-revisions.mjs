import { validateAsttspTags } from './asttsp.mjs'

export function validateRevisions(revisions) {
  const slugs = new Set()
  for (const revision of revisions) {
    validateAsttspTags(revision)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(revision.slug) || slugs.has(revision.slug)) {
      throw new Error(`Slug inválido ou repetido: ${revision.slug}`)
    }
    slugs.add(revision.slug)
    if (revision.topic !== undefined && (typeof revision.topic !== 'string' || !revision.topic.trim())) {
      throw new Error(`${revision.slug}: topic deve ser um texto não vazio`)
    }
    for (const key of ['createdAt', 'updatedAt']) {
      if (
        revision[key] !== undefined &&
        (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(revision[key]) ||
          !Number.isFinite(Date.parse(revision[key])))
      ) {
        throw new Error(`${revision.slug}: ${key} deve ser um datetime ISO 8601 com timezone`)
      }
    }
    if (
      revision.createdAt &&
      revision.updatedAt &&
      Date.parse(revision.updatedAt) < Date.parse(revision.createdAt)
    ) {
      throw new Error(`${revision.slug}: updatedAt não pode ser anterior a createdAt`)
    }
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
    if (
      !revision.pullRequest &&
      !revision.issue &&
      !revision.issueDraft &&
      revision.commits.length === 0
    ) {
      throw new Error(`${revision.slug}: informe uma issue, rascunho de issue, PR ou commit`)
    }
    if (revision.issue) {
      const url = new URL(revision.issue)
      if (url.protocol !== 'https:' || !/\/issues\/\d+$/.test(url.pathname)) {
        throw new Error(`${revision.slug}: URL de issue inválida`)
      }
    }
    if (revision.issueDraft) {
      const draft = revision.issueDraft
      for (const key of ['problem', 'impact', 'expected', 'observed', 'guidelinesSource']) {
        if (typeof draft[key] !== 'string' || !draft[key].trim()) {
          throw new Error(`${revision.slug}: issueDraft.${key} obrigatório`)
        }
      }
      if (
        !['bug', 'feature'].includes(draft.type) ||
        !Array.isArray(draft.reproduction) ||
        draft.reproduction.some((step) => typeof step !== 'string' || !step.trim()) ||
        (draft.type === 'bug' && draft.reproduction.length === 0)
      ) {
        throw new Error(`${revision.slug}: informe tipo e reprodução do problema`)
      }
    }
    if (revision.pullRequest) {
      const url = new URL(revision.pullRequest)
      if (url.protocol !== 'https:' || !/\/(pull|merge_requests)\/\d+$/.test(url.pathname)) {
        throw new Error(`${revision.slug}: URL de PR inválida`)
      }
    }
    if (revision.testEvidence) {
      const evidence = revision.testEvidence
      if (
        !['passed', 'failed', 'incomplete', 'not-run'].includes(evidence.outcome) ||
        typeof evidence.testFile !== 'string' ||
        typeof evidence.limitations !== 'string' ||
        !Number.isFinite(Date.parse(evidence.recordedAt)) ||
        !Array.isArray(evidence.videoUrls)
      ) {
        throw new Error(`${revision.slug}: evidência de teste inválida`)
      }
      for (const video of evidence.videoUrls) {
        if (typeof video !== 'string' || new URL(video).protocol !== 'https:') {
          throw new Error(`${revision.slug}: vídeo deve ter URL HTTPS`)
        }
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
