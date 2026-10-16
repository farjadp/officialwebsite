// ============================================================================
// File Path: src/components/v3/playbooks/registry.tsx
// Why: Maps each playbook slug in lib/playbooks.ts to the component that
//      renders it. Kept apart from lib/playbooks.ts so the sitemap and nav can
//      read the metadata without importing React components.
// ============================================================================

import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import type { PlaybookMeta } from "@/lib/playbooks"
import { ContentTeamPlaybook } from "./content-team/playbook"

export const PLAYBOOK_COMPONENTS: Record<string, (p: { locale: Locale; meta: PlaybookMeta }) => ReactNode> = {
  "claude-code-content-team": ContentTeamPlaybook,
}
