// ============================================================================
// Hardware Source: src/app/(public)/blog/page.tsx
// Version: 1.0.0
// Why: Public Blog List
// ============================================================================

import { getPosts } from "@/app/actions/posts"
import { PostStatus } from "@prisma/client"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
    const { posts } = await getPosts({ status: PostStatus.PUBLISHED })

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
                    Our Blog
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl dark:text-gray-400">
                    Insights, stories, and news from our team.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg dark:bg-gray-800 border dark:border-gray-700">
                        {post.coverImage && (
                            <div className="flex-shrink-0">
                                <Link href={`/blog/${post.slug}`}>
                                    <img className="h-48 w-full object-cover" src={post.coverImage} alt={post.title} />
                                </Link>
                            </div>
                        )}
                        <div className="flex flex-1 flex-col justify-between p-6 bg-white dark:bg-gray-800">
                            <div className="flex-1">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {post.categories.map(c => (
                                        <Badge key={c.id} variant="secondary" className="text-xs">
                                            {c.name}
                                        </Badge>
                                    ))}
                                </div>
                                <Link href={`/blog/${post.slug}`} className="block mt-2">
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</p>
                                    {post.excerpt && (
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
                                    )}
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="sr-only">{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="ml-0 text-sm opacity-75">
                                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                        <time dateTime={post.createdAt.toISOString()}>
                                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                        </time>
                                        <span aria-hidden="true">&middot;</span>
                                        <span>{post.views} views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
