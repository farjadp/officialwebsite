"use client"

// ============================================================================
// File Path: src/components/v3/reports/deep-time-pain/widgets.tsx
// Why: The interactive figures of report 02. The report page is a server
//      component so every sentence is in the HTML; only these run in the
//      browser. Each renders a complete, readable default state on the server
//      and respects prefers-reduced-motion.
//
//      Time runs along the inline axis, so it mirrors with the language: in
//      English the past is on the left and now is on the right; in Persian the
//      past is on the right, as the page reads. Positions use inset-inline-*
//      for that reason, never left/right.
//
//      Colour rule, as on the rest of v3: the one light accent marks the
//      report's own thread — the stress axis and the survivors. Everything
//      else is bone and mute. Positions and widths are data, so they are the
//      only style values set outside Tailwind classes.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import { Play, RotateCcw } from "lucide-react"
import { useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { clockTime, digits, grouped, years } from "./fmt"
import {
  BEECHER,
  CIRCUITS,
  DAY_SECONDS,
  EVENTS,
  INJURIES,
  RULER,
  YEARS_PER_CLOCK_SECOND,
  ZOOM_STAGES,
  clockSeconds,
  type CircuitKey,
  type EventKey,
  type InjuryKey,
} from "./data"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function Fig({ children, className }: { children: string; className?: string }) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className ?? ""}`}>
      {children}
    </bdi>
  )
}

// ── 1. The nested zoom ──────────────────────────────────────────────────────

/**
 * Four windows, each ending at the present, each the sliver at the end of the
 * one before. Stepping in plays the sliver opening out to fill the band, from
 * the "now" edge, so the reader sees where the new window came from.
 */
export function DeepTimeZoom({ locale }: { locale: Locale }) {
  const t = COPY[locale].scale
  const names = COPY[locale].events
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [hover, setHover] = useState<EventKey | null>(null)
  const stage = ZOOM_STAGES[i]
  const next = ZOOM_STAGES[i + 1]
  const inWindow = EVENTS.filter((e) => stage.shows.includes(e.key) && e.age <= stage.span)
  const sliver = next ? next.span / stage.span : 0
  const prev = ZOOM_STAGES[i - 1]
  // How small this window was inside the last one — where the zoom starts from.
  const from = prev ? Math.max(stage.span / prev.span, 0.015) : 1

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-8">
      {/* Stage stepper */}
      <div className="flex flex-col gap-3">
        <span className="text-sm text-v3-mute">{t.zoomHint}</span>
        <div role="tablist" aria-label={t.zoomHint} className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {ZOOM_STAGES.map((s, k) => {
            const on = k === i
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setI(k)}
                className={`flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-xl border px-4 py-2 text-start transition-colors ${
                  on ? "border-v3-light bg-v3-light text-v3-ink" : k < i ? "border-v3-light/40 text-v3-light" : "border-v3-line text-v3-soft hover:border-v3-light/60 hover:text-v3-bone"
                }`}
              >
                <span className="text-xs tabular-nums opacity-70">{digits(`0${k + 1}`, locale)}</span>
                <span className="text-sm font-medium">{t.stages[s.key].name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* The band */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4 text-xs text-v3-mute">
          <span>
            {i === 0 ? t.birthLabel : `${years(stage.span, locale)} ${locale === "fa" ? "سال پیش" : "years ago"}`}
          </span>
          <span className="text-v3-light">{t.nowLabel} · <Fig>{digits("24:00", locale)}</Fig></span>
        </div>

        <div className="relative h-24 overflow-hidden rounded-xl bg-v3-raise md:h-28">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={stage.key}
              className="absolute inset-0 origin-right rtl:origin-left"
              initial={reduce ? { opacity: 0 } : { scaleX: from, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0.2 : 0.9, ease: ARRIVE }}
            >
              {/* Faint hour grid, so the band reads as a measured axis */}
              {Array.from({ length: 11 }, (_, k) => (
                <span
                  key={k}
                  aria-hidden
                  className="absolute inset-y-0 w-px bg-v3-line/50"
                  style={{ insetInlineStart: `${(k + 1) * (100 / 12)}%` }}
                />
              ))}

              {/* The sliver the next stage opens up */}
              {next && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 end-0 bg-v3-light/25 ring-1 ring-v3-light/70"
                  style={{ width: `max(3px, ${sliver * 100}%)` }}
                />
              )}

              {/* Event ticks */}
              {inWindow.map((e) => {
                const frac = 1 - e.age / stage.span
                const lit = hover === e.key
                return (
                  <span
                    key={e.key}
                    aria-hidden
                    className={`absolute inset-y-3 w-0.5 rounded-full transition-all duration-300 ${
                      e.accent ? "bg-v3-light shadow-[0_0_12px_rgb(var(--v3-glow)/0.8)]" : "bg-v3-bone/70"
                    } ${lit ? "inset-y-0 w-1 bg-v3-light" : ""}`}
                    style={{ insetInlineStart: `calc(${frac * 100}% - 1px)` }}
                  />
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={stage.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl text-lg leading-relaxed text-v3-bone rtl:leading-loose"
            aria-live="polite"
          >
            {t.stages[stage.key].reading}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* The events in this window, with their time on the clock */}
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {inWindow.map((e) => (
          <li key={e.key}>
            <button
              type="button"
              onPointerEnter={() => setHover(e.key)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(e.key)}
              onBlur={() => setHover(null)}
              className={`flex w-full items-baseline justify-between gap-4 rounded-xl border px-4 py-3 text-start transition-colors ${
                hover === e.key ? "border-v3-light/70 bg-v3-raise" : "border-v3-line/70"
              }`}
            >
              <span className="flex min-w-0 flex-col">
                <span className={`text-[15px] ${e.accent ? "text-v3-light" : "text-v3-bone"}`}>{names[e.key].name}</span>
                <span className="text-xs text-v3-mute">
                  {years(e.age, locale)} {locale === "fa" ? "سال پیش" : "years ago"}
                </span>
              </span>
              <Fig className={`shrink-0 font-v3-display text-xl ${e.accent ? "text-v3-light" : "text-v3-soft"}`}>
                {clockTime(e.age, locale)}
              </Fig>
            </button>
          </li>
        ))}
      </ul>

      <p className="text-sm text-v3-mute">
        {t.perSecond} <Fig>{grouped(Math.round(YEARS_PER_CLOCK_SECOND), locale)}</Fig> {locale === "fa" ? "سال" : "years"}
      </p>
    </div>
  )
}

// ── 2. One year, one millimetre ─────────────────────────────────────────────

const RULER_MIN = Math.log10(0.05)
const RULER_MAX = Math.log10(600_000)

function distance(m: number, locale: Locale): string {
  const fa = locale === "fa"
  if (m < 1) return `${digits(String(Math.round(m * 100)), locale)} ${fa ? "سانتی‌متر" : "cm"}`
  if (m < 1000) return `${digits(m.toFixed(m < 10 ? 1 : 0).replace(/\.0$/, ""), locale)} ${fa ? "متر" : "m"}`
  const km = m / 1000
  const shown = km < 10 ? km.toFixed(1).replace(/\.0$/, "") : grouped(Math.round(km), "en").replace(/,/g, fa ? "٬" : ",")
  return `${digits(shown, locale)} ${fa ? "کیلومتر" : "km"}`
}

/**
 * The ruler. Bar lengths are logarithmic — a linear 8 cm next to 500 km would
 * be invisible — and the reader is told so in the caption.
 */
export function YearRuler({ locale }: { locale: Locale }) {
  const t = COPY[locale].scale
  const names = COPY[locale].events
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()

  return (
    <ol ref={ref} className="flex flex-col">
      {RULER.map((r, i) => {
        const w = ((Math.log10(r.metres) - RULER_MIN) / (RULER_MAX - RULER_MIN)) * 100
        const lit = r.key === "lamprey" || r.key === "shanidar"
        return (
          <li
            key={r.key}
            className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-v3-line/50 py-4 md:grid-cols-[14rem_1fr_12rem] md:items-center"
          >
            <span className="flex flex-col">
              <span className={lit ? "text-v3-light" : "text-v3-bone"}>{names[r.key].name}</span>
              <span className="text-xs text-v3-mute">
                {years(r.key === "you" ? 80 : r.metres * 1000, locale)} {locale === "fa" ? "سال" : "years"}
              </span>
            </span>
            <span className="relative h-2.5 overflow-hidden rounded-full bg-v3-raise" aria-hidden>
              <motion.span
                className={`absolute inset-y-0 start-0 rounded-full ${lit ? "bg-v3-light" : "bg-v3-soft/60"}`}
                initial={reduce ? false : { width: 0 }}
                animate={inView || reduce ? { width: `${w}%` } : { width: 0 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: ARRIVE }}
                style={reduce ? { width: `${w}%` } : undefined}
              />
            </span>
            <span className="flex flex-col md:items-end md:text-end">
              {/* Number and unit together; an LTR isolate would put the Persian unit first. */}
              <span className={`font-v3-display text-2xl tabular-nums ${lit ? "text-v3-light" : "text-v3-bone"}`}>{distance(r.metres, locale)}</span>
              <span className="text-xs text-v3-mute">{t.rulerUnits[r.key]}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

// ── 3. Three circuits ───────────────────────────────────────────────────────

/**
 * Real latencies span three orders of magnitude, so the animation runs on a
 * log scale: adrenaline arrives almost at once, cortisol is visibly still
 * crawling when the others are done. The real figure is printed beside it.
 */
function animSeconds(real: number): number {
  return 0.8 + Math.log10(real) * 2.2
}

function realLatency(seconds: number, locale: Locale): string {
  const fa = locale === "fa"
  if (seconds < 60) return `≈ ${digits(String(seconds), locale)} ${fa ? "ثانیه" : "s"}`
  return `≈ ${digits(String(Math.round(seconds / 60)), locale)} ${fa ? "دقیقه" : "min"}`
}

export function CircuitRace({ locale }: { locale: Locale }) {
  const t = COPY[locale].circuits
  const reduce = useReducedMotion()
  const [run, setRun] = useState<Record<CircuitKey, number>>({ adrenaline: 0, cortisol: 0, analgesia: 0 })
  const [done, setDone] = useState<Record<CircuitKey, boolean>>({ adrenaline: false, cortisol: false, analgesia: false })

  const fire = (keys: CircuitKey[]) => {
    setDone((d) => ({ ...d, ...Object.fromEntries(keys.map((k) => [k, false])) }))
    setRun((r) => ({ ...r, ...Object.fromEntries(keys.map((k) => [k, r[k] + 1])) }))
  }

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-v3-mute">{t.hint}</span>
        <button
          type="button"
          onClick={() => fire(["adrenaline", "cortisol", "analgesia"])}
          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-v3-bone px-6 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light"
        >
          <Play className="h-4 w-4" aria-hidden />
          {locale === "fa" ? "هر سه را با هم فعال کن" : "Fire all three"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {CIRCUITS.map((c) => {
          const lane = t.lanes[c.key]
          const cortisol = c.key === "cortisol"
          const dur = reduce ? 0.01 : animSeconds(c.seconds)
          const n = lane.chain.length
          return (
            <div
              key={c.key}
              className={`flex flex-col gap-4 rounded-2xl border p-5 md:p-6 ${cortisol ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-v3-display text-2xl text-v3-bone">
                  {lane.name} <span className="text-base text-v3-mute">· {lane.timing}</span>
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-sm transition-colors ${done[c.key] ? "text-v3-light" : "text-v3-mute"}`} aria-live="polite">
                    {t.arrives} <span className="tabular-nums">{realLatency(c.seconds, locale)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => fire([c.key])}
                    aria-label={`${t.fire} · ${lane.name}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-v3-line px-4 text-sm text-v3-soft transition-colors hover:border-v3-light hover:text-v3-light"
                  >
                    {run[c.key] > 0 ? <RotateCcw className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
                    {run[c.key] > 0 ? t.reset : t.fire}
                  </button>
                </div>
              </div>

              {/* The chain, with a pulse running along it */}
              <div className="relative">
                <span aria-hidden className="absolute inset-x-4 top-[1.15rem] h-px bg-v3-line" />
                {run[c.key] > 0 && (
                  <motion.span
                    key={run[c.key]}
                    aria-hidden
                    className="absolute top-[1.15rem] h-px origin-left bg-v3-light shadow-[0_0_10px_rgb(var(--v3-glow)/0.9)] rtl:origin-right"
                    style={{ insetInlineStart: "1rem", insetInlineEnd: "1rem" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: dur, ease: "linear" }}
                    onAnimationComplete={() => setDone((d) => ({ ...d, [c.key]: true }))}
                  />
                )}
                <ol className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                  {lane.chain.map((node, k) => {
                    const last = k === n - 1
                    return (
                      <li key={k} className="flex flex-col items-center gap-2 text-center">
                        {/* The node lights when the pulse reaches it. The fill is an
                            overlay whose opacity animates, so both colours stay
                            theme tokens rather than hex framer would need to tween. */}
                        <motion.span
                          key={`${run[c.key]}-${k}`}
                          aria-hidden
                          className={`relative z-10 h-[0.6rem] w-[0.6rem] overflow-hidden rounded-full border ${last ? "border-v3-light" : "border-v3-soft/60"} bg-v3-ink`}
                          initial={false}
                          animate={run[c.key] > 0 ? { scale: [1, 1.6, 1] } : { scale: 1 }}
                          transition={{ duration: 0.5, delay: run[c.key] > 0 ? (dur * k) / (n - 1) : 0 }}
                          style={{ marginTop: "0.85rem" }}
                        >
                          <motion.span
                            className="absolute inset-0 bg-v3-light"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: run[c.key] > 0 ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: run[c.key] > 0 ? (dur * k) / (n - 1) : 0 }}
                          />
                        </motion.span>
                        <span className={`text-[11px] leading-snug md:text-xs ${last ? "font-medium text-v3-light" : "text-v3-soft"}`}>
                          {node}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>

              <p className="text-v3-soft leading-relaxed rtl:leading-loose">{lane.body}</p>
              {lane.note && (
                <p className="border-s-2 border-v3-light ps-4 text-sm leading-relaxed text-v3-bone rtl:leading-loose">{lane.note}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 4. Beecher, as people ───────────────────────────────────────────────────

/** A hundred people, the asking ones lit. Fills on arrival. */
function Hundred({ count, lit, label, locale }: { count: number; lit: boolean; label: string; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()
  const on = inView || reduce

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <span className={`font-v3-display text-6xl font-light md:text-7xl ${lit ? "text-v3-light" : "text-v3-bone"}`}>
          <span className="tabular-nums">{`${digits(String(count), locale)}${locale === "fa" ? "٪" : "%"}`}</span>
        </span>
      </div>
      <span className="text-v3-soft">{label}</span>
      <div className="grid grid-cols-10 gap-1.5" role="img" aria-label={`${count} / 100`}>
        {Array.from({ length: 100 }, (_, k) => {
          const asked = k < count
          return (
            <motion.span
              key={k}
              aria-hidden
              className={`aspect-square rounded-full ${asked ? (lit ? "bg-v3-light" : "bg-v3-bone") : "bg-v3-raise ring-1 ring-v3-line/60"}`}
              initial={reduce ? false : { opacity: 0.15, scale: 0.6 }}
              animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.6 }}
              transition={{ duration: 0.3, delay: asked ? k * 0.012 : 0.4 + k * 0.004 }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function BeecherDots({ locale }: { locale: Locale }) {
  const t = COPY[locale].beecher
  return (
    <div role="group" aria-label={t.title} className="grid gap-12 md:grid-cols-2 md:gap-16">
      <Hundred count={BEECHER.soldiers} lit label={t.soldiers} locale={locale} />
      <Hundred count={BEECHER.civilians} lit={false} label={t.civilians} locale={locale} />
    </div>
  )
}

// ── 5. Shanidar 1 ───────────────────────────────────────────────────────────

export function ShanidarBody({ locale }: { locale: Locale }) {
  const t = COPY[locale].shanidar
  const [sel, setSel] = useState<InjuryKey>("ear")
  const reduce = useReducedMotion()
  const order: InjuryKey[] = ["face", "ear", "arm", "leg"]
  const index = (k: InjuryKey) => digits(String(order.indexOf(k) + 1), locale)

  // Keyboard: arrows move between injuries, as in any single-select group.
  const onKey = (e: React.KeyboardEvent) => {
    const k = order.indexOf(sel)
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    e.preventDefault()
    setSel(order[(k + step + order.length) % order.length])
  }

  return (
    <div role="group" aria-label={t.title} className="grid gap-10 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-14">
      {/* The schematic figure. Drawn in the figure's own frame (not mirrored):
          the injuries are anatomical sides, so left must stay left. */}
      <div className="mx-auto w-full max-w-[15rem]" dir="ltr">
        <svg viewBox="0 0 200 300" className="h-auto w-full" role="img" aria-label={t.title}>
          <g className="stroke-v3-soft/70" strokeWidth="7" strokeLinecap="round" fill="none">
            <line x1="100" y1="72" x2="100" y2="170" />
            <line x1="100" y1="90" x2="140" y2="150" />
            <line x1="140" y1="150" x2="150" y2="200" />
            <line x1="100" y1="170" x2="125" y2="280" />
            <line x1="100" y1="170" x2="76" y2="280" />
          </g>
          {/* The withered right arm: a thin stump ending just above the elbow,
              dashed where the rest was lost. The figure faces the viewer, so
              its right is on our left. */}
          <line x1="100" y1="90" x2="78" y2="121" className="stroke-v3-soft/70" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="121" x2="58" y2="185" className="stroke-v3-mute" strokeWidth="3" strokeDasharray="4 5" />
          <circle cx="100" cy="44" r="26" className="fill-v3-raise stroke-v3-soft/70" strokeWidth="3" />

          {INJURIES.map((inj) => {
            const on = sel === inj.key
            return (
              <g key={inj.key}>
                {on && !reduce && (
                  <motion.circle
                    cx={inj.x}
                    cy={inj.y}
                    r={11}
                    className="fill-v3-light"
                    animate={{ r: [11, 22, 11], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={inj.x}
                  cy={inj.y}
                  r={11}
                  className={on ? "fill-v3-light" : "fill-v3-mute"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSel(inj.key)}
                />
                <text
                  x={inj.x}
                  y={inj.y + 4.5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  className="pointer-events-none fill-v3-ink"
                >
                  {index(inj.key)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex flex-col gap-5">
        <span className="text-sm text-v3-mute">{t.hint}</span>
        <div role="radiogroup" aria-label={t.hint} onKeyDown={onKey} className="flex flex-col gap-2">
          {order.map((k) => {
            const on = sel === k
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                onClick={() => setSel(k)}
                className={`flex min-h-12 items-center gap-4 rounded-xl border px-4 py-3 text-start transition-colors ${
                  on ? "border-v3-light/70 bg-v3-raise" : "border-v3-line/70 hover:border-v3-light/40"
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    on ? "bg-v3-light text-v3-ink" : "bg-v3-line text-v3-soft"
                  }`}
                >
                  {index(k)}
                </span>
                <span className={on ? "text-v3-bone" : "text-v3-soft"}>{t.injuries[k].short}</span>
              </button>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={sel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[7rem] text-lg leading-relaxed text-v3-bone rtl:leading-loose"
            aria-live="polite"
          >
            {t.injuries[sel].body}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── 6. Hero clock strip ─────────────────────────────────────────────────────

/**
 * The 24-hour band under the hero figure: the lamprey mark at 21:21 and our
 * species squeezed into the last few pixels. The sapiens mark is widened to
 * stay visible, and the caption says so.
 */
export function HeroClock({ locale }: { locale: Locale }) {
  const t = COPY[locale].scale
  const names = COPY[locale].events
  const reduce = useReducedMotion()
  const marks: EventKey[] = ["cambrian", "lamprey", "kpg", "sapiens"]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-xs text-v3-mute">
        <span>
          <Fig>{digits("00:00", locale)}</Fig> · {t.birthLabel}
        </span>
        <span className="text-v3-light">
          <Fig>{digits("24:00", locale)}</Fig> · {t.nowLabel}
        </span>
      </div>
      <div className="relative h-12 overflow-hidden rounded-xl bg-v3-raise">
        <motion.span
          aria-hidden
          className="absolute inset-y-0 start-0 bg-linear-to-r from-v3-line/0 to-v3-line/60 rtl:bg-linear-to-l"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: ARRIVE, delay: 0.3 }}
        />
        {marks.map((k) => {
          const e = EVENTS.find((x) => x.key === k)!
          const frac = clockSeconds(e.age) / DAY_SECONDS
          return (
            <span
              key={k}
              title={`${names[k].name} · ${clockTime(e.age, locale)}`}
              className={`absolute inset-y-0 ${e.accent ? "w-[3px] bg-v3-light shadow-[0_0_14px_rgb(var(--v3-glow)/0.9)]" : "w-px bg-v3-bone/50"}`}
              style={{ insetInlineStart: k === "sapiens" ? "calc(100% - 3px)" : `${frac * 100}%` }}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-v3-mute">
        <span>
          <span className="text-v3-light">{names.lamprey.name}</span> · <Fig>{clockTime(EVENTS.find((e) => e.key === "lamprey")!.age, locale)}</Fig>
        </span>
        <span>
          <span className="text-v3-light">{names.sapiens.name}</span> · <Fig>{clockTime(EVENTS.find((e) => e.key === "sapiens")!.age, locale)}</Fig>
        </span>
      </div>
    </div>
  )
}
