"use client"

// ============================================================================
// Component: ActivityFeed
// Role: The live log at /admin/jobs/activity. Polls for lines newer than the
//       newest it holds every few seconds while the tab is visible; filters by
//       kind and level; each line opens to show its details.
// ============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { activityAction } from "@/lib/jobs/actions"
import { ACTIVITY_KINDS, type ActivityEntry, type ActivityKind, type ActivityLevel } from "@/lib/jobs/activity-types"
import { cn } from "@/lib/utils"

const POLL_MS = 5_000
const KEEP = 500

const KIND_LABEL: Record<ActivityKind, string> = {
    run: "Runs",
    ingest: "Sources",
    score: "Scoring",
    documents: "Résumés",
    status: "Applications",
    agent: "Agent",
    control: "Pause / resume",
}

const LEVEL_STYLE: Record<ActivityLevel, string> = {
    info: "bg-emerald-500",
    warn: "bg-amber-500",
    error: "bg-rose-600",
}

const timeFormat = new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone: "America/Toronto",
})

function mergeNewest(current: ActivityEntry[], incoming: ActivityEntry[]): ActivityEntry[] {
    if (!incoming.length) return current
    const seen = new Set(current.map((entry) => entry.id))
    const fresh = incoming.filter((entry) => !seen.has(entry.id))
    return [...fresh, ...current].slice(0, KEEP)
}

export function ActivityFeed({ initial }: { initial: ActivityEntry[] }) {
    const [entries, setEntries] = useState(initial)
    const [kind, setKind] = useState<ActivityKind | "all">("all")
    const [errorsOnly, setErrorsOnly] = useState(false)
    const [live, setLive] = useState(true)
    const [failed, setFailed] = useState(false)
    const [fresh, setFresh] = useState<Set<string>>(new Set())
    const newest = useRef(initial[0]?.createdAt)

    const poll = useCallback(async () => {
        try {
            const incoming = await activityAction({ after: newest.current })
            setFailed(false)
            if (!incoming.length) return
            newest.current = incoming[0].createdAt
            setEntries((current) => mergeNewest(current, incoming))
            setFresh(new Set(incoming.map((entry) => entry.id)))
        } catch {
            setFailed(true)
        }
    }, [])

    useEffect(() => {
        if (!live) return
        const tick = () => {
            if (document.visibilityState === "visible") void poll()
        }
        const timer = window.setInterval(tick, POLL_MS)
        document.addEventListener("visibilitychange", tick)
        return () => {
            window.clearInterval(timer)
            document.removeEventListener("visibilitychange", tick)
        }
    }, [live, poll])

    const shown = useMemo(
        () =>
            entries.filter(
                (entry) => (kind === "all" || entry.kind === kind) && (!errorsOnly || entry.level !== "info"),
            ),
        [entries, kind, errorsOnly],
    )

    const counts = useMemo(() => {
        const result: Partial<Record<ActivityKind, number>> = {}
        for (const entry of entries) result[entry.kind] = (result[entry.kind] ?? 0) + 1
        return result
    }, [entries])

    return (
        <section className="space-y-4" aria-label="Job search activity">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by kind">
                    {(["all", ...ACTIVITY_KINDS] as const).map((key) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setKind(key)}
                            aria-pressed={kind === key}
                            className={cn(
                                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-200",
                                kind === key
                                    ? "border-[#1B4B43] bg-[#1B4B43] text-white"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                            )}
                        >
                            {key === "all" ? "All" : KIND_LABEL[key]}
                            {key !== "all" && counts[key] ? <span className="ml-1 opacity-70">{counts[key]}</span> : null}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <input
                            type="checkbox"
                            checked={errorsOnly}
                            onChange={(event) => setErrorsOnly(event.target.checked)}
                            className="h-3.5 w-3.5 accent-[#1B4B43]"
                        />
                        Problems only
                    </label>
                    <button
                        type="button"
                        onClick={() => setLive((value) => !value)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        {live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        {live ? "Pause live" : "Go live"}
                    </button>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600" aria-live="polite">
                        <span className="relative flex h-2.5 w-2.5">
                            {live && !failed && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                            )}
                            <span
                                className={cn(
                                    "relative inline-flex h-2.5 w-2.5 rounded-full",
                                    failed ? "bg-rose-600" : live ? "bg-emerald-500" : "bg-slate-400",
                                )}
                            />
                        </span>
                        {failed ? "Connection lost — retrying" : live ? "Live" : "Paused"}
                    </span>
                </div>
            </div>

            {shown.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-600">
                    Nothing logged yet{kind !== "all" ? ` under ${KIND_LABEL[kind]}` : ""}. The next run, résumé or agent step
                    shows up here within a few seconds.
                </div>
            ) : (
                <ol className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {shown.map((entry) => (
                        <li
                            key={entry.id}
                            className={cn(
                                "transition-colors duration-[1500ms] ease-out",
                                fresh.has(entry.id) ? "bg-emerald-50" : "bg-white",
                            )}
                        >
                            <details className="group">
                                <summary className="flex cursor-pointer list-none flex-wrap items-start gap-x-3 gap-y-0.5 px-4 py-2.5 sm:flex-nowrap hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B4B43]">
                                    <span
                                        role="img"
                                        aria-label={entry.level}
                                        className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", LEVEL_STYLE[entry.level])}
                                    />
                                    <time
                                        dateTime={entry.createdAt}
                                        className="shrink-0 whitespace-nowrap font-mono text-xs leading-6 text-slate-500 tabular-nums sm:w-32"
                                    >
                                        {timeFormat.format(new Date(entry.createdAt))}
                                    </time>
                                    <span className="shrink-0 text-xs font-semibold leading-6 text-slate-600 sm:w-24">
                                        {KIND_LABEL[entry.kind]}
                                    </span>
                                    <span className="min-w-0 basis-full text-sm leading-6 text-slate-900 sm:basis-auto sm:flex-1">{entry.message}</span>
                                </summary>
                                {entry.data !== null && entry.data !== undefined && (
                                    <pre className="mx-4 mb-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs leading-5 text-slate-100">
                                        {JSON.stringify(entry.data, null, 2)}
                                    </pre>
                                )}
                            </details>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    )
}
