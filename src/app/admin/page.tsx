// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: React Server Component
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Layers, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
    // Analytics Definitions
    const totalPosts = await prisma.post.count()

    const totalSubscribers = await prisma.subscriber.count()

    const totalSeries = await prisma.series.count()

    // Aggregate sum of all views on posts
    const viewsAggregation = await prisma.post.aggregate({
        _sum: { views: true }
    })
    const totalViews = viewsAggregation._sum.views || 0

    // Recent Content (taking the 5 most recent posts regardless of status)
    const recentPosts = await prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: {
            status: { in: ['PUBLISHED', 'SCHEDULED'] }
        },
        include: { series: true }
    })

    // Drafts
    const drafts = await prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { status: 'DRAFT' }
    })

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back to your content hub.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPosts}</div>
                        <p className="text-xs text-muted-foreground">Lifetime</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSubscribers}</div>
                        <p className="text-xs text-muted-foreground">Lifetime</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Series</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSeries}</div>
                        <p className="text-xs text-muted-foreground">Available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews}</div>
                        <p className="text-xs text-muted-foreground">Across all posts</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentPosts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent posts found.</p>
                            ) : (
                                recentPosts.map((post) => (
                                    <div key={post.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{post.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {post.series ? `Series: ${post.series.name}` : "Standalone Post"}
                                            </p>
                                        </div>
                                        <div className={`ml-auto font-medium text-sm ${post.status === 'PUBLISHED' ? 'text-green-600' : 'text-blue-600'}`}>
                                            {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Drafts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {drafts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No drafts pending.</p>
                            ) : (
                                drafts.map((draft) => (
                                    <div key={draft.id} className="flex items-center justify-between">
                                        <p className="text-sm font-medium truncate pr-4">{draft.title}</p>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shrink-0">Draft</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
