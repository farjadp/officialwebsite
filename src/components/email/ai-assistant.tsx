"use client"

// ============================================================================
// Hardware Source: ai-assistant.tsx
// Version: 1.0.0 — 2026-08-23
// Why: AI side panel — draft, subject lines, rewrite, deliverability review
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react"
import { Sparkles, Loader2, Check, AlertTriangle, Wand2, RefreshCw } from "lucide-react"
import type { Block } from "@/lib/email/blocks"
import type { SpamAudit } from "@/lib/email/spam"
import { cn } from "@/lib/utils"

interface SubjectSuggestion {
    subject: string
    preheader: string
    angle: string
    predictedOpenRate: number
    risk: string | null
}

interface Review {
    audit: SpamAudit
    aiScore: number
    verdict: string
    improvements: { area: string; problem: string; suggestion: string }[]
    rewrittenSubject?: string
}

async function callAi<T>(payload: Record<string, unknown>): Promise<T> {
    const response = await fetch("/api/email/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    const data = (await response.json()) as T & { error?: string }
    if (!response.ok) throw new Error(data.error ?? "AI request failed")
    return data
}

const inputClass =
    "w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</h3>
}

export interface AiAssistantProps {
    subject: string
    preheader: string
    fromEmail: string
    blocks: Block[]
    html: string
    locale: "en" | "fa"
    onApplyDraft: (draft: { subject: string; preheader: string; blocks: Block[] }) => void
    onApplySubject: (subject: string, preheader: string) => void
}

export function AiAssistant({
    subject,
    preheader,
    fromEmail,
    blocks,
    html,
    locale,
    onApplyDraft,
    onApplySubject,
}: AiAssistantProps) {
    const [tab, setTab] = useState<"draft" | "subjects" | "review">("draft")
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [goal, setGoal] = useState("")
    const [audience, setAudience] = useState("Founders and operators on my list")
    const [keyPoints, setKeyPoints] = useState("")
    const [cta, setCta] = useState("")
    const [ctaUrl, setCtaUrl] = useState("")
    const [length, setLength] = useState<"short" | "medium" | "long">("medium")

    const [subjects, setSubjects] = useState<SubjectSuggestion[]>([])
    const [review, setReview] = useState<Review | null>(null)

    const run = async (fn: () => Promise<void>) => {
        setBusy(true)
        setError(null)
        try {
            await fn()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setBusy(false)
        }
    }

    const bodySummary = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 3000)

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                <Sparkles className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-semibold text-slate-900">AI assistant</span>
            </div>

            <div className="flex border-b border-slate-200">
                {([
                    ["draft", "Draft"],
                    ["subjects", "Subjects"],
                    ["review", "Review"],
                ] as const).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setTab(key)}
                        className={cn(
                            "flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                            tab === key ? "border-b-2 border-violet-600 text-violet-700" : "text-slate-500 hover:text-slate-800"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {error && (
                    <div className="flex gap-2 rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {tab === "draft" && (
                    <>
                        <SectionTitle>Brief</SectionTitle>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            rows={3}
                            placeholder="What should this email achieve? e.g. get founders to apply to the next Lab cohort"
                            className={inputClass}
                        />
                        <input
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            placeholder="Who is receiving it"
                            className={inputClass}
                        />
                        <textarea
                            value={keyPoints}
                            onChange={(e) => setKeyPoints(e.target.value)}
                            rows={3}
                            placeholder="Facts to include — dates, numbers, names. The model will not invent these."
                            className={inputClass}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="CTA label" className={inputClass} />
                            <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="CTA URL" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-3 gap-1 rounded-md bg-slate-100 p-1">
                            {(["short", "medium", "long"] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setLength(option)}
                                    className={cn(
                                        "rounded px-2 py-1 text-xs font-medium capitalize transition-colors",
                                        length === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                                    )}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={busy || !goal.trim()}
                            onClick={() =>
                                run(async () => {
                                    const draft = await callAi<{ subject: string; preheader: string; blocks: Block[] }>({
                                        task: "draft",
                                        goal, audience, keyPoints, cta, ctaUrl, length, locale,
                                    })
                                    onApplyDraft(draft)
                                })
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                        >
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                            Generate draft
                        </button>
                        <p className="text-[11px] leading-snug text-slate-400">
                            Replaces the current blocks. Save first if you want to keep what is there.
                        </p>
                    </>
                )}

                {tab === "subjects" && (
                    <>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                                run(async () => {
                                    const result = await callAi<{ suggestions: SubjectSuggestion[] }>({
                                        task: "subjects",
                                        goal: goal || subject || "Newsletter",
                                        audience,
                                        bodySummary,
                                        count: 10,
                                        locale,
                                    })
                                    setSubjects(result.suggestions)
                                })
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                        >
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Generate 10 subject lines
                        </button>

                        <div className="space-y-2">
                            {subjects.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => onApplySubject(suggestion.subject, suggestion.preheader)}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-violet-400 hover:bg-violet-50/40"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-sm font-medium text-slate-900">{suggestion.subject}</span>
                                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                                            ~{suggestion.predictedOpenRate}%
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">{suggestion.preheader}</p>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                        <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                                            {suggestion.angle}
                                        </span>
                                        {suggestion.risk && (
                                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                                                {suggestion.risk}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {tab === "review" && (
                    <>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                                run(async () => {
                                    setReview(
                                        await callAi<Review>({
                                            task: "review",
                                            subject, preheader, html, fromEmail,
                                            hasUnsubscribe: true, hasPlainText: true,
                                        })
                                    )
                                })
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                        >
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            Run pre-flight review
                        </button>

                        {review && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: "Deliverability", value: review.audit.score },
                                        { label: "AI quality", value: review.aiScore },
                                    ].map((metric) => (
                                        <div key={metric.label} className="rounded-lg border border-slate-200 p-3 text-center">
                                            <div
                                                className={cn(
                                                    "text-2xl font-bold tabular-nums",
                                                    metric.value >= 80 ? "text-emerald-600" : metric.value >= 55 ? "text-amber-600" : "text-rose-600"
                                                )}
                                            >
                                                {metric.value}
                                            </div>
                                            <div className="text-[11px] text-slate-500">{metric.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <p className="rounded-md bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-700">
                                    {review.verdict}
                                </p>

                                {review.rewrittenSubject && (
                                    <button
                                        type="button"
                                        onClick={() => onApplySubject(review.rewrittenSubject!, preheader)}
                                        className="w-full rounded-lg border border-violet-200 bg-violet-50 p-2.5 text-left"
                                    >
                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-600">
                                            Suggested subject — click to apply
                                        </span>
                                        <p className="mt-0.5 text-sm text-slate-900">{review.rewrittenSubject}</p>
                                    </button>
                                )}

                                {review.audit.issues.length > 0 && (
                                    <div className="space-y-2">
                                        <SectionTitle>Deliverability checks</SectionTitle>
                                        {review.audit.issues.map((issue) => (
                                            <div
                                                key={issue.code}
                                                className={cn(
                                                    "rounded-md border p-2.5 text-xs",
                                                    issue.severity === "critical"
                                                        ? "border-rose-200 bg-rose-50"
                                                        : issue.severity === "warning"
                                                          ? "border-amber-200 bg-amber-50"
                                                          : "border-slate-200 bg-slate-50"
                                                )}
                                            >
                                                <p className="font-medium text-slate-900">{issue.message}</p>
                                                <p className="mt-0.5 text-slate-600">{issue.fix}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {review.audit.issues.length === 0 && (
                                    <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
                                        <Check className="h-4 w-4" />
                                        No mechanical deliverability problems found.
                                    </div>
                                )}

                                {review.improvements.length > 0 && (
                                    <div className="space-y-2">
                                        <SectionTitle>Improvements</SectionTitle>
                                        {review.improvements.map((item, index) => (
                                            <div key={index} className="rounded-md border border-slate-200 p-2.5 text-xs">
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-600">
                                                    {item.area}
                                                </span>
                                                <p className="mt-0.5 font-medium text-slate-900">{item.problem}</p>
                                                <p className="mt-0.5 text-slate-600">{item.suggestion}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
