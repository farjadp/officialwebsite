"use client"

// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/passport.tsx
// Why: The game layer that runs across the whole of report 05. Every
//      interactive figure calls stamp() the first time a reader uses it; the
//      floating passport shows the stamps collected and pops a small toast
//      when a new one lands. State lives in localStorage only (wrapped, since
//      it can throw in private windows) and never leaves the browser.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowDownUp, BookUser, CalendarRange, Search, Stamp, Trophy, Users, Venus, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentType } from "react"
import type { Locale } from "@/lib/nav"
import { COPY, type StampKey } from "./copy"

const KEY = "farjadp:ims24:passport"
const EVENT = "ims24-passport"

export const STAMP_ORDER: StampKey[] = ["timeline", "hundred", "flip", "explorer", "gender", "quiz"]
export const STAMP_ICON: Record<StampKey, ComponentType<{ className?: string }>> = {
  timeline: CalendarRange,
  hundred: Users,
  flip: ArrowDownUp,
  explorer: Search,
  gender: Venus,
  quiz: Trophy,
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

/** Award a stamp. Idempotent; announces only a new one. */
export function stamp(k: StampKey) {
  const have = new Set(read().split(",").filter(Boolean))
  if (have.has(k)) return
  have.add(k)
  try {
    window.localStorage.setItem(KEY, [...have].join(","))
  } catch {
    // Storage blocked: the stamp still shows for this page view via the event.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: k }))
}

export function useStamps(): Set<StampKey> {
  const raw = useSyncExternalStore(subscribe, read, () => "")
  return useMemo(() => new Set(raw.split(",").filter(Boolean) as StampKey[]), [raw])
}

export function clearStamps() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

const FA = "۰۱۲۳۴۵۶۷۸۹"
const d = (n: number, l: Locale) => (l === "fa" ? String(n).replace(/\d/g, (x) => FA[Number(x)]) : String(n))

export function Passport({ locale }: { locale: Locale }) {
  const t = COPY[locale].passport
  const stamps = useStamps()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<StampKey | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const on = (e: Event) => {
      const k = (e as CustomEvent<StampKey>).detail
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

  const count = STAMP_ORDER.filter((k) => stamps.has(k)).length
  const full = count === STAMP_ORDER.length

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
                const I = STAMP_ICON[toast]
                return <I className="h-3.5 w-3.5" />
              })()}
            </motion.span>
            <span>+ {t.stamps[toast]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            id="ims24-passport"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-auto w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-v3-line bg-v3-ink/95 p-5 shadow-2xl backdrop-blur"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-v3-display text-xl text-v3-bone">{t.title}</p>
                <p className="text-xs text-v3-mute">{t.hint}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="rounded-full p-1 text-v3-mute hover:text-v3-bone">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-3">
              {STAMP_ORDER.map((k) => {
                const I = STAMP_ICON[k]
                const got = stamps.has(k)
                return (
                  <li key={k} className="flex flex-col items-center gap-1.5 text-center">
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full border-2 transition-all ${
                        got ? "-rotate-8 border-v3-light bg-v3-light/10 text-v3-light shadow-[0_0_24px_-6px_rgb(var(--v3-glow)/0.9)]" : "border-dashed border-v3-line text-v3-line"
                      }`}
                    >
                      <I className="h-6 w-6" />
                    </span>
                    <span className={`text-[11px] leading-tight ${got ? "text-v3-bone" : "text-v3-mute"}`}>{t.stamps[k]}</span>
                  </li>
                )
              })}
            </ul>
            {full && <p className="mt-4 border-t border-v3-line pt-3 text-sm leading-relaxed text-v3-light rtl:leading-loose">{t.complete}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ims24-passport"
        className={`pointer-events-auto flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm shadow-xl backdrop-blur transition-colors ${
          full ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line bg-v3-ink/90 text-v3-bone hover:border-v3-light"
        }`}
      >
        {full ? <BookUser className="h-4 w-4" /> : <Stamp className="h-4 w-4 text-v3-light" />}
        <span className="sr-only">{t.open}: </span>
        <span className="tabular-nums">
          {d(count, locale)}/{d(STAMP_ORDER.length, locale)}
        </span>
        <span aria-hidden className="flex gap-1">
          {STAMP_ORDER.map((k) => (
            <span key={k} className={`h-1.5 w-1.5 rounded-full ${stamps.has(k) ? (full ? "bg-v3-ink" : "bg-v3-light") : "bg-v3-line"}`} />
          ))}
        </span>
      </button>
    </div>
  )
}
