// ============================================================================
// File Path: src/components/v3/reports/deep-time-pain/fmt.ts
// Why: Number and clock formatting for report 02, in both locales. A plain
//      module so the server-rendered page and the client widgets share it.
// ============================================================================

import type { Locale } from "@/lib/nav"
import { DAY_SECONDS, clockSeconds } from "./data"

const FA = "۰۱۲۳۴۵۶۷۸۹"

export function digits(s: string, locale: Locale): string {
  return locale === "fa" ? s.replace(/\d/g, (d) => FA[Number(d)]).replace(/\./g, "٫") : s
}

export function grouped(n: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 0 }).format(n)
}

/** Years as words a reader can hold: "4.54 billion", "315,000", "۳٫۲ میلیون". */
export function years(n: number, locale: Locale): string {
  const fa = locale === "fa"
  if (n >= 1e9) return `${digits((n / 1e9).toFixed(2).replace(/\.?0+$/, ""), locale)} ${fa ? "میلیارد" : "billion"}`
  if (n >= 1e6) return `${digits((n / 1e6).toFixed(n < 1e7 ? 2 : 1).replace(/\.?0+$/, ""), locale)} ${fa ? "میلیون" : "million"}`
  return grouped(Math.round(n), locale)
}

/**
 * A moment on the 24-hour clock, with only as much precision as it needs:
 * "21:21" for the lampreys, "23:59:54.3" for our species, "23:59:59.998" for
 * a single human life.
 */
export function clockTime(age: number, locale: Locale): string {
  const secs = clockSeconds(age)
  const remaining = DAY_SECONDS - secs
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const pad = (v: number) => String(v).padStart(2, "0")
  let out: string
  if (remaining >= 3600) out = `${pad(h)}:${pad(m)}`
  else if (remaining >= 60) out = `${pad(h)}:${pad(m)}:${pad(Math.floor(s))}`
  else {
    const places = remaining < 0.01 ? 3 : remaining < 1 ? 2 : 1
    const whole = Math.floor(s)
    const frac = (s - whole).toFixed(places).slice(2)
    out = `${pad(h)}:${pad(m)}:${pad(whole)}.${frac}`
  }
  return digits(out, locale)
}

