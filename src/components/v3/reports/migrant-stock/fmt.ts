// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/fmt.ts
// Why: Number formatting for report 05 in both locales. Persian gets Persian
//      digits, ٫ as the decimal separator and ٪ after the number, matching
//      ../fmt.ts. Counts switch to thousands below a million so small places
//      do not read as "0.1 million".
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { CountryRow } from "./countries"

const FA = "۰۱۲۳۴۵۶۷۸۹"

export function dg(s: string, l: Locale): string {
  if (l !== "fa") return s
  return s.replace(/\d/g, (x) => FA[Number(x)]).replace(/\./g, "٫").replace(/,/g, "٬")
}

export function fx(v: number, l: Locale, dp = 1): string {
  return dg(v.toFixed(dp), l)
}

export function pc(v: number, l: Locale, dp = 1): string {
  return l === "fa" ? `${fx(v, l, dp)}٪` : `${fx(v, l, dp)}%`
}

/** 52,375,047 → "52.4 million" / "۵۲٫۴ میلیون"; under a million → "87 thousand". */
export function people(v: number, l: Locale, short = false): string {
  if (v >= 1e6) return l === "fa" ? `${fx(v / 1e6, l)} میلیون` : `${fx(v / 1e6, l)}${short ? "M" : " million"}`
  const k = Math.round(v / 1000)
  return l === "fa" ? `${dg(String(k), l)} هزار` : `${k}${short ? "k" : " thousand"}`
}

export function int(v: number, l: Locale): string {
  return dg(Math.round(v).toLocaleString("en-US"), l)
}

export function nameOf(r: CountryRow, l: Locale): string {
  return l === "fa" ? r[2] : r[1]
}
