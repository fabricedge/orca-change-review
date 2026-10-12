export function repositoryHref(revision) {
  const reference = revision.pullRequest ?? revision.issue;
  if (reference) {
    const url = new URL(reference);
    const path = url.pathname.replace(
      /\/(?:-\/)?(?:pull|merge_requests|issues)\/\d+$/,
      "",
    );
    if (
      path !== url.pathname &&
      (!revision.repository || path.slice(1) === revision.repository)
    )
      return `${url.origin}${path}`;
  }
  return revision.repository
    ? `https://github.com/${revision.repository}`
    : null;
}
export function commitHref(revision, commit) {
  const repository = repositoryHref(revision);
  if (!repository) return null;
  const host = new URL(repository).hostname;
  if (host === "github.com") return `${repository}/commit/${commit.id}`;
  if ((revision.pullRequest ?? revision.issue ?? "").includes("/-/"))
    return `${repository}/-/commit/${commit.id}`;
  return null;
}
