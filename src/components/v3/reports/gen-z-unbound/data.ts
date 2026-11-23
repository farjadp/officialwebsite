// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/data.ts
// Why: Every number in the three-part Gen Z series (reports 11–13), taken
//      from Electric Twin, "Gen Z is Unbound" (October 2026): an online panel
//      survey, 51,929 analysed responses, US, UK, France and Germany, two
//      waves (30 Jan–6 Mar and 22–26 Apr 2026). A company report, not peer
//      reviewed. Figures are as printed; the one exception is TRUST_CHANGE,
//      which the report draws without labels and we read off its chart
//      (±0.02) — the copy says so wherever it is shown.
// ============================================================================

export const SOURCE = {
  title: "Gen Z is Unbound",
  publisher: "Electric Twin",
  collaborator: "Michael Muthukrishna (LSE; listed by Electric Twin as its science advisor)",
  date: "October 2026 (web version 19 November 2026)",
  responses: 51929,
  countries: 4,
  policyQuestions: 13,
  platforms: 21,
  waves: ["2026-01-30/2026-03-06", "2026-04-22/2026-04-26"],
} as const

export const GENERATIONS = ["genz", "millennials", "genx", "boomers"] as const
export type Gen = (typeof GENERATIONS)[number]

export const COUNTRIES = ["us", "uk", "fr", "de"] as const
export type Country = (typeof COUNTRIES)[number]

// ── Part 1: politics come unbundled ─────────────────────────────────────────

/** Share answering strongly on one side of six or more of eight party-dividing items (p. 2). */
export const STRONG = {
  boomers: { left: 10, right: 8.4 },
  genz: { left: 9.6, right: 2.0 },
} as const

/** Per hundred, as the report rounds them for its dot figure (p. 2). */
export const STRONG_PER_100 = {
  boomers: { left: 10, right: 8 },
  genz: { left: 10, right: 2 },
} as const

/**
 * % better prediction of each of 13 positions from the other 12, beyond
 * random combinations; equally weighted mean of four countries (p. 3).
 */
export const BUNDLING: Record<Gen, number> = { boomers: 16, genx: 11, millennials: 8.0, genz: 5.3 }

/** In a room of 100, how many find someone with exactly their 13 answers, US (p. 3). */
export const US_TWINS = { boomers: 20, genz: 9 } as const

/**
 * % who find an exact 13-answer match in a room of 99 from each generation,
 * same country, mean of four countries; chance in brackets (p. 18).
 * Row = the person, column = the room.
 */
export const MATCH_BY_GEN: Record<Gen, Record<Gen, { v: number; chance: number }>> = {
  genz: { genz: { v: 8.5, chance: 2.4 }, millennials: { v: 8.4, chance: 2.1 }, genx: { v: 8.7, chance: 2.2 }, boomers: { v: 8.8, chance: 2.0 } },
  millennials: { genz: { v: 8.8, chance: 2.1 }, millennials: { v: 9.4, chance: 2.0 }, genx: { v: 10.0, chance: 2.2 }, boomers: { v: 10.6, chance: 2.2 } },
  genx: { genz: { v: 9.6, chance: 2.2 }, millennials: { v: 10.6, chance: 2.2 }, genx: { v: 12.2, chance: 2.7 }, boomers: { v: 13.6, chance: 2.9 } },
  boomers: { genz: { v: 10.3, chance: 2.1 }, millennials: { v: 11.9, chance: 2.2 }, genx: { v: 14.5, chance: 3.0 }, boomers: { v: 17.6, chance: 3.7 } },
}

/** Boomers lose 42% of their matches in a room of Gen Z (95% CI 38–45, p. 18). */
export const BOOMERS_LOST_IN_GENZ_ROOM = 42

/** Average share of right-coded answers on eight items, by vote (0 left … 100 right; 50 = even mix, p. 4). */
export const CAMPS_AVG = {
  boomers: { left: 31, right: 59, gap: 28 },
  genz: { left: 32, right: 47, gap: 15 },
} as const

export type CampRow = { boomers: number; genz: number; diff: number; ci: [number, number]; p: string; sig: boolean }

/** The same by country, with the Gen Z − Boomers difference (appendix, p. 16). */
export const CAMPS_BY_COUNTRY: Record<Country, { left: CampRow; right: CampRow }> = {
  us: {
    left: { boomers: 27.2, genz: 31.7, diff: 4.6, ci: [2.8, 6.4], p: "<0.001", sig: true },
    right: { boomers: 65.7, genz: 46.3, diff: -19.4, ci: [-21.6, -17.2], p: "<0.001", sig: true },
  },
  uk: {
    left: { boomers: 39.8, genz: 32.2, diff: -7.6, ci: [-11.5, -3.8], p: "<0.001", sig: true },
    right: { boomers: 65.0, genz: 49.7, diff: -15.3, ci: [-19.7, -10.9], p: "<0.001", sig: true },
  },
  fr: {
    left: { boomers: 26.6, genz: 31.9, diff: 5.3, ci: [0.7, 9.9], p: "0.03", sig: true },
    right: { boomers: 48.9, genz: 45.2, diff: -3.7, ci: [-7.7, 0.3], p: "0.07", sig: false },
  },
  de: {
    left: { boomers: 30.5, genz: 31.6, diff: 1.1, ci: [-2.7, 4.9], p: "0.57", sig: false },
    right: { boomers: 56.8, genz: 47.6, diff: -9.2, ci: [-13.1, -5.3], p: "<0.001", sig: true },
  },
}

/** Voters who find an exact match in their own group's room (p. 19). */
export const VOTER_MATCH = {
  boomerLeft: { own: 26.7, ci: [23.6, 29.7], chance: 11.1 },
  boomerRight: { own: 18.1, ci: [15.9, 20.4], chance: 5.3 },
  genzLeft: { own: 12.4, ci: [10.7, 14.1], chance: 3.3 },
  genzRight: { own: 3.6, ci: [2.3, 4.9], chance: 1.5 },
} as const

/** UK young right-wing voters, the smallest young group (p. 19). */
export const UK_YOUNG_RIGHT_N = 203

export const ISSUE_KEYS = ["safetyNet", "progress", "falseInfo", "abortion", "immigration", "trans", "ai"] as const
export type IssueKey = (typeof ISSUE_KEYS)[number]

/**
 * % choosing each statement of a forced-choice pair; equally weighted mean
 * across four countries (p. 5). "ai" is the share choosing to accelerate AI
 * (so 58% / 66% favour pausing or restricting it).
 */
export const ISSUES: Record<IssueKey, { genz: number; boomers: number }> = {
  safetyNet: { genz: 71, boomers: 61 },
  progress: { genz: 69, boomers: 50 },
  falseInfo: { genz: 66, boomers: 76 },
  abortion: { genz: 63, boomers: 73 },
  immigration: { genz: 58, boomers: 50 },
  trans: { genz: 50, boomers: 38 },
  ai: { genz: 42, boomers: 34 },
}

/** On 11 of the 13 questions, majorities of both generations sit on the same side (p. 5). */
export const SAME_SIDE = { of: 13, same: 11 } as const

/** Abortion, four-point scale (p. 5). */
export const ABORTION = {
  europeStrongLegal: { boomers: 53, genz: 38 },
  europeStrongIllegal: { boomers: 9, genz: 13 },
  usLeanLegal: { boomers: 60, genz: 59 },
  usStrongOppose: { boomers: 27, genz: 16 },
} as const

// ── Part 2: one generation, four countries ──────────────────────────────────

/** Average spread between the four countries in the share taking each side, per question (p. 6). */
export const COUNTRY_SPREAD = { boomers: 11, genz: 4 } as const

/** Cross-validated accuracy guessing country from the 13 positions; chance 25% (p. 6). */
export const GUESS_COUNTRY: Record<Gen, number> = { boomers: 42, genx: 35, millennials: 30, genz: 29 }
export const GUESS_CHANCE = 25

/** Cultural distance between countries (CFST), mean of six pairs, noise-corrected (p. 10). */
export const CFST = {
  policy: { genz: 0.0027, boomers: 0.029, times: "11" },
  trust: { genz: 0.009, boomers: 0.021, times: "2.3" },
  platforms: { genz: 0.037, boomers: 0.045, times: "1.2" },
} as const
export type CfstKey = keyof typeof CFST

/** % of celebrity answers naming someone given in all four countries (wave 2, p. 10). */
export const CELEBS = {
  boomers: { share: 17, names: ["Brad Pitt", "Madonna", "Tom Cruise"] },
  genz: { share: 46, names: ["Justin Bieber", "Rihanna", "Taylor Swift"] },
} as const

/**
 * % finding an exact match in a room of 99 from the same generation in each
 * country (rows = person's country, columns = room's country), with chance (p. 17).
 */
export const MATCH_ABROAD: Record<"boomers" | "genz", Record<Country, Record<Country, { v: number; chance: number }>>> = {
  boomers: {
    us: { us: { v: 19.8, chance: 3.2 }, uk: { v: 13.3, chance: 3.4 }, fr: { v: 14.3, chance: 2.2 }, de: { v: 13.7, chance: 2.5 } },
    uk: { us: { v: 11.2, chance: 3.5 }, uk: { v: 17.4, chance: 5.8 }, fr: { v: 9.2, chance: 2.6 }, de: { v: 8.8, chance: 3.1 } },
    fr: { us: { v: 15.7, chance: 2.2 }, uk: { v: 12.9, chance: 2.5 }, fr: { v: 17.3, chance: 3.2 }, de: { v: 16.7, chance: 2.6 } },
    de: { us: { v: 12.1, chance: 2.4 }, uk: { v: 9.9, chance: 3.0 }, fr: { v: 13.4, chance: 2.7 }, de: { v: 15.2, chance: 3.1 } },
  },
  genz: {
    us: { us: { v: 8.6, chance: 2.2 }, uk: { v: 9.1, chance: 2.4 }, fr: { v: 8.0, chance: 2.1 }, de: { v: 7.4, chance: 2.0 } },
    uk: { us: { v: 8.5, chance: 2.4 }, uk: { v: 9.6, chance: 2.7 }, fr: { v: 7.4, chance: 2.3 }, de: { v: 6.7, chance: 2.2 } },
    fr: { us: { v: 7.8, chance: 2.1 }, uk: { v: 7.8, chance: 2.4 }, fr: { v: 7.8, chance: 2.2 }, de: { v: 7.7, chance: 2.0 } },
    de: { us: { v: 7.2, chance: 2.0 }, uk: { v: 7.1, chance: 2.2 }, fr: { v: 7.7, chance: 2.1 }, de: { v: 7.8, chance: 2.2 } },
  },
}

/** Own country vs another country's room, and the share of matches lost abroad (p. 17). */
export const LOST_ABROAD: Record<Gen, { own: number; other: number; lost: number; ci: [number, number] }> = {
  genz: { own: 8.5, other: 7.7, lost: 9, ci: [3, 15] },
  millennials: { own: 9.4, other: 8.5, lost: 10, ci: [4, 15] },
  genx: { own: 12.3, other: 10.2, lost: 17, ci: [13, 22] },
  boomers: { own: 17.5, other: 12.6, lost: 28, ci: [24, 32] },
}

// ── Part 3: trust and the broadcast account ─────────────────────────────────

export const INSTITUTIONS = ["medicine", "academia", "tech", "banks", "schools", "news", "police", "religious", "government", "politicians"] as const
export type Institution = (typeof INSTITUTIONS)[number]

/**
 * Mean self-reported change in trust, −2 (much less) … +2 (much more),
 * excluding "never trusted", pooled across countries and waves (p. 7).
 * NOT printed in the report: read off its chart by us, ±0.02.
 */
export const TRUST_CHANGE: Record<Institution, { genz: number; boomers: number }> = {
  medicine: { genz: 0.2, boomers: 0.13 },
  academia: { genz: 0.11, boomers: -0.25 },
  tech: { genz: -0.01, boomers: -0.25 },
  banks: { genz: -0.08, boomers: -0.19 },
  schools: { genz: -0.12, boomers: -0.34 },
  news: { genz: -0.17, boomers: -0.37 },
  police: { genz: -0.28, boomers: -0.25 },
  religious: { genz: -0.17, boomers: -0.39 },
  government: { genz: -0.5, boomers: -0.9 },
  politicians: { genz: -0.54, boomers: -1.03 },
}
export const TRUST_READ_PRECISION = 0.02

/** Very few trust politicians completely: 1%–7% depending on generation (p. 7). */
export const TRUST_POLITICIANS_COMPLETELY = [1, 7] as const

/** Trust a lot or completely, of 15 sources (p. 8). */
export const TRUSTED = { doctor: 87, friendsFamily: 83, sources: 15 } as const

/** Main reason for trusting institutions less (p. 8): about 3 in 10 each; Boomers 21% add "take political sides". */
export const REASONS = { moneyPower: 30, notHonest: 30, boomersPoliticalSides: 21 } as const

export const PLATFORM_KEYS = ["youtube", "instagram", "tiktok", "whatsapp", "snapchat", "facebook"] as const
export type Platform = (typeof PLATFORM_KEYS)[number]

/** % using each platform at least weekly; equally weighted across countries (p. 9). */
export const PLATFORMS: Record<Platform, { name: string; genz: number; boomers: number }> = {
  youtube: { name: "YouTube", genz: 83, boomers: 55 },
  instagram: { name: "Instagram", genz: 78, boomers: 30 },
  tiktok: { name: "TikTok", genz: 72, boomers: 15 },
  whatsapp: { name: "WhatsApp", genz: 62, boomers: 56 },
  snapchat: { name: "Snapchat", genz: 61, boomers: 6 },
  facebook: { name: "Facebook", genz: 46, boomers: 69 },
}

/** Platforms used weekly, of 21 (p. 9). */
export const PLATFORM_COUNT = { genz: 6.2, boomers: 3.0, of: 21 } as const

/** A third of highly online Gen Z say algorithms shape their interests, beliefs or identity a lot (p. 9). */
export const ALGO_SHAPES_A_LOT = 33

/** Share of the Boomer–Gen Z bundling gap explained by everything measured, incl. vote (wave 2, p. 11). */
export const EXPLAINED = 20

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Observed ÷ chance, one decimal. */
export const overChance = (c: { v: number; chance: number }) => Math.round((c.v / c.chance) * 10) / 10

/** CFST ratio Boomers ÷ Gen Z. */
export const cfstRatio = (k: CfstKey) => CFST[k].boomers / CFST[k].genz

/** Share of one's own-room matches kept in another room, %. */
export const keptShare = (own: number, other: number) => (other / own) * 100
