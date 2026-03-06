"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, FileText, CheckCircle2, Loader2, Copy, ChevronDown, ChevronUp, Archive, Search } from "lucide-react"

export default function AIToolsPage() {
    const [vaultTopic, setVaultTopic] = useState("")
    const [audioTopic, setAudioTopic] = useState("")

    const [loading, setLoading] = useState(false)
    const [resultText, setResultText] = useState("")
    const [isCached, setIsCached] = useState(false)
    const [copied, setCopied] = useState(false)

    // Archive state
    const [archives, setArchives] = useState<any[]>([])
    const [loadingArchives, setLoadingArchives] = useState(false)
    const [archiveFilter, setArchiveFilter] = useState<"all" | "vault" | "audio">("all")
    const [archiveSearch, setArchiveSearch] = useState("")
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Load archives
    const fetchArchives = async () => {
        setLoadingArchives(true)
        try {
            const res = await fetch("/api/admin/ai-tools")
            const data = await res.json()
            if (data.success) {
                setArchives(data.assets)
            }
        } catch (error) {
            console.error("Failed to fetch archives", error)
        }
        setLoadingArchives(false)
    }

    useEffect(() => {
        fetchArchives()
    }, [])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(resultText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCopyArchive = async (id: string, content: string) => {
        await navigator.clipboard.writeText(content)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const filteredArchives = useMemo(() => {
        return archives.filter(a => {
            if (archiveFilter !== "all" && a.type !== archiveFilter) return false
            if (archiveSearch.trim() && !a.topic.toLowerCase().includes(archiveSearch.toLowerCase())) return false
            return true
        })
    }, [archives, archiveFilter, archiveSearch])

    const archiveStats = useMemo(() => ({
        total: archives.length,
        vault: archives.filter(a => a.type === "vault").length,
        audio: archives.filter(a => a.type === "audio").length,
    }), [archives])

    const generateContent = async (type: "vault" | "audio", topic: string) => {
        if (!topic) return
        setLoading(true)
        setResultText("")
        setIsCached(false)
        try {
            const res = await fetch("/api/admin/ai-tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promptType: type, inputTopic: topic }),
            })
            const data = await res.json()
            if (data.success) {
                setResultText(data.text)
                setIsCached(data.isCached || false)
                // Refresh archive list in background
                fetchArchives()
            } else {
                setResultText(`Error: ${data.error}`)
            }
        } catch (error) {
            setResultText("Failed to connect to API")
        }
        setLoading(false)
    }

    const [activeTab, setActiveTab] = useState("vault")

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#1B4B43]">AI Content Studio</h1>
                <p className="text-muted-foreground mt-2">
                    Internal tools to generate Lead Magnets and Private Feeds.
                </p>
            </div>

            <Tabs value={activeTab} className="w-full" onValueChange={(val) => {
                setActiveTab(val)
                if (val === "archive") fetchArchives()
            }}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vault" className="gap-2"><FileText className="h-4 w-4" /> The Vault Asset Generator</TabsTrigger>
                    <TabsTrigger value="audio" className="gap-2"><Mic className="h-4 w-4" /> Private Audio Memo Scripter</TabsTrigger>
                    <TabsTrigger value="archive" className="gap-2"><Archive className="h-4 w-4" /> Archive History</TabsTrigger>
                </TabsList>

                <TabsContent value="vault">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vault Asset Generator</CardTitle>
                            <CardDescription>
                                Generates a structured Markdown checklist/audit document for the "Farjad Vault". Focuses on non-technical SME Owners.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g. 50 Tasks You Should Stop Doing Manually"
                                    value={vaultTopic}
                                    onChange={(e) => setVaultTopic(e.target.value)}
                                />
                                <Button disabled={loading || !vaultTopic} onClick={() => generateContent("vault", vaultTopic)} className="bg-[#1B4B43]">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                                    Generate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audio">
                    <Card>
                        <CardHeader>
                            <CardTitle>Audio Memo Scripter</CardTitle>
                            <CardDescription>
                                Transforms confusing tech news into a 3-minute, spoken-word script ready to be recorded for Telegram.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g. OpenAI's new Agent capabilities and what it means for agencies"
                                    value={audioTopic}
                                    onChange={(e) => setAudioTopic(e.target.value)}
                                />
                                <Button disabled={loading || !audioTopic} onClick={() => generateContent("audio", audioTopic)} className="bg-[#1B4B43]">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                                    Generate Script
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="archive" className="space-y-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-[#1B4B43]">Archived Assets</h2>
                            <p className="text-sm text-muted-foreground mt-1">History of all generated lead magnets and scripts.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchArchives} disabled={loadingArchives}>
                            {loadingArchives ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Refresh
                        </Button>
                    </div>

                    {/* Stats bar */}
                    {archives.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg border bg-slate-50 px-4 py-3 text-center">
                                <p className="text-2xl font-bold text-[#1B4B43]">{archiveStats.total}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Total Assets</p>
                            </div>
                            <div className="rounded-lg border bg-slate-50 px-4 py-3 text-center">
                                <p className="text-2xl font-bold text-[#1B4B43]">{archiveStats.vault}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Vault Documents</p>
                            </div>
                            <div className="rounded-lg border bg-slate-50 px-4 py-3 text-center">
                                <p className="text-2xl font-bold text-[#1B4B43]">{archiveStats.audio}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Audio Scripts</p>
                            </div>
                        </div>
                    )}

                    {/* Search + Filter */}
                    {archives.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by topic..."
                                    value={archiveSearch}
                                    onChange={e => setArchiveSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-1.5">
                                {(["all", "vault", "audio"] as const).map(f => (
                                    <Button
                                        key={f}
                                        size="sm"
                                        variant={archiveFilter === f ? "default" : "outline"}
                                        className={archiveFilter === f ? "bg-[#1B4B43] hover:bg-[#1B4B43]/90" : ""}
                                        onClick={() => setArchiveFilter(f)}
                                    >
                                        {f === "all" ? `All (${archiveStats.total})` : f === "vault" ? `Vault (${archiveStats.vault})` : `Audio (${archiveStats.audio})`}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* List */}
                    {loadingArchives && archives.length === 0 ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#1B4B43]" />
                        </div>
                    ) : archives.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No history found. Generate some content first.
                            </CardContent>
                        </Card>
                    ) : filteredArchives.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No results match your search or filter.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredArchives.map((asset, index) => {
                                const isExpanded = expandedIds.has(asset.id)
                                const wordCount = asset.content.trim().split(/\s+/).length
                                const charCount = asset.content.length
                                const isCopied = copiedId === asset.id
                                return (
                                    <Card key={asset.id} className="overflow-hidden">
                                        <CardHeader className="bg-slate-50 border-b py-3 px-5">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                                <div className="space-y-1.5 flex-1 min-w-0">
                                                    {/* Meta row */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-semibold text-stone-400">#{archiveStats.total - index}</span>
                                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${asset.type === 'vault' ? 'bg-[#1B4B43] text-white' : 'bg-amber-100 text-amber-800'}`}>
                                                            {asset.type === "vault" ? <FileText className="h-2.5 w-2.5 mr-1" /> : <Mic className="h-2.5 w-2.5 mr-1" />}
                                                            {asset.type}
                                                        </span>
                                                        <span className="text-xs text-stone-500">
                                                            {new Date(asset.createdAt).toLocaleString("fa-IR", { dateStyle: "medium", timeStyle: "short" })}
                                                        </span>
                                                        <span className="text-xs text-stone-400">·</span>
                                                        <span className="text-xs text-stone-400">{wordCount.toLocaleString()} words</span>
                                                        <span className="text-xs text-stone-400">·</span>
                                                        <span className="text-xs text-stone-400">{charCount.toLocaleString()} chars</span>
                                                    </div>
                                                    {/* Topic */}
                                                    <p className="text-sm font-semibold text-[#111827] leading-snug truncate" title={asset.topic}>
                                                        {asset.topic}
                                                    </p>
                                                    {/* Shortcode (vault only) */}
                                                    {asset.type === "vault" && (
                                                        <p className="text-[10px] font-mono text-stone-400 mt-0.5 truncate">
                                                            [VAULT_ASSET id=&quot;{asset.id}&quot;]
                                                        </p>
                                                    )}
                                                </div>
                                                {/* Actions */}
                                                <div className="flex gap-2 shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-white gap-1.5 text-xs"
                                                        onClick={() => handleCopyArchive(asset.id, asset.content)}
                                                    >
                                                        {isCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                                                        {isCopied ? "Copied!" : "Copy"}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-white gap-1.5 text-xs"
                                                        onClick={() => toggleExpand(asset.id)}
                                                    >
                                                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                                        {isExpanded ? "Collapse" : "Expand"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        {isExpanded && (
                                            <CardContent className="p-0">
                                                <div className="bg-white p-5 max-h-[500px] overflow-y-auto">
                                                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-stone-700">
                                                        {asset.content}
                                                    </pre>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {resultText && (
                <Card className="border-indigo-100 bg-slate-50 relative mt-8">
                    <CardContent className="pt-6">
                        <div className="absolute top-4 left-6 flex items-center gap-4">
                            {isCached && (
                                <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 ring-1 ring-inset ring-stone-500/10">
                                    Loaded from Archive
                                </span>
                            )}
                        </div>
                        <Button variant="outline" size="sm" className="absolute top-4 right-4 gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50" onClick={handleCopy}>
                            {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied!" : "Copy Markdown"}
                        </Button>
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono mt-8">
                            {resultText}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
