// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: React Server Component
// ============================================================================

import { getPosts } from "@/app/actions/posts"
import { PostStatus } from "@prisma/client"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
    const { posts } = await getPosts({ status: PostStatus.PUBLISHED })

    const featuredPost = posts.length > 0 ? posts[0] : null;
    const regularPosts = posts.length > 1 ? posts.slice(1) : [];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl mb-6">
                        Insights & Thoughts
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
                        Deep dives into building real businesses, software engineering, and the psychology behind startup survival.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-20">

                {/* Featured Post */}
                {featuredPost && (
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Article</h2>
                        <Link href={`/blog/${featuredPost.slug}`} className="group block">
                            <article className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-3xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
                                {featuredPost.coverImage ? (
                                    <div className="aspect-[4/3] md:aspect-auto md:h-full relative overflow-hidden bg-muted">
                                        <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={featuredPost.coverImage} alt={featuredPost.title} />
                                    </div>
                                ) : (
                                    <div className="aspect-[4/3] md:aspect-auto md:h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <span className="text-slate-400">No Image</span>
                                    </div>
                                )}
                                <div className="p-8 md:p-12 flex flex-col justify-center h-full">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {featuredPost.categories.map(c => (
                                            <Badge key={c.id} variant="secondary" className="rounded-full px-3 py-1 font-normal bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {c.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h3 className="text-3xl font-extrabold mb-4 group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    {featuredPost.excerpt && (
                                        <p className="text-muted-foreground text-lg mb-6 line-clamp-3 leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                                        <time dateTime={featuredPost.createdAt.toISOString()}>
                                            {format(new Date(featuredPost.createdAt), 'MMM d, yyyy')}
                                        </time>
                                        {featuredPost.readingTime && (
                                            <>
                                                <span>&middot;</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" /> {featuredPost.readingTime} min
                                                </div>
                                            </>
                                        )}
                                        <span>&middot;</span>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" /> {featuredPost.views}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </section>
                )}

                {/* Regular Posts Grid */}
                {regularPosts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight mb-8">Latest Articles</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {regularPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                                    <article className="flex flex-col h-full bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
                                        {post.coverImage && (
                                            <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                                                <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={post.coverImage} alt={post.title} />
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-grow p-6">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.categories.map(c => (
                                                    <Badge key={c.id} variant="secondary" className="font-normal">
                                                        {c.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-4 border-t">
                                                <time dateTime={post.createdAt.toISOString()}>
                                                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                                </time>
                                                {post.readingTime && (
                                                    <>
                                                        <span>&middot;</span>
                                                        <span>{post.readingTime} min</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {!featuredPost && regularPosts.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-xl">No posts published yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
