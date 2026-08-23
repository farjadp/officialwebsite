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
        // Alignment is deliberately left relaxed (the default). Resend sends with a
        // custom MAIL FROM of send.<domain>, so the SPF-authenticated domain is a
        // subdomain of the From domain — strict aspf would fail it outright and
        // leave DKIM as the only path to a DMARC pass. Relaxed keeps SPF as a
        // fallback for when DKIM breaks, which is what forwarders and mailing
        // lists routinely do.
        value: `v=DMARC1; p=none; rua=mailto:dmarc@${root}; pct=100`,
        status: "manual",
        why: "Publish on the root domain — it covers every subdomain. The rua address is the whole point: without it you get reports from nobody and can never justify moving to p=quarantine. Read two weeks of aggregate reports, confirm all legitimate mail passes, then raise the policy.",
    }
}

export const RECORD_NOTES: Record<string, string> = {
    DKIM: "Cryptographically signs each message so receivers can prove it was neither altered nor forged.",
    SPF: "Declares which servers may send as this domain. Never publish a second SPF TXT record on the same host — two records is a permerror, which fails worse than having none.",
    DMARC: "Tells receivers what to do when SPF or DKIM fails, and sends you the reports.",
}

export interface PublicUrlCheck {
    baseUrl: string
    ok: boolean
    redirectsTo?: string
    error?: string
}

/**
 * The tracking base URL must be the canonical host. If it redirects, the RFC 8058
 * one-click unsubscribe breaks: mail clients POST to the List-Unsubscribe URL and
 * do not follow redirects, so the reader's unsubscribe silently fails and their
 * next move is the spam button. Webhook senders behave the same way.
 *
 * This failure is invisible from the outside — everything looks fine in a browser,
 * because browsers do follow redirects — so it gets checked explicitly.
 */
export async function checkPublicUrl(): Promise<PublicUrlCheck> {
    const baseUrl = marketingPublicUrl()

    try {
        const response = await fetch(`${baseUrl}/e/u/canonical-host-check`, {
            method: "POST",
            redirect: "manual",
            cache: "no-store",
        })

        if (response.status >= 300 && response.status < 400) {
            return {
                baseUrl,
                ok: false,
                redirectsTo: response.headers.get("location") ?? "an unknown host",
            }
        }

        return { baseUrl, ok: true }
    } catch (error) {
        return {
            baseUrl,
            ok: false,
            error: error instanceof Error ? error.message : "Could not reach the URL",
        }
    }
}

function marketingPublicUrl(): string {
    return (
        process.env.EMAIL_PUBLIC_URL ||
        process.env.NEXTAUTH_URL ||
        "https://www.farjadp.info"
    ).replace(/\/$/, "")
}
