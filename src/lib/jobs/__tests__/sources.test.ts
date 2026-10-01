// Fixtures are invented: this repository is public, and real postings and
// target companies stay in the database.
import { describe, it, expect } from "vitest"
import { adzunaUrl, boardUrl, isValidToken, normalizeAdzuna, normalizeAshby, normalizeGreenhouse, normalizeLever, normalizeRemotive } from "../sources"

describe("normalizeGreenhouse", () => {
    it("reads a job and unescapes its content", () => {
        const [job] = normalizeGreenhouse(
            {
                jobs: [
                    {
                        id: 101,
                        title: "Program Manager",
                        absolute_url: "https://example.com/jobs/101",
                        location: { name: "Toronto, ON" },
                        departments: [{ name: "Operations" }],
                        company_name: "Acme",
                        content: "&lt;p&gt;Run the &lt;b&gt;program&lt;/b&gt;&lt;/p&gt;",
                        first_published: "2026-09-01T10:00:00-04:00",
                    },
                ],
            },
            "Fallback",
        )
        expect(job).toMatchObject({
            externalId: "101",
            title: "Program Manager",
            company: "Acme",
            location: "Toronto, ON",
            department: "Operations",
            description: "Run the program",
        })
        expect(job.postedAt?.toISOString()).toBe("2026-09-01T14:00:00.000Z")
    })

    it("skips a job with no usable link and refuses a non-object payload", () => {
        expect(normalizeGreenhouse({ jobs: [{ id: 1, title: "X", absolute_url: "javascript:alert(1)" }] }, "A")).toEqual([])
        expect(() => normalizeGreenhouse([], "A")).toThrow()
    })
})

describe("normalizeLever", () => {
    it("reads a posting, its lists and its workplace type", () => {
        const [job] = normalizeLever(
            [
                {
                    id: "abc",
                    text: "Head of Product",
                    hostedUrl: "https://jobs.example.com/acme/abc",
                    categories: { location: "Remote - Canada", team: "Product" },
                    workplaceType: "remote",
                    descriptionPlain: "About the role",
                    lists: [{ text: "You will", content: "<li>Lead</li><li>Ship</li>" }],
                    createdAt: 1790000000000,
                },
            ],
            "Acme",
        )
        expect(job).toMatchObject({ company: "Acme", remoteHint: true, department: "Product", location: "Remote - Canada" })
        expect(job.description).toBe("About the role\n\nYou will\n- Lead\n- Ship")
    })

    it("returns nothing for an empty board", () => {
        expect(normalizeLever([], "Acme")).toEqual([])
    })
})

describe("normalizeAshby", () => {
    it("joins secondary locations and drops unlisted jobs", () => {
        const jobs = normalizeAshby(
            {
                jobs: [
                    {
                        id: "u1",
                        title: "GRC Manager",
                        jobUrl: "https://jobs.example.com/acme/u1",
                        location: "Toronto",
                        secondaryLocations: [{ location: "New York" }],
                        isRemote: false,
                        isListed: true,
                        descriptionPlain: "Own the ISMS",
                        publishedAt: "2026-09-15T18:21:37.401+00:00",
                    },
                    { id: "u2", title: "Hidden", jobUrl: "https://jobs.example.com/acme/u2", isListed: false },
                ],
            },
            "Acme",
        )
        expect(jobs).toHaveLength(1)
        expect(jobs[0]).toMatchObject({ location: "Toronto; New York", remoteHint: false, description: "Own the ISMS" })
    })
})

describe("normalizeRemotive", () => {
    it("treats every posting as remote and reads who may apply", () => {
        const [job] = normalizeRemotive({
            jobs: [
                {
                    id: 7,
                    title: "Technical Program Manager",
                    url: "https://remotive.example/jobs/7",
                    company_name: "Acme",
                    category: "Project Management",
                    candidate_required_location: "Canada, USA",
                    description: "<p>Hello</p>",
                    publication_date: "2026-09-20T08:00:00",
                },
            ],
        })
        expect(job).toMatchObject({ externalId: "7", remoteHint: true, location: "Canada, USA", description: "Hello" })
    })
})

describe("tokens", () => {
    it("refuses anything that could change the path", () => {
        expect(isValidToken("GREENHOUSE", "acme")).toBe(true)
        expect(isValidToken("GREENHOUSE", "../admin")).toBe(false)
        expect(isValidToken("LEVER", "acme/../x")).toBe(false)
        expect(isValidToken("ASHBY", "https://evil.example")).toBe(false)
        expect(isValidToken("REMOTIVE", "product manager")).toBe(true)
    })

    it("encodes a search phrase into the query", () => {
        expect(boardUrl("REMOTIVE", "product manager")).toBe("https://remotive.com/api/remote-jobs?search=product%20manager")
    })
})

describe("Adzuna", () => {
    it("reads a result, strips the highlight and adds the searched country", () => {
        const [job] = normalizeAdzuna(
            {
                results: [
                    {
                        id: "42",
                        title: "Senior <strong>Product</strong> Lead",
                        redirect_url: "https://www.adzuna.ca/land/ad/42",
                        company: { display_name: "Acme" },
                        location: { display_name: "Ottawa, Ontario" },
                        category: { label: "IT Jobs" },
                        description: "Lead the roadmap…",
                        created: "2026-09-28T12:00:00Z",
                    },
                ],
            },
            "ca",
        )
        expect(job).toMatchObject({ title: "Senior Product Lead", company: "Acme", location: "Ottawa, Ontario, Canada", department: "IT Jobs" })
    })

    it("validates country-prefixed searches and keeps credentials out of the URL", () => {
        expect(isValidToken("ADZUNA", "ca:product manager")).toBe(true)
        expect(isValidToken("ADZUNA", "uk:product manager")).toBe(false)
        expect(isValidToken("ADZUNA", "product manager")).toBe(false)
        const url = adzunaUrl("us:full stack developer", 2)
        expect(url).toContain("/jobs/us/search/2?")
        expect(url).toContain("what_phrase=full+stack+developer")
        expect(url).not.toContain("app_key")
    })

    it("accepts an optional category and puts it in the query", () => {
        expect(isValidToken("ADZUNA", "ca/it-jobs:project manager")).toBe(true)
        expect(isValidToken("ADZUNA", "ca/../x:project manager")).toBe(false)
        expect(adzunaUrl("ca/it-jobs:project manager", 1)).toContain("category=it-jobs")
        expect(adzunaUrl("ca:project manager", 1)).not.toContain("category=")
    })
})
