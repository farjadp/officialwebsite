// ============================================================================
// File Path: src/lib/digits.ts
// Why: Persian digits for Persian pages. A plain module on purpose: it used
//      to live in the client-only motion file, and calling it from a server
//      component crashed /lab/perks with a 500.
// ============================================================================

import type { Locale } from "@/lib/nav"

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

export function localDigits(n: number | string, locale: Locale): string {
  const s = String(n)
  return locale === "fa" ? s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]) : s
}
