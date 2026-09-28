// ============================================================================
// File Path: src/components/v3/reports/fmt.ts
// Why: Number formatting for reports, in both locales. Persian gets Persian
//      digits and the Persian decimal separator (٫). Amounts are compact
//      ("$5.43T") and meant to be wrapped in an LTR-isolated element so they
//      never reorder inside Persian text.
// ============================================================================

import type { Locale } from "@/lib/nav"

export function num(v: number, locale: Locale, digits = 0): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(v)
}

/** Billions → "$5.43T", or "$780B" below a trillion. */
export function usd(billions: number, locale: Locale, digits = 2): string {
  if (billions < 1000) return `$${num(billions, locale, 0)}B`
  return `$${num(billions / 1000, locale, digits)}T`
}

export function times(x: number, locale: Locale, digits = 1): string {
  return `${num(x, locale, digits)}×`
}

export function pct(x: number, locale: Locale): string {
  return locale === "fa" ? `${num(x * 100, locale, 0)}٪` : `${num(x * 100, locale, 0)}%`
}
