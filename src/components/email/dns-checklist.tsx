"use client"

// ============================================================================
// Hardware Source: dns-checklist.tsx
// Version: 2.0.0 — 2026-08-23
// Why: Show the live records Resend issued, plus their verification state
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react"
import { Copy, Check, ShieldCheck, ChevronDown, AlertTriangle, Clock, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import type { DnsRecord, DomainStatus } from "@/lib/email/domain-status"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<string, { className: string; label: string }> = {
    verified: { className: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Verified" },
    pending: { className: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending — DNS propagating" },
    not_started: { className: "bg-slate-100 text-slate-600 border-slate-200", label: "Records not published yet" },
    temporary_failure: { className: "bg-amber-50 text-amber-700 border-amber-200", label: "Temporary failure — retrying" },
    failure: { className: "bg-rose-50 text-rose-700 border-rose-200", label: "Failed — check the records" },
    manual: { className: "bg-violet-50 text-violet-700 border-violet-200", label: "You publish this one" },
}

function CopyRow({
    label,
    value,
    id,
    copied,
    onCopy,
}: {
    label: string
    value: string
    id: string
    copied: string | null
    onCopy: (value: string, id: string) => void
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[11px] font-medium text-slate-400">{label}</span>
            <code className="min-w-0 flex-1 truncate rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-700" title={value}>
                {value}
            </code>
            <button
                type="button"
                onClick={() => onCopy(value, id)}
                className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label={`Copy ${label}`}
            >
                {copied === id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
        </div>
    )
}

export function DnsChecklist({
    domain,
    fromAddress,
    status,
    dmarc,
    notes,
}: {
    domain: string
    fromAddress: string
    status: DomainStatus
    dmarc: DnsRecord & { why: string }
    notes: Record<string, string>
}) {
    const router = useRouter()
    const [copied, setCopied] = useState<string | null>(null)
    const [open, setOpen] = useState(true)

    const copy = async (value: string, id: string) => {
        await navigator.clipboard.writeText(value)
        setCopied(id)
        setTimeout(() => setCopied(null), 1500)
    }

    const onSubdomain = domain.split(".").length > 2
    const domainState = STATUS_STYLES[status.status ?? "not_started"] ?? STATUS_STYLES.not_started
    const records: (DnsRecord & { why?: string })[] = [
        ...status.records,
        { ...dmarc },
    ]

    return (
        <div className="rounded-xl border border-slate-200 bg-white">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
            >
                <ShieldCheck className="h-4 w-4 shrink-0 text-violet-600" />
                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-slate-900">Authentication for {domain}</h2>
                    <p className="truncate text-xs text-slate-500">Sending as {fromAddress}</p>
                </div>
                {status.available && (
                    <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium", domainState.className)}>
                        {domainState.label}
                    </span>
                )}
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div className="space-y-3 border-t border-slate-100 p-5">
                    {!onSubdomain && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            <strong>Move marketing mail to a subdomain.</strong> Sending campaigns from your root domain
                            means one bad campaign can take password resets and receipts down with it.
                        </div>
                    )}

                    {!status.available && (
                        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                                <p className="font-medium">Could not read the live records.</p>
                                <p className="mt-0.5 text-xs">{status.error}</p>
                            </div>
                        </div>
                    )}

                    {status.available && status.status !== "verified" && (
                        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">Publish these records, then wait for propagation.</p>
                                <p className="mt-0.5 text-xs">
                                    Hosts are relative to your DNS zone — paste them exactly as shown, without appending
                                    the domain again. Campaigns will not send until this reads Verified.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.refresh()}
                                className="flex shrink-0 items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-medium text-amber-900"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Re-check
                            </button>
                        </div>
                    )}

                    {records.map((record, index) => {
                        const recordState = STATUS_STYLES[record.status] ?? STATUS_STYLES.not_started
                        const key = `${record.record}-${index}`
                        return (
                            <div key={key} className="rounded-lg border border-slate-200 p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
                                        {record.record}
                                    </span>
                                    <span className="text-xs text-slate-400">{record.type}</span>
                                    {record.priority != null && (
                                        <span className="text-xs text-slate-400">priority {record.priority}</span>
                                    )}
                                    {record.ttl && <span className="text-xs text-slate-400">TTL {record.ttl}</span>}
                                    <span
                                        className={cn(
                                            "ml-auto rounded-full border px-2 py-0.5 text-[10px] font-medium",
                                            recordState.className
                                        )}
                                    >
                                        {recordState.label}
                                    </span>
                                </div>

                                <div className="mt-2.5 space-y-1.5">
                                    <CopyRow label="Host" value={record.name} id={`${key}-host`} copied={copied} onCopy={copy} />
                                    <CopyRow label="Value" value={record.value} id={`${key}-value`} copied={copied} onCopy={copy} />
                                </div>

                                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                    {record.why ?? notes[record.record] ?? ""}
                                </p>
                            </div>
                        )
                    })}

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                MX — replies
                            </span>
                            <span className="text-xs text-slate-400">optional but high value</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                            Point the <strong>Reply-to</strong> on your campaigns at a mailbox you actually read. A reply
                            is the strongest positive signal an inbox provider can observe; a no-reply address throws
                            that away and pushes people toward the spam button instead.
                        </p>
                    </div>

                    <p className="text-xs text-slate-400">
                        Verify from a terminal once DNS has propagated:{" "}
                        <code className="font-mono">dig TXT _dmarc.{domain.split(".").slice(-2).join(".")} +short</code>
                    </p>
                </div>
            )}
        </div>
    )
}
