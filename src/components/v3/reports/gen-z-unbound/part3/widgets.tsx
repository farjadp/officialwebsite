"use client"

// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part3/widgets.tsx
// Why: The interactive figures of report 13 (Gen Z series, part 3): the
//      trust ledger (self-reported change, values read off the report's
//      chart), the weekly platforms chart, the "where the data stop" bar
//      (only the combined 20% is drawn — the report gives no per-measure
//      split) and the feed-experiments quiz. Server-rendered default states,
//      reduced motion respected, v3 tokens only: gold is Gen Z, muted the
//      Boomers. Numeric axes stay left-to-right in Persian.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import type { Locale } from "@/lib/nav"
import {
  ALGO_SHAPES_A_LOT,
  EXPLAINED,
  INSTITUTIONS,
  PLATFORMS,
  PLATFORM_COUNT,
  PLATFORM_KEYS,
  TRUST_CHANGE,
  TRUST_READ_PRECISION,
  type Institution,
  type Platform,
} from "../data"
import { medal } from "../medals"
import { ARRIVE, Bar, Figure, Legend, Pill, num, pct, signed } from "../ui"
import { COPY, FACTOR_KEYS, STUDIES, type FactorKey, type StudyKey } from "./copy"

// ── 1. Trust ledger ─────────────────────────────────────────────────────────

type TrustSort = "report" | "boomers" | "gap"
const T_DOMAIN: [number, number] = [-1.2, 0.4]
const tx = (v: number) => ((v - T_DOMAIN[0]) / (T_DOMAIN[1] - T_DOMAIN[0])) * 100

export function TrustLedger({ locale }: { locale: Locale }) {
  const t = COPY[locale].trust
  const reduce = useReducedMotion()
  const [sort, setSort] = useState<TrustSort>("report")
  const order: Institution[] =
    sort === "report"
      ? [...INSTITUTIONS]
      : [...INSTITUTIONS].sort((a, b) =>
          sort === "boomers"
            ? TRUST_CHANGE[a].boomers - TRUST_CHANGE[b].boomers
            : TRUST_CHANGE[b].genz - TRUST_CHANGE[b].boomers - (TRUST_CHANGE[a].genz - TRUST_CHANGE[a].boomers),
        )
  return (
    <Figure caption={t.caption(num(TRUST_READ_PRECISION, locale, 2))}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-v3-mute">{t.sortLabel}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.sortLabel}>
          {(["report", "boomers", "gap"] as TrustSort[]).map((s) => (
            <Pill key={s} on={sort === s} onClick={() => (setSort(s), medal("trust"))}>
              {t.sorts[s]}
            </Pill>
          ))}
        </div>
      </div>
      <Legend
        items={[
          { label: t.gens.genz, tone: "gold" },
          { label: t.gens.boomers, tone: "mute" },
        ]}
      />
      <ul className="flex flex-col gap-1">
        {order.map((k) => {
          const { genz, boomers } = TRUST_CHANGE[k]
          const lo = Math.min(genz, boomers)
          const hi = Math.max(genz, boomers)
          return (
            <motion.li
              key={k}
              layout={!reduce}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: ARRIVE }}
              className="grid grid-cols-[7.5rem_1fr] items-center gap-3 md:grid-cols-[11rem_1fr]"
            >
              <span className="text-sm leading-tight text-v3-soft">{t.names[k]}</span>
              <div className="relative h-8" dir="ltr" role="img" aria-label={`${t.names[k]}: ${t.gens.genz} ${signed(genz, locale, 2)}, ${t.gens.boomers} ${signed(boomers, locale, 2)}`}>
                <span className="absolute inset-x-0 top-1/2 h-px bg-v3-line/60" aria-hidden />
                <span className="absolute top-0 bottom-0 border-s border-dashed border-v3-bone/50" style={{ left: `${tx(0)}%` }} aria-hidden />
                <span className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-v3-mute/60" style={{ left: `${tx(lo)}%`, width: `${tx(hi) - tx(lo)}%` }} aria-hidden />
                <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-v3-mute" style={{ left: `${tx(boomers)}%` }} />
                <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-v3-light" style={{ left: `${tx(genz)}%` }} />
                <span
                  className="absolute -top-1 text-[10px] tabular-nums text-v3-light"
                  style={{ left: `calc(${tx(genz)}% ${genz >= boomers ? "+ 10px" : "- 34px"})` }}
                >
                  {signed(genz, locale, 2)}
                </span>
                <span
                  className="absolute -top-1 text-[10px] tabular-nums text-v3-mute"
                  style={{ left: `calc(${tx(boomers)}% ${boomers > genz ? "+ 10px" : "- 34px"})` }}
                >
                  {signed(boomers, locale, 2)}
                </span>
              </div>
            </motion.li>
          )
        })}
      </ul>
      <div className="grid grid-cols-[7.5rem_1fr] gap-3 md:grid-cols-[11rem_1fr]">
        <span aria-hidden />
        <div className="flex flex-col gap-1">
          <div className="relative h-5 text-xs text-v3-mute" dir="ltr">
            {[-1.2, -0.8, -0.4, 0, 0.4].map((v) => (
              <span key={v} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${tx(v)}%` }}>
                {v === 0 ? num(0, locale) : signed(v, locale, 1)}
              </span>
            ))}
          </div>
          <div className="flex justify-between text-xs text-v3-mute" dir="ltr">
            <span>← {t.axis.less}</span>
            <span>
              {t.noChange} · {t.axis.more} →
            </span>
          </div>
        </div>
      </div>
    </Figure>
  )
}

// ── 2. Platforms ────────────────────────────────────────────────────────────

type PlatSort = "genz" | "boomers" | "gap"

export function PlatformChart({ locale }: { locale: Locale }) {
  const t = COPY[locale].broadcast
  const reduce = useReducedMotion()
  const [sort, setSort] = useState<PlatSort>("genz")
  const order: Platform[] = [...PLATFORM_KEYS].sort((a, b) => {
    const A = PLATFORMS[a]
    const B = PLATFORMS[b]
    if (sort === "genz") return B.genz - A.genz
    if (sort === "boomers") return B.boomers - A.boomers
    return B.genz - B.boomers - (A.genz - A.boomers)
  })
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
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-v3-mute">{t.sortLabel}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.sortLabel}>
          {(["genz", "boomers", "gap"] as PlatSort[]).map((s) => (
            <Pill key={s} on={sort === s} onClick={() => (setSort(s), medal("feeds"))}>
              {t.sorts[s]}
            </Pill>
          ))}
        </div>
      </div>
      <ul className="flex flex-col gap-4">
        {order.map((k) => {
          const p = PLATFORMS[k]
          return (
            <motion.li
              key={k}
              layout={!reduce}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: ARRIVE }}
              className="grid grid-cols-[6.5rem_1fr] items-center gap-3 md:grid-cols-[8rem_1fr]"
            >
              <span className={`text-sm ${p.boomers > p.genz ? "text-v3-bone" : "text-v3-soft"}`} dir="ltr">
                {p.name}
              </span>
              <span className="flex flex-col gap-1">
                <Bar value={p.genz} max={100} gold label={pct(p.genz, locale)} reduce={reduce} />
                <Bar value={p.boomers} max={100} label={pct(p.boomers, locale)} reduce={reduce} />
              </span>
            </motion.li>
          )
        })}
      </ul>
      <div className="flex flex-col gap-2 border-t border-v3-line/70 pt-5 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
        <p>{t.count(num(PLATFORM_COUNT.genz, locale, 1), num(PLATFORM_COUNT.boomers, locale, 1), num(PLATFORM_COUNT.of, locale))}</p>
        <p>{t.facebook}</p>
        <p>{t.algo(pct(ALGO_SHAPES_A_LOT, locale))}</p>
      </div>
    </Figure>
  )
}

// ── 3. Where the data stop ──────────────────────────────────────────────────

export function WhereDataStop({ locale }: { locale: Locale }) {
  const t = COPY[locale].unexplained
  const reduce = useReducedMotion()
  const [on, setOn] = useState<Set<FactorKey>>(new Set())
  const all = on.size === FACTOR_KEYS.length
  const toggle = (k: FactorKey) => {
    setOn((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      if (next.size === FACTOR_KEYS.length) medal("unexplained")
      return next
    })
  }
  const addAll = () => {
    setOn(new Set(FACTOR_KEYS))
    medal("unexplained")
  }
  return (
    <Figure caption={t.caption}>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            {FACTOR_KEYS.map((k) => (
              <li key={k}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-v3-line/80 px-3 py-2 text-sm text-v3-soft hover:border-v3-light">
                  <input type="checkbox" checked={on.has(k)} onChange={() => toggle(k)} className="h-4 w-4 accent-(--v3-accent)" />
                  {t.factors[k]}
                </label>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button type="button" onClick={addAll} className="rounded-full bg-v3-bone px-4 py-1.5 text-sm text-v3-ink hover:bg-v3-light">
              {t.addAll}
            </button>
            <button
              type="button"
              onClick={() => setOn(new Set())}
              className="inline-flex items-center gap-2 rounded-full border border-v3-line px-4 py-1.5 text-sm text-v3-soft hover:border-v3-light hover:text-v3-bone"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.clear}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-v3-mute" aria-live="polite">
            {all ? t.all : t.added(num(on.size, locale), num(FACTOR_KEYS.length, locale))}
          </p>
          <div className="relative h-12 overflow-hidden rounded-lg border border-v3-line bg-v3-ink/40" dir="ltr">
            <AnimatePresence initial={false}>
              {all ? (
                <motion.span
                  key="solid"
                  className="absolute inset-y-0 left-0 bg-v3-light"
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${EXPLAINED}%` }}
                  exit={{ opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.8, ease: ARRIVE }}
                />
              ) : on.size > 0 ? (
                <motion.span
                  key="unsure"
                  className="absolute inset-y-0 left-0 border-e-2 border-dashed border-v3-light/70 bg-[repeating-linear-gradient(135deg,var(--v3-accent)_0_2px,transparent_2px_8px)] opacity-60"
                  style={{ width: `${EXPLAINED}%` }}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                />
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex justify-between text-xs tabular-nums text-v3-mute" dir="ltr">
            <span>{pct(0, locale)}</span>
            <span>{pct(100, locale)}</span>
          </div>
          {all ? (
            <div className="flex flex-col gap-1">
              <p className="font-v3-display text-2xl text-v3-light">{t.explained}</p>
              <p className="font-v3-display text-2xl text-v3-bone">{t.rest}</p>
            </div>
          ) : on.size > 0 ? (
            <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{t.partial}</p>
          ) : null}
          <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.hours}</p>
        </div>
      </div>
    </Figure>
  )
}

// ── 4. Did changing the feed change minds? ──────────────────────────────────

export function FeedStudies({ locale }: { locale: Locale }) {
  const t = COPY[locale].studies
  const reduce = useReducedMotion()
  const [answers, setAnswers] = useState<Partial<Record<StudyKey, boolean>>>({})
  const done = STUDIES.filter((s) => answers[s.key] !== undefined)
  const score = done.filter((s) => answers[s.key] === s.changed).length
  const answer = (k: StudyKey, v: boolean) => {
    setAnswers((a) => {
      if (a[k] !== undefined) return a
      const next = { ...a, [k]: v }
      if (STUDIES.every((s) => next[s.key] !== undefined)) medal("studies")
      return next
    })
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 text-sm text-v3-mute">
        <span>{t.ask}</span>
        <span className="tabular-nums" aria-live="polite">
          {t.score(num(score, locale), num(done.length, locale))}
        </span>
      </div>
      <ul className="grid gap-5 md:grid-cols-3">
        {STUDIES.map((s) => {
          const it = t.items[s.key]
          const a = answers[s.key]
          const open = a !== undefined
          return (
            <li key={s.key} className={`flex h-full flex-col gap-4 rounded-3xl border p-5 ${open ? (a === s.changed ? "border-v3-light/60 bg-v3-light/5" : "border-v3-line bg-v3-raise/60") : "border-v3-line bg-v3-raise/60"}`}>
              <p className="text-xs text-v3-mute" dir="auto">
                {it.cite}
              </p>
              <p className="leading-relaxed text-v3-bone rtl:leading-loose">{it.setup}</p>
              <AnimatePresence mode="wait" initial={false}>
                {!open ? (
                  <motion.div key="ask" exit={reduce ? undefined : { opacity: 0, y: -6 }} className="mt-auto flex gap-2">
                    {[
                      { v: true, l: t.yes },
                      { v: false, l: t.no },
                    ].map((o) => (
                      <button
                        key={o.l}
                        type="button"
                        onClick={() => answer(s.key, o.v)}
                        className="rounded-full border border-v3-line px-5 py-1.5 text-sm text-v3-bone hover:border-v3-light"
                      >
                        {o.l}
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="res" initial={reduce ? false : { opacity: 0, rotateX: -70 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ duration: 0.4, ease: ARRIVE }} className="mt-auto flex flex-col gap-1">
                    <p className={`text-sm ${a === s.changed ? "text-v3-light" : "text-v3-mute"}`}>
                      {a === s.changed ? t.right : t.wrong} {s.changed ? t.yes : t.no}.
                    </p>
                    <p className="leading-relaxed text-v3-soft rtl:leading-loose">{it.result}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
      {done.length === STUDIES.length && (
        <button
          type="button"
          onClick={() => setAnswers({})}
          className="inline-flex items-center gap-2 self-start rounded-full border border-v3-line px-4 py-1.5 text-sm text-v3-soft hover:border-v3-light hover:text-v3-bone"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {locale === "fa" ? "دوباره" : "Again"}
        </button>
      )}
    </div>
  )
}
