// ============================================================================
// Route: /fa/lab
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/lab.tsx, shared by
//      both locales; this file only supplies metadata and the JSON-LD.
//      Direction comes from the root layout (dir="rtl" on /fa).
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates, SITE_URL } from "@/lib/seo"
import type { Metadata } from "next"
import { LabPage } from "@/components/v3/pages/lab"

export const metadata: Metadata = {
    alternates: localeAlternates("/lab", "fa"),
  title: "Founder Development Lab | فرجاد پورمحمد",
  description:
    "۸ هفته کار واقعی روی استارتاپ شما — ۵ تیم، رایگان. از ایده تا شواهد، با منتورشیپ مستقیم فرجاد پورمحمد.",
  openGraph: {
    title: "Founder Development Lab — از ایده تا شواهد",
    description:
      "۸ هفته، ۵ تیم، رایگان. هر هفته روی مسئله‌ی واقعی استارتاپ شما کار می‌کنیم.",
    images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "Founder Development Lab" }],
  },
}

export default function FounderLabPage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Founder Development Lab",
    description:
      "برنامه ۸ هفته‌ای منتورشیپ برای فاندرها و تیم‌های بسیار اولیه — از ایده تا شواهد.",
    provider: {
      "@type": "Person",
      name: "Farjad Pourmohammad",
      url: `${SITE_URL}/fa/lab`,
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
      <LabPage locale="fa" />
    </>
  )
}
