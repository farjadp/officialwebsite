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
import { CreateSeriesSheet } from "@/components/admin/create-series-sheet"

const MOCK_SERIES = [
    { id: '1', name: 'Founder Psychology', slug: 'founder-psych', status: 'Active', count: 4 },
    { id: '2', name: 'Immigration 101', slug: 'immigration-101', status: 'Draft', count: 0 },
]

export default function SeriesPage() {
    // const series = await prisma.series.findMany(...)
    const series = MOCK_SERIES

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Series</h2>
                    <p className="text-muted-foreground">
                        Manage long-form structured content collections.
                    </p>
                </div>
                <CreateSeriesSheet />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Series</CardTitle>
                    <CardDescription>
                        Ordered lists of posts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Posts</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {series.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.slug}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell className="text-right">{item.count}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
