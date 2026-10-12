#!/usr/bin/env bash
set -euo pipefail

repository="${1:-fabricedge/orca-change-review}"
website="${2:-https://fabricedge.github.io/orca-change-review/}"
author="${3:-fabricedge}"

gh repo edit "$repository" \
  --homepage "$website" \
  --description "Automated Orca test recordings and feature evidence, linked to PRs, commits and issues. Created by: $author."

printf 'Updated repository description and website: https://github.com/%s\n' "$repository"
