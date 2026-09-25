// ============================================================================
// File Path: src/components/public/related-article-widget.tsx
// Version: 2.0.0 — 2026-09-25
// Why: The "recommended reading" block auto-injected into the middle of a
//      post. Restyled for v3 "Light": it sits inside the dark article column,
//      so it is a lit card with one accent, not the old green-on-white panel.
//      Query and props are unchanged.
// Env / Identity: React Server Component
// ============================================================================

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function RelatedArticleWidget({ slug }: { slug: string }) {
    const post = await prisma.post.findUnique({
        where: { slug, status: "PUBLISHED" },
        select: {
            title: true,
            slug: true,
            excerpt: true,
            categories: { select: { name: true }, take: 1 }
        }
    })

    if (!post) return null

    return (
        <aside className="group my-10 rounded-2xl border border-v3-line/80 bg-v3-raise p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-v3-light/60 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-v3-light">Recommended reading</span>
                {post.categories[0] && (
                    <span className="text-v3-mute">· {post.categories[0].name}</span>
                )}
            </div>

            <h3 className="mb-3 font-v3-display text-2xl font-light leading-snug text-v3-bone transition-colors group-hover:text-v3-light">
                {post.title}
            </h3>

            {post.excerpt && (
                <p className="mb-5 max-w-2xl leading-relaxed text-v3-soft">
                    {post.excerpt}
                </p>
            )}

            <Link
                href={`/blog/${post.slug}`}
                className="inline-flex min-h-11 items-center gap-2 font-medium text-v3-light"
            >
                Read article
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
            </Link>
        </aside>
    )
}
