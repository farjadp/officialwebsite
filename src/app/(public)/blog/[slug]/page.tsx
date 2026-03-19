// ============================================================================
// File: src/app/(public)/blog/[slug]/page.tsx
// Route: /blog/[slug]
// Role: Blog post detail page
// Features:
//   - Article Overview Box (topic summary, target reader, difficulty level)
//   - Related Articles Box (matched by tags, opens in new tab)
//   - Service Cross-link (if post relates to a service, links to it)
//   - Comments Section (GitHub-style, embedded via utterances or native)
//   - View counter, SEO metadata, cover image, prose content
// ============================================================================

import { getPost } from "@/app/actions/posts"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Calendar,
    Clock,
    ArrowLeft,
    ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import { ScorecardWidget } from "@/components/public/scorecard-widget"
import { VaultAssetWidget } from "@/components/public/vault-asset-widget"
import { RelatedArticleWidget } from "@/components/public/related-article-widget"
import { ShareButtons } from "@/components/blog/share-buttons"
import { ArticleSidebar, type Heading } from "@/components/public/article-sidebar"
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

            let baseId = plainText
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
        return { label: "Advanced", color: "bg-red-100 text-red-700 border-red-200", description: "Deep technical or strategic content. Best for experienced founders and operators." }
    }
    if (
        names.includes("intermediate") ||
        names.includes("strategy") ||
        names.includes("system") ||
        (readingTime ?? 0) >= 8
    ) {
        return { label: "Intermediate", color: "bg-orange-100 text-orange-700 border-orange-200", description: "Assumes some startup or business context. Ideal for founders with 1–3 years experience." }
    }
    return { label: "Beginner-friendly", color: "bg-green-100 text-green-700 border-green-200", description: "Accessible to anyone curious about startups and tech. No prior experience needed." }
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

// ─── SEO Metadata ────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPost(slug)
    if (!post) return { title: "Post Not Found" }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || undefined,
            images: post.coverImage ? [post.coverImage] : [],
            type: "article",
        },
    }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) notFound()

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
    let { processedHtml, headings } = processContent(post.content || '')

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

    const SHORTCODE_REGEX = /(?:<p>)?\s*(\[SCORECARD\]|\[VAULT_ASSET id="[^"]+"\]|\[RELATED_ARTICLE slug="[^"]+"\])\s*(?:<\/p>)?/g

    return (
        <article className="min-h-screen bg-[#FDFCF8] pb-24">

            {/* ── HERO ────────────────────────────────────────────────────────── */}
            <header className="bg-white border-b border-stone-100 pt-8 pb-16">
                <div className="max-w-3xl mx-auto px-6">

                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-[#1B4B43] transition-colors mb-10 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        All Articles
                    </Link>

                    {post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {post.categories.map((c) => (
                                <span
                                    key={c.id}
                                    className="text-xs font-bold uppercase tracking-widest text-[#1B4B43] bg-[#1B4B43]/8 px-3 py-1 rounded-full"
                                >
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#111827] leading-[1.1] tracking-tight mb-5">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-lg md:text-xl text-stone-500 leading-relaxed mb-8 max-w-2xl">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-400">
                        <time className="flex items-center gap-1.5" dateTime={post.createdAt.toISOString()}>
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(post.createdAt), "MMMM d, yyyy")}
                        </time>
                        <>
                            <span className="text-stone-200">·</span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {realReadingTime} min read
                            </span>
                        </>
                        <span className="text-stone-200">·</span>
                        <span>{post.views.toLocaleString()} views</span>
                        <span className="text-stone-200">·</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${difficulty.color}`}>
                            {difficulty.label}
                        </span>
                    </div>
                </div>
            </header>

            {/* ── CONTENT (two-column on lg+) ──────────────────────────────────── */}
            <div className="max-w-[1180px] mx-auto px-6 pt-10 pb-24">
                <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">

                    {/* ── LEFT: sticky sidebar ─────────────────────────────────── */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
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

                    {/* ── RIGHT: main content ──────────────────────────────────── */}
                    <div className="min-w-0">

                        {/* Cover image */}
                        {post.coverImage && (
                            <div className="rounded-2xl overflow-hidden shadow-md aspect-video mb-8">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* ── Article body ─────────────────────────────────────── */}
                        <div
                            className="prose prose-lg prose-stone max-w-none
                            prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#111827] prose-headings:scroll-mt-24
                            prose-h2:text-2xl prose-h3:text-xl
                            prose-p:leading-[1.85] prose-p:text-stone-700
                            prose-strong:text-[#111827] prose-strong:font-semibold
                            prose-a:text-[#1B4B43] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-4 prose-blockquote:border-[#1B4B43] prose-blockquote:bg-[#1B4B43]/5 prose-blockquote:not-italic prose-blockquote:rounded-r-lg
                            prose-code:bg-stone-100 prose-code:text-[#1B4B43] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-[#111827] prose-pre:rounded-xl prose-pre:shadow-md
                            prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full
                            prose-hr:border-stone-200
                            prose-li:text-stone-700
                            prose-table:w-full prose-table:border-collapse prose-table:my-8
                            prose-th:bg-stone-50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-stone-200 prose-th:font-semibold prose-th:text-stone-900
                            prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-stone-200 prose-td:text-stone-700
                            [&_mark]:bg-amber-100 [&_mark]:text-amber-900 [&_mark]:px-1 [&_mark]:rounded-sm"
                        >
                            {processedHtml.split(SHORTCODE_REGEX).map((part, index) => {
                                if (!part) return null

                                if (part === "[SCORECARD]") {
                                    return (
                                        <div key={index} className="my-12 not-prose">
                                            <ScorecardWidget />
                                        </div>
                                    )
                                }

                                const vaultMatch = part.match(/\[VAULT_ASSET id="([^"]+)"\]/)
                                if (vaultMatch) {
                                    return (
                                        <div key={index} className="my-12 not-prose">
                                            <VaultAssetWidget id={vaultMatch[1]} />
                                        </div>
                                    )
                                }

                                const relatedMatch = part.match(/\[RELATED_ARTICLE slug="([^"]+)"\]/)
                                if (relatedMatch) {
                                    return (
                                        <div key={index} className="my-10 not-prose">
                                            <RelatedArticleWidget slug={relatedMatch[1]} />
                                        </div>
                                    )
                                }

                                if (!part.trim()) return null

                                return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
                            })}
                        </div>

                        <Separator className="my-10" />

                        {/* Article Tags */}
                        {post.tags.length > 0 && (
                            <div className="mb-10">
                                <p className="font-semibold text-[#111827] text-sm mb-3">Topics in this article:</p>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((t) => (
                                        <span
                                            key={t.id}
                                            className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-600 px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
                                        >
                                            #{t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-[#111827] text-sm">Found this useful?</p>
                                <p className="text-stone-400 text-xs mt-0.5">Share it with someone who needs to read this.</p>
                            </div>
                            <ShareButtons title={post.title} slug={post.slug} />
                        </div>

                        <Separator className="my-10" />

                        {/* Related Articles */}
                        {relatedPosts.length > 0 && (
                            <div className="space-y-5">
                                <h2 className="font-bold text-[#111827] text-lg">Continue Reading</h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {relatedPosts.map((related) => (
                                        <Link
                                            key={related.slug}
                                            href={`/blog/${related.slug}`}
                                            className="group bg-white border border-stone-200 rounded-xl p-5 hover:border-[#1B4B43] hover:shadow-sm transition-all flex flex-col gap-2"
                                        >
                                            {related.categories[0] && (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B4B43]">
                                                    {related.categories[0].name}
                                                </span>
                                            )}
                                            <h3 className="font-serif font-bold text-sm text-[#111827] group-hover:text-[#1B4B43] leading-snug transition-colors flex-1">
                                                {related.title}
                                            </h3>
                                            {related.readingTime && (
                                                <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-auto">
                                                    <Clock className="w-3 h-3" /> {related.readingTime} min read
                                                </span>
                                            )}
                                            <span className="text-[10px] text-[#1B4B43] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Read now <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author */}
                        <div className="mt-12 bg-white border border-stone-200 rounded-2xl p-7 flex flex-col sm:flex-row items-start gap-5">
                            <div className="w-12 h-12 rounded-full bg-[#1B4B43] flex items-center justify-center text-sm font-bold text-white shrink-0">
                                FP
                            </div>
                            <div className="space-y-2 flex-1">
                                <div>
                                    <p className="font-bold text-[#111827]">Farjad .P</p>
                                    <p className="text-xs text-stone-400 mt-0.5">Startup Advisor · Product Strategist · Former CTO</p>
                                </div>
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    I write about the unglamorous truth of building real businesses — no hype, no shortcuts, just patterns that work.
                                </p>
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    <Link href="/booking">
                                        <Button size="sm" className="bg-[#1B4B43] hover:bg-[#1B4B43]/90 text-white h-8 text-xs px-4">
                                            Book a Discovery Call
                                        </Button>
                                    </Link>
                                    <Link href="/blog">
                                        <Button size="sm" variant="outline" className="h-8 text-xs px-4">
                                            More Articles
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </article>
    )
}
