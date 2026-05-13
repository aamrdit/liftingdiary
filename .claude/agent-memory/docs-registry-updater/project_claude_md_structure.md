---
name: project-claude-md-structure
description: CLAUDE.md docs registry format, section heading, and entry ordering conventions for liftingdiary
metadata:
  type: project
---

The docs registry lives in CLAUDE.md under the section heading:

  ## IMPORTANT: Always Read Docs First

Entries are plain bullet lines with no descriptions or annotations:

  - /docs/filename.md

Ordering is NOT alphabetical — entries are appended in the order docs were added. At time of writing the list is:

  - /docs/ui.md
  - /docs/data-fetching.md
  - /docs/data-mutations.md
  - /docs/auth.md
  - /docs/server-components.md
  - /docs/routing.md

**Why:** The section was authored this way from the start and new entries (server-components.md, routing.md) were appended at the bottom.

**How to apply:** When adding a new /docs/ entry, append it at the end of the list unless there is a clear categorical reason to group it elsewhere.
