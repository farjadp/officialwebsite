"use client"

// ============================================================================
// Hardware Source: lists-manager.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Create lists and AI-assisted dynamic segments
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import Link from "next/link"
import { Plus, Trash2, Loader2, Sparkles, Users, Zap } from "lucide-react"
import { createList, deleteList, countSegment } from "@/lib/actions/email"
import type { SegmentFilter } from "@/lib/email/segment"
import { cn } from "@/lib/utils"

interface ListRow {
    id: string
    name: string
    description: string | null
    color: string
    isDynamic: boolean
    filter: SegmentFilter | null
    memberCount: number
    campaignCount: number
}

const inputClass =
    "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

export function ListsManager({
    lists,
    presets,
}: {
    lists: ListRow[]
    presets: { name: string; description: string; filter: SegmentFilter }[]
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const [isDynamic, setIsDynamic] = useState(false)
    const [filterJson, setFilterJson] = useState("{}")
    const [aiPrompt, setAiPrompt] = useState("")
    const [aiBusy, setAiBusy] = useState(false)
    const [preview, setPreview] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    const describeWithAi = async () => {
        if (!aiPrompt.trim()) return
        setAiBusy(true)
        setError(null)
        try {
            const response = await fetch("/api/email/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: "segment", prompt: aiPrompt }),
            })
            const data = (await response.json()) as { filter?: SegmentFilter; error?: string }
            if (data.error) throw new Error(data.error)
            setFilterJson(JSON.stringify(data.filter ?? {}, null, 2))
        } catch (err) {
            setError(err instanceof Error ? err.message : "AI request failed")
        } finally {
            setAiBusy(false)
        }
    }

    const testFilter = () => {
        setError(null)
        let filter: SegmentFilter
        try {
            filter = JSON.parse(filterJson) as SegmentFilter
        } catch {
            setError("Filter is not valid JSON")
            return
        }
        startTransition(async () => {
            const result = await countSegment(filter)
            if (result.success) setPreview(result.data?.count ?? 0)
            else setError(result.error ?? "Could not evaluate the segment")
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Lists & segments</h1>
                    <p className="text-sm text-slate-500">
                        Static lists hold fixed membership. Dynamic segments recompute on every send.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                    <Plus className="h-4 w-4" />
                    New list
                </button>
            </div>

            {open && (
                <form
                    action={(formData) => {
                        if (isDynamic) formData.set("filter", filterJson)
                        startTransition(async () => {
                            const result = await createList(formData)
                            if (result.success) {
                                setOpen(false)
                                setPreview(null)
                                router.refresh()
                            } else {
                                setError(result.error ?? "Could not create the list")
                            }
                        })
                    }}
                    className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium text-slate-700">Name</span>
                            <input name="name" required placeholder="Founders — Canada" className={inputClass} />
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium text-slate-700">Colour</span>
                            <input name="color" type="color" defaultValue="#7c3aed" className="h-9 w-full rounded-md border border-slate-200 p-1" />
                        </label>
                    </div>

                    <label className="space-y-1.5 block">
                        <span className="text-xs font-medium text-slate-700">Description</span>
                        <input name="description" placeholder="Shown in the public preference centre" className={inputClass} />
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            name="isDynamic"
                            checked={isDynamic}
                            onChange={(event) => setIsDynamic(event.target.checked)}
                            className="h-4 w-4 accent-violet-600"
                        />
                        Dynamic segment — membership is computed from a filter
                    </label>

                    {isDynamic && (
                        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-wrap gap-1.5">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        title={preset.description}
                                        onClick={() => setFilterJson(JSON.stringify(preset.filter, null, 2))}
                                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-violet-400 hover:text-violet-700"
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={aiPrompt}
                                    onChange={(event) => setAiPrompt(event.target.value)}
                                    placeholder="Describe the audience: 'people who clicked in the last 60 days but never bought'"
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={describeWithAi}
                                    disabled={aiBusy}
                                    className="flex shrink-0 items-center gap-1.5 rounded-md bg-violet-600 px-3 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                                >
                                    {aiBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                    Build
                                </button>
                            </div>

                            <textarea
                                value={filterJson}
                                onChange={(event) => setFilterJson(event.target.value)}
                                rows={8}
                                spellCheck={false}
                                className="w-full rounded-md border border-slate-200 bg-white p-3 font-mono text-xs outline-none focus:border-violet-400"
                            />

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={testFilter}
                                    className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400"
                                >
                                    <Users className="h-3.5 w-3.5" />
                                    Preview size
                                </button>
                                {preview !== null && (
                                    <span className="text-sm font-medium text-slate-900">
                                        {preview.toLocaleString()} sendable contacts
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {error && <p className="text-sm text-rose-600">{error}</p>}

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                            {pending ? "Creating…" : "Create list"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {lists.length === 0 && (
                    <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-400">
                        No lists yet. Create one, then import contacts into it.
                    </p>
                )}
                {lists.map((list) => (
                    <div key={list.id} className="rounded-xl border border-slate-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: list.color }} />
                                <h2 className="font-semibold text-slate-900">{list.name}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!window.confirm(`Delete "${list.name}"? Contacts are kept.`)) return
                                    startTransition(async () => {
                                        await deleteList(list.id)
                                        router.refresh()
                                    })
                                }}
                                className="rounded p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {list.description && <p className="mt-1 text-xs text-slate-500">{list.description}</p>}

                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-bold tabular-nums text-slate-900">
                                {list.memberCount.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400">contacts</span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span
                                className={cn(
                                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                    list.isDynamic ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"
                                )}
                            >
                                {list.isDynamic && <Zap className="h-3 w-3" />}
                                {list.isDynamic ? "Dynamic" : "Static"}
                            </span>
                            <span className="text-[11px] text-slate-400">{list.campaignCount} campaigns</span>
                            <Link
                                href={`/admin/newsletter/contacts?list=${list.id}`}
                                className="ml-auto text-xs font-medium text-violet-600 hover:underline"
                            >
                                View contacts
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
