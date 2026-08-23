// ============================================================================
// Hardware Source: import.ts
// Version: 2.0.0 — 2026-08-23
// Why: Batched contact ingestion from files, Mailchimp and the site's own tables
// Env / Identity: Server module
// ============================================================================

import { prisma } from "@/lib/prisma"
import ExcelJS from "exceljs"
import type { Prisma } from "@prisma/client"
import {
    normalizeRows,
    parseCsvContacts,
    rowsToContacts,
    type ParsedRow,
} from "./csv"

export { parseCsv, parseCsvContacts, isValidEmail, normalizeRows } from "./csv"
export type { ParsedRow } from "./csv"

export interface ImportSummary {
    total: number
    created: number
    updated: number
    invalid: number
    suppressed: number
    /** Already in the target list — nothing was written for these */
    alreadyInList: number
    /** Existing contacts left untouched because the chosen strategy said so */
    skipped: number
    invalidSamples: string[]
}

/**
 * What to do with an address that already exists as a contact.
 *
 * Duplicates are impossible either way — email is unique on Contact and
 * (contact, list) is unique on membership. This decides how much of an existing
 * record an import is allowed to touch.
 */
export type ConflictStrategy =
    /** Fill in blank fields, merge attributes, add to the target list */
    | "enrich"
    /** Leave their data exactly as it is, but still add them to the target list */
    | "keep"
    /** Ignore them completely — only brand-new addresses are imported */
    | "skip"

export interface ImportPreview {
    /** Rows read from the file */
    total: number
    invalid: number
    /** Repeated addresses within the file itself */
    duplicatesInFile: number
    /** Unique, valid addresses left to consider */
    unique: number
    brandNew: number
    /** Exists as a contact already, in some other list or none */
    existingElsewhere: number
    /** Already in the target list — importing changes nothing for these */
    alreadyInList: number
    /** Bounced, complained or unsubscribed — always excluded */
    suppressed: number
    existingSamples: { email: string; lists: string[] }[]
    invalidSamples: string[]
}

export async function parseExcelContacts(buffer: ArrayBuffer): Promise<ParsedRow[]> {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const sheet = workbook.worksheets[0]
    if (!sheet) return []

    const rows: string[][] = []
    sheet.eachRow((row) => {
        const cells: string[] = []
        row.eachCell({ includeEmpty: true }, (cell) => {
            const value = cell.value
            if (value == null) cells.push("")
            else if (typeof value === "object" && "text" in value) cells.push(String(value.text))
            else if (typeof value === "object" && "result" in value) cells.push(String(value.result ?? ""))
            else cells.push(String(value))
        })
        rows.push(cells)
    })

    return rowsToContacts(rows)
}

/** Postgres caps a statement at 65535 parameters; this stays well clear of it. */
const CHUNK = 500

function chunked<T>(items: T[], size = CHUNK): T[][] {
    const out: T[][] = []
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
    return out
}

/** True when the incoming row would actually add something we do not already hold. */
function enriches(
    row: ParsedRow,
    existing: {
        firstName: string | null
        lastName: string | null
        company: string | null
        attributes: Prisma.JsonValue
    }
): boolean {
    if (row.firstName && !existing.firstName) return true
    if (row.lastName && !existing.lastName) return true
    if (row.company && !existing.company) return true

    const current = (existing.attributes as Record<string, string>) ?? {}
    for (const [key, value] of Object.entries(row.attributes)) {
        if (current[key] !== value) return true
    }
    return false
}

/**
 * Reports what an import would do, without writing anything.
 *
 * Runs before the import so a collision is a decision the user makes rather than
 * something that happens silently underneath them.
 */
export async function previewImport(
    rows: ParsedRow[],
    options: { listId?: string } = {}
): Promise<ImportPreview> {
    const { valid, invalid, duplicates, invalidSamples } = normalizeRows(rows)

    const preview: ImportPreview = {
        total: rows.length,
        invalid,
        duplicatesInFile: duplicates,
        unique: valid.length,
        brandNew: 0,
        existingElsewhere: 0,
        alreadyInList: 0,
        suppressed: 0,
        existingSamples: [],
        invalidSamples,
    }
    if (!valid.length) return preview

    const emails = valid.map((r) => r.email)

    const suppressedSet = new Set<string>()
    for (const batch of chunked(emails)) {
        const hits = await prisma.suppression.findMany({
            where: { email: { in: batch } },
            select: { email: true },
        })
        for (const h of hits) suppressedSet.add(h.email)
    }
    preview.suppressed = suppressedSet.size

    const considered = emails.filter((e) => !suppressedSet.has(e))

    for (const batch of chunked(considered)) {
        const found = await prisma.contact.findMany({
            where: { email: { in: batch } },
            select: {
                email: true,
                memberships: { select: { list: { select: { id: true, name: true } } } },
            },
        })

        for (const contact of found) {
            const inTarget =
                !!options.listId && contact.memberships.some((m) => m.list.id === options.listId)

            if (inTarget) preview.alreadyInList += 1
            else preview.existingElsewhere += 1

            if (preview.existingSamples.length < 8) {
                preview.existingSamples.push({
                    email: contact.email,
                    lists: contact.memberships.map((m) => m.list.name),
                })
            }
        }
    }

    preview.brandNew =
        considered.length - preview.alreadyInList - preview.existingElsewhere

    return preview
}

/**
 * Upserts a batch of contacts.
 *
 * The previous version issued two queries per row, which meant roughly 30,000
 * round trips for a 15,000-row list — about half an hour, against a function
 * timeout measured in minutes. This reads and writes in chunks instead, so the
 * same list costs a few dozen queries.
 *
 * Existing contacts are enriched, never downgraded: an import must not resurrect
 * someone who unsubscribed, so `status` is never written here.
 */
export async function importContacts(
    rows: ParsedRow[],
    options: {
        listId?: string
        source: string
        doubleOptIn?: boolean
        onConflict?: ConflictStrategy
    }
): Promise<ImportSummary> {
    const onConflict: ConflictStrategy = options.onConflict ?? "enrich"
    const { valid, invalid, invalidSamples } = normalizeRows(rows)

    const summary: ImportSummary = {
        total: rows.length,
        created: 0,
        updated: 0,
        invalid,
        suppressed: 0,
        alreadyInList: 0,
        skipped: 0,
        invalidSamples,
    }
    if (!valid.length) return summary

    const emails = valid.map((r) => r.email)

    // Suppressed addresses never come back, no matter what a file claims
    const suppressed = new Set<string>()
    for (const batch of chunked(emails)) {
        const hits = await prisma.suppression.findMany({
            where: { email: { in: batch } },
            select: { email: true },
        })
        for (const hit of hits) suppressed.add(hit.email)
    }

    const sendable = valid.filter((row) => {
        if (suppressed.has(row.email)) {
            summary.suppressed += 1
            return false
        }
        return true
    })
    if (!sendable.length) return summary

    // One read per chunk tells us which addresses already exist
    const existing = new Map<
        string,
        { id: string; firstName: string | null; lastName: string | null; company: string | null; attributes: Prisma.JsonValue }
    >()
    for (const batch of chunked(sendable.map((r) => r.email))) {
        const found = await prisma.contact.findMany({
            where: { email: { in: batch } },
            select: { id: true, email: true, firstName: true, lastName: true, company: true, attributes: true },
        })
        for (const contact of found) existing.set(contact.email, contact)
    }

    const fresh = sendable.filter((row) => !existing.has(row.email))
    const known = sendable.filter((row) => existing.has(row.email))

    if (onConflict === "skip") summary.skipped = known.length

    // ── Inserts ────────────────────────────────────────────────────────────
    for (const batch of chunked(fresh)) {
        const result = await prisma.contact.createMany({
            data: batch.map((row) => ({
                email: row.email,
                firstName: row.firstName,
                lastName: row.lastName,
                company: row.company,
                locale: row.locale || "en",
                source: options.source,
                status: options.doubleOptIn ? ("PENDING" as const) : ("ACTIVE" as const),
                confirmToken: options.doubleOptIn
                    ? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`
                    : undefined,
                confirmedAt: options.doubleOptIn ? undefined : new Date(),
                attributes: row.attributes as Prisma.InputJsonValue,
            })),
            // A concurrent import of an overlapping list must not abort the batch
            skipDuplicates: true,
        })
        summary.created += result.count
    }

    // ── Enrichment ─────────────────────────────────────────────────────────
    // Only rows that genuinely add something are written, so re-importing an
    // unchanged list costs nothing beyond the reads above.
    const toUpdate =
        onConflict === "enrich"
            ? known.filter((row) => enriches(row, existing.get(row.email)!))
            : []
    for (const row of toUpdate) {
        const current = existing.get(row.email)!

        // Enrich means fill blanks, not replace. Writing every supplied field
        // would let a second file silently overwrite names and companies that
        // are already on record — which is the opposite of what the UI promises.
        await prisma.contact.update({
            where: { id: current.id },
            data: {
                firstName: current.firstName ? undefined : row.firstName || undefined,
                lastName: current.lastName ? undefined : row.lastName || undefined,
                company: current.company ? undefined : row.company || undefined,
                attributes: {
                    // Incoming attributes win here on purpose: they are extra
                    // columns from the new file, not a replacement identity.
                    ...((current.attributes as Record<string, string>) ?? {}),
                    ...row.attributes,
                } as Prisma.InputJsonValue,
            },
        })
        summary.updated += 1
    }

    // ── List membership ────────────────────────────────────────────────────
    // "skip" means an existing contact is left out of the list too; the other
    // strategies still add them, which is how one address ends up in several
    // groups without ever being duplicated inside one.
    if (options.listId) {
        const eligible =
            onConflict === "skip" ? fresh : sendable

        const ids: string[] = []
        for (const batch of chunked(eligible.map((r) => r.email))) {
            const found = await prisma.contact.findMany({
                where: { email: { in: batch } },
                select: { id: true },
            })
            ids.push(...found.map((c) => c.id))
        }

        for (const batch of chunked(ids)) {
            const result = await prisma.contactListMember.createMany({
                data: batch.map((contactId) => ({ contactId, listId: options.listId! })),
                // The unique constraint on (contact, list) is what makes a second
                // membership impossible; this turns that into a no-op, not an error
                skipDuplicates: true,
            })
            summary.alreadyInList += batch.length - result.count
        }
    }

    return summary
}

// ── Mailchimp (import only) ────────────────────────────────────────────────

interface MailchimpMember {
    email_address: string
    status: string
    merge_fields?: Record<string, unknown>
    language?: string
}

function mailchimpDc(apiKey: string): string {
    const dc = apiKey.split("-")[1]
    if (!dc) throw new Error("Malformed Mailchimp API key — expected the '-usX' suffix")
    return dc
}

export async function fetchMailchimpLists(apiKey: string) {
    const dc = mailchimpDc(apiKey)
    const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists?count=100`, {
        headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) throw new Error(`Mailchimp lists request failed: ${res.status}`)
    const data = (await res.json()) as {
        lists: { id: string; name: string; stats?: { member_count?: number } }[]
    }
    return data.lists.map((l) => ({
        id: l.id,
        name: l.name,
        memberCount: l.stats?.member_count ?? 0,
    }))
}

/** Pulls subscribed members only — importing unsubscribes would re-mail them. */
export async function fetchMailchimpMembers(
    apiKey: string,
    listId: string
): Promise<ParsedRow[]> {
    const dc = mailchimpDc(apiKey)
    const rows: ParsedRow[] = []
    let offset = 0
    const count = 1000

    for (;;) {
        const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members?status=subscribed&count=${count}&offset=${offset}&fields=members.email_address,members.status,members.merge_fields,members.language`
        const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
        if (!res.ok) throw new Error(`Mailchimp members request failed: ${res.status}`)

        const data = (await res.json()) as { members: MailchimpMember[] }
        if (!data.members?.length) break

        for (const member of data.members) {
            const merge = member.merge_fields ?? {}
            const attributes: Record<string, string> = {}
            for (const [key, value] of Object.entries(merge)) {
                if (["FNAME", "LNAME", "COMPANY"].includes(key)) continue
                if (value != null && typeof value !== "object") attributes[key.toLowerCase()] = String(value)
            }
            rows.push({
                email: member.email_address,
                firstName: merge.FNAME ? String(merge.FNAME) : undefined,
                lastName: merge.LNAME ? String(merge.LNAME) : undefined,
                company: merge.COMPANY ? String(merge.COMPANY) : undefined,
                locale: member.language || undefined,
                attributes,
            })
        }

        if (data.members.length < count) break
        offset += count
    }

    return rows
}

/** Also pulls Mailchimp's cleaned/unsubscribed members straight into suppression. */
export async function fetchMailchimpSuppressions(
    apiKey: string,
    listId: string
): Promise<{ email: string; reason: "HARD_BOUNCE" | "UNSUBSCRIBE" }[]> {
    const dc = mailchimpDc(apiKey)
    const out: { email: string; reason: "HARD_BOUNCE" | "UNSUBSCRIBE" }[] = []

    for (const status of ["unsubscribed", "cleaned"] as const) {
        const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members?status=${status}&count=1000&fields=members.email_address`
        const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
        if (!res.ok) continue
        const data = (await res.json()) as { members: { email_address: string }[] }
        for (const m of data.members ?? []) {
            out.push({
                email: m.email_address,
                reason: status === "cleaned" ? "HARD_BOUNCE" : "UNSUBSCRIBE",
            })
        }
    }

    return out
}

/** One-time migration of the site's own Subscriber and Lead tables. */
export async function importFromSiteTables(listId?: string): Promise<ImportSummary> {
    const [subscribers, leads] = await Promise.all([
        prisma.subscriber.findMany(),
        prisma.lead.findMany({ select: { email: true, name: true, segment: true, toolId: true } }),
    ])

    const rows: ParsedRow[] = [
        ...subscribers.map((s) => ({
            email: s.email,
            attributes: {
                tags: s.tags.join(","),
                origin: s.source ?? "subscriber",
            } as Record<string, string>,
        })),
        ...leads.map((l) => ({
            email: l.email,
            firstName: l.name?.split(" ")[0],
            lastName: l.name?.split(" ").slice(1).join(" ") || undefined,
            attributes: { segment: l.segment, tool: l.toolId } as Record<string, string>,
        })),
    ]

    return importContacts(rows, { listId, source: "site" })
}
