#!/usr/bin/env bash
set -euo pipefail

site_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd -- "$site_dir"
for command in node git gh; do
  command -v "$command" >/dev/null || { printf 'Install %s first.\n' "$command" >&2; exit 1; }
done
owner="$(gh api user --jq .login)"
repository="${1:-$owner/orca-change-review}"
tag="${2:-recordings-$(date -u +%Y%m%d-%H%M%S)}"
source_dir="${3:-$site_dir/../orca/artifacts/tab-copy-prs/images/videos}"
release_dir="$(mktemp -d "${TMPDIR:-/tmp}/orca-release-media.XXXXXX")"
trap 'rm -rf -- "$release_dir"' EXIT

# Validate every recording before creating public resources.
node scripts/prepare-release-media.mjs "$repository" "$tag" "$source_dir" "$release_dir"
if gh release view "$tag" --repo "$repository" >/dev/null 2>&1; then
  printf 'Release already exists: %s. Choose a new tag; existing assets are preserved.\n' "$tag" >&2
  exit 1
fi
if ! gh repo view "$repository" >/dev/null 2>&1; then
  gh repo create "$repository" --public --description 'Orca change reviews, recordings and interface comparisons'
fi
if [[ "$(gh repo view "$repository" --json visibility --jq .visibility)" != PUBLIC ]]; then
  printf 'Use a public repository so visitors can play the recordings.\n' >&2
  exit 1
fi
if [[ ! -d .git ]]; then
  git init -b main
fi
if git remote get-url origin >/dev/null 2>&1; then
  remote="$(git remote get-url origin)"
  if [[ "$remote" != "https://github.com/$repository.git" && "$remote" != "git@github.com:$repository.git" && "$remote" != "https://github.com/$repository" ]]; then
    printf 'origin points elsewhere: %s. No changes were pushed.\n' "$remote" >&2
    exit 1
  fi
else
  git remote add origin "https://github.com/$repository.git"
fi
git add -- app lib scripts docs next.config.mjs package.json .gitignore README.md
if [[ -f package-lock.json ]]; then git add -- package-lock.json; fi
if ! git diff --cached --quiet; then git commit -m 'feat: publish Orca change review site'; fi
git push -u origin HEAD
assets=("$release_dir"/*)
gh release create "$tag" "${assets[@]}" --repo "$repository" --target "$(git rev-parse HEAD)" --title "Orca recordings: $tag" --notes 'Complete Orca app recordings and screenshots for the tab copy comparison.' --latest=false
mkdir -p media
cp -- "$release_dir/manifest.json" media/releases.json
git add -- media/releases.json
git commit -m 'feat: load recordings from GitHub Releases'
git push
printf '\nPublished: https://github.com/%s/releases/tag/%s\nVideos are release assets, not Git files. Restart or rebuild the site to load media/releases.json.\n' "$repository" "$tag"
