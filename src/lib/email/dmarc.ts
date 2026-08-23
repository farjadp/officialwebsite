// ============================================================================
// Hardware Source: dmarc.ts
// Version: 1.0.0 — 2026-08-23
// Why: Decompress and parse DMARC aggregate reports (RFC 7489 appendix C)
// Env / Identity: Server module
// ============================================================================

import { gunzipSync } from "node:zlib"
import { XMLParser } from "fast-xml-parser"
import JSZip from "jszip"

export interface DmarcRow {
    sourceIp: string
    count: number
    disposition: string
    dkimPolicy: string
    spfPolicy: string
    headerFrom: string | null
    dkimDomain: string | null
    dkimSelector: string | null
    dkimResult: string | null
    spfDomain: string | null
    spfResult: string | null
}

export interface ParsedReport {
    reportId: string
    orgName: string
    orgEmail: string | null
    domain: string
    rangeBegin: Date
    rangeEnd: Date
    policyP: string
    policySp: string | null
    policyPct: number | null
    adkim: string | null
    aspf: string | null
    totalMessages: number
    passCount: number
    failCount: number
    rows: DmarcRow[]
}

/** Receivers send one XML file, gzipped or zipped. Reject anything else loudly. */
export async function extractXml(
    filename: string,
    buffer: Buffer
): Promise<{ xml: string; name: string }[]> {
    const lower = filename.toLowerCase()

    if (lower.endsWith(".gz")) {
        return [{ xml: gunzipSync(buffer).toString("utf8"), name: filename.replace(/\.gz$/i, "") }]
    }

    if (lower.endsWith(".zip")) {
        const zip = await JSZip.loadAsync(buffer)
        const out: { xml: string; name: string }[] = []
        for (const entry of Object.values(zip.files)) {
            // Zip archives carry directory entries and editor cruft; take only XML
            if (entry.dir || !entry.name.toLowerCase().endsWith(".xml")) continue
            if (entry.name.startsWith("__MACOSX/")) continue
            out.push({ xml: await entry.async("string"), name: entry.name })
        }
        if (!out.length) throw new Error("The zip archive contains no XML file")
        return out
    }

    if (lower.endsWith(".xml")) {
        return [{ xml: buffer.toString("utf8"), name: filename }]
    }

    // Sniff the magic bytes — reports are routinely saved without an extension
    if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
        return [{ xml: gunzipSync(buffer).toString("utf8"), name: filename }]
    }
    if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
        return extractXml(`${filename}.zip`, buffer)
    }

    throw new Error(`Unsupported file type: ${filename}. Expected .xml, .xml.gz or .zip`)
}

/** Receivers disagree on whether repeated elements are arrays — normalize. */
function asArray<T>(value: T | T[] | undefined | null): T[] {
    if (value == null) return []
    return Array.isArray(value) ? value : [value]
}

function text(value: unknown): string | null {
    if (value == null) return null
    if (typeof value === "object" && "#text" in (value as Record<string, unknown>)) {
        return String((value as Record<string, unknown>)["#text"])
    }
    const str = String(value).trim()
    return str.length ? str : null
}

/** Epoch seconds, occasionally arriving as a quoted string. */
function epoch(value: unknown): Date {
    const seconds = Number(text(value) ?? 0)
    if (!Number.isFinite(seconds) || seconds <= 0) {
        throw new Error("Report has an invalid date range")
    }
    return new Date(seconds * 1000)
}

export function parseAggregateReport(xml: string): ParsedReport {
    const parser = new XMLParser({
        ignoreAttributes: true,
        parseTagValue: false,
        trimValues: true,
    })

    let doc: Record<string, unknown>
    try {
        doc = parser.parse(xml) as Record<string, unknown>
    } catch (error) {
        throw new Error(
            `Not valid XML: ${error instanceof Error ? error.message : "parse failed"}`
        )
    }

    const feedback = doc.feedback as Record<string, unknown> | undefined
    if (!feedback) {
        throw new Error("Not a DMARC aggregate report — no <feedback> element")
    }

    const meta = (feedback.report_metadata ?? {}) as Record<string, unknown>
    const policy = (feedback.policy_published ?? {}) as Record<string, unknown>
    const range = (meta.date_range ?? {}) as Record<string, unknown>

    const orgName = text(meta.org_name)
    const reportId = text(meta.report_id)
    if (!orgName || !reportId) {
        throw new Error("Report is missing org_name or report_id")
    }

    const rows: DmarcRow[] = []
    let passCount = 0
    let failCount = 0
    let totalMessages = 0

    for (const record of asArray(feedback.record as unknown)) {
        const entry = record as Record<string, unknown>
        const row = (entry.row ?? {}) as Record<string, unknown>
        const evaluated = (row.policy_evaluated ?? {}) as Record<string, unknown>
        const identifiers = (entry.identifiers ?? {}) as Record<string, unknown>
        const auth = (entry.auth_results ?? {}) as Record<string, unknown>

        // A single record aggregates many messages from one source
        const count = Math.max(0, Number(text(row.count) ?? 0))
        const dkimPolicy = (text(evaluated.dkim) ?? "none").toLowerCase()
        const spfPolicy = (text(evaluated.spf) ?? "none").toLowerCase()

        // DMARC passes when EITHER mechanism aligns and passes — not both
        const passed = dkimPolicy === "pass" || spfPolicy === "pass"
        if (passed) passCount += count
        else failCount += count
        totalMessages += count

        // A record can carry several DKIM signatures; the passing one is what counts
        const dkimEntries = asArray(auth.dkim as unknown).map(
            (d) => d as Record<string, unknown>
        )
        const dkim =
            dkimEntries.find((d) => (text(d.result) ?? "").toLowerCase() === "pass") ??
            dkimEntries[0]
        const spf = asArray(auth.spf as unknown).map((s) => s as Record<string, unknown>)[0]

        rows.push({
            sourceIp: text(row.source_ip) ?? "unknown",
            count,
            disposition: (text(evaluated.disposition) ?? "none").toLowerCase(),
            dkimPolicy,
            spfPolicy,
            headerFrom: text(identifiers.header_from),
            dkimDomain: dkim ? text(dkim.domain) : null,
            dkimSelector: dkim ? text(dkim.selector) : null,
            dkimResult: dkim ? (text(dkim.result) ?? "").toLowerCase() || null : null,
            spfDomain: spf ? text(spf.domain) : null,
            spfResult: spf ? (text(spf.result) ?? "").toLowerCase() || null : null,
        })
    }

    const pct = text(policy.pct)

    return {
        reportId,
        orgName,
        orgEmail: text(meta.email),
        domain: text(policy.domain) ?? "unknown",
        rangeBegin: epoch(range.begin),
        rangeEnd: epoch(range.end),
        policyP: text(policy.p) ?? "none",
        policySp: text(policy.sp),
        policyPct: pct != null ? Number(pct) : null,
        adkim: text(policy.adkim),
        aspf: text(policy.aspf),
        totalMessages,
        passCount,
        failCount,
        rows,
    }
}

// ── Readiness assessment ───────────────────────────────────────────────────

export interface PolicyReadiness {
    verdict: "insufficient-data" | "not-ready" | "almost" | "ready"
    headline: string
    detail: string
    passRate: number
    totalMessages: number
    failingSources: number
    daysCovered: number
}

/**
 * Answers the only question these reports exist to answer: can the policy be
 * raised from p=none to p=quarantine without silently binning real mail?
 */
export function assessReadiness(input: {
    totalMessages: number
    passCount: number
    failingSources: number
    daysCovered: number
}): PolicyReadiness {
    const { totalMessages, passCount, failingSources, daysCovered } = input
    const passRate = totalMessages ? (passCount / totalMessages) * 100 : 0
    const base = { passRate, totalMessages, failingSources, daysCovered }

    if (totalMessages < 20 || daysCovered < 7) {
        return {
            ...base,
            verdict: "insufficient-data",
            headline: "Not enough data yet",
            detail: `${totalMessages} messages across ${daysCovered} day${daysCovered === 1 ? "" : "s"}. Wait for at least a week of reports covering real sending before drawing conclusions.`,
        }
    }

    if (passRate < 95) {
        return {
            ...base,
            verdict: "not-ready",
            headline: "Do not raise the policy yet",
            detail: `${passRate.toFixed(1)}% of your mail passes DMARC. Raising to quarantine now would send the failing ${(100 - passRate).toFixed(1)}% to spam folders. Identify each failing source below before changing anything.`,
        }
    }

    if (failingSources > 0 || passRate < 99) {
        return {
            ...base,
            verdict: "almost",
            headline: "Close, but check the stragglers first",
            detail: `${passRate.toFixed(1)}% passes, and ${failingSources} source${failingSources === 1 ? "" : "s"} still fail. Confirm each one is a spoofer rather than a service of yours you forgot about — a forgotten sender is exactly what breaks when you enforce.`,
        }
    }

    return {
        ...base,
        verdict: "ready",
        headline: "Safe to move to p=quarantine",
        detail: `${passRate.toFixed(1)}% of ${totalMessages.toLocaleString()} messages pass across ${daysCovered} days, with no failing sources. Raise the policy, watch for another two weeks, then consider p=reject.`,
    }
}

/**
 * Names the service behind a source. Matching on the authenticated domain alone
 * fails for correctly-configured senders: with a custom MAIL FROM, both the SPF
 * and DKIM domains are your own, never the ESP's. The DKIM selector is the
 * reliable signal, because each provider publishes a distinctive one.
 */
export function describeSource(row: {
    spfDomain: string | null
    dkimDomain: string | null
    dkimSelector?: string | null
    sourceIp: string
}): string | null {
    const selector = (row.dkimSelector ?? "").toLowerCase()
    const bySelector: [RegExp, string][] = [
        [/^resend$/, "Resend"],
        [/^google$/, "Google Workspace"],
        [/^k[0-9]+$/, "Mailchimp"],
        [/^s[0-9]+$/, "SendGrid"],
        [/^pm$|^pmta/, "Postmark"],
        [/^selector[0-9]$/, "Microsoft 365"],
        [/^mail$|^smtp$/, "Mailgun"],
        [/^zoho/, "Zoho"],
    ]
    for (const [pattern, label] of bySelector) {
        if (pattern.test(selector)) return label
    }

    const haystack = `${row.spfDomain ?? ""} ${row.dkimDomain ?? ""}`.toLowerCase()
    const byDomain: [string, string][] = [
        ["amazonses.com", "Amazon SES / Resend"],
        ["resend", "Resend"],
        ["mcsv.net", "Mailchimp"],
        ["mailchimp", "Mailchimp"],
        ["sendgrid", "SendGrid"],
        ["mailgun", "Mailgun"],
        ["postmark", "Postmark"],
        ["protection.outlook", "Microsoft 365"],
        ["outlook.com", "Microsoft 365"],
        ["google.com", "Google Workspace"],
        ["gmail.com", "Gmail"],
        ["zoho", "Zoho"],
    ]
    for (const [needle, label] of byDomain) {
        if (haystack.includes(needle)) return label
    }

    return null
}
