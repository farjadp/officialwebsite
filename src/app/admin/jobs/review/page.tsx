// ============================================================================
// Route: /admin/jobs/review
// Role: The 30-day review. One page per cycle: what was spent, what the
//       pipeline produced, how good the résumés were, which lanes and sources
//       worked, and findings that say what to change next month.
// Note: Owner only (see ../layout.tsx). `?cycle=N` opens an earlier cycle.
// ============================================================================

import Link from "next/link"
import { loadMonthlyReview, type Breakdown } from "@/lib/jobs/monthly-review"
import {
    MONTHLY_BUDGET_TARGET_CENTS,
    REVIEW_CYCLE_DAYS,
    cycleFor,
    findings,
    rates,
    type Finding,
} from "@/lib/jobs/monthly-review-rules"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Toronto" })
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`
const pct = (value: number) => `${Math.round(value * 100)}%`

const SEVERITY: Record<Finding["severity"], { label: string; className: string }> = {
    fix: { label: "Fix", className: "border-rose-200 bg-rose-50 text-rose-900" },
    watch: { label: "Watch", className: "border-amber-200 bg-amber-50 text-amber-900" },
    good: { label: "Good", className: "border-emerald-200 bg-emerald-50 text-emerald-900" },
}

const QUESTIONS = [
    "Which applications got a reply, and what did those postings have in common (lane, company size, seniority, score)?",
    "Were any 70+ scores clearly wrong for you? Note two examples — they tune the scoring prompt.",
    "What did you change most often in the résumés? Those edits go into the résumé prompt or the career record.",
    "Which sources brought strong matches, and which only noise? Disable the noise.",
    "Did the agent miss anything you found yourself? Where did you find it? That source gets added.",
    "Was the money well spent? If a stronger model for résumés is worth it, move budget from scoring.",
]

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
            {hint && <p className="mt-0.5 text-xs text-slate-600">{hint}</p>}
        </div>
    )
}

function BreakdownTable({ title, rows }: { title: string; rows: Breakdown[] }) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white">
            <h3 className="border-b border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900">{title}</h3>
            {rows.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-600">Nothing yet this cycle.</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-slate-600">
                            <th className="px-4 py-2 font-semibold">Name</th>
                            <th className="px-2 py-2 text-right font-semibold">70+</th>
                            <th className="px-2 py-2 text-right font-semibold">Applied</th>
                            <th className="px-4 py-2 text-right font-semibold">Interviews</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map((row) => (
                            <tr key={row.key}>
                                <td className="px-4 py-2 text-slate-900">{row.key}</td>
                                <td className="px-2 py-2 text-right tabular-nums text-slate-700">{row.strong}</td>
                                <td className="px-2 py-2 text-right tabular-nums text-slate-700">{row.applied}</td>
                                <td className="px-4 py-2 text-right tabular-nums font-semibold text-slate-900">{row.interviews}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    )
}

export default async function JobsReviewPage({ searchParams }: { searchParams: Promise<{ cycle?: string }> }) {
    const { cycle: cycleParam } = await searchParams
    const now = new Date()
    const current = cycleFor(now)
    const requested = Number.parseInt(cycleParam ?? "", 10)
    const cycle = Number.isFinite(requested) && requested >= 1 && requested <= current.number ? cycleFor(now, requested) : current

    const review = await loadMonthlyReview(cycle)
    const n = review.numbers
    const r = rates(n)
    const list = findings(n)
    const isCurrent = cycle.number === current.number
    const daysLeft = Math.max(0, Math.ceil((cycle.to.getTime() - now.getTime()) / 86_400_000))

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Cycle {cycle.number}: {dateFormat.format(cycle.from)} – {dateFormat.format(new Date(cycle.to.getTime() - 1))}
                    </h2>
                    <p className="text-sm text-slate-600">
                        {isCurrent
                            ? `In progress — review on ${dateFormat.format(cycle.dueOn)} (${daysLeft} day${daysLeft === 1 ? "" : "s"} left). Numbers so far.`
                            : `Closed ${REVIEW_CYCLE_DAYS}-day cycle.`}{" "}
                        Budget target {dollars(MONTHLY_BUDGET_TARGET_CENTS)} a cycle; quality first.
                    </p>
                </div>
                <nav aria-label="Cycles" className="flex flex-wrap gap-1.5">
                    {Array.from({ length: current.number }, (_, i) => i + 1).map((number) => (
                        <Link
                            key={number}
                            href={number === current.number ? "/admin/jobs/review" : `/admin/jobs/review?cycle=${number}`}
                            aria-current={number === cycle.number ? "page" : undefined}
                            className={cn(
                                "rounded-full border px-3 py-1 text-xs font-semibold",
                                number === cycle.number
                                    ? "border-[#1B4B43] bg-[#1B4B43] text-white"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                            )}
                        >
                            Cycle {number}
                        </Link>
                    ))}
                </nav>
            </header>

            <section aria-label="Findings" className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Findings and what to change next month</h3>
                <ul className="space-y-2">
                    {list.map((finding) => (
                        <li key={`${finding.area}-${finding.text}`} className={cn("rounded-xl border px-4 py-3", SEVERITY[finding.severity].className)}>
                            <p className="text-sm">
                                <b>{SEVERITY[finding.severity].label} · {finding.area}.</b> {finding.text}
                            </p>
                            <p className="mt-1 text-sm opacity-90">Next month: {finding.nextMonth}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section aria-label="Money" className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Money</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Stat label="Spent" value={dollars(n.spendCents)} hint={`${pct(r.budgetUse)} of ${dollars(MONTHLY_BUDGET_TARGET_CENTS)}`} />
                    <Stat label="On résumés" value={dollars(n.resumeCostCents)} hint={`${dollars(r.costPerResume)} each`} />
                    <Stat label="On scoring" value={dollars(n.scoreCostCents)} hint={`${n.scored} postings`} />
                    <Stat
                        label="Per interview"
                        value={r.costPerInterview === null ? "—" : dollars(r.costPerInterview)}
                        hint={`Daily cap hit on ${n.daysAtDailyCap} day${n.daysAtDailyCap === 1 ? "" : "s"}`}
                    />
                </div>
            </section>

            <section aria-label="Pipeline" className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Pipeline</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Stat label="New postings" value={String(n.newPostings)} hint={`${n.scored} scored`} />
                    <Stat label="Strong (70+)" value={String(n.strongMatches)} hint={`${pct(r.strongRate)} of scored`} />
                    <Stat label="Shortlisted" value={String(n.shortlisted)} hint={`${n.dismissedClosed} found closed`} />
                    <Stat label="Applied" value={String(n.applied)} hint={`${pct(r.applyRate)} of shortlist`} />
                    <Stat label="Replies" value={String(n.responses)} hint={`${pct(r.responseRate)} of applied`} />
                    <Stat label="Interviews" value={String(n.interviews)} hint={`${pct(r.interviewRate)} of applied`} />
                    <Stat label="Offers" value={String(n.offers)} />
                    <Stat label="Runs" value={String(n.runs)} hint={`${n.failedRuns} failed`} />
                </div>
            </section>

            <section aria-label="Résumé quality" className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Résumé quality</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Stat label="Résumés written" value={String(n.resumes)} />
                    <Stat label="Edited by you" value={pct(r.editRate)} hint={`${n.resumesEdited} of ${n.resumes}`} />
                    <Stat label="Corrected by guards" value={pct(r.guardRate)} hint="invented or wrong details caught" />
                    <Stat label="Closed when checked" value={pct(r.closedRate)} hint="of the agent's candidates" />
                </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
                <BreakdownTable title="By lane" rows={review.byLane} />
                <BreakdownTable title="By source" rows={review.byBoard} />
            </div>

            <section aria-label="Review questions" className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">Questions for the review meeting</h3>
                <ol className="mt-2 list-decimal space-y-1.5 ps-5 text-sm text-slate-700">
                    {QUESTIONS.map((question) => (
                        <li key={question}>{question}</li>
                    ))}
                </ol>
                <p className="mt-3 text-xs text-slate-600">
                    Replies and interviews are counted from status changes: set a posting to Interview, Offer or Rejected
                    when you hear back, or these numbers stay at zero.
                </p>
            </section>
        </div>
    )
}
