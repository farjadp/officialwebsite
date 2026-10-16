// ============================================================================
// File Path: src/app/fa/(public)/playbooks/[slug]/opengraph-image.tsx
// Why: Each playbook's own share card, drawn by the reports' og-card.
// Env / Identity: Route handler rendered with next/og (Satori)
// ============================================================================

import { ImageResponse } from "next/og"
import { getPlaybook } from "@/lib/playbooks"
import { OG_SIZE, OgCard, ogFonts } from "@/components/v3/reports/og-card"
import { playbookStaticParams } from "@/components/v3/playbooks/playbook-route"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "پلی‌بوک از فرجاد"

export function generateStaticParams() {
  return playbookStaticParams()
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = getPlaybook(slug)
  if (!meta) return new Response("Not found", { status: 404 })
  return new ImageResponse(<OgCard locale="fa" meta={meta} kind="playbook" />, { ...OG_SIZE, fonts: await ogFonts("fa") })
}
