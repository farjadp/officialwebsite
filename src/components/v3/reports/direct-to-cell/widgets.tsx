"use client"

// ============================================================================
// File Path: src/components/v3/reports/direct-to-cell/widgets.tsx
// Why: The interactive figures of report 03, apart from the globe. The page
//      is a server component so every sentence is in the HTML; these run in
//      the browser, render a complete default state on the server, and
//      respect reduced motion. Colours are v3 theme tokens throughout, so
//      they follow the light/dark switch.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import { Check, Radio, RotateCcw, X } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { BEAM_MBPS, CITIES, GENERATIONS, NEEDS, SIGNAL, SWITCHBOARD, USES, type Country } from "./data"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const FA = "۰۱۲۳۴۵۶۷۸۹"
const d = (s: string, l: Locale) => (l === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]).replace(/\./g, "٫").replace(/,/g, "٬") : s)
const n = (v: number, l: Locale, frac = 0) =>
  d(v.toLocaleString("en-US", { maximumFractionDigits: frac, minimumFractionDigits: frac }), l)

// ── 1. The beam calculator ──────────────────────────────────────────────────

/** Bits per second, shown in whichever unit keeps the number readable. */
function rate(kbps: number, l: Locale): string {
  const fa = l === "fa"
  if (kbps >= 1000) return `${n(kbps / 1000, l, 1)} ${fa ? "مگابیت" : "Mbps"}`
  if (kbps >= 1) return `${n(kbps, l, kbps < 10 ? 1 : 0)} ${fa ? "کیلوبیت" : "kbps"}`
  return `${n(kbps * 1000, l, 0)} ${fa ? "بیت" : "bps"}`
}

/** Slider position (0–100) → share of the city online at once, 0.001%–10%. */
const SHARE_MIN = Math.log10(0.00001)
const SHARE_MAX = Math.log10(0.1)
const toShare = (s: number) => 10 ** (SHARE_MIN + (s / 100) * (SHARE_MAX - SHARE_MIN))

export function BeamCalculator({ locale }: { locale: Locale }) {
  const t = COPY[locale].calc
  const fa = locale === "fa"
  const [city, setCity] = useState(CITIES[0].key)
  const [slider, setSlider] = useState(50)
  const [beams, setBeams] = useState(1)
  const pop = CITIES.find((c) => c.key === city)!.pop
  const share = toShare(slider)
  const users = Math.max(1, Math.round(pop * share))
  const perUser = (BEAM_MBPS * 1000 * beams) / users
  const pct = share * 100

  return (
    <div role="group" aria-label={t.title} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Controls */}
      <div className="flex flex-col gap-8 lg:col-span-5">
        <div className="flex flex-col gap-3">
          <span className="text-sm text-v3-mute">{t.cityLabel}</span>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={city === c.key}
                onClick={() => setCity(c.key)}
                className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                  city === c.key ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-light"
                }`}
              >
                {t.cities[c.key]}
              </button>
            ))}
          </div>
          <span className="text-xs text-v3-mute">
            {t.popLabel}: {n(pop, locale)}
          </span>
        </div>

        <label className="flex flex-col gap-3">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-v3-mute">{t.shareLabel}</span>
            <span className="font-v3-display text-2xl text-v3-bone">
              {d(pct < 0.01 ? pct.toFixed(3) : pct < 1 ? pct.toFixed(2) : pct.toFixed(1), locale)}
              {fa ? "٪" : "%"}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-v3-light"
          />
          <span className="text-xs text-v3-mute">
            = {n(users, locale)} {t.people}
          </span>
        </label>

        <label className="flex flex-col gap-3">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-v3-mute">{t.beamsLabel}</span>
            <span className="font-v3-display text-2xl text-v3-bone">{n(beams, locale)}</span>
          </span>
          <input
            type="range"
            min={1}
            max={20}
            value={beams}
            onChange={(e) => setBeams(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-v3-light"
          />
          <span className="text-xs text-v3-mute">
            {t.beamsNote.replace("{mbps}", n(BEAM_MBPS * beams, locale))}
          </span>
        </label>
      </div>

      {/* Result */}
      <div className="flex flex-col gap-6 lg:col-span-7">
        <div className="flex flex-col gap-2 rounded-2xl border border-v3-line/80 bg-v3-raise p-6 md:p-8">
          <span className="text-sm text-v3-mute">{t.perUser}</span>
          <motion.span
            key={Math.round(Math.log10(perUser) * 20)}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-v3-display text-5xl font-light text-v3-light md:text-7xl"
            aria-live="polite"
          >
            {rate(perUser, locale)}
            <span className="ms-2 text-xl text-v3-mute md:text-2xl">{fa ? "بر ثانیه" : "/s"}</span>
          </motion.span>
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {USES.map((u) => {
            const ok = perUser >= u.kbps
            return (
              <li
                key={u.key}
                className={`flex flex-col gap-1 rounded-xl border p-4 transition-all duration-500 ${
                  ok ? "border-v3-light/60 bg-v3-light/10" : "border-v3-line/60 opacity-55"
                }`}
              >
                <span className="flex items-center gap-2 text-sm">
                  {ok ? <Check className="h-4 w-4 text-v3-light" aria-hidden /> : <X className="h-4 w-4 text-v3-mute" aria-hidden />}
                  <span className={ok ? "text-v3-bone" : "text-v3-mute line-through decoration-v3-mute/50"}>{t.uses[u.key]}</span>
                </span>
                <span className="text-xs text-v3-mute">≈ {rate(u.kbps, locale)}</span>
              </li>
            )
          })}
        </ul>
        <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.caveat}</p>
      </div>
    </div>
  )
}

// ── 2. The switchboard ──────────────────────────────────────────────────────

export function Switchboard({ locale }: { locale: Locale }) {
  const t = COPY[locale].switchboard
  const [country, setCountry] = useState<Country>("iran")
  const state = SWITCHBOARD[country]
  const on = NEEDS.filter((k) => state[k]).length
  const live = on === NEEDS.length

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SWITCHBOARD) as Country[]).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={country === c}
            onClick={() => setCountry(c)}
            className={`min-h-11 rounded-full border px-5 text-sm transition-colors ${
              country === c ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-light"
            }`}
          >
            {t.countries[c]}
          </button>
        ))}
      </div>

      <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {NEEDS.map((k, i) => {
          const ok = state[k]
          return (
            <motion.li
              key={`${country}-${k}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className={`flex flex-col gap-2 rounded-2xl border p-5 ${ok ? "border-v3-light/50 bg-v3-raise" : "border-dashed border-v3-line"}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className={`font-medium ${ok ? "text-v3-bone" : "text-v3-mute"}`}>{t.needs[k].name}</span>
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${ok ? "bg-v3-light" : "bg-v3-line"}`}
                  aria-label={ok ? t.yes : t.no}
                  role="img"
                >
                  <motion.span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-v3-ink"
                    initial={false}
                    animate={{ insetInlineStart: ok ? "1.375rem" : "0.125rem" }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                </span>
              </span>
              <span className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.needs[k].body}</span>
            </motion.li>
          )
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.p
          key={country}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`max-w-3xl border-s-2 ps-5 text-xl leading-relaxed rtl:leading-loose ${live ? "border-v3-light text-v3-bone" : "border-v3-mute text-v3-soft"}`}
          aria-live="polite"
        >
          {t.verdicts[country]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── 3. Signal strength ──────────────────────────────────────────────────────

const DBM_MIN = -130
const DBM_MAX = -70

export function SignalGauge({ locale }: { locale: Locale }) {
  const t = COPY[locale].signal
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()
  const show = inView || reduce
  const w = (dbm: number) => `${((dbm - DBM_MIN) / (DBM_MAX - DBM_MIN)) * 100}%`
  const ratio = Math.round(10 ** ((SIGNAL.lte - SIGNAL.dtc) / 10))
  const rows = [
    { key: "lte", dbm: SIGNAL.lte, lit: false },
    { key: "dtc", dbm: SIGNAL.dtc, lit: true },
  ] as const

  return (
    <div ref={ref} role="group" aria-label={t.title} className="flex flex-col gap-8">
      {rows.map((r, i) => (
        <div key={r.key} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <span className={r.lit ? "text-v3-light" : "text-v3-bone"}>{t.rows[r.key]}</span>
            <bdi dir="ltr" className={`font-v3-display text-3xl tabular-nums ${r.lit ? "text-v3-light" : "text-v3-bone"}`}>
              {d(String(r.dbm), locale)} dBm
            </bdi>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-v3-raise">
            <motion.div
              className={`absolute inset-y-0 start-0 rounded-full ${r.lit ? "bg-v3-light" : "bg-v3-soft/60"}`}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: show ? w(r.dbm) : 0 }}
              transition={{ duration: 1, delay: i * 0.25, ease: ARRIVE }}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between text-xs text-v3-mute" dir="ltr">
        <span>{DBM_MIN} dBm · {t.weak}</span>
        <span>{t.strong} · {DBM_MAX} dBm</span>
      </div>
      <p className="max-w-3xl text-xl leading-relaxed text-v3-bone rtl:leading-loose">
        {t.reading.replace("{db}", d(String(SIGNAL.lte - SIGNAL.dtc), locale)).replace("{x}", d(String(ratio), locale))}
      </p>
    </div>
  )
}

// ── 4. Dish vs phone, under jamming ─────────────────────────────────────────

function JamPanel({ kind, jam, reduce, t }: { kind: "dish" | "phone"; jam: boolean; reduce: boolean | null; t: (typeof COPY)["en"]["jamming"] }) {
  const dish = kind === "dish"
  const survives = dish || !jam
  return (
    <figure className="flex flex-col gap-3">
      <svg viewBox="0 0 300 240" className="h-auto w-full" role="img" aria-label={t[kind].name}>
        {/* Satellite */}
        <g transform="translate(150 34)">
          <rect x="-10" y="-7" width="20" height="14" rx="2" className="fill-v3-bone" />
          <rect x="-40" y="-4" width="26" height="8" className="fill-v3-soft/70" />
          <rect x="14" y="-4" width="26" height="8" className="fill-v3-soft/70" />
        </g>
        {/* Ground */}
        <line x1="10" y1="210" x2="290" y2="210" className="stroke-v3-line" strokeWidth="2" />
        {/* The signal */}
        {dish ? (
          <polygon points="150,198 140,44 160,44" className={survives ? "fill-v3-light/50" : "fill-v3-mute/20"} />
        ) : (
          [30, 55, 80].map((r, i) => (
            <motion.circle
              key={r}
              cx="150"
              cy="196"
              r={r}
              fill="none"
              className={survives ? "stroke-v3-light/60" : "stroke-v3-mute/25"}
              strokeWidth="1.5"
              strokeDasharray="3 4"
              animate={reduce ? undefined : { opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
          ))
        )}
        {/* Device */}
        {dish ? (
          <g transform="translate(150 200)">
            <path d="M-22 0 Q0 -18 22 0 Z" className="fill-v3-bone" />
            <line x1="0" y1="0" x2="0" y2="10" className="stroke-v3-bone" strokeWidth="3" />
          </g>
        ) : (
          <rect x="143" y="186" width="14" height="24" rx="3" className="fill-v3-bone" />
        )}
        {/* Jammer */}
        <AnimatePresence>
          {jam && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x="232" y="176" width="22" height="34" rx="2" className="fill-v3-mute" />
              {[40, 75, 110, 145].map((r, i) => (
                <motion.circle
                  key={r}
                  cx="243"
                  cy="176"
                  r={r}
                  fill="none"
                  className="stroke-v3-mute"
                  strokeWidth="2"
                  animate={reduce ? undefined : { opacity: [0.7, 0.15, 0.7] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <figcaption className="flex flex-col gap-1">
        <span className={`font-medium ${survives ? "text-v3-bone" : "text-v3-mute"}`}>{t[kind].name}</span>
        <span className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{jam ? t[kind].jammed : t[kind].clear}</span>
      </figcaption>
    </figure>
  )
}

/**
 * A schematic, not a link budget: a dish concentrates its energy into a
 * narrow beam pointed at the satellite; a phone radiates in every direction
 * at a fraction of the power. Switch the jammer on and see which link drowns.
 */
export function JammingDiagram({ locale }: { locale: Locale }) {
  const t = COPY[locale].jamming
  const [jam, setJam] = useState(false)
  const reduce = useReducedMotion()

  return (
    <div role="group" aria-label={t.title} className="flex flex-col gap-8">
      <button
        type="button"
        onClick={() => setJam((j) => !j)}
        aria-pressed={jam}
        className="inline-flex min-h-12 items-center gap-3 self-start rounded-full bg-v3-bone px-6 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light"
      >
        {jam ? <RotateCcw className="h-4 w-4" aria-hidden /> : <Radio className="h-4 w-4" aria-hidden />}
        {jam ? t.off : t.on}
      </button>
      <div className="grid gap-10 md:grid-cols-2">
        <JamPanel kind="dish" jam={jam} reduce={reduce} t={t} />
        <JamPanel kind="phone" jam={jam} reduce={reduce} t={t} />
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.caveat}</p>
    </div>
  )
}

// ── 5. Viral claims, flipped ────────────────────────────────────────────────

export function ClaimCards({ locale }: { locale: Locale }) {
  const t = COPY[locale].claims
  const [open, setOpen] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="flex flex-col gap-6">
      <span className="text-sm text-v3-mute">{t.hint}</span>
      <ul className="grid gap-4 md:grid-cols-2">
        {t.items.map((c, i) => {
          const flipped = open.has(i)
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={flipped}
                className={`flex min-h-44 w-full flex-col gap-3 rounded-2xl border p-6 text-start transition-colors duration-500 ${
                  flipped ? "border-v3-light/60 bg-v3-raise" : "border-v3-line/80 hover:border-v3-light/50"
                }`}
              >
                <span className="text-xs text-v3-mute">{flipped ? t.verdictLabel : t.claimLabel}</span>
                <AnimatePresence mode="wait" initial={false}>
                  {flipped ? (
                    <motion.span key="v" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
                      <span className={`self-start rounded-full px-3 py-0.5 text-xs font-semibold ${c.true ? "bg-v3-light text-v3-ink" : "bg-v3-mute/30 text-v3-bone"}`}>
                        {c.verdict}
                      </span>
                      <span className="leading-relaxed text-v3-bone rtl:leading-loose">{c.why}</span>
                    </motion.span>
                  ) : (
                    <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-v3-display text-2xl leading-snug text-v3-bone rtl:leading-relaxed">
                      «{c.claim}»
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── 6. Generations ──────────────────────────────────────────────────────────

export function Generations({ locale }: { locale: Locale }) {
  const t = COPY[locale].generations
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()
  const [view, setView] = useState<"perSatellite" | "system">("system")
  const x = GENERATIONS[view]
  // Log scale: 1× and 100× on one axis without the first vanishing.
  const width = useMemo(() => (v: number) => `${(Math.log10(v) / Math.log10(120)) * 100 + 3}%`, [])

  return (
    <div ref={ref} role="group" aria-label={t.title} className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {(["system", "perSatellite"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={view === k}
            onClick={() => setView(k)}
            className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
              view === k ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-light"
            }`}
          >
            {t.views[k]}
          </button>
        ))}
      </div>
      {[
        { key: "v1", v: 1, lit: false },
        { key: "v2", v: x, lit: true },
      ].map((g, i) => (
        <div key={g.key} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <span className={g.lit ? "text-v3-light" : "text-v3-bone"}>{t.rows[g.key as "v1" | "v2"]}</span>
            <bdi dir="ltr" className={`font-v3-display text-3xl ${g.lit ? "text-v3-light" : "text-v3-bone"}`}>
              {d(String(g.v), locale)}×
            </bdi>
          </div>
          <div className="relative h-5 overflow-hidden rounded-full bg-v3-raise">
            <motion.div
              className={`absolute inset-y-0 start-0 rounded-full ${
                g.lit ? "bg-[repeating-linear-gradient(135deg,var(--v3-accent)_0_8px,transparent_8px_14px)] ring-1 ring-v3-light" : "bg-v3-soft/60"
              }`}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: inView || reduce ? width(g.v) : 0 }}
              transition={{ duration: 0.9, delay: i * 0.2, ease: ARRIVE }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-v3-mute">{t.scale}</p>
      <p className="max-w-3xl text-lg leading-relaxed text-v3-bone rtl:leading-loose">
        {t.reading.replace("{year}", d(String(GENERATIONS.nextYear), locale))}
      </p>
    </div>
  )
}
