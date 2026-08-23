// ============================================================================
// Hardware Source: domain-status.ts
// Version: 1.0.0 — 2026-08-23
// Why: Read the real DNS records and verification state from Resend
// Env / Identity: Server module
// ============================================================================

/**
 * The deliverability page used to print hand-written placeholder records, which
 * is exactly how people end up publishing a wrong SPF include. These come
 * straight from the provider, so what the page shows is what must be published.
 */

export interface DnsRecord {
    record: string // "DKIM" | "SPF"
    name: string // host, relative to the zone apex
    type: string // TXT | MX | CNAME
    value: string
    priority?: number
    ttl?: string
    status: string
}

export interface DomainStatus {
    available: boolean
    id?: string
    name?: string
    status?: string // not_started | pending | verified | failed | temporary_failure
    region?: string
    records: DnsRecord[]
    error?: string
}

interface ResendDomain {
    id: string
    name: string
    status: string
    region?: string
    records?: DnsRecord[]
}

/**
 * Looks the domain up by name. Failures are returned, never thrown — a Resend
 * outage must not take down the whole deliverability page.
 */
export async function fetchDomainStatus(domain: string): Promise<DomainStatus> {
    const key = process.env.RESEND_API_KEY
    if (!key) {
        return { available: false, records: [], error: "RESEND_API_KEY is not configured" }
    }

    try {
        const listResponse = await fetch("https://api.resend.com/domains", {
            headers: { Authorization: `Bearer ${key}` },
            // Verification state changes while the user is watching the page
            cache: "no-store",
        })
        if (!listResponse.ok) {
            return { available: false, records: [], error: `Resend returned ${listResponse.status}` }
        }

        const list = (await listResponse.json()) as { data?: ResendDomain[] }
        const match = list.data?.find((entry) => entry.name === domain)
        if (!match) {
            return {
                available: false,
                records: [],
                error: `${domain} is not registered in Resend yet`,
            }
        }

        // The list endpoint omits records; only the detail endpoint returns them
        const detailResponse = await fetch(`https://api.resend.com/domains/${match.id}`, {
            headers: { Authorization: `Bearer ${key}` },
            cache: "no-store",
        })
        const detail = detailResponse.ok ? ((await detailResponse.json()) as ResendDomain) : match

        return {
            available: true,
            id: detail.id,
            name: detail.name,
            status: detail.status,
            region: detail.region,
            records: detail.records ?? [],
        }
    } catch (error) {
        return {
            available: false,
            records: [],
            error: error instanceof Error ? error.message : "Could not reach Resend",
        }
    }
}

/**
 * DMARC is a policy you author, not something the ESP issues — Resend never
 * returns it, and its absence is the single most common reason bulk mail from an
 * otherwise correctly configured domain gets throttled.
 */
export function dmarcRecord(domain: string): DnsRecord & { why: string } {
    const root = domain.split(".").slice(-2).join(".")
    return {
        record: "DMARC",
        name: `_dmarc.${root}`,
        type: "TXT",
        value: `v=DMARC1; p=none; rua=mailto:dmarc@${root}; pct=100; adkim=s; aspf=s`,
        status: "manual",
        why: "Publish it on the root domain — it covers every subdomain. Start at p=none, read the aggregate reports for two weeks, then switch to p=quarantine once you can see that all legitimate mail passes.",
    }
}

export const RECORD_NOTES: Record<string, string> = {
    DKIM: "Cryptographically signs each message so receivers can prove it was neither altered nor forged.",
    SPF: "Declares which servers may send as this domain. Never publish a second SPF TXT record on the same host — two records is a permerror, which fails worse than having none.",
    DMARC: "Tells receivers what to do when SPF or DKIM fails, and sends you the reports.",
}
