// ============================================================================
// File Path: src/app/fa/scorecard/page.tsx
// Why: The standalone Business Autonomy Score page. Page chrome in the v3
//      "Light" look so the widget is no longer a card floating on cream.
//
//      NOTE: ScorecardWidget itself is English-only — the quiz copy has no
//      Persian translation, so this route renders English inside /fa.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { NOINDEX } from "@/lib/seo"
import { ScorecardWidget } from "@/components/public/scorecard-widget"
import { V3Page } from "@/components/v3/kit"

export const metadata: Metadata = { robots: NOINDEX }

export default function ScorecardPage() {
    return (
        <V3Page>
            <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-x-clip px-5 py-20 md:px-10">
                <div
                    aria-hidden
                    className="v3-beam pointer-events-none absolute -top-1/4 start-0 -z-10 h-[160%] w-72 bg-linear-to-r from-transparent via-v3-light/[0.06] to-transparent"
                />
                <div className="w-full max-w-3xl">
                    <ScorecardWidget />
                </div>
            </div>
        </V3Page>
    )
}
