// ============================================================================
// File Path: src/components/v3/reports/registry.tsx
// Why: Maps each report slug in lib/reports.ts to the component that renders
//      it. Kept apart from lib/reports.ts so the sitemap and nav can read the
//      metadata without importing React components.
// ============================================================================

import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import type { ReportMeta } from "@/lib/reports"
import { EightStocksReport } from "./eight-stocks/report"
import { DeepTimePainReport } from "./deep-time-pain/report"

export const REPORT_COMPONENTS: Record<string, (p: { locale: Locale; meta: ReportMeta }) => ReactNode> = {
  "eight-stocks-twenty-economies": EightStocksReport,
  "deep-time-pain": DeepTimePainReport,
}
