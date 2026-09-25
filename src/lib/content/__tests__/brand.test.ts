// ============================================================================
// Hardware Source: brand.test.ts
// Version: 1.0.0 — 2026-09-25
// Why: The fact table is what the reviewer treats as true. A slip here — a
//      Latin digit in the Persian line, a missing source, a figure rounded up —
//      is published under the engine's own "verified" label.
// Env / Identity: vitest, pure
// ============================================================================

import { describe, it, expect } from "vitest"
import { FACTS, VOICE, factsForPrompt } from "../brand"

const facts = Object.entries(FACTS)

describe("FACTS", () => {
    it("gives every fact an English line, a Persian line and a source", () => {
        for (const [key, fact] of facts) {
            expect(fact.claim.trim(), key).not.toBe("")
            expect(fact.claimFa.trim(), key).not.toBe("")
            expect(fact.source.trim(), key).not.toBe("")
        }
    })

    it("writes Persian figures in Persian digits", () => {
        // Latin tokens that are names, not figures, are the only exception.
        for (const [key, fact] of facts) {
            const withoutNames = fact.claimFa.replace(/ISO 27001|B2B/g, "")
            expect(withoutNames, key).not.toMatch(/[0-9]/)
        }
    })

    it("uses Persian yeh and kaf, never the Arabic letters", () => {
        for (const [key, fact] of facts) expect(fact.claimFa, key).not.toMatch(/[يك]/)
    })

    it("joins every mi- verb prefix with a zero-width non-joiner", () => {
        for (const [key, fact] of facts) {
            expect(fact.claimFa, key).not.toMatch(/(^|\s)ن?می [؀-ۿ]/)
        }
    })

    it("never adds funding and service grants into one figure", () => {
        // Nearly $5M raised and nearly $5M in grants were given as two figures.
        // "$10M" was never stated, and must not appear as if it had been.
        const everything = [...facts.map(([, f]) => f.claim + " " + f.claimFa), VOICE].join(" ")
        expect(everything).not.toMatch(/\$ ?10 ?M|10 million|۱۰ میلیون/i)
        expect(VOICE).toMatch(/Never add them into\s+one/i)
    })

    it("keeps the conservative figure first", () => {
        expect(FACTS.mentoring.claim).toMatch(/^has mentored more than 50/)
        expect(FACTS.funding.claim).toMatch(/nearly \$5M/)
    })
})

describe("factsForPrompt", () => {
    it("renders the table in the article's language", () => {
        expect(factsForPrompt("en")).toContain("more than 50 startup teams")
        expect(factsForPrompt("fa")).toContain("بیش از ۵۰ تیم")
        expect(factsForPrompt("fa")).not.toContain("more than 50")
    })
})
