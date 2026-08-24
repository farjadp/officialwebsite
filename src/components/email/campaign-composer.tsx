"use client"

// ============================================================================
// Hardware Source: campaign-composer.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Wraps the block editor with subject, audience and send controls
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import Link from "next/link"
import {
    Settings2, Send, FlaskConical, Loader2, Check, AlertTriangle,
    Users, Pause, BarChart3, ChevronDown,
} from "lucide-react"
import type { Block, EmailTheme } from "@/lib/email/blocks"
import { EmailEditor } from "./email-editor"
import {
    saveCampaign, sendTestEmail, prepareCampaign, startCampaign,
    pauseCampaign, sendNextBatch, saveVariant,
} from "@/lib/actions/email"
import { cn } from "@/lib/utils"

export interface CampaignData {
    id: string
    name: string
    subject: string
    preheader: string
    fromName: string
    fromEmail: string
    replyTo: string | null
    listId: string | null
    status: string
    blocks: Block[]
    theme: EmailTheme
    abEnabled: boolean
    abTestPercent: number
    abWinnerMetric: string
    optimizeSendTime: boolean
    throttlePerHour: number
    scheduledAt: string | null
    totalRecipients: number
    sentCount: number
    spamScore: number | null
    variants: { label: string; subject: string; preheader: string }[]
}

const inputClass =
    "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-700">{label}</span>
            {children}
            {hint && <span className="block text-[11px] leading-snug text-slate-400">{hint}</span>}
        </label>
    )
}

export function CampaignComposer({
    campaign,
    lists,
    defaultFromEmail,
}: {
    campaign: CampaignData
    lists: { id: string; name: string }[]
    defaultFromEmail: string
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()

    const [name, setName] = useState(campaign.name)
    const [subject, setSubject] = useState(campaign.subject)
    const [preheader, setPreheader] = useState(campaign.preheader)
    const [fromName, setFromName] = useState(campaign.fromName)
    const [fromEmail, setFromEmail] = useState(campaign.fromEmail || defaultFromEmail)
    const [replyTo, setReplyTo] = useState(campaign.replyTo ?? "")
    const [listId, setListId] = useState(campaign.listId ?? "")
    const [abEnabled, setAbEnabled] = useState(campaign.abEnabled)
    const [abTestPercent, setAbTestPercent] = useState(campaign.abTestPercent)
    const [abWinnerMetric, setAbWinnerMetric] = useState(campaign.abWinnerMetric)
    const [variantB, setVariantB] = useState(
        campaign.variants.find((v) => v.label === "B")?.subject ?? ""
    )
    const [optimizeSendTime, setOptimizeSendTime] = useState(campaign.optimizeSendTime)
    const [throttlePerHour, setThrottlePerHour] = useState(campaign.throttlePerHour)
    const [scheduledAt, setScheduledAt] = useState(campaign.scheduledAt?.slice(0, 16) ?? "")

    const [showSettings, setShowSettings] = useState(true)
    const [testAddresses, setTestAddresses] = useState("")
    const [message, setMessage] = useState<{ tone: "ok" | "warn" | "bad"; text: string } | null>(null)
    const [spamScore, setSpamScore] = useState(campaign.spamScore)
    const [status, setStatus] = useState(campaign.status)
    const [recipients, setRecipients] = useState(campaign.totalRecipients)
    const [sent, setSent] = useState(campaign.sentCount)

    const currentBlocks = useState<Block[]>(campaign.blocks)[0]

    const persist = async (blocks: Block[], theme: EmailTheme) => {
        const result = await saveCampaign(campaign.id, {
            name, subject, preheader, fromName, fromEmail,
            replyTo: replyTo || null,
            listId: listId || null,
            blocks, theme,
            abEnabled, abTestPercent, abWinnerMetric,
            optimizeSendTime, throttlePerHour,
            scheduledAt: scheduledAt || null,
        })

        if (result.success) {
            setSpamScore(result.data?.spamScore ?? null)
            if (abEnabled && variantB.trim()) {
                await saveVariant(campaign.id, "A", { subject, preheader })
                await saveVariant(campaign.id, "B", { subject: variantB, preheader })
            }
            setMessage({ tone: "ok", text: "Saved" })
        } else {
            setMessage({ tone: "bad", text: result.error ?? "Save failed" })
        }
    }

    const act = (fn: () => Promise<void>) => startTransition(async () => { await fn() })

    const isLive = status === "SENDING"

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="min-w-[220px] flex-1 border-0 bg-transparent p-0 text-lg font-semibold text-slate-900 outline-none"
                />
                <div className="flex flex-wrap items-center gap-2">
                    {spamScore != null && (
                        <span
                            className={cn(
                                "rounded-full px-2.5 py-1 text-xs font-semibold",
                                spamScore >= 80
                                    ? "bg-emerald-50 text-emerald-700"
                                    : spamScore >= 55
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-rose-50 text-rose-700"
                            )}
                        >
                            Deliverability {spamScore}/100
                        </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {status}
                    </span>
                    {(status === "SENT" || status === "SENDING") && (
                        <Link
                            href={`/admin/newsletter/campaigns/${campaign.id}/report`}
                            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400"
                        >
                            <BarChart3 className="h-3.5 w-3.5" />
                            Report
                        </Link>
                    )}
                </div>
            </div>

            {message && (
                <div
                    className={cn(
                        "flex items-center gap-2 rounded-lg border p-3 text-sm",
                        message.tone === "ok" && "border-emerald-200 bg-emerald-50 text-emerald-800",
                        message.tone === "warn" && "border-amber-200 bg-amber-50 text-amber-800",
                        message.tone === "bad" && "border-rose-200 bg-rose-50 text-rose-700"
                    )}
                >
                    {message.tone === "ok" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {message.text}
                </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white">
                <button
                    type="button"
                    onClick={() => setShowSettings((v) => !v)}
                    className="flex w-full items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-900"
                >
                    <Settings2 className="h-4 w-4 text-slate-400" />
                    Campaign settings
                    <ChevronDown className={cn("ml-auto h-4 w-4 text-slate-400 transition-transform", showSettings && "rotate-180")} />
                </button>

                {showSettings && (
                    <div className="grid gap-4 border-t border-slate-100 p-5 lg:grid-cols-3">
                        <div className="space-y-3">
                            <Field label="Subject line" hint="30-50 characters. Front-load the point.">
                                <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Preview text" hint="Extends the subject in the inbox — never repeat it.">
                                <input value={preheader} onChange={(e) => setPreheader(e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Audience">
                                <select value={listId} onChange={(e) => setListId(e.target.value)} className={inputClass}>
                                    <option value="">Everyone active</option>
                                    {lists.map((list) => (
                                        <option key={list.id} value={list.id}>
                                            {list.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <div className="space-y-3">
                            <Field label="From name">
                                <input value={fromName} onChange={(e) => setFromName(e.target.value)} className={inputClass} />
                            </Field>
                            <Field
                                label="From address"
                                hint="Use a marketing subdomain (mail.yourdomain.com) so campaign reputation never touches transactional mail."
                            >
                                <input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="hello@mail.farjadp.info" className={inputClass} />
                            </Field>
                            <Field label="Reply-to" hint="Replies are the strongest positive signal an inbox provider sees. Use a real mailbox.">
                                <input value={replyTo} onChange={(e) => setReplyTo(e.target.value)} className={inputClass} />
                            </Field>
                        </div>

                        <div className="space-y-3">
                            <Field label="Schedule (optional)">
                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Throttle" hint="Spacing the send protects reputation far more than sending fast helps.">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={throttlePerHour}
                                        onChange={(e) => setThrottlePerHour(Number(e.target.value))}
                                        className={inputClass}
                                    />
                                    <span className="whitespace-nowrap text-xs text-slate-400">per hour</span>
                                </div>
                            </Field>
                            <label className="flex items-start gap-2 text-xs text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={optimizeSendTime}
                                    onChange={(e) => setOptimizeSendTime(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 accent-violet-600"
                                />
                                <span>
                                    Optimise send time per contact — delivers at the hour each reader has historically
                                    opened. Contacts with no history send immediately.
                                </span>
                            </label>
                        </div>

                        <div className="space-y-3 lg:col-span-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                <input
                                    type="checkbox"
                                    checked={abEnabled}
                                    onChange={(e) => setAbEnabled(e.target.checked)}
                                    className="h-4 w-4 accent-violet-600"
                                />
                                A/B test the subject line
                            </label>

                            {abEnabled && (
                                <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:grid-cols-3">
                                    <Field label="Variant B subject">
                                        <input value={variantB} onChange={(e) => setVariantB(e.target.value)} className={inputClass} />
                                    </Field>
                                    <Field label="Test group size" hint="The rest is held back until a winner emerges.">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={5}
                                                max={50}
                                                value={abTestPercent}
                                                onChange={(e) => setAbTestPercent(Number(e.target.value))}
                                                className={inputClass}
                                            />
                                            <span className="text-xs text-slate-400">%</span>
                                        </div>
                                    </Field>
                                    <Field label="Winner decided by">
                                        <select value={abWinnerMetric} onChange={(e) => setAbWinnerMetric(e.target.value)} className={inputClass}>
                                            <option value="open">Open rate</option>
                                            <option value="click">Click rate</option>
                                        </select>
                                    </Field>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <EmailEditor
                initialBlocks={currentBlocks}
                initialTheme={campaign.theme}
                subject={subject}
                preheader={preheader}
                fromEmail={fromEmail}
                onSave={persist}
                onSubjectChange={(nextSubject, nextPreheader) => {
                    setSubject(nextSubject)
                    setPreheader(nextPreheader)
                }}
                toolbarExtra={({ blocks, theme, dirty, save }) => (
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            value={testAddresses}
                            onChange={(event) => setTestAddresses(event.target.value)}
                            placeholder="seed@gmail.com, seed@outlook.com"
                            className="w-56 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-violet-400"
                        />
                        <button
                            type="button"
                            disabled={pending || !testAddresses.trim()}
                            onClick={() =>
                                act(async () => {
                                    // Persist first so the saved row matches what was tested
                                    if (dirty) await save()
                                    const result = await sendTestEmail(campaign.id, testAddresses, {
                                        subject,
                                        preheader,
                                        blocks,
                                        theme,
                                        fromName,
                                        fromEmail,
                                        replyTo: replyTo || null,
                                    })
                                    setMessage(
                                        result.success
                                            ? {
                                                  tone: result.data?.failed.length ? "warn" : "ok",
                                                  text: `Sent ${result.data?.sent} test email(s). ${
                                                      result.data?.failed.length
                                                          ? `Failed: ${result.data.failed.join("; ")}`
                                                          : "Check whether each landed in the inbox or the spam folder."
                                                  }`,
                                              }
                                            : { tone: "bad", text: result.error ?? "Test send failed" }
                                    )
                                })
                            }
                            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400 disabled:opacity-50"
                        >
                            <FlaskConical className="h-3.5 w-3.5" />
                            Seed test
                        </button>

                        <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                                act(async () => {
                                    if (dirty) await save()
                                    const result = await prepareCampaign(campaign.id)
                                    if (result.success) {
                                        setRecipients(result.data?.audience ?? 0)
                                        setMessage({
                                            tone: "ok",
                                            text: `Audience built: ${result.data?.audience.toLocaleString()} recipients queued.`,
                                        })
                                    } else {
                                        setMessage({ tone: "bad", text: result.error ?? "Could not build the audience" })
                                    }
                                })
                            }
                            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400 disabled:opacity-50"
                        >
                            <Users className="h-3.5 w-3.5" />
                            {recipients ? `${recipients.toLocaleString()} queued` : "Build audience"}
                        </button>

                        {isLive ? (
                            <>
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() =>
                                        act(async () => {
                                            const result = await sendNextBatch(campaign.id, 50)
                                            if (result.success) {
                                                setSent((s) => s + (result.data?.sent ?? 0))
                                                setMessage({
                                                    tone: result.data?.quotaExhausted ? "warn" : "ok",
                                                    text: result.data?.quotaExhausted
                                                        ? "Daily warm-up cap reached. Sending resumes automatically tomorrow."
                                                        : `Sent ${result.data?.sent}. ${result.data?.remaining} still queued.`,
                                                })
                                            }
                                        })
                                    }
                                    className="flex items-center gap-1.5 rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                                >
                                    {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                    Send batch ({sent})
                                </button>
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() =>
                                        act(async () => {
                                            await pauseCampaign(campaign.id)
                                            setStatus("PAUSED")
                                            router.refresh()
                                        })
                                    }
                                    className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800"
                                >
                                    <Pause className="h-3.5 w-3.5" />
                                    Pause
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                disabled={pending}
                                onClick={() => {
                                    if (
                                        !window.confirm(
                                            `Start sending "${name}"?\n\nDelivery runs on the cron in throttled batches within today's warm-up cap.`
                                        )
                                    )
                                        return
                                    act(async () => {
                                        if (dirty) await save()
                                        const result = await startCampaign(campaign.id)
                                        if (result.success) {
                                            setStatus("SENDING")
                                            setMessage({
                                                tone: "ok",
                                                text: `Sending started — ${result.data?.queued.toLocaleString()} queued.`,
                                            })
                                            router.refresh()
                                        } else {
                                            setMessage({ tone: "bad", text: result.error ?? "Could not start sending" })
                                        }
                                    })
                                }}
                                className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                Start sending
                            </button>
                        )}
                    </div>
                )}
            />
        </div>
    )
}
