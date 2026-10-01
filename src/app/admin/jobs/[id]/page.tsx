// ============================================================================
// Route: /admin/jobs/[id]
// Role: One posting: what it asks for, how it scored and why, and your notes.
// Note: Owner only (see ../layout.tsx). The description is third-party text
//       and is rendered as plain text, never as HTML.
// ============================================================================

import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { NotesForm } from "@/components/admin/jobs/notes-form"
import { StatusSelect } from "@/components/admin/jobs/status-select"
import { loadProfile } from "@/lib/jobs/profile"

export const dynamic = "force-dynamic"

const AUTH_TEXT: Record<string, string> = {
    OK: "Your work authorisation covers this role.",
    NEEDS_SPONSORSHIP: "This role needs sponsorship you do not have yet.",
    UNCLEAR: "The posting does not say enough to tell whether you can take it. Check before applying.",
}

type Notes = { fit?: string; gaps?: string; authorisation?: string; model?: string }

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [posting, profile] = await Promise.all([
        prisma.jobPosting.findUnique({ where: { id }, include: { board: { select: { label: true } } } }),
        loadProfile(),
    ])
    if (!posting) notFound()

    const notes: Notes =
        posting.scoreNotes && typeof posting.scoreNotes === "object" && !Array.isArray(posting.scoreNotes)
            ? (posting.scoreNotes as Notes)
            : {}
    const lane = profile.lanes.find((candidate) => candidate.key === posting.lane)?.label ?? posting.lane

    return (
        <div className="space-y-6">
            <Link href="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4" /> All postings
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-xl font-bold text-slate-900">{posting.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        {posting.company}
                        {posting.location ? ` · ${posting.location}` : ""}
                        {posting.remote ? " · Remote" : ""}
                        {posting.department ? ` · ${posting.department}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {lane ? `${lane} · ` : ""}
                        found {format(posting.firstSeenAt, "d MMM yyyy")}
                        {posting.postedAt ? ` · posted ${format(posting.postedAt, "d MMM yyyy")}` : ""}
                        {posting.appliedAt ? ` · applied ${format(posting.appliedAt, "d MMM yyyy")}` : ""}
                        {posting.closedAt ? ` · closed ${format(posting.closedAt, "d MMM yyyy")}` : ""}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusSelect id={posting.id} status={posting.status} />
                    <a
                        href={posting.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4B43] px-4 py-2 text-sm font-semibold text-white hover:bg-[#153b35]"
                    >
                        Open posting <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">Description</h3>
                    {posting.description ? (
                        <div className="max-w-[70ch] whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                            {posting.description}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">The board gave no description. Open the posting to read it.</p>
                    )}
                </section>

                <aside className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-sm font-semibold text-slate-900">Fit</h3>
                            <span className="text-2xl font-bold tabular-nums text-slate-900">
                                {posting.score ?? "–"}
                                {posting.score !== null && <span className="text-sm font-medium text-slate-400"> / 100</span>}
                            </span>
                        </div>
                        {posting.score === null ? (
                            <p className="mt-3 text-sm text-slate-500">Not scored yet. It is picked up on the next run.</p>
                        ) : (
                            <dl className="mt-4 space-y-4 text-sm">
                                <div>
                                    <dt className="font-semibold text-slate-700">Why it fits</dt>
                                    <dd className="mt-1 text-slate-600">{notes.fit}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-700">What is missing</dt>
                                    <dd className="mt-1 text-slate-600">{notes.gaps}</dd>
                                </div>
                                {notes.authorisation && (
                                    <div>
                                        <dt className="font-semibold text-slate-700">Work authorisation</dt>
                                        <dd className="mt-1 text-slate-600">{AUTH_TEXT[notes.authorisation] ?? notes.authorisation}</dd>
                                    </div>
                                )}
                            </dl>
                        )}
                        <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                            A model’s reading of the posting against your profile{notes.model ? ` (${notes.model})` : ""}. Read the posting yourself before you apply.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <NotesForm id={posting.id} notes={posting.notes ?? ""} />
                    </section>
                </aside>
            </div>
        </div>
    )
}
