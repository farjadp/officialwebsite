// Gated case-study report. Reached only through the signed link emailed by
// /api/case-study/request. See src/components/v3/case-studies/report-route.tsx.
import { renderGatedReport, reportMetadata } from "@/components/v3/case-studies/report-route"

export const dynamic = "force-dynamic"
export const metadata = reportMetadata

export default async function GatedReportPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ t?: string | string[] }>
}) {
    const [{ slug }, { t }] = await Promise.all([params, searchParams])
    return renderGatedReport(slug, Array.isArray(t) ? t[0] : t, "fa")
}
