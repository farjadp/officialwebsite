"use client"

// ============================================================================
// File Path: src/components/v3/reports/undecided-fifth/widgets.tsx
// Why: The interactive figures of report 08: the rebuilt Pew chart, the
//      margin plot, the undecided ranking and the "how lopsided" slider, the
//      party stacks, the 2022/2026 engagement switch, the guessing game and
//      the uniform-swing map explorer. The page is a server component so
//      every sentence is in the HTML; these render a complete default state
//      on the server, respect reduced motion and use v3 tokens (party colours
//      are --v3-dem / --v3-rep, the undecided are the accent). Each awards
//      its badge the first time a reader uses it. Charts with a numeric axis
//      and the tile map stay left-to-right in Persian too.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useMemo, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import {
  BREAK_EVEN,
  DEMOGRAPHIC,
  ENGAGE_KEYS,
  ENGAGEMENT,
  GRID,
  GROUPS,
  MAP_OPTIONS,
  PARTY_STACKS,
  QUESTIONS,
  STATES_2024,
  TOSSUP,
  baseMargin,
  breakUndecided,
  countPoints,
  flips,
  group,
  margin,
  modelMargin,
  swingFor,
  tally,
  type Block,
  type GroupKey,
  type Year,
} from "./data"
import { medal } from "./medals"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const FA = "۰۱۲۳۴۵۶۷۸۹"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"

export const dg = (s: string, l: Locale) => (l === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]).replace(/\./g, "٫").replace(/,/g, "٬") : s)
const pc = (v: number, l: Locale) => (l === "fa" ? `${dg(String(Math.round(v)), l)}٪` : `${Math.round(v)}%`)
const minus = (v: number) => (v < 0 ? "−" : "+")

/** "D+8" / "R+4.0" / "Even", in the reader's script. */
function lean(m: number, l: Locale, dp = 0) {
  const p = COPY[l].party
  const a = Math.abs(m)
  if (a < (dp ? 0.05 : 0.5)) return p.even
  const n = dg(a.toFixed(dp), l)
  // In Persian an LRM keeps the sign before the number ("+۸", not "۸+").
  return l === "fa" ? `${m > 0 ? p.demShort : p.repShort} \u200E+${n}` : `${m > 0 ? p.demShort : p.repShort}+${n}`
}

/** A signed shift in points, "+16.0" / "−8.5". */
const shiftText = (v: number, l: Locale) => (l === "fa" ? "\u200E" : "") + dg(`${minus(v)}${Math.abs(v).toFixed(1)}`, l)

const BLOCKS: Block[] = ["all", "gender", "race", "age", "edu", "party"]

// ── 1. The rebuilt chart ────────────────────────────────────────────────────

export function PreferenceChart({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const t = c.chart
  const reduce = useReducedMotion()
  const [sel, setSel] = useState<GroupKey>("all")
  const g = group(sel)
  const MAX = 92

  const pick = (k: GroupKey) => {
    setSel(k)
    if (k !== "all") medal("chart")
  }

  return (
    <figure className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-v3-display text-2xl text-v3-bone">{t.heading}</h3>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-v3-soft">
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-v3-dem" aria-hidden />
            {c.party.dem}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-v3-rep" aria-hidden />
            {c.party.rep}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-v3-light" aria-hidden />
            {c.party.und}
          </li>
        </ul>
      </div>

      <p role="status" aria-live="polite" className="min-h-14 rounded-2xl border border-v3-light/40 bg-v3-light/5 px-4 py-3 text-sm leading-relaxed text-v3-bone md:text-base rtl:leading-loose">
        {t.readout(c.groups[sel], pc(g.dem, locale), pc(g.rep, locale), pc(g.und, locale), lean(margin(g), locale))}
      </p>

      <div className="flex flex-col gap-1">
        {BLOCKS.map((b) => (
          <div key={b} className="flex flex-col gap-1">
            {b !== "all" && <p className="mt-4 mb-1 text-xs tracking-wide text-v3-mute uppercase rtl:normal-case">{c.blocks[b]}</p>}
            {GROUPS.filter((r) => r.block === b).map((r, i) => {
              const on = r.key === sel
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => pick(r.key)}
                  onMouseEnter={() => setSel(r.key)}
                  aria-pressed={on}
                  className={`grid grid-cols-[4.5rem_1fr_1fr_2.25rem] items-center gap-x-0 rounded-lg py-0.5 text-start text-xs md:text-sm transition-colors md:grid-cols-[11rem_1fr_1fr_3.5rem] ${on ? "bg-v3-light/10" : "hover:bg-v3-line/30"}`}
                >
                  <span className={`pe-2 text-end leading-tight ${r.sub ? "text-v3-mute italic" : "text-v3-bone"} ${on ? "font-semibold" : ""}`}>{c.groups[r.key]}</span>
                  <span className="flex items-center justify-end border-e-2 border-v3-bone/70">
                    <span className="w-7 shrink-0 pe-1 text-end text-xs text-v3-soft tabular-nums">{dg(String(r.dem), locale)}</span>
                    <span className="flex flex-1 justify-end">
                      <motion.span
                        initial={reduce ? false : { width: 0 }}
                        whileInView={{ width: `${(r.dem / MAX) * 100}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.7, delay: i * 0.03, ease: ARRIVE }}
                        style={reduce ? { width: `${(r.dem / MAX) * 100}%` } : undefined}
                        className="block h-6 min-w-0.5 rounded-s-sm bg-v3-dem"
                      />
                    </span>
                  </span>
                  <span className="flex items-center justify-start">
                    <span className="flex flex-1 justify-start">
                      <motion.span
                        initial={reduce ? false : { width: 0 }}
                        whileInView={{ width: `${(r.rep / MAX) * 100}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.7, delay: i * 0.03, ease: ARRIVE }}
                        style={reduce ? { width: `${(r.rep / MAX) * 100}%` } : undefined}
                        className="block h-6 min-w-0.5 rounded-e-sm bg-v3-rep"
                      />
                    </span>
                    <span className="w-7 shrink-0 ps-1 text-start text-xs text-v3-soft tabular-nums">{dg(String(r.rep), locale)}</span>
                  </span>
                  <span className={`ms-2 rounded-sm py-0.5 text-center text-xs font-semibold tabular-nums ${on ? "bg-v3-light text-v3-ink" : "bg-v3-light/20 text-v3-bone"}`}>{dg(String(r.und), locale)}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</figcaption>
    </figure>
  )
}

// ── 2. The margin plot ──────────────────────────────────────────────────────

export function MarginPlot({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const t = c.margins
  const reduce = useReducedMotion()
  const [sorted, setSorted] = useState(true)
  const rows = useMemo(() => {
    const r = DEMOGRAPHIC.map((g) => ({ key: g.key, m: margin(g) }))
    return sorted ? [...r].sort((a, b) => b.m - a.m) : r
  }, [sorted])
  const MIN = -22
  const MAX = 72
  const x = (v: number) => ((v - MIN) / (MAX - MIN)) * 100

  const flip = (v: boolean) => {
    setSorted(v)
    medal("margins")
  }

  return (
    <figure className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex max-w-xl flex-col gap-1">
          <h3 className="font-v3-display text-2xl text-v3-bone">{t.heading}</h3>
          <p className="text-sm text-v3-soft">{t.sub}</p>
        </div>
        <div role="radiogroup" aria-label={t.heading} className="inline-flex rounded-full border border-v3-line p-1">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              role="radio"
              aria-checked={sorted === v}
              onClick={() => flip(v)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${sorted === v ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"}`}
            >
              {sorted === v && <motion.span layoutId="margin-pill" className="absolute inset-0 rounded-full bg-v3-light" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{v ? t.byMargin : t.byGroup}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col">
        {rows.map((r) => {
          const tone = r.m > 0 ? "bg-v3-dem" : r.m < 0 ? "bg-v3-rep" : "bg-v3-mute"
          const lo = Math.min(x(0), x(r.m))
          const w = Math.abs(x(r.m) - x(0))
          return (
            <motion.li key={r.key} layout={!reduce} transition={{ duration: 0.5, ease: ARRIVE }} className="grid grid-cols-[minmax(5.5rem,9rem)_1fr] items-center gap-3 py-1 text-sm md:grid-cols-[11rem_1fr]">
              <span className={`truncate text-end ${r.key === "all" ? "font-semibold text-v3-bone" : "text-v3-soft"}`}>{c.groups[r.key]}</span>
              <span className="relative h-6" dir="ltr">
                <span className="absolute inset-y-0 w-0.5 bg-v3-bone/70" style={{ left: `${x(0)}%` }} aria-hidden />
                <motion.span
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: ARRIVE }}
                  className={`absolute top-1/2 h-1 -translate-y-1/2 rounded-full ${tone} ${r.m >= 0 ? "origin-left" : "origin-right"}`}
                  style={{ left: `${lo}%`, width: `${w}%` }}
                  aria-hidden
                />
                <span className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-v3-ink ${tone}`} style={{ left: `${x(r.m)}%` }} aria-hidden />
                <span
                  className={`absolute top-1/2 -translate-y-1/2 px-2.5 text-xs font-semibold text-v3-bone tabular-nums ${r.m >= 0 ? "" : "-translate-x-full"}`}
                  style={{ left: `${x(r.m)}%` }}
                >
                  {dg(r.m === 0 ? "0" : `${minus(r.m)}${Math.abs(r.m)}`, locale)}
                </span>
              </span>
            </motion.li>
          )
        })}
      </ul>
      <div className="grid grid-cols-[minmax(5.5rem,9rem)_1fr] gap-3 text-xs text-v3-mute md:grid-cols-[11rem_1fr]">
        <span />
        <span className="relative flex justify-between" dir="ltr">
          <span>← {c.party.rep}</span>
          <span>{c.party.dem} →</span>
        </span>
      </div>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</figcaption>
    </figure>
  )
}

// ── 3a. The undecided ranking ───────────────────────────────────────────────

export function UndecidedRank({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const reduce = useReducedMotion()
  const rows = useMemo(() => [...GROUPS].sort((a, b) => b.und - a.und), [])
  return (
    <figure className="flex flex-col gap-5 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-8">
      <h3 className="font-v3-display text-2xl text-v3-bone">{c.pool.rankTitle}</h3>
      <ul className="flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <li key={r.key} className="grid grid-cols-[minmax(5.5rem,9rem)_1fr_3rem] items-center gap-3 text-sm md:grid-cols-[11rem_1fr_3.5rem]">
            <span className={`truncate text-end ${r.key === "all" ? "font-semibold text-v3-bone" : r.sub ? "text-v3-mute italic" : "text-v3-soft"}`}>{c.groups[r.key]}</span>
            <span className="h-4">
              <motion.span
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: `${(r.und / 40) * 100}%` }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: i * 0.025, ease: ARRIVE }}
                style={reduce ? { width: `${(r.und / 40) * 100}%` } : undefined}
                className={`block h-full rounded-sm ${r.key === "all" ? "bg-v3-light" : "bg-v3-light/45"}`}
              />
            </span>
            <span className="text-xs font-semibold text-v3-bone tabular-nums">{pc(r.und, locale)}</span>
          </li>
        ))}
      </ul>
      <figcaption className="text-xs text-v3-mute">{c.pool.rankCaption}</figcaption>
    </figure>
  )
}

// ── 3b. How lopsided would the undecided have to break? ─────────────────────

export function BreakSlider({ locale }: { locale: Locale }) {
  const t = COPY[locale].pool
  const reduce = useReducedMotion()
  const [toRep, setToRep] = useState(50)
  const r = breakUndecided(toRep / 100)
  const other = 100 - r.dem - r.rep
  const tied = Math.abs(r.margin) < 0.2

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-v3-light/50 bg-v3-raise p-5 md:p-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-v3-display text-2xl text-v3-bone">{t.breakTitle}</h3>
        <p className="max-w-3xl leading-relaxed text-v3-soft rtl:leading-loose">{t.breakLead}</p>
      </div>
      <label className="flex flex-col gap-3">
        <span className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-v3-soft">
          <span>{t.slider}</span>
          <span className="font-v3-display text-3xl text-v3-light tabular-nums">{t.toRep(pc(toRep, locale))}</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={toRep}
          onChange={(e) => {
            setToRep(Number(e.target.value))
            medal("pool")
          }}
          className="w-full accent-(--v3-accent)"
        />
      </label>
      <div className="flex h-10 overflow-hidden rounded-lg" dir="ltr" aria-hidden>
        <motion.span animate={{ width: `${r.dem}%` }} transition={reduce ? { duration: 0 } : { duration: 0.25 }} className="flex items-center justify-start bg-v3-dem ps-2 text-sm font-semibold text-v3-ink tabular-nums">
          {dg(r.dem.toFixed(1), locale)}
        </motion.span>
        <span className="flex items-center justify-center bg-v3-line text-xs text-v3-soft" style={{ width: `${other}%` }}>
          {dg(String(other), locale)}
        </span>
        <motion.span animate={{ width: `${r.rep}%` }} transition={reduce ? { duration: 0 } : { duration: 0.25 }} className="flex items-center justify-end bg-v3-rep pe-2 text-sm font-semibold text-v3-ink tabular-nums">
          {dg(r.rep.toFixed(1), locale)}
        </motion.span>
      </div>
      <p role="status" aria-live="polite" className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <span className="text-v3-soft">{t.readout(dg(r.dem.toFixed(1), locale), dg(r.rep.toFixed(1), locale))}</span>
        <span className={`font-v3-display text-2xl ${tied ? "text-v3-light" : r.margin > 0 ? "text-v3-dem" : "text-v3-rep"}`}>{tied ? t.tied : t.leadLabel(lean(r.margin, locale, 1))}</span>
      </p>
      <div className="flex flex-col gap-2 border-t border-v3-line pt-4 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
        <p className="text-v3-bone">{t.breakEven(pc(BREAK_EVEN * 100, locale))}</p>
        <p>{t.breakNote}</p>
      </div>
    </div>
  )
}

// ── 4. Party stacks ─────────────────────────────────────────────────────────

export function PartyStacks({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const reduce = useReducedMotion()
  return (
    <figure className="flex flex-col gap-5 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-8">
      <ul className="flex flex-col gap-3">
        {PARTY_STACKS.map((k, i) => {
          const g = group(k)
          const tot = g.dem + g.und + g.rep
          const seg = (v: number, cls: string) => (
            <span className={`flex items-center justify-center overflow-hidden text-xs font-semibold tabular-nums ${cls}`} style={{ width: `${(v / tot) * 100}%` }}>
              {v >= 7 ? dg(String(v), locale) : ""}
            </span>
          )
          return (
            <li key={k} className="grid grid-cols-[minmax(5.5rem,9rem)_1fr] items-center gap-3 text-sm md:grid-cols-[11rem_1fr]">
              <span className="text-end font-semibold text-v3-bone">{c.groups[k]}</span>
              <motion.span
                initial={reduce ? false : { opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: ARRIVE }}
                className="flex h-8 origin-left overflow-hidden rounded-md"
                dir="ltr"
              >
                {seg(g.dem, "bg-v3-dem text-v3-ink")}
                {seg(g.und, "bg-v3-light/70 text-v3-ink")}
                {seg(g.rep, "bg-v3-rep text-v3-ink")}
              </motion.span>
            </li>
          )
        })}
      </ul>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-v3-soft">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-v3-dem" aria-hidden />
          {c.party.dem}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-v3-light/70" aria-hidden />
          {c.party.und}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-v3-rep" aria-hidden />
          {c.party.rep}
        </li>
      </ul>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{c.consolidation.caption}</figcaption>
    </figure>
  )
}

// ── 5. Engagement, 2022 versus 2026 ─────────────────────────────────────────

export function Engagement({ locale }: { locale: Locale }) {
  const t = COPY[locale].engagement
  const reduce = useReducedMotion()
  const [year, setYear] = useState<Year>(2026)
  const MIN = 30
  const MAX = 85
  const x = (v: number) => ((v - MIN) / (MAX - MIN)) * 100
  const pick = (y: Year) => {
    setYear(y)
    medal("engagement")
  }

  return (
    <figure className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-col gap-1.5 text-sm text-v3-soft">
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-v3-dem" aria-hidden />
            {t.demSup}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-v3-rep" aria-hidden />
            {t.repSup}
          </li>
        </ul>
        <div role="radiogroup" aria-label={t.title} className="inline-flex rounded-full border border-v3-line p-1">
          {([2022, 2026] as Year[]).map((y) => (
            <button
              key={y}
              type="button"
              role="radio"
              aria-checked={year === y}
              onClick={() => pick(y)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${year === y ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"}`}
            >
              {year === y && <motion.span layoutId="engage-pill" className="absolute inset-0 rounded-full bg-v3-light" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">
                {t.year} {dg(String(y), locale)}
              </span>
            </button>
          ))}
        </div>
      </div>
      <ul className="flex flex-col gap-8">
        {ENGAGE_KEYS.map((k) => {
          const [d, r] = ENGAGEMENT[k][year]
          const lo = Math.min(x(d), x(r))
          const gap = d - r
          return (
            <li key={k} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-v3-bone">{t.measures[k]}</span>
                <span className="text-xs text-v3-mute">{t.gap(lean(gap, locale))}</span>
              </div>
              <div className="relative h-9" dir="ltr">
                <span className="absolute inset-x-0 top-1/2 h-px bg-v3-line" aria-hidden />
                <motion.span
                  animate={{ left: `${lo}%`, width: `${Math.abs(x(d) - x(r))}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-v3-mute/60"
                  aria-hidden
                />
                {(
                  [
                    [d, "bg-v3-dem", "text-v3-dem", d >= r],
                    [r, "bg-v3-rep", "text-v3-rep", r > d],
                  ] as const
                ).map(([v, bg, fg, right], i) => (
                  <motion.span
                    key={i}
                    animate={{ left: `${x(v)}%` }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className={`block h-4 w-4 rounded-full ring-2 ring-v3-ink ${bg}`} />
                    <span className={`absolute top-1/2 -translate-y-1/2 text-sm font-semibold tabular-nums ${fg} ${right ? "left-6" : "right-6"}`}>{pc(v, locale)}</span>
                  </motion.span>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</figcaption>
    </figure>
  )
}

// ── 6. The tile map ─────────────────────────────────────────────────────────

function tileTone(m: number) {
  const a = Math.abs(m)
  const dem = m >= 0
  if (a >= 10) return dem ? "bg-v3-dem text-v3-ink" : "bg-v3-rep text-v3-ink"
  if (a >= TOSSUP) return dem ? "bg-v3-dem/60 text-v3-ink" : "bg-v3-rep/60 text-v3-ink"
  return `${dem ? "bg-v3-dem/25" : "bg-v3-rep/25"} text-v3-bone outline-2 -outline-offset-2 outline-dashed outline-v3-bone/70`
}

export function TileMap({ locale, k, label }: { locale: Locale; k: GroupKey | null; label: string }) {
  return (
    <div className={`grid w-full max-w-xl grid-cols-11 gap-0.75 ${LATIN}`} dir="ltr" role="img" aria-label={label}>
      {GRID.map(([st, row, col]) => {
        const m = modelMargin(st, k)
        return (
          <motion.span
            key={st}
            layout={false}
            animate={{ opacity: 1 }}
            title={`${st}: ${lean(m, "en", 1)}`}
            className={`flex aspect-square items-center justify-center rounded-[3px] text-[clamp(0.5rem,1.9vw,0.72rem)] font-bold transition-colors duration-500 ${tileTone(m)}`}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
          >
            {st}
          </motion.span>
        )
      })}
    </div>
  )
}

function MapKey({ locale }: { locale: Locale }) {
  const t = COPY[locale].explorer.key
  const items: [string, string][] = [
    ["bg-v3-dem", `${COPY[locale].party.demShort} ${t.strong}`],
    ["bg-v3-dem/60", t.lean],
    ["bg-v3-dem/25 outline-2 -outline-offset-2 outline-dashed outline-v3-bone/70", t.close],
    ["bg-v3-rep/60", t.lean],
    ["bg-v3-rep", `${COPY[locale].party.repShort} ${t.strong}`],
  ]
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-v3-soft">
      {items.map(([cls, l], i) => (
        <li key={i} className="flex items-center gap-1.5">
          <span className={`h-3.5 w-3.5 rounded-[3px] ${cls}`} aria-hidden />
          {l}
        </li>
      ))}
    </ul>
  )
}

// ── 7. The guessing game ────────────────────────────────────────────────────

type Answered = { pts: number; head: string; body: string; mapFor: GroupKey }

export function GuessGame({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const t = c.game
  const reduce = useReducedMotion()
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [guess, setGuess] = useState(25)
  const [done, setDone] = useState<Answered | null>(null)
  const [stateCall, setStateCall] = useState<"D" | "R" | null>(null)
  const max = QUESTIONS.length * 10
  const finished = qi >= QUESTIONS.length
  const q = QUESTIONS[Math.min(qi, QUESTIONS.length - 1)]
  const gm = margin(group(q.group))
  const shift = shiftText(swingFor(q.group), locale)

  const answerCount = () => {
    const ans = tally(q.group).dem
    const pts = countPoints(guess, ans)
    setScore((s) => s + pts)
    setDone({ pts, mapFor: q.group, head: t.countHead(dg(String(ans), locale), dg(String(guess), locale), dg(String(pts), locale)), body: t.countBody(c.groups[q.group], lean(gm, locale), shift) })
  }

  const answerState = (call: "D" | "R") => {
    if (q.kind !== "state") return
    const m = modelMargin(q.state, q.group)
    const ok = (m >= 0 ? "D" : "R") === call
    const pts = ok ? 10 : 0
    setStateCall(call)
    setScore((s) => s + pts)
    setDone({
      pts,
      mapFor: q.group,
      head: t.stateHead(ok ? t.right : t.wrong, t.states[q.state], lean(m, locale, 1), dg(String(pts), locale)),
      body: t.stateBody(lean(baseMargin(q.state), locale, 1), c.groups[q.group], lean(gm, locale), shift) + (Math.abs(m) < TOSSUP ? t.close : ""),
    })
  }

  const next = () => {
    const n = qi + 1
    // The outgoing card stays clickable during its exit animation; only the
    // first click for this question advances.
    setQi((cur) => (cur === qi ? n : cur))
    setDone(null)
    setStateCall(null)
    setGuess(25)
    if (n >= QUESTIONS.length) medal("game")
  }

  const restart = () => {
    setQi(0)
    setScore(0)
    setDone(null)
    setStateCall(null)
    setGuess(25)
  }

  const rank = score >= 80 ? t.ranks[0] : score >= 55 ? t.ranks[1] : score >= 30 ? t.ranks[2] : t.ranks[3]
  const correct = q.kind === "state" ? (modelMargin(q.state, q.group) >= 0 ? "D" : "R") : null

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-v3-bone/80 bg-v3-raise">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-v3-bone px-5 py-3 text-sm font-semibold text-v3-ink">
        <span>{finished ? t.finished : t.progress(dg(String(qi + 1), locale), dg(String(QUESTIONS.length), locale))}</span>
        <span className="tabular-nums">{t.score(dg(String(score), locale), dg(String(max), locale))}</span>
      </div>
      <div className="flex min-h-72 flex-col gap-5 p-5 md:p-8" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {finished ? (
            <motion.div key="end" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <span className="font-v3-display text-5xl text-v3-light tabular-nums">{t.score(dg(String(score), locale), dg(String(max), locale))}</span>
              <span className="font-v3-display text-2xl text-v3-bone">{rank}</span>
              <p className="max-w-2xl leading-relaxed text-v3-soft rtl:leading-loose">{t.final}</p>
              <button type="button" onClick={restart} className="inline-flex items-center gap-2 self-start rounded-full bg-v3-bone px-5 py-2.5 text-sm font-semibold text-v3-ink">
                <RotateCcw className="h-4 w-4" />
                {t.again}
              </button>
            </motion.div>
          ) : (
            <motion.div key={qi} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: ARRIVE }} className="flex flex-col gap-5">
              <p className="max-w-3xl font-v3-display text-xl leading-snug text-v3-bone md:text-2xl">
                {q.kind === "count" ? t.qCount(t.who[q.group]) : t.qState(t.who[q.group], t.states[q.state])}
              </p>
              {q.kind === "count" ? (
                <div className="flex flex-col gap-3">
                  <span className="font-v3-display text-5xl text-v3-light tabular-nums">{dg(String(guess), locale)}</span>
                  <input
                    type="range"
                    min={0}
                    max={51}
                    step={1}
                    value={guess}
                    disabled={!!done}
                    aria-label={t.guess}
                    onChange={(e) => setGuess(Number(e.target.value))}
                    className="w-full max-w-md accent-(--v3-accent)"
                  />
                  {!done && (
                    <button type="button" onClick={answerCount} className="self-start rounded-full bg-v3-bone px-5 py-2.5 text-sm font-semibold text-v3-ink">
                      {t.lock}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {(["D", "R"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={!!done}
                      onClick={() => answerState(v)}
                      className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-colors ${v === "D" ? "text-v3-dem" : "text-v3-rep"} ${
                        done && correct === v ? "border-v3-light bg-v3-light/15" : stateCall === v ? "border-v3-mute" : "border-v3-line hover:border-v3-bone"
                      }`}
                    >
                      {v === "D" ? c.party.dem : c.party.rep}
                    </button>
                  ))}
                </div>
              )}
              {done && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-2xl bg-v3-ink/60 p-4 md:p-5">
                  <p className="font-semibold text-v3-bone">{done.head}</p>
                  <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{done.body}</p>
                  <TileMap locale={locale} k={done.mapFor} label={c.groups[done.mapFor]} />
                  <button type="button" onClick={next} className="self-start rounded-full bg-v3-bone px-5 py-2.5 text-sm font-semibold text-v3-ink">
                    {qi + 1 < QUESTIONS.length ? t.next : t.finish}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── 8. The map explorer ─────────────────────────────────────────────────────

export function SwingExplorer({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const t = c.explorer
  const [k, setK] = useState<GroupKey | null>("women")
  const n = tally(k)
  const label = k === null ? t.baseline : c.groups[k]
  const pick = (v: GroupKey | null) => {
    setK(v)
    medal("map")
  }
  const sw = k === null ? 0 : swingFor(k)
  const fl = k === null ? [] : flips(k)
  const total = Object.keys(STATES_2024).length

  return (
    <figure className="flex flex-col gap-5 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-8">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={c.model.explorerTitle}>
        {MAP_OPTIONS.map((o) => (
          <button
            key={o ?? "base"}
            type="button"
            role="radio"
            aria-checked={k === o}
            onClick={() => pick(o)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${k === o ? "border-v3-bone bg-v3-bone text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-bone"}`}
          >
            {o === null ? t.baseline : c.groups[o]}
          </button>
        ))}
      </div>
      <p className="min-h-12 max-w-3xl text-sm leading-relaxed text-v3-soft rtl:leading-loose">
        {k === null ? t.baselineNote : t.shift(label, lean(margin(group(k)), locale), shiftText(sw, locale), sw >= 0 ? t.toward.dem : t.toward.rep)}
      </p>
      <p className="flex flex-wrap gap-x-6 gap-y-2" role="status" aria-live="polite">
        <span className="text-v3-dem">
          <b className="font-v3-display text-3xl tabular-nums">{dg(String(n.dem), locale)}</b> {t.tally.dem}
        </span>
        <span className="text-v3-rep">
          <b className="font-v3-display text-3xl tabular-nums">{dg(String(n.rep), locale)}</b> {t.tally.rep}
        </span>
        <span className="text-v3-light">
          <b className="font-v3-display text-3xl tabular-nums">{dg(String(n.close), locale)}</b> {t.tally.close}
        </span>
        <span className="sr-only">/ {total}</span>
      </p>
      <TileMap locale={locale} k={k} label={label} />
      <MapKey locale={locale} />
      <p className="text-sm text-v3-soft">{k === null ? "" : fl.length ? t.flips(dg(String(fl.length), locale)) : t.noFlips}</p>
      {fl.length > 0 && (
        <p className={`-mt-3 text-sm text-v3-bone ${LATIN}`} dir="ltr">
          {fl.join(", ")}
        </p>
      )}
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{c.model.explorerCaption}</figcaption>
    </figure>
  )
}
