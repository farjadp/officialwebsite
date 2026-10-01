import { describe, it, expect } from "vitest"
import { applyEdit, allowedTitles, type Edit } from "../editor"
import type { Resume } from "../documents"
import type { Role } from "../history"

const history: Role[] = [{ company: "Acme", location: "Toronto", start: "2021-04", end: null, titles: ["Founder & CEO", "CTO"], facts: [] }]
const stored: Resume = {
    name: "T", headline: "h", contact: [], summary: "s",
    roles: [{ company: "Acme", location: "Toronto", span: "Apr 2021 – Present", title: "CTO", bullets: ["a"] }],
    skills: [], education: [], certifications: [],
}
const edit = (over: Partial<Edit> = {}): Edit => ({
    headline: " New headline ", summary: "New summary", coverLetter: "", skills: ["Go", " "],
    roles: [{ title: "Founder & CEO", bullets: ["one", "", " two "] }], ...over,
})

describe("applyEdit", () => {
    it("takes the wording and a listed title, and cleans empty lines", () => {
        const { resume, error } = applyEdit(stored, edit(), history)
        expect(error).toBeUndefined()
        expect(resume.headline).toBe("New headline")
        expect(resume.roles[0]).toMatchObject({ title: "Founder & CEO", bullets: ["one", "two"], span: "Apr 2021 – Present" })
        expect(resume.skills).toEqual(["Go"])
    })

    it("keeps the stored title when the browser sends one the profile does not list", () => {
        expect(applyEdit(stored, edit({ roles: [{ title: "Chief AI Officer", bullets: [] }] }), history).resume.roles[0].title).toBe("CTO")
    })

    it("refuses a different number of roles", () => {
        expect(applyEdit(stored, edit({ roles: [] }), history).error).toBeDefined()
    })

    it("lists the profile's titles for a role", () => {
        expect(allowedTitles(stored.roles[0], history)).toEqual(["Founder & CEO", "CTO"])
    })
})
