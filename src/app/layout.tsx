// ============================================================================
// Hardware Source: layout.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Routing layout constraint
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
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
  metadataBase: new URL("https://farjadp.info"), // Update to actual production domain
  title: {
    template: "%s | Farjad .P",
    default: "Farjad .P — Startup Advisor & Systems Architect",
  },
  description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
  alternates: {
    canonical: "https://farjadp.info",
    languages: {
      "fa": "https://farjadp.info/fa",
      "en": "https://farjadp.info",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://farjadp.info",
    siteName: "Farjad .P",
    title: "Farjad .P — Startup Advisor & Systems Architect",
    description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Farjad .P — Startup Advisor & Systems Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farjad .P — Startup Advisor & Systems Architect",
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
    "name": "Farjad .P",
    "url": "https://farjadp.info",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://farjadp.info/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Farjad Pourmohammad",
    "jobTitle": "Startup Advisor & Systems Architect",
    "description": "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
    "url": "https://farjadp.info",
    "image": "https://farjadp.info/images/og-default.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Toronto",
      "addressCountry": "CA"
    },
    "knowsLanguage": ["en", "fa"],
    "sameAs": [
      "https://farjadp.info",
      "https://farjadp.info/about"
    ]
  };

  return (
    <html lang={locale} dir={dir}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", GeistSans.variable, GeistMono.variable)}>
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
