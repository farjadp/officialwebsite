// ============================================================================
// File Path: src/components/v3/reports/undecided-fifth/data.ts
// Why: The figures report 08 rests on. Group shares are Pew Research
//      Center's (registered voters, survey of Sept. 28 – Oct. 4, 2026); the
//      state baseline is the certified 2024 presidential result. Every
//      derived number (margins, the uniform-swing map, the game's answers) is
//      computed here from those inputs, so the page shows its working and the
//      tests can check it. Pure data: no React, safe for the test runner.
// ============================================================================

export type GroupKey =
  | "all"
  | "men"
  | "women"
  | "white"
  | "hispanic"
  | "black"
  | "asian"
  | "a18"
  | "a30"
  | "a50"
  | "a65"
  | "postgrad"
  | "college"
  | "someCollege"
  | "hs"
  | "repLean"
  | "rep"
  | "leanRep"
  | "demLean"
  | "dem"
  | "leanDem"
  | "ind"

export type Block = "all" | "gender" | "race" | "age" | "edu" | "party"

export type Group = {
  key: GroupKey
  block: Block
  /** % for the Democratic candidate, Republican candidate, and other / not sure. */
  dem: number
  rep: number
  und: number
  /** A sub-row of the party block (Republican, Lean Rep, …), set in italic. */
  sub?: boolean
  /** Party rows are near-tautological; they stay out of the margin plot and the map. */
  partisan?: boolean
}

/** Pew Research Center, "Midterm Vote Preferences by Race, Age and Other Demographics", Oct. 8, 2026. */
export const GROUPS: Group[] = [
  { key: "all", block: "all", dem: 44, rep: 36, und: 20 },
  { key: "men", block: "gender", dem: 42, rep: 42, und: 16 },
  { key: "women", block: "gender", dem: 45, rep: 31, und: 24 },
  { key: "white", block: "race", dem: 37, rep: 44, und: 18 },
  { key: "hispanic", block: "race", dem: 51, rep: 24, und: 25 },
  { key: "black", block: "race", dem: 70, rep: 7, und: 23 },
  { key: "asian", block: "race", dem: 56, rep: 16, und: 27 },
  { key: "a18", block: "age", dem: 51, rep: 23, und: 25 },
  { key: "a30", block: "age", dem: 43, rep: 31, und: 26 },
  { key: "a50", block: "age", dem: 39, rep: 45, und: 16 },
  { key: "a65", block: "age", dem: 44, rep: 41, und: 15 },
  { key: "postgrad", block: "edu", dem: 58, rep: 30, und: 12 },
  { key: "college", block: "edu", dem: 48, rep: 33, und: 19 },
  { key: "someCollege", block: "edu", dem: 42, rep: 38, und: 20 },
  { key: "hs", block: "edu", dem: 35, rep: 39, und: 26 },
  { key: "repLean", block: "party", dem: 6, rep: 73, und: 21, partisan: true },
  { key: "rep", block: "party", dem: 4, rep: 84, und: 12, sub: true, partisan: true },
  { key: "leanRep", block: "party", dem: 9, rep: 53, und: 38, sub: true, partisan: true },
  { key: "demLean", block: "party", dem: 82, rep: 2, und: 15, partisan: true },
  { key: "dem", block: "party", dem: 88, rep: 2, und: 10, sub: true, partisan: true },
  { key: "leanDem", block: "party", dem: 72, rep: 3, und: 25, sub: true, partisan: true },
  // Pew's "NET Ind/Other": independents and other-party identifiers, leaners included.
  { key: "ind", block: "party", dem: 40, rep: 24, und: 36 },
]

export const group = (k: GroupKey): Group => {
  const g = GROUPS.find((x) => x.key === k)
  if (!g) throw new Error(`Unknown group ${k}`)
  return g
}

/** Democratic share minus Republican share, in points. */
export const margin = (g: Pick<Group, "dem" | "rep">) => g.dem - g.rep

/** Groups that go into the margin plot and the what-if map. */
export const DEMOGRAPHIC = GROUPS.filter((g) => !g.partisan)

/** The four party sub-rows, in the order the stacked bars show them. */
export const PARTY_STACKS: GroupKey[] = ["rep", "leanRep", "leanDem", "dem"]

export const SURVEY = {
  adults: 5062,
  registered: 3917,
  fieldStart: "2026-09-28",
  fieldEnd: "2026-10-04",
  published: "2026-10-08",
  electionDay: "2026-11-03",
  /** "Another candidate" and "not sure" inside the 20%. */
  other: 5,
  notSure: 15,
}

// ── Engagement, Pew, Oct. 8, 2026 ───────────────────────────────────────────

export type EngageKey = "matters" | "thought" | "motivated"
export type Year = 2022 | 2026

/** % of each side's supporters: [Democratic-candidate supporters, Republican-candidate supporters]. */
export const ENGAGEMENT: Record<EngageKey, Record<Year, [number, number]>> = {
  matters: { 2022: [72, 76], 2026: [78, 69] },
  thought: { 2022: [38, 49], 2026: [50, 36] },
  motivated: { 2022: [56, 58], 2026: [63, 46] },
}
export const ENGAGE_KEYS: EngageKey[] = ["matters", "thought", "motivated"]

export const MOOD = { satisfied: 22, economy: 84, presidentFactor: 63, against: 44, for: 19, approval: 30 }

// ── The what-if model ───────────────────────────────────────────────────────

/** 2024 certified presidential result, % [Harris, Trump]. The American Presidency Project, UC Santa Barbara. */
export const STATES_2024: Record<string, [number, number]> = {
  AL: [34.1, 64.57], AK: [41.41, 54.54], AZ: [46.69, 52.22], AR: [33.56, 64.2], CA: [58.47, 38.33],
  CO: [54.13, 43.14], CT: [56.4, 41.89], DE: [56.63, 41.89], DC: [90.28, 6.47], FL: [42.99, 56.09],
  GA: [48.53, 50.73], HI: [60.59, 37.48], ID: [30.39, 66.89], IL: [54.37, 43.47], IN: [39.62, 58.58],
  IA: [42.52, 55.73], KS: [41.04, 57.16], KY: [33.94, 64.47], LA: [38.21, 60.22], ME: [52.44, 45.5],
  MD: [62.62, 34.08], MA: [61.22, 36.02], MI: [48.31, 49.73], MN: [50.92, 46.68], MS: [38.0, 60.89],
  MO: [40.08, 58.49], MT: [38.46, 58.39], NE: [39.06, 59.63], NV: [47.49, 50.59], NH: [50.65, 47.87],
  NJ: [51.97, 46.06], NM: [51.85, 45.85], NY: [55.91, 43.31], NC: [47.65, 50.86], ND: [30.51, 66.96],
  OH: [43.93, 55.14], OK: [31.9, 66.16], OR: [55.27, 40.97], PA: [48.66, 50.37], RI: [55.54, 41.76],
  SC: [40.36, 58.23], SD: [34.24, 63.43], TN: [34.47, 64.19], TX: [42.46, 56.14], UT: [37.79, 59.38],
  VT: [63.83, 32.32], VA: [51.83, 46.05], WA: [57.23, 39.01], WV: [28.11, 69.98], WI: [48.84, 49.7],
  WY: [25.84, 71.6],
}

/** 2024 national popular vote, Harris 48.3 – Trump 49.8. */
export const NATIONAL_2024 = 48.3 - 49.8

/** Tile map: [state, row, column] on an 8 × 11 grid. */
export const GRID: [string, number, number][] = [
  ["AK", 0, 0], ["ME", 0, 10], ["VT", 1, 9], ["NH", 1, 10],
  ["WA", 2, 0], ["ID", 2, 1], ["MT", 2, 2], ["ND", 2, 3], ["MN", 2, 4], ["IL", 2, 5], ["WI", 2, 6], ["MI", 2, 7], ["NY", 2, 8], ["RI", 2, 9], ["MA", 2, 10],
  ["OR", 3, 0], ["NV", 3, 1], ["WY", 3, 2], ["SD", 3, 3], ["IA", 3, 4], ["IN", 3, 5], ["OH", 3, 6], ["PA", 3, 7], ["NJ", 3, 8], ["CT", 3, 9],
  ["CA", 4, 0], ["UT", 4, 1], ["CO", 4, 2], ["NE", 4, 3], ["MO", 4, 4], ["KY", 4, 5], ["WV", 4, 6], ["VA", 4, 7], ["MD", 4, 8], ["DE", 4, 9],
  ["AZ", 5, 1], ["NM", 5, 2], ["KS", 5, 3], ["AR", 5, 4], ["TN", 5, 5], ["NC", 5, 6], ["SC", 5, 7], ["DC", 5, 8],
  ["HI", 6, 0], ["OK", 6, 3], ["LA", 6, 4], ["MS", 6, 5], ["AL", 6, 6], ["GA", 6, 7],
  ["TX", 7, 3], ["FL", 7, 8],
]

export const baseMargin = (st: string) => {
  const r = STATES_2024[st]
  if (!r) throw new Error(`Unknown state ${st}`)
  return r[0] - r[1]
}

/** How far a group's national margin sits from the 2024 national margin. */
export const swingFor = (k: GroupKey) => margin(group(k)) - NATIONAL_2024

/** A state's modelled margin if only group `k` voted (null = the 2024 baseline). */
export const modelMargin = (st: string, k: GroupKey | null) => (k === null ? baseMargin(st) : baseMargin(st) + swingFor(k))

/** The ±3-point band the map marks as a toss-up. */
export const TOSSUP = 3

export function tally(k: GroupKey | null) {
  let dem = 0
  let close = 0
  for (const st of Object.keys(STATES_2024)) {
    const m = modelMargin(st, k)
    if (m >= 0) dem++
    if (Math.abs(m) < TOSSUP) close++
  }
  return { dem, rep: Object.keys(STATES_2024).length - dem, close }
}

/** States that change side against 2024 under group `k`. */
export const flips = (k: GroupKey) => Object.keys(STATES_2024).filter((st) => baseMargin(st) >= 0 !== modelMargin(st, k) >= 0)

/** The options of the map explorer: the baseline, then every demographic group. */
export const MAP_OPTIONS: (GroupKey | null)[] = [null, ...DEMOGRAPHIC.map((g) => g.key)]

// ── The guessing game ───────────────────────────────────────────────────────

export type Question = { kind: "count"; group: GroupKey } | { kind: "state"; state: string; group: GroupKey }

export const QUESTIONS: Question[] = [
  { kind: "count", group: "women" },
  { kind: "state", state: "TX", group: "a18" },
  { kind: "count", group: "white" },
  { kind: "state", state: "CA", group: "white" },
  { kind: "state", state: "WY", group: "postgrad" },
  { kind: "count", group: "a18" },
  { kind: "state", state: "PA", group: "a50" },
  { kind: "state", state: "OH", group: "college" },
  { kind: "count", group: "a50" },
  { kind: "state", state: "FL", group: "women" },
]

/** Points for a count guess: within 2 → 10, within 5 → 6, within 9 → 3. */
export const countPoints = (guess: number, answer: number) => {
  const e = Math.abs(guess - answer)
  return e <= 2 ? 10 : e <= 5 ? 6 : e <= 9 ? 3 : 0
}

/**
 * Arithmetic, not a forecast: the lead if the 15% who were "not sure" all
 * picked one of the two parties and a share `toRep` of them went Republican.
 * The 5% already choosing another candidate stay where they are.
 */
export function breakUndecided(toRep: number) {
  const all = group("all")
  const dem = all.dem + SURVEY.notSure * (1 - toRep)
  const rep = all.rep + SURVEY.notSure * toRep
  return { dem, rep, margin: dem - rep }
}

/** The split of the not-sure voters at which the lead disappears. */
export const BREAK_EVEN = (margin(group("all")) + SURVEY.notSure) / (2 * SURVEY.notSure)
