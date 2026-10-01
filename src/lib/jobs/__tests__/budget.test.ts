import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/prisma", () => ({ prisma: {} }))
vi.mock("@/lib/content/provider", () => ({ estimateCents: vi.fn() }))

import { budgetVerdict } from "../budget"

describe("budgetVerdict", () => {
    const caps = { dailyCents: 300, monthlyCents: 4000 }

    it("allows spending under both ceilings", () => {
        expect(budgetVerdict(caps, { todayCents: 299.9, monthCents: 1000 })).toEqual({ ok: true, reason: null })
    })

    it("stops at the daily ceiling and says when it resets", () => {
        const verdict = budgetVerdict(caps, { todayCents: 300, monthCents: 1000 })
        expect(verdict.ok).toBe(false)
        expect(verdict.reason).toContain("$3.00")
        expect(verdict.reason).toContain("midnight")
    })

    it("stops at the monthly ceiling even on a quiet day", () => {
        expect(budgetVerdict(caps, { todayCents: 0, monthCents: 4000 }).ok).toBe(false)
    })

    it("treats a ceiling of zero as off", () => {
        expect(budgetVerdict({ dailyCents: 0, monthlyCents: 4000 }, { todayCents: 0, monthCents: 0 }).ok).toBe(false)
    })
})
