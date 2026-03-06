"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, FileText, CheckCircle2, Loader2, Copy } from "lucide-react"

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

    const handleCopy = async () => {
        await navigator.clipboard.writeText(resultText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

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

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#1B4B43]">AI Content Studio</h1>
                <p className="text-muted-foreground mt-2">
                    Internal tools to generate Lead Magnets and Private Feeds.
                </p>
            </div>

            <Tabs defaultValue="vault" className="w-full" onValueChange={(val) => {
                if (val === "archive") fetchArchives()
            }}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vault" className="gap-2"><FileText className="h-4 w-4" /> The Vault Asset Generator</TabsTrigger>
                    <TabsTrigger value="audio" className="gap-2"><Mic className="h-4 w-4" /> Private Audio Memo Scripter</TabsTrigger>
                    <TabsTrigger value="archive" className="gap-2"><FileText className="h-4 w-4" /> Archive History</TabsTrigger>
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

                <TabsContent value="archive" className="space-y-6">
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
                    ) : (
                        <div className="grid gap-6">
                            {archives.map((asset) => (
                                <Card key={asset.id} className="overflow-hidden">
                                    <CardHeader className="bg-slate-50 border-b pb-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${asset.type === 'vault' ? 'bg-[#1B4B43] text-white' : 'bg-stone-200 text-stone-700'}`}>
                                                        {asset.type}
                                                    </span>
                                                    <span className="text-xs font-mono text-stone-500 bg-white border px-1.5 py-0.5 rounded">
                                                        ID: {asset.id}
                                                    </span>
                                                    <span className="text-xs text-stone-500 font-medium">
                                                        {new Date(asset.createdAt).toLocaleString("fa-IR", { dateStyle: "long", timeStyle: "short" })}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-base leading-tight pt-1 text-[#111827]">Topic / Prompt: {asset.topic}</CardTitle>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="shrink-0 bg-white"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(asset.content)
                                                }}
                                            >
                                                <Copy className="h-4 w-4 mr-2" /> Copy Content
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="bg-white p-6 max-h-[400px] overflow-y-auto">
                                            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-stone-700">
                                                {asset.content}
                                            </pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
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
