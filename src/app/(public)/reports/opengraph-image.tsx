// ============================================================================
// File Path: src/app/(public)/reports/opengraph-image.tsx
// Why: The share card for the reports index.
// Env / Identity: Route handler rendered with next/og (Satori)
// ============================================================================

import { ImageResponse } from "next/og"
import { REPORTS } from "@/lib/reports"
import { OG_SIZE, OgIndexCard, ogFonts } from "@/components/v3/reports/og-card"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Reports by Farjad"

export default async function Image() {
  return new ImageResponse(<OgIndexCard locale="en" count={REPORTS.length} />, {
    ...OG_SIZE,
    fonts: await ogFonts("en"),
  })
}
