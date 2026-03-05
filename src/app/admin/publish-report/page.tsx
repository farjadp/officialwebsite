"use client"

// ============================================================================
// Admin: Social Publish Report
// Track auto-publish results for Telegram, Twitter, and LinkedIn
// ============================================================================

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    BarChart3,
    Send,
    Twitter,
    Linkedin,
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Link2,
} from "lucide-react"

interface PublishLog {
    id: string
    postId: string
    postSlug: string
    postTitle: string
    coreTruth: string | null
    sentiment: string | null
    telegramStatus: string
    telegramError: string | null
    telegramText: string | null
    twitterStatus: string
    twitterError: string | null
    twitterText: string | null
    linkedinStatus: string
    linkedinError: string | null
    linkedinText: string | null
    linkedinHook: string | null
    createdAt: string
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
        SUCCESS: { icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200", label: "Success" },
        FAILED: { icon: XCircle, color: "text-red-600 bg-red-50 border-red-200", label: "Failed" },
        PENDING: { icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Pending" },
        SKIPPED: { icon: Clock, color: "text-slate-400 bg-slate-50 border-slate-200", label: "Skipped" },
    }
    const c = config[status] || config.PENDING
    const Icon = c.icon

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.color}`}>
            <Icon className="h-3 w-3" />
            {c.label}
        </span>
    )
}

function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
    )
}

function LogCard({ log }: { log: PublishLog }) {
    const [expanded, setExpanded] = useState(false)
    const date = new Date(log.createdAt)

    return (
        <Card className="transition-all">
            {/* Header row */}
            <CardHeader
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-semibold truncate">
                            {log.postTitle}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            /blog/{log.postSlug} · {date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={log.telegramStatus} />
                        <StatusBadge status={log.twitterStatus} />
                        <StatusBadge status={log.linkedinStatus} />
                        {expanded
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        }
                    </div>
                </div>
            </CardHeader>

            {/* Expanded Details */}
            {expanded && (
                <CardContent className="space-y-4 pt-0">
                    {/* Analysis */}
                    {log.coreTruth && (
                        <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Analysis</p>
                            <p className="text-sm"><span className="font-medium">Core Truth:</span> {log.coreTruth}</p>
                            <p className="text-sm"><span className="font-medium">Sentiment:</span> {log.sentiment}</p>
                        </div>
                    )}

                    {/* Telegram */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Send className="h-4 w-4 text-[#229ED9]" />
                                <span className="text-sm font-medium">Telegram</span>
                                <StatusBadge status={log.telegramStatus} />
                            </div>
                            {log.telegramText && <CopyBtn text={log.telegramText} />}
                        </div>
                        {log.telegramError && (
                            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{log.telegramError}</p>
                        )}
                        {log.telegramText && (
                            <div className="bg-slate-50 rounded-lg p-3 text-sm whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto" dir="rtl">
                                {log.telegramText}
                            </div>
                        )}
                    </div>

                    {/* Twitter */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Twitter className="h-4 w-4 text-black" />
                                <span className="text-sm font-medium">X / Twitter</span>
                                <StatusBadge status={log.twitterStatus} />
                            </div>
                            {log.twitterText && <CopyBtn text={log.twitterText} />}
                        </div>
                        {log.twitterError && (
                            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{log.twitterError}</p>
                        )}
                        {log.twitterText && (
                            <div className="bg-slate-50 rounded-lg p-3 text-sm whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                                {log.twitterText}
                            </div>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                                <span className="text-sm font-medium">LinkedIn</span>
                                <StatusBadge status={log.linkedinStatus} />
                            </div>
                            {log.linkedinText && <CopyBtn text={log.linkedinText} />}
                        </div>
                        {log.linkedinError && (
                            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{log.linkedinError}</p>
                        )}
                        {log.linkedinHook && (
                            <p className="text-xs text-muted-foreground">Hook: <em>&quot;{log.linkedinHook}&quot;</em></p>
                        )}
                        {log.linkedinText && (
                            <div className="bg-slate-50 rounded-lg p-3 text-sm whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                                {log.linkedinText}
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

function LinkedInConnect() {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : ""
    const clientId = "785zxi5h7u7e6v"
    const redirectUri = `${siteUrl}/api/auth/callback/linkedin`
    const scope = "openid profile w_member_social"
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`

    return (
        <a href={authUrl}>
            <Button variant="outline" size="sm" className="gap-2 border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50">
                <Link2 className="h-4 w-4" />
                Connect LinkedIn
            </Button>
        </a>
    )
}

function PublishReportContent() {
    const [logs, setLogs] = useState<PublishLog[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const linkedinResult = searchParams.get("linkedin")
    const linkedinName = searchParams.get("name")
    const linkedinMsg = searchParams.get("msg")

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/publish-logs")
            const data = await res.json()
            if (Array.isArray(data)) setLogs(data)
        } catch { }
        setLoading(false)
    }

    useEffect(() => { fetchLogs() }, [])

    // Stats
    const totalPublishes = logs.length
    const telegramSuccess = logs.filter(l => l.telegramStatus === "SUCCESS").length
    const twitterSuccess = logs.filter(l => l.twitterStatus === "SUCCESS").length
    const linkedinSuccess = logs.filter(l => l.linkedinStatus === "SUCCESS").length
    const failures = logs.filter(l => l.telegramStatus === "FAILED" || l.twitterStatus === "FAILED" || l.linkedinStatus === "FAILED").length

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-8">
            {/* LinkedIn OAuth result banner */}
            {linkedinResult === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    LinkedIn connected successfully as <strong>{linkedinName}</strong>! Posts will now auto-publish to LinkedIn.
                </div>
            )}
            {linkedinResult === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 flex items-center gap-2">
                    <XCircle className="h-5 w-5 shrink-0" />
                    LinkedIn connection failed: {linkedinMsg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-7 w-7 text-[#1B4B43]" />
                        Publish Report
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track auto-publish results across Telegram, X, and LinkedIn.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <LinkedInConnect />
                    <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-2xl font-bold">{totalPublishes}</p>
                        <p className="text-xs text-muted-foreground">Total Publishes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-[#229ED9]">{telegramSuccess}</p>
                        <p className="text-xs text-muted-foreground">Telegram ✅</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-black">{twitterSuccess}</p>
                        <p className="text-xs text-muted-foreground">X / Twitter ✅</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-[#0A66C2]">{linkedinSuccess}</p>
                        <p className="text-xs text-muted-foreground">LinkedIn ✅</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-red-600">{failures}</p>
                        <p className="text-xs text-muted-foreground">Failures ❌</p>
                    </CardContent>
                </Card>
            </div>

            {/* Log List */}
            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading…</div>
            ) : logs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No publish logs yet. Publish a blog post to see results here.
                </div>
            ) : (
                <div className="space-y-3">
                    {logs.map((log) => (
                        <LogCard key={log.id} log={log} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function PublishReportPage() {
    return (
        <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading…</div>}>
            <PublishReportContent />
        </Suspense>
    )
}
