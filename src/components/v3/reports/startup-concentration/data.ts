// ============================================================================
// File Path: src/components/v3/reports/startup-concentration/data.ts
// Why: The figures report 07 rests on, each labelled by the report it comes
//      from: Startup Genome's GSER 2026 (funding, 2025 full year) and the
//      StartupBlink Global Startup Ecosystem Index 2026 (scores, ranks,
//      unicorns). The two use different methods and are never mixed in one
//      number. Derived figures are computed here, from these inputs, so the
//      page can show its working.
// ============================================================================

/** GSER 2026, funding in 2025, US$ billions. */
export const FUNDING = {
  late: { now: 210, growth: 0.17 },
  seriesA: { now: 46.5, growth: 0.02 },
  /** Late-stage funding into AI-native companies. */
  aiLate: 108,
  /** Share of late-stage AI-native funding that went to North America. */
  aiNorthAmerica: 0.86,
}

export const prior = (now: number, g: number) => now / (1 + g)

/** Blended growth if the two stages are averaged into one "funding is back" number. */
export const BLENDED = (() => {
  const now = FUNDING.late.now + FUNDING.seriesA.now
  const before = prior(FUNDING.late.now, FUNDING.late.growth) + prior(FUNDING.seriesA.now, FUNDING.seriesA.growth)
  return now / before - 1
})()

export const AI_SHARE = FUNDING.aiLate / FUNDING.late.now
export const AI_NA = FUNDING.aiLate * FUNDING.aiNorthAmerica

/** StartupBlink 2026, top 10 countries by composite score and score growth (index p.24). */
export const COUNTRIES: { iso: string; score: number; growth: number }[] = [
  { iso: "US", score: 314.096, growth: 0.236 },
  { iso: "GB", score: 80.114, growth: 0.132 },
  { iso: "IL", score: 71.462, growth: 0.15 },
  { iso: "SG", score: 68.043, growth: 0.244 },
  { iso: "CA", score: 49.534, growth: 0.09 },
  { iso: "SE", score: 40.781, growth: 0.155 },
  { iso: "DE", score: 37.644, growth: 0.135 },
  { iso: "CH", score: 36.108, growth: 0.137 },
  { iso: "AU", score: 35.438, growth: 0.229 },
  { iso: "NL", score: 34.514, growth: 0.118 },
]

export const gain = (score: number, g: number) => score - prior(score, g)
export const US_GAIN = gain(COUNTRIES[0].score, COUNTRIES[0].growth)
export const NEXT_NINE_GAIN = COUNTRIES.slice(1).reduce((s, c) => s + gain(c.score, c.growth), 0)

/**
 * Unicorns as printed on each country's page of the 2026 index. The index
 * gives no global total; the "1,113" often quoted is StartupBlink's 2023
 * unicorn map, so it is not used here.
 */
export const UNICORNS: { iso: string; n: number }[] = [
  { iso: "US", n: 620 },
  { iso: "CN", n: 148 },
  { iso: "IN", n: 68 },
  { iso: "GB", n: 52 },
  { iso: "DE", n: 29 },
  { iso: "FR", n: 29 },
  { iso: "IL", n: 26 },
  { iso: "CA", n: 22 },
  { iso: "BR", n: 19 },
  { iso: "SG", n: 18 },
]
export const UNICORNS_NEXT_NINE = UNICORNS.slice(1).reduce((s, c) => s + c.n, 0)

/** The summary post checked line by line. Verdicts and corrections live in copy. */
export const CLAIMS = ["late", "seriesA", "aiNa", "coverage", "singapore", "unicorns", "us", "riyadh"] as const
export type ClaimKey = (typeof CLAIMS)[number]
export type Verdict = "true" | "false" | "half"
export const VERDICTS: Record<ClaimKey, Verdict> = {
  late: "true",
  seriesA: "true",
  aiNa: "true",
  coverage: "half",
  singapore: "false",
  unicorns: "false",
  us: "false",
  riyadh: "true",
}

export const READS = ["centre", "early", "ai", "hardware", "state"] as const
export type ReadKey = (typeof READS)[number]

export const ROUND_STAGES = ["seed", "seriesA", "late"] as const
export type RoundStage = (typeof ROUND_STAGES)[number]
export const ROUND_REGIONS = ["na", "elsewhere"] as const
export type RoundRegion = (typeof ROUND_REGIONS)[number]
