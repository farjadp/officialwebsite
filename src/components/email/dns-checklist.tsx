"use client"

// ============================================================================
// Hardware Source: dns-checklist.tsx
// Version: 1.0.0 — 2026-08-23
// Why: The authentication records that decide whether mail is trusted at all
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react"
import { Copy, Check, ShieldCheck, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * These four records are non-negotiable for bulk mail. Gmail and Yahoo have
 * enforced SPF + DKIM + DMARC alignment for bulk senders since February 2024;
 * mail without them is throttled or rejected regardless of content quality.
 */
function records(domain: string) {
    const root = domain.split(".").slice(-2).join(".")
    return [
        {
            name: "SPF",
            type: "TXT",
            host: domain,
            value: "v=spf1 include:amazonses.com ~all",
            why: "Declares which servers may send as your domain. Resend publishes the exact value in its dashboard — use theirs, not this placeholder, and never publish two SPF records on one host.",
        },
        {
            name: "DKIM",
            type: "CNAME / TXT",
            host: `resend._domainkey.${domain}`,
            value: "Copy the exact value from Resend → Domains",
            why: "Cryptographically signs each message so receivers can prove it was not altered or forged.",
        },
        {
            name: "DMARC",
            type: "TXT",
            host: `_dmarc.${root}`,
            value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${root}; pct=100; adkim=s; aspf=s`,
            why: "Tells receivers what to do when SPF or DKIM fails, and sends you the reports. Start at p=none for two weeks to read the reports, then move to quarantine.",
        },
        {
            name: "MX (for replies)",
            type: "MX",
            host: domain,
            value: "Point at a real mailbox you monitor",
            why: "Replies are the strongest positive signal an inbox provider can observe. A no-reply address throws that away and raises complaint rates.",
        },
    ]
}

export function DnsChecklist({ domain, fromAddress }: { domain: string; fromAddress: string }) {
    const [copied, setCopied] = useState<string | null>(null)
    const [open, setOpen] = useState(true)

    const copy = async (value: string, key: string) => {
        await navigator.clipboard.writeText(value)
        setCopied(key)
        setTimeout(() => setCopied(null), 1500)
    }

    const onSubdomain = domain.split(".").length > 2

    return (
        <div className="rounded-xl border border-slate-200 bg-white">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-2 px-5 py-4 text-left"
            >
                <ShieldCheck className="h-4 w-4 text-violet-600" />
                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-slate-900">Authentication for {domain}</h2>
                    <p className="text-xs text-slate-500">Sending as {fromAddress}</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div className="space-y-3 border-t border-slate-100 p-5">
                    {!onSubdomain && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            <strong>Move marketing mail to a subdomain.</strong> Sending campaigns from your root domain
                            means one bad campaign can take password resets and receipts down with it. Use something like{" "}
                            <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">mail.{domain}</code> and set{" "}
                            <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">EMAIL_MARKETING_FROM</code>{" "}
                            to an address on it.
                        </div>
                    )}

                    {records(domain).map((record) => (
                        <div key={record.name} className="rounded-lg border border-slate-200 p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
                                    {record.name}
                                </span>
                                <span className="text-xs text-slate-400">{record.type}</span>
                            </div>
                            <div className="mt-2 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-12 shrink-0 text-[11px] font-medium text-slate-400">Host</span>
                                    <code className="min-w-0 flex-1 truncate rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-700">
                                        {record.host}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={() => void copy(record.host, `${record.name}-host`)}
                                        className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                    >
                                        {copied === `${record.name}-host` ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-12 shrink-0 text-[11px] font-medium text-slate-400">Value</span>
                                    <code className="min-w-0 flex-1 truncate rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-700">
                                        {record.value}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={() => void copy(record.value, `${record.name}-value`)}
                                        className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                    >
                                        {copied === `${record.name}-value` ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500">{record.why}</p>
                        </div>
                    ))}

                    <p className="text-xs text-slate-400">
                        Verify with{" "}
                        <code className="font-mono">dig TXT _dmarc.{domain.split(".").slice(-2).join(".")}</code> once DNS
                        has propagated.
                    </p>
                </div>
            )}
        </div>
    )
}
