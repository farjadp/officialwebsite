// ============================================================================
// File Path: src/app/(public)/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: The English home, v3 "Light". The page itself is shared with the
//      Persian home (components/home/v3) so the two cannot drift apart;
//      this file only supplies metadata and the latest posts.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { prisma } from "@/lib/prisma"
import { HomeV3, type HomePost } from "@/components/home/v3/home-v3"

export const metadata: Metadata = {
  alternates: localeAlternates("/", "en"),
  title: "Farjad | AI Strategist, Startup Mentor & Business Coach",
  description:
    "AI strategy that earns its place, startup mentorship from idea to paying customers, and calm, direct coaching for founders. 22+ years building companies in Iran and Canada.",
}

export const revalidate = 60

async function getLatestPosts(): Promise<HomePost[]> {
  const timeout = new Promise<HomePost[]>((resolve) => setTimeout(() => resolve([]), 3000))
  const query = prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        readingTime: true,
        categories: { select: { name: true }, take: 1 },
      },
    })
    .catch((error: unknown) => {
      console.error("[home] latest posts failed", error)
      return [] as HomePost[]
    })

  return Promise.race([query, timeout])
}

export default async function HomePage() {
  const posts = await getLatestPosts()
  return <HomeV3 locale="en" posts={posts} />
}
