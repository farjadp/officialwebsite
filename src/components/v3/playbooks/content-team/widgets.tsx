"use client"

// ============================================================================
// File Path: src/components/v3/playbooks/content-team/widgets.tsx
// Why: The interactive parts of playbook 01. The page is a server component
//      so every sentence is in the HTML; these run in the browser, render a
//      complete default state on the server and respect reduced motion.
//      Colours are v3 theme tokens, so they follow the light/dark switch.
//
//      - PipelineMap: the six stages and the approval gate after each.
//      - PipelineBuilder: pick what you make, get your tools, keys and prompt.
//      - CodeBlock / PromptBox: copyable commands and prompts.
//      - CompareTable: the nine tools, filterable by cost.
//      - CameraMoves: 24 small scenes, each playing its own move.
//      - RunChecklist: the first-run list, ticks kept in localStorage.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { motion, useInView, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { COPY } from "./copy"
import {
  MOVES,
  NEEDS,
  PREREQS,
  STAGES,
  TOOL,
  TOOLS,
  type CostKind,
  type LangChoice,
  type MoveAnim,
  type MoveGroup,
  type NeedId,
  type StageId,
  type ToolId,
} from "./data"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"

function useCopy(text: string) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return { copied, copy }
}

// ── Copyable code ───────────────────────────────────────────────────────────

/** A command or two, left to right, with a copy button. */
export function CodeBlock({ code, locale, label }: { code: string; locale: Locale; label?: string }) {
  const { copied, copy } = useCopy(code)
  const t = COPY[locale].builder
  return (
    <div className="overflow-hidden rounded-xl border border-v3-line/80 bg-v3-raise">
      <div className="flex items-center justify-between gap-3 border-b border-v3-line/60 px-4 py-2">
        <span className="text-xs text-v3-mute">{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs text-v3-soft transition-colors hover:text-v3-light"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copied ? t.copied : locale === "fa" ? "کپی" : "Copy"}
        </button>
      </div>
      <pre dir="ltr" className={`overflow-x-auto px-4 py-4 text-left font-mono text-[13px] leading-relaxed text-v3-bone ${LATIN}`}>
        <code className="font-mono!">{code}</code>
      </pre>
    </div>
  )
}

/**
 * Persian text with commands and names inside it. Each Latin run is isolated
 * left to right and set in the Latin face: the Persian font draws Latin
 * digits as Persian ones, which would turn "last30days" into a command that
 * does not exist.
 */
const LATIN_RUN = /([A-Za-z0-9~/.@:_\-+=→"'*]+(?:[ ]+[A-Za-z0-9~/.@:_\-+=→"'*]+)*)/

export function Mixed({ text, locale }: { text: string; locale: Locale }) {
  if (locale !== "fa") return <>{text}</>
  return (
    <>
      {text.split(LATIN_RUN).map((part, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr" className="font-(family-name:--font-instrument)!">
            {part}
          </bdi>
        ) : (
          part
        ),
      )}
    </>
  )
}

/** A long prompt: folded to a few lines until opened, always copyable whole. */
export function PromptBox({ text, locale, title }: { text: string; locale: Locale; title: string }) {
  const { copied, copy } = useCopy(text)
  const [open, setOpen] = useState(false)
  const t = COPY[locale].builder
  return (
    <div className="overflow-hidden rounded-2xl border border-v3-light/40 bg-v3-raise shadow-[0_0_60px_-30px_rgb(var(--v3-glow)/0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-v3-line/60 px-5 py-3">
        <span className="text-sm text-v3-light">{title}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-v3-bone px-5 text-sm font-semibold text-v3-ink transition-colors hover:bg-v3-light"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <div className="relative">
        <pre
          className={`whitespace-pre-wrap px-5 py-5 font-v3-body text-[15px] leading-relaxed text-v3-soft rtl:leading-loose ${open ? "" : "max-h-72 overflow-hidden"}`}
        >
          {text.split("\n").map((line, i) => (
            <span key={i} className="block min-h-[1lh]">
              <Mixed text={line} locale={locale} />
            </span>
          ))}
        </pre>
        {!open && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-v3-raise to-transparent" />}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full border-t border-v3-line/60 px-5 py-3 text-sm text-v3-soft transition-colors hover:text-v3-light"
      >
        {open ? (locale === "fa" ? "بستن" : "Collapse") : locale === "fa" ? "نمایش کامل" : "Show all"}
      </button>
    </div>
  )
}

// ── 1. The pipeline map ─────────────────────────────────────────────────────

export function PipelineMap({ locale }: { locale: Locale }) {
  const t = COPY[locale].map
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: "-10% 0px" })
  const reduce = useReducedMotion()

  return (
    <div ref={ref} className="flex flex-col gap-6">
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
        {STAGES.map((s, i) => {
          const st = t.stages[s.id]
          const last = i === STAGES.length - 1
          return (
            <li key={s.id} className="relative flex items-stretch lg:flex-col lg:pe-6 lg:last:pe-0">
              <a
                href={`#stage-${s.id}`}
                className="group relative z-10 flex w-full flex-col gap-2 rounded-2xl border border-v3-line/80 bg-v3-raise p-5 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 lg:h-full"
              >
                <span className="font-v3-display text-4xl font-light tabular-nums text-v3-light">{localDigits(i + 1, locale)}</span>
                <span className="text-lg text-v3-bone">{st.name}</span>
                <span className="text-sm leading-relaxed text-v3-mute">{st.does}</span>
                <span className="mt-auto flex flex-wrap gap-1 pt-2" dir="ltr">
                  {s.tools.map((id) => (
                    <span key={id} className={`rounded-full border border-v3-line px-2 py-0.5 text-[11px] text-v3-soft ${LATIN}`}>
                      {TOOL[id].name}
                    </span>
                  ))}
                </span>
              </a>
              {/* The gate after the stage: a diamond of light the pulse passes through. */}
              {!last && (
                <span aria-hidden className="absolute end-1.5 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
                  <motion.span
                    className="block h-3 w-3 rotate-45 border border-v3-light bg-v3-ink"
                    animate={inView && !reduce ? { boxShadow: ["0 0 0 rgb(var(--v3-glow)/0)", "0 0 18px rgb(var(--v3-glow)/0.9)", "0 0 0 rgb(var(--v3-glow)/0)"] } : undefined}
                    transition={{ duration: 6, repeat: Infinity, delay: (i + 1) * 1, times: [0, 0.08, 0.2] }}
                  />
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {/* The line under the stages that fills as the work moves through them. */}
      <div className="relative hidden h-px w-full bg-v3-line lg:block">
        <motion.div
          className="absolute inset-0 origin-left bg-v3-light shadow-[0_0_12px_rgb(var(--v3-glow)/0.8)] rtl:origin-right"
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={inView && !reduce ? { scaleX: [0, 1, 1], opacity: [1, 1, 0] } : { scaleX: 1 }}
          transition={{ duration: 6, repeat: Infinity, times: [0, 0.85, 1], ease: "linear" }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-v3-mute">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="block h-2.5 w-2.5 rotate-45 border border-v3-light" />
          {t.gate}
        </span>
        <span>{t.hint}</span>
      </div>
    </div>
  )
}

// ── 2. The pipeline builder ─────────────────────────────────────────────────

const ORDER: ToolId[] = ["last30days", "marketingskills", "humanizer", "baoyu", "slides", "hyperframes", "videouse", "elevenlabs", "postiz"]

export function PipelineBuilder({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const t = c.builder
  const fa = locale === "fa"
  const [needs, setNeeds] = useState<Set<NeedId>>(() => new Set<NeedId>(["posts", "visuals", "carousel", "schedule"]))
  const [lang, setLang] = useState<LangChoice>(fa ? "fa" : "en")

  const toggle = (id: NeedId) =>
    setNeeds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const result = useMemo(() => {
    const ids = new Set<ToolId>(["last30days"])
    for (const n of NEEDS) if (needs.has(n.id)) n.tools.forEach((x) => ids.add(x))
    // humanizer only earns its place on English text.
    if (needs.has("posts") && lang !== "fa") ids.add("humanizer")
    const tools = ORDER.filter((id) => ids.has(id)).map((id) => TOOL[id])
    const keys = new Set<string>()
    for (const tool of tools) for (const k of tool.keys) keys.add(k === "OPENAI_API_KEY" ? t.imageKey : k)
    const software = new Set<string>(["claude"])
    for (const tool of tools) tool.needs.forEach((n) => software.add(n))
    const stages = STAGES.filter((s) => s.tools.some((id) => ids.has(id))).map((s) => s.id)
    return { tools, keys: [...keys], software: PREREQS.filter((p) => software.has(p.id)), stages }
  }, [needs, lang, t.imageKey])

  const prompt = useMemo(() => {
    const p = t.prompt
    const lines: string[] = [p.intro, "", p.chosen]
    for (const tool of result.tools) lines.push(`- ${tool.name}: ${tool.install.split("\n").join(" → ")}`)
    lines.push("", p.prereq)
    for (const s of result.software) lines.push(`- ${s.name} (${s.check})`)
    lines.push("", p.security, "", p.keys)
    if (result.keys.length) for (const k of result.keys) lines.push(`- ${k}`)
    lines.push("", p.restart, "", p.style(result.tools.some((x) => x.id === "humanizer")), "", p.trial)
    // The trial run lists only the stages this pipeline has.
    const trialStages: StageId[] = result.stages.includes("write") ? result.stages : [...result.stages]
    if (!trialStages.includes("write")) trialStages.splice(1, 0, "write")
    trialStages.forEach((s, i) => {
      const step = p.trialSteps[s]
      if (step) lines.push(`${i + 1}. ${step}`)
    })
    lines.push("", p.rule)
    return lines.join("\n")
  }, [result, t.prompt])

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
      <div className="flex min-w-0 flex-col gap-8 lg:col-span-5">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm text-v3-mute">{t.makeLabel}</legend>
          <label className="flex cursor-default items-center gap-3 rounded-xl border border-v3-line/60 px-4 py-3 opacity-80">
            <span aria-hidden className="grid h-5 w-5 place-items-center rounded-md bg-v3-light text-v3-ink">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="flex flex-col">
              <span className="text-v3-bone">{c.map.stages.topic.name}</span>
              <span className="text-xs text-v3-mute">{t.always}</span>
            </span>
          </label>
          {NEEDS.map((n) => {
            const on = needs.has(n.id)
            return (
              <label
                key={n.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300 ${on ? "border-v3-light/60 bg-v3-raise" : "border-v3-line/60 hover:border-v3-line"}`}
              >
                <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggle(n.id)} />
                <span
                  aria-hidden
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-v3-light ${on ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-mute"}`}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="flex flex-col">
                  <span className="text-v3-bone">{n.label[locale]}</span>
                  <span className="text-xs text-v3-mute">{n.hint[locale]}</span>
                </span>
              </label>
            )
          })}
        </fieldset>
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm text-v3-mute">{t.langLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {(["fa", "en", "both"] as const).map((l) => (
              <label
                key={l}
                className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-v3-light ${lang === l ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light"}`}
              >
                <input type="radio" name="pb-lang" className="sr-only" checked={lang === l} onChange={() => setLang(l)} />
                {t.langs[l]}
              </label>
            ))}
          </div>
          {lang === "fa" && needs.has("posts") && <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.styleNote}</p>}
        </fieldset>
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
        <div className="grid gap-6 rounded-2xl border border-v3-line/80 p-6 md:grid-cols-2 md:p-8">
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-sm text-v3-mute">{t.toolsTitle}</h3>
              <span className="text-sm text-v3-light">{t.approvals(result.stages.length)}</span>
            </div>
            <ol className="flex flex-wrap gap-2" dir="ltr">
              {result.tools.map((tool) => (
                <motion.li
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: ARRIVE }}
                  className={`rounded-full border border-v3-light/50 bg-v3-raise px-3 py-1.5 text-sm text-v3-bone ${LATIN}`}
                >
                  {tool.name}
                </motion.li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm text-v3-mute">{t.keysTitle}</h3>
            {result.keys.length ? (
              <ul className="flex flex-col gap-1.5">
                {result.keys.map((k) => (
                  <li key={k} className="text-sm text-v3-bone">
                    <bdi>{k}</bdi>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-v3-soft">{t.noKeys}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm text-v3-mute">{t.softwareTitle}</h3>
            <ul className="flex flex-wrap gap-2" dir="ltr">
              {result.software.map((s) => (
                <li key={s.id} className={`rounded-full border border-v3-line px-3 py-1 text-xs text-v3-soft ${LATIN}`}>
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <PromptBox text={prompt} locale={locale} title={t.promptTitle} />
      </div>
    </div>
  )
}

// ── 3. The comparison table ─────────────────────────────────────────────────

export function CompareTable({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const t = c.compare
  const [filter, setFilter] = useState<"all" | CostKind>("all")
  const rows = TOOLS.filter((x) => filter === "all" || x.cost === filter)
  const stars = (k: number) => (locale === "fa" ? localDigits(k < 1 ? k.toFixed(2) : k.toFixed(1), "fa").replace(".", "٫") : k < 1 ? k.toFixed(2) : k.toFixed(1))

  return (
    <div className="flex flex-col gap-6">
      <div role="radiogroup" aria-label={t.title} className="flex flex-wrap gap-2">
        {(["all", "free", "key", "paid"] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={filter === f}
            onClick={() => setFilter(f)}
            className={`min-h-11 rounded-full border px-5 text-sm transition-colors ${filter === f ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-light"}`}
          >
            {t.filters[f]}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-v3-line/80">
        <table className="w-full min-w-[760px] text-start text-sm">
          <thead>
            <tr className="border-b border-v3-line/80 text-v3-mute">
              {t.head.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 text-start font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((tool) => (
              <tr key={tool.id} className="border-b border-v3-line/50 last:border-b-0">
                <th scope="row" className="px-4 py-4 text-start font-normal">
                  <a href={tool.href} target="_blank" rel="noopener noreferrer" className={`text-v3-bone underline decoration-v3-line underline-offset-4 hover:text-v3-light ${LATIN}`} dir="ltr">
                    {tool.name}
                  </a>
                </th>
                <td className="px-4 py-4 text-v3-soft">{c.map.stages[tool.stage].name}</td>
                <td className="px-4 py-4 text-v3-soft">{tool.role[locale]}</td>
                <td className="px-4 py-4 tabular-nums text-v3-bone">{stars(tool.stars)}</td>
                <td className={`px-4 py-4 text-v3-mute ${LATIN}`} dir="ltr">
                  {tool.license}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`me-2 inline-block rounded-full px-2.5 py-0.5 text-xs ${tool.cost === "free" ? "bg-v3-light text-v3-ink" : tool.cost === "key" ? "border border-v3-light text-v3-light" : "bg-v3-bone text-v3-ink"}`}
                  >
                    {t.costLabels[tool.cost]}
                  </span>
                  <span className="text-v3-soft">{tool.costNote[locale]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.flagsNote}</p>
    </div>
  )
}

// ── 4. Camera moves ─────────────────────────────────────────────────────────

type Anim = Partial<Record<"world" | "bg" | "subject" | "fg" | "ball" | "sun" | "night" | "a" | "b" | "flash" | "wipe" | "head", TargetAndTransition>>

const LOOP = (duration: number, extra?: Transition): Transition => ({ duration, repeat: Infinity, ease: "easeInOut", ...extra })

/** Keyframes for each move. Each layer of the little scene gets its own. */
const ANIMS: Record<MoveAnim, Anim> = {
  pan: { world: { x: [0, -40, -40, 0], transition: LOOP(4, { times: [0, 0.45, 0.6, 1] }) } },
  tilt: { world: { y: [0, 22, 22, 0], transition: LOOP(4, { times: [0, 0.45, 0.6, 1] }) } },
  dollyIn: {
    subject: { scale: [1, 1.7, 1.7, 1], transition: LOOP(4, { times: [0, 0.6, 0.8, 1] }) },
    bg: { scale: [1, 1.12, 1.12, 1], transition: LOOP(4, { times: [0, 0.6, 0.8, 1] }) },
    fg: { scale: [1, 2.2, 2.2, 1], x: [0, -30, -30, 0], transition: LOOP(4, { times: [0, 0.6, 0.8, 1] }) },
  },
  zoom: { world: { scale: [1, 1.7, 1.7, 1], transition: LOOP(4, { times: [0, 0.6, 0.8, 1] }) } },
  tracking: {
    bg: { x: [0, -60], transition: { duration: 3, repeat: Infinity, ease: "linear" } },
    fg: { x: [40, -160], transition: { duration: 1.6, repeat: Infinity, ease: "linear" } },
    subject: { y: [0, -2, 0], transition: { duration: 0.4, repeat: Infinity } },
  },
  orbit: {
    bg: { x: [0, -50, 0], transition: LOOP(5) },
    subject: { scaleX: [1, 0.55, 1], transition: LOOP(5) },
    fg: { x: [0, 60, 0], transition: LOOP(5) },
  },
  crane: { world: { y: [0, 26, 26, 0], scale: [1, 0.82, 0.82, 1], transition: LOOP(5, { times: [0, 0.55, 0.75, 1] }) } },
  dollyZoom: {
    bg: { scale: [1, 1.9, 1.9, 1], transition: LOOP(4, { times: [0, 0.6, 0.8, 1] }) },
    fg: { scale: [1, 1.6, 1.6, 1], transition: LOOP(4, { times: [0, 0.6, 0.8, 1] }) },
  },
  rackFocus: {
    fg: { filter: ["blur(0px)", "blur(0px)", "blur(3px)", "blur(3px)", "blur(0px)"], transition: LOOP(5, { times: [0, 0.3, 0.45, 0.8, 0.95] }) },
    bg: { filter: ["blur(3px)", "blur(3px)", "blur(0px)", "blur(0px)", "blur(3px)"], transition: LOOP(5, { times: [0, 0.3, 0.45, 0.8, 0.95] }) },
    subject: { filter: ["blur(3px)", "blur(3px)", "blur(0px)", "blur(0px)", "blur(3px)"], transition: LOOP(5, { times: [0, 0.3, 0.45, 0.8, 0.95] }) },
  },
  handheld: {
    world: {
      x: [0, 1.5, -1, 2, -1.5, 0.5, 0],
      y: [0, -1, 1.5, -0.5, 1, -1.5, 0],
      rotate: [0, 0.6, -0.4, 0.5, -0.6, 0.2, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  fpv: {
    world: { scale: [1, 2.6], y: [0, -6], opacity: [1, 1, 0], transition: { duration: 1.6, repeat: Infinity, ease: "easeIn", times: [0, 0.85, 1] } },
  },
  dutch: { world: { rotate: [0, -13, -13, 0], transition: LOOP(4, { times: [0, 0.3, 0.8, 1] }) } },
  slowmo: { ball: { x: [0, 110], transition: { duration: 5, repeat: Infinity, ease: "linear" } } },
  speedRamp: { ball: { x: [0, 70, 110], transition: { duration: 3.4, repeat: Infinity, ease: "easeOut", times: [0, 0.18, 1] } } },
  timelapse: {
    sun: { x: [-70, 0, 70], y: [30, -6, 30], transition: { duration: 3, repeat: Infinity, ease: "linear" } },
    night: { opacity: [0.75, 0, 0.75], transition: { duration: 3, repeat: Infinity, ease: "linear" } },
    subject: { opacity: [0.6, 1, 0.6], transition: { duration: 3, repeat: Infinity, ease: "linear" } },
  },
  freeze: {
    ball: { x: [0, 55, 55, 110], transition: { duration: 3.6, repeat: Infinity, ease: "linear", times: [0, 0.3, 0.7, 1] } },
    flash: { opacity: [0, 0, 0.55, 0.12, 0.12, 0, 0], transition: { duration: 3.6, repeat: Infinity, times: [0, 0.29, 0.31, 0.36, 0.69, 0.71, 1] } },
  },
  jumpCut: {
    subject: {
      x: [-28, -28, 6, 6, 30, 30, -28],
      transition: { duration: 2.4, repeat: Infinity, ease: "linear", times: [0, 0.32, 0.33, 0.65, 0.66, 0.99, 1] },
    },
  },
  matchCut: {
    a: { opacity: [1, 1, 0, 0, 1], transition: { duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.49, 0.5, 0.99, 1] } },
    b: { opacity: [0, 0, 1, 1, 0], transition: { duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.49, 0.5, 0.99, 1] } },
  },
  whipPan: {
    world: { x: [0, 0, -160, -160, 0], transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.5, 0.95, 1] } },
    flash: { opacity: [0, 0, 0.35, 0, 0], transition: { duration: 3.2, repeat: Infinity, times: [0, 0.38, 0.43, 0.5, 1] } },
  },
  dissolve: {
    a: { opacity: [1, 1, 0, 0, 1], transition: LOOP(4, { times: [0, 0.3, 0.6, 0.9, 1] }) },
    b: { opacity: [0, 0, 1, 1, 0], transition: LOOP(4, { times: [0, 0.3, 0.6, 0.9, 1] }) },
  },
  wipe: { wipe: { width: [0, 0, 160, 160, 0], transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.6, 0.95, 1] } } },
  smashCut: {
    a: { opacity: [1, 1, 0, 0, 1], transition: { duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.6, 0.601, 0.99, 1] } },
    b: { opacity: [0, 0, 1, 1, 0], scale: [1.15, 1.15, 1, 1, 1.15], transition: { duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.6, 0.65, 0.99, 1] } },
    head: { y: [0, -1.5, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
  },
  // J and L cuts are drawn as an edit timeline, not a scene: see Timeline.
  jCut: {},
  lCut: {},
}

/** Theme-aware fills. */
const F = {
  sky: "fill-v3-raise",
  hill: "fill-v3-line",
  ground: "fill-v3-line/70",
  sun: "fill-v3-light",
  body: "fill-v3-bone",
  soft: "fill-v3-soft",
  mute: "fill-v3-mute",
  ink: "fill-v3-ink",
}

const ORIGIN = { transformBox: "view-box", transformOrigin: "80px 50px" } as const
const SELF = { transformBox: "fill-box", transformOrigin: "center" } as const

/** The day scene: a hill line, the sun, a person, a cup in the foreground. */
function DayScene({ a, play, wide }: { a: Anim; play: boolean; wide?: boolean }) {
  const go = (k: keyof Anim) => (play ? a[k] : undefined)
  return (
    <>
      <rect x={-200} y={-100} width={560} height={300} className={F.sky} />
      <motion.g style={ORIGIN} animate={go("bg")}>
        <motion.circle cx={118} cy={30} r={9} className={F.sun} style={SELF} animate={go("sun")} />
        <path d="M-120 72 Q -60 50 0 66 T 120 60 T 240 66 T 360 62 L 360 120 L -120 120 Z" className={F.hill} />
        {wide && <path d="M-120 78 Q 20 66 140 76 T 360 74 L 360 120 L -120 120 Z" className={F.mute} opacity={0.25} />}
      </motion.g>
      <rect x={-200} y={80} width={560} height={40} className={F.ground} />
      <motion.g style={SELF} animate={go("subject")}>
        <circle cx={80} cy={47} r={6.5} className={F.body} />
        <rect x={72} y={55} width={16} height={24} rx={7} className={F.body} />
      </motion.g>
      <motion.g style={SELF} animate={go("fg")}>
        <rect x={26} y={68} width={11} height={13} rx={2} className={F.soft} />
        <path d="M37 71 q 5 2 0 6" className="fill-none stroke-v3-soft" strokeWidth={1.6} />
      </motion.g>
    </>
  )
}

/** The night scene used as "the next shot": buildings and a moon. */
function NightScene({ x = 0, clock }: { x?: number; clock?: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={0} width={160} height={100} className={F.ink} />
      {clock ? (
        <g>
          <circle cx={80} cy={48} r={20} className="fill-none stroke-v3-light" strokeWidth={2} />
          <path d="M80 48 L80 34 M80 48 L91 54" className="stroke-v3-bone" strokeWidth={2} strokeLinecap="round" />
        </g>
      ) : (
        <>
          <circle cx={40} cy={26} r={7} className={F.body} />
          <rect x={70} y={40} width={18} height={60} className={F.mute} />
          <rect x={92} y={28} width={22} height={72} className={F.soft} />
          <rect x={118} y={50} width={16} height={50} className={F.mute} />
          {[0, 1, 2].map((r) => (
            <rect key={r} x={98} y={36 + r * 12} width={4} height={5} className={F.sun} />
          ))}
        </>
      )}
    </g>
  )
}

/** J-cut and L-cut as a two-track edit: picture above, sound below, a playhead. */
function Timeline({ kind, play, locale }: { kind: "jCut" | "lCut"; play: boolean; locale: Locale }) {
  // The picture cuts at 80. In a J-cut shot B's sound starts early (at 56);
  // in an L-cut shot A's sound runs on past the cut (to 104).
  const audioSplit = kind === "jCut" ? 56 : 104
  const fa = locale === "fa"
  return (
    <>
      <rect x={0} y={0} width={160} height={100} className={F.sky} />
      <text x={8} y={22} className={`${F.mute} text-[7px]`}>{fa ? "تصویر" : "picture"}</text>
      <rect x={8} y={26} width={72} height={18} rx={3} className={F.soft} />
      <rect x={80} y={26} width={72} height={18} rx={3} className={F.sun} />
      <text x={40} y={38} textAnchor="middle" className={`${F.ink} text-[8px]`}>A</text>
      <text x={116} y={38} textAnchor="middle" className={`${F.ink} text-[8px]`}>B</text>
      <text x={8} y={60} className={`${F.mute} text-[7px]`}>{fa ? "صدا" : "sound"}</text>
      <rect x={8} y={64} width={audioSplit - 8} height={18} rx={3} className={F.soft} opacity={0.55} />
      <rect x={audioSplit} y={64} width={152 - audioSplit} height={18} rx={3} className={F.sun} opacity={0.55} />
      {Array.from({ length: 24 }).map((_, i) => {
        const x = 11 + i * 6
        const h = 3 + ((i * 7) % 9)
        return <rect key={i} x={x} y={73 - h / 2} width={2} height={h} rx={1} className={F.ink} opacity={0.5} />
      })}
      <line x1={80} y1={22} x2={80} y2={86} className="stroke-v3-bone" strokeDasharray="2 2" strokeWidth={0.8} />
      <motion.line
        y1={20}
        y2={88}
        x1={8}
        x2={8}
        className="stroke-v3-light"
        strokeWidth={1.6}
        animate={play ? { x1: [8, 152], x2: [8, 152] } : undefined}
        transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
      />
    </>
  )
}

function MoveScene({ anim, play, locale }: { anim: MoveAnim; play: boolean; locale: Locale }) {
  const a = ANIMS[anim]
  // One card per move, so the move names the clip path.
  const clip = `pb-wipe-${anim}`
  const go = (k: keyof Anim) => (play ? a[k] : undefined)

  if (anim === "jCut" || anim === "lCut") return <Timeline kind={anim} play={play} locale={locale} />

  const ball = anim === "slowmo" || anim === "speedRamp" || anim === "freeze"
  const two = anim === "matchCut" || anim === "dissolve" || anim === "smashCut"

  return (
    <>
      <defs>
        <clipPath id={clip}>
          <motion.rect x={0} y={0} height={100} width={0} animate={go("wipe")} />
        </clipPath>
      </defs>
      <motion.g style={ORIGIN} animate={go("world")}>
        {two ? (
          <>
            <motion.g animate={go("a")}>
              {anim === "matchCut" ? (
                <>
                  <rect x={0} y={0} width={160} height={100} className={F.sky} />
                  <rect x={0} y={78} width={160} height={22} className={F.ground} />
                  <ellipse cx={80} cy={48} rx={20} ry={20} className="fill-none stroke-v3-soft" strokeWidth={2} />
                  <rect x={60} y={48} width={40} height={30} rx={4} className={F.soft} opacity={0.6} />
                </>
              ) : (
                <motion.g animate={go("head")}>
                  <DayScene a={{}} play={false} />
                </motion.g>
              )}
            </motion.g>
            <motion.g animate={go("b")} initial={{ opacity: 0 }} style={ORIGIN}>
              <NightScene clock={anim === "matchCut"} />
            </motion.g>
          </>
        ) : (
          <>
            <DayScene a={a} play={play} wide={anim === "pan" || anim === "tracking" || anim === "orbit"} />
            {anim === "whipPan" && <NightScene x={160} />}
            {ball && (
              <motion.circle cx={24} cy={70} r={5} className={F.sun} animate={go("ball")} />
            )}
            {anim === "timelapse" && <motion.rect x={-200} y={-100} width={560} height={300} className={F.ink} animate={go("night")} initial={{ opacity: 0.4 }} style={{ mixBlendMode: "multiply" }} />}
          </>
        )}
      </motion.g>
      {anim === "wipe" && (
        <g clipPath={`url(#${clip})`}>
          <NightScene />
        </g>
      )}
      {anim === "wipe" && <motion.rect y={0} height={100} width={1.5} className={F.sun} animate={play ? { x: [0, 0, 160, 160, 0] } : undefined} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.6, 0.95, 1] }} />}
      {(anim === "freeze" || anim === "whipPan") && <motion.rect x={0} y={0} width={160} height={100} className={F.body} initial={{ opacity: 0 }} animate={go("flash")} />}
      {anim === "slowmo" && (
        <text x={150} y={14} textAnchor="end" className={`${F.mute} text-[8px]`}>
          0.25×
        </text>
      )}
    </>
  )
}

function MoveCard({ move, locale }: { move: (typeof MOVES)[number]; locale: Locale }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: "-5% 0px" })
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const play = !reduce && (inView || hover)
  const n = MOVES.indexOf(move) + 1
  const fa = locale === "fa"

  return (
    <li
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-raise transition-colors duration-500 hover:border-v3-light/60"
    >
      <svg viewBox="0 0 160 100" className="block aspect-[16/10] w-full overflow-hidden" role="img" aria-label={`${move.term}: ${move.does[locale]}`} direction="ltr">
        <MoveScene anim={move.anim} play={play} locale={locale} />
      </svg>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className={`text-v3-bone ${LATIN}`} dir="ltr">
            {move.term}
          </span>
          <span className="text-xs tabular-nums text-v3-mute">{localDigits(n, locale)}</span>
        </div>
        {fa && move.fa !== move.term && <span className="text-sm text-v3-light">{move.fa}</span>}
        <span className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{move.does[locale]}</span>
      </div>
    </li>
  )
}

export function CameraMoves({ locale }: { locale: Locale }) {
  const t = COPY[locale].moves
  const groups: MoveGroup[] = ["camera", "time", "transition"]
  return (
    <div className="flex flex-col gap-14">
      <p className="text-sm text-v3-mute">{t.play}</p>
      {groups.map((g) => (
        <section key={g} className="flex flex-col gap-6">
          <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">{t.groups[g]}</h3>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {MOVES.filter((m) => m.group === g).map((m) => (
              <MoveCard key={m.term} move={m} locale={locale} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

// ── 5. The first-run checklist ──────────────────────────────────────────────

const STORE = "pb-content-team-checklist"

export function RunChecklist({ locale }: { locale: Locale }) {
  const t = COPY[locale].checklist
  const [done, setDone] = useState<boolean[]>(() => t.items.map(() => false))

  // Read after mount so the server HTML and the first client render agree.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE)
      if (!raw) return
      const saved = JSON.parse(raw) as unknown
      if (Array.isArray(saved)) setDone(t.items.map((_, i) => saved[i] === true))
    } catch {
      // Storage blocked or corrupt: start empty.
    }
  }, [t.items])

  const save = (next: boolean[]) => {
    setDone(next)
    try {
      window.localStorage.setItem(STORE, JSON.stringify(next))
    } catch {
      // Private mode: ticks last for this visit only.
    }
  }

  const count = done.filter(Boolean).length
  const pct = count / t.items.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-v3-light" aria-live="polite">
          {t.done(count, t.items.length)}
        </span>
        <button type="button" onClick={() => save(t.items.map(() => false))} className="min-h-11 text-sm text-v3-mute underline underline-offset-4 hover:text-v3-light">
          {t.reset}
        </button>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-v3-line">
        <motion.div
          className="h-full origin-left bg-v3-light shadow-[0_0_12px_rgb(var(--v3-glow)/0.8)] rtl:origin-right"
          animate={{ scaleX: pct }}
          initial={false}
          transition={{ duration: 0.6, ease: ARRIVE }}
        />
      </div>
      <ol className="grid gap-x-10 md:grid-cols-2">
        {t.items.map((item, i) => (
          <li key={i} className="border-b border-v3-line/60">
            <label className="flex cursor-pointer items-start gap-4 py-4">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={done[i]}
                onChange={() => save(done.map((v, j) => (j === i ? !v : v)))}
              />
              <span
                aria-hidden
                className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-v3-light ${done[i] ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-mute"}`}
              >
                {done[i] && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className={`leading-relaxed transition-colors rtl:leading-loose ${done[i] ? "text-v3-mute line-through decoration-v3-mute/60" : "text-v3-bone"}`}>
                <span className="me-2 tabular-nums text-v3-mute">{localDigits(i + 1, locale)}.</span>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** A short boxed note: "for Persian", "correction", "from experience". */
export function Note({ kind, title, children, locale }: { kind: "local" | "fix" | "lesson" | "warn"; title: string; children: ReactNode; locale?: Locale }) {
  const tone = {
    local: "border-v3-line/80 bg-v3-raise",
    fix: "border-v3-bone/40 bg-v3-raise",
    lesson: "border-v3-light/50 bg-v3-raise shadow-[0_0_60px_-30px_rgb(var(--v3-glow)/0.5)]",
    warn: "border-v3-light bg-v3-raise shadow-[0_0_80px_-30px_rgb(var(--v3-glow)/0.6)]",
  }[kind]
  return (
    <aside className={`flex flex-col gap-2 rounded-2xl border p-6 ${tone}`}>
      <span className={`text-sm ${kind === "fix" ? "text-v3-bone" : "text-v3-light"}`}>{title}</span>
      <div className="leading-relaxed text-v3-soft rtl:leading-loose">{locale && typeof children === "string" ? <Mixed text={children} locale={locale} /> : children}</div>
    </aside>
  )
}
