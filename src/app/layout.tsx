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
  title: "Content Hub",
  description: "Personal library of deep knowledge.",
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
