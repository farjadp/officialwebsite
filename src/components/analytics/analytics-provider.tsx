"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

// This is a placeholder for PostHog or Plausible
// You would typically wrap your app with a provider or use a useEffect to track pageviews

function AnalyticsTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Example: window.plausible('pageview')
        // or posthog.capture('$pageview')
        console.log(`Analytics: Pageview ${pathname}`)
    }, [pathname, searchParams])

    return null
}

export function AnalyticsProvider() {
    return (
        <Suspense fallback={null}>
            <AnalyticsTracker />
        </Suspense>
    )
}
