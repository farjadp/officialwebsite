"use client"

// ============================================================================
// File Path: src/components/v3/reports/vienna-1683/widgets.tsx
// Why: The interactive figures of report 06: the myth-versus-history
//      numbers, the siege clock, the five force multipliers with the
//      interior-lines race, the myth cards and the mirror. The page is a
//      server component so every sentence is in the HTML; these render a
//      complete default state on the server, respect reduced motion and use
//      v3 theme tokens. Each awards its medal the first time it is used.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Castle, Crosshair, Flag, Hourglass, Network, PersonStanding, Target, Users } from "lucide-react"
import { useMemo, useRef, useState, type ComponentType } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { FORCES, MULTIPLIERS, MYTHS, PER_ICON, SIEGE_DAYS, TIMELINE, type MultiplierKey, type MythKey } from "./data"
import { medal } from "./medals"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const FA = "۰۱۲۳۴۵۶۷۸۹"
export const dg = (s: string, l: Locale) => (l === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]).replace(/,/g, "٬") : s)
const k = (v: number, l: Locale) => (l === "fa" ? `${dg(String(Math.round(v / 1000)), l)} هزار` : `${Math.round(v / 1000)}k`)
const range = (r: [number, number], l: Locale) => (l === "fa" ? `${dg(String(r[0] / 1000), l)} تا ${dg(String(r[1] / 1000), l)} هزار` : `${r[0] / 1000}–${r[1] / 1000}k`)

// ── 1. The numbers: myth versus history ─────────────────────────────────────

type Seg = { men: number; tone: "solid" | "soft" | "ghost" }

function IconRow({ segs, reduce, keyBase, rtl }: { segs: Seg[]; reduce: boolean | null; keyBase: string; rtl: boolean }) {
  const icons: { tone: Seg["tone"]; part: number }[] = []
  for (const s of segs) {
    let left = s.men / PER_ICON
    while (left > 0.05) {
      icons.push({ tone: s.tone, part: Math.min(1, left) })
      left -= 1
    }
  }
  return (
    <div className="flex flex-wrap gap-0.5" aria-hidden>
      {icons.map((ic, i) => (
        <motion.span
          key={`${keyBase}-${i}`}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: reduce ? 0 : Math.min(i * 0.012, 0.7) }}
          className="relative h-5 w-3.5 md:h-6 md:w-4"
        >
          <PersonStanding
            className={`absolute inset-0 h-full w-full ${ic.tone === "solid" ? "text-v3-light" : ic.tone === "soft" ? "text-v3-light/45" : "text-v3-line"}`}
            strokeWidth={2.2}
            style={ic.part < 1 ? { clipPath: rtl ? `inset(0 0 0 ${(1 - ic.part) * 100}%)` : `inset(0 ${(1 - ic.part) * 100}% 0 0)` } : undefined}
          />
        </motion.span>
      ))}
    </div>
  )
}

export function NumbersFigure({ locale }: { locale: Locale }) {
  const t = COPY[locale].numbers
  const reduce = useReducedMotion()
  const [hist, setHist] = useState(false)
  const flip = (v: boolean) => {
    setHist(v)
    if (v) medal("numbers")
  }
  const F = FORCES
  const rows = hist
    ? [
        {
          label: t.sides.ottoman,
          value: range(F.ottomanTotal, locale),
          note: `${t.notes.total} ${t.notes.combat}`,
          segs: [
            { men: F.ottomanCombat[0], tone: "solid" },
            { men: F.ottomanCombat[1] - F.ottomanCombat[0], tone: "soft" },
            { men: F.ottomanTotal[1] - F.ottomanCombat[1], tone: "ghost" },
          ] as Seg[],
        },
        { label: t.sides.defenders, value: k(F.defendersSoldiers + F.defendersCitizens, locale), note: t.notes.defenders, segs: [{ men: F.defendersSoldiers, tone: "solid" }, { men: F.defendersCitizens, tone: "soft" }] as Seg[] },
        { label: t.sides.relief, value: range(F.relief, locale), note: t.notes.relief, segs: [{ men: F.relief[0], tone: "solid" }, { men: F.relief[1] - F.relief[0], tone: "soft" }] as Seg[] },
      ]
    : [
        { label: t.sides.ottoman, value: k(F.ottomanClaim, locale), note: t.notes.claim, segs: [{ men: F.ottomanClaim, tone: "solid" }] as Seg[] },
        { label: t.sides.defenders, value: k(12000, locale), note: "", segs: [{ men: 12000, tone: "solid" }] as Seg[] },
        { label: t.sides.relief, value: "—", note: "", segs: [] as Seg[] },
      ]

  return (
    <div className="flex flex-col gap-8">
      <div role="radiogroup" aria-label={t.title} className="inline-flex self-start rounded-full border border-v3-line p-1">
        {[false, true].map((h) => (
          <button
            key={String(h)}
            type="button"
            role="radio"
            aria-checked={hist === h}
            onClick={() => flip(h)}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${hist === h ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"}`}
          >
            {hist === h && <motion.span layoutId="vienna-numbers-pill" className="absolute inset-0 rounded-full bg-v3-light" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{h ? t.history : t.myth}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-6">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-3 border-b border-v3-line/60 pb-6 md:grid-cols-[14rem_1fr] md:gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-v3-mute">{r.label}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${hist}-${r.value}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-v3-display text-4xl tabular-nums text-v3-bone"
                >
                  {r.value}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-2">
              <IconRow segs={r.segs} reduce={reduce} keyBase={`${hist}-${r.label}`} rtl={locale === "fa"} />
              {r.note && <p className="max-w-2xl text-sm leading-relaxed text-v3-soft rtl:leading-loose">{r.note}</p>}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-v3-mute">{t.perIcon}</p>
    </div>
  )
}

// ── 2. The siege clock ──────────────────────────────────────────────────────

const START = Date.UTC(1683, 6, 14)

export function SiegeClock({ locale }: { locale: Locale }) {
  const t = COPY[locale].clock
  const reduce = useReducedMotion()
  const [day, setDay] = useState(SIEGE_DAYS)
  const move = (d: number) => {
    setDay(d)
    if (d >= SIEGE_DAYS) medal("clock")
  }
  const date = new Date(START + day * 86400000).toLocaleDateString(locale === "fa" ? "fa-IR-u-ca-gregory" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" })
  const current = [...TIMELINE].reverse().find((e) => e.day <= day) ?? TIMELINE[0]
  const bought = Math.max(0, Math.min(1, day / SIEGE_DAYS))
  const ev = t.events[current.key]

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-7">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { rotate: day >= SIEGE_DAYS ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="grid h-16 w-16 place-items-center rounded-full border-2 border-v3-light text-v3-light"
            >
              <Hourglass className="h-7 w-7" />
            </motion.span>
            <div className="flex flex-col">
              <span className="font-v3-display text-5xl tabular-nums text-v3-bone">{day < 0 ? t.before : t.day(dg(String(day), locale))}</span>
              <span className="text-sm text-v3-mute">
                {date} {dg("1683", locale)}
              </span>
            </div>
          </div>
        </div>
        <input
          type="range"
          min={-7}
          max={SIEGE_DAYS}
          step={1}
          value={day}
          dir="ltr"
          aria-label={t.title}
          onChange={(e) => move(Number(e.target.value))}
          className="w-full accent-(--v3-accent)"
        />
        <ol className="relative flex justify-between" dir="ltr" aria-hidden>
          {TIMELINE.map((e) => (
            <li key={e.key} className="absolute -translate-x-1/2" style={{ left: `${((e.day + 7) / (SIEGE_DAYS + 7)) * 100}%` }}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => move(e.day)}
                className={`block h-3 w-3 rounded-full border-2 transition-colors ${e.day <= day ? "border-v3-light bg-v3-light" : "border-v3-line bg-v3-ink"}`}
              />
            </li>
          ))}
        </ol>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-2xl border border-v3-light/40 p-4">
            <span className="flex items-center gap-2 text-xs text-v3-light">
              <Castle className="h-4 w-4" aria-hidden /> {t.defender}
            </span>
            <div className="h-2.5 overflow-hidden rounded-full bg-v3-line">
              <motion.div className="h-full rounded-full bg-v3-light" animate={{ width: `${bought * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
            <span className="text-sm text-v3-soft">
              {t.defenderCost}: {dg(String(Math.max(0, day)), locale)} / {dg(String(SIEGE_DAYS), locale)}
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-v3-line p-4">
            <span className="flex items-center gap-2 text-xs text-v3-mute">
              <Crosshair className="h-4 w-4" aria-hidden /> {t.attacker}
            </span>
            <div className="h-2.5 overflow-hidden rounded-full bg-v3-line">
              <motion.div className="h-full rounded-full bg-v3-mute" animate={{ width: `${bought * 100}%` }} transition={{ duration: 0.4 }} />
            </div>
            <span className="text-sm text-v3-soft">{t.attackerCost}</span>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: ARRIVE }}
            className="flex h-full flex-col gap-3 rounded-3xl border border-v3-light/40 bg-v3-raise p-6 shadow-[0_0_60px_-35px_rgb(var(--v3-glow)/0.8)]"
            aria-live="polite"
          >
            <span className="text-sm text-v3-light">
              {ev.date} {dg("1683", locale)}
            </span>
            <h3 className="font-v3-display text-3xl text-v3-bone">{ev.title}</h3>
            <p className="leading-relaxed text-v3-soft rtl:leading-loose">{ev.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── 3. Why they held: the multipliers and the interior-lines race ───────────

const MULT_ICON: Record<MultiplierKey, ComponentType<{ className?: string }>> = {
  goals: Target,
  walls: Castle,
  lines: Network,
  focus: Crosshair,
  command: Flag,
}

export function Multipliers({ locale }: { locale: Locale }) {
  const t = COPY[locale].defence
  const reduce = useReducedMotion()
  const [on, setOn] = useState<MultiplierKey>("goals")
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div role="tablist" aria-label={t.title} className="flex gap-2 overflow-x-auto pb-1 lg:col-span-4 lg:flex-col lg:overflow-visible">
        {MULTIPLIERS.map((m, i) => {
          const I = MULT_ICON[m]
          const sel = on === m
          return (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={sel}
              onClick={() => setOn(m)}
              className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-colors ${sel ? "border-v3-light bg-v3-light/10 text-v3-bone" : "border-v3-line text-v3-soft hover:border-v3-light/60"}`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${sel ? "bg-v3-light text-v3-ink" : "border border-v3-line text-v3-mute"}`}>
                <I className="h-4 w-4" />
              </span>
              <span className="text-xs text-v3-mute">{dg(String(i + 1), locale)}</span>
              <span className="font-medium">{t.items[m].name}</span>
            </button>
          )
        })}
      </div>
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={on}
            role="tabpanel"
            initial={reduce ? false : { opacity: 0, x: locale === "fa" ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 rounded-3xl border border-v3-line bg-v3-raise p-6 md:p-8"
          >
            <h3 className="font-v3-display text-3xl text-v3-bone">{t.items[on].name}</h3>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.items[on].body}</p>
            {on === "walls" && (
              <div className="flex items-end gap-3 pt-2" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.12 }} className="h-16 w-8 origin-bottom rounded-t bg-v3-mute/60" />
                ))}
                <span className="pb-4 text-v3-mute">:</span>
                <motion.span initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.4 }} className="h-16 w-8 origin-bottom rounded-t bg-v3-light" />
              </div>
            )}
            {on === "walls" && <p className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{t.caveat}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function InteriorLines({ locale }: { locale: Locale }) {
  const t = COPY[locale].defence.lines
  const reduce = useReducedMotion()
  const C = 150
  const R = 110
  const BASTIONS = 8
  const [run, setRun] = useState<{ target: number; from: number; id: number } | null>(null)
  const ids = useRef(0)

  const launch = () => {
    const target = Math.floor(Math.random() * BASTIONS)
    // The attacker's reserve sits a quarter to a half of the ring away.
    const from = (target + 2 + Math.floor(Math.random() * 3)) % BASTIONS
    ids.current += 1
    setRun({ target, from, id: ids.current })
    medal("lines")
  }

  const pt = (i: number, r = R) => {
    const a = (i / BASTIONS) * Math.PI * 2 - Math.PI / 2
    return [C + Math.cos(a) * r, C + Math.sin(a) * r] as const
  }

  const arc = useMemo(() => {
    if (!run) return null
    const a0 = (run.from / BASTIONS) * Math.PI * 2
    let a1 = (run.target / BASTIONS) * Math.PI * 2
    if (Math.abs(a1 - a0) > Math.PI) a1 += a1 < a0 ? Math.PI * 2 : -Math.PI * 2
    const steps = 24
    const xs: number[] = []
    const ys: number[] = []
    for (let s = 0; s <= steps; s++) {
      const a = a0 + ((a1 - a0) * s) / steps - Math.PI / 2
      xs.push(C + Math.cos(a) * (R + 18))
      ys.push(C + Math.sin(a) * (R + 18))
    }
    return { xs, ys, len: Math.abs(a1 - a0) * (R + 18) }
  }, [run])

  const speed = 120 // px per second, the same for both sides
  const tDef = R / speed
  const tAtt = arc ? arc.len / speed : 1

  return (
    <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,18rem)_1fr]">
      <svg viewBox="0 0 300 300" className="mx-auto block w-full max-w-[18rem]" direction="ltr" role="img" aria-label={t.title}>
        <circle cx={C} cy={C} r={R + 18} className="fill-none stroke-v3-line" strokeDasharray="4 6" />
        <polygon
          points={Array.from({ length: BASTIONS * 2 }, (_, i) => {
            const a = (i / (BASTIONS * 2)) * Math.PI * 2 - Math.PI / 2
            const r = i % 2 ? R * 0.82 : R
            return `${C + Math.cos(a) * r},${C + Math.sin(a) * r}`
          }).join(" ")}
          className="fill-v3-raise stroke-v3-bone/60"
          strokeWidth={1.5}
        />
        {Array.from({ length: BASTIONS }, (_, i) => {
          const [x, y] = pt(i)
          const hit = run?.target === i
          return <circle key={i} cx={x} cy={y} r={hit ? 9 : 5} className={hit ? "fill-v3-light" : "fill-v3-line"} />
        })}
        <circle cx={C} cy={C} r={6} className="fill-v3-bone" />
        {run && arc && (
          <g key={run.id}>
            <motion.circle
              r={8}
              className="fill-v3-light drop-shadow-[0_0_8px_rgb(var(--v3-glow)/0.9)]"
              initial={{ cx: C, cy: C }}
              animate={{ cx: pt(run.target)[0], cy: pt(run.target)[1] }}
              transition={{ duration: reduce ? 0 : tDef, ease: "linear" }}
            />
            <motion.circle
              r={8}
              className="fill-v3-mute"
              initial={{ cx: arc.xs[0], cy: arc.ys[0] }}
              animate={{ cx: arc.xs, cy: arc.ys }}
              transition={{ duration: reduce ? 0 : tAtt, ease: "linear" }}
            />
          </g>
        )}
      </svg>
      <div className="flex flex-col gap-4">
        <h3 className="font-v3-display text-2xl text-v3-bone">{t.title}</h3>
        <div className="flex flex-col gap-2 text-sm">
          <span className="flex items-center gap-2 text-v3-light">
            <span className="h-3 w-3 rounded-full bg-v3-light" aria-hidden /> {t.defenders}
          </span>
          <span className="flex items-center gap-2 text-v3-mute">
            <span className="h-3 w-3 rounded-full bg-v3-mute" aria-hidden /> {t.attackers}
          </span>
        </div>
        <button type="button" onClick={launch} className="self-start rounded-full bg-v3-light px-5 py-2.5 text-sm font-semibold text-v3-ink">
          {run ? t.again : t.run}
        </button>
        <AnimatePresence>
          {run && (
            <motion.p key={run.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : tDef }} className="text-sm text-v3-light" role="status">
              {t.won} · {dg((tAtt / tDef).toFixed(1), locale)}×
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── 4. Myth cards ───────────────────────────────────────────────────────────

export function MythCards({ locale }: { locale: Locale }) {
  const t = COPY[locale].myths
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<Set<MythKey>>(new Set())
  const toggle = (m: MythKey) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(m)) next.delete(m)
      else next.add(m)
      return next
    })
  const seen = useRef(new Set<MythKey>())

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {MYTHS.map((m) => {
        const it = t.items[m]
        const isOpen = open.has(m)
        return (
          <button
            key={m}
            type="button"
            aria-pressed={isOpen}
            onClick={() => {
              seen.current.add(m)
              if (seen.current.size === MYTHS.length) medal("myths")
              toggle(m)
            }}
            className="group relative min-h-64 text-start [perspective:1200px]"
          >
            <motion.div
              className="relative h-full min-h-64 [transform-style:preserve-3d]"
              animate={{ rotateY: isOpen ? 180 : 0 }}
              transition={{ duration: reduce ? 0 : 0.6, ease: ARRIVE }}
            >
              <div className="absolute inset-0 flex flex-col justify-between gap-4 rounded-3xl border border-v3-line bg-v3-raise p-6 [backface-visibility:hidden] group-hover:border-v3-light/60">
                <span className="text-xs text-v3-mute">{t.claim}</span>
                <p className="font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl">{it.claim}</p>
                <span className="text-xs text-v3-light">{t.tap}</span>
              </div>
              <div className="absolute inset-0 flex flex-col gap-3 overflow-auto rounded-3xl border border-v3-light/60 bg-v3-ink p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="flex items-center justify-between gap-3 text-xs text-v3-mute">
                  {t.verdict}
                  <span className="rounded-full bg-v3-light px-2.5 py-0.5 font-semibold text-v3-ink">{it.tag}</span>
                </span>
                <p className="leading-relaxed text-v3-bone rtl:leading-loose">{it.truth}</p>
              </div>
            </motion.div>
          </button>
        )
      })}
    </div>
  )
}

// ── 5. The mirror ───────────────────────────────────────────────────────────

function YesNo({ value, set, label, yes, no }: { value: boolean | null; set: (v: boolean) => void; label: string; yes: string; no: string }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm text-v3-soft">{label}</legend>
      <div className="flex gap-2">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={value === v}
            onClick={() => set(v)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${value === v ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light"}`}
          >
            {v ? yes : no}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function Mirror({ locale }: { locale: Locale }) {
  const t = COPY[locale].mirror
  const reduce = useReducedMotion()
  const [projects, setProjects] = useState(4)
  const [share, setShare] = useState(35)
  const [goal, setGoal] = useState<boolean | null>(null)
  const [threat, setThreat] = useState<boolean | null>(null)
  const touched = useRef(false)
  const touch = () => {
    if (!touched.current) {
      touched.current = true
      medal("mirror")
    }
  }

  const score = (share >= 50 ? 2 : share >= 35 ? 1 : 0) + (projects <= 2 ? 1 : projects <= 4 ? 0.5 : 0) + (goal ? 1 : 0) + (threat ? 1 : 0)
  const res = score >= 4 ? t.starhemberg : score >= 2 ? t.middle : t.kara
  const tone = score >= 4 ? "light" : score >= 2 ? "bone" : "mute"

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="flex flex-col gap-7 lg:col-span-6">
        <label className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between text-sm text-v3-soft">
            {t.projects}
            <b className="font-v3-display text-3xl font-normal tabular-nums text-v3-bone">{dg(String(projects), locale)}</b>
          </span>
          <input type="range" min={1} max={12} value={projects} dir="ltr" onChange={(e) => { setProjects(Number(e.target.value)); touch() }} className="accent-(--v3-accent)" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between text-sm text-v3-soft">
            {t.share}
            <b className="font-v3-display text-3xl font-normal tabular-nums text-v3-bone">{locale === "fa" ? `${dg(String(share), locale)}٪` : `${share}%`}</b>
          </span>
          <input type="range" min={0} max={100} step={5} value={share} dir="ltr" onChange={(e) => { setShare(Number(e.target.value)); touch() }} className="accent-(--v3-accent)" />
        </label>
        <YesNo value={goal} set={(v) => { setGoal(v); touch() }} label={t.goal} yes={t.yes} no={t.no} />
        <YesNo value={threat} set={(v) => { setThreat(v); touch() }} label={t.threat} yes={t.yes} no={t.no} />
      </div>
      <div className="lg:col-span-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={res.title}
            initial={reduce ? false : { opacity: 0, scale: 0.96, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: ARRIVE }}
            className={`flex h-full flex-col gap-4 rounded-3xl border p-7 ${tone === "light" ? "border-v3-light bg-v3-light/10 shadow-[0_0_80px_-30px_rgb(var(--v3-glow)/0.9)]" : "border-v3-line bg-v3-raise"}`}
            aria-live="polite"
          >
            <span className={`grid h-14 w-14 place-items-center rounded-full border-2 ${tone === "light" ? "border-v3-light text-v3-light" : "border-v3-line text-v3-mute"}`}>
              {tone === "light" ? <Castle className="h-6 w-6" /> : tone === "bone" ? <Users className="h-6 w-6" /> : <Crosshair className="h-6 w-6" />}
            </span>
            <p className="font-v3-display text-4xl text-v3-bone">{res.title}</p>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{res.body}</p>
            <p className="mt-auto border-t border-v3-line/70 pt-4 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.rule}</p>
            <p className="text-xs text-v3-mute">{t.privacy}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

