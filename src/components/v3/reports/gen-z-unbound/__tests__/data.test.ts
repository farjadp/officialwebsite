// The Gen Z series: the report's own numbers hang together, and the three
// parts release on their days (scheduled publishing in lib/reports.ts).
import { describe, expect, it } from "vitest"
import { REPORTS, findReport, getReport, isLive, liveReports, reportsByDate, torontoToday } from "@/lib/reports"
import {
  BOOMERS_LOST_IN_GENZ_ROOM,
  BUNDLING,
  CAMPS_AVG,
  CAMPS_BY_COUNTRY,
  CFST,
  COUNTRIES,
  GENERATIONS,
  ISSUES,
  LOST_ABROAD,
  MATCH_ABROAD,
  MATCH_BY_GEN,
  PLATFORMS,
  PLATFORM_COUNT,
  STRONG,
  STRONG_PER_100,
  TRUST_CHANGE,
  cfstRatio,
  keptShare,
} from "../data"
import { MEDALS_BY_PART, SERIES, SERIES_SLUGS } from "../series-copy"

describe("Gen Z data matches the report's own arithmetic", () => {
  it("rounds strong views to the per-hundred dots the report draws", () => {
    expect(Math.round(STRONG.boomers.right)).toBe(STRONG_PER_100.boomers.right)
    expect(Math.round(STRONG.genz.right)).toBe(STRONG_PER_100.genz.right)
    expect(Math.round(STRONG.genz.left)).toBe(STRONG_PER_100.genz.left)
  })

  it("gaps between left and right camps: 28 and 15 points", () => {
    expect(CAMPS_AVG.boomers.right - CAMPS_AVG.boomers.left).toBe(CAMPS_AVG.boomers.gap)
    expect(CAMPS_AVG.genz.right - CAMPS_AVG.genz.left).toBe(CAMPS_AVG.genz.gap)
    // "12 points further left than Boomer right-wing voters"
    expect(CAMPS_AVG.boomers.right - CAMPS_AVG.genz.right).toBe(12)
  })

  it("appendix differences equal Gen Z minus Boomers to rounding", () => {
    for (const c of COUNTRIES) {
      for (const side of ["left", "right"] as const) {
        const r = CAMPS_BY_COUNTRY[c][side]
        expect(Math.abs(r.genz - r.boomers - r.diff)).toBeLessThanOrEqual(0.11)
        expect(r.ci[0]).toBeLessThan(r.ci[1])
        // Significant exactly when the interval excludes zero.
        expect(r.sig).toBe(r.ci[0] > 0 || r.ci[1] < 0)
      }
    }
  })

  it("bundling falls with every younger generation", () => {
    expect(BUNDLING.boomers).toBeGreaterThan(BUNDLING.genx)
    expect(BUNDLING.genx).toBeGreaterThan(BUNDLING.millennials)
    expect(BUNDLING.millennials).toBeGreaterThan(BUNDLING.genz)
  })

  it("Boomers lose about 42% of their matches in a Gen Z room", () => {
    const b = MATCH_BY_GEN.boomers
    // 1 − 10.3/17.6 = 41.5% from the rounded table; the report computes 42% unrounded.
    expect(Math.abs(100 - keptShare(b.boomers.v, b.genz.v) - BOOMERS_LOST_IN_GENZ_ROOM)).toBeLessThanOrEqual(1)
    for (const p of GENERATIONS) for (const r of GENERATIONS) expect(MATCH_BY_GEN[p][r].v).toBeGreaterThan(MATCH_BY_GEN[p][r].chance)
  })

  it("matches abroad: every room beats chance; lost-abroad shares are consistent", () => {
    for (const g of ["boomers", "genz"] as const)
      for (const a of COUNTRIES) for (const b of COUNTRIES) expect(MATCH_ABROAD[g][a][b].v).toBeGreaterThan(MATCH_ABROAD[g][a][b].chance)
    for (const g of GENERATIONS) {
      const l = LOST_ABROAD[g]
      expect(Math.abs(100 - keptShare(l.own, l.other) - l.lost)).toBeLessThanOrEqual(1.5)
    }
  })

  it("CFST ratios match the printed 11x, 2.3x, 1.2x", () => {
    expect(Math.round(cfstRatio("policy"))).toBe(11)
    expect(cfstRatio("trust")).toBeCloseTo(2.3, 1)
    expect(cfstRatio("platforms")).toBeCloseTo(1.2, 1)
    expect(CFST.policy.times).toBe("11")
  })

  it("issue shares are percentages; 11 of 13 questions agree in direction is not contradicted", () => {
    for (const v of Object.values(ISSUES)) {
      expect(v.genz).toBeGreaterThan(0)
      expect(v.genz).toBeLessThan(100)
    }
    // All seven shown sit on the same side of 50 for both generations, or exactly on it.
    const crossing = Object.values(ISSUES).filter((v) => (v.genz - 50) * (v.boomers - 50) < 0)
    expect(crossing.length).toBeLessThanOrEqual(2)
  })

  it("trust readings sit on the chart's axis and keep the printed ordering", () => {
    for (const v of Object.values(TRUST_CHANGE)) {
      expect(v.genz).toBeGreaterThanOrEqual(-1.2)
      expect(v.boomers).toBeLessThanOrEqual(0.4)
    }
    // Medicine rises in both; politicians fall most for Boomers.
    expect(TRUST_CHANGE.medicine.genz).toBeGreaterThan(0)
    expect(TRUST_CHANGE.medicine.boomers).toBeGreaterThan(0)
    const worst = Object.entries(TRUST_CHANGE).sort((a, b) => a[1].boomers - b[1].boomers)[0][0]
    expect(worst).toBe("politicians")
  })

  it("platform counts: Gen Z about twice Boomers; Facebook is the one Boomers use more", () => {
    expect(PLATFORM_COUNT.genz / PLATFORM_COUNT.boomers).toBeCloseTo(2.07, 1)
    const boomerMore = Object.values(PLATFORMS).filter((p) => p.boomers > p.genz).map((p) => p.name)
    expect(boomerMore).toEqual(["Facebook"])
  })
})

describe("Gen Z series wiring", () => {
  it("three parts, numbered 11–13, three days apart", () => {
    const parts = SERIES_SLUGS.map((s) => findReport(s)!)
    expect(parts.map((r) => r.number)).toEqual([11, 12, 13])
    expect(parts.map((r) => r.published)).toEqual(["2026-11-23", "2026-11-26", "2026-11-29"])
    expect(SERIES.en.parts).toHaveLength(3)
    expect(SERIES.fa.parts).toHaveLength(3)
    expect(new Set(MEDALS_BY_PART.flat()).size).toBe(12)
  })
})

describe("scheduled publishing", () => {
  const at = (iso: string) => new Date(iso)
  const part2 = REPORTS.find((r) => r.slug === "gen-z-four-countries-one-generation")!

  it("uses Toronto's calendar day", () => {
    // 04:30 UTC on the 26th is still the 25th in Toronto (UTC−5 in November).
    expect(torontoToday(at("2026-11-26T04:30:00Z"))).toBe("2026-11-25")
    expect(torontoToday(at("2026-11-26T05:30:00Z"))).toBe("2026-11-26")
  })

  it("hides a report until its day, then shows it everywhere", () => {
    const before = at("2026-11-25T12:00:00Z")
    const on = at("2026-11-26T12:00:00Z")
    expect(isLive(part2, before)).toBe(false)
    expect(getReport(part2.slug, before)).toBeUndefined()
    expect(liveReports(before).some((r) => r.slug === part2.slug)).toBe(false)
    expect(reportsByDate(before)[0].slug).toBe("gen-z-unbound-politics")

    expect(isLive(part2, on)).toBe(true)
    expect(getReport(part2.slug, on)?.number).toBe(12)
    expect(reportsByDate(on)[0].slug).toBe(part2.slug)
  })

  it("never hides a report that is already out", () => {
    const now = at("2026-11-23T18:00:00Z")
    for (const r of REPORTS.filter((x) => x.number <= 11)) expect(isLive(r, now)).toBe(true)
  })
})
