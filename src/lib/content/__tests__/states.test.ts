// ============================================================================
// Hardware Source: states.test.ts
// Version: 1.0.0 — 2026-09-25
// Why: The transition table decides whether an article is rewritten, published,
//      or handed to Farjad. It is the one piece of the engine that must be
//      readable in one screen and provable without a database.
// Env / Identity: vitest, pure
// ============================================================================

import { describe, it, expect } from "vitest"
import { nextState, JOB_STATES, TERMINAL_STATES, isTerminal } from "../states"

const OPTS = { maxRevisions: 2 }
const at = (state: (typeof JOB_STATES)[number], iteration = 0) => ({ state, iteration })

describe("nextState — the happy path", () => {
    it("walks scout → brief → draft → seo → review", () => {
        expect(nextState(at("SCOUTED"), { kind: "ok" }, OPTS)).toBe("BRIEFED")
        expect(nextState(at("BRIEFED"), { kind: "ok" }, OPTS)).toBe("DRAFTED")
        expect(nextState(at("DRAFTED"), { kind: "ok" }, OPTS)).toBe("SEO_PASS")
        expect(nextState(at("SEO_PASS"), { kind: "ok" }, OPTS)).toBe("REVIEW")
    })

    it("walks a passing review through Persian, art and publication", () => {
        expect(nextState(at("REVIEW"), { kind: "review", verdict: "PASS" }, OPTS)).toBe("FA_DRAFT")
        expect(nextState(at("FA_DRAFT"), { kind: "ok" }, OPTS)).toBe("FA_REVIEW")
        expect(nextState(at("FA_REVIEW"), { kind: "persian", pass: true }, OPTS)).toBe("ART")
        expect(nextState(at("ART"), { kind: "ok" }, OPTS)).toBe("READY")
        expect(nextState(at("READY"), { kind: "ok" }, OPTS)).toBe("PUBLISHED")
    })
})

describe("nextState — the review loop", () => {
    it("returns to the writer when the reviewer asks for changes under the limit", () => {
        expect(nextState(at("REVIEW", 1), { kind: "review", verdict: "REVISE" }, OPTS)).toBe("REVISING")
        expect(nextState(at("REVISING", 1), { kind: "ok" }, OPTS)).toBe("DRAFTED")
    })

    it("hands the job to Farjad once revisions are exhausted", () => {
        expect(nextState(at("REVIEW", 2), { kind: "review", verdict: "REVISE" }, OPTS)).toBe("NEEDS_HUMAN")
    })

    it("blocks on BLOCK whatever the score and whatever the iteration", () => {
        expect(nextState(at("REVIEW", 0), { kind: "review", verdict: "BLOCK" }, OPTS)).toBe("NEEDS_HUMAN")
    })
})

describe("nextState — Persian never blocks English", () => {
    it("rewrites the Persian article when its gate fails under the limit", () => {
        expect(nextState(at("FA_REVIEW", 0), { kind: "persian", pass: false }, OPTS)).toBe("FA_DRAFT")
    })

    it("carries on to art when the Persian gate keeps failing — English still ships", () => {
        // The Persian post stays a draft; the job does NOT stall on it.
        expect(nextState(at("FA_REVIEW", 2), { kind: "persian", pass: false }, OPTS)).toBe("ART")
    })
})

describe("nextState — failure", () => {
    it("ends a job whose brief duplicates an existing article", () => {
        expect(nextState(at("SCOUTED"), { kind: "duplicate" }, OPTS)).toBe("FAILED")
    })

    it("ends a job on an unrecoverable error from any state", () => {
        for (const state of ["BRIEFED", "DRAFTED", "ART"] as const) {
            expect(nextState(at(state), { kind: "error" }, OPTS)).toBe("FAILED")
        }
    })

    it("refuses to move a job that has already finished", () => {
        for (const state of TERMINAL_STATES) {
            expect(() => nextState(at(state), { kind: "ok" }, OPTS)).toThrow(/terminal/i)
        }
    })

    it("refuses an outcome the current state cannot produce", () => {
        // A plain "ok" tells us nothing about a review's verdict.
        expect(() => nextState(at("REVIEW"), { kind: "ok" }, OPTS)).toThrow(/REVIEW/)
        expect(() => nextState(at("FA_REVIEW"), { kind: "ok" }, OPTS)).toThrow(/FA_REVIEW/)
    })
})

describe("the table itself", () => {
    it("marks exactly the three end states terminal", () => {
        expect([...TERMINAL_STATES].sort()).toEqual(["FAILED", "NEEDS_HUMAN", "PUBLISHED"])
        expect(isTerminal("PUBLISHED")).toBe(true)
        expect(isTerminal("REVIEW")).toBe(false)
    })

    it("leaves no non-terminal state without a way forward", () => {
        for (const state of JOB_STATES) {
            if (isTerminal(state)) continue
            const moved = [
                { kind: "ok" } as const,
                { kind: "review", verdict: "PASS" } as const,
                { kind: "persian", pass: true } as const,
            ].some((outcome) => {
                try {
                    return Boolean(nextState(at(state), outcome, OPTS))
                } catch {
                    return false
                }
            })
            expect(moved, `${state} has no successful outcome`).toBe(true)
        }
    })
})
