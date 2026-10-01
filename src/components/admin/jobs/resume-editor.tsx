"use client"

// ============================================================================
// The résumé editor: the fields on the left, the printed page on the right.
// Wording is free to edit; employers, places and dates are shown but locked,
// and a title is chosen from the profile's list for that role. Every AI
// suggestion is shown first and applied only on "Use this".
// ============================================================================

import { useEffect, useMemo, useState, useTransition } from "react"
import { ArrowDown, ArrowUp, Check, Copy, Loader2, Plus, Printer, Sparkles, Trash2, X } from "lucide-react"
import { assistAction, reviewAction, saveDocumentAction } from "@/lib/jobs/actions"
import type { ModelReview } from "@/lib/jobs/assist"
import type { Resume } from "@/lib/jobs/documents"
import { instantChecks, type Check as CheckItem } from "@/lib/jobs/review"
import { CoverSheet, ResumeSheet } from "./resume-sheet"

type Target = "headline" | "summary" | "bullets" | "cover"

const INPUT =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B4B43] focus:outline-none focus:ring-1 focus:ring-[#1B4B43]"
const QUICK = ["Shorter", "Stronger, more specific verbs", "Match this posting's language", "Sound less AI-written"]

function AssistBox({
    documentId,
    target,
    current,
    roleCompany,
    onUse,
    onClose,
}: {
    documentId: string
    target: Target
    current: string | string[]
    roleCompany?: string
    onUse: (value: string | string[]) => void
    onClose: () => void
}) {
    const [instruction, setInstruction] = useState("")
    const [isPending, startTransition] = useTransition()
    const [result, setResult] = useState<{ value: string | string[]; warnings: string[] } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const run = (text: string) =>
        startTransition(async () => {
            setError(null)
            setResult(null)
            try {
                const answer = await assistAction({ documentId, target, current, instruction: text, roleCompany })
                if (!answer.ok) setError(answer.error)
                else setResult({ value: answer.bullets ?? answer.text ?? "", warnings: answer.warnings })
            } catch {
                setError("It did not finish. Try again.")
            }
        })

    return (
        <div className="mt-2 space-y-2.5 rounded-xl border border-violet-200 bg-violet-50/60 p-3">
            <div className="flex flex-wrap gap-1.5">
                {QUICK.map((label) => (
                    <button
                        key={label}
                        type="button"
                        disabled={isPending}
                        onClick={() => run(label)}
                        className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-xs font-semibold text-violet-800 hover:bg-violet-100 disabled:opacity-50"
                    >
                        {label}
                    </button>
                ))}
            </div>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    if (instruction.trim()) run(instruction)
                }}
                className="flex gap-2"
            >
                <input
                    value={instruction}
                    onChange={(event) => setInstruction(event.target.value)}
                    placeholder="Or say what you want, e.g. put the App Store launch first"
                    className={`${INPUT} py-1.5 text-xs`}
                />
                <button type="submit" disabled={isPending || !instruction.trim()} className="shrink-0 rounded-lg bg-violet-700 px-3 text-xs font-semibold text-white hover:bg-violet-800 disabled:opacity-50">
                    Go
                </button>
                <button type="button" onClick={onClose} aria-label="Close AI help" className="shrink-0 rounded-lg px-1.5 text-slate-500 hover:bg-white">
                    <X className="h-4 w-4" />
                </button>
            </form>
            {isPending && (
                <p className="flex items-center gap-2 text-xs text-violet-800">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Writing…
                </p>
            )}
            {error && <p role="alert" className="text-xs text-rose-700">{error}</p>}
            {result && (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                    {Array.isArray(result.value) ? (
                        <ul className="list-disc space-y-1 pl-4 text-sm text-slate-800">
                            {result.value.map((line, index) => <li key={index}>{line}</li>)}
                        </ul>
                    ) : (
                        <p className="whitespace-pre-wrap text-sm text-slate-800">{result.value}</p>
                    )}
                    {result.warnings.map((warning) => (
                        <p key={warning} className="text-xs font-semibold text-rose-700">{warning}</p>
                    ))}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onUse(result.value)
                                onClose()
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1B4B43] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#153b35]"
                        >
                            <Check className="h-3.5 w-3.5" /> Use this
                        </button>
                        <button type="button" onClick={() => setResult(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            Discard
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function SparkleButton({ onClick, active }: { onClick: () => void; active: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${active ? "bg-violet-700 text-white" : "text-violet-700 hover:bg-violet-50"}`}
        >
            <Sparkles className="h-3.5 w-3.5" /> AI
        </button>
    )
}

function CheckRow({ check }: { check: CheckItem }) {
    const tone = check.level === "ok" ? "text-emerald-700" : check.level === "warn" ? "text-amber-700" : "text-rose-700"
    const mark = check.level === "ok" ? "✓" : check.level === "warn" ? "!" : "✕"
    return (
        <li className="flex gap-2.5 text-sm">
            <span className={`w-4 shrink-0 text-center font-bold ${tone}`} aria-hidden>{mark}</span>
            <span>
                <span className="text-slate-800">{check.label}</span>
                {check.detail && <span className="block text-xs text-slate-500">{check.detail}</span>}
            </span>
        </li>
    )
}

export function ResumeEditor({
    documentId,
    company,
    initialResume,
    initialCoverLetter,
    titleOptions,
    source,
    today,
    initialView,
}: {
    documentId: string
    company: string
    initialResume: Resume
    initialCoverLetter: string
    titleOptions: string[][]
    source: string
    today: string
    initialView: "resume" | "cover"
}) {
    const [resume, setResume] = useState(initialResume)
    const [coverLetter, setCoverLetter] = useState(initialCoverLetter)
    const [view, setView] = useState(initialView)
    const [panel, setPanel] = useState<"edit" | "review">("edit")
    const [open, setOpen] = useState<string | null>(null)
    const [dirty, setDirty] = useState(false)
    const [saveState, setSaveState] = useState<{ text: string; bad: boolean } | null>(null)
    const [saving, startSaving] = useTransition()
    const [reviewing, startReview] = useTransition()
    const [review, setReview] = useState<ModelReview | null>(null)
    const [reviewError, setReviewError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!dirty) return
        const warn = (event: BeforeUnloadEvent) => event.preventDefault()
        window.addEventListener("beforeunload", warn)
        return () => window.removeEventListener("beforeunload", warn)
    }, [dirty])

    const change = (next: Resume) => {
        setResume(next)
        setDirty(true)
        setSaveState(null)
    }
    const setRole = (index: number, patch: Partial<Resume["roles"][number]>) =>
        change({ ...resume, roles: resume.roles.map((role, i) => (i === index ? { ...role, ...patch } : role)) })
    const setBullets = (index: number, bullets: string[]) => setRole(index, { bullets })

    const checks = useMemo(() => instantChecks(resume, coverLetter, source), [resume, coverLetter, source])
    const problems = checks.filter((check) => check.level !== "ok").length

    const save = () =>
        startSaving(async () => {
            try {
                const result = await saveDocumentAction(documentId, {
                    headline: resume.headline,
                    summary: resume.summary,
                    roles: resume.roles.map((role) => ({ title: role.title, bullets: role.bullets })),
                    skills: resume.skills,
                    coverLetter,
                })
                if (result.ok) {
                    setDirty(false)
                    setSaveState({ text: "Saved", bad: false })
                } else setSaveState({ text: result.error ?? "Not saved", bad: true })
            } catch {
                setSaveState({ text: "Not saved. Check your connection.", bad: true })
            }
        })

    /** Replace a quoted line wherever it appears, for "apply" on a review finding. */
    const applyRewrite = (quote: string, rewrite: string) => {
        const swap = (text: string) => text.split(quote).join(rewrite)
        if (coverLetter.includes(quote)) {
            setCoverLetter(swap(coverLetter))
            setDirty(true)
        }
        change({
            ...resume,
            headline: swap(resume.headline),
            summary: swap(resume.summary),
            roles: resume.roles.map((role) => ({ ...role, bullets: role.bullets.map(swap) })),
        })
    }

    const toggle = (key: string) => setOpen(open === key ? null : key)
    const tab = (active: boolean) =>
        `rounded-lg px-3 py-1.5 text-sm font-semibold ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`

    return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] print:block">
            {/* ─── Left: editing ───────────────────────────────────────── */}
            <div className="space-y-4 print:hidden">
                <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center gap-2 bg-slate-50/95 px-1 py-2 backdrop-blur">
                    <button type="button" onClick={() => setPanel("edit")} className={tab(panel === "edit")}>Edit</button>
                    <button type="button" onClick={() => setPanel("review")} className={tab(panel === "review")}>
                        Review{problems > 0 && <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 text-xs text-amber-800">{problems}</span>}
                    </button>
                    <span className="flex-1" />
                    {saveState && <span role="status" className={`text-xs ${saveState.bad ? "text-rose-700" : "text-emerald-700"}`}>{saveState.text}</span>}
                    {dirty && !saveState && <span className="text-xs text-amber-700">Unsaved</span>}
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving || !dirty}
                        className="rounded-lg bg-[#1B4B43] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#153b35] disabled:opacity-40"
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                </div>

                {panel === "edit" ? (
                    <div className="space-y-5">
                        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                            <button type="button" onClick={() => setView("resume")} className={`flex-1 rounded-md py-1.5 text-sm font-semibold ${view === "resume" ? "bg-white shadow-sm" : "text-slate-600"}`}>Résumé</button>
                            <button type="button" onClick={() => setView("cover")} className={`flex-1 rounded-md py-1.5 text-sm font-semibold ${view === "cover" ? "bg-white shadow-sm" : "text-slate-600"}`}>Cover letter</button>
                        </div>

                        {view === "cover" ? (
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label htmlFor="cover" className="text-sm font-semibold text-slate-900">Cover letter</label>
                                    <SparkleButton active={open === "cover"} onClick={() => toggle("cover")} />
                                </div>
                                <textarea
                                    id="cover"
                                    value={coverLetter}
                                    onChange={(event) => {
                                        setCoverLetter(event.target.value)
                                        setDirty(true)
                                        setSaveState(null)
                                    }}
                                    rows={18}
                                    className={`${INPUT} leading-relaxed`}
                                />
                                {open === "cover" && (
                                    <AssistBox documentId={documentId} target="cover" current={coverLetter} onUse={(v) => { setCoverLetter(String(v)); setDirty(true) }} onClose={() => setOpen(null)} />
                                )}
                            </div>
                        ) : (
                            <>
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label htmlFor="headline" className="text-sm font-semibold text-slate-900">Headline</label>
                                        <SparkleButton active={open === "headline"} onClick={() => toggle("headline")} />
                                    </div>
                                    <input id="headline" value={resume.headline} onChange={(e) => change({ ...resume, headline: e.target.value })} className={INPUT} />
                                    {open === "headline" && (
                                        <AssistBox documentId={documentId} target="headline" current={resume.headline} onUse={(v) => change({ ...resume, headline: String(v) })} onClose={() => setOpen(null)} />
                                    )}
                                </div>

                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label htmlFor="summary" className="text-sm font-semibold text-slate-900">Summary</label>
                                        <SparkleButton active={open === "summary"} onClick={() => toggle("summary")} />
                                    </div>
                                    <textarea id="summary" value={resume.summary} onChange={(e) => change({ ...resume, summary: e.target.value })} rows={5} className={INPUT} />
                                    {open === "summary" && (
                                        <AssistBox documentId={documentId} target="summary" current={resume.summary} onUse={(v) => change({ ...resume, summary: String(v) })} onClose={() => setOpen(null)} />
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <p className="text-sm font-semibold text-slate-900">Experience</p>
                                    {resume.roles.map((role, index) => {
                                        const key = `role-${index}`
                                        return (
                                            <div key={key} className="rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900">{role.company}</p>
                                                        <p className="text-xs text-slate-500">{role.span}{role.location ? ` · ${role.location}` : ""}</p>
                                                    </div>
                                                    <SparkleButton active={open === key} onClick={() => toggle(key)} />
                                                </div>
                                                <label className="mt-3 block text-xs font-semibold text-slate-600">
                                                    Title
                                                    <select value={role.title} onChange={(e) => setRole(index, { title: e.target.value })} className={`${INPUT} mt-1`}>
                                                        {titleOptions[index].map((title) => <option key={title} value={title}>{title}</option>)}
                                                    </select>
                                                </label>
                                                <div className="mt-3 space-y-2">
                                                    {role.bullets.map((bullet, b) => (
                                                        <div key={b} className="flex items-start gap-1.5">
                                                            <textarea
                                                                aria-label={`Bullet ${b + 1} for ${role.company}`}
                                                                value={bullet}
                                                                onChange={(e) => setBullets(index, role.bullets.map((x, i) => (i === b ? e.target.value : x)))}
                                                                rows={2}
                                                                className={`${INPUT} py-1.5 text-[13px]`}
                                                            />
                                                            <div className="flex shrink-0 flex-col">
                                                                <button type="button" aria-label="Move up" disabled={b === 0} onClick={() => { const next = [...role.bullets]; [next[b - 1], next[b]] = [next[b], next[b - 1]]; setBullets(index, next) }} className="rounded p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                                                                <button type="button" aria-label="Move down" disabled={b === role.bullets.length - 1} onClick={() => { const next = [...role.bullets]; [next[b + 1], next[b]] = [next[b], next[b + 1]]; setBullets(index, next) }} className="rounded p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                                                                <button type="button" aria-label="Delete bullet" onClick={() => setBullets(index, role.bullets.filter((_, i) => i !== b))} className="rounded p-0.5 text-slate-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {role.bullets.length < 8 && (
                                                        <button type="button" onClick={() => setBullets(index, [...role.bullets, ""])} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4B43] hover:underline">
                                                            <Plus className="h-3.5 w-3.5" /> Add bullet
                                                        </button>
                                                    )}
                                                </div>
                                                {open === key && (
                                                    <AssistBox
                                                        documentId={documentId}
                                                        target="bullets"
                                                        current={role.bullets}
                                                        roleCompany={role.company}
                                                        onUse={(v) => setBullets(index, Array.isArray(v) ? v : [String(v)])}
                                                        onClose={() => setOpen(null)}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                <div>
                                    <label htmlFor="skills" className="mb-1.5 block text-sm font-semibold text-slate-900">Skills</label>
                                    <textarea
                                        id="skills"
                                        value={resume.skills.join(", ")}
                                        onChange={(e) => change({ ...resume, skills: e.target.value.split(",").map((s) => s.trimStart()) })}
                                        rows={3}
                                        className={INPUT}
                                    />
                                    <p className="mt-1 text-xs text-slate-500">Separated by commas. Contact, education and certifications are edited in the profile.</p>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-5">
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <h3 className="text-sm font-semibold text-slate-900">Instant checks</h3>
                            <p className="mt-0.5 text-xs text-slate-500">Update as you type. Free.</p>
                            <ul className="mt-3 space-y-2">
                                {checks.map((check) => <CheckRow key={check.label} check={check} />)}
                            </ul>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">ATS and recruiter read</h3>
                                    <p className="mt-0.5 text-xs text-slate-500">Reads what is in the editor now, saved or not. About 20 seconds.</p>
                                </div>
                                <button
                                    type="button"
                                    disabled={reviewing}
                                    onClick={() =>
                                        startReview(async () => {
                                            setReviewError(null)
                                            try {
                                                const result = await reviewAction(documentId, resume, coverLetter)
                                                if (result.ok) setReview(result.review)
                                                else setReviewError(result.error)
                                            } catch {
                                                setReviewError("It did not finish. Try again.")
                                            }
                                        })
                                    }
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {reviewing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                    {review ? "Check again" : "Run check"}
                                </button>
                            </div>
                            {reviewError && <p role="alert" className="mt-3 text-xs text-rose-700">{reviewError}</p>}

                            {review && (
                                <div className="mt-4 space-y-5">
                                    <p className="text-sm leading-relaxed text-slate-700">{review.verdict}</p>

                                    <div>
                                        <div className="flex items-baseline justify-between">
                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Posting keywords found</p>
                                            <p className={`text-lg font-bold tabular-nums ${review.coverage >= 70 ? "text-emerald-700" : review.coverage >= 50 ? "text-amber-700" : "text-rose-700"}`}>{review.coverage}%</p>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {review.matched.map((k) => <span key={k} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">{k}</span>)}
                                            {review.missing.map((k) => <span key={k} className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-800 line-through decoration-rose-300">{k}</span>)}
                                        </div>
                                        {review.missing.length > 0 && (
                                            <p className="mt-2 text-xs text-slate-500">Add a missing keyword only where it is true of you. An ATS match on a skill you cannot discuss loses the interview instead.</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Requirements</p>
                                        <ul className="mt-2 space-y-2">
                                            {review.requirements.map((r) => (
                                                <li key={r.text} className="flex gap-2.5 text-sm">
                                                    <span className={`mt-0.5 shrink-0 rounded px-1.5 text-[11px] font-bold uppercase ${r.met === "yes" ? "bg-emerald-50 text-emerald-700" : r.met === "partly" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{r.met}</span>
                                                    <span>
                                                        <span className="text-slate-800">{r.text}</span>
                                                        {r.evidence && <span className="block text-xs text-slate-500">{r.evidence}</span>}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reads as AI-written</p>
                                        {review.aiLines.length === 0 ? (
                                            <p className="mt-2 text-sm text-slate-600">Nothing flagged.</p>
                                        ) : (
                                            <ul className="mt-2 space-y-3">
                                                {review.aiLines.map((line) => (
                                                    <li key={line.quote} className="rounded-lg border border-slate-200 p-3 text-sm">
                                                        <p className="text-slate-500 line-through decoration-slate-300">{line.quote}</p>
                                                        <p className="mt-1 text-slate-900">{line.rewrite}</p>
                                                        <div className="mt-2 flex items-center justify-between gap-2">
                                                            <span className="text-xs text-slate-500">{line.reason}</span>
                                                            <button type="button" onClick={() => applyRewrite(line.quote, line.rewrite)} className="shrink-0 rounded-md bg-[#1B4B43] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#153b35]">
                                                                Apply
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400">No tool can reliably tell AI writing from human writing. This flags what a recruiter tends to notice.</p>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            {/* ─── Right: the page as it prints ─────────────────────────── */}
            <div className="space-y-3 print:space-y-0">
                <div className="flex items-center justify-end gap-2 print:hidden">
                    {view === "cover" && (
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(`${coverLetter}\n\n${resume.name}`)
                                    setCopied(true)
                                } catch {
                                    setCopied(false)
                                }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                        >
                            <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy text"}
                        </button>
                    )}
                    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                        <Printer className="h-4 w-4" /> Print or save PDF
                    </button>
                </div>
                {dirty && <p className="text-right text-xs text-amber-700 print:hidden">Printing shows your unsaved edits; save to keep them.</p>}
                <div className="mx-auto max-w-[8.5in] rounded-sm bg-white p-[0.7in] shadow-sm ring-1 ring-slate-200 print:max-w-none print:p-0 print:shadow-none print:ring-0">
                    {view === "cover" ? <CoverSheet resume={resume} company={company} letter={coverLetter} date={today} /> : <ResumeSheet resume={resume} />}
                </div>
            </div>
        </div>
    )
}
