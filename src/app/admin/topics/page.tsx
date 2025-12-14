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
import { CreateTopicDialog } from "@/components/admin/create-topic-dialog"
import { prisma } from "@/lib/prisma"

// Mock data fallback if DB fails
const MOCK_TOPICS = [
    { id: '1', name: 'Startups', slug: 'startups', description: 'Building the future', count: 12 },
    { id: '2', name: 'Immigration', slug: 'immigration', description: 'Moving with purpose', count: 8 },
]

export default async function TopicsPage() {
    let topics = []
    try {
        // Temporarily bypass DB until connection is live to avoid crash
        // topics = await prisma.topic.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { posts: true } } } }) 
        topics = MOCK_TOPICS
    } catch (e) {
        console.error("DB Error", e)
        topics = MOCK_TOPICS
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Topics</h2>
                    <p className="text-muted-foreground">
                        Manage the taxonomy of your content hub.
                    </p>
                </div>
                <CreateTopicDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Topics</CardTitle>
                    <CardDescription>
                        A list of all topics currently in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Posts</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topics.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">No topics found.</TableCell>
                                </TableRow>
                            ) : (
                                topics.map((topic) => (
                                    <TableRow key={topic.id}>
                                        <TableCell className="font-medium">{topic.name}</TableCell>
                                        <TableCell>{topic.slug}</TableCell>
                                        <TableCell className="text-muted-foreground truncate max-w-[300px]">
                                            {topic.description}
                                        </TableCell>
                                        <TableCell className="text-right">{(topic as any).count ?? (topic as any)._count?.posts ?? 0}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
