"use client"

// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/widgets.tsx
// Why: The interactive figures of report 05: the count-versus-share timeline,
//      the hundred people, the regional split, the flipping ranking, the
//      country explorer and the gender strip. The page is a server component
//      so every sentence is in the HTML; these render a complete default state
//      on the server, respect reduced motion, and use v3 theme tokens so they
//      follow the light/dark switch. Each awards its passport stamp the first
//      time a reader actually uses it.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "framer-motion"
import { ArrowDownUp, Hash, PersonStanding, Percent, Search } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { BY_SHARE, COUNTRIES, FEMALE_STRIP, HUNDRED_PICKS, REGIONS, WORLD, YEARS, byIso, rankByShare, rankByStock, type CountryRow } from "./data"
import { CountryFlag } from "./flag"
import { dg, int, nameOf, pc, people } from "./fmt"
import { stamp } from "./passport"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── 1. Count versus share ───────────────────────────────────────────────────

function LineChart({
  values,
  max,
  ticks,
  tickLabel,
  at,
  tone,
  label,
  locale,
}: {
  values: number[]
  max: number
  ticks: number[]
  tickLabel: (v: number) => string
  at: number
  tone: "light" | "bone"
  label: string
  locale: Locale
}) {
  const W = 420
  const H = 200
  const L = 44
  const R = 12
  const T = 12
  const B = 28
  const x = (i: number) => L + (i / (values.length - 1)) * (W - L - R)
  const y = (v: number) => H - B - (v / max) * (H - B - T)
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  const area = `${d} L${x(values.length - 1).toFixed(1)},${H - B} L${x(0).toFixed(1)},${H - B} Z`
  const ref = useRef<SVGSVGElement>(null)
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  const reduce = useReducedMotion()
  const stroke = tone === "light" ? "stroke-v3-light" : "stroke-v3-bone"
  const fill = tone === "light" ? "fill-v3-light" : "fill-v3-bone"

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-auto w-full overflow-visible" direction="ltr">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="stroke-v3-line" strokeWidth={1} />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" className="fill-v3-mute text-[10px]">
            {tickLabel(v)}
          </text>
        </g>
      ))}
      {[0, 3, 7].map((i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-v3-mute text-[10.5px]">
          {dg(String(YEARS[i]), locale)}
        </text>
      ))}
      <motion.path d={area} className={fill} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: seen || reduce ? 0.08 : 0 }} transition={{ duration: 1.2, delay: 0.6 }} />
      <motion.path
        d={d}
        fill="none"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={stroke}
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: seen || reduce ? 1 : 0 }}
        transition={{ duration: 1.6, ease: ARRIVE }}
      />
      <line x1={x(at)} x2={x(at)} y1={T} y2={H - B} className="stroke-v3-mute" strokeDasharray="3 4" strokeWidth={1} />
      <motion.circle
        cx={x(at)}
        cy={y(values[at])}
        r={6}
        className={`${fill} ${tone === "light" ? "drop-shadow-[0_0_8px_rgb(var(--v3-glow)/0.9)]" : ""}`}
        animate={{ cx: x(at), cy: y(values[at]) }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      />
    </svg>
  )
}

export function CountVsShare({ locale }: { locale: Locale }) {
  const t = COPY[locale].paradox
  const [at, setAt] = useState(YEARS.length - 1)
  const move = (i: number) => {
    setAt(i)
    stamp("timeline")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl border border-v3-light/40 bg-v3-raise p-6 shadow-[0_0_60px_-35px_rgb(var(--v3-glow)/0.7)] md:p-7">
          <span className="flex items-center gap-2 text-sm text-v3-light">
            <Hash className="h-4 w-4" aria-hidden />
            {t.countTitle}
          </span>
          <span className="font-v3-display text-5xl tabular-nums text-v3-light md:text-6xl">{people(WORLD.stock[at], locale)}</span>
          <LineChart
            values={WORLD.stock}
            max={320e6}
            ticks={[0, 80e6, 160e6, 240e6, 320e6]}
            tickLabel={(v) => dg(String(v / 1e6), locale)}
            at={at}
            tone="light"
            label={t.countTitle}
            locale={locale}
          />
          <p className="text-sm text-v3-soft">{t.countCap}</p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-v3-line/80 bg-v3-raise p-6 md:p-7">
          <span className="flex items-center gap-2 text-sm text-v3-bone">
            <Percent className="h-4 w-4" aria-hidden />
            {t.shareTitle}
          </span>
          <span className="font-v3-display text-5xl tabular-nums text-v3-bone md:text-6xl">{pc(WORLD.pct[at], locale)}</span>
          <LineChart
            values={WORLD.pct}
            max={10}
            ticks={[0, 2.5, 5, 7.5, 10]}
            tickLabel={(v) => dg(String(v), locale)}
            at={at}
            tone="bone"
            label={t.shareTitle}
            locale={locale}
          />
          <p className="text-sm text-v3-soft">{t.shareCap}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-v3-line/70 px-5 py-4">
        <label htmlFor="ims-year" className="flex items-baseline justify-between text-sm text-v3-mute">
          <span>{t.scrub}</span>
          <span className="font-v3-display text-3xl tabular-nums text-v3-bone">{dg(String(YEARS[at]), locale)}</span>
        </label>
        <input
          id="ims-year"
          type="range"
          min={0}
          max={YEARS.length - 1}
          step={1}
          value={at}
          dir="ltr"
          onChange={(e) => move(Number(e.target.value))}
          aria-valuetext={String(YEARS[at])}
          className="w-full accent-(--v3-accent)"
        />
        <div className="flex justify-between text-xs tabular-nums text-v3-mute" dir="ltr">
          {YEARS.map((y, i) => (
            <button key={y} type="button" onClick={() => move(i)} className={`rounded px-1 transition-colors ${i === at ? "text-v3-light" : "hover:text-v3-bone"}`}>
              {dg(String(y), locale)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 2. One hundred people ───────────────────────────────────────────────────

export function HundredPeople({ locale }: { locale: Locale }) {
  const t = COPY[locale].hundred
  const reduce = useReducedMotion()
  const [iso, setIso] = useState<string>("")
  const pick = (i: string) => {
    setIso(i)
    stamp("hundred")
  }
  // "" is the world here (the Channel Islands never appear in this figure).
  const row = iso ? byIso(iso) : undefined
  const v = row ? row[6] : WORLD.pct[7]
  const place = row ? nameOf(row, locale) : t.world
  const whole = Math.floor(v)
  const part = v - whole

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="flex flex-wrap gap-2">
          {HUNDRED_PICKS.map((i) => {
            const r = i ? byIso(i) : undefined
            const on = i === iso
            return (
              <button
                key={i || "world"}
                type="button"
                onClick={() => pick(i)}
                aria-pressed={on}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  on ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-bone"
                }`}
              >
                {r ? <CountryFlag iso={i} /> : <span aria-hidden>🌍</span>}
                {r ? nameOf(r, locale) : t.world}
              </button>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={iso}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-2"
          >
            <span className="font-v3-display text-7xl tabular-nums text-v3-light md:text-8xl">{pc(v, locale)}</span>
            <p className="text-lg text-v3-bone" aria-live="polite">
              {t.sentence(dg(String(Math.round(v)), locale), place)}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-5 text-sm text-v3-mute">
          <span className="flex items-center gap-1.5">
            <PersonStanding className="h-4 w-4 text-v3-light" aria-hidden /> {t.migrant}
          </span>
          <span className="flex items-center gap-1.5">
            <PersonStanding className="h-4 w-4 text-v3-line" aria-hidden /> {t.native}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.note}</p>
      </div>
      <div aria-hidden className="grid grid-cols-10 gap-1 sm:gap-1.5 lg:col-span-7">
        {Array.from({ length: 100 }, (_, i) => {
          const lit = i < whole
          const partial = i === whole && part > 0.05
          return (
            <span key={i} className="relative grid aspect-square place-items-center">
              <PersonStanding className="h-full w-full text-v3-line" strokeWidth={1.6} />
              {(lit || partial) && (
                <motion.span
                  key={`${iso}-${i}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: reduce ? 0 : Math.min(i * 0.012, 0.9) }}
                  className="absolute inset-0 overflow-hidden text-v3-light"
                  style={partial ? { clipPath: locale === "fa" ? `inset(0 0 0 ${(1 - part) * 100}%)` : `inset(0 ${(1 - part) * 100}% 0 0)` } : undefined}
                >
                  <PersonStanding className="h-full w-full drop-shadow-[0_0_6px_rgb(var(--v3-glow)/0.7)]" strokeWidth={2} />
                </motion.span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── 3. Regions ──────────────────────────────────────────────────────────────

const SHADES = ["opacity-100", "opacity-80", "opacity-65", "opacity-50", "opacity-40", "opacity-30", "opacity-20", "opacity-15"]

export function RegionSplit({ locale }: { locale: Locale }) {
  const t = COPY[locale].regions
  const reduce = useReducedMotion()
  const [hot, setHot] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex h-16 w-full overflow-hidden rounded-xl border border-v3-line md:h-20" role="img" aria-label={t.title}>
        {REGIONS.map((r, i) => (
          <motion.span
            key={r.key}
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${r.share}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: i * 0.08, ease: ARRIVE }}
            onPointerEnter={() => setHot(i)}
            onPointerLeave={() => setHot(null)}
            className={`relative h-full border-e border-v3-ink/60 bg-v3-light transition-[filter] ${SHADES[i]} ${hot === i ? "brightness-125" : ""}`}
            style={reduce ? { width: `${r.share}%` } : undefined}
          >
            {r.share > 6 && (
              <span className="absolute inset-0 grid place-items-center font-v3-display text-lg tabular-nums text-v3-ink md:text-2xl">{pc(r.share, locale, 0)}</span>
            )}
          </motion.span>
        ))}
      </div>
      <ul className="grid gap-x-10 gap-y-1 md:grid-cols-2">
        {REGIONS.map((r, i) => (
          <li
            key={r.key}
            onPointerEnter={() => setHot(i)}
            onPointerLeave={() => setHot(null)}
            className={`grid grid-cols-[0.75rem_1fr_auto] items-baseline gap-3 border-b border-v3-line/60 py-3 transition-colors ${hot === i ? "text-v3-bone" : "text-v3-soft"}`}
          >
            <span aria-hidden className={`h-3 w-3 self-center rounded-sm bg-v3-light ${SHADES[i]}`} />
            <span>
              {t.names[r.key]}
              <span className="block text-xs text-v3-mute">
                {people(r.stock, locale)} · {pc(r.pctPop, locale)} {t.ofPop}
              </span>
            </span>
            <span className="font-v3-display text-2xl tabular-nums text-v3-bone">{pc(r.share, locale)}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-v3-mute">{t.highIncome}</p>
    </div>
  )
}

// ── 4. The flipping ranking ─────────────────────────────────────────────────

export function RankFlip({ locale }: { locale: Locale }) {
  const t = COPY[locale].flip
  const reduce = useReducedMotion()
  const [mode, setMode] = useState<"count" | "share">("count")
  const list = mode === "count" ? COUNTRIES.slice(0, 12) : BY_SHARE.slice(0, 12)
  const max = mode === "count" ? COUNTRIES[0][4][7] : 100
  const set = (m: "count" | "share") => {
    if (m !== mode) stamp("flip")
    setMode(m)
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="radiogroup" aria-label={t.title} className="inline-flex self-start rounded-full border border-v3-line p-1">
        {(["count", "share"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => set(m)}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${mode === m ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"}`}
          >
            {mode === m && <motion.span layoutId="ims-flip-pill" className="absolute inset-0 rounded-full bg-v3-light" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative flex items-center gap-2">
              {m === "count" ? <Hash className="h-4 w-4" aria-hidden /> : <Percent className="h-4 w-4" aria-hidden />}
              {m === "count" ? t.byCount : t.byShare}
            </span>
          </button>
        ))}
        <ArrowDownUp className="mx-2 h-4 w-4 self-center text-v3-mute" aria-hidden />
      </div>

      <LayoutGroup>
        <ol className="flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {list.map((r, i) => {
              const v = mode === "count" ? r[4][7] : r[6]
              return (
                <motion.li
                  key={r[0]}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  className="grid grid-cols-[1.25rem_minmax(0,7rem)_minmax(3.5rem,1fr)_auto] items-center gap-2 sm:gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-v3-raise md:grid-cols-[2rem_minmax(0,13rem)_minmax(0,1fr)_9rem]"
                >
                  <span className="text-center text-xs tabular-nums text-v3-mute">{dg(String(i + 1), locale)}</span>
                  <span className="flex min-w-0 items-center gap-2 text-v3-bone">
                    <CountryFlag iso={r[0]} className="text-lg leading-none" />
                    <span className="truncate">{nameOf(r, locale)}</span>
                  </span>
                  <span className="h-3 overflow-hidden rounded-full bg-v3-line/40">
                    <motion.span
                      className={`block h-full rounded-full ${mode === "count" ? "bg-v3-light" : "bg-v3-bone"}`}
                      initial={false}
                      animate={{ width: `${Math.max(1.5, (v / max) * 100)}%` }}
                      transition={{ duration: 0.7, ease: ARRIVE }}
                    />
                  </span>
                  <span className="text-end text-xs tabular-nums text-v3-soft">
                    <span className="text-sm text-v3-bone">{mode === "count" ? people(v, locale, true) : pc(v, locale)}</span>
                    <span className="hidden text-v3-mute md:inline"> · {mode === "count" ? pc(r[6], locale) : people(r[4][7], locale, true)}</span>
                  </span>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ol>
      </LayoutGroup>
      <p className="text-sm text-v3-mute">{t.note}</p>
    </div>
  )
}

// ── 5. Country explorer ─────────────────────────────────────────────────────

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ‌]/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .trim()

const QUICK = ["IR", "CA", "DE", "TR", "AE", "US", "GB", "AU"]

function Spark({ values, locale }: { values: number[]; locale: Locale }) {
  const W = 320
  const H = 90
  const max = Math.max(...values) * 1.1 || 1
  const x = (i: number) => 6 + (i / (values.length - 1)) * (W - 12)
  const y = (v: number) => H - 18 - (v / max) * (H - 26)
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" direction="ltr" aria-hidden>
      <line x1={6} x2={W - 6} y1={H - 18} y2={H - 18} className="stroke-v3-line" />
      <motion.path key={d} d={d} fill="none" strokeWidth={2.5} strokeLinejoin="round" className="stroke-v3-light" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: ARRIVE }} />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 4.5 : 2.5} className="fill-v3-light" />
      ))}
      {[0, 7].map((i) => (
        <text key={i} x={x(i)} y={H - 3} textAnchor={i ? "end" : "start"} className="fill-v3-mute text-[10px]">
          {dg(String(YEARS[i]), locale)}
        </text>
      ))}
    </svg>
  )
}

export function CountryExplorer({ locale }: { locale: Locale }) {
  const t = COPY[locale].explorer
  const reduce = useReducedMotion()
  const [iso, setIso] = useState(locale === "fa" ? "IR" : "CA")
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const seen = useRef(new Set<string>())

  const matches = useMemo(() => {
    const n = norm(q)
    if (!n) return []
    return COUNTRIES.filter((r) => norm(r[1]).includes(n) || norm(r[2]).includes(n)).slice(0, 8)
  }, [q])

  const choose = (i: string) => {
    setIso(i)
    setQ("")
    setOpen(false)
    seen.current.add(i)
    if (seen.current.size >= 3) stamp("explorer")
  }

  const r = byIso(iso) as CountryRow
  const s = r[4]
  const change = s[0] > 0 ? ((s[7] - s[0]) / s[0]) * 100 : 0
  const types = r[3].split(" ") as ("B" | "C" | "R" | "I")[]
  const rs = rankByShare(iso)

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-4">
        <label htmlFor="ims-search" className="text-sm text-v3-mute">
          {t.search}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-v3-mute" aria-hidden />
          <input
            id="ims-search"
            type="search"
            role="combobox"
            aria-expanded={open && matches.length > 0}
            aria-controls="ims-search-list"
            aria-autocomplete="list"
            autoComplete="off"
            value={q}
            placeholder={t.placeholder}
            onChange={(e) => {
              setQ(e.target.value)
              setOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches[0]) {
                e.preventDefault()
                choose(matches[0][0])
              }
              if (e.key === "Escape") setOpen(false)
            }}
            className="w-full rounded-full border border-v3-line bg-v3-ink py-3 ps-11 pe-4 text-v3-bone placeholder:text-v3-mute focus:border-v3-light focus:outline-none"
          />
          {open && q && (
            <ul id="ims-search-list" role="listbox" className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-2xl border border-v3-line bg-v3-ink p-1.5 shadow-2xl">
              {matches.length === 0 && <li className="px-3 py-2 text-sm text-v3-mute">{t.none}</li>}
              {matches.map((m) => (
                <li key={m[0] || m[1]} role="option" aria-selected={false}>
                  <button type="button" onClick={() => choose(m[0])} className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-start text-sm text-v3-bone hover:bg-v3-raise">
                    <span className="flex items-center gap-2">
                      <CountryFlag iso={m[0]} />
                      {nameOf(m, locale)}
                    </span>
                    <span className="text-xs tabular-nums text-v3-mute">{people(m[4][7], locale, true)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-v3-mute">{t.quick}</span>
          {QUICK.map((i) => {
            const qr = byIso(i) as CountryRow
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={iso === i}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  iso === i ? "border-v3-light text-v3-light" : "border-v3-line text-v3-soft hover:border-v3-light"
                }`}
              >
                <CountryFlag iso={i} />
                {nameOf(qr, locale)}
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={iso}
          initial={reduce ? false : { opacity: 0, y: 14, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: ARRIVE }}
          className="lg:col-span-8"
          aria-live="polite"
        >
          <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-v3-light/40 bg-v3-raise p-6 shadow-[0_0_80px_-40px_rgb(var(--v3-glow)/0.8)] md:p-8">
            <span aria-hidden className="pointer-events-none absolute -end-6 -top-10 select-none text-[9rem] leading-none opacity-10 saturate-50 md:text-[12rem]">
              <CountryFlag iso={iso} />
            </span>
            <div className="relative flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-v3-display text-3xl text-v3-bone md:text-4xl">{nameOf(r, locale)}</h3>
                <span className="flex flex-wrap gap-2 text-xs text-v3-mute">
                  <span className="rounded-full border border-v3-line px-2 py-0.5">{t.rankCount(dg(String(rankByStock(iso)), locale))}</span>
                  <span className="rounded-full border border-v3-line px-2 py-0.5">{rs ? t.rankShare(dg(String(rs), locale)) : t.rankShareNone}</span>
                </span>
              </div>
            </div>
            <dl className="relative grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
              <div className="col-span-2 flex flex-col gap-1 md:col-span-1">
                <dt className="text-xs text-v3-mute">{t.stock}</dt>
                <dd className="font-v3-display text-3xl tabular-nums text-v3-light">{people(s[7], locale)}</dd>
                <dd className="text-xs tabular-nums text-v3-mute" dir="ltr">
                  {int(s[7], locale)}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-v3-mute">{t.share}</dt>
                <dd className="font-v3-display text-3xl tabular-nums text-v3-bone">{pc(r[6], locale)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-v3-mute">{t.female}</dt>
                <dd className="font-v3-display text-3xl tabular-nums text-v3-bone">{r[7] == null ? "—" : pc(r[7], locale)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-v3-mute">{t.since1990}</dt>
                <dd className={`font-v3-display text-3xl tabular-nums ${change >= 0 ? "text-v3-bone" : "text-v3-soft"}`} dir="ltr">
                  {change >= 0 ? "+" : "−"}
                  {pc(Math.abs(change), locale, 0)}
                </dd>
              </div>
            </dl>
            <Spark values={s} locale={locale} />
            <div className="relative flex flex-col gap-2 border-t border-v3-line/70 pt-4">
              <span className="text-xs text-v3-mute">{t.typeTitle}</span>
              <div className="flex flex-wrap gap-2">
                {types.map((k) => (
                  <span key={k} className="flex items-center gap-2 rounded-full border border-v3-line px-3 py-1 text-xs text-v3-soft">
                    <b className="font-mono text-v3-light">{k}</b>
                    {t.types[k]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── 6. Gender strip ─────────────────────────────────────────────────────────

export function GenderStrip({ locale }: { locale: Locale }) {
  const t = COPY[locale].gender
  const reduce = useReducedMotion()
  const avg = WORLD.female[7]
  const rows = FEMALE_STRIP.map((i) => byIso(i) as CountryRow).sort((a, b) => (a[7] ?? 0) - (b[7] ?? 0))
  const lo = 10
  const hi = 80
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100
  const [hot, setHot] = useState<string | null>(null)
  const touch = (i: string) => {
    setHot(i)
    stamp("gender")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 flex flex-wrap gap-5 text-xs text-v3-mute">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-v3-light" aria-hidden /> {t.above}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-v3-mute" aria-hidden /> {t.below}
        </span>
      </div>
      <div className="relative [--nc:6.5rem] [--vc:3.25rem] sm:[--nc:9rem] sm:[--vc:4rem]" dir="ltr">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 border-s-2 border-dashed border-v3-light/60" style={{ left: `calc(var(--nc) + (100% - var(--nc) - var(--vc)) * ${at(avg) / 100})` }}>
          <span className="absolute top-0 start-1.5 whitespace-nowrap text-xs text-v3-light">
            {t.avg} {pc(avg, locale)}
          </span>
        </div>
        <ul className="flex flex-col gap-1 pt-8">
          {rows.map((r, i) => {
            const v = r[7] ?? 0
            const up = v >= avg
            const a = at(Math.min(v, avg))
            const w = Math.abs(at(v) - at(avg))
            return (
              <li key={r[0]}>
                <button
                  type="button"
                  onPointerEnter={() => touch(r[0])}
                  onFocus={() => touch(r[0])}
                  onClick={() => touch(r[0])}
                  className={`grid w-full grid-cols-[var(--nc)_1fr_var(--vc)] items-center gap-0 rounded-md py-1 text-start text-sm transition-colors ${hot === r[0] ? "bg-v3-raise" : ""}`}
                >
                  <span className="flex items-center gap-2 truncate pe-2 text-v3-soft" dir={locale === "fa" ? "rtl" : "ltr"}>
                    <CountryFlag iso={r[0]} />
                    <span className="truncate">{nameOf(r, locale)}</span>
                  </span>
                  <span className="relative h-4">
                    <motion.span
                      className={`absolute inset-y-1 rounded-full ${up ? "bg-v3-light/70" : "bg-v3-mute/50"}`}
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.04, ease: ARRIVE }}
                      style={{ left: `${a}%`, width: `${w}%`, transformOrigin: up ? "left" : "right" }}
                    />
                    <span
                      className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-v3-ink ${up ? "bg-v3-light" : "bg-v3-mute"} ${hot === r[0] ? "scale-150" : ""} transition-transform`}
                      style={{ left: `${at(v)}%` }}
                    />
                  </span>
                  <span className={`text-end tabular-nums ${hot === r[0] ? "text-v3-light" : "text-v3-bone"}`}>{pc(v, locale)}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div aria-hidden className="relative ms-(--nc) me-(--vc) h-5 pt-2 text-[10px] text-v3-mute">
          {[10, 30, 50, 70].map((v) => (
            <span key={v} className="absolute -translate-x-1/2" style={{ left: `${at(v)}%` }}>
              {pc(v, locale, 0)}
            </span>
          ))}
        </div>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</p>
    </div>
  )
}

