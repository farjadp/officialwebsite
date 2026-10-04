"use client"

// ============================================================================
// Hardware Source: analytics-provider.tsx
// Version: 2.0.0 — 2026-10-04
// Why: Google Analytics 4 (gtag.js) on public pages
// Env / Identity: Client Component
// ============================================================================

import Script from "next/script"
import { usePathname } from "next/navigation"

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// The admin area and sign-in pages (English and /fa) are Farjad's own traffic;
// counting them would inflate every report. Page changes inside the app are
// picked up by GA4's enhanced measurement (browser history events), so no
// manual page_view calls are needed here.
const EXCLUDED = /^(\/fa)?\/(admin|login)(\/|$)/

export function AnalyticsProvider() {
    const pathname = usePathname()

    if (!GA_ID) return null
    if (pathname && EXCLUDED.test(pathname)) return null

    return (
        <>
            {/* afterInteractive keeps the tag off the critical path for LCP. */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
        </>
    )
}
