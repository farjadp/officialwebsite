// ============================================================================
// File Path: src/app/(public)/playbooks/opengraph-image.tsx
// Why: The share card for the playbooks index.
// Env / Identity: Route handler rendered with next/og (Satori)
// ============================================================================

import { ImageResponse } from "next/og"
import { PLAYBOOKS } from "@/lib/playbooks"
import { OG_SIZE, OgIndexCard, ogFonts } from "@/components/v3/reports/og-card"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Playbook by Farjad"

export default async function Image() {
  return new ImageResponse(<OgIndexCard locale="en" count={PLAYBOOKS.length} kind="playbook" />, {
    ...OG_SIZE,
    fonts: await ogFonts("en"),
  })
}
