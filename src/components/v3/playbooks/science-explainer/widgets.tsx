"use client"

// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/widgets.tsx
// Why: The interactive parts of playbook 02, beside the player. Each one
//      shows a single rule of the prompt working: the palette as numbers,
//      text rising through a clip, the narrative arc as a zoom line, words
//      firing events, two clocks through a rewind, a damped spring you can
//      tune, the render pipeline and the mix. The scenes inside them use the
//      prompt's own space palette (literals, the same in both themes, like
//      the video); the frames around them use the site's tokens.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { motion, useInView, useReducedMotion } from "framer-motion"
import { Check, Pause, Play, RotateCcw } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { Mixed } from "../shared"
import { COPY } from "./copy"
import { fredoka } from "./fonts"
import { ARC, FLOW, MIX, PALETTE, READ, READ_LENGTH, SCIENCE, SFX, VOICES } from "./data"
import { spring } from "./scene"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
const SPACE = "bg-linear-to-b from-[#081d2c] to-[#102348]"
/** Three decimals: enough for pixels, and the same on the server and in the browser. */
const r3 = (v: number) => Math.round(v * 1000) / 1000
/**
 * Fredoka set inline: iransans.css puts the Persian face on every span under
 * [dir=rtl] outside any cascade layer, which beats the class, and that face
 * draws Latin digits as Persian ("8 MIN 20" would read ۸ MIN ۲۰).
 */
const FRED = { fontFamily: fredoka.style.fontFamily }

/** A clock that runs while `on` and the element is in view; returns seconds. */
function useLoop(length: number, on: boolean) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!on) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setT((v) => (v + dt) % length)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, length])
  return [t, setT] as const
}

function useVisible<T extends Element>() {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { margin: "-10% 0px" })
  const reduce = useReducedMotion()
  return { ref, live: inView && !reduce, reduce }
}

// ── The workflow, with its two gates ────────────────────────────────────────

export function Flow({ locale }: { locale: Locale }) {
  const t = COPY[locale].flow
  const { ref, live } = useVisible<HTMLDivElement>()
  return (
    <div ref={ref} className="flex flex-col gap-5">
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {FLOW.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 18 }}
            animate={live ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: i * 0.08, ease: ARRIVE }}
            className={`relative flex flex-col gap-2 rounded-2xl p-5 ${
              s.gate ? "border-2 border-dashed border-[#ffd98a]/70 bg-[#ffd98a]/10" : `border border-white/10 ${SPACE}`
            }`}
          >
            <span className={`font-mono text-xs ${s.gate ? "text-v3-light" : "text-[#8fd8e6]"}`} dir="ltr">
              {s.gate ? "◆" : localDigits(FLOW.filter((x) => !x.gate).indexOf(s) + 1, "en").padStart(2, "0")}
            </span>
            <span className={s.gate ? "text-v3-bone" : "text-white"}>{s.name[locale]}</span>
            <span className={`text-sm leading-relaxed rtl:leading-loose ${s.gate ? "text-v3-soft" : "text-[#cfe9f2]/75"}`}>
              <Mixed text={s.does[locale]} locale={locale} />
            </span>
          </motion.li>
        ))}
      </ol>
      <span className="inline-flex items-center gap-2 text-sm text-v3-mute">
        <span aria-hidden className="text-v3-light">◆</span>
        {t.gate}
      </span>
    </div>
  )
}

// ── The palette ─────────────────────────────────────────────────────────────

export function Palette({ locale }: { locale: Locale }) {
  const t = COPY[locale].look
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }
  return (
    <div className="flex flex-col gap-8">
      {PALETTE.map((g, gi) => (
        <div key={g.id} className="flex flex-col gap-3">
          <h3 className="text-sm text-v3-mute">{g.title[locale]}</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {g.swatches.map((s, i) => (
              <motion.li
                key={s.hex + i}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gi * 0.05 + i * 0.05, ease: ARRIVE }}
              >
                <button
                  type="button"
                  onClick={() => copy(s.hex)}
                  title={t.copyHint}
                  className="group flex w-full flex-col overflow-hidden rounded-2xl border border-v3-line/80 text-start transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="relative block h-20" style={{ background: s.hex }}>
                    {s.alpha && (
                      <span className="absolute end-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[11px] text-white" dir="ltr">
                        {s.alpha}
                      </span>
                    )}
                    <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                      {copied === s.hex ? <Check className="h-5 w-5 text-white drop-shadow" /> : null}
                    </span>
                  </span>
                  <span className="flex flex-col gap-0.5 bg-v3-raise px-3 py-2.5">
                    <span className="text-sm text-v3-bone">{s.name[locale]}</span>
                    <span className={`font-mono text-xs text-v3-mute ${LATIN}`} dir="ltr">
                      {copied === s.hex ? t.copied : s.hex}
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ── Text that rises through a clip, beside a plain fade ─────────────────────

const easeOutQuint = (k: number) => 1 - Math.pow(1 - k, 5)

export function CaptionDemo({ locale }: { locale: Locale }) {
  const t = COPY[locale].type
  const { ref, live } = useVisible<HTMLDivElement>()
  const [time, setTime] = useLoop(3.2, live)
  const lines = ["THIS LIGHT LEFT THE SUN", "8 MIN 20 SEC AGO"]
  const colours = ["#ffd98a", "#8fd8e6"]
  const k = (i: number) => Math.min(1, Math.max(0, (time - 0.3 - i * 0.12) / 0.45))
  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2">
      {(["rise", "fade"] as const).map((mode) => (
        <div key={mode} className={`flex flex-col overflow-hidden rounded-2xl border border-white/10 ${SPACE}`}>
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6" dir="ltr">
            {lines.map((line, i) => (
              <span key={line} className="overflow-hidden rounded-full bg-[rgba(6,20,40,0.62)] px-5 py-2">
                <span
                  className={`block text-lg uppercase tracking-[0.18em] md:text-2xl ${fredoka.className}`}
                  style={
                    mode === "rise"
                      ? { ...FRED, color: colours[i], fontWeight: 700, transform: `translateY(${r3((1 - easeOutQuint(k(i))) * 130)}%)` }
                      : { ...FRED, color: colours[i], fontWeight: 700, opacity: r3(k(i)) }
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 bg-[#06121f] px-4 py-2.5">
            <span className={`text-sm ${mode === "rise" ? "text-[#ffd98a]" : "text-white/55"}`}>{mode === "rise" ? t.rise : t.fade}</span>
            <button type="button" onClick={() => setTime(0)} className="inline-flex min-h-9 items-center gap-1.5 text-xs text-white/60 hover:text-[#8fd8e6]">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              {t.replay}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── The narrative arc as a zoom line ────────────────────────────────────────

export function Arc({ locale }: { locale: Locale }) {
  const t = COPY[locale].story
  const { ref, live } = useVisible<HTMLDivElement>()
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => setActive((a) => (a + 1) % ARC.length), 1800)
    return () => window.clearInterval(id)
  }, [live])
  const CW = 900
  const CH = 200
  // Mirrored in Persian so step 1 sits on the same side as card 1 below.
  const x = (i: number) => (locale === "fa" ? CW - 40 - (i * (CW - 80)) / (ARC.length - 1) : 40 + (i * (CW - 80)) / (ARC.length - 1))
  // Rounded so the server and the browser agree (Math.log differs in the last digits).
  const y = (z: number) => Math.round((CH - 30 - ((Math.log(z) - Math.log(0.2)) / (Math.log(3) - Math.log(0.2))) * (CH - 60)) * 100) / 100
  const d = ARC.map((a, i) => `${i ? "L" : "M"}${x(i)},${y(a.zoom)}`).join(" ")
  return (
    <div ref={ref} className="flex flex-col gap-6">
      <div className={`overflow-hidden rounded-2xl border border-white/10 p-4 ${SPACE}`} dir="ltr">
        <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label={t.zoom} style={FRED}>
          <defs>
            <linearGradient id="arcline" x1="0" x2="1">
              <stop offset="0" stopColor="#ffc857" />
              <stop offset="0.5" stopColor="#8fd8e6" />
              <stop offset="1" stopColor="#dc5f6e" />
            </linearGradient>
          </defs>
          <motion.path
            d={d}
            fill="none"
            stroke="url(#arcline)"
            strokeWidth={4}
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: ARRIVE }}
          />
          {ARC.map((a, i) => (
            <g key={a.id} onMouseEnter={() => setActive(i)} className="cursor-pointer">
              <circle cx={x(i)} cy={y(a.zoom)} r={i === active ? 12 : 7} fill={i === active ? "#ffd98a" : "#102348"} stroke="#ffd98a" strokeWidth={2} style={{ transition: "r .3s" }} />
              <text x={x(i)} y={y(a.zoom) - 20} fill="rgba(207,233,242,0.7)" fontSize={13} textAnchor="middle">
                {a.zoom}x
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {ARC.map((a, i) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`flex h-full w-full flex-col gap-1.5 rounded-xl border p-3 text-start transition-colors duration-300 ${i === active ? "border-v3-light/70 bg-v3-raise" : "border-v3-line/60"}`}
            >
              <span className="font-v3-display text-2xl text-v3-light">{localDigits(i + 1, locale)}</span>
              <span className="text-sm leading-snug text-v3-bone">{a.name[locale]}</span>
              <span className="text-xs leading-relaxed text-v3-mute">
                <Mixed text={a.example[locale]} locale={locale} />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ── Voice: two paths, and words that fire events ────────────────────────────

export function VoicePaths({ locale }: { locale: Locale }) {
  const t = COPY[locale].voice
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {VOICES.map((v, i) => (
        <motion.div
          key={v.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: ARRIVE }}
          className={`flex flex-col gap-4 rounded-2xl border p-6 ${i === 0 ? "border-[#8fd8e6]/40 bg-[#8fd8e6]/[0.06]" : "border-[#ffc857]/40 bg-[#ffc857]/[0.06]"}`}
        >
          <span className={`text-xl text-v3-bone ${LATIN}`} dir="ltr">
            {v.name}
          </span>
          <span className="flex flex-wrap gap-2" dir="ltr">
            {v.parts.map((p) => (
              <span key={p} className={`rounded-full border border-v3-line px-2.5 py-1 font-mono text-xs text-v3-soft ${LATIN}`}>
                {p}
              </span>
            ))}
          </span>
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-v3-mute">{t.cost}</dt>
              <dd className="text-v3-bone">{v.cost[locale]}</dd>
            </div>
            <div>
              <dt className="text-v3-mute">{t.timing}</dt>
              <dd className="text-v3-bone">{v.timing[locale]}</dd>
            </div>
          </dl>
          <span className="text-sm text-v3-soft">{v.note[locale]}</span>
        </motion.div>
      ))}
    </div>
  )
}

export function WordSync({ locale }: { locale: Locale }) {
  const t = COPY[locale].voice
  const { ref, live } = useVisible<HTMLDivElement>()
  const [playing, setPlaying] = useState(true)
  const [time, setTime] = useLoop(READ_LENGTH + 1.2, live && playing)
  const now = Math.min(time, READ_LENGTH)
  return (
    <div ref={ref} className={`flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 p-6 ${SPACE}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-[#8fd8e6]">{t.demoTitle}</span>
        <button
          type="button"
          onClick={() => {
            if (!playing) setTime(0)
            setPlaying((p) => !p)
          }}
          aria-label={t.play}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#ffd98a] text-[#081d2c]"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
      <div className="relative" dir="ltr">
        {/* The time line: a ruler of the read with the playhead running along it. */}
        <div className="relative h-1.5 rounded-full bg-white/10">
          <div className="absolute inset-y-0 start-0 rounded-full bg-linear-to-r from-[#8fd8e6] to-[#ffd98a]" style={{ width: `${(now / READ_LENGTH) * 100}%` }} />
        </div>
        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-6">
          {READ.map((w, i) => {
            const on = now >= w.t
            const fired = w.fire && on && now < w.t + 1.4
            return (
              <span key={i} className="relative flex flex-col items-start">
                <span
                  className={`text-2xl transition-colors duration-150 md:text-3xl ${fredoka.className} ${on ? (w.fire ? "text-[#ffd98a]" : "text-white") : "text-white/25"}`}
                  style={{ ...FRED, fontWeight: 600 }}
                >
                  {w.w}
                </span>
                <span className="text-[10px] text-white/35" style={FRED}>
                  {w.t.toFixed(2)}s
                </span>
                {w.fire && (
                  <motion.span
                    className="mt-1 rounded-full bg-[#ffd98a] px-2 py-0.5 text-[11px] font-semibold text-[#081d2c]"
                    animate={{ scale: fired ? [1, 1.18, 1] : 1, opacity: on ? 1 : 0.25 }}
                    transition={{ duration: 0.4 }}
                  >
                    {w.fire[locale]}
                  </motion.span>
                )}
              </span>
            )
          })}
        </div>
      </div>
      <p className="text-sm text-white/55">{t.demoHint}</p>
    </div>
  )
}

// ── Two clocks through a rewind ─────────────────────────────────────────────

export function Clocks({ locale }: { locale: Locale }) {
  const t = COPY[locale].arch.clocks
  const { ref, live } = useVisible<HTMLDivElement>()
  const [amb] = useLoop(1e6, live)
  const [rewindAt, setRewindAt] = useState<number | null>(null)
  // The story runs 1:1 with ambient time except for 0.8s after a rewind,
  // when it runs backwards at double speed.
  const rewind = rewindAt !== null ? Math.min(0.8, Math.max(0, amb - rewindAt)) : 0
  const storyOffset = rewindAt !== null ? -rewind * 3 : 0
  const panel = (single: boolean) => {
    const starT = single ? amb + storyOffset : amb
    return (
      <div className={`flex flex-col overflow-hidden rounded-2xl border border-white/10 ${SPACE}`}>
        <svg viewBox="0 0 320 150" className="w-full" aria-hidden>
          {Array.from({ length: 36 }).map((_, i) => {
            const x = ((i * 53 + starT * (8 + (i % 3) * 10)) % 340) - 10
            const y = (i * 37) % 140 + 5
            return <circle key={i} cx={r3(x)} cy={y} r={1 + (i % 3) * 0.6} fill="#fff" opacity={r3(0.5 + 0.5 * Math.sin(starT * 2 + i))} />
          })}
          <circle cx={r3(160 + Math.sin((amb + storyOffset) * 0.8) * 90)} cy={78} r={14} fill="#ffc857" />
          {rewind > 0 && rewind < 0.8 && <text x={14} y={24} fill="#8fd8e6" fontSize={16}>◀◀</text>}
        </svg>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#06121f] px-4 py-2.5 text-xs">
          <span className={single ? "text-[#dc5f6e]" : "text-[#8fd8e6]"}>{single ? t.bad : t.good}</span>
        </div>
      </div>
    )
  }
  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {panel(true)}
        {panel(false)}
      </div>
      <button
        type="button"
        onClick={() => setRewindAt(amb)}
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[#8fd8e6] px-5 text-sm font-semibold text-[#081d2c] transition-transform hover:scale-105"
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        {t.rewind}
      </button>
    </div>
  )
}

// ── A damped spring you can tune ────────────────────────────────────────────

export function SpringLab({ locale }: { locale: Locale }) {
  const t = COPY[locale].arch.spring
  const [damping, setDamping] = useState(0.45)
  const [freq, setFreq] = useState(14)
  const { ref, live } = useVisible<HTMLDivElement>()
  const [time, setTime] = useLoop(1.6, live)
  const ok = damping >= 0.42 && damping <= 0.5 && freq >= 12 && freq <= 16
  const verdict = ok ? t.ok : damping < 0.42 || freq > 16 ? t.tooBouncy : t.tooFlat
  const CW = 420
  const CH = 160
  const pts = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const k = (i / 120) * 1.2
        return `${i ? "L" : "M"}${r3((k / 1.2) * CW)},${r3(CH - 20 - spring(k, damping, freq) * (CH - 60))}`
      }).join(" "),
    [damping, freq],
  )
  const v = spring(Math.min(time, 1.2), damping, freq)
  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-2">
      <div className={`flex flex-col overflow-hidden rounded-2xl border border-white/10 ${SPACE}`} dir="ltr">
        <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label={t.title}>
          <line x1={0} x2={CW} y1={CH - 20 - (CH - 60)} y2={CH - 20 - (CH - 60)} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 6" />
          <path d={pts} fill="none" stroke={ok ? "#ffd98a" : "#dc5f6e"} strokeWidth={3} />
          <circle cx={r3((Math.min(time, 1.2) / 1.2) * CW)} cy={r3(CH - 20 - v * (CH - 60))} r={6} fill="#fff" />
        </svg>
        <div className="flex items-center justify-center border-t border-white/10 bg-[#06121f] py-6">
          {/* The countdown slamming in, at this spring. */}
          <span
            className={`rounded-full bg-[rgba(6,20,40,0.62)] px-6 py-2 text-4xl text-white ${fredoka.className}`}
            style={{ ...FRED, fontWeight: 700, transform: `scale(${r3(1.7 - 0.7 * v)})` }}
          >
            8:20
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-6">
        {(
          [
            [t.damping, damping, setDamping, 0.15, 0.9, 0.01, "0.42 – 0.5"],
            [t.freq, freq, setFreq, 4, 30, 0.5, "12 – 16"],
          ] as const
        ).map(([label, value, set, min, max, step, range]) => (
          <label key={label} className="flex flex-col gap-2">
            <span className="flex items-baseline justify-between text-sm">
              <span className="text-v3-bone">{label}</span>
              <span className={`font-mono text-v3-light ${LATIN}`} dir="ltr">
                {value} <span className="text-v3-mute">({range})</span>
              </span>
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => {
                set(Number(e.target.value))
                setTime(0)
              }}
              className="w-full accent-[#ffd98a]"
              dir="ltr"
            />
          </label>
        ))}
        <span className={`inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-sm ${ok ? "bg-v3-light text-v3-ink" : "border border-v3-line text-v3-soft"}`}>
          {ok && <Check className="h-4 w-4" aria-hidden />}
          {verdict}
        </span>
        <button type="button" onClick={() => setTime(0)} className="inline-flex items-center gap-1.5 self-start text-sm text-v3-mute hover:text-v3-light">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          {t.replay}
        </button>
      </div>
    </div>
  )
}

// ── Render pipeline ─────────────────────────────────────────────────────────

export function Pipeline({ locale }: { locale: Locale }) {
  const steps = COPY[locale].render.steps
  const { ref, live } = useVisible<HTMLDivElement>()
  const colours = ["#8fd8e6", "#4dc7eb", "#ffd98a", "#ffc857", "#ff8f4a"]
  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-0.5 -translate-y-1/2 bg-white/10 lg:block">
        <motion.div
          className="h-full origin-left bg-linear-to-r from-[#8fd8e6] via-[#ffd98a] to-[#ff8f4a] rtl:origin-right"
          initial={{ scaleX: 0 }}
          animate={live ? { scaleX: [0, 1, 1], opacity: [1, 1, 0] } : undefined}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.8, 1], ease: "linear" }}
        />
      </div>
      <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.name} className={`flex flex-col gap-2 rounded-2xl border border-white/10 p-5 ${SPACE}`}>
            <span className="h-1.5 w-10 rounded-full" style={{ background: colours[i] }} />
            <span className={`text-white ${LATIN}`} dir="ltr">
              {s.name}
            </span>
            <span className="text-sm leading-relaxed text-[#cfe9f2]/75 rtl:leading-loose">
              <Mixed text={s.does} locale={locale} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ── The mix ─────────────────────────────────────────────────────────────────

export function MixMeter({ locale }: { locale: Locale }) {
  const t = COPY[locale].sound
  const { ref, live } = useVisible<HTMLDivElement>()
  const [time] = useLoop(1e6, live)
  const colours: Record<string, string> = { voice: "#ffffff", sfx: "#ffd98a", music: "#8fd8e6", title: "#ff8f4a" }
  return (
    <div ref={ref} className={`flex flex-col gap-5 rounded-2xl border border-white/10 p-6 ${SPACE}`}>
      {MIX.map((m, i) => {
        // A meter that breathes around its level, so it reads as audio.
        const wobble = live ? (Math.sin(time * (3 + i) + i) + Math.sin(time * 7.3 + i * 2)) * 1.2 : 0
        const level = Math.max(0, Math.min(100, ((m.db + 20 + wobble) / 20) * 100))
        return (
          <div key={m.id} className="grid grid-cols-[8rem_1fr_4.5rem] items-center gap-4">
            <span className="text-sm text-white/80">{m.name[locale]}</span>
            <div className="relative h-3 rounded-full bg-white/10" dir="ltr">
              {m.range && (
                <span
                  className="absolute inset-y-0 rounded-full bg-[#ffd98a]/20"
                  style={{ left: `${((m.range[0] + 20) / 20) * 100}%`, width: `${((m.range[1] - m.range[0]) / 20) * 100}%` }}
                />
              )}
              <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${level}%`, background: colours[m.id] }} />
            </div>
            <span className={`text-end font-mono text-sm text-white ${LATIN}`} dir="ltr">
              {m.db === 0 ? "0 dB" : m.range ? `${m.range[0]}…${m.range[1]} dB` : `${m.db} dB`}
            </span>
          </div>
        )
      })}
      <span className="text-xs text-white/45">{t.under}</span>
    </div>
  )
}

export function SfxChips({ locale }: { locale: Locale }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {SFX.map((s, i) => (
        <motion.li
          key={s.en}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: ARRIVE }}
          className="rounded-full border border-v3-line px-3.5 py-1.5 text-sm text-v3-soft"
        >
          {s[locale]}
        </motion.li>
      ))}
    </ul>
  )
}

// ── The science check ───────────────────────────────────────────────────────

export function ScienceTable({ locale }: { locale: Locale }) {
  const t = COPY[locale].science
  const pill = { true: "bg-v3-light text-v3-ink", approx: "border border-v3-light text-v3-light", estimate: "bg-v3-bone text-v3-ink" }
  return (
    <ol className="flex flex-col">
      {SCIENCE.map((s, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: locale === "fa" ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: ARRIVE }}
          className="grid gap-2 border-b border-v3-line/60 py-5 last:border-b-0 md:grid-cols-[1fr_6rem_2fr] md:gap-6"
        >
          <span className="text-lg text-v3-bone">
            <Mixed text={s.claim[locale]} locale={locale} />
          </span>
          <span>
            <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ${pill[s.verdict]}`}>{t.verdicts[s.verdict]}</span>
          </span>
          <span className="leading-relaxed text-v3-soft rtl:leading-loose">
            <Mixed text={s.detail[locale]} locale={locale} />{" "}
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-v3-light underline underline-offset-4">
              {t.source}
            </a>
          </span>
        </motion.li>
      ))}
    </ol>
  )
}
