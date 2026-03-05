// ============================================================================
// Hardware Source: layout.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Routing layout constraint
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://farjadp.ca"), // Update to actual production domain
  title: {
    template: "%s | Farjad Pourkiani",
    default: "Farjad Pourkiani — Startup Advisor & Systems Architect",
  },
  description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://farjadp.ca",
    siteName: "Farjad Pourkiani",
    title: "Farjad Pourkiani — Startup Advisor & Systems Architect",
    description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farjad Pourkiani — Startup Advisor & Systems Architect",
    description: "I help early-stage founders launch products and SMEs replace manual chaos with AI & digital systems.",
  },
};

import { AnalyticsProvider } from "@/components/analytics/analytics-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
        <AnalyticsProvider />
        <Toaster />
      </body>
    </html>
  );
}
