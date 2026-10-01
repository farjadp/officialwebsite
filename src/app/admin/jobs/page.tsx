// ============================================================================
// Route: /admin/jobs
// Role: The ranked list of postings and where each one stands.
// Note: Owner only (see layout.tsx). `maxDuration` covers "Run now", which
//       reads every board and scores what is new inside one server action.
// ============================================================================

import Link from "next/link"
import { formatDistanceToNowStrict } from "date-fns"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { RunButton } from "@/components/admin/jobs/run-button"
import { StatusSelect } from "@/components/admin/jobs/status-select"
import { collapseDuplicates } from "@/lib/jobs/plan"
import { loadProfile } from "@/lib/jobs/profile"
import { JOB_STATUSES } from "@/lib/jobs/types"

export const dynamic = "force-dynamic"
export const maxDuration = 300

const ACTIVE = ["NEW", "SHORTLISTED", "APPLIED", "INTERVIEW", "OFFER"]
const COUNTRY_LABEL: Record<string, string> = { CA: "Canada", US: "United States", NA: "Canada or US" }
const AUTH_BADGE: Record<string, { label: string; tone: string }> = {
    NEEDS_SPONSORSHIP: { label: "Needs sponsorship", tone: "bg-rose-50 text-rose-700" },
    UNCLEAR: { label: "Authorisation unclear", tone: "bg-amber-50 text-amber-700" },
}

type Search = { status?: string; lane?: string; country?: string; min?: string; remote?: string }

function scoreTone(score: number | null): string {
    if (score === null) return "bg-slate-100 text-slate-400"
    if (score >= 85) return "bg-emerald-600 text-white"
    if (score >= 70) return "bg-emerald-100 text-emerald-800"
    if (score >= 50) return "bg-amber-100 text-amber-800"
    return "bg-slate-100 text-slate-500"
}

function notesOf(value: Prisma.JsonValue | null): { fit?: string; authorisation?: string } {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as { fit?: string; authorisation?: string }) : {}
}

const SELECT =
    "rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-[#1B4B43] focus:outline-none"

export default async function JobsPage({ searchParams }: { searchParams: Promise<Search> }) {
    const search = await searchParams
    const status = search.status && [...JOB_STATUSES, "ALL"].includes(search.status as never) ? search.status : "ACTIVE"
    const min = Math.max(0, Math.min(100, Number(search.min) || 0))

    const where: Prisma.JobPostingWhereInput = {
        prefilter: "PASS",
        ...(status === "ACTIVE" ? { status: { in: ACTIVE }, closedAt: null } : status === "ALL" ? {} : { status }),
        ...(search.lane ? { lane: search.lane } : {}),
        ...(search.country === "CA" ? { country: { in: ["CA", "NA"] } } : {}),
        ...(search.country === "US" ? { country: { in: ["US", "NA"] } } : {}),
        ...(search.remote === "1" ? { remote: true } : {}),
        ...(min > 0 ? { score: { gte: min } } : {}),
    }

    const [profile, found, boards, totals] = await Promise.all([
        loadProfile(),
        prisma.jobPosting.findMany({
            where,
            orderBy: [{ score: { sort: "desc", nulls: "last" } }, { firstSeenAt: "desc" }],
            take: 400,
        }),
        prisma.jobBoard.count({ where: { enabled: true } }),
        prisma.jobPosting.groupBy({ by: ["status"], where: { prefilter: "PASS" }, _count: true }),
    ])

    const postings = collapseDuplicates(found).slice(0, 150)
    const count = (wanted: string[]) =>
        totals.filter((row) => wanted.includes(row.status)).reduce((sum, row) => sum + row._count, 0)
    const laneLabel = (key: string | null) => profile.lanes.find((lane) => lane.key === key)?.label ?? key ?? ""
    const unscored = postings.filter((posting) => posting.score === null && posting.status === "NEW").length

    const setupMissing = [
        profile.lanes.length === 0 && { href: "/admin/jobs/profile", text: "Add your lanes and summary to the profile" },
        boards === 0 && { href: "/admin/jobs/boards", text: "Add the first company board to watch" },
    ].filter((step): step is { href: string; text: string } => Boolean(step))

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    {[
                        ["To review", count(["NEW"])],
                        ["Shortlisted", count(["SHORTLISTED"])],
                        ["Applied", count(["APPLIED"])],
                        ["Interviewing", count(["INTERVIEW", "OFFER"])],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <dt className="text-xs text-slate-500">{label}</dt>
                            <dd className="text-2xl font-bold tabular-nums text-slate-900">{value}</dd>
                        </div>
                    ))}
                </dl>
                <RunButton disabled={setupMissing.length > 0} />
            </div>

            {setupMissing.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                    <p className="text-sm font-semibold text-amber-900">Two things before the first run</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-amber-900">
                        {setupMissing.map((step) => (
                            <li key={step.href}>
                                <Link href={step.href} className="underline underline-offset-2">{step.text}</Link>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            <form className="flex flex-wrap items-end gap-3" method="get">
                <label className="text-xs font-semibold text-slate-600">
                    <span className="mb-1 block">Status</span>
                    <select name="status" defaultValue={status} className={SELECT}>
                        <option value="ACTIVE">Open and active</option>
                        <option value="ALL">Everything</option>
                        {JOB_STATUSES.map((value) => (
                            <option key={value} value={value}>{value.charAt(0) + value.slice(1).toLowerCase()}</option>
                        ))}
                    </select>
                </label>
                <label className="text-xs font-semibold text-slate-600">
                    <span className="mb-1 block">Lane</span>
                    <select name="lane" defaultValue={search.lane ?? ""} className={SELECT}>
                        <option value="">All lanes</option>
                        {profile.lanes.map((lane) => (
                            <option key={lane.key} value={lane.key}>{lane.label}</option>
                        ))}
                    </select>
                </label>
                <label className="text-xs font-semibold text-slate-600">
                    <span className="mb-1 block">Country</span>
                    <select name="country" defaultValue={search.country ?? ""} className={SELECT}>
                        <option value="">Canada and US</option>
                        <option value="CA">Canada</option>
                        <option value="US">United States</option>
                    </select>
                </label>
                <label className="text-xs font-semibold text-slate-600">
                    <span className="mb-1 block">Minimum score</span>
                    <select name="min" defaultValue={String(min)} className={SELECT}>
                        <option value="0">Any</option>
                        <option value="50">50+</option>
                        <option value="70">70+</option>
                        <option value="85">85+</option>
                    </select>
                </label>
                <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
                    <input type="checkbox" name="remote" value="1" defaultChecked={search.remote === "1"} className="h-4 w-4 accent-[#1B4B43]" />
                    Remote only
                </label>
                <button type="submit" className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    Filter
                </button>
            </form>

            {unscored > 0 && (
                <p className="text-xs text-slate-500">
                    {unscored} posting{unscored === 1 ? " is" : "s are"} waiting for a score. Up to 100 are scored per run.
                </p>
            )}

            {postings.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
                    <p className="font-semibold text-slate-600">Nothing here yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                        {setupMissing.length > 0
                            ? "Finish the setup above, then press Run now."
                            : "No posting matches these filters. Loosen them, or press Run now to read the boards again."}
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {postings.map((posting) => {
                        const notes = notesOf(posting.scoreNotes)
                        const badge = notes.authorisation ? AUTH_BADGE[notes.authorisation] : undefined
                        return (
                            <li key={posting.id} className="flex items-start gap-4 px-5 py-4">
                                <span
                                    title={posting.score === null ? "Not scored yet" : `Fit score ${posting.score} of 100`}
                                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums ${scoreTone(posting.score)}`}
                                >
                                    {posting.score ?? "–"}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                        <Link href={`/admin/jobs/${posting.id}`} className="font-semibold text-slate-900 hover:text-[#1B4B43] hover:underline">
                                            {posting.title}
                                        </Link>
                                        {posting.closedAt && (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Closed</span>
                                        )}
                                        {badge && (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.tone}`}>{badge.label}</span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-sm text-slate-600">
                                        {posting.company}
                                        {posting.location ? ` · ${posting.location}` : ""}
                                        {posting.remote ? " · Remote" : ""}
                                        {posting.country && COUNTRY_LABEL[posting.country] && !posting.location?.includes("Canada")
                                            ? ` · ${COUNTRY_LABEL[posting.country]}`
                                            : ""}
                                    </p>
                                    {posting.alsoAt.length > 0 && (
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            Also posted for {posting.alsoAt.slice(0, 3).join("; ")}
                                            {posting.alsoAt.length > 3 ? ` and ${posting.alsoAt.length - 3} more` : ""}
                                        </p>
                                    )}
                                    {notes.fit && <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{notes.fit}</p>}
                                    <p className="mt-1.5 text-xs text-slate-400">
                                        {laneLabel(posting.lane)} · found {formatDistanceToNowStrict(posting.firstSeenAt)} ago
                                    </p>
                                </div>
                                <StatusSelect id={posting.id} status={posting.status} />
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
