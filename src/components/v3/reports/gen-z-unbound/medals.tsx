"use client"

// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/medals.tsx
// Why: One badge case for the whole three-part Gen Z series (reports 11–13).
//      Every interactive figure calls medal() the first time a reader uses
//      it; the case groups the twelve badges by part, shows a part that is
//      not out yet as locked with its date, and pops a toast for a new one.
//      State lives in localStorage only (wrapped, since it can throw in
//      private windows) and never leaves the browser.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  BookOpenCheck,
  Crown,
  Flag,
  Globe2,
  Lock,
  Rows3,
  Ruler,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Split,
  Star,
  Tv,
  Users,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentType } from "react"
import type { Locale } from "@/lib/nav"
import { MEDALS_BY_PART, SERIES, type MedalKey } from "./series-copy"

const KEY = "farjadp:genz2026:badges"
const EVENT = "genz2026-badge"

const ALL: MedalKey[] = MEDALS_BY_PART.flat()

export const MEDAL_ICON: Record<MedalKey, ComponentType<{ className?: string }>> = {
  room: Users,
  twin: ScanSearch,
  camps: Split,
  issues: Rows3,
  guess: Flag,
  distance: Ruler,
  abroad: Globe2,
  stars: Star,
  trust: ShieldCheck,
  feeds: Tv,
  unexplained: Sparkles,
  studies: BookOpenCheck,
}

function read(): string {
  try {
    return window.localStorage.getItem(KEY) ?? ""
  } catch {
    return ""
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener("storage", cb)
    window.removeEventListener(EVENT, cb)
  }
}

/** Award a badge. Idempotent; announces only a new one. */
export function medal(k: MedalKey) {
  const have = new Set(read().split(",").filter(Boolean))
  if (have.has(k)) return
  have.add(k)
  try {
    window.localStorage.setItem(KEY, [...have].join(","))
  } catch {
    // Storage blocked: the badge still shows for this page view via the event.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: k }))
}

export function useMedals(): Set<MedalKey> {
  const raw = useSyncExternalStore(subscribe, read, () => "")
  return useMemo(() => new Set(raw.split(",").filter(Boolean) as MedalKey[]), [raw])
}

const FA = "۰۱۲۳۴۵۶۷۸۹"
const d = (n: number, l: Locale) => (l === "fa" ? String(n).replace(/\d/g, (x) => FA[Number(x)]) : String(n))

/**
 * @param live   which of the three parts are out today (from the server)
 * @param dates  each part's publication date, already formatted for the locale
 */
export function MedalCase({ locale, live, dates }: { locale: Locale; live: boolean[]; dates: string[] }) {
  const s = SERIES[locale]
  const t = s.medals
  const medals = useMedals()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<MedalKey | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const on = (e: Event) => {
      const k = (e as CustomEvent<MedalKey>).detail
      if (!k) return
      setToast(k)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setToast(null), 2600)
    }
    window.addEventListener(EVENT, on)
    return () => {
      window.removeEventListener(EVENT, on)
      window.clearTimeout(timer.current)
    }
  }, [])

  const count = ALL.filter((k) => medals.has(k)).length
  const full = count === ALL.length

  return (
    <div className="pointer-events-none fixed bottom-4 start-4 z-40 flex flex-col items-start gap-3 md:bottom-6 md:start-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            role="status"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-v3-light/60 bg-v3-raise px-4 py-2 text-sm text-v3-bone shadow-[0_0_40px_-10px_rgb(var(--v3-glow)/0.8)]"
          >
            <motion.span
              initial={reduce ? false : { rotate: -30, scale: 1.8 }}
              animate={{ rotate: -8, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="grid h-7 w-7 place-items-center rounded-full border-2 border-v3-light text-v3-light"
            >
              {(() => {
                const I = MEDAL_ICON[toast]
                return <I className="h-3.5 w-3.5" />
              })()}
            </motion.span>
            <span>+ {t.names[toast]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            id="genz-series-badges"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-auto max-h-[70vh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-v3-line bg-v3-ink/95 p-5 shadow-2xl backdrop-blur"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-v3-display text-xl text-v3-bone">{t.title}</p>
                <p className="text-xs leading-relaxed text-v3-mute">{t.hint}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="rounded-full p-1 text-v3-mute hover:text-v3-bone">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {MEDALS_BY_PART.map((keys, p) => (
                <div key={p} className="flex flex-col gap-2 border-t border-v3-line/70 pt-3 first:border-t-0 first:pt-0">
                  <p className="flex items-center justify-between gap-2 text-xs text-v3-mute">
                    <span>{s.partLabel(p + 1)}</span>
                    {!live[p] && (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" aria-hidden />
                        {t.locked(dates[p])}
                      </span>
                    )}
                  </p>
                  <ul className="grid grid-cols-4 gap-2">
                    {keys.map((k) => {
                      const I = MEDAL_ICON[k]
                      const got = medals.has(k)
                      return (
                        <li key={k} className="flex flex-col items-center gap-1 text-center">
                          <span
                            className={`grid h-12 w-12 place-items-center rounded-full border-2 transition-all ${
                              got
                                ? "-rotate-8 border-v3-light bg-v3-light/10 text-v3-light shadow-[0_0_24px_-6px_rgb(var(--v3-glow)/0.9)]"
                                : live[p]
                                  ? "border-dashed border-v3-line text-v3-line"
                                  : "border-dotted border-v3-line/60 text-v3-line/60"
                            }`}
                          >
                            <I className="h-5 w-5" />
                          </span>
                          <span className={`text-[10px] leading-tight ${got ? "text-v3-bone" : "text-v3-mute"}`}>{t.names[k]}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
            {full && <p className="mt-4 border-t border-v3-line pt-3 text-sm leading-relaxed text-v3-light rtl:leading-loose">{t.complete}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="genz-series-badges"
        className={`pointer-events-auto flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm shadow-xl backdrop-blur transition-colors ${
          full ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line bg-v3-ink/90 text-v3-bone hover:border-v3-light"
        }`}
      >
        {full ? <Crown className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-v3-light" />}
        <span className="sr-only">{t.open}: </span>
        <span className="tabular-nums">
          {d(count, locale)}/{d(ALL.length, locale)}
        </span>
        <span aria-hidden className="flex gap-1">
          {MEDALS_BY_PART.map((keys, p) => (
            <span key={p} className="flex gap-0.5">
              {keys.map((k) => (
                <span key={k} className={`h-1.5 w-1.5 rounded-full ${medals.has(k) ? (full ? "bg-v3-ink" : "bg-v3-light") : "bg-v3-line"}`} />
              ))}
            </span>
          ))}
        </span>
      </button>
    </div>
  )
}
