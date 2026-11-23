// ============================================================================
// File Path: src/app/(public)/reports/[slug]/page.tsx
// Why: One report. Everything lives in components/v3/reports/report-route.tsx.
// Env / Identity: React Server Component
// ============================================================================

import { ReportRoute, reportMetadata, reportStaticParams } from "@/components/v3/reports/report-route"

type Props = { params: Promise<{ slug: string }> }

// Scheduled reports (lib/reports.ts) render on demand after their day; an
// unknown or not-yet-live slug gets notFound(). Hourly revalidation lets a
// scheduled report appear without a deploy.
export const dynamicParams = true
export const revalidate = 3600

export function generateStaticParams() {
  return reportStaticParams()
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return reportMetadata(slug, "en")
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params
  return <ReportRoute slug={slug} locale="en" />
}
