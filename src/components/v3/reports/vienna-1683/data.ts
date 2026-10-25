// ============================================================================
// File Path: src/components/v3/reports/vienna-1683/data.ts
// Why: The figures report 06 rests on. Forces are ranges, because historians
//      give ranges: the "300,000" of the classroom line is period propaganda
//      (it counts labourers and camp followers). Ranges follow Stoye, The
//      Siege of Vienna, and Wheatcroft, The Enemy at the Gate. Days are
//      counted from 14 July 1683, the first day of the siege.
// ============================================================================

export type Range = [number, number]

export const FORCES = {
  /** The figure in the classroom line and in period pamphlets. */
  ottomanClaim: 300000,
  /** Modern estimate of the whole army that marched from Belgrade. */
  ottomanTotal: [100000, 150000] as Range,
  /** Of whom fighting troops. */
  ottomanCombat: [60000, 90000] as Range,
  /** Effectives left by 12 September after detachments, losses and disease. */
  ottomanSept12: [50000, 60000] as Range,
  defendersSoldiers: 11000,
  defendersCitizens: 5000,
  relief: [65000, 80000] as Range,
  reliefPolish: [20000, 27000] as Range,
  charge: [18000, 20000] as Range,
  hussars: 3000,
  /** Ottoman guns: about 110-150, almost all light. City: some 300+. */
  ottomanGuns: [110, 150] as Range,
  cityGuns: 300,
}

/** One soldier icon stands for this many men in the numbers figure. */
export const PER_ICON = 5000

export const SIEGE_DAYS = 60

/** Key days, counted from 14 July 1683 (day 0). Text lives in copy. */
export const TIMELINE = [
  { day: -7, key: "leopold" },
  { day: 0, key: "begins" },
  { day: 52, key: "breach" },
  { day: 54, key: "tulln" },
  { day: 59, key: "heights" },
  { day: 60, key: "battle" },
] as const
export type TimelineKey = (typeof TIMELINE)[number]["key"]

/** The council game: for each dilemma, which option history chose and which protects the scarce resource. */
export const DILEMMAS = [
  { key: "guns", history: 1, protects: 0 },
  { key: "method", history: 1, protects: 0 },
  { key: "heights", history: 1, protects: 0 },
  { key: "troops", history: 1, protects: 0 },
  { key: "danube", history: 1, protects: 0 },
] as const
export type DilemmaKey = (typeof DILEMMAS)[number]["key"]

export const MULTIPLIERS = ["goals", "walls", "lines", "focus", "command"] as const
export type MultiplierKey = (typeof MULTIPLIERS)[number]

export const MYTHS = ["europe", "crusade", "decline", "croissant"] as const
export type MythKey = (typeof MYTHS)[number]
