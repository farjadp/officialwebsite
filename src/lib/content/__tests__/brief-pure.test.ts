// ============================================================================
// Hardware Source: brief-pure.test.ts
// Version: 1.0.0 — 2026-09-25
// Why: The brief is the one model call whose mistakes cost the most — it picks
//      the category and decides whether an article already exists. Both
//      decisions are made by pure code around the model, and are tested here.
// Env / Identity: vitest, pure
// ============================================================================

import { describe, it, expect } from "vitest"
import { resolveCategory, taxonomyForPrompt, type TaxonomyNode } from "../taxonomy"
import { cosine, lexicalSimilarity, contentWords } from "../similarity"

// The real tree, as read from production on 25 Sep 2026 (abridged).
const TREE: TaxonomyNode[] = [
    {
        id: "c-business",
        name: "Business",
        children: [
            { id: "c-startups", name: "Startups" },
            { id: "c-entrepreneur", name: "Entrepreneur" },
        ],
    },
    {
        id: "c-tech",
        name: "Technology",
        children: [{ id: "c-ai", name: "AI & Machine Learning" }],
    },
    { id: "c-dt", name: "Digital Transformation", children: [] },
]

describe("resolveCategory", () => {
    it("maps a chosen parent and child to their real ids", () => {
        expect(resolveCategory(TREE, "Technology", "AI & Machine Learning")).toEqual({
            categoryId: "c-tech",
            subcategoryId: "c-ai",
        })
    })

    it("matches regardless of case and surrounding space", () => {
        expect(resolveCategory(TREE, "  business ", "STARTUPS")?.subcategoryId).toBe("c-startups")
    })

    it("accepts a parent with no children and no subcategory", () => {
        expect(resolveCategory(TREE, "Digital Transformation", undefined)).toEqual({
            categoryId: "c-dt",
            subcategoryId: undefined,
        })
    })

    it("rejects a category that does not exist — the bug in the old writer", () => {
        // The old prompt offered "AI & Automation", which is in no database row,
        // so every generated post silently lost its category.
        expect(resolveCategory(TREE, "AI & Automation", "LLM Systems")).toBeNull()
    })

    it("rejects a real child filed under the wrong parent", () => {
        expect(resolveCategory(TREE, "Business", "AI & Machine Learning")).toBeNull()
    })

    it("rejects a missing subcategory when the parent has children", () => {
        // A parent with children is a folder, not a destination.
        expect(resolveCategory(TREE, "Business", undefined)).toBeNull()
    })
})

describe("taxonomyForPrompt", () => {
    it("lists every real category and child, and nothing else", () => {
        const text = taxonomyForPrompt(TREE)
        for (const name of ["Business", "Startups", "Entrepreneur", "Technology", "AI & Machine Learning", "Digital Transformation"]) {
            expect(text).toContain(name)
        }
        expect(text).not.toContain("AI & Automation")
    })
})

describe("cosine", () => {
    it("is 1 for identical direction and 0 for orthogonal vectors", () => {
        expect(cosine([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 10)
        expect(cosine([1, 0], [0, 1])).toBeCloseTo(0, 10)
    })

    it("does not mutate its inputs", () => {
        const a = [1, 2]
        const b = [3, 4]
        cosine(a, b)
        expect(a).toEqual([1, 2])
        expect(b).toEqual([3, 4])
    })

    it("throws on a length mismatch rather than returning a wrong number", () => {
        expect(() => cosine([1, 2], [1, 2, 3])).toThrow(/length/i)
    })

    it("treats a zero vector as unrelated rather than dividing by zero", () => {
        expect(cosine([0, 0], [1, 1])).toBe(0)
    })
})

describe("lexicalSimilarity", () => {
    it("drops stopwords and punctuation, keeps content words", () => {
        expect([...contentWords("Why the Best Founders Don't Raise Money!")].sort()).toEqual(
            ["best", "founders", "money", "raise"].sort(),
        )
    })

    it("scores a light rewording of the same title as near-identical", () => {
        const a = "Why most startups fail at product-market fit"
        const b = "Why Most Startups Fail At Product Market Fit"
        expect(lexicalSimilarity(a, b)).toBe(1)
    })

    it("keeps two different articles about the same broad topic apart", () => {
        const a = "How I priced my first AI consulting engagement"
        const b = "The hidden cost of running LLM agents in production"
        expect(lexicalSimilarity(a, b)).toBeLessThan(0.2)
    })

    it("is 0 for empty or stopword-only input rather than NaN", () => {
        expect(lexicalSimilarity("", "anything")).toBe(0)
        expect(lexicalSimilarity("the and of", "the and of")).toBe(0)
    })
})
