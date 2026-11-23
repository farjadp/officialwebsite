"use client"

// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part2/widgets.tsx
// Why: The interactive figures of report 12 (Gen Z series, part 2): the
//      per-question country spread, predict-then-reveal country guessing,
//      cultural distance (CFST) by measure, the match-abroad matrix and the
//      shared-stars sorting game. Server-rendered default states, reduced
//      motion respected, v3 tokens only: gold is Gen Z, muted the older
//      generation. Numeric axes stay left-to-right in Persian.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import type { Locale } from "@/lib/nav"
import {
  CELEBS,
  CFST,
  COUNTRIES,
  COUNTRY_SPREAD,
  GUESS_CHANCE,
  GUESS_COUNTRY,
  LOST_ABROAD,
  MATCH_ABROAD,
  type CfstKey,
  type Gen,
} from "../data"
import { medal } from "../medals"
import { ARRIVE, Bar, Figure, Legend, Pill, num, pct } from "../ui"
import { COPY } from "./copy"

const OLD_TO_YOUNG: Gen[] = ["boomers", "genx", "millennials", "genz"]

// ── 1. Spread between countries ─────────────────────────────────────────────

export function SpreadBars({ locale }: { locale: Locale }) {
  const t = COPY[locale].spread
  const reduce = useReducedMotion()
  return (
    <Figure caption={t.caption}>
      <p className="text-sm text-v3-mute">{t.unit}</p>
      <ul className="flex flex-col gap-5">
        {(["boomers", "genz"] as const).map((g) => (
          <li key={g} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]">
            <span className={`text-sm ${g === "genz" ? "text-v3-light" : "text-v3-soft"}`}>{t.gens[g]}</span>
            <Bar value={COUNTRY_SPREAD[g]} max={12} gold={g === "genz"} thick label={num(COUNTRY_SPREAD[g], locale)} reduce={reduce} />
          </li>
        ))}
      </ul>
    </Figure>
  )
}

// ── 2. Guess the country ────────────────────────────────────────────────────

const G_MAX = 50
const gPct = (v: number) => (v / G_MAX) * 100

export function GuessCountry({ locale }: { locale: Locale }) {
  const t = COPY[locale].guess
  const reduce = useReducedMotion()
  const [guess, setGuess] = useState(40)
  const [shown, setShown] = useState(false)
  const show = () => {
    setShown(true)
    medal("guess")
  }
  return (
    <Figure caption={t.caption}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-v3-soft">{t.predict}</span>
            <span className="font-v3-display text-2xl tabular-nums text-v3-bone">{pct(guess, locale)}</span>
          </span>
          <input
            type="range"
            dir="ltr"
            min={0}
            max={G_MAX}
            step={1}
            value={guess}
            disabled={shown}
            aria-label={t.predict}
            onChange={(e) => setGuess(Number(e.target.value))}
            className="w-full accent-(--v3-accent)"
          />
        </label>
        {!shown ? (
          <button type="button" onClick={show} className="self-start rounded-full bg-v3-bone px-5 py-2 text-sm text-v3-ink hover:bg-v3-light">
            {t.reveal}
          </button>
        ) : (
          <p className="text-sm text-v3-soft" aria-live="polite">
            {t.yours(pct(guess, locale))} · {t.off(num(Math.abs(guess - GUESS_COUNTRY.genz), locale))}
          </p>
        )}
      </div>

      <p className="text-sm text-v3-mute">{t.label}</p>
      <div className="relative flex flex-col gap-4">
        {OLD_TO_YOUNG.map((g, i) => {
          const hidden = g === "genz" && !shown
          return (
            <div key={g} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]">
              <span className={`text-sm ${g === "genz" ? "text-v3-light" : "text-v3-soft"}`}>{t.gens[g]}</span>
              <div className="relative h-5" dir="ltr">
                <span className="absolute inset-y-0 border-s border-dashed border-v3-bone/70" style={{ left: `${gPct(GUESS_CHANCE)}%` }} aria-hidden />
                {g === "genz" && (
                  <span className="absolute -top-1 -bottom-1 w-0.5 bg-v3-bone" style={{ left: `${gPct(guess)}%` }} aria-hidden title={t.yours(pct(guess, locale))} />
                )}
                <motion.span
                  initial={false}
                  animate={{ width: hidden ? "0%" : `${gPct(GUESS_COUNTRY[g])}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.7, ease: ARRIVE, delay: g === "genz" ? 0.1 : i * 0.05 }}
                  className={`absolute inset-y-0 left-0 rounded-sm ${g === "genz" ? "bg-v3-light" : "bg-v3-mute"}`}
                />
                {!hidden && (
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 ps-2 text-xs tabular-nums ${g === "genz" ? "text-v3-light" : "text-v3-soft"}`}
                    style={{ left: `${gPct(GUESS_COUNTRY[g])}%` }}
                  >
                    {pct(GUESS_COUNTRY[g], locale)}
                  </span>
                )}
                {hidden && <span className="absolute top-1/2 left-1 -translate-y-1/2 text-xs text-v3-mute">?</span>}
              </div>
            </div>
          )
        })}
        <div className="grid grid-cols-[6.5rem_1fr] gap-3 md:grid-cols-[8rem_1fr]">
          <span />
          <div className="relative h-5 text-xs text-v3-mute" dir="ltr">
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${gPct(GUESS_CHANCE)}%` }}>
              ↑ {t.chance}
            </span>
          </div>
        </div>
      </div>
    </Figure>
  )
}

// ── 3. Cultural distance ────────────────────────────────────────────────────

const CFST_KEYS: CfstKey[] = ["policy", "trust", "platforms"]
const CFST_MAX = 0.05

export function CfstBars({ locale }: { locale: Locale }) {
  const t = COPY[locale].distance
  const reduce = useReducedMotion()
  const [k, setK] = useState<CfstKey>("policy")
  const c = CFST[k]
  const fmt = (v: number) => num(v, locale, v < 0.01 ? 4 : 3)
  return (
    <Figure caption={t.caption}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-v3-mute">{t.pick}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.pick}>
          {CFST_KEYS.map((key) => (
            <Pill key={key} on={k === key} onClick={() => (setK(key), medal("distance"))}>
              {t.keys[key]}
            </Pill>
          ))}
        </div>
      </div>
      <ul className="flex flex-col gap-5">
        {(["boomers", "genz"] as const).map((g) => (
          <li key={g} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]">
            <span className={`text-sm ${g === "genz" ? "text-v3-light" : "text-v3-soft"}`}>{t.gens[g]}</span>
            <Bar value={c[g]} max={CFST_MAX} gold={g === "genz"} thick label={fmt(c[g])} reduce={reduce} />
          </li>
        ))}
      </ul>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={k}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="font-v3-display text-4xl text-v3-light md:text-5xl"
          aria-live="polite"
        >
          {t.smaller(locale === "fa" ? c.times.replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[Number(x)]).replace(".", "٫") : c.times)}
        </motion.p>
      </AnimatePresence>
    </Figure>
  )
}

// ── 4. Match abroad ─────────────────────────────────────────────────────────

export function MatchAbroad({ locale }: { locale: Locale }) {
  const t = COPY[locale].abroad
  const reduce = useReducedMotion()
  const [gen, setGen] = useState<"boomers" | "genz">("boomers")
  const m = MATCH_ABROAD[gen]
  const shade = (v: number) => Math.min(Math.max((v - 6) / 14, 0), 1)
  return (
    <Figure caption={t.caption}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-v3-mute">{t.pick}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.pick}>
          {(["boomers", "genz"] as const).map((g) => (
            <Pill key={g} on={gen === g} onClick={() => (setGen(g), medal("abroad"))}>
              {t.gens[g]}
            </Pill>
          ))}
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-2 overflow-x-auto">
          <table className="w-full min-w-[19rem] border-separate border-spacing-1 text-center text-sm" dir="ltr">
            <thead>
              <tr>
                <th className="w-24 text-start text-xs font-normal text-v3-mute" dir={locale === "fa" ? "rtl" : "ltr"}>
                  {t.person} ↓ / {t.room} →
                </th>
                {COUNTRIES.map((c) => (
                  <th key={c} className="px-1 text-xs font-normal text-v3-mute">
                    {t.countries[c]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNTRIES.map((p) => (
                <tr key={p}>
                  <th className="text-start text-xs font-normal text-v3-soft">{t.countries[p]}</th>
                  {COUNTRIES.map((r) => {
                    const c = m[p][r]
                    const own = p === r
                    return (
                      <td key={r} className="p-0">
                        <motion.span
                          initial={false}
                          animate={{ opacity: 1 }}
                          className={`block rounded-md py-2.5 tabular-nums outline-2 outline-offset-1 transition-colors duration-500 ${own ? "outline-v3-bone" : "outline-transparent"}`}
                          style={{ backgroundColor: `color-mix(in oklab, var(--v3-accent) ${Math.round(10 + shade(c.v) * 60)}%, transparent)` }}
                          title={`${t.countries[p]} → ${t.countries[r]}: ${c.v}% (chance ${c.chance}%)`}
                        >
                          <span className={shade(c.v) > 0.55 ? "text-v3-ink" : "text-v3-bone"}>{num(c.v, locale, 1)}</span>
                        </motion.span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-v3-mute">{t.own}</p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-v3-mute">{t.lostTitle}</p>
          <ul className="flex flex-col gap-4">
            {OLD_TO_YOUNG.map((g) => (
              <li key={g} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]">
                <span className={`text-sm ${g === "genz" ? "text-v3-light" : "text-v3-soft"}`}>{t.lostGens[g]}</span>
                <Bar value={LOST_ABROAD[g].lost} max={35} gold={g === "genz"} label={t.lost(pct(LOST_ABROAD[g].lost, locale))} reduce={reduce} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Figure>
  )
}

// ── 5. Shared stars ─────────────────────────────────────────────────────────

type Who = "boomers" | "genz"
/** Shuffled once, deterministically, so server and client agree. */
const STARS: { name: string; who: Who }[] = [
  { name: CELEBS.genz.names[2], who: "genz" },
  { name: CELEBS.boomers.names[0], who: "boomers" },
  { name: CELEBS.genz.names[0], who: "genz" },
  { name: CELEBS.boomers.names[2], who: "boomers" },
  { name: CELEBS.genz.names[1], who: "genz" },
  { name: CELEBS.boomers.names[1], who: "boomers" },
]

export function StarsGame({ locale }: { locale: Locale }) {
  const t = COPY[locale].stars
  const reduce = useReducedMotion()
  const [picks, setPicks] = useState<Record<string, Who>>({})
  const [checked, setChecked] = useState(false)
  const all = STARS.every((s) => picks[s.name])
  const score = STARS.filter((s) => picks[s.name] === s.who).length
  const pick = (name: string, w: Who) => {
    if (checked) return
    setPicks((p) => ({ ...p, [name]: w }))
  }
  const check = () => {
    setChecked(true)
    medal("stars")
  }
  const reset = () => {
    setPicks({})
    setChecked(false)
  }
  return (
    <Figure caption={t.caption}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {STARS.map((s) => {
          const mine = picks[s.name]
          const ok = checked && mine === s.who
          const bad = checked && mine !== s.who
          return (
            <li
              key={s.name}
              className={`flex flex-col gap-2 rounded-2xl border p-4 transition-colors ${ok ? "border-v3-light/70 bg-v3-light/5" : bad ? "border-dashed border-v3-mute" : "border-v3-line"}`}
            >
              <span className="font-v3-display text-xl text-v3-bone" dir="ltr">
                {s.name}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-v3-mute">{t.sortInto}</span>
                {(["boomers", "genz"] as const).map((w) => {
                  const on = mine === w
                  const truth = checked && s.who === w
                  return (
                    <button
                      key={w}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(s.name, w)}
                      disabled={checked}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        truth
                          ? "border-v3-light bg-v3-light text-v3-ink"
                          : on
                            ? checked
                              ? "border-v3-mute text-v3-mute line-through"
                              : "border-v3-bone bg-v3-bone text-v3-ink"
                            : "border-v3-line text-v3-soft hover:border-v3-light"
                      }`}
                    >
                      {t.gens[w]}
                    </button>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-4">
        {!checked ? (
          <button
            type="button"
            onClick={check}
            disabled={!all}
            className="rounded-full bg-v3-bone px-5 py-2 text-sm text-v3-ink hover:bg-v3-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.check}
          </button>
        ) : (
          <>
            <p className="font-v3-display text-2xl text-v3-light" aria-live="polite">
              {t.score(num(score, locale))}
            </p>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-v3-line px-4 py-1.5 text-sm text-v3-soft hover:border-v3-light hover:text-v3-bone">
              <RotateCcw className="h-3.5 w-3.5" />
              {t.again}
            </button>
          </>
        )}
      </div>
      <AnimatePresence initial={false}>
        {checked && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: ARRIVE }}
            className="flex flex-col gap-4 border-t border-v3-line/70 pt-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-v3-mute">{t.resultTitle}</p>
              <Legend
                items={[
                  { label: t.gens.genz, tone: "gold" },
                  { label: t.gens.boomers, tone: "mute" },
                ]}
              />
            </div>
            {(["genz", "boomers"] as const).map((g) => (
              <div key={g} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]">
                <span className={`text-sm ${g === "genz" ? "text-v3-light" : "text-v3-soft"}`}>{t.gens[g]}</span>
                <Bar value={CELEBS[g].share} max={100} gold={g === "genz"} thick label={pct(CELEBS[g].share, locale)} reduce={reduce} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Figure>
  )
}
