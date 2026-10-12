export function repositoryHref(revision) {
  return revision.repository ? `https://github.com/${revision.repository}` : null
}

export function commitHref(revision, commit) {
  const repository = repositoryHref(revision)
  return repository ? `${repository}/commit/${commit.id}` : null
}
