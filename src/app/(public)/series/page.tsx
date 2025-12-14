import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Layers, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function SeriesIndexPage() {
    const series = [
        {
            name: "Founder Psychology",
            slug: "founder-psychology",
            posts: 8,
            desc: "Managing your own mind while managing a company.",
            status: "Completed"
        },
        {
            name: "The Immigrant Playbook",
            slug: "immigrant-playbook",
            posts: 12,
            desc: "Tactical advice for building in a new country.",
            status: "Ongoing"
        },
        {
            name: "Zero to One Labs",
            slug: "zero-to-one",
            posts: 4,
            desc: "Experiments in product market fit.",
            status: "Ongoing"
        },
    ]

    return (
        <div className="container py-12 md:py-24 mx-auto px-4 min-h-[80vh]">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Series</h1>
                <p className="text-xl text-muted-foreground">
                    Structured collections for deep learning.
                </p>
            </div>

            <div className="grid gap-8 max-w-4xl mx-auto">
                {series.map((item) => (
                    <Link key={item.slug} href={`/series/${item.slug}`} className="group block">
                        <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                            <div className="md:flex">
                                <div className="p-8 md:w-3/4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-5 h-5 text-primary" />
                                        <Badge variant="outline">{item.status}</Badge>
                                    </div>
                                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{item.name}</h2>
                                    <p className="text-muted-foreground text-lg">{item.desc}</p>
                                    <div className="flex items-center text-sm font-medium pt-2 text-muted-foreground group-hover:text-primary transition-colors">
                                        Read {item.posts} Essays <ArrowRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                                {/* Visual placeholder for cover image */}
                                <div className="hidden md:block w-1/4 bg-slate-100 dark:bg-slate-800 border-l" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
