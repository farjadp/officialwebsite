// ============================================================================
// Hardware Source: scout.test.ts
// Version: 1.0.0 — 2026-09-25
// Why: Two pure functions decide what the engine ever writes about. The
//      fingerprint decides what counts as the same story; the score decides
//      which story wins. Both are cheap to get subtly wrong and expensive to
//      notice — a bad fingerprint means the blog writes the same article twice.
// Env / Identity: vitest, pure
// ============================================================================

import { describe, it, expect } from "vitest"
import { fingerprint, canonicalUrl, scoreSignal, type RawSignal } from "../scout"

const NOW = new Date("2026-09-25T12:00:00Z")
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000)
const signal = (over: Partial<RawSignal> = {}): RawSignal => ({
    title: "t",
    url: "https://example.com/a",
    engagement: 0,
    ...over,
})

describe("canonicalUrl", () => {
    it("strips the tracking parameters feeds bolt on", () => {
        expect(canonicalUrl("https://m.com/p?utm_source=rss&utm_medium=email&ref=x")).toBe("https://m.com/p")
    })

    it("keeps parameters that actually identify the story", () => {
        expect(canonicalUrl("https://news.ycombinator.com/item?id=4242")).toBe(
            "https://news.ycombinator.com/item?id=4242",
        )
    })

    it("normalises host case, www, the fragment and a trailing slash", () => {
        expect(canonicalUrl("https://WWW.Medium.com/p/abc/#section")).toBe("https://medium.com/p/abc")
    })

    it("sorts surviving parameters so order cannot fork the identity", () => {
        expect(canonicalUrl("https://x.com/p?b=2&a=1")).toBe(canonicalUrl("https://x.com/p?a=1&b=2"))
    })

    it("leaves something unparseable alone rather than throwing", () => {
        expect(canonicalUrl("not a url")).toBe("not a url")
    })
})

describe("fingerprint", () => {
    it("collapses the same story arriving with tracking params", () => {
        expect(fingerprint("https://m.com/p?utm_source=rss&ref=x")).toBe(fingerprint("https://m.com/p"))
    })

    it("keeps genuinely different stories apart", () => {
        expect(fingerprint("https://m.com/a")).not.toBe(fingerprint("https://m.com/b"))
    })

    it("is a stable hex digest", () => {
        expect(fingerprint("https://m.com/p")).toMatch(/^[0-9a-f]{64}$/)
    })
})

describe("scoreSignal", () => {
    const ctx = (weight: number, peak?: number) => ({ weight, peakEngagement: peak, now: NOW })

    it("halves a signal's score every seven days", () => {
        const fresh = scoreSignal(signal({ engagement: 100 }), ctx(1, 100))
        const week = scoreSignal(signal({ engagement: 100, publishedAt: daysAgo(7) }), ctx(1, 100))
        expect(week).toBeCloseTo(fresh / 2, 5)

        const fortnight = scoreSignal(signal({ engagement: 100, publishedAt: daysAgo(14) }), ctx(1, 100))
        expect(fortnight).toBeCloseTo(fresh / 4, 5)
    })

    it("multiplies by the source's weight", () => {
        const one = scoreSignal(signal({ engagement: 100 }), ctx(1, 100))
        const three = scoreSignal(signal({ engagement: 100 }), ctx(3, 100))
        expect(three).toBeCloseTo(one * 3, 5)
    })

    it("treats an undated signal as fresh rather than discarding it", () => {
        // Most RSS feeds date their items; some do not, and a missing date must
        // not silently rank a live story below a fortnight-old one.
        expect(scoreSignal(signal({ engagement: 100 }), ctx(1, 100))).toBeGreaterThan(
            scoreSignal(signal({ engagement: 100, publishedAt: daysAgo(3) }), ctx(1, 100)),
        )
    })

    it("does not let a source that reports counts outrank one that does not", () => {
        // The bug this exists to prevent: the first real scout run put all six
        // leading signals on Hacker News, because HN reports points and Medium
        // and Substack report nothing. Engagement is normalised inside its own
        // source, so equal weights stay comparable and weight decides.
        const hn = scoreSignal(signal({ engagement: 876 }), ctx(2, 876))
        const essay = scoreSignal(signal({ engagement: 0 }), ctx(3, 0))
        expect(essay).toBeGreaterThan(hn)

        const hnAtEqualWeight = scoreSignal(signal({ engagement: 876 }), ctx(3, 876))
        expect(hnAtEqualWeight).toBeGreaterThan(essay)
    })

    it("lets engagement order stories inside a source without overturning weight", () => {
        const best = scoreSignal(signal({ engagement: 10_000 }), ctx(1, 10_000))
        const worst = scoreSignal(signal({ engagement: 0 }), ctx(1, 10_000))
        expect(best).toBeGreaterThan(worst)
        // The whole swing stays under one step of weight, so a busy feed can
        // never climb over a source Farjad rated higher.
        expect(best).toBeLessThan(scoreSignal(signal({ engagement: 0 }), ctx(2, 0)))
    })

    it("still scores a story with no engagement number at all", () => {
        // Substack and Medium RSS carry no counts; those signals must survive
        // on recency alone instead of scoring zero forever.
        expect(scoreSignal(signal({ engagement: 0 }), ctx(1))).toBeGreaterThan(0)
    })

    it("never returns a negative score for a future-dated item", () => {
        const future = scoreSignal(signal({ engagement: 10, publishedAt: daysAgo(-3) }), ctx(1, 10))
        expect(future).toBeGreaterThan(0)
        expect(Number.isFinite(future)).toBe(true)
    })
})
