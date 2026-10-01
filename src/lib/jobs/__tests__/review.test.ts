import { describe, it, expect } from "vitest"
import { droppedQualifiers, findTells, instantChecks, keywordCoverage } from "../review"
import type { Resume } from "../documents"

const resume = (over: Partial<Resume> = {}): Resume => ({
    name: "Test",
    headline: "Program manager",
    contact: ["Toronto", "t@example.com", "+1 416 555 0100"],
    summary: "Runs programs.",
    roles: [{ company: "Acme", location: "", span: "Jan 2020 – Present", title: "PM", bullets: ["Ran delivery for 3 teams"] }],
    skills: ["Scrum", "Next.js"],
    education: [],
    certifications: [],
    ...over,
})

describe("droppedQualifiers", () => {
    const source = "Helped teams secure nearly $5M in funding. Mentored more than 50 teams. Built a team of 12."
    it("flags a qualified figure stated bare", () => {
        expect(droppedQualifiers("Facilitated $5M funding", source)).toEqual(["5"])
        expect(droppedQualifiers("Mentored over 50 teams and nearly $5M", source)).toEqual([])
    })
    it("ignores figures the record never qualified", () => {
        expect(droppedQualifiers("Built a team of 12", source)).toEqual([])
    })
})

describe("findTells", () => {
    it("finds stock phrases as whole words", () => {
        expect(findTells("Spearheaded a robust, seamless rollout")).toEqual([
            { phrase: "spearheaded", count: 1 },
            { phrase: "seamless", count: 1 },
            { phrase: "robust", count: 1 },
        ])
        expect(findTells("Robustness testing")).toEqual([])
    })
})

describe("keywordCoverage", () => {
    it("matches case, punctuation and simple plurals", () => {
        expect(keywordCoverage(["Next.js", "stakeholder", "Kubernetes"], "Built Next.js apps for stakeholders")).toEqual({
            matched: ["Next.js", "stakeholder"],
            missing: ["Kubernetes"],
        })
    })
})

describe("instantChecks", () => {
    it("fails an invented figure and a dropped qualifier", () => {
        const source = "Helped secure nearly $5M. Ran delivery for 3 teams. 2020"
        const checks = instantChecks(resume({ summary: "Raised $5M and grew revenue 40%." }), "", source)
        const labels = checks.filter((c) => c.level === "fail").map((c) => c.label)
        expect(labels).toContain("Figures not in your profile: 40")
        expect(labels).toContain("Qualifier dropped on: 5")
    })

    it("fails a header with no phone", () => {
        const checks = instantChecks(resume({ contact: ["t@example.com"] }), "", "3")
        expect(checks[0].level).toBe("fail")
    })
})
