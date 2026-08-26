// ============================================================================
// Hardware Source: domain-health.ts
// Version: 1.0.0 — 2026-08-25
// Why: Find addresses that cannot possibly receive mail, before sending to them
// Env / Identity: Server module (Node DNS)
// ============================================================================

import { promises as dns } from "node:dns"

export type DomainVerdict =
    /** The domain does not exist at all */
    | "nxdomain"
    /** Resolves, but has nowhere to deliver mail */
    | "no-mail"
    /** Has MX records */
    | "mx"
    /** No MX, but an address record — RFC 5321 implicit MX still delivers */
    | "implicit-mx"
    /** DNS did not answer; nothing can be concluded */
    | "unknown"

export interface DomainCheck {
    domain: string
    verdict: DomainVerdict
    detail?: string
}

/** Verdicts that mean mail can never arrive. Anything else is left alone. */
export function isUndeliverable(verdict: DomainVerdict): boolean {
    return verdict === "nxdomain" || verdict === "no-mail"
}

const TIMEOUT_MS = 5000

function withTimeout<T>(promise: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
    ])
}

/**
 * Decides whether a domain can receive mail at all.
 *
 * A missing MX is not enough on its own: RFC 5321 falls back to the address
 * record, so a domain with only an A record still accepts mail. Treating those
 * as dead would throw away deliverable contacts, which is the same mistake as
 * suppressing a soft bounce.
 */
export async function checkDomain(domain: string): Promise<DomainCheck> {
    try {
        const mx = await withTimeout(dns.resolveMx(domain))
        if (mx.length > 0 && mx.some((r) => r.exchange && r.exchange !== ".")) {
            return { domain, verdict: "mx", detail: mx[0].exchange }
        }
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code
        if (code === "ENOTFOUND" || code === "NXDOMAIN") {
            return { domain, verdict: "nxdomain" }
        }
        if (code !== "ENODATA") {
            return { domain, verdict: "unknown", detail: code ?? "error" }
        }
        // ENODATA: the domain exists but publishes no MX — fall through
    }

    try {
        const a = await withTimeout(dns.resolve4(domain))
        if (a.length) return { domain, verdict: "implicit-mx", detail: a[0] }
    } catch {
        // fall through to AAAA
    }

    try {
        const aaaa = await withTimeout(dns.resolve6(domain))
        if (aaaa.length) return { domain, verdict: "implicit-mx", detail: aaaa[0] }
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code
        if (code === "ENOTFOUND" || code === "NXDOMAIN") return { domain, verdict: "nxdomain" }
        if (code === "ENODATA") return { domain, verdict: "no-mail" }
        return { domain, verdict: "unknown", detail: code ?? "error" }
    }

    return { domain, verdict: "no-mail" }
}

/** Checks many domains with a bounded number of concurrent lookups. */
export async function checkDomains(
    domains: string[],
    options: { concurrency?: number; onProgress?: (done: number, total: number) => void } = {}
): Promise<Map<string, DomainCheck>> {
    const concurrency = options.concurrency ?? 40
    const results = new Map<string, DomainCheck>()
    let index = 0
    let done = 0

    async function worker() {
        for (;;) {
            const i = index++
            if (i >= domains.length) return
            const result = await checkDomain(domains[i])
            results.set(domains[i], result)
            done += 1
            if (done % 100 === 0) options.onProgress?.(done, domains.length)
        }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, domains.length) }, worker))
    options.onProgress?.(done, domains.length)
    return results
}

export function domainOf(email: string): string {
    return email.split("@")[1]?.trim().toLowerCase() ?? ""
}
