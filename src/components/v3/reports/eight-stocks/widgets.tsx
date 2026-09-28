"use client"

// ============================================================================
// File Path: src/components/v3/reports/eight-stocks/widgets.tsx
// Why: The interactive figures of report 01. The report page itself is a
//      server component so every sentence is in the HTML; only these run in
//      the browser. Each one renders a complete, readable default state on
//      the server and respects prefers-reduced-motion.
//
//      Colour rule, as on the rest of v3: the ONE light accent is the
//      companies. Countries are bone and mute. Bar widths are data, so they
//      are the only style values set outside Tailwind classes.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { animate, motion, useInView, useReducedMotion } from "framer-motion"
import { Pause, Play } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { num, pct, times, usd } from "../fmt"
import { COPY } from "./copy"
import { Flag, Mark } from "./marks"
import {
  COMPANIES,
  COUNTRIES,
  EU27_GDP,
  LAYERS,
  NVIDIA_HISTORY,
  TOTAL_CAP,
  type CompanyKey,
} from "./data"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** An LTR-isolated figure, so "$5.43T" never reorders inside Persian. */
function Fig({ children, className }: { children: string; className?: string }) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className ?? ""}`}>
      {children}
    </bdi>
  )
}

/** Accent steps for the eight companies: the light, fading toward the ground. */
const SHADES = [
  "bg-v3-light",
  "bg-v3-light/90",
  "bg-v3-light/80",
  "bg-v3-light/70",
  "bg-v3-light/60",
  "bg-v3-light/50",
  "bg-v3-light/40",
  "bg-v3-light/30",
]

// ── Hero ────────────────────────────────────────────────────────────────────

/** $25.7 counting up once, on arrival. Server-renders the final value. */
export function MegaFigure({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const target = TOTAL_CAP / 1000
  const [v, setV] = useState(target)

  // The hero is in view on arrival, so the count starts at once; before
  // hydration (and with reduced motion) the final value is what shows.
  useEffect(() => {
    if (reduce || !inView) return
    const c = animate(0, target, { duration: 2, ease: ARRIVE, onUpdate: setV })
    return () => c.stop()
  }, [reduce, inView, target])

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      ${num(v, locale, 1)}
    </span>
  )
}

/** The eight companies as one bar. Tap a segment for its value and share. */
export function CompanyStack({ locale }: { locale: Locale }) {
  const t = COPY[locale].hero
  const [active, setActive] = useState<CompanyKey>("nvidia")
  const reduce = useReducedMotion()
  const c = COMPANIES.find((x) => x.key === active)!

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-16 w-full gap-1 md:h-20" role="group" aria-label={t.stackHint}>
        {COMPANIES.map((co, i) => {
          const on = co.key === active
          return (
            <motion.button
              key={co.key}
              type="button"
              aria-pressed={on}
              aria-label={`${co.name} ${usd(co.cap, locale)}`}
              onClick={() => setActive(co.key)}
              onPointerEnter={() => setActive(co.key)}
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.07, ease: ARRIVE }}
              style={{ flexGrow: co.cap, flexBasis: 0 }}
              className={`relative min-w-0 origin-bottom overflow-hidden rounded-md transition-[filter,opacity] duration-300 first:rounded-s-xl last:rounded-e-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v3-light ${SHADES[i]} ${
                on ? "opacity-100 brightness-110" : "opacity-75 hover:opacity-100"
              }`}
            >
              <span className="absolute inset-x-1 bottom-1.5 hidden items-center gap-1.5 truncate text-start text-[11px] font-semibold text-v3-ink md:flex">
                <Mark company={co.key} />
                <span className="truncate">{co.name}</span>
              </span>
            </motion.button>
          )
        })}
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm" aria-live="polite">
        <span className="text-v3-mute">{t.stackHint}</span>
        <span className="flex items-baseline gap-3">
          <span className="inline-flex items-center gap-2 font-semibold text-v3-bone" dir="ltr">
            <Mark company={c.key} />
            {c.name}
          </span>
          <Fig className="text-v3-light">{usd(c.cap, locale)}</Fig>
          <Fig className="text-v3-mute">{pct(c.cap / TOTAL_CAP, locale)}</Fig>
        </span>
      </div>
    </div>
  )
}

// ── Basket vs Europe ────────────────────────────────────────────────────────

const PRESETS: Record<"all" | "nvidia" | "top4", CompanyKey[]> = {
  all: COMPANIES.map((c) => c.key),
  nvidia: ["nvidia"],
  top4: ["nvidia", "apple", "alphabet", "microsoft"],
}

export function BasketComparator({ locale }: { locale: Locale }) {
  const t = COPY[locale].basket
  const names = COPY[locale].countries
  const [picked, setPicked] = useState<CompanyKey[]>(PRESETS.all)
  const [showAll, setShowAll] = useState(false)

  const basket = useMemo(
    () => COMPANIES.filter((c) => picked.includes(c.key)).reduce((s, c) => s + c.cap, 0),
    [picked],
  )
  const scale = Math.max(basket, COUNTRIES[0].gdp)
  const bigger = COUNTRIES.filter((c) => basket > c.gdp).length
  const rows = showAll ? COUNTRIES : COUNTRIES.slice(0, 10)
  const same = (a: CompanyKey[], b: CompanyKey[]) => a.length === b.length && a.every((k) => b.includes(k))

  const toggle = (k: CompanyKey) =>
    setPicked((p) => (p.includes(k) ? (p.length === 1 ? p : p.filter((x) => x !== k)) : [...p, k]))

  return (
    <div role="group" aria-label={t.title} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Controls */}
      <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-v3-mute">{t.basketLabel}</span>
          <motion.span
            key={basket}
            initial={{ opacity: 0.4, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-v3-display text-6xl font-light text-v3-light md:text-7xl"
          >
            <Fig>{usd(basket, locale)}</Fig>
          </motion.span>
          <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose" aria-live="polite">
            {t.verdict(num(bigger, locale), num(COUNTRIES.length, locale))}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-v3-mute">{t.presetsLabel}</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => {
              const on = same(picked, PRESETS[k])
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(PRESETS[k])}
                  className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                    on ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-light"
                  }`}
                >
                  {t.presets[k]}
                </button>
              )
            })}
          </div>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm text-v3-mute">{t.companiesLabel}</legend>
          <div className="grid grid-cols-2 gap-2">
            {COMPANIES.map((c) => {
              const on = picked.includes(c.key)
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(c.key)}
                  className={`flex min-h-12 min-w-0 flex-col justify-center gap-0.5 rounded-xl border px-3 py-2 text-start transition-all duration-300 ${
                    on ? "border-v3-light/60 bg-v3-raise text-v3-bone" : "border-v3-line/70 text-v3-mute hover:text-v3-bone"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Mark company={c.key} className={`text-[1.15em] transition-colors ${on ? "text-v3-light" : "text-v3-mute"}`} />
                    <span dir="ltr" className="truncate text-sm font-medium">{c.name}</span>
                  </span>
                  <Fig className="ps-[1.75em] text-[11px] text-v3-mute">{usd(c.cap, locale)}</Fig>
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-5 lg:col-span-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-v3-mute">
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-v3-light" />{t.legendBasket}</span>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-v3-soft/60" />{t.legendGdp}</span>
          <span>{t.rowHint}</span>
        </div>
        <ol className="flex flex-col">
          {rows.map((c, i) => {
            const ratio = basket / c.gdp
            const wins = ratio > 1
            return (
              <motion.li
                key={c.key}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-[7.5rem_1fr_4.5rem] items-center gap-4 border-b border-v3-line/50 py-3.5 md:grid-cols-[10rem_1fr_6rem]"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[15px] text-v3-bone">
                    <Flag code={c.key} className="me-2" />
                    {names[c.key]}
                  </span>
                  <Fig className="text-xs text-v3-mute">{usd(c.gdp, locale)}</Fig>
                </div>
                <div className="flex flex-col gap-1.5" aria-hidden>
                  <motion.div
                    className="h-2.5 rounded-e-full bg-v3-light"
                    animate={{ width: `${(basket / scale) * 100}%` }}
                    transition={{ duration: 0.6, ease: ARRIVE }}
                  />
                  <motion.div
                    className="h-2.5 rounded-e-full bg-v3-soft/60"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(c.gdp / scale) * 100}%` }}
                    animate={{ width: `${(c.gdp / scale) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.03, ease: ARRIVE }}
                  />
                </div>
                <span
                  className={`text-end font-v3-display text-2xl md:text-3xl ${wins ? "text-v3-light" : "text-v3-mute"}`}
                >
                  <Fig>{times(ratio, locale)}</Fig>
                </span>
              </motion.li>
            )
          })}
        </ol>
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="self-start px-1 py-2 text-sm text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light"
        >
          {locale === "fa"
            ? showAll ? "نمایش ۱۰ اقتصاد اول" : "نمایش هر ۲۰ اقتصاد"
            : showAll ? "Show the first 10" : "Show all 20 economies"}
        </button>
      </div>
    </div>
  )
}

// ── Stacking Europe ─────────────────────────────────────────────────────────

export function EuropeStacker({ locale }: { locale: Locale }) {
  const t = COPY[locale].stack
  const names = COPY[locale].countries
  const [n, setN] = useState(5)
  const group = COUNTRIES.slice(0, n)
  const sum = group.reduce((s, c) => s + c.gdp, 0)
  const scale = COUNTRIES.reduce((s, c) => s + c.gdp, 0) * 1.02
  const w = (v: number) => `${(v / scale) * 100}%`
  const needed = (() => {
    let s = 0
    for (let i = 0; i < COUNTRIES.length; i++) {
      s += COUNTRIES[i].gdp
      if (s > TOTAL_CAP) return i + 1
    }
    return COUNTRIES.length
  })()

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <label htmlFor="stack-n" className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="text-sm text-v3-mute">{t.sliderLabel}</span>
          <span className="font-v3-display text-3xl text-v3-bone">{t.topN(num(n, locale))}</span>
        </label>
        <input
          id="stack-n"
          type="range"
          min={1}
          max={COUNTRIES.length}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-v3-light"
        />
      </div>

      <div className="relative flex flex-col gap-6 pt-8">
        {/* EU-27 marker */}
        <div className="pointer-events-none absolute inset-y-0 z-10 flex w-0 flex-col items-center" style={{ insetInlineStart: w(EU27_GDP) }}>
          <span className="whitespace-nowrap text-xs text-v3-soft">
            {t.eu27} · <Fig>{usd(EU27_GDP, locale, 1)}</Fig>
          </span>
          <span className="mt-1 w-px flex-1 border-s border-dashed border-v3-soft/60" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-v3-light">{t.companies}</span>
            <Fig className="text-v3-light">{usd(TOTAL_CAP, locale, 1)}</Fig>
          </div>
          <motion.div
            className="h-10 rounded-e-lg bg-v3-light shadow-[0_0_40px_-12px_rgba(232,196,138,0.7)]"
            initial={{ width: 0 }}
            whileInView={{ width: w(TOTAL_CAP) }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: ARRIVE }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-v3-soft">{t.europe}</span>
            <Fig className="text-v3-bone">{usd(sum, locale, 1)}</Fig>
          </div>
          <div className="flex h-10 gap-px">
            {group.map((c, i) => (
              <motion.div
                key={c.key}
                title={names[c.key]}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: w(c.gdp), opacity: 1 }}
                transition={{ duration: 0.45, ease: ARRIVE }}
                className={`flex items-center justify-center overflow-hidden text-sm first:rounded-s-md last:rounded-e-md ${
                  i % 2 ? "bg-v3-soft/45" : "bg-v3-soft/65"
                }`}
              >
                {c.gdp > 700 ? <Flag code={c.key} /> : null}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose" aria-live="polite">
          {t.reading(pct(TOTAL_CAP / sum, locale))} {sum < TOTAL_CAP && <span className="text-v3-mute">{t.notYet}</span>}
        </p>
        <p className="text-lg leading-relaxed text-v3-light rtl:leading-loose">{t.passed(num(needed, locale))}</p>
      </div>
    </div>
  )
}

// ── NVIDIA race ─────────────────────────────────────────────────────────────

export function NvidiaRace({ locale }: { locale: Locale }) {
  const t = COPY[locale].nvidia
  const names = COPY[locale].countries
  const last = NVIDIA_HISTORY.length - 1
  const [i, setI] = useState(last)
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()
  const cap = NVIDIA_HISTORY[i].cap
  const max = COUNTRIES[0].gdp * 1.04
  const passed = COUNTRIES.filter((c) => cap > c.gdp).length
  const ladder = [...COUNTRIES].reverse()
  const ticks = COUNTRIES.slice(0, 6)
  const growth = NVIDIA_HISTORY[last].cap / NVIDIA_HISTORY.find((h) => h.label === "2022")!.cap

  useEffect(() => {
    if (!playing || i >= last) return
    const id = window.setTimeout(() => {
      setI(i + 1)
      if (i + 1 >= last) setPlaying(false)
    }, reduce ? 400 : 1100)
    return () => window.clearTimeout(id)
  }, [playing, i, last, reduce])

  const play = () => {
    if (playing) return setPlaying(false)
    if (i >= last) setI(0)
    setPlaying(true)
  }

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-v3-mute">
            NVIDIA · {i === last ? t.today : `${t.yearLabel} ${num(Number(NVIDIA_HISTORY[i].label), locale)}`}
          </span>
          <motion.span
            key={cap}
            initial={{ opacity: 0.3, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-v3-display text-6xl font-light text-v3-light md:text-8xl"
          >
            <Fig>{usd(cap, locale)}</Fig>
          </motion.span>
          <span className="text-v3-bone" aria-live="polite">{t.passed(num(passed, locale))}</span>
        </div>
        <button
          type="button"
          onClick={play}
          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-v3-bone px-6 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          {playing ? t.pause : t.play}
        </button>
      </div>

      {/* Year scrubber */}
      <div role="group" aria-label={t.yearLabel} className="grid grid-cols-8 gap-1.5">
        {NVIDIA_HISTORY.map((h, k) => (
          <button
            key={h.label}
            type="button"
            aria-pressed={k === i}
            onClick={() => {
              setPlaying(false)
              setI(k)
            }}
            className={`flex min-h-11 flex-col items-center justify-center rounded-lg border text-xs transition-colors md:text-sm ${
              k === i ? "border-v3-light bg-v3-light text-v3-ink" : k < i ? "border-v3-light/40 text-v3-light" : "border-v3-line text-v3-mute hover:text-v3-bone"
            }`}
          >
            {num(Number(h.label), locale)}
          </button>
        ))}
      </div>

      {/* Track with the six largest economies as ticks */}
      <div className="relative pb-16 pt-2">
        <div className="relative h-14 overflow-hidden rounded-xl bg-v3-raise">
          <motion.div
            className="h-full rounded-e-xl bg-v3-light shadow-[0_0_50px_-10px_rgba(232,196,138,0.8)]"
            animate={{ width: `${(cap / max) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.9, ease: ARRIVE }}
          />
        </div>
        {ticks.map((c, k) => (
          <div
            key={c.key}
            className="absolute top-0 flex h-full w-0 flex-col items-center"
            style={{ insetInlineStart: `${(c.gdp / max) * 100}%` }}
          >
            <span className={`h-[4.5rem] w-px ${cap > c.gdp ? "bg-v3-ink/60" : "bg-v3-soft/50"}`} />
            <span
              className={`whitespace-nowrap text-xs ${cap > c.gdp ? "text-v3-light" : "text-v3-mute"} ${
                k % 2 ? "mt-5" : "mt-1"
              }`}
            >
              <Flag code={c.key} /> <span className="hidden md:inline">{names[c.key]}</span>
            </span>
          </div>
        ))}
      </div>

      {/* The ladder of 20 */}
      <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 md:grid-cols-10">
        {ladder.map((c) => {
          const on = cap > c.gdp
          return (
            <li
              key={c.key}
              className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2 text-center transition-all duration-500 ${
                on ? "border-v3-light/60 bg-v3-light/10" : "border-v3-line/60 opacity-50"
              }`}
            >
              <Flag code={c.key} className="h-4" />
              <span className="w-full truncate text-[11px] text-v3-soft">{names[c.key]}</span>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <span className="font-v3-display text-2xl text-v3-light">{t.growth(num(growth, locale, 0))}</span>
        <span className="max-w-xl text-sm text-v3-mute">{t.note}</span>
      </div>
    </div>
  )
}

// ── Top four vs big five ────────────────────────────────────────────────────

type SplitItem = { k: string; v: number; n: string; mark?: CompanyKey; code?: string }

function SplitRow({ label, total, items, lit, scale, locale }: { label: string; total: number; items: SplitItem[]; lit: boolean; scale: number; locale: Locale }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className={lit ? "text-v3-light" : "text-v3-soft"}>{label}</span>
        <Fig className={`font-v3-display text-3xl ${lit ? "text-v3-light" : "text-v3-bone"}`}>{usd(total, locale, 1)}</Fig>
      </div>
      <div className="flex h-12 gap-px">
        {items.map((it, i) => (
          <motion.div
            key={it.k}
            initial={{ width: 0 }}
            whileInView={{ width: `${(it.v / scale) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: ARRIVE }}
            className={`flex items-center overflow-hidden px-2 text-[11px] font-medium first:rounded-s-md last:rounded-e-md ${
              lit ? `${SHADES[i * 2]} text-v3-ink` : i % 2 ? "bg-v3-soft/45 text-v3-ink" : "bg-v3-soft/65 text-v3-ink"
            }`}
          >
            {it.mark ? <Mark company={it.mark} className="me-1.5" /> : it.code ? <Flag code={it.code} className="me-1.5" /> : null}
            <span className="truncate">{it.n}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TopFourVsBigFive({ locale }: { locale: Locale }) {
  const t = COPY[locale].top4
  const names = COPY[locale].countries
  const four = COMPANIES.slice(0, 4)
  const five = COUNTRIES.slice(0, 5)
  const s4 = four.reduce((s, c) => s + c.cap, 0)
  const s5 = five.reduce((s, c) => s + c.gdp, 0)
  const scale = Math.max(s4, s5)

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-8">
      <SplitRow scale={scale} locale={locale} label={t.companies} total={s4} lit items={four.map((c) => ({ k: c.key, v: c.cap, n: c.name, mark: c.key }))} />
      <SplitRow scale={scale} locale={locale} label={`${t.economies} · ${t.economyNames}`} total={s5} lit={false} items={five.map((c) => ({ k: c.key, v: c.gdp, n: names[c.key], code: c.key }))} />
    </div>
  )
}

// ── Stock vs flow ───────────────────────────────────────────────────────────

export function StockFigure({ mark }: { mark: string }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 300 96" className="h-auto w-full" role="img" aria-label={mark}>
      <line x1="10" y1="64" x2="290" y2="64" className="stroke-v3-line" strokeWidth="2" />
      {Array.from({ length: 12 }, (_, k) => (
        <line key={k} x1={30 + k * 22} y1="60" x2={30 + k * 22} y2="68" className="stroke-v3-line" strokeWidth="1.5" />
      ))}
      <motion.circle
        cx="228" cy="64" r="9" className="fill-v3-light"
        animate={reduce ? undefined : { r: [9, 20, 9], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
      <circle cx="228" cy="64" r="8" className="fill-v3-light" />
      <line x1="228" y1="24" x2="228" y2="52" className="stroke-v3-light" strokeWidth="2" />
      <text x="228" y="16" textAnchor="middle" fontSize="13" className="fill-v3-soft">{mark}</text>
    </svg>
  )
}

export function FlowFigure({ mark }: { mark: string }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 300 96" className="h-auto w-full" role="img" aria-label={mark}>
      <line x1="10" y1="64" x2="290" y2="64" className="stroke-v3-line" strokeWidth="2" />
      {Array.from({ length: 12 }, (_, k) => (
        <line key={k} x1={30 + k * 22} y1="60" x2={30 + k * 22} y2="68" className="stroke-v3-line" strokeWidth="1.5" />
      ))}
      <rect x="30" y="56" width="242" height="16" rx="3" className="fill-v3-soft/15" />
      <motion.rect
        x="30" y="56" height="16" rx="3" className="fill-v3-soft/70"
        initial={{ width: reduce ? 242 : 0 }}
        animate={reduce ? { width: 242 } : { width: [0, 242, 242] }}
        transition={{ duration: 4, times: [0, 0.8, 1], repeat: Infinity, ease: "linear" }}
      />
      <text x="151" y="36" textAnchor="middle" fontSize="13" className="fill-v3-soft">{mark}</text>
    </svg>
  )
}

// ── Layers ──────────────────────────────────────────────────────────────────

export function LayerMap({ locale }: { locale: Locale }) {
  const t = COPY[locale].layers
  const [co, setCo] = useState<CompanyKey | null>(null)
  const top = [...LAYERS].reverse()

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm text-v3-mute">{t.hint}</span>
        <div className="flex flex-wrap gap-2">
          {COMPANIES.map((c) => {
            const on = co === c.key
            return (
              <button
                key={c.key}
                type="button"
                aria-pressed={on}
                onClick={() => setCo(on ? null : c.key)}
                dir="ltr"
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                  on ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-light"
                }`}
              >
                <Mark company={c.key} />
                {c.name}
              </button>
            )
          })}
          {co && (
            <button type="button" onClick={() => setCo(null)} className="min-h-10 px-3 text-sm text-v3-mute underline underline-offset-4 hover:text-v3-bone">
              {t.clear}
            </button>
          )}
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {top.map((l, k) => {
          const holds = co ? l.holders.includes(co) : true
          const idx = LAYERS.length - k
          return (
            <motion.li
              key={l.key}
              animate={{ opacity: holds ? 1 : 0.28, x: 0 }}
              transition={{ duration: 0.35 }}
              className={`grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-2 rounded-2xl border px-5 py-4 md:grid-cols-[3rem_12rem_1fr] ${
                co && holds ? "border-v3-light/60 bg-v3-raise shadow-[0_0_40px_-24px_rgba(232,196,138,0.7)]" : "border-v3-line/70"
              }`}
            >
              <span className="text-sm tabular-nums text-v3-mute">{num(idx, locale).padStart(2, locale === "fa" ? "۰" : "0")}</span>
              <span className="flex flex-col">
                <span dir="ltr" className="self-start font-v3-display text-2xl text-v3-bone">{t.names[l.key].name}</span>
                <span className="text-sm text-v3-mute">{t.names[l.key].note}</span>
              </span>
              <span className="col-span-2 flex flex-wrap gap-1.5 md:col-span-1 md:justify-end">
                {l.holders.map((h) => {
                  const c = COMPANIES.find((x) => x.key === h)!
                  const lit = co === h
                  return (
                    <span
                      key={h}
                      dir="ltr"
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                        lit ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft"
                      }`}
                    >
                      <Mark company={c.key} />
                      {c.name}
                    </span>
                  )
                })}
              </span>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

// ── Share ───────────────────────────────────────────────────────────────────

export function ShareBar({ locale, url, title }: { locale: Locale; url: string; title: string }) {
  const t = COPY[locale].colophon
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const tx = encodeURIComponent(title)
  const links = [
    { label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${tx}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${tx}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${tx}%20${u}` },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-v3-mute">{t.share}</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="min-h-11 rounded-full bg-v3-bone px-5 text-sm font-semibold text-v3-ink transition-colors hover:bg-v3-light"
          aria-live="polite"
        >
          {copied ? t.copied : t.copy}
        </button>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-v3-line px-5 text-sm text-v3-soft transition-colors hover:border-v3-light hover:text-v3-light"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
