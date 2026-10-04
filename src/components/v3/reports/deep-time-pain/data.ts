// ============================================================================
// File Path: src/components/v3/reports/deep-time-pain/data.ts
// Why: Every figure in report 02, in one place. Ages are in years before
//      present. Everything the page draws — clock times, zoom stages, axis
//      positions — is derived from these at render time, so a corrected date
//      corrects the whole report.
//
//      Sources are listed per claim in copy.ts and printed on the page.
// ============================================================================

/** Earth's age, the denominator of the 24-hour clock. */
export const EARTH_AGE = 4_540_000_000

export const DAY_SECONDS = 86_400

/** How many years one second of the compressed day is worth. */
export const YEARS_PER_CLOCK_SECOND = EARTH_AGE / DAY_SECONDS

export type EventKey =
  | "earth"
  | "cambrian"
  | "lamprey"
  | "kpg"
  | "split"
  | "dmanisi"
  | "sapiens"
  | "maba"
  | "qafzeh"
  | "shanidar"
  | "writing"
  | "you"

export type TimeEvent = {
  key: EventKey
  /** Years before present. */
  age: number
  /** Drawn in the accent rather than in bone — the report's own thread. */
  accent?: boolean
}

/**
 * The spine of the report. Ages are the midpoint where a range is given;
 * copy.ts carries the range and the caveat in words.
 */
export const EVENTS: TimeEvent[] = [
  { key: "earth", age: EARTH_AGE },
  { key: "cambrian", age: 538_800_000 },
  { key: "lamprey", age: 500_000_000, accent: true },
  { key: "kpg", age: 66_000_000 },
  { key: "split", age: 7_000_000 },
  { key: "dmanisi", age: 1_770_000 },
  { key: "sapiens", age: 300_000, accent: true },
  { key: "maba", age: 180_000 },
  { key: "qafzeh", age: 95_000 },
  { key: "shanidar", age: 50_000, accent: true },
  { key: "writing", age: 5_300 },
  { key: "you", age: 80 },
]

export function eventAge(key: EventKey): number {
  return EVENTS.find((e) => e.key === key)!.age
}

/** Where an age sits on the 24-hour clock, in seconds from 00:00. */
export function clockSeconds(age: number): number {
  return ((EARTH_AGE - age) / EARTH_AGE) * DAY_SECONDS
}

/**
 * The nested zoom. Each stage is a window ending at the present; the next
 * stage is the sliver highlighted inside this one. `span` is in years.
 */
export type ZoomStage = {
  key: "day" | "minute" | "second" | "tenth"
  span: number
  /** Events worth naming at this magnification. */
  shows: EventKey[]
}

export const ZOOM_STAGES: ZoomStage[] = [
  {
    key: "day",
    span: EARTH_AGE,
    shows: ["earth", "cambrian", "lamprey", "kpg", "split", "dmanisi", "sapiens"],
  },
  {
    key: "minute",
    span: YEARS_PER_CLOCK_SECOND * 60,
    shows: ["dmanisi", "sapiens", "maba", "qafzeh", "shanidar"],
  },
  {
    key: "second",
    span: YEARS_PER_CLOCK_SECOND * 6,
    shows: ["sapiens", "maba", "qafzeh", "shanidar", "writing"],
  },
  {
    key: "tenth",
    span: YEARS_PER_CLOCK_SECOND * 0.15,
    shows: ["writing", "you"],
  },
]

/** The "one year = one millimetre" ladder. Distances in metres. */
export const RULER: { key: EventKey; metres: number }[] = [
  { key: "you", metres: 0.08 },
  { key: "writing", metres: 5.3 },
  { key: "shanidar", metres: 50 },
  { key: "sapiens", metres: 300 },
  { key: "dmanisi", metres: 1_770 },
  { key: "lamprey", metres: 500_000 },
]

/** The three circuits, with how long each takes to reach the body. */
export type CircuitKey = "adrenaline" | "cortisol" | "analgesia"

export const CIRCUITS: { key: CircuitKey; steps: number; seconds: number }[] = [
  { key: "adrenaline", steps: 6, seconds: 3 },
  { key: "cortisol", steps: 4, seconds: 900 },
  { key: "analgesia", steps: 5, seconds: 120 },
]

/** Beecher 1946: share asking for an opioid, out of 100. */
export const BEECHER = { soldiers: 32, civilians: 83 }

/** Shanidar 1's injuries, as marks on a schematic body. x/y are in a 200x300 box. */
export type InjuryKey = "face" | "ear" | "arm" | "leg"

export const INJURIES: { key: InjuryKey; x: number; y: number }[] = [
  { key: "face", x: 112, y: 40 },
  { key: "ear", x: 74, y: 48 },
  { key: "arm", x: 70, y: 132 },
  { key: "leg", x: 80, y: 245 },
]

export const FOSSILS: EventKey[] = ["dmanisi", "maba", "qafzeh", "shanidar"]
