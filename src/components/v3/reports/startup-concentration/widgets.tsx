"use client"

// ============================================================================
// File Path: src/components/v3/reports/startup-concentration/widgets.tsx
// Why: The interactive figures of report 07: the fact-check game, the
//      stage split, the dollar trail, the score bars with the absolute-gain
//      comparison and the catch-up calculator, the unicorn grid, the five
//      reads and the founder's round picker. The page is a server component
//      so every sentence is in the HTML; these render a complete default
//      state on the server, respect reduced motion and use v3 tokens. Each
//      awards its badge the first time a reader uses it. Bars grow from the
//      inline start, so they read right-to-left in Persian.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check, CircleHelp, RotateCcw, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { useMemo, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import {
  AI_NA,
  AI_SHARE,
  BLENDED,
  CLAIMS,
  COUNTRIES,
  FUNDING,
  NEXT_NINE_GAIN,
  READS,
  ROUND_REGIONS,
  ROUND_STAGES,
  UNICORNS,
  UNICORNS_NEXT_NINE,
  US_GAIN,
  VERDICTS,
  gain,
  prior,
  type ClaimKey,
  type ReadKey,
  type RoundRegion,
  type RoundStage,
  type Verdict,
} from "./data"
import { medal } from "./medals"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const FA = "۰۱۲۳۴۵۶۷۸۹"
export const dg = (s: string, l: Locale) => (l === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]).replace(/\./g, "٫").replace(/,/g, "٬") : s)
const pct = (v: number, l: Locale, dp = 0) => (l === "fa" ? `${dg((v * 100).toFixed(dp), l)}٪` : `${(v * 100).toFixed(dp)}%`)
const usd = (b: number, l: Locale) => (l === "fa" ? `${dg(b.toFixed(b < 100 ? 1 : 0), l)} میلیارد دلار` : `US$${b.toFixed(b < 100 ? 1 : 0)}B`)

const COUNTRY_NAMES: Record<string, Record<Locale, string>> = {
  US: { en: "United States", fa: "آمریکا" },
  GB: { en: "United Kingdom", fa: "بریتانیا" },
  IL: { en: "Israel", fa: "اسرائیل" },
  SG: { en: "Singapore", fa: "سنگاپور" },
  CA: { en: "Canada", fa: "کانادا" },
  SE: { en: "Sweden", fa: "سوئد" },
  DE: { en: "Germany", fa: "آلمان" },
  CH: { en: "Switzerland", fa: "سوئیس" },
  AU: { en: "Australia", fa: "استرالیا" },
  NL: { en: "Netherlands", fa: "هلند" },
}

// ── 1. The fact-check game ──────────────────────────────────────────────────

const VERDICT_TONE: Record<Verdict, string> = {
  true: "bg-v3-light text-v3-ink",
  half: "border border-v3-light text-v3-light",
  false: "bg-v3-mute/30 text-v3-bone",
}

export function FactCheckGame({ locale }: { locale: Locale }) {
  const t = COPY[locale].check
  const reduce = useReducedMotion()
  const [calls, setCalls] = useState<Partial<Record<ClaimKey, Verdict>>>({})
  const answered = CLAIMS.filter((k) => calls[k]).length
  const correct = CLAIMS.filter((k) => calls[k] === VERDICTS[k]).length

  const call = (k: ClaimKey, v: Verdict) => {
    if (calls[k]) return
    const next = { ...calls, [k]: v }
    setCalls(next)
    if (CLAIMS.every((c) => next[c])) medal("factcheck")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-20 z-10 flex items-center justify-between gap-4 rounded-full border border-v3-line bg-v3-ink/90 px-5 py-2.5 text-sm backdrop-blur">
        <span className="text-v3-soft">{t.score(dg(String(correct), locale), dg(String(answered), locale))}</span>
        <span className="flex gap-1" aria-hidden>
          {CLAIMS.map((k) => (
            <span key={k} className={`h-2 w-5 rounded-full ${!calls[k] ? "bg-v3-line" : calls[k] === VERDICTS[k] ? "bg-v3-light" : "bg-v3-mute/60"}`} />
          ))}
        </span>
      </div>
      <ol className="grid gap-4 md:grid-cols-2">
        {CLAIMS.map((k, i) => {
          const it = t.items[k]
          const mine = calls[k]
          const ok = mine === VERDICTS[k]
          return (
            <li key={k} className={`flex flex-col gap-4 rounded-3xl border p-5 transition-colors ${mine ? (ok ? "border-v3-light/60 bg-v3-light/5" : "border-v3-line bg-v3-raise") : "border-v3-line bg-v3-raise"}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-v3-mute">
                  {dg(String(i + 1), locale)} · {t.claimLabel}
                </span>
                <span className={`shrink-0 text-xs text-v3-mute ${locale === "fa" ? "font-(family-name:--font-instrument)!" : ""}`} dir="ltr">
                  {it.source}
                </span>
              </div>
              <p className="font-v3-display text-xl leading-snug text-v3-bone">{it.claim}</p>
              {!mine ? (
                <div className="flex flex-wrap gap-2" role="group" aria-label={t.yourCall}>
                  {(["true", "half", "false"] as Verdict[]).map((v) => (
                    <motion.button
                      key={v}
                      type="button"
                      onClick={() => call(k, v)}
                      whileTap={reduce ? undefined : { scale: 0.95 }}
                      className="rounded-full border border-v3-line px-4 py-1.5 text-sm text-v3-soft transition-colors hover:border-v3-light hover:text-v3-bone"
                    >
                      {t.calls[v]}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: ARRIVE }} className="flex flex-col gap-2" role="status">
                  <span className="flex flex-wrap items-center gap-2 text-sm">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${VERDICT_TONE[VERDICTS[k]]}`}>
                      {VERDICTS[k] === "true" ? <Check className="h-3 w-3" /> : VERDICTS[k] === "false" ? <X className="h-3 w-3" /> : <CircleHelp className="h-3 w-3" />}
                      {t.calls[VERDICTS[k]]}
                    </span>
                    <span className={ok ? "text-v3-light" : "text-v3-mute"}>{ok ? t.right : t.wrong}</span>
                  </span>
                  <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{it.truth}</p>
                </motion.div>
              )}
            </li>
          )
        })}
      </ol>
      {answered === CLAIMS.length && (
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl rounded-2xl border border-v3-light/50 bg-v3-light/10 p-5 leading-relaxed text-v3-bone rtl:leading-loose">
          {t.lesson}
        </motion.p>
      )}
    </div>
  )
}

// ── 2. The stage split ──────────────────────────────────────────────────────

export function StageSplit({ locale }: { locale: Locale }) {
  const t = COPY[locale].stage
  const reduce = useReducedMotion()
  const [split, setSplit] = useState(true)
  const flip = (v: boolean) => {
    setSplit(v)
    medal("stage")
  }
  const max = 260
  const rows = split
    ? [
        { label: t.late, now: FUNDING.late.now, before: prior(FUNDING.late.now, FUNDING.late.growth), g: FUNDING.late.growth, hot: true },
        { label: t.seriesA, now: FUNDING.seriesA.now, before: prior(FUNDING.seriesA.now, FUNDING.seriesA.growth), g: FUNDING.seriesA.growth, hot: false },
      ]
    : [
        {
          label: t.blendedLabel,
          now: FUNDING.late.now + FUNDING.seriesA.now,
          before: prior(FUNDING.late.now, FUNDING.late.growth) + prior(FUNDING.seriesA.now, FUNDING.seriesA.growth),
          g: BLENDED,
          hot: true,
        },
      ]

  return (
    <div className="flex flex-col gap-8">
      <div role="radiogroup" aria-label={t.title} className="inline-flex self-start rounded-full border border-v3-line p-1">
        {[false, true].map((v) => (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={split === v}
            onClick={() => flip(v)}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${split === v ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"}`}
          >
            {split === v && <motion.span layoutId="stage-pill" className="absolute inset-0 rounded-full bg-v3-light" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{v ? t.split : t.blended}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {rows.map((r) => (
            <motion.div
              key={r.label}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-2 md:grid-cols-[12rem_1fr] md:items-center md:gap-6"
            >
              <span className="text-v3-bone">{r.label}</span>
              <div className="flex flex-col gap-1.5">
                <div className="relative h-10 rounded-lg bg-v3-line/30">
                  <span className="absolute inset-y-0 start-0 rounded-lg border-2 border-dashed border-v3-mute/50" style={{ width: `${(r.before / max) * 100}%` }} aria-hidden />
                  <motion.span
                    className={`absolute inset-y-1.5 start-0 rounded-md ${r.hot ? "bg-v3-light" : "bg-v3-bone/70"}`}
                    initial={reduce ? false : { width: 0 }}
                    whileInView={{ width: `${(r.now / max) * 100}%` }}
                    viewport={{ once: true }}
                    animate={{ width: `${(r.now / max) * 100}%` }}
                    transition={{ duration: 0.9, ease: ARRIVE }}
                  />
                </div>
                <span className="flex flex-wrap gap-x-4 text-sm">
                  <b className="font-v3-display text-2xl font-normal text-v3-bone">{usd(r.now, locale)}</b>
                  <span className={`self-end ${r.hot ? "text-v3-light" : "text-v3-mute"}`}>
                    {r.g >= 0 ? "+" : ""}
                    {pct(r.g, locale)} {t.yoy}
                  </span>
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-xs text-v3-mute">{t.prevLegend}</p>
      {!split && <p className="max-w-2xl text-sm text-v3-mute">{t.blendedNote}</p>}
    </div>
  )
}

// ── 3. Follow the dollar ────────────────────────────────────────────────────

export function DollarTrail({ locale }: { locale: Locale }) {
  const t = COPY[locale].dollar
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const widths = [1, AI_SHARE, AI_NA / FUNDING.late.now, (FUNDING.aiLate - AI_NA) / FUNDING.late.now]
  const next = () => {
    if (step >= widths.length - 1) {
      setStep(0)
      return
    }
    const n = step + 1
    setStep(n)
    if (n === widths.length - 1) medal("dollar")
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col gap-3">
        {t.steps.map((s, i) => {
          const on = i <= step
          return (
            <li key={s.label} className={`grid gap-2 transition-opacity md:grid-cols-[16rem_1fr] md:items-center md:gap-6 ${on ? "opacity-100" : "opacity-30"}`}>
              <span className="flex flex-col">
                <span className={i === step ? "text-v3-light" : "text-v3-bone"}>{s.label}</span>
                <span className="text-xs text-v3-mute">{s.note}</span>
              </span>
              <div className="h-9 rounded-lg bg-v3-line/25">
                <motion.div
                  className={`h-full rounded-lg ${i === 3 ? "bg-v3-mute/70" : i === step ? "bg-v3-light shadow-[0_0_24px_-4px_rgb(var(--v3-glow)/0.8)]" : "bg-v3-light/50"}`}
                  initial={false}
                  animate={{ width: on ? `${Math.max(widths[i] * 100, 1.5)}%` : "0%" }}
                  transition={{ duration: reduce ? 0 : 0.7, ease: ARRIVE }}
                />
              </div>
            </li>
          )
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={next} className="flex items-center gap-2 rounded-full bg-v3-light px-5 py-2.5 text-sm font-semibold text-v3-ink">
          {step >= widths.length - 1 ? (
            <>
              <RotateCcw className="h-4 w-4" aria-hidden /> {t.again}
            </>
          ) : (
            t.next
          )}
        </button>
        <span className="text-xs text-v3-mute">{t.derived}</span>
      </div>
    </div>
  )
}

// ── 4. Scores, gains and the catch-up calculator ────────────────────────────

export function ScoreBars({ locale }: { locale: Locale }) {
  const t = COPY[locale].base
  const reduce = useReducedMotion()
  const max = 320
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="text-sm text-v3-mute">{t.scoreAxis}</figcaption>
      <ol className="flex flex-col gap-1.5">
        {COUNTRIES.map((c, i) => (
          <li key={c.iso} className="grid grid-cols-[7.5rem_1fr_5.5rem] items-center gap-3 text-sm md:grid-cols-[9rem_1fr_7rem]">
            <span className={i === 0 ? "text-v3-bone" : "text-v3-soft"}>{COUNTRY_NAMES[c.iso][locale]}</span>
            <span className="h-4 rounded-full bg-v3-line/30">
              <motion.span
                className={`block h-full rounded-full ${i === 0 ? "bg-v3-light" : "bg-v3-bone/60"}`}
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: `${(c.score / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: ARRIVE }}
              />
            </span>
            <span className="flex flex-col items-end leading-tight tabular-nums">
              <span className="text-v3-soft">{dg(c.score.toFixed(0), locale)}</span>
              <span className={`text-[11px] ${c.growth >= 0.2 ? "text-v3-light" : "text-v3-mute"}`} dir="ltr">
                +{pct(c.growth, locale, 1)}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export function Gains({ locale }: { locale: Locale }) {
  const t = COPY[locale].base
  const reduce = useReducedMotion()
  const rows = COUNTRIES.map((c) => ({ ...c, gain: gain(c.score, c.growth), before: prior(c.score, c.growth) })).sort((a, b) => b.gain - a.gain)
  return (
    <figure className="flex flex-col gap-4 rounded-3xl border border-v3-line bg-v3-raise p-6">
      <figcaption className="flex flex-col gap-1">
        <span className="font-v3-display text-2xl text-v3-bone">{t.gainsTitle}</span>
        <span className="text-xs text-v3-mute">{t.gainsSub}</span>
      </figcaption>
      <ol className="flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <li key={r.iso} className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-2 text-sm">
            <span className={i === 0 ? "text-v3-bone" : "text-v3-soft"}>
              {COUNTRY_NAMES[r.iso][locale]}
            </span>
            <span className="h-4 rounded-full bg-v3-line/30">
              <motion.span
                className={`block h-full rounded-full ${i === 0 ? "bg-v3-light" : r.iso === "SG" ? "bg-v3-bone/80" : "bg-v3-mute/60"}`}
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: `${Math.max((r.gain / 62) * 100, 2)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: ARRIVE }}
              />
            </span>
            <span className="text-end tabular-nums text-v3-bone" dir="ltr">
              +{dg(r.gain.toFixed(1), locale)}
            </span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-2 gap-3 border-t border-v3-line/70 pt-4">
        <div className="flex flex-col">
          <span className="text-xs text-v3-mute">{COUNTRY_NAMES.US[locale]}</span>
          <span className="self-start font-v3-display text-3xl tabular-nums text-v3-light" dir="ltr">
            +{dg(US_GAIN.toFixed(0), locale)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-v3-mute">{COPY[locale].unicorns.nextNine}</span>
          <span className="self-start font-v3-display text-3xl tabular-nums text-v3-bone" dir="ltr">
            +{dg(NEXT_NINE_GAIN.toFixed(0), locale)}
          </span>
        </div>
      </div>
      <p className="text-sm text-v3-bone">{t.gainsVerdict}</p>
    </figure>
  )
}

export function CatchUp({ locale }: { locale: Locale }) {
  const t = COPY[locale].base.calc
  const reduce = useReducedMotion()
  const us = COUNTRIES[0]
  const sg = COUNTRIES.find((c) => c.iso === "SG")!
  const [gs, setGs] = useState(24.4)
  const [gu, setGu] = useState(23.6)
  const touch = () => medal("catchup")

  const res = useMemo(() => {
    // Solve sg*(1+gs)^t = us*(1+gu)^t; also trace both paths for the chart.
    const a = 1 + gs / 100
    const b = 1 + gu / 100
    const years = a > b ? Math.log(us.score / sg.score) / Math.log(a / b) : Infinity
    const horizon = 25
    const pts = Array.from({ length: horizon + 1 }, (_, y) => ({ y, s: sg.score * a ** y, u: us.score * b ** y }))
    return { years, pts }
  }, [gs, gu, us.score, sg.score])

  const W = 600
  const H = 220
  const top = Math.max(...res.pts.map((p) => Math.max(p.s, p.u)))
  const x = (y: number) => 30 + (y / 25) * (W - 50)
  const yv = (v: number) => H - 24 - (Math.log(v) / Math.log(top)) * (H - 40)
  const line = (key: "s" | "u") => res.pts.map((p, i) => `${i ? "L" : "M"}${x(p.y).toFixed(1)},${yv(p[key]).toFixed(1)}`).join(" ")
  const fmtG = (v: number) => (locale === "fa" ? `${dg(v.toFixed(1), locale)}٪` : `${v.toFixed(1)}%`)

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-v3-light/40 bg-v3-raise p-6 shadow-[0_0_80px_-40px_rgb(var(--v3-glow)/0.8)] md:p-8">
      <div className="flex flex-col gap-1">
        <h3 className="font-v3-display text-3xl text-v3-bone">{t.title}</h3>
        <p className="text-v3-soft">{t.lead}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between text-sm text-v3-soft">
            {t.sgGrowth}
            <b className="font-v3-display text-3xl font-normal tabular-nums text-v3-light">{fmtG(gs)}</b>
          </span>
          <input type="range" min={0} max={80} step={0.5} value={gs} dir="ltr" onChange={(e) => { setGs(Number(e.target.value)); touch() }} className="accent-(--v3-accent)" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between text-sm text-v3-soft">
            {t.usGrowth}
            <b className="font-v3-display text-3xl font-normal tabular-nums text-v3-bone">{fmtG(gu)}</b>
          </span>
          <input type="range" min={0} max={40} step={0.5} value={gu} dir="ltr" onChange={(e) => { setGu(Number(e.target.value)); touch() }} className="accent-(--v3-accent)" />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" direction="ltr" aria-hidden>
        <line x1={30} x2={W - 20} y1={H - 24} y2={H - 24} className="stroke-v3-line" />
        {[0, 5, 10, 15, 20, 25].map((y) => (
          <text key={y} x={x(y)} y={H - 6} textAnchor="middle" className="fill-v3-mute text-[11px]">
            {dg(String(2026 + y), locale)}
          </text>
        ))}
        <motion.path d={line("u")} animate={{ d: line("u") }} transition={{ duration: reduce ? 0 : 0.3 }} className="fill-none stroke-v3-bone" strokeWidth={2.5} />
        <motion.path d={line("s")} animate={{ d: line("s") }} transition={{ duration: reduce ? 0 : 0.3 }} className="fill-none stroke-v3-light" strokeWidth={3} />
        {Number.isFinite(res.years) && res.years <= 25 && (
          <circle cx={x(res.years)} cy={yv(sg.score * (1 + gs / 100) ** res.years)} r={7} className="fill-v3-light drop-shadow-[0_0_10px_rgb(var(--v3-glow)/1)]" />
        )}
        <text x={x(25) - 4} y={yv(res.pts[25].u) - 8} textAnchor="end" className="fill-v3-bone text-[12px]">
          {COUNTRY_NAMES.US[locale]}
        </text>
        <text x={x(25) - 4} y={yv(res.pts[25].s) + 16} textAnchor="end" className="fill-v3-light text-[12px]">
          {COUNTRY_NAMES.SG[locale]}
        </text>
      </svg>
      <p className="font-v3-display text-2xl text-v3-bone" aria-live="polite">
        {Number.isFinite(res.years) ? t.years(dg(Math.ceil(res.years).toString(), locale), dg(String(2026 + Math.ceil(res.years)), locale)) : t.never}
      </p>
      <p className="text-xs text-v3-mute">{t.note}</p>
    </div>
  )
}

// ── 5. The unicorn grid ─────────────────────────────────────────────────────

const UNI_TONE = ["bg-v3-light", "bg-v3-bone/80", "bg-v3-bone/65", "bg-v3-bone/50", "bg-v3-soft/50", "bg-v3-soft/40", "bg-v3-mute/60", "bg-v3-mute/45", "bg-v3-mute/35", "bg-v3-line"]

function Cells({ count, tone }: { count: number; tone: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`aspect-square rounded-[1px] ${tone}`} />
      ))}
    </>
  )
}

export function UnicornGrid({ locale }: { locale: Locale }) {
  const t = COPY[locale].unicorns
  const [mode, setMode] = useState<"country" | "rest">("rest")
  const set = (m: "country" | "rest") => {
    setMode(m)
    medal("unicorns")
  }
  const n = (v: number) => dg(v.toLocaleString("en-US"), locale)
  const us = UNICORNS[0]
  const rest = UNICORNS.slice(1)

  return (
    <div className="flex flex-col gap-6">
      <div role="radiogroup" aria-label={t.title} className="inline-flex self-start rounded-full border border-v3-line p-1">
        {(["rest", "country"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => set(m)}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${mode === m ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"}`}
          >
            {mode === m && <motion.span layoutId="unicorn-pill" className="absolute inset-0 rounded-full bg-v3-light" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{m === "rest" ? t.usVsRest : t.byCountry}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {mode === "rest" ? (
          <motion.div key="rest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8 md:grid-cols-2">
            {[
              { label: t.names.US, total: us.n, parts: [{ n: us.n, tone: UNI_TONE[0] }] },
              { label: t.nextNine, total: UNICORNS_NEXT_NINE, parts: rest.map((r, i) => ({ n: r.n, tone: UNI_TONE[i + 1] })) },
            ].map((g) => (
              <div key={g.label} className="flex flex-col gap-3">
                <span className="flex items-baseline justify-between">
                  <span className="text-v3-soft">{g.label}</span>
                  <b className="font-v3-display text-4xl font-normal tabular-nums text-v3-bone">{n(g.total)}</b>
                </span>
                <div className="grid grid-cols-[repeat(25,minmax(0,1fr))] content-start gap-[2px]" role="img" aria-label={`${g.label} ${n(g.total)}`}>
                  {g.parts.map((p, k) => (
                    <Cells key={k} count={p.n} tone={p.tone} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.ol key="country" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            {UNICORNS.map((u, i) => (
              <li key={u.iso} className="grid grid-cols-[7rem_1fr_3rem] items-start gap-3 text-sm md:grid-cols-[9rem_1fr_3.5rem]">
                <span className={i === 0 ? "text-v3-bone" : "text-v3-soft"}>{t.names[u.iso]}</span>
                <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-[2px] md:grid-cols-[repeat(62,minmax(0,1fr))]" aria-hidden>
                  <Cells count={u.n} tone={UNI_TONE[i]} />
                </div>
                <span className="text-end tabular-nums text-v3-bone">{n(u.n)}</span>
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
      <p className="font-v3-display text-2xl text-v3-bone">{t.verdict(n(us.n), n(UNICORNS_NEXT_NINE))}</p>
    </div>
  )
}

// ── 6. The five reads ───────────────────────────────────────────────────────

export function Reads({ locale }: { locale: Locale }) {
  const t = COPY[locale].reads
  const reduce = useReducedMotion()
  const [sides, setSides] = useState<Partial<Record<ReadKey, boolean>>>({})
  const pick = (k: ReadKey, v: boolean) => {
    const next = { ...sides, [k]: v }
    setSides(next)
    if (READS.every((r) => next[r] !== undefined)) medal("bets")
  }
  const agreed = READS.filter((r) => sides[r]).length
  const done = READS.every((r) => sides[r] !== undefined)

  return (
    <div className="flex flex-col gap-4">
      {READS.map((k, i) => {
        const it = t.items[k]
        const side = sides[k]
        return (
          <div key={k} className="grid gap-4 rounded-3xl border border-v3-line bg-v3-raise p-5 md:grid-cols-[1fr_auto] md:items-start md:p-6">
            <div className="flex flex-col gap-3">
              <span className="text-xs text-v3-mute">{dg(String(i + 1), locale)}</span>
              <h3 className="font-v3-display text-2xl text-v3-bone">{it.read}</h3>
              <AnimatePresence>
                {side !== undefined && (
                  <motion.div initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid gap-3 overflow-hidden sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-v3-mute">{t.reasoning}</span>
                      <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{it.reasoning}</p>
                    </div>
                    <div className="flex flex-col gap-1 rounded-2xl border border-v3-light/40 p-3">
                      <span className="text-xs text-v3-light">{t.falsify}</span>
                      <p className="text-sm leading-relaxed text-v3-bone rtl:leading-loose">{it.falsify}</p>
                    </div>
                    {it.watch && (
                      <div className="flex flex-col gap-1 rounded-2xl bg-v3-light/10 p-3 sm:col-span-2">
                        <span className="text-xs font-semibold text-v3-light">{t.watch}</span>
                        <p className="text-sm leading-relaxed text-v3-bone rtl:leading-loose">{it.watch}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-2 md:flex-col">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={side === v}
                  onClick={() => pick(k, v)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${side === v ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light"}`}
                >
                  {v ? <ThumbsUp className="h-4 w-4" aria-hidden /> : <ThumbsDown className="h-4 w-4" aria-hidden />}
                  {v ? t.agree : t.disagree}
                </button>
              ))}
            </div>
          </div>
        )
      })}
      {done && <p className="text-v3-light">{t.tally(dg(String(agreed), locale), dg(String(READS.length), locale))}</p>}
    </div>
  )
}

// ── 7. The founder's round picker ───────────────────────────────────────────

export function RoundPicker({ locale }: { locale: Locale }) {
  const t = COPY[locale].round
  const reduce = useReducedMotion()
  const [stage, setStage] = useState<RoundStage>("seriesA")
  const [region, setRegion] = useState<RoundRegion>("elsewhere")
  const Group = <T extends string>({ label, opts, value, set, names }: { label: string; opts: readonly T[]; value: T; set: (v: T) => void; names: Record<T, string> }) => (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm text-v3-mute">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => set(o)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${value === o ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light"}`}
          >
            {names[o]}
          </button>
        ))}
      </div>
    </fieldset>
  )
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-5">
        {Group({ label: t.stage, opts: ROUND_STAGES, value: stage, set: setStage, names: t.stages })}
        {Group({ label: t.region, opts: ROUND_REGIONS, value: region, set: setRegion, names: t.regions })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${stage}-${region}`}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-3xl border border-v3-light/50 bg-v3-light/10 p-6 font-v3-display text-2xl leading-snug text-v3-bone lg:col-span-7 rtl:leading-relaxed"
          aria-live="polite"
        >
          {t.answers[stage][region]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
