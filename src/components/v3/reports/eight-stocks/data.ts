// ============================================================================
// File Path: src/components/v3/reports/eight-stocks/data.ts
// Why: Every figure in report 01, in one place, in billions of US dollars.
//      Checked on 2026-09-27 against:
//        - market caps: StockTitan ranking, close of 25 Sep 2026
//        - GDP: IMF World Economic Outlook, April 2026 (2026 projections),
//          as tabulated by Worldometer
//        - EU-27: IMF WEO April 2026, via Wikipedia's Economy of the EU
//        - NVIDIA history: companiesmarketcap.com, year-end values
//      Every ratio on the page is derived from these numbers at render time,
//      so a correction here corrects the whole report.
// ============================================================================

export type CompanyKey = "nvidia" | "apple" | "alphabet" | "microsoft" | "amazon" | "meta" | "broadcom" | "amd"

export type Company = { key: CompanyKey; name: string; cap: number }

export const COMPANIES: Company[] = [
  { key: "nvidia", name: "NVIDIA", cap: 5430 },
  { key: "apple", name: "Apple", cap: 4900 },
  { key: "alphabet", name: "Google", cap: 4210 },
  { key: "microsoft", name: "Microsoft", cap: 3830 },
  { key: "amazon", name: "Amazon", cap: 2690 },
  { key: "meta", name: "Meta", cap: 1910 },
  { key: "broadcom", name: "Broadcom", cap: 1680 },
  { key: "amd", name: "AMD", cap: 1030 },
]

export type CountryKey =
  | "de" | "gb" | "fr" | "it" | "ru" | "es" | "nl" | "ch" | "pl" | "ie"
  | "be" | "se" | "at" | "no" | "dk" | "ro" | "cz" | "pt" | "fi" | "gr"

/**
 * The 20 largest European economies by 2026 nominal GDP (IMF projection).
 * `key` is the ISO 3166-1 alpha-2 code, which is also the flag file's name.
 */
export const COUNTRIES: { key: CountryKey; gdp: number }[] = [
  { key: "de", gdp: 5452.86 },
  { key: "gb", gdp: 4264.79 },
  { key: "fr", gdp: 3596.09 },
  { key: "it", gdp: 2738.16 },
  { key: "ru", gdp: 2656.45 },
  { key: "es", gdp: 2091.22 },
  { key: "nl", gdp: 1450 },
  { key: "ch", gdp: 1150 },
  { key: "pl", gdp: 1130 },
  { key: "ie", gdp: 779.38 },
  { key: "be", gdp: 776.73 },
  { key: "se", gdp: 760.48 },
  { key: "at", gdp: 623.72 },
  { key: "no", gdp: 599.41 },
  { key: "dk", gdp: 503.77 },
  { key: "ro", gdp: 480.83 },
  { key: "cz", gdp: 432.6 },
  { key: "pt", gdp: 380.64 },
  { key: "fi", gdp: 337.67 },
  { key: "gr", gdp: 307.55 },
]

/** EU-27, 2026 nominal GDP (IMF projection). */
export const EU27_GDP = 23035

/** NVIDIA's market cap at each year end, then today. */
export const NVIDIA_HISTORY: { label: string; cap: number }[] = [
  { label: "2019", cap: 144 },
  { label: "2020", cap: 323.24 },
  { label: "2021", cap: 735.27 },
  { label: "2022", cap: 364.18 },
  { label: "2023", cap: 1223 },
  { label: "2024", cap: 3288 },
  { label: "2025", cap: 4638 },
  { label: "2026", cap: 5430 },
]

export const TOTAL_CAP = COMPANIES.reduce((s, c) => s + c.cap, 0)
export const TOTAL_GDP_20 = COUNTRIES.reduce((s, c) => s + c.gdp, 0)

/** The layers of the digital economy and who holds each one. */
export type LayerKey = "chips" | "compute" | "cloud" | "data" | "ai" | "platforms"

export const LAYERS: { key: LayerKey; holders: CompanyKey[] }[] = [
  { key: "chips", holders: ["nvidia", "amd", "broadcom", "alphabet", "amazon"] },
  { key: "compute", holders: ["nvidia", "microsoft", "amazon", "alphabet"] },
  { key: "cloud", holders: ["amazon", "microsoft", "alphabet"] },
  { key: "data", holders: ["alphabet", "meta", "microsoft", "amazon"] },
  { key: "ai", holders: ["alphabet", "meta", "microsoft"] },
  { key: "platforms", holders: ["apple", "alphabet", "meta", "amazon", "microsoft"] },
]
