// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/data.ts
// Why: The figures report 05 is built on, all from UN DESA, International
//      Migrant Stock 2024 (POP/DB/MIG/Stock/Rev.2024), mid-year (1 July)
//      estimates. World and regional rows are copied from Tables 1-4; the
//      per-country rows live in ./countries (generated from the workbook).
// ============================================================================

import { COUNTRIES, type CountryRow } from "./countries"

export { COUNTRIES, type CountryRow }

export const YEARS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024] as const

export const WORLD = {
  stock: [153916063, 163176002, 174566152, 192788721, 221020392, 250042020, 275284032, 304021813],
  /** Migrants as % of world population (Table 3). */
  pct: [2.89, 2.83, 2.83, 2.93, 3.15, 3.35, 3.49, 3.72],
  /** World population, millions (Table 2). */
  popM: [5328, 5759, 6172, 6587, 7022, 7470, 7887, 8162],
  /** Women as % of migrants (Table 4). */
  female: [49.5, 49.4, 49.4, 48.9, 48.8, 47.9, 48.0, 48.0],
}

/** SDG regions of destination, 2024: migrants, % of the world's migrants, % of the region's population. */
export type RegionKey = "eu_na" | "nafr_wasia" | "ssa" | "e_se_asia" | "c_s_asia" | "latam" | "anz" | "oceania"
export const REGIONS: { key: RegionKey; stock: number; share: number; pctPop: number }[] = [
  { key: "eu_na", stock: 155259380, share: 51.1, pctPop: 13.7 },
  { key: "nafr_wasia", stock: 54085710, share: 17.8, pctPop: 9.3 },
  { key: "ssa", stock: 24306400, share: 8.0, pctPop: 2.0 },
  { key: "e_se_asia", stock: 22588980, share: 7.4, pctPop: 1.0 },
  { key: "c_s_asia", stock: 20369652, share: 6.7, pctPop: 0.9 },
  { key: "latam", stock: 17510527, share: 5.8, pctPop: 2.6 },
  { key: "anz", stock: 9579393, share: 3.2, pctPop: 30.0 },
  { key: "oceania", stock: 321771, share: 0.1, pctPop: 2.3 },
]

/** High-income countries host this share of the world's migrants (Table 1, World Bank income groups). */
export const HIGH_INCOME_SHARE = 65.5

/** ISO codes offered as quick picks in the "100 people" figure. */
export const HUNDRED_PICKS = ["", "QA", "AE", "AU", "CA", "DE", "US", "IR", "IN"] as const

/** Gender strip: female share of migrants, 2024, for destinations with 100,000+ migrants. */
export const FEMALE_STRIP = ["OM", "SA", "QA", "MY", "BH", "AE", "KW", "JO", "US", "IR", "CA", "SG", "UA", "KZ", "PL", "TW", "HK", "NP"] as const

/** Look a country up by ISO code. "" is the Channel Islands. */
export function byIso(iso: string): CountryRow | undefined {
  return COUNTRIES.find((c) => c[0] === iso)
}

/** Rank (1-based) by 2024 stock among all 233 areas. COUNTRIES is already sorted. */
export function rankByStock(iso: string): number {
  return COUNTRIES.findIndex((c) => c[0] === iso) + 1
}

/** Areas with 100,000+ migrants in 2024, by migrants' share of the population. */
export const BY_SHARE: CountryRow[] = COUNTRIES.filter((c) => c[4][7] >= 100000).sort((a, b) => b[6] - a[6])

/** Rank by share among BY_SHARE, or 0 when under 100,000 migrants. */
export function rankByShare(iso: string): number {
  return BY_SHARE.findIndex((c) => c[0] === iso) + 1
}

/** Flag emoji from an ISO code. Windows shows the two letters instead, which still reads. */
export function flag(iso: string): string {
  if (iso.length !== 2) return "🏳️"
  return String.fromCodePoint(...[...iso.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65))
}

// ── The game ────────────────────────────────────────────────────────────────

export type VsItem = { a: string; b: string }
export type EstItem = { key: "worldPct" | "growth" | "female" | "uae"; min: number; max: number; step: number; ans: number; unit: "%" | "×" }

/** Pairs by ISO; values are read from COUNTRIES so the game cannot drift from the charts. */
export const LEVEL_COUNT: VsItem[] = [
  { a: "US", b: "IN" },
  { a: "SA", b: "GB" },
  { a: "CA", b: "QA" },
  { a: "TR", b: "IR" },
  { a: "MY", b: "CN" },
  { a: "RU", b: "MX" },
]
export const LEVEL_SHARE: VsItem[] = [
  { a: "QA", b: "US" },
  { a: "SA", b: "CA" },
  { a: "AE", b: "DE" },
  { a: "AU", b: "IT" },
  { a: "SG", b: "FR" },
  { a: "TR", b: "IR" },
]
export const LEVEL_EST: EstItem[] = [
  { key: "worldPct", min: 0, max: 25, step: 0.1, ans: 3.7, unit: "%" },
  { key: "growth", min: 1, max: 6, step: 0.1, ans: 2.0, unit: "×" },
  { key: "female", min: 0, max: 100, step: 0.5, ans: 48.0, unit: "%" },
  { key: "uae", min: 0, max: 100, step: 0.5, ans: 74.0, unit: "%" },
]
export const LEVEL_GENDER: VsItem[] = [
  { a: "HK", b: "OM" },
  { a: "CA", b: "SA" },
  { a: "PL", b: "MY" },
  { a: "NP", b: "BH" },
  { a: "TW", b: "QA" },
]
