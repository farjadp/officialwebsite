// ============================================================================
// File Path: src/components/v3/pages/blog-post.tsx
// Why: /blog/[slug] in the v3 "Light" look. English only — the Persian blog
//      was deleted and /fa/blog redirects to this one. Every helper, query and
//      shortcode rule is the v2 page's own, carried over untouched; the post
//      copy is the CMS's. Only the look changed.
//
//      The body HTML comes from the admin editor, so it is styled with
//      Tailwind's typography plugin on a dark ground (prose-invert) plus
//      explicit child selectors for the pieces prose does not reach.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import type { getPost } from "@/app/actions/posts"
import { ScorecardWidget } from "@/components/public/scorecard-widget"
import { VaultAssetWidget } from "@/components/public/vault-asset-widget"
import { RelatedArticleWidget } from "@/components/public/related-article-widget"
import { ShareButtons } from "@/components/blog/share-buttons"
import { ArticleSidebar, type Heading } from "@/components/public/article-sidebar"
import { ToolPromoWidget } from "@/components/public/tool-promo-widget"
import { ArticleCtaCard } from "@/components/blog/article-cta-card"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { Chip, Headline, Parallax, Reveal, V3Button, V3Page } from "@/components/v3/kit"

export type BlogPostView = NonNullable<Awaited<ReturnType<typeof getPost>>>

// ─── Real reading time from content ──────────────────────────────────────────
function calculateReadingTime(html: string): number {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const words = text.split(' ').filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
}

// ─── Parse headings + inject IDs for TOC ─────────────────────────────────────
function processContent(html: string): { processedHtml: string; headings: Heading[] } {
    // 1. Remove <h1> tags entirely (they shouldn't be in the body, the title is in the header)
    let cleanHtml = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/gi, '')

    // 2. Remove leading images (possibly wrapped in <p> tags) that appear at the very beginning
    cleanHtml = cleanHtml.replace(/^(?:\s*<p>\s*<img[^>]+>\s*<\/p>\s*)+/i, '')
    cleanHtml = cleanHtml.replace(/^(?:\s*<img[^>]+>\s*)+/i, '')

    const headings: Heading[] = []
    const usedIds = new Set<string>()

    const processedHtml = cleanHtml.replace(
        /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
        (match, tag, attrs, content) => {
            if (/\bid=/i.test(attrs)) return match
            const level = parseInt(tag[1])
            const plainText = content.replace(/<[^>]+>/g, '').trim()
            if (!plainText) return match

            const baseId = plainText
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .slice(0, 60)

            let id = baseId
            let n = 1
            while (usedIds.has(id)) id = `${baseId}-${n++}`
            usedIds.add(id)
            headings.push({ id, text: plainText, level })
            return `<${tag}${attrs} id="${id}">${content}</${tag}>`
        }
    )

    return { processedHtml, headings }
}

// ─── View counter (fire-and-forget) ──────────────────────────────────────────
async function incrementView(id: string) {
    "use server"
    try {
        await prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } },
        })
    } catch {
        // ignore
    }
}

// ─── Service keyword map — detect if post is related to a service ────────────
const SERVICE_MAP = [
    {
        id: "founder-advisory",
        title: "Strategic Advisory & 0-to-1 Launch",
        href: "/services#founder-advisory",
        keywords: ["advisory", "strategy", "gtm", "go-to-market", "fundraising", "investor", "pitch", "launch", "build", "architecture", "architecture"],
    },
    {
        id: "digital-systems",
        title: "AI & Custom Systems",
        href: "/services#digital-systems",
        keywords: ["ai", "automation", "digital", "software", "system", "tech", "saas", "product", "mvp", "cto", "workflow", "llm"],
    },
    {
        id: "private-mentorship",
        title: "Private Team Mentorship",
        href: "/services#private-mentorship",
        keywords: ["mentor", "mentorship", "founder", "team", "growth", "learning", "sparring partner", "roadmap"],
    },
]

function detectRelatedService(text: string) {
    const lower = text.toLowerCase()
    for (const service of SERVICE_MAP) {
        if (service.keywords.some((kw) => lower.includes(kw))) {
            return service
        }
    }
    return null
}

// ─── Difficulty detection from categories / tags / reading time ──────────────
// The label copy is the v2 page's; only the colour classes moved to v3 tokens.
function getDifficulty(
    categories: { name: string }[],
    tags: { name: string }[],
    readingTime: number | null
): { label: string; color: string; description: string } {
    const names = [...categories, ...tags].map((t) => t.name.toLowerCase()).join(" ")
    if (
        names.includes("advanced") ||
        names.includes("technical") ||
        names.includes("deep dive") ||
        (readingTime ?? 0) >= 15
    ) {
        return { label: "Advanced", color: "border-v3-light/60 bg-v3-raise text-v3-light", description: "Deep technical or strategic content. Best for experienced founders and operators." }
    }
    if (
        names.includes("intermediate") ||
        names.includes("strategy") ||
        names.includes("system") ||
        (readingTime ?? 0) >= 8
    ) {
        return { label: "Intermediate", color: "border-v3-line bg-v3-raise text-v3-soft", description: "Assumes some startup or business context. Ideal for founders with 1–3 years experience." }
    }
    return { label: "Beginner-friendly", color: "border-v3-line bg-v3-raise text-v3-mute", description: "Accessible to anyone curious about startups and tech. No prior experience needed." }
}

const SHORTCODE_REGEX = /(?:<p>)?\s*(\[SCORECARD\]|\[VAULT_ASSET id="[^"]+"\]|\[RELATED_ARTICLE slug="[^"]+"\])\s*(?:<\/p>)?/g

/**
 * The reading measure. Tailwind Typography on a dark ground, plus explicit
 * child selectors for what the plugin leaves alone (figures, captions, tables,
 * marks). One accent, used only for links, quote rules and inline code.
 */
const PROSE = [
    "prose prose-invert prose-lg max-w-[68ch] text-v3-soft",
    "prose-headings:font-v3-display prose-headings:font-light prose-headings:text-v3-bone prose-headings:tracking-[-0.015em] prose-headings:scroll-mt-28",
    "prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-5 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4",
    "prose-p:text-v3-soft prose-p:leading-[1.85]",
    "prose-strong:text-v3-bone prose-strong:font-semibold",
    "prose-a:text-v3-light prose-a:font-normal prose-a:underline prose-a:decoration-v3-light/40 prose-a:underline-offset-4 hover:prose-a:decoration-v3-light",
    "prose-li:text-v3-soft prose-li:marker:text-v3-mute",
    "prose-blockquote:border-s-2 prose-blockquote:border-v3-light prose-blockquote:bg-v3-raise prose-blockquote:not-italic prose-blockquote:rounded-e-xl prose-blockquote:py-1 prose-blockquote:ps-6 prose-blockquote:pe-5 prose-blockquote:text-v3-bone prose-blockquote:font-normal",
    "prose-code:text-v3-light prose-code:bg-v3-raise prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
    "prose-pre:bg-v3-raise prose-pre:border prose-pre:border-v3-line prose-pre:rounded-xl prose-pre:text-v3-soft",
    "prose-img:rounded-2xl prose-img:border prose-img:border-v3-line prose-img:w-full",
    "prose-hr:border-v3-line",
    "[&_figure]:my-10 [&_figcaption]:mt-3 [&_figcaption]:text-sm [&_figcaption]:text-v3-mute [&_figcaption]:text-center",
    "[&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:text-base",
    "[&_th]:border [&_th]:border-v3-line [&_th]:bg-v3-raise [&_th]:px-4 [&_th]:py-3 [&_th]:text-start [&_th]:font-semibold [&_th]:text-v3-bone",
    "[&_td]:border [&_td]:border-v3-line [&_td]:px-4 [&_td]:py-3 [&_td]:text-v3-soft",
    "[&_mark]:bg-v3-light/20 [&_mark]:text-v3-bone [&_mark]:px-1 [&_mark]:rounded-sm",
].join(" ")

/** A quiet horizontal rule between the blocks that follow the article. */
function Rule({ className }: { className?: string }) {
    return <hr className={`border-v3-line/70 ${className ?? ""}`} />
}

export async function BlogPost({ post }: { post: BlogPostView }) {
    // Fire-and-forget view increment
    incrementView(post.id)

    // Fetch related posts (same tags or categories, exclude self, max 3)
    let relatedPosts: { slug: string; title: string; excerpt: string | null; readingTime: number | null; categories: { name: string }[] }[] = []
    try {
        const tagIds = post.tags.map((t) => t.id)
        const catIds = post.categories.map((c) => c.id)

        relatedPosts = await prisma.post.findMany({
            where: {
                status: "PUBLISHED",
                id: { not: post.id },
                OR: [
                    { tags: { some: { id: { in: tagIds } } } },
                    { categories: { some: { id: { in: catIds } } } },
                ],
            },
            take: 3,
            orderBy: { publishedAt: "desc" },
            select: {
                slug: true,
                title: true,
                excerpt: true,
                readingTime: true,
                categories: { select: { name: true }, take: 1 },
            },
        })
    } catch {
        relatedPosts = []
    }

    // Detect related service from title + categories + tags
    const searchText = [post.title, post.excerpt ?? "", ...post.categories.map((c) => c.name), ...post.tags.map((t) => t.name)].join(" ")
    const relatedService = detectRelatedService(searchText)

    // Compute difficulty
    const difficulty = getDifficulty(post.categories, post.tags, post.readingTime)

    // Target audience
    const primaryCategory = post.categories[0]?.name ?? null
    const targetAudience = primaryCategory
        ? `${primaryCategory} practitioners and founders`
        : "Startup founders, operators, and tech entrepreneurs"

    // Real reading time from content word count
    const realReadingTime = calculateReadingTime(post.content || '')

    // Process content: inject heading IDs + extract TOC list
    const processed = processContent(post.content || '')
    const headings = processed.headings
    let processedHtml = processed.processedHtml

    // Auto-inject a Related Article if the author hasn't manually placed one
    if (!processedHtml.includes('[RELATED_ARTICLE') && relatedPosts.length > 0) {
        // Find all paragraph ends
        const paragraphEndMatches = Array.from(processedHtml.matchAll(/<\/p>/gi))
        // If the article has at least 4 paragraphs, inject it in the middle
        if (paragraphEndMatches.length >= 4) {
            const middleIndex = Math.floor(paragraphEndMatches.length / 2)
            const insertPosition = paragraphEndMatches[middleIndex].index + 4 // +4 for length of </p>
            const autoShortcode = `\n\n<p>[RELATED_ARTICLE slug="${relatedPosts[0].slug}"]</p>\n\n`
            processedHtml =
                processedHtml.slice(0, insertPosition) +
                autoShortcode +
                processedHtml.slice(insertPosition)
        }
    }

    return (
        <V3Page>
            <ReadingProgress />

            <article>
                {/* ── HERO ────────────────────────────────────────────────── */}
                <header className="border-b border-v3-line/70">
                    <div className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-12 md:pt-16">
                        <Reveal immediate className="mb-10">
                            <Link
                                href="/blog"
                                className="group inline-flex min-h-11 items-center gap-2 text-sm text-v3-mute transition-colors hover:text-v3-light"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180" aria-hidden />
                                All Articles
                            </Link>
                        </Reveal>

                        {post.categories.length > 0 && (
                            <Reveal immediate delay={0.06} className="mb-6 flex flex-wrap gap-2">
                                {post.categories.map((c) => (
                                    <Chip key={c.id} className="border-v3-light/40 uppercase tracking-widest text-v3-light">
                                        {c.name}
                                    </Chip>
                                ))}
                            </Reveal>
                        )}

                        <Reveal immediate delay={0.1}>
                            <Headline as="h1" className="max-w-4xl text-4xl md:text-6xl">
                                {post.title}
                            </Headline>
                        </Reveal>

                        {post.excerpt && (
                            <Reveal immediate delay={0.16}>
                                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-v3-soft md:text-xl">
                                    {post.excerpt}
                                </p>
                            </Reveal>
                        )}

                        <Reveal immediate delay={0.22} className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-v3-mute">
                            <time className="inline-flex items-center gap-1.5" dateTime={post.createdAt.toISOString()}>
                                <Calendar className="h-3.5 w-3.5" aria-hidden />
                                {format(new Date(post.createdAt), "MMMM d, yyyy")}
                            </time>
                            <span aria-hidden className="text-v3-line">·</span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" aria-hidden />
                                {realReadingTime} min read
                            </span>
                            <span aria-hidden className="text-v3-line">·</span>
                            <span>{post.views.toLocaleString()} views</span>
                            <span aria-hidden className="text-v3-line">·</span>
                            <span className={`rounded-full border px-3 py-1 text-xs ${difficulty.color}`}>
                                {difficulty.label}
                            </span>
                        </Reveal>
                    </div>
                </header>

                {/* ── CONTENT (two-column on lg+) ─────────────────────────── */}
                <div className="mx-auto w-full max-w-[1180px] px-6 pb-24 pt-12">
                    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-14">

                        {/* ── LEFT: sticky sidebar ──────────────────────────── */}
                        <aside className="hidden lg:block">
                            <div className="v3-under-header sticky">
                                <ArticleSidebar
                                    headings={headings}
                                    excerpt={post.excerpt}
                                    targetAudience={targetAudience}
                                    difficulty={difficulty}
                                    tags={post.tags}
                                    relatedService={relatedService}
                                    postTitle={post.title}
                                    postSlug={post.slug}
                                    realReadingTime={realReadingTime}
                                />
                            </div>
                        </aside>

                        {/* ── RIGHT: main content ───────────────────────────── */}
                        <div className="min-w-0">

                            {/* Cover image */}
                            {post.coverImage && (
                                <Parallax className="mb-12 aspect-video rounded-2xl border border-v3-line">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                    />
                                </Parallax>
                            )}

                            {/* ── Article body ──────────────────────────────── */}
                            <div className={PROSE}>
                                {processedHtml.split(SHORTCODE_REGEX).map((part, index) => {
                                    if (!part) return null

                                    if (part === "[SCORECARD]") {
                                        return (
                                            <div key={index} className="not-prose my-12">
                                                <ScorecardWidget />
                                            </div>
                                        )
                                    }

                                    const vaultMatch = part.match(/\[VAULT_ASSET id="([^"]+)"\]/)
                                    if (vaultMatch) {
                                        return (
                                            <div key={index} className="not-prose my-12">
                                                <VaultAssetWidget id={vaultMatch[1]} />
                                            </div>
                                        )
                                    }

                                    const relatedMatch = part.match(/\[RELATED_ARTICLE slug="([^"]+)"\]/)
                                    if (relatedMatch) {
                                        return (
                                            <div key={index} className="not-prose my-10">
                                                <RelatedArticleWidget slug={relatedMatch[1]} />
                                            </div>
                                        )
                                    }

                                    if (!part.trim()) return null

                                    return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
                                })}
                            </div>

                            <ArticleCtaCard locale="en" />

                            <div className="mb-8 mt-16">
                                <ToolPromoWidget />
                            </div>

                            <Rule className="my-10" />

                            {/* Article Tags */}
                            {post.tags.length > 0 && (
                                <div className="mb-10">
                                    <p className="mb-3 text-sm font-semibold text-v3-bone">Topics in this article:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((t) => (
                                            <Chip key={t.id}>#{t.name}</Chip>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share */}
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-sm font-semibold text-v3-bone">Found this useful?</p>
                                    <p className="mt-0.5 text-xs text-v3-mute">Share it with someone who needs to read this.</p>
                                </div>
                                <ShareButtons title={post.title} slug={post.slug} />
                            </div>

                            <Rule className="my-10" />

                            {/* Related Articles */}
                            {relatedPosts.length > 0 && (
                                <div className="flex flex-col gap-6">
                                    <Headline as="h2" size="card" className="text-xl">Continue Reading</Headline>
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        {relatedPosts.map((related, i) => (
                                            <Reveal key={related.slug} delay={i * 0.08}>
                                                <Link
                                                    href={`/blog/${related.slug}`}
                                                    className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-v3-line/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise"
                                                >
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            {related.categories[0] && (
                                                                <span className="inline-flex rounded-full border border-v3-line px-2.5 py-1 text-[10px] uppercase tracking-widest text-v3-mute transition-colors group-hover:border-v3-light/50 group-hover:text-v3-light">
                                                                    {related.categories[0].name}
                                                                </span>
                                                            )}
                                                            <ArrowRight className="h-4 w-4 shrink-0 -rotate-45 text-v3-mute transition-all duration-300 group-hover:text-v3-light rtl:rotate-[225deg]" aria-hidden />
                                                        </div>
                                                        <h3 className="font-v3-display text-lg font-light leading-snug text-v3-bone transition-colors group-hover:text-v3-light">
                                                            {related.title}
                                                        </h3>
                                                    </div>

                                                    {related.readingTime && (
                                                        <span className="inline-flex items-center gap-1.5 border-t border-v3-line/70 pt-4 text-xs text-v3-mute">
                                                            <Clock className="h-3.5 w-3.5" aria-hidden />
                                                            {related.readingTime} min read
                                                        </span>
                                                    )}
                                                </Link>
                                            </Reveal>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Author */}
                            <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-v3-line/80 bg-v3-raise p-7 sm:flex-row">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-v3-light/50 font-v3-display text-lg text-v3-light">
                                    F
                                </div>
                                <div className="flex flex-1 flex-col gap-2">
                                    <div>
                                        <p className="font-v3-display text-lg text-v3-bone">Farjad</p>
                                        <p className="mt-0.5 text-xs text-v3-mute">Startup Advisor · Product Strategist · Former CTO</p>
                                    </div>
                                    <p className="text-sm leading-relaxed text-v3-soft">
                                        I write about the unglamorous truth of building real businesses — no hype, no shortcuts, just patterns that work.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <V3Button href="/booking" locale="en" className="px-6 py-3 text-sm">
                                            Book a Discovery Call
                                        </V3Button>
                                        <V3Button href="/blog" variant="secondary" locale="en" className="px-6 py-3 text-sm">
                                            More Articles
                                        </V3Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </article>
        </V3Page>
    )
}
