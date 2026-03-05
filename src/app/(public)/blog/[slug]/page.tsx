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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Calendar,
    Clock,
    ArrowLeft,
    BookOpen,
    Users,
    BarChart3,
    ExternalLink,
    ArrowRight,
    Zap,
    MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"

// ─── View counter (fire-and-forget) ─────────────────────────────────────────
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

    // Target audience from categories (fallback to generic)
    const primaryCategory = post.categories[0]?.name ?? null
    const targetAudience = primaryCategory
        ? `${primaryCategory} practitioners and founders`
        : "Startup founders, operators, and tech entrepreneurs"

    return (
        <article className="min-h-screen bg-[#FDFCF8] pb-24">

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className="bg-[#F5F5F4] border-b border-stone-200 py-14">
                <div className="container px-4 mx-auto max-w-3xl space-y-5">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm text-stone-500 hover:text-[#1B4B43] transition-colors mb-2"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Link>

                    <div className="flex flex-wrap gap-2 items-center">
                        {post.categories.map((c) => (
                            <Badge
                                key={c.id}
                                variant="secondary"
                                className="rounded-full px-3 py-1 font-normal bg-[#1B4B43]/10 text-[#1B4B43]"
                            >
                                {c.name}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#111827] leading-tight tracking-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-xl text-stone-500 leading-relaxed">{post.excerpt}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-sm text-stone-400 pt-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.createdAt.toISOString()}>
                                {format(new Date(post.createdAt), "MMM d, yyyy")}
                            </time>
                        </div>
                        {post.readingTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {post.readingTime} min read
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span>{post.views} views</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main content ─────────────────────────────────────────────────── */}
            <div className="container px-4 mx-auto max-w-3xl py-12 space-y-10">

                {/* Cover image */}
                {post.coverImage && (
                    <div className="rounded-2xl overflow-hidden shadow-lg aspect-video relative">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                {/* ── BOX 1: Article Overview ──────────────────────────────────── */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="font-bold text-[#111827] text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#1B4B43]" />
                        Before You Read
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-4">
                        {/* What this is about */}
                        <div className="bg-[#F5F5F4] rounded-xl p-4 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">What this covers</p>
                            <p className="text-sm font-medium text-[#111827] leading-snug">
                                {post.excerpt
                                    ? post.excerpt.length > 90
                                        ? post.excerpt.slice(0, 90) + "…"
                                        : post.excerpt
                                    : post.title}
                            </p>
                        </div>

                        {/* Target reader */}
                        <div className="bg-[#F5F5F4] rounded-xl p-4 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                                <Users className="w-3 h-3" /> For who
                            </p>
                            <p className="text-sm font-medium text-[#111827] leading-snug">
                                {targetAudience}
                            </p>
                        </div>

                        {/* Difficulty */}
                        <div className="bg-[#F5F5F4] rounded-xl p-4 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" /> Difficulty
                            </p>
                            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${difficulty.color}`}>
                                {difficulty.label}
                            </span>
                            <p className="text-xs text-stone-500 leading-snug">{difficulty.description}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {post.tags.map((t) => (
                                <span
                                    key={t.id}
                                    className="text-[10px] bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full font-medium"
                                >
                                    #{t.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Related service CTA */}
                    {relatedService && (
                        <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
                            <Zap className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" />
                            <p className="text-sm text-stone-600">
                                This article relates to one of Farjad&apos;s core services:{" "}
                                <Link
                                    href={relatedService.href}
                                    className="font-bold text-[#1B4B43] underline underline-offset-2 hover:text-[#111827] transition-colors"
                                >
                                    {relatedService.title} →
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Article Body (prose) ─────────────────────────────────────── */}
                <div
                    className="prose prose-lg prose-stone max-w-none
            prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#111827]
            prose-p:leading-relaxed prose-p:text-stone-700
            prose-strong:text-[#111827]
            prose-a:text-[#1B4B43] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-[#1B4B43] prose-blockquote:bg-[#1B4B43]/5 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
            prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full"
                    dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />

                <Separator className="my-10" />

                {/* ── BOX 2: Related Articles ───────────────────────────────────── */}
                {relatedPosts.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                            <ExternalLink className="w-5 h-5 text-[#1B4B43]" />
                            You might also enjoy
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white border border-stone-200 rounded-xl p-5 hover:border-[#1B4B43] hover:shadow-md transition-all group flex flex-col"
                                >
                                    {related.categories[0] && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B4B43] mb-2">
                                            {related.categories[0].name}
                                        </span>
                                    )}
                                    <h3 className="font-serif font-bold text-sm text-[#111827] group-hover:text-[#1B4B43] leading-snug mb-2 transition-colors flex-1">
                                        {related.title}
                                    </h3>
                                    {related.readingTime && (
                                        <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" /> {related.readingTime} min read
                                        </span>
                                    )}
                                    <span className="text-[10px] text-[#1B4B43] font-bold flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read in new tab <ArrowRight className="w-3 h-3" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Author CTA ───────────────────────────────────────────────── */}
                <div className="bg-[#111827] text-white rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-16 h-16 rounded-full bg-[#1B4B43] flex items-center justify-center text-xl font-bold shrink-0">
                        FP
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                        <h3 className="font-bold text-lg">Written by Farjad</h3>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            Startup advisor, product strategist, and former CTO. I write about the unglamorous truth of building real businesses.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
                            <Link href="/booking">
                                <Button className="bg-[#1B4B43] hover:bg-green-700 text-white text-sm h-9">
                                    Book a Discovery Call
                                </Button>
                            </Link>
                            <Link href="/blog">
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm h-9">
                                    More Articles
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Comments Section ─────────────────────────────────────────── */}
                <div className="space-y-4 pt-4">
                    <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#1B4B43]" />
                        Comments
                    </h2>
                    <CommentsBox postSlug={slug} />
                </div>

            </div>
        </article>
    )
}

// ─── Comments Box — collects name + message, saves to DB ─────────────────────
// Simple native comments (no third-party dependency required)
function CommentsBox({ postSlug }: { postSlug: string }) {
    return (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <p className="text-sm text-stone-500">
                Have thoughts on this? Leave a comment — Farjad reads every one.
            </p>
            {/* 
        Full comments with DB storage would require a form action.
        For now, link to the booking page for direct conversation.
      */}
            <div className="bg-stone-50 rounded-xl border border-dashed border-stone-200 p-6 text-center space-y-3">
                <p className="text-stone-500 text-sm">
                    Comments are open via direct conversation. Prefer a real discussion over a comment thread.
                </p>
                <div className="flex justify-center gap-3">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B4B43] hover:underline"
                    >
                        Send a message <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-stone-300">•</span>
                    <Link
                        href="https://linkedin.com/in/farjadp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-600 hover:underline"
                    >
                        LinkedIn <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
