// ============================================================================
// Route: /lab
// Version: 3.0.0 — 2026-09-25
// Role: English introduction to the Founder Development Lab (cohort one:
//       Astaneh). The Persian twin is /fa/lab.
// Why:  v3 "Light". The page lives in components/v3/pages/lab.tsx, shared by
//       both locales; this file only supplies metadata and the JSON-LD.
// Note: Every claim mirrors the Persian page. The Telegram poll cards on that
//       page are Persian-channel artefacts and are linked rather than
//       translated, so nothing is put in quotation marks that was not said in
//       that language.
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates, SITE_URL } from "@/lib/seo"
import type { Metadata } from "next"
import { LabPage } from "@/components/v3/pages/lab"

export const metadata: Metadata = {
    alternates: localeAlternates("/lab", "en"),
    title: "Founder Development Lab | Farjad Pourmohammad",
    description:
        "Eight weeks of real work on your startup — five teams, free. From idea to evidence, mentored directly by Farjad Pourmohammad.",
    openGraph: {
        title: "Founder Development Lab — from idea to evidence",
        description: "Eight weeks, five teams, free. Every week we work on your startup's real problem.",
        images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "Founder Development Lab" }],
    },
}

export default function FounderLabPage() {
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Founder Development Lab",
        description:
            "An eight-week mentorship programme for founders and very early teams — from idea to evidence.",
        provider: {
            "@type": "Person",
            name: "Farjad Pourmohammad",
            url: `${SITE_URL}/lab`,
        },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Blended",
            location: "Toronto / Online",
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
            />
            <LabPage locale="en" />
        </>
    )
}
