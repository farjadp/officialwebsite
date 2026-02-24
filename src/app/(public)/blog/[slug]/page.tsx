// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: Server Action / Module
// ============================================================================

import { getPost } from "@/app/actions/posts"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"

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
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug)
    if (!post) return { title: 'Post Not Found' }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || undefined,
            images: post.coverImage ? [post.coverImage] : [],
            type: 'article',
        }
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    // Increment view count (fire and forget promise)
    incrementView(post.id)

    return (
        <article className="min-h-screen bg-background pb-20">
            {/* Header / Meta */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b py-16">
                <div className="container px-4 mx-auto max-w-3xl space-y-6">
                    <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Link>

                    <div className="flex flex-wrap gap-2 items-center">
                        {post.categories.map(c => (
                            <Badge key={c.id} variant="secondary" className="rounded-full px-3 py-1 font-normal bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                                {c.name}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.createdAt.toISOString()}>
                                {format(new Date(post.createdAt), 'MMM d, yyyy')}
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

            {/* Main Content */}
            <div className="container px-4 mx-auto max-w-3xl py-12">
                {post.coverImage && (
                    <div className="mb-12 rounded-xl overflow-hidden shadow-lg aspect-video relative">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg dark:prose-invert prose-stone max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight 
                    prose-p:leading-relaxed prose-img:rounded-xl prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />

                <div className="flex flex-wrap gap-2 mt-12 mb-6">
                    {post.tags.map(t => (
                        <Badge key={t.id} variant="outline" className="text-sm">
                            #{t.name}
                        </Badge>
                    ))}
                </div>

                <Separator className="my-12" />

                {/* Author / CTA */}
                <div className="bg-primary/5 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">FA</div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Written by Farjad</h3>
                        <p className="text-muted-foreground">
                            Insights, stories, and deep dives into everything we build.
                            If you enjoyed this article, check out our other posts.
                        </p>
                        <div className="pt-2">
                            <Link href="/blog">
                                <Button>Read more articles</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
