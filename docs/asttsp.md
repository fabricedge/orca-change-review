# ASTTSP

ASTTSP means **Alternative Solutions To The Same Problem**. It is a relationship between PRs, separate from their topic, change type or test status.

Visit `/en/asttsp/` for all groups or `/en/asttsp/tab-context/` to compare the tab-context proposals. The Portuguese equivalents use `/pt-BR/`. Amber tags on PR listings and articles link to the relevant comparison. The catalog's ASTTSP filter can show every tagged PR or one group; the filter is preserved in the URL.

## Tag a PR

Add `asttsp: ["tab-context"]` to a review in `data/reviews.json`, or pass that field in `review` to the MCP `save_review` tool. Call `list_asttsp_groups` to discover registered IDs. Built-in PR records are edited in `lib/revisions.mjs`. Unknown and duplicate IDs are rejected, as are tags on records without a PR link. An empty list removes membership.

To add a different shared problem, register its stable ID, English/Portuguese title, problem and shared context in `data/asttsp-groups.json`. Optional `approaches` entries explain a PR's tradeoffs by record slug. Tag each participating PR with the new ID. Group membership, tags, filters and static pages are generated from this metadata. A review can belong to more than one group. GitHub PRs and GitLab merge requests use the same mechanism.

The existing tab-menu video comparison is attached through optional `variantIds`; new groups do not need tab-specific components or recordings. A tag records an alternative relationship, not a merge dependency or a passing test. Empty groups show an explicit empty state.

## Presentation

The existing wiki typography, spacing and article/list components are retained. Amber distinguishes ASTTSP from neutral PR labels and green navigation links. Tags include the name and shared problem so color is not the only identifier. They have visible keyboard focus and a 44-pixel minimum target; wrapping keeps long labels usable on phones. The group page leads with the problem, then shared behavior, tradeoffs and recorded evidence. No new decorative assets or motion are required.

Design read: technical review wiki, existing editorial style; ENERGY 1 / RHYTHM 2 / MOTION 1.
