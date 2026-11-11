// Report 08: the figures and the uniform-swing model behind the page.
import { describe, expect, it } from "vitest"
import { REPORTS } from "@/lib/reports"
import {
  BREAK_EVEN, DEMOGRAPHIC, GRID, GROUPS, NATIONAL_2024, QUESTIONS, STATES_2024,
  baseMargin, breakUndecided, countPoints, flips, group, margin, modelMargin, swingFor, tally,
} from "../data"

describe("Pew group rows", () => {
  it("each row sums to 100 within Pew's rounding", () => {
    for (const g of GROUPS) expect(Math.abs(g.dem + g.rep + g.und - 100)).toBeLessThanOrEqual(1)
  })
  it("matches the margins the copy quotes", () => {
    expect(margin(group("all"))).toBe(8)
    expect(margin(group("black"))).toBe(63)
    expect(margin(group("asian"))).toBe(40)
    expect(margin(group("white"))).toBe(-7)
    expect(margin(group("a50"))).toBe(-6)
    expect(margin(group("hs"))).toBe(-4)
    expect(margin(group("men"))).toBe(0)
  })
  it("keeps party rows out of the model", () => {
    expect(DEMOGRAPHIC.some((g) => g.partisan)).toBe(false)
    expect(DEMOGRAPHIC.map((g) => g.key)).toContain("ind")
  })
})

describe("uniform-swing model", () => {
  it("covers 50 states plus DC, on the tile grid too", () => {
    expect(Object.keys(STATES_2024)).toHaveLength(51)
    expect(new Set(GRID.map(([s]) => s))).toEqual(new Set(Object.keys(STATES_2024)))
  })
  it("uses the 2024 national R+1.5 as the anchor", () => {
    expect(NATIONAL_2024).toBeCloseTo(-1.5, 5)
    expect(swingFor("men")).toBeCloseTo(1.5, 5)
  })
  it("the baseline reproduces 2024: 19 Harris states plus DC", () => {
    expect(tally(null).dem).toBe(20)
  })
  it("shifts every state by the same amount", () => {
    for (const st of Object.keys(STATES_2024)) expect(modelMargin(st, "women") - baseMargin(st)).toBeCloseTo(15.5, 5)
  })
  it("under-30s flip a state Republicans won by about 25 in 2024", () => {
    expect(flips("a18")).toContain("MS")
  })
  it("every game question has an answer", () => {
    for (const q of QUESTIONS) {
      if (q.kind === "count") expect(tally(q.group).dem).toBeGreaterThanOrEqual(0)
      else expect(STATES_2024[q.state]).toBeDefined()
    }
  })
  it("scores count guesses by distance", () => {
    expect(countPoints(30, 32)).toBe(10)
    expect(countPoints(30, 35)).toBe(6)
    expect(countPoints(30, 39)).toBe(3)
    expect(countPoints(30, 40)).toBe(0)
  })
})

describe("the break-even arithmetic", () => {
  it("the lead disappears when ~77% of the not-sure go Republican", () => {
    expect(BREAK_EVEN).toBeCloseTo(23 / 30, 5)
    expect(breakUndecided(BREAK_EVEN).margin).toBeCloseTo(0, 5)
    expect(breakUndecided(0.5).margin).toBeCloseTo(8, 5)
  })
})

describe("register", () => {
  it("lists report 08 once, numbered after 07", () => {
    const r = REPORTS.filter((x) => x.slug === "undecided-fifth-2026-midterms")
    expect(r).toHaveLength(1)
    expect(r[0].number).toBe(8)
    expect(new Set(REPORTS.map((x) => x.number)).size).toBe(REPORTS.length)
  })
})
