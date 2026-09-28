// ============================================================================
// File Path: src/app/fa/(public)/reports/[slug]/opengraph-image.tsx
// Why: Each report's own share card. The card is components/v3/reports/og-card.
// Env / Identity: Route handler rendered with next/og (Satori)
// ============================================================================

import { ImageResponse } from "next/og"
import { getReport } from "@/lib/reports"
import { OG_SIZE, OgCard, ogFonts } from "@/components/v3/reports/og-card"
import { reportStaticParams } from "@/components/v3/reports/report-route"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "گزارش از فرجاد"

export function generateStaticParams() {
  return reportStaticParams()
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = getReport(slug)
  if (!meta) return new Response("Not found", { status: 404 })
  return new ImageResponse(<OgCard locale="fa" meta={meta} />, { ...OG_SIZE, fonts: await ogFonts("fa") })
}
