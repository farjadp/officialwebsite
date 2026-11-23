"use client"

// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/ui.tsx
// Why: Small client pieces the three parts' figures share: number formatting
//      in both locales, the radio pill, a labelled bar and the frame every
//      figure sits in. v3 tokens only; gold (v3-light) is Gen Z, the point of
//      the series; muted is the older generation it is compared with.
// Env / Identity: Client Components
// ============================================================================

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"

export const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const FA = "۰۱۲۳۴۵۶۷۸۹"
export const dg = (s: string, l: Locale) => (l === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]).replace(/\./g, "٫").replace(/,/g, "٬") : s)
export const num = (v: number, l: Locale, dp = 0) => dg(v.toFixed(dp), l)
export const pct = (v: number, l: Locale, dp = 0) => (l === "fa" ? `${num(v, l, dp)}٪` : `${v.toFixed(dp)}%`)
/** Signed, with an LRM in Persian so the sign stays in front of the number. */
export const signed = (v: number, l: Locale, dp = 1) => {
  const s = `${v > 0 ? "+" : v < 0 ? "−" : ""}${num(Math.abs(v), l, dp)}`
  return l === "fa" ? `‎${s}` : s
}
export const q = (text: string, l: Locale) => (l === "fa" ? `«${text}»` : `“${text}”`)

export function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
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

export function Figure({ children, caption, className = "" }: { children: ReactNode; caption?: string; className?: string }) {
  return (
    <figure className={`flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise/60 p-5 md:p-8 ${className}`}>
      {children}
      {caption && <figcaption className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{caption}</figcaption>}
    </figure>
  )
}

/** A horizontal bar with its value beside it. Grows from the reading start edge. */
export function Bar({ value, max, gold, label, reduce, thick }: { value: number; max: number; gold?: boolean; label: string; reduce: boolean | null; thick?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <motion.span
        initial={false}
        animate={{ width: `${Math.max((value / max) * 100, 1)}%` }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: ARRIVE }}
        className={`block shrink rounded-sm ${thick ? "h-5" : "h-3.5"} ${gold ? "bg-v3-light" : "bg-v3-mute"}`}
      />
      <span className={`shrink-0 text-xs tabular-nums ${gold ? "text-v3-light" : "text-v3-soft"}`}>{label}</span>
    </span>
  )
}

export function Legend({ items }: { items: { label: string; tone: "gold" | "mute" | "dem" | "rep" | "line" }[] }) {
  const cls = { gold: "bg-v3-light", mute: "bg-v3-mute", dem: "bg-v3-dem", rep: "bg-v3-rep", line: "bg-v3-line" }
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-v3-soft">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${cls[i.tone]}`} aria-hidden />
          {i.label}
        </li>
      ))}
    </ul>
  )
}
