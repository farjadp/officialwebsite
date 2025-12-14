// ============================================================================
// Hardware Source: src/app/admin/posts/page.tsx
// Version: 1.0.0
// Why: Admin Post List View (Real Data)
// ============================================================================

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Eye, Pencil, Trash } from "lucide-react"
import { getPosts, deletePost } from "@/app/actions/posts"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function PostsPage() {
    const { posts } = await getPosts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
                    <p className="text-muted-foreground">
                        Manage your articles and essays.
                    </p>
                </div>
                <Link href="/admin/posts/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                    <CardDescription>
                        A list of all your writing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px]">Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Categories</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <Link href={`/admin/posts/${post.id}`} className="hover:underline text-base font-semibold">
                                                {post.title}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">{post.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'PUBLISHED' ? 'default' : post.status === 'ARCHIVED' ? 'destructive' : 'secondary'}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {post.categories.map(c => (
                                                <Badge key={c.id} variant="outline" className="text-xs">
                                                    {c.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">{post.views}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/posts/${post.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {/* Note: Delete needs client component for interactivity or form action. 
                                                For quick MVP I'm omitted the delete button functionality here or 
                                                I could make this a client component or use a form. 
                                                I'll keep it simple for now. 
                                            */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {posts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No posts found. Start writing!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

