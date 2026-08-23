"use client"

// ============================================================================
// Hardware Source: import-panel.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Four import paths with a shared result summary
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Upload, ClipboardPaste, Database, Loader2, Check, AlertTriangle, Download } from "lucide-react"
import {
    importFile,
    importPastedContacts,
    importSiteContacts,
    listMailchimpAudiences,
    importMailchimpAudience,
} from "@/lib/actions/email"
import type { ImportSummary } from "@/lib/email/import"
import { cn } from "@/lib/utils"

const inputClass =
    "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

function Summary({ summary }: { summary: ImportSummary }) {
    return (
        <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <Check className="h-4 w-4" />
                Import finished
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                    { label: "Rows", value: summary.total },
                    { label: "Created", value: summary.created },
                    { label: "Updated", value: summary.updated },
                    { label: "Invalid", value: summary.invalid },
                    { label: "Suppressed", value: summary.suppressed },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-md bg-white/70 px-2.5 py-2 text-center">
                        <div className="text-lg font-bold tabular-nums text-slate-900">{stat.value}</div>
                        <div className="text-[11px] text-slate-500">{stat.label}</div>
                    </div>
                ))}
            </div>
            {summary.invalidSamples.length > 0 && (
                <p className="text-xs text-emerald-800">
                    Skipped examples: {summary.invalidSamples.join(", ")}
                </p>
            )}
            {summary.suppressed > 0 && (
                <p className="text-xs text-emerald-800">
                    {summary.suppressed} addresses were skipped because they previously bounced, complained or
                    unsubscribed. Re-importing them would put your domain reputation at risk.
                </p>
            )}
        </div>
    )
}

function Card({
    title,
    description,
    icon: Icon,
    children,
}: {
    title: string
    description: string
    icon: typeof Upload
    children: React.ReactNode
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-violet-50 p-2">
                    <Icon className="h-4 w-4 text-violet-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-900">{title}</h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
                    <div className="mt-4 space-y-3">{children}</div>
                </div>
            </div>
        </div>
    )
}

export function ImportPanel({
    lists,
    siteCounts,
    mailchimpConfigured,
}: {
    lists: { id: string; name: string }[]
    siteCounts: { subscribers: number; leads: number }
    mailchimpConfigured: boolean
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [summary, setSummary] = useState<ImportSummary | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [audiences, setAudiences] = useState<{ id: string; name: string; memberCount: number }[]>([])
    const [mcTarget, setMcTarget] = useState("")

    const handle = (fn: () => Promise<{ success: boolean; error?: string; data?: ImportSummary }>) =>
        startTransition(async () => {
            setError(null)
            setSummary(null)
            const result = await fn()
            if (result.success && result.data) {
                setSummary(result.data)
                router.refresh()
            } else {
                setError(result.error ?? "Import failed")
            }
        })

    const ListSelect = ({ name }: { name: string }) => (
        <select name={name} className={inputClass} defaultValue="">
            <option value="">No list (contacts only)</option>
            {lists.map((list) => (
                <option key={list.id} value={list.id}>
                    Add to: {list.name}
                </option>
            ))}
        </select>
    )

    const DoubleOptIn = () => (
        <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" name="doubleOptIn" className="mt-0.5 h-4 w-4 accent-violet-600" />
            <span>
                Require double opt-in — contacts land as <strong>PENDING</strong> and must confirm before they can be
                mailed. Slower, and the single biggest protection against spam foldering.
            </span>
        </label>
    )

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-semibold text-slate-900">Import contacts</h1>
                <p className="text-sm text-slate-500">
                    Suppressed addresses are filtered out of every import automatically.
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}
            {summary && <Summary summary={summary} />}
            {pending && (
                <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-800">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing — large lists can take a minute.
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
                <Card
                    title="CSV or Excel file"
                    description="Needs a header row with an 'email' column. first_name, last_name, company and locale are recognised; any other column becomes a custom merge field."
                    icon={Upload}
                >
                    <form action={(formData) => handle(() => importFile(formData))} className="space-y-3">
                        <input
                            type="file"
                            name="file"
                            accept=".csv,.tsv,.txt,.xlsx"
                            required
                            className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-violet-700"
                        />
                        <ListSelect name="listId" />
                        <DoubleOptIn />
                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                            Import file
                        </button>
                    </form>
                </Card>

                <Card
                    title="Paste addresses"
                    description="Paste raw email addresses one per line, or a full CSV block copied from a spreadsheet."
                    icon={ClipboardPaste}
                >
                    <form action={(formData) => handle(() => importPastedContacts(formData))} className="space-y-3">
                        <textarea
                            name="content"
                            rows={6}
                            required
                            placeholder={"someone@example.com\nanother@example.com"}
                            className={cn(inputClass, "font-mono text-xs")}
                        />
                        <ListSelect name="listId" />
                        <DoubleOptIn />
                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                            Import pasted
                        </button>
                    </form>
                </Card>

                <Card
                    title="Mailchimp"
                    description="One-way migration. Subscribed members become contacts; unsubscribed and cleaned members go straight to the suppression list so they can never be mailed again."
                    icon={Download}
                >
                    {!mailchimpConfigured ? (
                        <p className="rounded-md bg-amber-50 p-2.5 text-xs text-amber-800">
                            Set <code className="font-mono">MAILCHIMP_API_KEY</code> to enable this.
                        </p>
                    ) : (
                        <>
                            <button
                                type="button"
                                disabled={pending}
                                onClick={() =>
                                    startTransition(async () => {
                                        setError(null)
                                        const result = await listMailchimpAudiences()
                                        if (result.success) setAudiences(result.data ?? [])
                                        else setError(result.error ?? "Could not reach Mailchimp")
                                    })
                                }
                                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-violet-400"
                            >
                                Load audiences
                            </button>

                            {audiences.length > 0 && (
                                <>
                                    <select value={mcTarget} onChange={(e) => setMcTarget(e.target.value)} className={inputClass}>
                                        <option value="">No list (contacts only)</option>
                                        {lists.map((list) => (
                                            <option key={list.id} value={list.id}>
                                                Add to: {list.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="space-y-2">
                                        {audiences.map((audience) => (
                                            <div
                                                key={audience.id}
                                                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{audience.name}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {audience.memberCount.toLocaleString()} members
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={pending}
                                                    onClick={() =>
                                                        handle(() => importMailchimpAudience(audience.id, mcTarget || undefined))
                                                    }
                                                    className="rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                                                >
                                                    Import
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </Card>

                <Card
                    title="This site's own tables"
                    description="Migrates the existing Subscriber and Lead records into the contact database. Safe to run more than once — existing contacts are enriched, not duplicated."
                    icon={Database}
                >
                    <p className="text-sm text-slate-600">
                        {siteCounts.subscribers.toLocaleString()} subscribers · {siteCounts.leads.toLocaleString()} leads
                    </p>
                    <select value={mcTarget} onChange={(e) => setMcTarget(e.target.value)} className={inputClass}>
                        <option value="">No list (contacts only)</option>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>
                                Add to: {list.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => handle(() => importSiteContacts(mcTarget || undefined))}
                        className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                        Migrate site contacts
                    </button>
                </Card>
            </div>
        </div>
    )
}
