import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Download, ExternalLink, FileText } from "lucide-react"

export default function ToolsPage() {
    const tools = [
        {
            name: "Founder's Mental Health Checklist",
            type: "PDF Guide",
            desc: "A weekly self-assessment to prevent burnout before it starts.",
            action: "Download",
            icon: FileText
        },
        {
            name: "Idea Validation Framework",
            type: "Notion Template",
            desc: "The exact system I use to vet new business ideas in 48 hours.",
            action: "Get Template",
            icon: ExternalLink
        },
        {
            name: "Co-Founder Agreement Draft",
            type: "Legal Doc",
            desc: "A plain-english starting point for tough conversations.",
            action: "Download",
            icon: Download
        }
    ]

    return (
        <div className="container py-12 md:py-24 mx-auto px-4 min-h-[80vh]">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Tools & Frameworks</h1>
                <p className="text-xl text-muted-foreground">
                    Practical resources to help you build better.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <Card key={tool.name} className="flex flex-col">
                        <CardHeader>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <tool.icon className="h-5 w-5" />
                            </div>
                            <CardTitle>{tool.name}</CardTitle>
                            <CardDescription>{tool.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{tool.desc}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                {tool.action}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
