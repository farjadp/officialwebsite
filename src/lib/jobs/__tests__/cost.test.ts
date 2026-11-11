import { describe, expect, it } from "vitest"
import { DEFAULT_AGENT_DOCUMENTS_PER_DAY, agentDocumentsCap, budgetWarning } from "../cost"

describe("agentDocumentsCap", () => {
    it("falls back to the default for missing or bad values", () => {
        expect(agentDocumentsCap(undefined)).toBe(DEFAULT_AGENT_DOCUMENTS_PER_DAY)
        expect(agentDocumentsCap("ten")).toBe(DEFAULT_AGENT_DOCUMENTS_PER_DAY)
        expect(agentDocumentsCap("-3")).toBe(DEFAULT_AGENT_DOCUMENTS_PER_DAY)
    })

    it("accepts a number and clamps a huge one", () => {
        expect(agentDocumentsCap("5")).toBe(5)
        expect(agentDocumentsCap("0")).toBe(0)
        expect(agentDocumentsCap("999")).toBe(50)
    })
})

describe("budgetWarning", () => {
    const caps = { dailyCents: 300, monthlyCents: 1000 }

    it("stays quiet under 80%", () => {
        expect(budgetWarning({ ...caps, todayCents: 100, monthCents: 500 })).toBeNull()
    })

    it("warns on the month first, then the day", () => {
        expect(budgetWarning({ ...caps, todayCents: 250, monthCents: 850 })).toMatch(/this month/)
        expect(budgetWarning({ ...caps, todayCents: 250, monthCents: 300 })).toMatch(/today/)
    })

    it("ignores a cap of zero", () => {
        expect(budgetWarning({ dailyCents: 0, monthlyCents: 0, todayCents: 999, monthCents: 999 })).toBeNull()
    })
})
