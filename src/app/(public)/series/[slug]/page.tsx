import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle, ListOrdered, BookOpen } from "lucide-react"
import Link from "next/link"

import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    // const { slug } = await params
    const series = {
        title: "The Founders Psychology",
        description: "A deep dive into the mental models required to build a company."
    }

    return {
        title: `${series.title} | Series`,
        description: series.description,
    }
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
    // Mock Data
    const series = {
        title: "The Founders Psychology",
        description: "A deep dive into the mental models, traps, and emotional resilience required to build a company from scratch without losing your mind.",
        stats: "8 Essays • 45 min read",
        progress: "Open Series",
        chapters: [
            { id: 1, title: "Why Passion is a Dangerous Metric", status: "Read", slug: "passion-metric" },
            { id: 2, title: "The Valley of Death: Surviving Year One", status: "Unread", slug: "valley-of-death" },
            { id: 3, title: "Hiring Your First Employee", status: "Unread", slug: "hiring-first" },
            { id: 4, title: "When to Pivot", status: "Draft", slug: "pivot" }
        ]
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-slate-900 text-white py-20">
                <div className="container px-4 mx-auto max-w-4xl text-center space-y-6">
                    <Badge variant="outline" className="text-slate-300 border-slate-700">Series</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{series.title}</h1>
                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        {series.description}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-400 pt-4">
                        <span className="flex items-center gap-2"><ListOrdered className="h-4 w-4" /> {series.chapters.length} Parts</span>
                        <span>•</span>
                        <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> 45 min total</span>
                    </div>
                </div>
            </div>

            <div className="container px-4 mx-auto max-w-3xl -mt-10 relative z-10">
                <Card className="shadow-xl border-slate-200 dark:border-slate-800">
                    <CardContent className="p-0">
                        {series.chapters.map((chapter, index) => (
                            <div key={chapter.id} className="group flex items-center gap-4 p-6 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex-shrink-0 text-slate-400 font-mono text-sm w-8">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                        <Link href={`/posts/${chapter.slug}`} className="focus:outline-none">
                                            <span className="absolute inset-x-0 inset-y-0" aria-hidden="true" />
                                            {chapter.title}
                                        </Link>
                                    </h3>
                                    {chapter.status === 'Draft' && <span className="text-xs text-amber-600 font-medium">Coming Soon</span>}
                                </div>
                                <div className="flex-shrink-0">
                                    {chapter.status === 'Read' ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground/30" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
