import { describe, it, expect } from "vitest"
import { prefilter } from "../prefilter"
import { parseLanes, parseProfile, ProfileSchema, formatLanes } from "../profile"

const profile = ProfileSchema.parse({
    lanes: [
        { key: "product", label: "Product", keywords: ["product manager", "head of product"] },
        { key: "programs", label: "Programs", keywords: ["program manager"] },
    ],
    excludeTitleKeywords: ["intern", "junior"],
})
const toronto = { country: "CA" as const, remote: false }

describe("prefilter", () => {
    it("passes a title that matches a lane, and names the lane", () => {
        expect(prefilter("Senior Product Manager, Growth", toronto, profile)).toEqual({
            verdict: "PASS", lane: "product", reason: null,
        })
    })

    it("matches whole words only", () => {
        // "production manager" must not match "product manager"
        expect(prefilter("Production Manager", toronto, profile).verdict).toBe("REJECT")
        // "internal" must not trip the "intern" exclusion
        expect(prefilter("Program Manager, Internal Tools", toronto, profile).verdict).toBe("PASS")
    })

    it("lets an exclusion beat a lane match", () => {
        const result = prefilter("Junior Product Manager", toronto, profile)
        expect(result).toMatchObject({ verdict: "REJECT", reason: 'Title contains "junior"' })
    })

    it("rejects a title in no lane", () => {
        expect(prefilter("Staff Accountant", toronto, profile).reason).toBe("Title matches no lane")
    })

    it("rejects a place outside both countries", () => {
        expect(prefilter("Product Manager", { country: "OTHER", remote: true }, profile).verdict).toBe("REJECT")
    })

    it("passes an unplaced remote posting and rejects an unplaced on-site one", () => {
        expect(prefilter("Product Manager", { country: null, remote: true }, profile).verdict).toBe("PASS")
        expect(prefilter("Product Manager", { country: null, remote: false }, profile).verdict).toBe("REJECT")
    })

    it("passes US, CA and NA", () => {
        for (const country of ["US", "CA", "NA"] as const) {
            expect(prefilter("Product Manager", { country, remote: false }, profile).verdict).toBe("PASS")
        }
    })

    it("rejects everything while the profile has no lanes", () => {
        expect(prefilter("Product Manager", toronto, ProfileSchema.parse({})).verdict).toBe("REJECT")
    })
})

describe("profile text", () => {
    it("round-trips lanes through the editor's text form", () => {
        const { lanes, errors } = parseLanes("Product: product manager, head of product\n\nPrograms: program manager")
        expect(errors).toEqual([])
        expect(lanes).toEqual(profile.lanes)
        expect(parseLanes(formatLanes(lanes)).lanes).toEqual(lanes)
    })

    it("reports a line it cannot read instead of dropping it", () => {
        expect(parseLanes("just some words").errors).toHaveLength(1)
        expect(parseLanes("A: x\nA: y").errors).toEqual(['Two lanes are called "A"'])
    })

    it("reads a missing or broken stored profile as empty", () => {
        expect(parseProfile(null).lanes).toEqual([])
        expect(parseProfile("{not json").lanes).toEqual([])
        expect(parseProfile('{"lanes":"nope"}').lanes).toEqual([])
    })
})
