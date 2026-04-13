"use client"

// ============================================================================
// Admin: Content Waterfall
// Transmute blog posts into LinkedIn / Telegram / X social posts
// ============================================================================

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Share2,
    Linkedin,
    Send,
    Twitter,
    Copy,
    Check,
    Loader2,
    FileText,
    Sparkles,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
interface WaterfallResult {
    analysis: { core_truth: string; sentiment: string }
    linkedin: { text: string; hook: string }
    telegram: { text: string }
    twitter: { thread: string[] }
}

interface PostOption {
    slug: string
    title: string
}

// ─── Copy button helper ──────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                    Copied
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                </>
            )}
        </Button>
    )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function WaterfallPage() {
    const [posts, setPosts] = useState<PostOption[]>([])
    const [selectedSlug, setSelectedSlug] = useState("")
    const [rawText, setRawText] = useState("")
    const [mode, setMode] = useState<"post" | "text">("post")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<WaterfallResult | null>(null)
    const [error, setError] = useState("")

    // Fetch published posts for the dropdown
    useEffect(() => {
        fetch("/api/admin/posts?status=PUBLISHED")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setPosts(data.map((p: { slug: string; title: string }) => ({ slug: p.slug, title: p.title })))
                }
            })
            .catch(() => {
                // Fallback: try the actions endpoint
            })
    }, [])

    const handleGenerate = async () => {
        setLoading(true)
        setError("")
        setResult(null)

        const payload =
            mode === "post" ? { slug: selectedSlug } : { text: rawText }

        try {
            const res = await fetch("/api/ai/content-waterfall", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const json = await res.json()

            if (!res.ok) {
                setError(json.error || "Generation failed")
                return
            }

            setResult(json.data)
        } catch {
            setError("Network error. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const canGenerate =
        (mode === "post" && selectedSlug) || (mode === "text" && rawText.trim().length > 50)

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Share2 className="h-7 w-7 text-[#1B4B43]" />
                    Content Waterfall
                </h1>
                <p className="text-muted-foreground mt-2">
                    Transform a blog post into platform-native social content for LinkedIn, Telegram, and X.
                </p>
            </div>

            {/* Source Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Source Material
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Mode Toggle */}
                    <div className="flex gap-2">
                        <Button
                            variant={mode === "post" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("post")}
                            className={mode === "post" ? "bg-[#1B4B43] hover:bg-[#1B4B43]/90" : ""}
                        >
                            Select a Post
                        </Button>
                        <Button
                            variant={mode === "text" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("text")}
                            className={mode === "text" ? "bg-[#1B4B43] hover:bg-[#1B4B43]/90" : ""}
                        >
                            Paste Raw Text
                        </Button>
                    </div>

                    {mode === "post" ? (
                        <Select value={selectedSlug} onValueChange={setSelectedSlug}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a published post…" />
                            </SelectTrigger>
                            <SelectContent>
                                {posts.map((p) => (
                                    <SelectItem key={p.slug} value={p.slug}>
                                        {p.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <textarea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Paste your essay here (minimum 50 characters)…"
                            className="w-full min-h-[200px] rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                        />
                    )}

                    <Button
                        onClick={handleGenerate}
                        disabled={!canGenerate || loading}
                        className="bg-[#1B4B43] hover:bg-[#1B4B43]/90 gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Generate Social Posts
                            </>
                        )}
                    </Button>

                    {error && (
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    )}
                </CardContent>
            </Card>

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Analysis Card */}
                    <Card className="border-[#1B4B43]/20">
                        <CardHeader>
                            <CardTitle className="text-base">Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-24 shrink-0 pt-0.5">Core Truth</span>
                                <p className="text-sm">{result.analysis.core_truth}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-24 shrink-0 pt-0.5">Sentiment</span>
                                <p className="text-sm">{result.analysis.sentiment}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* LinkedIn */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                                LinkedIn — The Boardroom
                            </CardTitle>
                            <CopyButton text={result.linkedin.text} />
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 rounded-lg p-4 text-sm whitespace-pre-line leading-relaxed">
                                {result.linkedin.text}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Hook: <em>&ldquo;{result.linkedin.hook}&rdquo;</em>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Telegram */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Send className="h-5 w-5 text-[#229ED9]" />
                                Telegram — The Inner Circle
                            </CardTitle>
                            <CopyButton text={result.telegram.text} />
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 rounded-lg p-4 text-sm whitespace-pre-line leading-relaxed">
                                {result.telegram.text}
                            </div>
                        </CardContent>
                    </Card>

                    {/* X / Twitter */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Twitter className="h-5 w-5 text-black" />
                                X — The Spark
                            </CardTitle>
                            <CopyButton
                                text={result.twitter.thread.join("\n\n---\n\n")}
                            />
                        </CardHeader>
                        <CardContent>
                            {result.twitter.thread.length > 0 ? (
                                <div className="space-y-3">
                                    {result.twitter.thread.map((tweet, i) => (
                                        <div
                                            key={i}
                                            className="bg-slate-50 rounded-lg p-4 text-sm leading-relaxed flex gap-3"
                                        >
                                            <span className="text-xs font-bold text-muted-foreground shrink-0 pt-0.5">
                                                {i + 1}/{result.twitter.thread.length}
                                            </span>
                                            <p className="whitespace-pre-line">{tweet}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    Not enough substance for a Twitter thread — skipped by design.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
