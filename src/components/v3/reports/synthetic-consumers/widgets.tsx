"use client"

// ============================================================================
// File Path: src/components/v3/reports/synthetic-consumers/widgets.tsx
// Why: The interactive figures of report 10: the SSR playground (the
//      paper's Eq. 8–9 on illustrative similarities), the three-methods
//      comparison by model, the "human ceiling" bars, the persona seesaw and
//      the human-or-synthetic game. Server-rendered default states, reduced
//      motion respected, v3 tokens only (gold marks SSR / the point).
//      Numeric charts stay left-to-right in Persian; bar lists mirror. Each
//      awards its badge the first time a reader uses it.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { BENCHMARK, EXAMPLES, METHODS, MODELS, MODEL_NAME, PERSONA, QUOTES, RESULTS, mean, ssrPmf, type Method, type Model } from "./data"
import { medal } from "./medals"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const FA = "۰۱۲۳۴۵۶۷۸۹"
const dg = (s: string, l: Locale) => (l === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]).replace(/\./g, "٫").replace(/,/g, "٬") : s)
const num = (v: number, l: Locale, dp = 0) => dg(v.toFixed(dp), l)
/** Quotation marks in the reader's convention. */
const q = (text: string, l: Locale) => (l === "fa" ? `«${text}»` : `“${text}”`)
const pct = (v: number, l: Locale, dp = 0) => (l === "fa" ? `${num(v, l, dp)}٪` : `${v.toFixed(dp)}%`)

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? "border-v3-bone bg-v3-bone text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light hover:text-v3-bone"}`}
    >
      {children}
    </button>
  )
}

function Bar({ value, max, gold, label, reduce }: { value: number; max: number; gold?: boolean; label: string; reduce: boolean | null }) {
  return (
    <span className="flex items-center gap-2">
      <motion.span
        animate={{ width: `${Math.max((value / max) * 100, 1)}%` }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
        className={`block h-4 shrink rounded-sm ${gold ? "bg-v3-light" : "bg-v3-mute"}`}
      />
      <span className="shrink-0 text-xs tabular-nums text-v3-soft">{label}</span>
    </span>
  )
}

// ── 1. SSR playground ───────────────────────────────────────────────────────

type ExKey = (typeof EXAMPLES)[number]["key"]

export function SsrPlayground({ locale }: { locale: Locale }) {
  const t = COPY[locale].ssr
  const reduce = useReducedMotion()
  const [ex, setEx] = useState<ExKey>("probably")
  const [sims, setSims] = useState<number[]>([...EXAMPLES[0].sims])
  const [temp, setTemp] = useState(1)
  const [eps, setEps] = useState(0)
  const pmf = ssrPmf(sims, eps, temp)
  const touch = () => medal("ssr")
  const pick = (k: ExKey) => {
    setEx(k)
    setSims([...EXAMPLES.find((e) => e.key === k)!.sims])
    touch()
  }
  const reset = () => {
    setTemp(1)
    setEps(0)
    setSims([...EXAMPLES.find((e) => e.key === ex)!.sims])
  }
  const maxP = Math.max(...pmf, 0.01)

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.title}>
        {EXAMPLES.map((e) => (
          <Pill key={e.key} on={ex === e.key} onClick={() => pick(e.key)}>
            {t.examples[e.key].label}
          </Pill>
        ))}
      </div>
      <figure className="flex flex-col gap-1 border-s-2 border-v3-light/70 ps-4">
        <p className="font-v3-display text-xl leading-snug text-v3-bone md:text-2xl">{q(t.examples[ex].text, locale)}</p>
        <figcaption className="text-xs text-v3-mute">{t.examples[ex].source}</figcaption>
      </figure>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-v3-mute">{t.simLabel}</p>
          {t.anchors.map((a, i) => (
            <label key={a} className="flex flex-col gap-1">
              <span className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-v3-soft">
                  <span className="me-2 font-semibold text-v3-light tabular-nums">{num(i + 1, locale)}</span>
                  {a}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-v3-mute">{num(sims[i], locale, 2)}</span>
              </span>
              <input
                type="range"
                dir="ltr"
                min={0.6}
                max={0.95}
                step={0.01}
                value={sims[i]}
                aria-label={a}
                onChange={(e) => {
                  const next = [...sims]
                  next[i] = Number(e.target.value)
                  setSims(next)
                  touch()
                }}
                className="w-full accent-(--v3-accent)"
              />
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-v3-mute">{t.pmfLabel}</p>
          <div className="flex h-44 items-end gap-3" dir="ltr" role="img" aria-label={pmf.map((p, i) => `${i + 1}: ${(p * 100).toFixed(0)}%`).join(", ")}>
            {pmf.map((p, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs tabular-nums text-v3-soft">{pct(p * 100, locale)}</span>
                <motion.span
                  animate={{ height: `${(p / maxP) * 80}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, ease: ARRIVE }}
                  className="block w-full min-h-0.5 rounded-t-md bg-v3-light"
                />
                <span className="text-sm font-semibold tabular-nums text-v3-bone">{num(i + 1, locale)}</span>
              </div>
            ))}
          </div>
          <p className="font-v3-display text-2xl text-v3-light" aria-live="polite">
            {t.meanLabel(num(mean(pmf), locale, 2))}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-v3-soft">
              <span className="flex justify-between">
                {t.tempLabel} <span className="tabular-nums text-v3-mute">{num(temp, locale, 1)}</span>
              </span>
              <input type="range" dir="ltr" min={0.3} max={3} step={0.1} value={temp} onChange={(e) => (setTemp(Number(e.target.value)), touch())} className="w-full accent-(--v3-accent)" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-v3-soft">
              <span className="flex justify-between">
                {t.epsLabel} <span className="tabular-nums text-v3-mute">{num(eps, locale, 2)}</span>
              </span>
              <input type="range" dir="ltr" min={0} max={0.1} step={0.01} value={eps} onChange={(e) => (setEps(Number(e.target.value)), touch())} className="w-full accent-(--v3-accent)" />
            </label>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 self-start rounded-full border border-v3-line px-4 py-1.5 text-sm text-v3-soft hover:border-v3-light hover:text-v3-bone">
            <RotateCcw className="h-3.5 w-3.5" />
            {t.reset}
          </button>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.note}</p>
    </div>
  )
}

// ── 2. Three methods, two models ────────────────────────────────────────────

export function MethodsChart({ locale }: { locale: Locale }) {
  const t = COPY[locale].methods
  const reduce = useReducedMotion()
  const [model, setModel] = useState<Model>("gpt4o")
  const r = RESULTS[model]
  return (
    <figure className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.title}>
        {MODELS.map((m) => (
          <Pill key={m} on={model === m} onClick={() => (setModel(m), medal("methods"))}>
            <span dir="ltr">{MODEL_NAME[m]}</span>
          </Pill>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {METHODS.map((k: Method) => (
          <div key={k} className={`flex flex-col gap-4 rounded-2xl border p-4 ${k === "ssr" ? "border-v3-light/60 bg-v3-light/5" : "border-v3-line/80"}`}>
            <div className="flex flex-col gap-1">
              <h3 className={`font-v3-display text-xl ${k === "ssr" ? "text-v3-light" : "text-v3-bone"}`}>{t.names[k].t}</h3>
              <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{t.names[k].b}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-v3-mute">{t.rho}</span>
              <Bar value={r[k].rho} max={100} gold={k === "ssr"} label={pct(r[k].rho, locale, 1)} reduce={reduce} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-v3-mute">{t.k}</span>
              <Bar value={r[k].k} max={1} gold={k === "ssr"} label={num(r[k].k, locale, 2)} reduce={reduce} />
            </div>
          </div>
        ))}
      </div>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</figcaption>
    </figure>
  )
}

// ── 3. The human ceiling ────────────────────────────────────────────────────

export function CeilingBars({ locale }: { locale: Locale }) {
  const t = COPY[locale].ceiling
  const reduce = useReducedMotion()
  const [sel, setSel] = useState<string>("ssr")
  const rows = [
    { key: "human", v: 100, tone: "bone" },
    { key: "ssr", v: BENCHMARK[2].rho, tone: "gold" },
    { key: "flr", v: BENCHMARK[1].rho, tone: "mute" },
    { key: "lightgbm", v: BENCHMARK[0].rho, tone: "mute" },
    { key: "noDem", v: PERSONA.withoutDemographics.rho, tone: "mute" },
  ] as const
  return (
    <figure className="flex flex-col gap-4 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8">
      <ul className="flex flex-col gap-2">
        {rows.map((r) => (
          <li key={r.key}>
            <button
              type="button"
              onClick={() => (setSel(r.key), medal("ceiling"))}
              aria-pressed={sel === r.key}
              className={`grid w-full grid-cols-[8rem_1fr] items-center gap-3 rounded-lg px-1 py-1.5 text-start text-sm transition-colors md:grid-cols-[16rem_1fr] ${sel === r.key ? "bg-v3-light/10" : "hover:bg-v3-line/30"}`}
            >
              <span className={`leading-snug ${r.tone === "gold" ? "font-semibold text-v3-light" : "text-v3-soft"}`}>{t.bars[r.key]}</span>
              <span className="flex items-center gap-2">
                <motion.span
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: `${r.v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: ARRIVE }}
                  style={reduce ? { width: `${r.v}%` } : undefined}
                  className={`block h-5 shrink rounded-sm ${r.tone === "gold" ? "bg-v3-light" : r.tone === "bone" ? "border border-dashed border-v3-bone/70 bg-transparent" : "bg-v3-mute"}`}
                />
                <span className="shrink-0 text-xs tabular-nums text-v3-soft">{pct(r.v, locale, r.key === "human" ? 0 : 1)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</figcaption>
    </figure>
  )
}

// ── 4. The persona seesaw ───────────────────────────────────────────────────

export function PersonaSeesaw({ locale }: { locale: Locale }) {
  const t = COPY[locale].persona
  const reduce = useReducedMotion()
  const [withD, setWithD] = useState(true)
  const v = withD ? PERSONA.withDemographics : PERSONA.withoutDemographics
  const flip = (x: boolean) => {
    setWithD(x)
    medal("persona")
  }
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8">
      <div role="radiogroup" aria-label={t.title} className="inline-flex self-start rounded-full border border-v3-line p-1">
        {[true, false].map((x) => (
          <button
            key={String(x)}
            type="button"
            role="radio"
            aria-checked={withD === x}
            onClick={() => flip(x)}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${withD === x ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"}`}
          >
            {withD === x && <motion.span layoutId="persona-pill" className="absolute inset-0 rounded-full bg-v3-light" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{x ? t.withD : t.withoutD}</span>
          </button>
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-4" aria-live="polite">
        {[
          { k: t.rho, val: v.rho, max: 100, fmt: pct(v.rho, locale, 1), hot: !withD },
          { k: t.k, val: v.k, max: 1, fmt: num(v.k, locale, 2), hot: false },
        ].map((s) => (
          <div key={s.k} className={`flex flex-col gap-3 rounded-2xl border p-4 ${s.hot ? "border-v3-light/60 bg-v3-light/10" : "border-v3-line/80"}`}>
            <dt className="text-xs text-v3-mute">{s.k}</dt>
            <dd className={`font-v3-display text-4xl leading-none tabular-nums ${s.hot ? "text-v3-light" : "text-v3-bone"}`}>{s.fmt}</dd>
            <div className="h-2 overflow-hidden rounded-full bg-v3-line">
              <motion.span animate={{ width: `${(s.val / s.max) * 100}%` }} transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }} className="block h-full rounded-full bg-v3-light" />
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}

// ── 5. Human or synthetic? ──────────────────────────────────────────────────

export function HumanOrAi({ locale }: { locale: Locale }) {
  const t = COPY[locale].game
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [pick, setPick] = useState<boolean | null>(null)
  const done = i >= QUOTES.length
  const quote = QUOTES[Math.min(i, QUOTES.length - 1)]

  const choose = (synthetic: boolean) => {
    if (pick !== null) return
    setPick(synthetic)
    if (synthetic === quote.synthetic) setScore((s) => s + 1)
  }
  const next = () => {
    const n = i + 1
    setI((cur) => (cur === i ? n : cur))
    setPick(null)
    if (n >= QUOTES.length) medal("game")
  }
  const restart = () => {
    setI(0)
    setScore(0)
    setPick(null)
  }
  const ok = pick !== null && pick === quote.synthetic

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-v3-bone/80 bg-v3-raise">
      <div className="flex items-center justify-between gap-3 bg-v3-bone px-5 py-3 text-sm font-semibold text-v3-ink">
        <span>{done ? t.done(num(score, locale), num(QUOTES.length, locale)) : t.progress(num(i + 1, locale), num(QUOTES.length, locale))}</span>
        <span className="tabular-nums">{t.done(num(score, locale), num(QUOTES.length, locale))}</span>
      </div>
      <div className="flex min-h-72 flex-col gap-5 p-5 md:p-8" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div key="end" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              <span className="font-v3-display text-5xl text-v3-light tabular-nums">{t.done(num(score, locale), num(QUOTES.length, locale))}</span>
              <p className="max-w-2xl leading-relaxed text-v3-soft rtl:leading-loose">{t.lesson}</p>
              <button type="button" onClick={restart} className="inline-flex items-center gap-2 self-start rounded-full bg-v3-bone px-5 py-2.5 text-sm font-semibold text-v3-ink">
                <RotateCcw className="h-4 w-4" />
                {t.again}
              </button>
            </motion.div>
          ) : (
            <motion.div key={i} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: ARRIVE }} className="flex flex-col gap-5">
              <p className="font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl">{q(t.quotes[quote.key], locale)}</p>
              {t.translated && <p className="-mt-3 text-xs text-v3-mute">{t.translated}</p>}
              <div className="flex flex-wrap gap-3">
                {[false, true].map((syn) => {
                  const isAns = syn === quote.synthetic
                  return (
                    <button
                      key={String(syn)}
                      type="button"
                      disabled={pick !== null}
                      onClick={() => choose(syn)}
                      className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
                        pick !== null ? (isAns ? "border-v3-light bg-v3-light/15 text-v3-bone" : "border-v3-line text-v3-mute") : "border-v3-line text-v3-bone hover:border-v3-bone"
                      }`}
                    >
                      {syn ? t.ai : t.human}
                    </button>
                  )
                })}
              </div>
              {pick !== null && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <p className="text-sm text-v3-soft">
                    <span className={ok ? "font-semibold text-v3-light" : "font-semibold text-v3-bone"}>{ok ? t.right : t.wrong}</span>
                    {" · "}
                    {quote.synthetic ? t.wasAi : t.wasHuman}
                  </p>
                  <button type="button" onClick={next} className="self-start rounded-full bg-v3-bone px-5 py-2.5 text-sm font-semibold text-v3-ink">
                    {t.next}
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
