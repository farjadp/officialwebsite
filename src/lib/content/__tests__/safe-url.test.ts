// ============================================================================
// Hardware Source: safe-url.test.ts
// Version: 1.0.0 — 2026-09-25
// Why: Every address the scout fetches comes from a row an admin typed. A
//      server that fetches whatever it is told will happily fetch its own
//      internal network — cloud metadata, a local database admin, localhost —
//      and hand the body back through the admin UI.
// Env / Identity: vitest, pure
// ============================================================================

import { describe, it, expect } from "vitest"
import { assertPublicUrl } from "../safe-url"

describe("assertPublicUrl", () => {
    it("accepts ordinary public feeds", () => {
        expect(() => assertPublicUrl("https://stratechery.com/feed/")).not.toThrow()
        expect(() => assertPublicUrl("https://www.reddit.com/r/startups/top.rss?t=week")).not.toThrow()
        expect(() => assertPublicUrl("http://example.com/rss")).not.toThrow()
    })

    it("refuses anything that is not http or https", () => {
        for (const url of ["file:///etc/passwd", "ftp://example.com/x", "gopher://x", "data:text/plain,hi"]) {
            expect(() => assertPublicUrl(url), url).toThrow(/protocol/i)
        }
    })

    it("refuses loopback and localhost in every spelling", () => {
        for (const url of [
            "http://localhost/",
            "http://LOCALHOST:5433/",
            "http://api.localhost/",
            "http://127.0.0.1/",
            "http://127.8.8.8/",
            "http://[::1]/",
            "http://0.0.0.0/",
        ]) {
            expect(() => assertPublicUrl(url), url).toThrow(/private|local/i)
        }
    })

    it("refuses the private and link-local ranges, including cloud metadata", () => {
        for (const url of [
            "http://10.0.0.5/",
            "http://172.16.0.1/",
            "http://172.31.255.255/",
            "http://192.168.1.1/",
            "http://169.254.169.254/latest/meta-data/",
            "http://[fe80::1]/",
            "http://[fd00::1]/",
            "http://[::ffff:127.0.0.1]/",
        ]) {
            expect(() => assertPublicUrl(url), url).toThrow(/private|local/i)
        }
    })

    it("does not mistake a public address next to a private range for a private one", () => {
        expect(() => assertPublicUrl("http://172.32.0.1/")).not.toThrow()
        expect(() => assertPublicUrl("http://11.0.0.1/")).not.toThrow()
        expect(() => assertPublicUrl("http://192.169.1.1/")).not.toThrow()
    })

    it("refuses a malformed address instead of guessing", () => {
        expect(() => assertPublicUrl("not a url")).toThrow(/invalid/i)
    })
})
