// The /reports index previews: one per report, drawing the reports' own numbers.
import { describe, expect, it } from "vitest"
import { REPORTS } from "@/lib/reports"
import { PREVIEW_FACTS, REPORT_PREVIEWS } from "../previews"

describe("report previews", () => {
  it("every published report has a preview, and no preview is orphaned", () => {
    expect(new Set(Object.keys(REPORT_PREVIEWS))).toEqual(new Set(REPORTS.map((r) => r.slug)))
  })
  it("draws the figures the reports state", () => {
    expect(PREVIEW_FACTS.undecided.und).toBe(20)
    expect(PREVIEW_FACTS.undecided.notSure + PREVIEW_FACTS.undecided.other).toBe(20)
    expect(PREVIEW_FACTS.concentrationNA).toBeCloseTo(92.88, 2)
    expect(PREVIEW_FACTS.viennaDefenders).toBe(16000)
    expect(PREVIEW_FACTS.imessageAttempts).toBeCloseTo(2.22, 2)
    expect(PREVIEW_FACTS.deepTimeDeg).toBeCloseTo(39.6, 1)
    expect(PREVIEW_FACTS.eightStocksTotal).toBe(25680)
    expect(PREVIEW_FACTS.eightStocksTotal).toBeGreaterThan(PREVIEW_FACTS.eu27)
    expect(PREVIEW_FACTS.dtc.live + PREVIEW_FACTS.dtc.announced).toBeGreaterThan(0)
  })
})
