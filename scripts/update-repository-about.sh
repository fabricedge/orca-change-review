#!/usr/bin/env bash
set -euo pipefail

repository="${1:-fabricedge/orca-change-review}"
website="${2:-https://fabricedge.github.io/orca-change-review/}"
author="${3:-fabricedge}"

gh repo edit "$repository" \
  --homepage "$website" \
  --description "Vue 3 + Vite site that turns automated Orca test recordings into evidence pages with screenshots and video, linked to PRs, commits and issues. Ships an MCP server for agents. Created by: $author."

printf 'Updated repository description and website: https://github.com/%s\n' "$repository"
