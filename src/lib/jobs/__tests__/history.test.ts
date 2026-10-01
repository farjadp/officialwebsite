// Invented companies: the real history lives in the database.
import { describe, it, expect } from "vitest"
import { formatHistory, formatSpan, parseEducation, parseHistory } from "../history"

const TEXT = `## Acme Robotics | Toronto | 2021-04 – present
titles: Founder & CEO, CTO
- Built the team from 0 to 12
- Shipped the first product

## Old Co | Halifax, NS | 2015-01 – 2019-12
titles: Engineering Lead
- Ran delivery`

describe("parseHistory", () => {
    it("reads roles, titles and facts, newest first", () => {
        const { roles, errors } = parseHistory(TEXT)
        expect(errors).toEqual([])
        expect(roles.map((r) => r.company)).toEqual(["Acme Robotics", "Old Co"])
        expect(roles[0]).toMatchObject({ location: "Toronto", start: "2021-04", end: null, titles: ["Founder & CEO", "CTO"] })
        expect(roles[0].facts).toHaveLength(2)
        expect(roles[1].location).toBe("Halifax, NS")
    })

    it("round-trips through the editor text", () => {
        const { roles } = parseHistory(TEXT)
        expect(parseHistory(formatHistory(roles)).roles).toEqual(roles)
    })

    it("refuses a header with no dates and a role with no titles", () => {
        expect(parseHistory("## Acme | Toronto\ntitles: CEO").errors[0]).toContain("YYYY-MM")
        expect(parseHistory("## Acme | 2020-01 – present\n- did things").errors[0]).toContain("titles")
    })

    it("refuses an end before the start, and text outside a role", () => {
        expect(parseHistory("## Acme | 2020-05 – 2019-01\ntitles: CEO").errors[0]).toContain("ends before")
        expect(parseHistory("- loose fact").errors[0]).toContain("outside any role")
    })

    it("accepts a plain hyphen between the dates", () => {
        expect(parseHistory("## Acme | 2020-01 - 2021-02\ntitles: CEO").roles[0].end).toBe("2021-02")
    })
})

describe("formatting", () => {
    it("writes a span the way a résumé does", () => {
        expect(formatSpan({ start: "2021-04", end: null })).toBe("Apr 2021 – Present")
        expect(formatSpan({ start: "2015-01", end: "2019-12" })).toBe("Jan 2015 – Dec 2019")
    })

    it("reads education lines with or without a year", () => {
        expect(parseEducation("MSc Software | Some University | 2014\nCertificate")).toEqual([
            { degree: "MSc Software", school: "Some University", year: "2014" },
            { degree: "Certificate", school: "", year: "" },
        ])
    })
})
