import { describe, expect, it } from "vitest"
import { RESUME_RESERVE_DAY_CENTS, scoringStopReason } from "../cost"
import { cycleFor, findings, rates, type ReviewNumbers } from "../monthly-review-rules"

const base: ReviewNumbers = {
    spendCents: 800,
    resumeCostCents: 280,
    resumes: 20,
    scored: 400,
    scoreCostCents: 520,
    newPostings: 900,
    strongMatches: 60,
    shortlisted: 40,
    applied: 30,
    responses: 6,
    interviews: 3,
    offers: 0,
    dismissedClosed: 5,
    dismissedTotal: 20,
    resumesEdited: 4,
    resumesGuardFixed: 2,
    failedRuns: 0,
    runs: 30,
    daysAtDailyCap: 0,
}

describe("cycleFor", () => {
    it("puts the start date in cycle 1 and day 30 in cycle 2", () => {
        expect(cycleFor(new Date("2026-11-12T12:00:00-05:00")).number).toBe(1)
        expect(cycleFor(new Date("2026-12-12T12:00:00-05:00")).number).toBe(2)
    })
    it("spans 30 days", () => {
        const cycle = cycleFor(new Date("2026-11-20T00:00:00-05:00"))
        expect((cycle.to.getTime() - cycle.from.getTime()) / 86_400_000).toBe(30)
    })
})

describe("rates", () => {
    it("never divides by zero", () => {
        const r = rates({ ...base, applied: 0, resumes: 0, interviews: 0 })
        expect(r.responseRate).toBe(0)
        expect(r.costPerResume).toBe(0)
        expect(r.costPerInterview).toBeNull()
    })
})

describe("findings", () => {
    it("flags a month with no recorded applications first", () => {
        expect(findings({ ...base, applied: 0 })[0]).toMatchObject({ severity: "fix", area: "Applications" })
    })
    it("flags heavy résumé editing and overspend as fixes", () => {
        const areas = findings({ ...base, resumesEdited: 15, spendCents: 1_500 })
            .filter((f) => f.severity === "fix")
            .map((f) => f.area)
        expect(areas).toEqual(expect.arrayContaining(["Résumé quality", "Budget"]))
    })
    it("reports a healthy month as good", () => {
        const result = findings(base)
        expect(result.some((f) => f.severity === "fix")).toBe(false)
        expect(result.find((f) => f.area === "Responses")?.severity).toBe("good")
    })
})

describe("scoringStopReason", () => {
    const caps = { dailyCents: 80, monthlyCents: 1_300 }
    it("lets scoring run while the résumé reserve is untouched", () => {
        expect(scoringStopReason({ ...caps, todayCents: 30, monthCents: 400 })).toBeNull()
    })
    it("stops scoring when only the day's résumé reserve is left", () => {
        expect(scoringStopReason({ ...caps, todayCents: 80 - RESUME_RESERVE_DAY_CENTS, monthCents: 400 })).toMatch(/today/)
    })
    it("stops scoring near the end of the monthly budget", () => {
        expect(scoringStopReason({ ...caps, todayCents: 0, monthCents: 1_200 })).toMatch(/month/)
    })
})
