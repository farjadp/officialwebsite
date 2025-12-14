// ============================================================================
// Hardware Source: src/app/(public)/blog/[slug]/page.tsx
// Version: 1.0.0
// Why: Public Blog Detail View (Content + Sharing)
// ============================================================================

import { getPost } from "@/app/actions/posts"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import { ShareButtons } from "@/components/blog/share-buttons"

// Separate component for incremental view count to allow SSG/ISR if needed
// However, for this MVP we can just do it in the Page component or separate action.
// To avoid blocking rendering, we can accept that the view count is updated.
// Actually, updating the DB on GET request is standard for simple hit counters, 
// though technically against GET idempotency. 
// Standard robust way: Client side 'useEffect' calls an API route '/api/views/[id]'.
// I'll stick to a simple DB update here for simplicity.

async function incrementView(id: string) {
    'use server'
    try {
        await prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } }
        })
    } catch (e) {
        // ignore
    }
}

interface BlogPostPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await Promise.resolve(params)
    const post = await getPost(slug)
    if (!post) return { title: 'Post Not Found' }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || undefined,
            images: post.coverImage ? [post.coverImage] : [],
        }
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await Promise.resolve(params)
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    // Increment view count (fire and forget promise)
    incrementView(post.id)

    const shareUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`
        : `https://example.com/blog/${post.slug}`

    return (
        <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-8 text-center bg-transparent">
                <div className="flex justify-center gap-2 mb-4">
                    {post.categories.map(c => (
                        <Badge key={c.id} variant="secondary">{c.name}</Badge>
                    ))}
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4 dark:text-white">
                    {post.title}
                </h1>

                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 space-x-4">
                    <time dateTime={post.createdAt.toISOString()}>
                        {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </time>
                    {post.readingTime && (
                        <>
                            <span>&middot;</span>
                            <span>{post.readingTime} min read</span>
                        </>
                    )}
                </div>
            </header>

            {post.coverImage && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg aspect-video relative">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none mx-auto mb-12">
                <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </div>

            <div className="flex flex-wrap gap-2 mb-12 border-t pt-8">
                <span className="font-semibold mr-2 align-middle my-auto">Tags:</span>
                {post.tags.map(t => (
                    <Badge key={t.id} variant="outline" className="text-sm">
                        #{t.name}
                    </Badge>
                ))}
            </div>

            <div className="border-t border-b py-8 my-8">
                <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                <ShareButtons title={post.title} slug={post.slug} />
            </div>
        </article>
    )
}
