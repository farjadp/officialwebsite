// ============================================================================
// File Path: src/app/(public)/blog/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/blog-index.tsx;
//      this file only supplies metadata and the render mode. English only —
//      the Persian blog was deleted and /fa/blog redirects here.
// Env / Identity: React Server Component
// ============================================================================

import { canonicalOnly } from "@/lib/seo"
import type { Metadata } from "next"
import { BlogIndex } from "@/components/v3/pages/blog-index"

export const metadata: Metadata = {
    alternates: canonicalOnly("/blog"),
    title: "Insights & Thoughts",
    description: "Deep dives into building real businesses, software engineering, and the psychology behind startup survival.",
};

export const dynamic = "force-dynamic"

export default async function BlogPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const searchParams = await props.searchParams;

    return <BlogIndex searchParams={searchParams} />
}
