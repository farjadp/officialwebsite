"use client"

// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part1/widgets.tsx
// Why: The interactive figures of report 11 (Gen Z series, part 1): the room
//      of 100, the bundling bars, the find-a-twin rooms (appendix matrix),
//      the left/right camps by country and the who-backs-it-more game with
//      its dumbbell chart. Server-rendered default states, reduced motion
//      respected, v3 tokens only: gold is Gen Z, muted the older generation,
//      dem/rep tones only for left and right. Numeric axes stay left-to-right
//      in Persian (politics' left is on the left in both languages).
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import type { Locale } from "@/lib/nav"
import {
  BUNDLING,
  CAMPS_AVG,
  CAMPS_BY_COUNTRY,
  COUNTRIES,
  GENERATIONS,
  ISSUES,
  ISSUE_KEYS,
  MATCH_BY_GEN,
  STRONG,
  STRONG_PER_100,
  overChance,
  type Country,
  type Gen,
  type IssueKey,
} from "../data"
import { medal } from "../medals"
import { ARRIVE, Bar, Figure, Legend, Pill, num, pct, signed } from "../ui"
import { COPY } from "./copy"

// ── 1. Room of 100 ──────────────────────────────────────────────────────────

export function RoomOf100({ locale }: { locale: Locale }) {
  const t = COPY[locale].room
  const reduce = useReducedMotion()
  const [gen, setGen] = useState<"boomers" | "genz">("boomers")
  const { left, right } = STRONG_PER_100[gen]
  const tone = (i: number) => (i < left ? "bg-v3-dem" : i >= 100 - right ? "bg-v3-rep" : "bg-v3-line")
  return (
    <Figure caption={t.caption}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-v3-mute">{t.pick}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.pick}>
          {(["boomers", "genz"] as const).map((g) => (
            <Pill key={g} on={gen === g} onClick={() => (setGen(g), medal("room"))}>
              {t.gens[g]}
            </Pill>
          ))}
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[minmax(0,22rem)_1fr] md:items-center">
        <div
          className="grid grid-cols-10 gap-1.5 md:gap-2"
          dir="ltr"
          role="img"
          aria-label={t.count(String(left), String(right))}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <motion.span
              key={i}
              layout={!reduce}
              transition={reduce ? { duration: 0 } : { duration: 0.35, ease: ARRIVE, delay: (i % 10) * 0.01 }}
              className={`aspect-square rounded-full transition-colors duration-500 ${tone(i)}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <Legend
            items={[
              { label: t.legend.left, tone: "dem" },
              { label: t.legend.right, tone: "rep" },
              { label: t.legend.rest, tone: "line" },
            ]}
          />
          <div className="flex items-end gap-8">
            <p className="flex flex-col">
              <span className="font-v3-display text-6xl leading-none tabular-nums text-v3-dem">{num(left, locale)}</span>
              <span className="text-sm text-v3-soft">{t.legend.left}</span>
            </p>
            <p className="flex flex-col">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={right}
                  initial={reduce ? false : { y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  className="font-v3-display text-6xl leading-none tabular-nums text-v3-rep"
                >
                  {num(right, locale)}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-v3-soft">{t.legend.right}</span>
            </p>
          </div>
          <p className="text-xs text-v3-mute" aria-live="polite">
            {pct(STRONG[gen].left, locale, 1)} · {pct(STRONG[gen].right, locale, 1)}
          </p>
        </div>
      </div>
    </Figure>
  )
}

// ── 2a. Bundling bars ───────────────────────────────────────────────────────

const OLD_TO_YOUNG: Gen[] = ["boomers", "genx", "millennials", "genz"]

export function BundleBars({ locale }: { locale: Locale }) {
  const t = COPY[locale].bundle
  const reduce = useReducedMotion()
  return (
    <Figure caption={t.barsCaption}>
      <p className="text-sm text-v3-mute">{t.barsLabel}</p>
      <ul className="flex flex-col gap-4">
        {OLD_TO_YOUNG.map((g) => (
          <li key={g} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]">
            <span className={`text-sm ${g === "genz" ? "text-v3-light" : "text-v3-soft"}`}>{t.gens[g]}</span>
            <Bar value={BUNDLING[g]} max={20} gold={g === "genz"} thick label={pct(BUNDLING[g], locale, g === "boomers" || g === "genx" ? 0 : 1)} reduce={reduce} />
          </li>
        ))}
      </ul>
    </Figure>
  )
}

// ── 2b. Find a twin ─────────────────────────────────────────────────────────

export function TwinRooms({ locale }: { locale: Locale }) {
  const t = COPY[locale].bundle
  const reduce = useReducedMotion()
  const [you, setYou] = useState<Gen>("boomers")
  const [room, setRoom] = useState<Gen>("genz")
  const cell = MATCH_BY_GEN[you][room]
  const pick = (y: Gen, r: Gen) => {
    setYou(y)
    setRoom(r)
    medal("twin")
  }
  const shade = (v: number) => Math.min(Math.max((v - 7) / 11, 0), 1)
  return (
    <Figure caption={t.twinsCaption}>
      <div className="flex flex-col gap-2">
        <h3 className="font-v3-display text-2xl text-v3-bone">{t.twinsTitle}</h3>
        <p className="max-w-3xl leading-relaxed text-v3-soft rtl:leading-loose">{t.twinsLead}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5">
          {[
            { label: t.you, value: you, set: (g: Gen) => pick(g, room) },
            { label: t.roomOf, value: room, set: (g: Gen) => pick(you, g) },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-2">
              <span className="text-sm text-v3-mute">{row.label}</span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={row.label}>
                {OLD_TO_YOUNG.map((g) => (
                  <Pill key={g} on={row.value === g} onClick={() => row.set(g)}>
                    {t.gens[g]}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2 rounded-2xl border border-v3-light/40 bg-v3-light/5 p-5" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={`${you}-${room}`}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-v3-display text-4xl leading-tight text-v3-light md:text-5xl"
              >
                {t.match(pct(cell.v, locale, 1))}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm text-v3-soft">
              {t.chance(pct(cell.chance, locale, 1))} · {t.times(num(overChance(cell), locale, 1))}
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <Bar value={cell.v} max={20} gold label={pct(cell.v, locale, 1)} reduce={reduce} />
              <Bar value={cell.chance} max={20} label={pct(cell.chance, locale, 1)} reduce={reduce} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 overflow-x-auto">
          <table className="w-full min-w-[20rem] border-separate border-spacing-1 text-center text-sm" dir="ltr">
            <thead>
              <tr>
                <th className="w-24 text-start text-xs font-normal text-v3-mute" dir={locale === "fa" ? "rtl" : "ltr"}>
                  {t.you} ↓ / {t.roomOf} →
                </th>
                {GENERATIONS.map((g) => (
                  <th key={g} className="px-1 text-xs font-normal text-v3-mute">
                    {t.gens[g]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GENERATIONS.map((p) => (
                <tr key={p}>
                  <th className="text-start text-xs font-normal text-v3-soft">{t.gens[p]}</th>
                  {GENERATIONS.map((r) => {
                    const c = MATCH_BY_GEN[p][r]
                    const on = p === you && r === room
                    return (
                      <td key={r} className="p-0">
                        <button
                          type="button"
                          onClick={() => pick(p, r)}
                          aria-pressed={on}
                          aria-label={`${t.gens[p]} → ${t.gens[r]}: ${pct(c.v, locale, 1)}`}
                          className={`w-full rounded-md py-2.5 tabular-nums transition-[outline-color] outline-2 outline-offset-1 ${on ? "outline-v3-bone" : "outline-transparent hover:outline-v3-line"}`}
                          style={{ backgroundColor: `color-mix(in oklab, var(--v3-accent) ${Math.round(10 + shade(c.v) * 60)}%, transparent)` }}
                        >
                          <span className={shade(c.v) > 0.55 ? "text-v3-ink" : "text-v3-bone"}>{num(c.v, locale, 1)}</span>
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Figure>
  )
}

// ── 3. Two camps ────────────────────────────────────────────────────────────

type Place = "avg" | Country
const DOMAIN: [number, number] = [20, 70]
const xPct = (v: number) => ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * 100

export function Camps({ locale }: { locale: Locale }) {
  const t = COPY[locale].camps
  const reduce = useReducedMotion()
  const [place, setPlace] = useState<Place>("avg")
  const rows = (["boomers", "genz"] as const).map((g) => {
    if (place === "avg") return { g, left: CAMPS_AVG[g].left, right: CAMPS_AVG[g].right }
    const c = CAMPS_BY_COUNTRY[place]
    return { g, left: c.left[g], right: c.right[g] }
  })
  const dp = place === "avg" ? 0 : 1
  return (
    <Figure caption={t.caption}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-v3-mute">{t.where}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.where}>
          {(["avg", ...COUNTRIES] as Place[]).map((p) => (
            <Pill key={p} on={place === p} onClick={() => (setPlace(p), medal("camps"))}>
              {t.places[p]}
            </Pill>
          ))}
        </div>
      </div>
      <Legend
        items={[
          { label: t.leftVoters, tone: "dem" },
          { label: t.rightVoters, tone: "rep" },
        ]}
      />
      <div className="flex flex-col gap-8">
        {rows.map((r) => {
          const gap = r.right - r.left
          return (
            <div key={r.g} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className={`font-v3-display text-xl ${r.g === "genz" ? "text-v3-light" : "text-v3-bone"}`}>{t.gens[r.g]}</span>
                <span className="text-sm tabular-nums text-v3-soft">{t.gap(num(gap, locale, dp))}</span>
              </div>
              <div className="relative h-10" dir="ltr">
                <span className="absolute inset-x-0 top-1/2 h-px bg-v3-line" aria-hidden />
                <span className="absolute top-0 bottom-0 w-px border-s border-dashed border-v3-mute/70" style={{ left: `${xPct(50)}%` }} aria-hidden />
                <motion.span
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-v3-mute/60"
                  initial={false}
                  animate={{ left: `${xPct(r.left)}%`, width: `${xPct(r.right) - xPct(r.left)}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
                />
                {[
                  { v: r.left, cls: "bg-v3-dem" },
                  { v: r.right, cls: "bg-v3-rep" },
                ].map((d, i) => (
                  <motion.span
                    key={i}
                    className={`absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-semibold tabular-nums text-v3-ink ${d.cls}`}
                    initial={false}
                    animate={{ left: `${xPct(d.v)}%` }}
                    transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
                  >
                    {num(d.v, locale, 0)}
                  </motion.span>
                ))}
              </div>
            </div>
          )
        })}
        <div className="relative h-6 text-xs text-v3-mute" dir="ltr">
          {[20, 30, 40, 50, 60, 70].map((v) => (
            <span key={v} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${xPct(v)}%` }}>
              {num(v, locale)}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-xs text-v3-mute" dir="ltr">
          <span className="flex items-center gap-1">
            <span aria-hidden>←</span>
            <bdi>{t.axis.left}</bdi>
          </span>
          <bdi>{t.axis.mid}</bdi>
          <span className="flex items-center gap-1">
            <bdi>{t.axis.right}</bdi>
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
      {place !== "avg" && (
        <div className="grid gap-3 border-t border-v3-line/70 pt-5 sm:grid-cols-2">
          <p className="text-sm text-v3-mute sm:col-span-2">{t.diffTitle}</p>
          {(["left", "right"] as const).map((side) => {
            const c = CAMPS_BY_COUNTRY[place][side]
            return (
              <div key={side} className={`flex flex-col gap-1 rounded-xl border p-3 ${c.sig ? "border-v3-line" : "border-dashed border-v3-line/70"}`}>
                <span className="text-xs text-v3-soft">{t.diff[side]}</span>
                <span className={`font-v3-display text-2xl tabular-nums ${side === "left" ? "text-v3-dem" : "text-v3-rep"}`}>{signed(c.diff, locale)}</span>
                <span className="text-xs text-v3-mute">
                  {t.ci(signed(c.ci[0], locale), signed(c.ci[1], locale))}
                  {!c.sig && ` · ${t.ns}`}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Figure>
  )
}

// ── 4. Who backs it more? ───────────────────────────────────────────────────

export function IssuesGame({ locale }: { locale: Locale }) {
  const t = COPY[locale].issues
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<("genz" | "boomers")[]>([])
  const done = i >= ISSUE_KEYS.length
  const key = ISSUE_KEYS[Math.min(i, ISSUE_KEYS.length - 1)]
  const answered = answers.length > i
  const truth = (k: IssueKey) => (ISSUES[k].genz > ISSUES[k].boomers ? "genz" : "boomers")
  const score = answers.filter((a, j) => a === truth(ISSUE_KEYS[j])).length

  const answer = (g: "genz" | "boomers") => {
    if (answered) return
    setAnswers((a) => (a.length === i ? [...a, g] : a))
    if (i === ISSUE_KEYS.length - 1) medal("issues")
  }
  const next = () => setI((cur) => (answers.length > cur ? cur + 1 : cur))
  const reset = () => {
    setI(0)
    setAnswers([])
  }

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8">
      <div className="flex items-center justify-between gap-3 text-sm text-v3-mute">
        <span className="tabular-nums">
          {num(Math.min(i + 1, ISSUE_KEYS.length), locale)} / {num(ISSUE_KEYS.length, locale)}
        </span>
        <span className="tabular-nums" aria-live="polite">
          {t.score(num(score, locale), num(answers.length, locale))}
        </span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <motion.div
            key={key}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: ARRIVE }}
            className="flex flex-col gap-5"
          >
            <p className="font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl">{t.items[key]}</p>
            <p className="text-sm text-v3-mute">{t.who}</p>
            <div className="flex flex-wrap gap-3">
              {(["genz", "boomers"] as const).map((g) => {
                const chosen = answers[i] === g
                const correct = truth(key) === g
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => answer(g)}
                    disabled={answered}
                    className={`rounded-full border px-5 py-2 text-base transition-colors ${
                      answered
                        ? correct
                          ? "border-v3-light bg-v3-light text-v3-ink"
                          : chosen
                            ? "border-v3-mute text-v3-mute line-through"
                            : "border-v3-line text-v3-mute"
                        : "border-v3-line text-v3-bone hover:border-v3-light"
                    }`}
                  >
                    {t.gens[g]}
                  </button>
                )
              })}
            </div>
            {answered && (
              <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                <p className="text-v3-bone">
                  {answers[i] === truth(key) ? t.right : t.wrong} <span className="text-v3-soft">{t.reveal(pct(ISSUES[key].genz, locale), pct(ISSUES[key].boomers, locale))}</span>
                </p>
                <div className="flex flex-col gap-1.5">
                  <Bar value={ISSUES[key].genz} max={100} gold label={`${t.gens.genz} ${pct(ISSUES[key].genz, locale)}`} reduce={reduce} />
                  <Bar value={ISSUES[key].boomers} max={100} label={`${t.gens.boomers} ${pct(ISSUES[key].boomers, locale)}`} reduce={reduce} />
                </div>
                <button type="button" onClick={next} className="self-start rounded-full bg-v3-bone px-5 py-2 text-sm text-v3-ink hover:bg-v3-light">
                  {i === ISSUE_KEYS.length - 1 ? "✓" : locale === "fa" ? "بعدی ←" : "Next →"}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-start gap-4">
            <p className="font-v3-display text-4xl text-v3-light">{t.score(num(score, locale), num(ISSUE_KEYS.length, locale))}</p>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-v3-line px-4 py-1.5 text-sm text-v3-soft hover:border-v3-light hover:text-v3-bone">
              <RotateCcw className="h-3.5 w-3.5" />
              {t.again}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ISSUE_DOMAIN: [number, number] = [20, 90]
const iPct = (v: number) => ((v - ISSUE_DOMAIN[0]) / (ISSUE_DOMAIN[1] - ISSUE_DOMAIN[0])) * 100

export function IssuesChart({ locale }: { locale: Locale }) {
  const t = COPY[locale].issues
  return (
    <Figure caption={t.caption}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-v3-display text-xl text-v3-bone">{t.chartTitle}</h3>
        <Legend
          items={[
            { label: t.gens.genz, tone: "gold" },
            { label: t.gens.boomers, tone: "mute" },
          ]}
        />
      </div>
      <ul className="flex flex-col gap-5">
        {ISSUE_KEYS.map((k) => {
          const { genz, boomers } = ISSUES[k]
          const lo = Math.min(genz, boomers)
          const hi = Math.max(genz, boomers)
          return (
            <li key={k} className="flex flex-col gap-1.5">
              <span className="text-sm leading-snug text-v3-soft">{t.items[k]}</span>
              <div className="relative h-6" dir="ltr">
                <span className="absolute inset-x-0 top-1/2 h-px bg-v3-line/70" aria-hidden />
                <span className="absolute top-0 bottom-0 border-s border-dashed border-v3-mute/60" style={{ left: `${iPct(50)}%` }} aria-hidden />
                <span className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-v3-mute/60" style={{ left: `${iPct(lo)}%`, width: `${iPct(hi) - iPct(lo)}%` }} aria-hidden />
                <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-v3-mute" style={{ left: `${iPct(boomers)}%` }} title={`${t.gens.boomers} ${boomers}%`} />
                <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-v3-light" style={{ left: `${iPct(genz)}%` }} title={`${t.gens.genz} ${genz}%`} />
                <span className="absolute -top-0.5 text-[11px] tabular-nums text-v3-light" style={{ left: `calc(${iPct(genz)}% ${genz >= boomers ? "+ 12px" : "- 40px"})` }}>
                  {pct(genz, locale)}
                </span>
                <span className="absolute -top-0.5 text-[11px] tabular-nums text-v3-mute" style={{ left: `calc(${iPct(boomers)}% ${boomers > genz ? "+ 12px" : "- 40px"})` }}>
                  {pct(boomers, locale)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="relative h-5 text-xs text-v3-mute" dir="ltr">
        {[20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
          <span key={v} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${iPct(v)}%` }}>
            {pct(v, locale)}
          </span>
        ))}
      </div>
      <p className="text-xs text-v3-mute" dir="ltr" style={{ paddingLeft: `${iPct(50)}%` }}>
        ↑ {t.evenSplit}
      </p>
    </Figure>
  )
}
