// ============================================================================
// Hardware Source: layout.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Routing layout constraint
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { SITE_URL } from "@/lib/seo"
import { instrumentSans, newsreader } from "@/components/home/v3/fonts"

const danaFont = localFont({
  src: [
    { path: '../../public/fonts/dana/woff2/Dana-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/dana/woff2/Dana-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/dana/woff2/Dana-DemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/dana/woff2/Dana-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/dana/woff2/Dana-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../../public/fonts/dana/woff2/Dana-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-dana',
  display: 'swap',
});
// Admin Layout is handled by /admin/layout.tsx, so we conditional render or just use Group Routes if prefered
// But since this is root layout, we check path or structure folders carefully.
// Actually, Next.js App Router allows multiple Root Layouts if we use Route Groups.
// But for now, let's keep it simple. We will move this to (public)/layout.tsx later if needed.
// For now, checking if it's admin or public in the same layout is messy.
// BEST PRACTICE: Move public pages to (public) group and admin to (admin) group?
// I already have /admin/layout.tsx.
// BUT root layout applies to EVERYTHING.
// So I will make the Root Layout generic (Providers mainly) and create a (public)/layout.tsx for Header/Footer.

// Fonts are imported directly from the geist package

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Farjad",
    default: "Farjad — AI Strategist, Startup Mentor & Business Coach",
  },
  description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
  // NOTE: deliberately NO `alternates` here — neither canonical nor languages.
  // Next.js hands the root layout's `alternates` to every page that does not
  // export its own, so anything set here is a claim made on behalf of all 212
  // URLs. A canonical here told every page it was the homepage; a `languages`
  // map here told every page its translations were the homepage. Pages declare
  // their own via localeAlternates()/canonicalOnly() from @/lib/seo, and a page
  // with no metadata correctly emits nothing (search engines self-canonicalise).
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Farjad",
    title: "Farjad — AI Strategist, Startup Mentor & Business Coach",
    description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Farjad — AI Strategist, Startup Mentor & Business Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farjad — AI Strategist, Startup Mentor & Business Coach",
    description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
    images: ["/images/og-default.png"],
  },
};

import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import SystemLogClient from "@/components/system-log-client"
import { headers } from "next/headers"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";
  const dir = locale === "fa" ? "rtl" : "ltr";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Farjad",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // The entity behind this site is a person, not a registered company, so there
  // is deliberately no Organization node. `sameAs` is what actually connects
  // this page to the knowledge graph — it previously listed only this domain,
  // which links the entity to nothing.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    "name": "Farjad Pourmohammad",
    "alternateName": "\u0641\u0631\u062c\u0627\u062f \u067e\u0648\u0631\u0645\u062d\u0645\u062f",
    "jobTitle": "Startup Advisor & Systems Architect",
    "description": "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
    "url": SITE_URL,
    "image": `${SITE_URL}/images/og-default.png`,
    "email": "mailto:contact@farjadp.info",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Newmarket",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    "areaServed": [
      { "@type": "Country", "name": "Canada" },
      { "@type": "Country", "name": "Iran" }
    ],
    "knowsLanguage": ["en", "fa"],
    "knowsAbout": [
      "Startup advisory",
      "Technology Readiness Level assessment",
      "Go-to-market strategy",
      "Business model design",
      "AI adoption for small and medium enterprises",
      "Canada Start-up Visa program"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/farjadpourmohammad/",
      "https://github.com/Farjadp",
      "https://youtube.com/@FarjadTalks",
      "https://instagram.com/FarjadTalks",
      "https://t.me/FarjadTalks"
    ]
  };

  return (
    <html lang={locale} dir={dir}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", GeistSans.variable, GeistMono.variable, danaFont.variable, newsreader.variable, instrumentSans.variable)}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
        <SystemLogClient />
        <AnalyticsProvider />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
