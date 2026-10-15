"use client"

// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/game.tsx
// Why: The four-level guessing game of report 05, after Farjad's draft: two
//      head-to-head levels, a slider estimate, and a gender level. Points,
//      ranks, badges and a streak; a missed card comes back at the end of the
//      queue for half points, so every level ends with every answer seen
//      (the pretesting effect the copy cites). Values are read from the same
//      COUNTRIES rows as the charts. Progress lives in localStorage only.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Flame, Hash, Lock, Percent, RotateCcw, Target, Trophy, Venus } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { LEVEL_COUNT, LEVEL_EST, LEVEL_GENDER, LEVEL_SHARE, byIso, flag, type CountryRow, type EstItem, type VsItem } from "./data"
import { dg, fx, nameOf, pc, people } from "./fmt"
import { stamp } from "./passport"

const KEY = "farjadp:ims24:game"
const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

type Kind = "count" | "share" | "est" | "gender"
const LEVELS: { kind: Kind; items: (VsItem | EstItem)[]; icon: ComponentType<{ className?: string }> }[] = [
  { kind: "count", items: LEVEL_COUNT, icon: Hash },
  { kind: "share", items: LEVEL_SHARE, icon: Percent },
  { kind: "est", items: LEVEL_EST, icon: Target },
  { kind: "gender", items: LEVEL_GENDER, icon: Venus },
]
const MAX_XP = LEVELS.reduce((s, l) => s + l.items.length * 10, 0)
const RANK_AT = [0, 60, 130, 190]

type Saved = { xp: number; done: boolean[]; cur: number }
const blank = (): Saved => ({ xp: 0, done: [false, false, false, false], cur: 0 })

function load(): Saved {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? "null")
    if (v && typeof v.xp === "number" && Array.isArray(v.done)) return v
  } catch {}
  return blank()
}
function save(s: Saved) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}

function valueOf(kind: Kind, r: CountryRow): number {
  if (kind === "count") return r[4][7]
  if (kind === "share") return r[6]
  return r[7] ?? 0
}

function Burst() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-v3-light"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 50, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )
      })}
    </span>
  )
}

export function MigrantGame({ locale }: { locale: Locale }) {
  const t = COPY[locale].game
  const reduce = useReducedMotion()
  const [s, setS] = useState<Saved>(blank)
  const [queue, setQueue] = useState<number[]>([])
  const [missed, setMissed] = useState<Set<number>>(new Set())
  const [answer, setAnswer] = useState<{ ok: boolean; pts: number; pick?: string; guess?: number } | null>(null)
  const [finished, setFinished] = useState<{ first: boolean } | null>(null)
  const [guess, setGuess] = useState(0)
  const [streak, setStreak] = useState(0)
  const [armed, setArmed] = useState(false)
  const stage = useRef<HTMLDivElement>(null)

  const level = LEVELS[s.cur]

  const start = useCallback((cur: number, base?: Saved) => {
    setS((prev) => {
      const next = { ...(base ?? prev), cur }
      save(next)
      return next
    })
    setQueue(LEVELS[cur].items.map((_, i) => i))
    setMissed(new Set())
    setAnswer(null)
    setFinished(null)
    const first = LEVELS[cur].items[0]
    if ("min" in first) setGuess(Number(((first.min + first.max) / 2).toFixed(1)))
  }, [])

  useEffect(() => {
    const saved = load()
    // Initialise from storage after hydration so the server HTML matches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    start(saved.cur, saved)
  }, [start])

  const update = (fn: (p: Saved) => Saved) =>
    setS((p) => {
      const n = fn(p)
      save(n)
      return n
    })

  const idx = queue[0]
  const item = idx === undefined ? undefined : level.items[idx]

  function award(ok: boolean, pts: number) {
    if (ok) setStreak((k) => k + 1)
    else setStreak(0)
    if (pts && !s.done[s.cur]) update((p) => ({ ...p, xp: Math.min(MAX_XP, p.xp + pts) }))
  }

  function pickVs(iso: string, it: VsItem) {
    if (answer) return
    const a = byIso(it.a) as CountryRow
    const b = byIso(it.b) as CountryRow
    const win = valueOf(level.kind, a) >= valueOf(level.kind, b) ? it.a : it.b
    const ok = iso === win
    const pts = ok ? (missed.has(idx) ? 5 : 10) : 0
    if (!ok) setMissed((m) => new Set(m).add(idx))
    award(ok, pts)
    setAnswer({ ok, pts, pick: iso })
  }

  function submitEst(it: EstItem) {
    if (answer) return
    const rel = Math.abs(guess - it.ans) / (it.max - it.min)
    const pts = rel <= 0.03 ? 10 : rel <= 0.08 ? 7 : rel <= 0.15 ? 4 : 0
    if (!pts) setMissed((m) => new Set(m).add(idx))
    award(pts > 0, pts)
    setAnswer({ ok: pts > 0, pts, guess })
  }

  function next() {
    if (!answer) return
    const rest = answer.ok ? queue.slice(1) : [...queue.slice(1), queue[0]]
    setAnswer(null)
    if (!rest.length) {
      const first = !s.done[s.cur]
      const done = s.done.map((d, i) => d || i === s.cur)
      update((p) => ({ ...p, done }))
      if (done.every(Boolean)) stamp("quiz")
      setQueue([])
      setFinished({ first })
      return
    }
    setQueue(rest)
    const n = level.items[rest[0]]
    if ("min" in n) setGuess(Number(((n.min + n.max) / 2).toFixed(1)))
    stage.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" })
  }

  const rankIdx = RANK_AT.reduce((r, at, i) => (s.xp >= at ? i : r), 0)
  const nextAt = RANK_AT[rankIdx + 1]
  const unit = (v: number) => (level.kind === "count" ? people(v, locale) : pc(v, locale))
  const nextLevel = s.done.findIndex((d) => !d)

  return (
    <div className="overflow-hidden rounded-3xl border border-v3-line bg-v3-ink">
      {/* HUD */}
      <div className="grid gap-4 border-b border-v3-line bg-v3-raise px-5 py-4 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:px-7">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-v3-light text-v3-light">
            <Trophy className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs text-v3-mute">{t.rankLabel}</p>
            <p className="font-v3-display text-2xl leading-tight text-v3-bone">{t.ranks[rankIdx]}</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="h-2.5 overflow-hidden rounded-full bg-v3-line">
            <motion.div className="h-full rounded-full bg-v3-light shadow-[0_0_12px_rgb(var(--v3-glow)/0.8)]" animate={{ width: `${(s.xp / MAX_XP) * 100}%` }} transition={{ duration: 0.6, ease: ARRIVE }} />
          </div>
          <div className="flex justify-between gap-3 text-xs tabular-nums text-v3-mute">
            <span>
              {dg(String(s.xp), locale)} {t.of} {dg(String(MAX_XP), locale)} {t.points}
            </span>
            <span>{nextAt !== undefined ? t.next(t.ranks[rankIdx + 1], dg(String(nextAt), locale)) : t.top}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l, i) => {
              const I = l.icon
              const got = s.done[i]
              return (
                <span
                  key={i}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${got ? "border-v3-light bg-v3-light/10 text-v3-light" : "border-dashed border-v3-line text-v3-mute"}`}
                >
                  {got ? <I className="h-3 w-3" aria-hidden /> : <Lock className="h-3 w-3" aria-hidden />}
                  {t.levels[i].badge}
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {streak >= 2 && (
              <motion.span
                key={streak}
                initial={reduce ? false : { scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 rounded-full bg-v3-light px-2.5 py-1 text-xs font-semibold tabular-nums text-v3-ink"
              >
                <Flame className="h-3.5 w-3.5" aria-hidden />
                {dg(String(streak), locale)} {t.streak}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => {
              if (!armed) {
                setArmed(true)
                window.setTimeout(() => setArmed(false), 3000)
                return
              }
              setArmed(false)
              setStreak(0)
              start(0, blank())
            }}
            className="flex items-center gap-1.5 rounded-full border border-v3-line px-3 py-1.5 text-xs text-v3-soft hover:border-v3-light"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            {armed ? t.resetConfirm : t.reset}
          </button>
        </div>
      </div>

      {/* Level tabs */}
      <div role="tablist" className="grid grid-cols-2 border-b border-v3-line md:grid-cols-4">
        {LEVELS.map((l, i) => {
          const I = l.icon
          const on = s.cur === i
          return (
            <button
              key={i}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => start(i)}
              className={`relative flex flex-col items-start gap-0.5 border-v3-line px-4 py-3 text-start transition-colors max-md:odd:border-e md:not-last:border-e max-md:[&:nth-child(-n+2)]:border-b ${
                on ? "bg-v3-light/10" : "hover:bg-v3-raise"
              }`}
            >
              {on && <motion.span layoutId="ims-level" className="absolute inset-x-0 bottom-0 h-0.5 bg-v3-light" />}
              <span className="flex items-center gap-1.5 text-xs text-v3-mute">
                <I className="h-3.5 w-3.5" aria-hidden />
                {t.level} {dg(String(i + 1), locale)}
                {s.done[i] && <span className="text-v3-light">· {t.done}</span>}
              </span>
              <span className="text-sm font-medium text-v3-bone">{t.levels[i].name}</span>
              <span className="hidden text-xs text-v3-mute sm:block">{t.levels[i].sub}</span>
            </button>
          )
        })}
      </div>

      {/* Stage */}
      <div ref={stage} className="flex min-h-[22rem] flex-col gap-6 px-5 py-7 md:px-8">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div key="done" initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-start gap-4">
              <motion.span
                initial={reduce ? false : { rotate: -40, scale: 0.2 }}
                animate={{ rotate: -8, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="grid h-20 w-20 place-items-center rounded-full border-4 border-v3-light bg-v3-light/10 text-v3-light shadow-[0_0_60px_-10px_rgb(var(--v3-glow)/0.9)]"
              >
                {(() => {
                  const I = level.icon
                  return <I className="h-9 w-9" />
                })()}
              </motion.span>
              <p className="font-v3-display text-3xl text-v3-bone">{t.levelDone(t.levels[s.cur].name)}</p>
              <p className="text-v3-soft">{finished.first ? t.badgeGot(t.levels[s.cur].badge) : t.replayNote}</p>
              <div className="flex flex-wrap gap-3">
                {nextLevel >= 0 && (
                  <button type="button" onClick={() => start(nextLevel)} className="rounded-full bg-v3-light px-5 py-2.5 text-sm font-semibold text-v3-ink">
                    {t.goNext(t.levels[nextLevel].name)}
                  </button>
                )}
                <button type="button" onClick={() => start(s.cur)} className="rounded-full border border-v3-line px-5 py-2.5 text-sm text-v3-bone hover:border-v3-light">
                  {t.again}
                </button>
              </div>
              {nextLevel < 0 && (
                <div className="mt-2 max-w-2xl rounded-2xl border border-v3-light/50 bg-v3-light/10 p-5">
                  <p className="font-semibold text-v3-light">{t.allDone.title}</p>
                  <p className="mt-1 leading-relaxed text-v3-bone rtl:leading-loose">{t.allDone.body}</p>
                </div>
              )}
            </motion.div>
          ) : item ? (
            <motion.div
              key={`${s.cur}-${idx}-${queue.length}`}
              initial={reduce ? false : { opacity: 0, x: locale === "fa" ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: locale === "fa" ? 24 : -24 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <p className="text-xs tabular-nums text-v3-mute">{t.question(dg(String(level.items.length - queue.length + 1), locale), dg(String(level.items.length), locale))}</p>
              {"a" in item ? (
                <>
                  <p className="max-w-2xl text-lg text-v3-bone">{t.levels[s.cur].ctx}</p>
                  <div className="grid max-w-2xl grid-cols-[1fr_auto_1fr] items-stretch gap-3">
                    {(idx % 2 ? [item.b, item.a] : [item.a, item.b]).map((iso, k) => {
                      const r = byIso(iso) as CountryRow
                      const other = byIso(iso === item.a ? item.b : item.a) as CountryRow
                      const win = valueOf(level.kind, r) >= valueOf(level.kind, other)
                      const state = !answer ? "idle" : win ? "right" : answer.pick === iso ? "wrong" : "idle"
                      const card = (
                        <motion.button
                          key={iso}
                          type="button"
                          disabled={!!answer}
                          onClick={() => pickVs(iso, item)}
                          whileHover={answer || reduce ? undefined : { y: -4 }}
                          whileTap={answer || reduce ? undefined : { scale: 0.97 }}
                          animate={state === "wrong" && !reduce ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                          transition={{ duration: 0.4 }}
                          className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 text-center transition-colors ${
                            state === "right"
                              ? "border-v3-light bg-v3-light/10"
                              : state === "wrong"
                                ? "border-v3-mute bg-v3-raise opacity-80"
                                : "border-v3-line bg-v3-raise hover:border-v3-light/70"
                          }`}
                        >
                          {state === "right" && answer?.ok && !reduce && <Burst />}
                          <span aria-hidden className="text-4xl leading-none md:text-5xl">
                            {flag(iso)}
                          </span>
                          <span className="font-medium text-v3-bone">{nameOf(r, locale)}</span>
                          <span className={`min-h-[1.5em] text-sm tabular-nums ${state === "right" ? "text-v3-light" : "text-v3-mute"}`}>{answer ? unit(valueOf(level.kind, r)) : ""}</span>
                        </motion.button>
                      )
                      return k === 0 ? (
                        [card, <span key="or" className="self-center text-sm text-v3-mute">{t.or}</span>]
                      ) : (
                        card
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="flex max-w-xl flex-col gap-4">
                  <p className="text-lg text-v3-bone">{t.est[item.key].q}</p>
                  <span className="font-v3-display text-5xl tabular-nums text-v3-light">{item.unit === "×" ? `${fx(guess, locale)}×` : pc(guess, locale)}</span>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={guess}
                    disabled={!!answer}
                    dir="ltr"
                    onChange={(e) => setGuess(Number(e.target.value))}
                    aria-label={t.est[item.key].q}
                    className="w-full accent-(--v3-accent)"
                  />
                  {answer && (
                    <div className="relative h-6" dir="ltr" aria-hidden>
                      <motion.span
                        initial={reduce ? false : { scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className="absolute top-0 h-6 w-0.5 bg-v3-light"
                        style={{ left: `${((item.ans - item.min) / (item.max - item.min)) * 100}%` }}
                      />
                      <span className="absolute top-0 -translate-x-1/2 rounded bg-v3-light px-1.5 text-[10px] text-v3-ink" style={{ left: `${((item.ans - item.min) / (item.max - item.min)) * 100}%` }}>
                        {item.unit === "×" ? `${fx(item.ans, locale)}×` : pc(item.ans, locale)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs tabular-nums text-v3-mute" dir="ltr">
                    <span>{item.unit === "×" ? `${fx(item.min, locale)}×` : pc(item.min, locale, 0)}</span>
                    <span>{item.unit === "×" ? `${fx(item.max, locale)}×` : pc(item.max, locale, 0)}</span>
                  </div>
                  {!answer && (
                    <button type="button" onClick={() => submitEst(item)} className="self-start rounded-full bg-v3-light px-5 py-2.5 text-sm font-semibold text-v3-ink">
                      {t.submit}
                    </button>
                  )}
                </div>
              )}

              {answer && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-2xl flex-col gap-4">
                  <div className={`rounded-2xl border p-4 ${answer.ok ? "border-v3-light/60 bg-v3-light/10" : "border-v3-line bg-v3-raise"}`} role="status">
                    <p className={`font-semibold ${answer.ok ? "text-v3-light" : "text-v3-bone"}`}>
                      {"key" in item
                        ? `${t.actual}: ${item.unit === "×" ? `${fx(item.ans, locale)}×` : pc(item.ans, locale)} · ${answer.pts ? `+${dg(String(answer.pts), locale)}` : t.tryAgain}`
                        : answer.ok
                          ? t.right(dg(String(answer.pts), locale))
                          : t.wrong}
                    </p>
                    <p className="mt-1 leading-relaxed text-v3-soft rtl:leading-loose">
                      {"key" in item ? t.est[item.key].why : t.why[level.kind as "count" | "share" | "gender"][idx]}
                    </p>
                  </div>
                  <button type="button" onClick={next} autoFocus className="self-start rounded-full bg-v3-light px-5 py-2.5 text-sm font-semibold text-v3-ink">
                    {t.cont}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
