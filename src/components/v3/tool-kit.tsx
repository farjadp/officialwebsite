"use client"

// ============================================================================
// File Path: src/components/v3/tool-kit.tsx
// Why: The v3 building blocks for the self-assessment tools, so all ten
//      share one interaction language: a sticky progress rule of light,
//      answer scales that behave like real radio groups (arrow keys work),
//      labelled lead fields, and a result that counts up inside a ring of
//      light. Visual only — no tool's questions, scoring or data flow lives
//      here. Direction-aware; every animation respects reduced motion.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"
import { Loader2 } from "lucide-react"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── Page frame ────────────────────────────────────────────────────────────

/** The ground for a tool page: dark, a slow beam, a centred column. */
export function ToolShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-v3-ink font-v3-body text-v3-bone selection:bg-v3-light selection:text-v3-ink">
      <div
        aria-hidden
        className="v3-beam pointer-events-none absolute -top-1/4 start-0 -z-10 h-[160%] w-72 bg-linear-to-r from-transparent via-v3-light/[0.06] to-transparent"
      />
      <div className={`mx-auto w-full px-5 py-16 md:px-10 md:py-24 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>{children}</div>
    </div>
  )
}

/** A block that rises in when it mounts — for step changes inside a tool. */
export function StepIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: ARRIVE }}
    >
      {children}
    </motion.div>
  )
}

/** The tool's opening screen. */
export function ToolIntro({
  kicker,
  title,
  lead,
  meta,
  action,
}: {
  kicker?: ReactNode
  title: ReactNode
  lead?: ReactNode
  meta?: ReactNode
  action: ReactNode
}) {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-16">
      {kicker && (
        <StepIn>
          <p className="text-sm text-v3-light">{kicker}</p>
        </StepIn>
      )}
      <StepIn delay={0.08}>
        <h1 className="font-v3-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.04] tracking-[-0.02em] rtl:leading-[1.4] rtl:tracking-normal">
          {title}
        </h1>
      </StepIn>
      {lead && (
        <StepIn delay={0.16}>
          <p className="max-w-2xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{lead}</p>
        </StepIn>
      )}
      <StepIn delay={0.24} className="flex flex-col items-start gap-4">
        {action}
        {meta && <p className="text-sm text-v3-mute">{meta}</p>}
      </StepIn>
    </div>
  )
}

// ── Buttons ───────────────────────────────────────────────────────────────

type ActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet"
  loading?: boolean
}

/** A real <button> in the v3 styles (V3Button in the kit is for links). */
export function ToolButton({ variant = "primary", loading = false, className, children, disabled, ...rest }: ActionProps) {
  const styles = {
    primary:
      "rounded-full bg-v3-bone px-7 font-semibold text-v3-ink hover:-translate-y-0.5 hover:bg-v3-light disabled:translate-y-0 disabled:bg-v3-line disabled:text-v3-mute",
    secondary:
      "rounded-full border border-v3-bone/60 px-7 font-medium text-v3-bone hover:border-v3-light hover:text-v3-light disabled:border-v3-line disabled:text-v3-mute",
    quiet: "px-3 text-v3-soft hover:text-v3-light disabled:text-v3-line",
  }
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`group inline-flex min-h-12 items-center justify-center gap-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink disabled:cursor-not-allowed ${styles[variant]} ${className ?? ""}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

// ── Progress ──────────────────────────────────────────────────────────────

/**
 * Sticky progress under the site header (which is h-20): a label, a
 * percentage and a rule of light that fills as questions are answered.
 */
export function ToolProgress({
  label,
  percent,
  title,
  percentLabel,
}: {
  label: ReactNode
  percent: number
  title?: ReactNode
  /** Rendered next to the bar, e.g. "40% completed"; defaults to the number. */
  percentLabel?: ReactNode
}) {
  const reduce = useReducedMotion()
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="v3-under-header sticky z-10 -mx-5 border-b border-v3-line/70 bg-v3-ink/90 px-5 pb-5 pt-5 backdrop-blur-md md:-mx-10 md:px-10">
      <div className="mb-3 flex items-center justify-between gap-4 text-sm">
        <span className="text-v3-mute">{label}</span>
        <span className="tabular-nums text-v3-light">{percentLabel ?? `${Math.round(clamped)}%`}</span>
      </div>
      <div
        className="relative h-px bg-v3-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
      >
        <motion.div
          className="absolute inset-y-0 start-0 w-full origin-left bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.7)] rtl:origin-right"
          initial={false}
          animate={{ scaleX: clamped / 100 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
        />
      </div>
      {title && (
        <h2 className="mt-6 font-v3-display text-3xl font-light leading-tight rtl:leading-snug">{title}</h2>
      )}
    </div>
  )
}

// ── Questions ─────────────────────────────────────────────────────────────

/** One question: its number, its text, then its answers. */
export function QuestionBlock({
  index,
  text,
  hint,
  children,
  id,
}: {
  index?: ReactNode
  text: ReactNode
  hint?: ReactNode
  children: ReactNode
  id?: string
}) {
  const autoId = useId()
  const labelId = id ?? `${autoId}-q`
  return (
    <StepIn className="flex flex-col gap-5 border-b border-v3-line/60 py-8">
      <h3 id={labelId} className="text-lg leading-relaxed text-v3-bone md:text-xl rtl:leading-loose">
        {index !== undefined && <span className="me-3 font-v3-display text-v3-mute">{index}</span>}
        {text}
      </h3>
      {hint && <p className="-mt-2 text-sm text-v3-mute">{hint}</p>}
      <div data-labelledby={labelId}>{children}</div>
    </StepIn>
  )
}

export type ScaleOption<T extends string | number = number> = {
  value: T
  label: ReactNode
  /** Shown large above the label, e.g. the number on a 1–5 scale. */
  mark?: ReactNode
  description?: ReactNode
}

/**
 * A set of answers that behaves as a radio group: one tab stop, arrow keys
 * move the choice, Space/Enter select. `layout="scale"` lays them out as a
 * row of equal cells (1–5 scales); `layout="list"` stacks them (choices
 * with longer text).
 */
export function ScaleOptions<T extends string | number>({
  options,
  value,
  onChange,
  label,
  layout = "scale",
}: {
  options: ScaleOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  label: string
  layout?: "scale" | "list"
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const selectedIndex = options.findIndex((o) => o.value === value)
  const focusIndex = selectedIndex === -1 ? 0 : selectedIndex

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
    const next = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const j = (i + next + options.length) % options.length
    onChange(options[j].value)
    refs.current[j]?.focus()
  }

  const grid =
    layout === "scale"
      ? `grid grid-cols-1 gap-2 sm:gap-3 ${options.length === 5 ? "sm:grid-cols-5" : options.length === 4 ? "sm:grid-cols-4" : options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`
      : "flex flex-col gap-2"

  return (
    <div role="radiogroup" aria-label={label} className={grid}>
      {options.map((o, i) => {
        const selected = o.value === value
        return (
          <button
            key={String(o.value)}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={i === focusIndex ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light ${
              layout === "scale" ? "sm:flex-col sm:justify-center sm:text-center" : ""
            } ${
              selected
                ? "border-v3-light bg-v3-light/10 text-v3-bone shadow-[0_0_30px_-12px_rgba(232,196,138,0.8)]"
                : "border-v3-line bg-v3-raise text-v3-soft hover:border-v3-mute hover:text-v3-bone"
            }`}
          >
            {o.mark !== undefined && (
              <span className={`font-v3-display text-2xl leading-none ${selected ? "text-v3-light" : "text-v3-mute"}`}>{o.mark}</span>
            )}
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium leading-snug">{o.label}</span>
              {o.description && <span className="text-xs leading-relaxed text-v3-mute">{o.description}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Lead form fields ──────────────────────────────────────────────────────

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  error?: ReactNode
  hint?: ReactNode
}

/** A labelled input in v3. Pass dir="ltr" for email/url/phone on Persian pages. */
export function ToolField({ label, error, hint, id, className, ...rest }: FieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errId = `${inputId}-err`
  return (
    <div className="flex flex-col gap-2 text-start">
      <label htmlFor={inputId} className="text-sm font-medium text-v3-soft">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`h-14 w-full rounded-xl border bg-v3-raise px-4 text-base text-v3-bone placeholder:text-v3-mute/70 transition-colors focus:outline-none focus:ring-2 focus:ring-v3-light/70 ${
          error ? "border-v3-light" : "border-v3-line focus:border-v3-light/60"
        } ${className ?? ""}`}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-v3-mute">{hint}</p>}
      {error && (
        <p id={errId} className="text-sm text-v3-light">
          {error}
        </p>
      )}
    </div>
  )
}

/** The card that frames the lead step and similar focused moments. */
export function ToolPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <StepIn
      className={`rounded-3xl border border-v3-line/80 bg-v3-raise p-7 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.35)] md:p-10 ${className ?? ""}`}
    >
      {children}
    </StepIn>
  )
}

// ── Results ───────────────────────────────────────────────────────────────

/**
 * The headline score: a ring of light that fills to the score while the
 * number counts up. The final number is rendered immediately for reduced
 * motion and for anything that reads the DOM.
 */
export function ScoreRing({
  score,
  max = 100,
  label,
  format = (n) => String(n),
}: {
  score: number
  max?: number
  label?: ReactNode
  format?: (n: number) => string
}) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? score : 0)
  const r = 46
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, score / max))

  useEffect(() => {
    if (reduce) {
      setShown(score)
      return
    }
    const controls = animate(0, score, { duration: 1.6, ease: ARRIVE, onUpdate: (v) => setShown(Math.round(v)) })
    return () => controls.stop()
  }, [score, reduce])

  return (
    <div className="relative mx-auto size-56 md:size-64">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="2" className="stroke-v3-line" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-v3-light"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - pct) : c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: reduce ? 0 : 1.6, ease: ARRIVE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="font-v3-display text-6xl font-light tabular-nums" dir="ltr">
          {format(shown)}
        </span>
        <span className="text-sm text-v3-mute" dir="ltr">
          / {format(max)}
        </span>
        {label && <span className="mt-1 text-sm text-v3-soft">{label}</span>}
      </div>
    </div>
  )
}

/** A labelled bar that fills when scrolled into view (category breakdowns). */
export function Meter({
  label,
  value,
  max = 100,
  display,
}: {
  label: ReactNode
  value: number
  max?: number
  /** The text on the right, e.g. "12 / 20". Defaults to "value / max". */
  display?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  const reduce = useReducedMotion()
  const pct = Math.max(0, Math.min(1, max ? value / max : 0))
  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-4">
        <span className="text-v3-bone">{label}</span>
        <span className="shrink-0 text-sm tabular-nums text-v3-soft" dir="ltr">
          {display ?? `${value} / ${max}`}
        </span>
      </div>
      <div className="relative h-1 overflow-hidden rounded-full bg-v3-line">
        <motion.div
          className="absolute inset-y-0 start-0 w-full origin-left rounded-full bg-v3-light rtl:origin-right"
          initial={{ scaleX: reduce ? pct : 0 }}
          animate={{ scaleX: inView || reduce ? pct : 0 }}
          transition={{ duration: reduce ? 0 : 1.1, ease: ARRIVE }}
        />
      </div>
    </div>
  )
}

/**
 * A result list block. `tone="strength"` marks items with the light;
 * `tone="risk"` with a hollow mark — told apart by shape as well as
 * brightness, never by red/green.
 */
export function ResultList({
  title,
  items,
  tone = "strength",
}: {
  title: ReactNode
  items: { title?: ReactNode; body?: ReactNode }[]
  tone?: "strength" | "risk" | "neutral"
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-v3-line/80 p-7 md:p-8">
      <h3 className="font-v3-display text-2xl font-light">{title}</h3>
      <ul className="flex flex-col">
        {items.map((it, i) => (
          <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 last:border-b-0">
            <span
              aria-hidden
              className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                tone === "strength"
                  ? "bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)]"
                  : tone === "risk"
                    ? "border border-v3-light"
                    : "bg-v3-mute"
              }`}
            />
            <span className="flex flex-col gap-1">
              {it.title && <span className="font-medium text-v3-bone">{it.title}</span>}
              {it.body && <span className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{it.body}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
