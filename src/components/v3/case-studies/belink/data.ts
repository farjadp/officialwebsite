// ============================================================================
// File: src/components/v3/case-studies/belink/data.ts
// Role: The aggregate figures behind the Belink case study.
// Why:  Counted once from Farjad's 2026 snapshot of belink.ir's public company
//       profiles (13,636 rows; the raw file is private and not in this repo). ONLY totals and shares live
//       here — no company, person, email, phone or address is ever published.
//       The row-level panel stays private.
// Method: a field counts as present when it is non-empty. Founding years
//       outside 1970–2026 (Persian-calendar entries and typos) are dropped,
//       leaving 10,199 valid years. Sector is Belink's own "main field".
//       City is NOT reported: most addresses omit the city.
// ============================================================================

export const TOTAL = 13_636
export const UNIQUE_NAMES = 13_415

/** Rows with each field present, out of TOTAL. */
export const COVERAGE = [
    { key: "address", n: 10_643 },
    { key: "website", n: 10_480 },
    { key: "phone", n: 10_002 },
    { key: "email", n: 9_068 },
    { key: "sector", n: 6_229 },
    { key: "instagram", n: 4_783 },
    { key: "founders", n: 3_438 },
    { key: "telegram", n: 3_039 },
    { key: "linkedin", n: 2_601 },
] as const

export type CoverageKey = (typeof COVERAGE)[number]["key"]

/** Rows with no email, no phone and no website. */
export const NO_ROUTE = 2_119
/** Rows with both an email and a phone. */
export const EMAIL_AND_PHONE = 8_366

/** Of rows with a classified email. */
export const EMAIL_TYPES = { corporate: 6_980, free: 2_085 }
/** Rows whose email is also used by at least one other company. */
export const SHARED_EMAIL = 410

/** Companies with a valid founding year, by era. */
export const YEARS_VALID = 10_199
export const ERAS = [
    { from: 1970, to: 1999, n: 766 },
    { from: 2000, to: 2009, n: 1_765 },
    { from: 2010, to: 2013, n: 1_454 },
    { from: 2014, to: 2018, n: 4_596 },
    { from: 2019, to: 2021, n: 1_268 },
    { from: 2022, to: 2026, n: 350 },
] as const
export const PEAK_YEAR = { year: 2016, n: 1_111 }

/** Belink's "main field", top ten, of the 6,229 rows that have one. */
export const SECTORS = [
    { en: "Advertising, marketing & sales", fa: "تبلیغات، بازاریابی و فروش", n: 312 },
    { en: "Health", fa: "سلامت", n: 293 },
    { en: "Trade", fa: "تجارت", n: 259 },
    { en: "Real estate", fa: "املاک", n: 242 },
    { en: "Financial services", fa: "خدمات مالی", n: 210 },
    { en: "Media, arts & entertainment", fa: "رسانه، هنر و سرگرمی", n: 209 },
    { en: "Petrochemicals & chemicals", fa: "پتروشیمی و صنایع شیمیایی", n: 194 },
    { en: "Professional services", fa: "خدمات حرفه‌ای", n: 190 },
    { en: "Travel & tourism", fa: "سفر و گردشگری", n: 148 },
    { en: "Education", fa: "آموزش", n: 123 },
] as const
export const SECTOR_FIELDS = 384

export const pct = (n: number, of: number, digits = 0) => Number(((n / of) * 100).toFixed(digits))
