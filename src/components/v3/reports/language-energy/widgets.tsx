"use client"

// ============================================================================
// File Path: src/components/v3/reports/language-energy/widgets.tsx
// Why: The interactive figures of report 09: the language picker (one
//      answer's energy bill in any of 122 languages), the two-penalty area
//      chart, the 122-language strip and accuracy scatter, the Arabic-script
//      comparison, the models/tasks switch and the which-costs-more game.
//      The page is a server component so every sentence is in the HTML;
//      these render a complete default state on the server, respect reduced
//      motion and use v3 tokens (gold marks the point: low-resource languages
//      and the language you picked). Charts with a numeric axis stay
//      left-to-right in Persian; bar lists mirror. Each awards its badge the
//      first time a reader uses it.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useMemo, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import {
  ARABIC_SCRIPT,
  ENGLISH,
  LANGS,
  MODELS,
  PAIRS,
  PERSIAN,
  SUBSET,
  TABLE1,
  TABLE3,
  TABLE4,
  TAJIK,
  TASKS,
  costlier,
  lang,
  penalties,
  scriptName,
  vsEnglish,
  wh,
  type Lang,
  type ModelKey,
  type TaskKey,
} from "./data"
import { medal } from "./medals"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const FA = "۰۱۲۳۴۵۶۷۸۹"
const dg = (s: string, l: Locale) => (l === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]).replace(/\./g, "٫").replace(/,/g, "٬") : s)
/** A number with thousands separators and fixed decimals, in the reader's digits. */
const num = (v: number, l: Locale, dp = 0) => dg(v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp }), l)
const name = (x: Lang, l: Locale) => (l === "fa" ? x.fa : x.en)
const times = (v: number, l: Locale) => (v >= 10 ? num(v, l) : num(v, l, 1))
const J = (l: Locale) => (l === "fa" ? " ژول" : " J")

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

// ── 1. The language picker ──────────────────────────────────────────────────

export function LanguagePicker({ locale }: { locale: Locale }) {
  const t = COPY[locale].picker
  const reduce = useReducedMotion()
  const [code, setCode] = useState(PERSIAN.code)
  const sorted = useMemo(() => [...LANGS].sort((a, b) => name(a, locale).localeCompare(name(b, locale), locale)), [locale])
  const l = lang(code)
  const x = vsEnglish(l)
  const rows = [
    { label: t.tokens, en: ENGLISH.tokPerAnswer, me: l.tokPerAnswer, fmt: (v: number) => num(v, locale) },
    { label: t.energy, en: ENGLISH.jPerAnswer, me: l.jPerAnswer, fmt: (v: number) => `${num(v, locale, 1)}${J(locale)}` },
  ]
  const tiles = [
    { k: t.perToken, v: `${num(l.jtok, locale, 2)}${J(locale)}` },
    { k: t.tokens, v: num(l.tokPerAnswer, locale) },
    { k: t.energy, v: `${num(l.jPerAnswer, locale, 1)}${J(locale)}`, sub: t.wh(num(wh(l.jPerAnswer), locale, 3)) },
    { k: t.vsEnglish, v: t.times(times(x.energy, locale)), hot: true },
    { k: t.accuracy, v: dg(`${l.acc.toFixed(1)}%`, locale).replace("%", locale === "fa" ? "٪" : "%") },
  ]

  return (
    <div className="flex flex-col gap-8 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8">
      <label className="flex flex-col gap-2 md:max-w-md">
        <span className="text-sm text-v3-mute">{t.choose}</span>
        <select
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            medal("picker")
          }}
          className="rounded-xl border border-v3-line bg-v3-ink px-4 py-3 text-lg text-v3-bone focus-visible:outline-2 focus-visible:outline-v3-light"
        >
          {sorted.map((o) => (
            <option key={o.code} value={o.code}>
              {name(o, locale)}
            </option>
          ))}
        </select>
        <span className="text-xs text-v3-mute">
          {l.high ? t.resource.high : t.resource.low} · {t.script}: {scriptName(l.script, locale)}
        </span>
      </label>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-5" aria-live="polite">
        {tiles.map((s) => (
          <div key={s.k} className={`flex flex-col gap-1 rounded-2xl border p-4 ${s.hot ? "border-v3-light/60 bg-v3-light/10" : "border-v3-line/80"}`}>
            <dt className="order-2 text-xs leading-snug text-v3-mute">{s.k}</dt>
            <dd className={`order-1 font-v3-display text-2xl leading-none tabular-nums md:text-3xl ${s.hot ? "text-v3-light" : "text-v3-bone"}`}>{s.v}</dd>
            {s.sub && <dd className="order-3 text-xs text-v3-mute">{s.sub}</dd>}
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-6">
        {rows.map((r) => {
          const max = Math.max(r.en, r.me)
          return (
            <div key={r.label} className="flex flex-col gap-2">
              <span className="text-sm text-v3-soft">{r.label}</span>
              {[
                { who: t.english, v: r.en, gold: false },
                { who: name(l, locale), v: r.me, gold: true },
              ].map((b) => (
                <div key={b.who} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 text-xs md:grid-cols-[9rem_1fr]">
                  <span className="truncate text-v3-mute">{b.who}</span>
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ width: `${Math.max((b.v / max) * 100, 0.6)}%` }}
                      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
                      className={`block h-4 rounded-sm ${b.gold ? "bg-v3-light" : "bg-v3-mute"}`}
                    />
                    <span className="shrink-0 tabular-nums text-v3-soft">{r.fmt(b.v)}</span>
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <p className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.note}</p>
    </div>
  )
}

// ── 2. Two penalties: the area is the bill ──────────────────────────────────

export function Penalties({ locale }: { locale: Locale }) {
  const t = COPY[locale].penalties
  const reduce = useReducedMotion()
  const [code, setCode] = useState("pbt_Arab")
  const p = penalties(code)
  const UNIT = 11
  const W = Math.max(p.tokens, 1) * UNIT
  const H = Math.max(p.perToken, 1) * UNIT
  const maxW = 26 * UNIT
  const maxH = 9 * UNIT
  const pick = (c: string) => {
    setCode(c)
    medal("penalties")
  }
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.title}>
        {TABLE1.slice(1).map((r) => (
          <Pill key={r.code} on={code === r.code} onClick={() => pick(r.code)}>
            {name(lang(r.code), locale)}
          </Pill>
        ))}
      </div>
      <dl className="grid grid-cols-3 gap-3">
        {[
          { k: t.tokens, v: p.tokens },
          { k: t.perToken, v: p.perToken },
          { k: t.total, v: p.total, hot: true },
        ].map((s) => (
          <div key={s.k} className={`flex flex-col gap-1 rounded-2xl border p-3 md:p-4 ${s.hot ? "border-v3-light/60 bg-v3-light/10" : "border-v3-line/80"}`}>
            <dt className="order-2 text-xs leading-snug text-v3-mute">{s.k}</dt>
            <dd className={`order-1 font-v3-display text-3xl leading-none tabular-nums md:text-4xl ${s.hot ? "text-v3-light" : "text-v3-bone"}`}>×{times(s.v, locale)}</dd>
          </div>
        ))}
      </dl>
      <div className="overflow-x-auto" dir="ltr">
        <svg viewBox={`0 0 ${maxW + 2} ${maxH + 2}`} className="block h-auto w-full min-w-[18rem]" role="img" aria-label={t.equation(times(p.tokens, locale), times(p.perToken, locale), times(p.total, locale))}>
          <defs>
            <pattern id="le-unit" width={UNIT} height={UNIT} patternUnits="userSpaceOnUse" x={1} y={1}>
              <path d={`M${UNIT} 0 V${UNIT} H0`} className="fill-none stroke-v3-ink" strokeWidth={1} />
            </pattern>
          </defs>
          <motion.rect
            x={1}
            initial={false}
            animate={{ width: W, height: H, y: maxH + 1 - H }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: ARRIVE }}
            className="fill-v3-light"
          />
          <motion.rect
            x={1}
            initial={false}
            animate={{ width: W, height: H, y: maxH + 1 - H }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: ARRIVE }}
            fill="url(#le-unit)"
          />
          <rect x={1} y={maxH + 1 - UNIT} width={UNIT} height={UNIT} className="fill-v3-bone" />
        </svg>
      </div>
      <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose" aria-live="polite">
        <span className="me-2 inline-block h-3 w-3 rounded-[2px] bg-v3-bone align-middle" aria-hidden />
        {t.equation(times(p.tokens, locale), times(p.perToken, locale), times(p.total, locale))}
      </p>
    </div>
  )
}

// ── 3a. All 122 on one strip ────────────────────────────────────────────────

const logX = (v: number, lo: number, hi: number, w: number) => ((Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * w

export function EnergyStrip({ locale }: { locale: Locale }) {
  const t = COPY[locale].all
  const [sel, setSel] = useState<string>(PERSIAN.code)
  const W = 640
  const PAD = 16
  const lo = 15
  const hi = 4000
  const x = (v: number) => PAD + logX(v, lo, hi, W - 2 * PAD)
  const rowY = (high: boolean) => (high ? 44 : 104)
  const jitter = (i: number) => ((i * 37) % 23) - 11
  const ticks = [20, 50, 100, 200, 500, 1000, 2000]
  const s = lang(sel)
  const marked = new Set([ENGLISH.code, PERSIAN.code, "pbt_Arab", sel])
  return (
    <figure className="flex flex-col gap-4 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-6">
      <h3 className="font-v3-display text-2xl text-v3-bone">{t.stripTitle}</h3>
      <div dir="ltr">
        <svg viewBox={`0 0 ${W} 160`} className="block h-auto w-full" role="img" aria-label={t.stripTitle}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={x(v)} x2={x(v)} y1={18} y2={130} className="stroke-v3-line" strokeWidth={1} />
              <text x={x(v)} y={148} textAnchor="middle" className="fill-v3-mute text-[11px] tabular-nums">
                {num(v, locale)}
              </text>
            </g>
          ))}
          <text x={PAD} y={14} className="fill-v3-mute text-[11px]" direction={locale === "fa" ? "rtl" : "ltr"} textAnchor={locale === "fa" ? "end" : "start"}>
            {t.high}
          </text>
          <text x={PAD} y={74} className="fill-v3-mute text-[11px]" direction={locale === "fa" ? "rtl" : "ltr"} textAnchor={locale === "fa" ? "end" : "start"}>
            {t.low}
          </text>
          {LANGS.map((l, i) => (
            <circle
              key={l.code}
              cx={x(l.jPerAnswer)}
              cy={rowY(l.high) + jitter(i)}
              r={l.code === sel ? 6 : 4}
              tabIndex={0}
              role="button"
              aria-label={name(l, locale)}
              onMouseEnter={() => setSel(l.code)}
              onFocus={() => setSel(l.code)}
              onClick={() => setSel(l.code)}
              className={`cursor-pointer transition-[r] ${l.high ? "fill-v3-mute" : "fill-v3-light"} ${l.code === sel ? "stroke-v3-bone" : "stroke-transparent"} outline-none`}
              strokeWidth={2}
              fillOpacity={marked.has(l.code) ? 1 : 0.65}
            />
          ))}
          {[ENGLISH, PERSIAN, lang("pbt_Arab")].map((l) => (
            <text
              key={l.code}
              x={l.code === "pbt_Arab" ? x(l.jPerAnswer) + 8 : x(l.jPerAnswer)}
              y={rowY(l.high) - 16}
              textAnchor={l.code === "pbt_Arab" ? (locale === "fa" ? "start" : "end") : "middle"}
              direction={locale === "fa" ? "rtl" : "ltr"}
              className="fill-v3-bone text-[11px] font-semibold"
            >
              {name(l, locale)}
            </text>
          ))}
        </svg>
      </div>
      <p className="min-h-10 text-sm text-v3-soft" role="status" aria-live="polite">
        {t.tip(name(s, locale), num(s.jtok, locale, 2), num(s.acc, locale, 1), num(s.jPerAnswer, locale, 1))}
      </p>
      <figcaption className="text-xs text-v3-mute">{t.stripAxis}</figcaption>
    </figure>
  )
}

// ── 3b. Energy per token against accuracy ───────────────────────────────────

export function AccuracyScatter({ locale }: { locale: Locale }) {
  const t = COPY[locale].all
  const [sel, setSel] = useState<string>(PERSIAN.code)
  const W = 640
  const H = 360
  const L = 40
  const B = 36
  const x = (v: number) => L + ((v - 0.05) / (0.9 - 0.05)) * (W - L - 12)
  const y = (v: number) => 12 + (1 - v / 100) * (H - B - 12)
  const s = lang(sel)
  const pick = (c: string) => {
    setSel(c)
    medal("scatter")
  }
  const labelled = [ENGLISH.code, PERSIAN.code, "shn_Mymr", "bod_Tibt", "pbt_Arab", "zho_Hans"]
  return (
    <figure className="flex flex-col gap-4 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-v3-display text-2xl text-v3-bone">{t.scatterTitle}</h3>
        <p className="text-sm text-v3-soft">{t.scatterSub}</p>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-v3-soft">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-v3-mute" aria-hidden />
          {t.high}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-v3-light" aria-hidden />
          {t.low}
        </li>
      </ul>
      <div dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={t.scatterTitle}>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - 12} y1={y(v)} y2={y(v)} className="stroke-v3-line" strokeWidth={1} />
              <text x={L - 8} y={y(v) + 4} textAnchor="end" className="fill-v3-mute text-[11px] tabular-nums">
                {num(v, locale)}
              </text>
            </g>
          ))}
          {[0.1, 0.2, 0.4, 0.6, 0.8].map((v) => (
            <text key={v} x={x(v)} y={H - 16} textAnchor="middle" className="fill-v3-mute text-[11px] tabular-nums">
              {num(v, locale, 1)}
            </text>
          ))}
          {LANGS.map((l) => (
            <circle
              key={l.code}
              cx={x(l.jtok)}
              cy={y(l.acc)}
              r={l.code === sel ? 7 : 4.5}
              tabIndex={0}
              role="button"
              aria-label={name(l, locale)}
              onMouseEnter={() => setSel(l.code)}
              onFocus={() => pick(l.code)}
              onClick={() => pick(l.code)}
              className={`cursor-pointer outline-none ${l.high ? "fill-v3-mute" : "fill-v3-light"} ${l.code === sel ? "stroke-v3-bone" : "stroke-transparent"}`}
              strokeWidth={2}
              fillOpacity={0.8}
            />
          ))}
          {labelled.map((c) => {
            const l = lang(c)
            return (
              <text key={c} x={x(l.jtok)} y={c === "zho_Hans" ? y(l.acc) + 20 : y(l.acc) - 11} textAnchor="middle" direction={locale === "fa" ? "rtl" : "ltr"} className="pointer-events-none fill-v3-bone text-[11px] font-semibold">
                {name(l, locale)}
              </text>
            )
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-xs text-v3-mute">
        <span>↑ {t.yAxis}</span>
        <span>{t.xAxis} →</span>
      </div>
      <p className="min-h-10 text-sm text-v3-soft" role="status" aria-live="polite">
        {t.tip(name(s, locale), num(s.jtok, locale, 2), num(s.acc, locale, 1), num(s.jPerAnswer, locale, 1))}
      </p>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</figcaption>
    </figure>
  )
}

// ── 4. Same script, different bills ─────────────────────────────────────────

export function ScriptBars({ locale }: { locale: Locale }) {
  const t = COPY[locale].persian
  const reduce = useReducedMotion()
  const [sel, setSel] = useState<string>(PERSIAN.code)
  const lo = 15
  const hi = 4000
  const w = (v: number) => Math.max(logX(v, lo, hi, 100), 2)
  const row = (l: Lang, tone: "point" | "persian" | "ctx") => (
    <li key={l.code}>
      <button
        type="button"
        onClick={() => {
          setSel(l.code)
          medal("script")
        }}
        aria-pressed={sel === l.code}
        className={`grid w-full grid-cols-[6.5rem_1fr_2.25rem] items-center gap-3 rounded-lg px-1 py-1 text-start text-sm transition-colors md:grid-cols-[12rem_1fr_3.5rem] ${sel === l.code ? "bg-v3-light/10" : "hover:bg-v3-line/30"}`}
      >
        <span className={`truncate ${tone === "persian" ? "font-semibold text-v3-light" : "text-v3-soft"}`}>{name(l, locale)}</span>
        <span className="flex items-center gap-2">
          <motion.span
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${w(l.jPerAnswer)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: ARRIVE }}
            style={reduce ? { width: `${w(l.jPerAnswer)}%` } : undefined}
            className={`block h-4 min-w-1 shrink rounded-sm ${tone === "ctx" ? "bg-v3-mute" : "bg-v3-light"}`}
          />
          <span className="shrink-0 text-xs tabular-nums text-v3-soft">{num(l.jPerAnswer, locale)}</span>
        </span>
        <span className="text-end text-xs tabular-nums text-v3-mute">{num(l.acc, locale)}</span>
      </button>
    </li>
  )
  const s = lang(sel)
  return (
    <figure className="flex flex-col gap-4 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-v3-display text-2xl text-v3-bone">{t.scriptTitle}</h3>
        <p className="text-sm text-v3-soft">{t.scriptSub}</p>
      </div>
      <div className="grid grid-cols-[6.5rem_1fr_2.25rem] gap-3 px-1 text-xs text-v3-mute md:grid-cols-[12rem_1fr_3.5rem]">
        <span />
        <span>{t.energyCol} (log)</span>
        <span className="text-end">{t.accCol}</span>
      </div>
      <ul className="flex flex-col">{ARABIC_SCRIPT.map((l) => row(l, l.code === PERSIAN.code ? "persian" : l.high ? "ctx" : "point"))}</ul>
      <ul className="flex flex-col border-t border-v3-line pt-2">{row(TAJIK, "point")}</ul>
      <p className="min-h-10 text-sm text-v3-soft" role="status" aria-live="polite">
        {COPY[locale].all.tip(name(s, locale), num(s.jtok, locale, 2), num(s.acc, locale, 1), num(s.jPerAnswer, locale, 1))}
      </p>
      <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caption}</figcaption>
    </figure>
  )
}

// ── 5. Across models and tasks ──────────────────────────────────────────────

export function Persistence({ locale }: { locale: Locale }) {
  const t = COPY[locale].persist
  const reduce = useReducedMotion()
  const [mode, setMode] = useState<"models" | "tasks">("models")
  const [model, setModel] = useState<ModelKey>("q8")
  const [task, setTask] = useState<TaskKey>("reading")
  const values = SUBSET.map((c) => ({ code: c, v: mode === "models" ? TABLE3[c][model] : TABLE4[c][task] }))
  const max = Math.max(...values.map((r) => r.v))
  const ratio = mode === "models" ? MODELS.find((m) => m.key === model)!.ratio : TASKS.find((k) => k.key === task)!.ratio
  const touch = () => medal("persist")
  return (
    <figure className="flex flex-col gap-5 rounded-3xl border border-v3-line bg-v3-raise/60 p-4 md:p-6">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.title}>
        <Pill on={mode === "models"} onClick={() => (setMode("models"), touch())}>
          {t.models}
        </Pill>
        <Pill on={mode === "tasks"} onClick={() => (setMode("tasks"), touch())}>
          {t.tasks}
        </Pill>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-v3-line pt-4" role="radiogroup">
        {mode === "models"
          ? MODELS.map((m) => (
              <Pill key={m.key} on={model === m.key} onClick={() => (setModel(m.key), touch())}>
                <span dir="ltr">{m.name}</span>
              </Pill>
            ))
          : TASKS.map((k) => (
              <Pill key={k.key} on={task === k.key} onClick={() => (setTask(k.key), touch())}>
                {t.taskNames[k.key]}
              </Pill>
            ))}
      </div>
      <p className="font-v3-display text-3xl text-v3-light" aria-live="polite">
        {t.ratio(num(ratio, locale, 1))}
      </p>
      <ul className="flex flex-col gap-2">
        {values.map((r, i) => {
          const l = lang(r.code)
          return (
            <li key={r.code} className={`grid grid-cols-[minmax(6rem,9rem)_1fr] items-center gap-3 text-sm ${i === 4 ? "mt-2 border-t border-v3-line pt-3" : ""}`}>
              <span className="truncate text-v3-soft">{name(l, locale)}</span>
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ width: `${(r.v / max) * 100}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
                  className={`block h-4 rounded-sm ${l.high ? "bg-v3-mute" : "bg-v3-light"}`}
                />
                <span className="shrink-0 text-xs tabular-nums text-v3-soft">{num(r.v, locale, 2)}</span>
              </span>
            </li>
          )
        })}
      </ul>
      <figcaption className="text-xs text-v3-mute">{t.caption}</figcaption>
    </figure>
  )
}

// ── 6. Which answer costs more? ─────────────────────────────────────────────

export function CostGame({ locale }: { locale: Locale }) {
  const t = COPY[locale].game
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const done = i >= PAIRS.length
  const pair = PAIRS[Math.min(i, PAIRS.length - 1)]
  const answer = costlier(pair)
  const [a, b] = pair.map(lang)

  const choose = (c: string) => {
    if (pick) return
    setPick(c)
    if (c === answer) setScore((s) => s + 1)
  }
  const next = () => {
    const n = i + 1
    setI((cur) => (cur === i ? n : cur))
    setPick(null)
    if (n >= PAIRS.length) medal("game")
  }
  const restart = () => {
    setI(0)
    setScore(0)
    setPick(null)
  }
  const ratio = Math.max(a.jPerAnswer, b.jPerAnswer) / Math.min(a.jPerAnswer, b.jPerAnswer)

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-v3-bone/80 bg-v3-raise">
      <div className="flex items-center justify-between gap-3 bg-v3-bone px-5 py-3 text-sm font-semibold text-v3-ink">
        <span>{done ? t.done(num(score, locale), num(PAIRS.length, locale)) : t.q(num(i + 1, locale), num(PAIRS.length, locale))}</span>
        <span className="tabular-nums">{t.done(num(score, locale), num(PAIRS.length, locale))}</span>
      </div>
      <div className="flex min-h-64 flex-col gap-5 p-5 md:p-8" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div key="end" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              <span className="font-v3-display text-5xl text-v3-light tabular-nums">{t.done(num(score, locale), num(PAIRS.length, locale))}</span>
              <p className="max-w-2xl leading-relaxed text-v3-soft rtl:leading-loose">{t.lesson}</p>
              <button type="button" onClick={restart} className="inline-flex items-center gap-2 self-start rounded-full bg-v3-bone px-5 py-2.5 text-sm font-semibold text-v3-ink">
                <RotateCcw className="h-4 w-4" />
                {t.again}
              </button>
            </motion.div>
          ) : (
            <motion.div key={i} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease: ARRIVE }} className="flex flex-col gap-5">
              <p className="font-v3-display text-xl text-v3-bone md:text-2xl">{t.which}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[a, b].map((l) => {
                  const isAns = l.code === answer
                  return (
                    <button
                      key={l.code}
                      type="button"
                      disabled={!!pick}
                      onClick={() => choose(l.code)}
                      className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-start transition-colors ${
                        pick ? (isAns ? "border-v3-light bg-v3-light/10" : pick === l.code ? "border-v3-mute" : "border-v3-line opacity-70") : "border-v3-line hover:border-v3-bone"
                      }`}
                    >
                      <span className="font-v3-display text-2xl text-v3-bone">{name(l, locale)}</span>
                      <span className="text-xs text-v3-mute">{scriptName(l.script, locale)}</span>
                      {pick && <span className={`mt-1 text-sm tabular-nums ${isAns ? "text-v3-light" : "text-v3-soft"}`}>{num(l.jPerAnswer, locale, 1)}{J(locale)}</span>}
                    </button>
                  )
                })}
              </div>
              {pick && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <p className="text-sm text-v3-soft">
                    <span className={pick === answer ? "font-semibold text-v3-light" : "font-semibold text-v3-bone"}>{pick === answer ? t.right : t.wrong}</span>
                    {" · "}
                    {t.reveal(name(a, locale), num(a.jPerAnswer, locale, 1), name(b, locale), num(b.jPerAnswer, locale, 1), times(ratio, locale))}
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
