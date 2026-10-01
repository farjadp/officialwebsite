import { describe, it, expect } from "vitest"
import { collapseDuplicates, evaluate, planIngest, type Known } from "../plan"
import { ProfileSchema } from "../profile"
import { fingerprint, type RawPosting } from "../types"

const profile = ProfileSchema.parse({
    lanes: [{ key: "product", label: "Product", keywords: ["product manager"] }],
})

const raw = (id: string, title = "Product Manager", location = "Toronto, ON"): RawPosting => ({
    externalId: id,
    title,
    company: "Acme",
    location,
    remoteHint: null,
    department: null,
    url: `https://example.com/${id}`,
    description: "Long description",
    postedAt: null,
})

const known = (id: string, extra: Partial<Known> = {}): Known => ({
    id: `row-${id}`,
    fingerprint: fingerprint("LEVER", "acme", id),
    prefilter: "PASS",
    lane: "product",
    country: "CA",
    remote: false,
    missedRuns: 0,
    closedAt: null,
    ...extra,
})

describe("fingerprint", () => {
    it("is stable and ignores token case", () => {
        expect(fingerprint("LEVER", "Acme", "1")).toBe(fingerprint("LEVER", "acme", "1"))
        expect(fingerprint("LEVER", "acme", "1")).not.toBe(fingerprint("ASHBY", "acme", "1"))
    })
})

describe("evaluate", () => {
    it("keeps the description only for a posting that passes", () => {
        expect(evaluate("LEVER", "acme", raw("1"), profile).description).toBe("Long description")
        expect(evaluate("LEVER", "acme", raw("2", "Accountant"), profile).description).toBeNull()
    })
})

describe("planIngest", () => {
    it("creates what is new and refreshes what is known", () => {
        const plan = planIngest("LEVER", "acme", [raw("1"), raw("2")], [known("1")], profile)
        expect(plan.create.map((p) => p.externalId)).toEqual(["2"])
        expect(plan.refresh).toHaveLength(1)
        expect(plan.refresh[0]).toMatchObject({ id: "row-1", changed: false, verdictChanged: false })
    })

    it("does not insert the same id twice", () => {
        expect(planIngest("LEVER", "acme", [raw("1"), raw("1")], [], profile).create).toHaveLength(1)
    })

    it("flags a posting whose verdict changed with the profile", () => {
        const plan = planIngest("LEVER", "acme", [raw("1")], [known("1", { prefilter: "REJECT", lane: null })], profile)
        expect(plan.refresh[0].verdictChanged).toBe(true)
    })

    it("refreshes a re-read location without calling it a new verdict", () => {
        const plan = planIngest("LEVER", "acme", [raw("1")], [known("1", { country: "US" })], profile)
        expect(plan.refresh[0]).toMatchObject({ changed: true, verdictChanged: false })
    })

    it("closes a posting on its second consecutive miss, not its first", () => {
        const first = planIngest("LEVER", "acme", [], [known("1")], profile)
        expect(first.missed).toEqual([{ id: "row-1", missedRuns: 1, close: false }])

        const second = planIngest("LEVER", "acme", [], [known("1", { missedRuns: 1 })], profile)
        expect(second.missed).toEqual([{ id: "row-1", missedRuns: 2, close: true }])
    })

    it("leaves an already closed posting alone", () => {
        const plan = planIngest("LEVER", "acme", [], [known("1", { missedRuns: 2, closedAt: new Date() })], profile)
        expect(plan.missed).toEqual([])
    })
})

describe("collapseDuplicates", () => {
    it("keeps one row per company and title, the best scored, with the other places", () => {
        const rows = [
            { id: "a", company: "Acme", title: "CTO (AI)", score: 70, location: "Toronto" },
            { id: "b", company: "Other", title: "PM", score: 60, location: "Ottawa" },
            { id: "c", company: "ACME", title: "CTO", score: 85, location: "Canada" },
        ]
        const out = collapseDuplicates(rows)
        expect(out.map((r) => r.id)).toEqual(["c", "b"])
        expect(out[0].alsoAt).toEqual(["Toronto"])
    })
})
