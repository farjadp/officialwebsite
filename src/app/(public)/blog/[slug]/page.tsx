// ============================================================================
// File: src/app/(public)/blog/[slug]/page.tsx
// Route: /blog/[slug]
// Version: 3.0.0 — 2026-09-25
// Role: Blog post detail page. v3 "Light"; the body lives in
//       components/v3/pages/blog-post.tsx. This file keeps the metadata, the
//       lookup, notFound and the BlogPosting JSON-LD.
// Env / Identity: React Server Component
// ============================================================================

import { getPost } from "@/app/actions/posts"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { SITE_URL, canonicalOnly } from "@/lib/seo"
import { BlogPost } from "@/components/v3/pages/blog-post"

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
        // English-only: the Persian blog routes were deleted, so there is no
        // alternate to declare.
        alternates: canonicalOnly(`/blog/${slug}`),
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.seoDescription || "",
        "image": post.coverImage ? [post.coverImage] : [`${SITE_URL}/images/og-default.png`],
        "datePublished": post.createdAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "url": `${SITE_URL}/blog/${post.slug}`,
        "inLanguage": "en",
        "author": {
            "@type": "Person",
            "name": "Farjad Pourmohammad",
            "url": `${SITE_URL}/about`
        },
        "publisher": {
            "@type": "Organization",
            "name": "Farjad",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/images/og-default.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${post.slug}`
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPost post={post} />
        </>
    )
}
