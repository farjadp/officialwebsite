import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Hash } from "lucide-react"
import Link from "next/link"

export const runtime = "edge"

export default function TopicsIndexPage() {
    const topics = [
        { name: "Startups", slug: "startups", count: 12, desc: "Building from zero to one." },
        { name: "Immigration", slug: "immigration", count: 8, desc: "Navigating new worlds." },
        { name: "Psychology", slug: "psychology", count: 15, desc: "Mental models for founders." },
        { name: "Marketing", slug: "marketing", count: 5, desc: "Storytelling and growth." },
        { name: "Journaling", slug: "journaling", count: 3, desc: "The art of reflection." },
    ]

    return (
        <div className="container py-12 md:py-24 mx-auto px-4 min-h-[80vh]">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Topics</h1>
                <p className="text-xl text-muted-foreground">
                    Explore the library by theme.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {topics.map((topic) => (
                    <Link key={topic.slug} href={`/topics/${topic.slug}`} className="group hover:no-underline">
                        <Card className="h-full transition-all group-hover:border-primary/50 group-hover:shadow-md">
                            <CardHeader>
                                <Hash className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                                <CardTitle className="text-2xl group-hover:text-primary transition-colors">{topic.name}</CardTitle>
                                <CardDescription className="text-base">{topic.desc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span className="text-sm font-medium text-muted-foreground">{topic.count} Essays</span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
