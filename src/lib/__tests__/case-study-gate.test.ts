import { describe, expect, it } from "vitest"
import {
    LINK_TTL_MS,
    MAX_SENDS_PER_DAY,
    RESEND_GAP_MS,
    canSendAgain,
    isGatedSlug,
    leadToolId,
    requestSchema,
    sendsFromAnswers,
    signLink,
    verifyLink,
} from "@/lib/case-study-gate"
import { buildCaseStudyEmail } from "@/lib/email/case-study-email"
import { COVERAGE, ERAS, EMAIL_TYPES, SECTORS, TOTAL, YEARS_VALID } from "@/components/v3/case-studies/belink/data"
import { COPY } from "@/components/v3/case-studies/belink/copy"
import { SAMPLE_ROWS } from "@/components/v3/case-studies/belink/sample"

const SECRET = "test-secret-not-real"
const NOW = Date.UTC(2026, 10, 16, 12)

describe("signed reading link", () => {
    const claims = { slug: "belink" as const, leadId: "lead_123", exp: NOW + LINK_TTL_MS }

    it("round-trips a valid link", () => {
        const token = signLink(claims, SECRET)
        expect(verifyLink(token, "belink", SECRET, NOW)).toEqual({ ok: true, claims })
    })

    it("rejects an expired link", () => {
        const token = signLink(claims, SECRET)
        expect(verifyLink(token, "belink", SECRET, claims.exp + 1)).toEqual({ ok: false, reason: "expired" })
    })

    it("rejects a link signed with another secret", () => {
        const token = signLink(claims, "other-secret")
        expect(verifyLink(token, "belink", SECRET, NOW)).toEqual({ ok: false, reason: "bad-signature" })
    })

    it("rejects a tampered payload (e.g. extended expiry)", () => {
        const [, sig] = signLink(claims, SECRET).split(".")
        const forged = Buffer.from(`belink|lead_123|${NOW + 10 * LINK_TTL_MS}`).toString("base64url")
        expect(verifyLink(`${forged}.${sig}`, "belink", SECRET, NOW).ok).toBe(false)
    })

    it("rejects junk, empty and oversized tokens", () => {
        for (const t of [undefined, null, "", "abc", "a.b.c", ".", "x".repeat(600)]) {
            expect(verifyLink(t, "belink", SECRET, NOW).ok).toBe(false)
        }
    })

    it("refuses to work without a secret", () => {
        const token = signLink(claims, SECRET)
        expect(verifyLink(token, "belink", "", NOW).ok).toBe(false)
        expect(() => signLink(claims, "")).toThrow()
    })
})

describe("resend cooldown", () => {
    it("allows the first send", () => {
        expect(canSendAgain([], NOW)).toBe(true)
    })
    it("blocks a second send inside the gap", () => {
        expect(canSendAgain([NOW - RESEND_GAP_MS + 1000], NOW)).toBe(false)
    })
    it("allows a send after the gap", () => {
        expect(canSendAgain([NOW - RESEND_GAP_MS - 1000], NOW)).toBe(true)
    })
    it("caps sends per rolling day", () => {
        const sends = Array.from({ length: MAX_SENDS_PER_DAY }, (_, i) => NOW - (i + 1) * 60 * 60 * 1000)
        expect(canSendAgain(sends, NOW)).toBe(false)
        expect(canSendAgain(sends.map((t) => t - 24 * 60 * 60 * 1000), NOW)).toBe(true)
    })
    it("reads the send log out of stored answers, ignoring junk", () => {
        const iso = new Date(NOW).toISOString()
        expect(sendsFromAnswers({ sends: [iso, "nope", NOW, null] })).toEqual([NOW, NOW])
        expect(sendsFromAnswers(null)).toEqual([])
        expect(sendsFromAnswers({ sends: "x" })).toEqual([])
    })
})

describe("request schema", () => {
    const base = { slug: "belink", email: "  Test@Example.COM ", consent: true, locale: "en" }

    it("normalises the email and defaults the opt-in to false", () => {
        const r = requestSchema("en").parse(base)
        expect(r.email).toBe("test@example.com")
        expect(r.marketingOptIn).toBe(false)
        expect(r.name).toBe("")
    })
    it("requires delivery consent", () => {
        const r = requestSchema("fa").safeParse({ ...base, consent: false })
        expect(r.success).toBe(false)
    })
    it("rejects bad emails and unknown case studies", () => {
        expect(requestSchema("en").safeParse({ ...base, email: "not-an-email" }).success).toBe(false)
        expect(requestSchema("en").safeParse({ ...base, slug: "herestate" }).success).toBe(false)
        expect(requestSchema("en").safeParse({ ...base, slug: "__proto__" }).success).toBe(false)
    })
    it("knows which slugs are gated", () => {
        expect(isGatedSlug("belink")).toBe(true)
        expect(isGatedSlug("toString")).toBe(false)
        expect(leadToolId("belink")).toBe("case-study:belink")
    })
})

describe("delivery email", () => {
    const base = {
        title: "Mapping <Iran>",
        link: "https://www.farjadp.info/portfolio/belink/report?t=abc&x=1",
        expiresAt: new Date(NOW + LINK_TTL_MS),
        postalAddress: "1 Test St, Newmarket ON",
    }

    it("escapes the name, title and link", () => {
        const { html } = buildCaseStudyEmail({ ...base, locale: "en", name: `<script>alert(1)</script>` })
        expect(html).not.toContain("<script>")
        expect(html).toContain("Mapping &lt;Iran&gt;")
        expect(html).toContain("t=abc&amp;x=1")
    })

    it("is right-to-left in Persian and left-to-right in English", () => {
        expect(buildCaseStudyEmail({ ...base, locale: "fa" }).html).toContain('dir="rtl"')
        expect(buildCaseStudyEmail({ ...base, locale: "en" }).html).toContain('dir="ltr"')
    })

    it("carries the link and the postal address in the text part", () => {
        const { text, subject } = buildCaseStudyEmail({ ...base, locale: "en" })
        expect(text).toContain(base.link)
        expect(text).toContain(base.postalAddress)
        expect(subject).toContain("Mapping <Iran>")
    })
})

describe("published Belink figures", () => {
    it("are internally consistent", () => {
        for (const c of COVERAGE) expect(c.n).toBeLessThanOrEqual(TOTAL)
        expect(ERAS.reduce((a, e) => a + e.n, 0)).toBe(YEARS_VALID)
        expect(EMAIL_TYPES.corporate + EMAIL_TYPES.free).toBeLessThanOrEqual(COVERAGE.find((c) => c.key === "email")!.n)
        const sectors = SECTORS.map((s) => s.n)
        expect([...sectors].sort((a, b) => b - a)).toEqual(sectors)
    })

    it("keep English and Persian copy the same shape", () => {
        const shape = (o: unknown): unknown =>
            Array.isArray(o) ? o.map(shape) : o && typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, shape(v)])) : typeof o
        expect(shape(COPY.fa)).toEqual(shape(COPY.en))
    })
})

describe("public Belink sample rows", () => {
    it("never expose a full email or phone number", () => {
        expect(SAMPLE_ROWS.length).toBe(10)
        for (const r of SAMPLE_ROWS) {
            expect(r.email).toMatch(/^[a-z0-9]\*\*\*@[^@\s]+$/)
            expect(r.phone).toMatch(/^\d{3}-••••-\d{2}$/)
            expect(JSON.stringify(r)).not.toMatch(/\d{6,}/)
            expect(Object.keys(r).sort()).toEqual(["email", "name", "phone", "sector", "social", "website", "year"])
        }
    })
})

describe("dataset download", () => {
    it("puts a download button above the read button when a dataset exists", () => {
        const { html, text } = buildCaseStudyEmail({
            locale: "en",
            title: "T",
            link: "https://www.farjadp.info/portfolio/belink/report?t=a",
            downloadLink: "https://www.farjadp.info/api/case-study/download?t=a",
            downloadLabel: "Download the Excel",
            expiresAt: new Date(NOW + LINK_TTL_MS),
        })
        expect(html.indexOf("/api/case-study/download")).toBeGreaterThan(-1)
        expect(html.indexOf("/api/case-study/download")).toBeLessThan(html.indexOf("/portfolio/belink/report"))
        expect(text).toContain("Download the Excel: https://www.farjadp.info/api/case-study/download?t=a")
    })
    it("leaves the download out when there is no dataset", () => {
        const { html } = buildCaseStudyEmail({ locale: "fa", title: "T", link: "https://x/r", expiresAt: new Date(NOW) })
        expect(html).not.toContain("download")
    })
})
