import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Metadata } from "next"

// Mock Data fetching/generating for Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    // const { slug } = await params
    // Fetch post data...
    const post = {
        title: "Why \"Passion\" is a Dangerous Metric for Founders",
        description: "We are taught to follow our passion, but in the trenches of a startup, discipline allows you to survive."
    }

    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
        }
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    // const { slug } = await params
    // const post = await prisma.post.findUnique(...)

    // Mock Data
    const post = {
        title: "Why \"Passion\" is a Dangerous Metric for Founders",
        subtitle: "We are taught to follow our passion, but in the trenches of a startup, discipline and customer obsession outlast raw emotion every time.",
        date: "Nov 20, 2023",
        readingTime: "8 min read",
        topic: "Psychology",
        content: `
        <p>There is a myth that permeates the startup ecosystem: that passion is the fuel that will carry you through the dark valley of death. Investors ask about it, co-founders bond over it, and we measure our own worthiness by the intensity of our feelings.</p>
        <p>But having built three companies over the last decade, I have come to a different conclusion. Passion is a match. It burns bright, it starts the fire, but it burns out quickly. Discipline is the log that keeps the fire burning through the cold night.</p>
        <h2>The Passion Trap</h2>
        <p>When you optimize for passion, you make decisions based on what feels exciting in the moment. You build features because they are cool, not because they solve a painful problem. You hire people who vibe with you, not necessarily those who challenge you.</p>
        <ul>
            <li>Passion fluctuates with your mood.</li>
            <li>Passion is fragile in the face of rejection.</li>
            <li>Passion can blind you to market reality.</li>
        </ul>
        <p>Real work is boring. It is answering support tickets at 11 PM. It is fixing the same bug for the third time. It is cold emailing 100 prospects and getting 99 rejections. Passion doesn't help you there. Habit does. System does. Duty does.</p>
        <blockquote>"Amateurs sit and wait for inspiration, the rest of us just get up and go to work." — Stephen King</blockquote>
        <h2>Build a System for The Bad Days</h2>
        <p>If you only work when you feel passionate, you will lose to the person who works every single day regardless of how they feel. This is the core of "Anti-fantasy" entrepreneurship.</p>
      `
    }

    return (
        <article className="min-h-screen bg-background pb-20">
            {/* Header / Meta */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b py-16">
                <div className="container px-4 mx-auto max-w-3xl space-y-6">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>

                    <div className="flex gap-2 items-center">
                        <Badge variant="secondary" className="rounded-full px-3 py-1 font-normal bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                            {post.topic}
                        </Badge>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {post.subtitle}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {post.readingTime}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 mx-auto max-w-3xl py-12">
                <div
                    className="prose prose-lg dark:prose-invert prose-stone max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:leading-relaxed prose-img:rounded-xl prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <Separator className="my-12" />

                {/* Author / CTA */}
                <div className="bg-primary/5 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        {/* <Image src="/avatar.jpg" fill alt="Author" /> */}
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">F</div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg">Written by Farjad</h3>
                        <p className="text-muted-foreground">
                            I write about building real businesses and the psychology of founders.
                            If you enjoyed this, join my weekly newsletter.
                        </p>
                        <div className="pt-2">
                            <Button>Subscribe for Updates</Button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
