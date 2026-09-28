// ============================================================================
// File Path: src/app/fa/(public)/reports/[slug]/page.tsx
// Why: One report. Everything lives in components/v3/reports/report-route.tsx.
// Env / Identity: React Server Component
// ============================================================================

import { ReportRoute, reportMetadata, reportStaticParams } from "@/components/v3/reports/report-route"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return reportStaticParams()
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return reportMetadata(slug, "fa")
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params
  return <ReportRoute slug={slug} locale="fa" />
}
