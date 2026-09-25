// ============================================================================
// Hardware Source: agents.test.ts
// Version: 1.0.0 — 2026-09-25
// Why: Which model runs which agent is a setting Farjad edits from the admin.
//      A bad edit must fail loudly here, not silently produce a reviewer that
//      grades its own writer's output.
// Env / Identity: vitest, pure — no database, no network
// ============================================================================

import { describe, it, expect } from "vitest"
import {
    resolveAgentFrom,
    AGENT_NAMES,
    DEFAULT_AGENTS,
    DEFAULT_MODEL_FOR_PROVIDER,
} from "../agents"

describe("resolveAgentFrom", () => {
    it("falls back to the built-in default when nothing is set", () => {
        expect(resolveAgentFrom("brief", {})).toEqual(DEFAULT_AGENTS.brief)
    })

    it("prefers a stored setting over the default", () => {
        const resolved = resolveAgentFrom("brief", {
            "content.agent.brief.provider": "anthropic",
            "content.agent.brief.model": "claude-opus-5",
        })
        expect(resolved).toEqual({ provider: "anthropic", model: "claude-opus-5" })
    })

    it("takes a stored provider while keeping that provider's default model", () => {
        const resolved = resolveAgentFrom("brief", {
            "content.agent.brief.provider": "anthropic",
        })
        expect(resolved.provider).toBe("anthropic")
        expect(resolved.model).toBe(DEFAULT_MODEL_FOR_PROVIDER.anthropic)
    })

    it("rejects a reviewer running on the same provider as its own writer", () => {
        const settings = {
            "content.agent.writer.fa.provider": "openai",
            "content.agent.review.fa.provider": "openai",
        }
        expect(() => resolveAgentFrom("review.fa", settings)).toThrow(/same provider/i)
        // The writer itself still resolves — only the reviewer is the conflict.
        expect(resolveAgentFrom("writer.fa", settings).provider).toBe("openai")
    })

    it("checks the English pair independently of the Persian pair", () => {
        const settings = {
            "content.agent.writer.en.provider": "google",
            "content.agent.review.en.provider": "google",
        }
        expect(() => resolveAgentFrom("review.en", settings)).toThrow(/same provider/i)
        expect(() => resolveAgentFrom("review.fa", settings)).not.toThrow()
    })

    it("rejects an unknown provider instead of passing it to an adapter", () => {
        expect(() =>
            resolveAgentFrom("brief", { "content.agent.brief.provider": "llama" }),
        ).toThrow(/unknown provider/i)
    })

    it("rejects an unknown agent name", () => {
        // @ts-expect-error — the guard exists for settings written by hand
        expect(() => resolveAgentFrom("writer.de", {})).toThrow(/unknown agent/i)
    })

    it("ships a default for every agent, and no reviewer shares its writer", () => {
        for (const name of AGENT_NAMES) {
            expect(DEFAULT_AGENTS[name].model).toBeTruthy()
            expect(() => resolveAgentFrom(name, {})).not.toThrow()
        }
        expect(DEFAULT_AGENTS["review.en"].provider).not.toBe(DEFAULT_AGENTS["writer.en"].provider)
        expect(DEFAULT_AGENTS["review.fa"].provider).not.toBe(DEFAULT_AGENTS["writer.fa"].provider)
    })
})
