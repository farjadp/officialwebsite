// ============================================================================
// Hardware Source: import.ts
// Version: 1.0.0 — 2026-08-23
// Why: Bring contacts in from CSV/Excel, Mailchimp, and existing site tables
// Env / Identity: Server module
// ============================================================================

import { prisma } from "@/lib/prisma"
import ExcelJS from "exceljs"
import type { Prisma } from "@prisma/client"

export interface ParsedRow {
    email: string
    firstName?: string
    lastName?: string
    company?: string
    locale?: string
    attributes: Record<string, string>
}

export interface ImportSummary {
    total: number
    created: number
    updated: number
    invalid: number
    suppressed: number
    invalidSamples: string[]
}

// Deliberately permissive: RFC-correct validation rejects real deliverable
// addresses. Hard bounces are the true filter, and they feed the suppression list.
const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i

export function isValidEmail(value: string): boolean {
    return EMAIL_RE.test(value.trim())
}

const HEADER_ALIASES: Record<string, keyof ParsedRow> = {
    email: "email",
    "email address": "email",
    "e-mail": "email",
    mail: "email",
    firstname: "firstName",
    "first name": "firstName",
    fname: "firstName",
    name: "firstName",
    lastname: "lastName",
    "last name": "lastName",
    lname: "lastName",
    surname: "lastName",
    company: "company",
    organization: "company",
    org: "company",
    locale: "locale",
    language: "locale",
    lang: "locale",
}

function normalizeHeader(header: string): keyof ParsedRow | string {
    const key = header.trim().toLowerCase()
    return HEADER_ALIASES[key] ?? header.trim()
}

/** RFC 4180 parser — handles quoted fields containing commas and newlines. */
export function parseCsv(content: string): string[][] {
    const rows: string[][] = []
    let row: string[] = []
    let field = ""
    let inQuotes = false

    for (let i = 0; i < content.length; i++) {
        const char = content[i]

        if (inQuotes) {
            if (char === '"') {
                if (content[i + 1] === '"') {
                    field += '"'
                    i++
                } else {
                    inQuotes = false
                }
            } else {
                field += char
            }
            continue
        }

        if (char === '"') {
            inQuotes = true
        } else if (char === "," || char === ";" || char === "\t") {
            row.push(field)
            field = ""
        } else if (char === "\n") {
            row.push(field)
            rows.push(row)
            row = []
            field = ""
        } else if (char !== "\r") {
            field += char
        }
    }

    if (field.length || row.length) {
        row.push(field)
        rows.push(row)
    }

    return rows.filter((r) => r.some((c) => c.trim().length))
}

function rowsToContacts(rows: string[][]): ParsedRow[] {
    if (rows.length < 2) return []
    const headers = rows[0].map(normalizeHeader)
    const emailIndex = headers.indexOf("email")
    if (emailIndex === -1) return []

    return rows.slice(1).map((cells) => {
        const parsed: ParsedRow = { email: (cells[emailIndex] ?? "").trim(), attributes: {} }
        headers.forEach((header, i) => {
            const value = (cells[i] ?? "").trim()
            if (!value || i === emailIndex) return
            if (header === "firstName" || header === "lastName" || header === "company" || header === "locale") {
                parsed[header] = value
            } else if (typeof header === "string") {
                parsed.attributes[header] = value
            }
        })
        return parsed
    })
}

export function parseCsvContacts(content: string): ParsedRow[] {
    return rowsToContacts(parseCsv(content))
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

/**
 * Upsert imported rows. Existing contacts are enriched, never downgraded — an
 * import must not resurrect someone who unsubscribed.
 */
export async function importContacts(
    rows: ParsedRow[],
    options: { listId?: string; source: string; doubleOptIn?: boolean }
): Promise<ImportSummary> {
    const summary: ImportSummary = {
        total: rows.length, created: 0, updated: 0, invalid: 0, suppressed: 0, invalidSamples: [],
    }

    const seen = new Set<string>()
    const valid: ParsedRow[] = []

    for (const row of rows) {
        const email = row.email?.trim().toLowerCase()
        if (!email || !isValidEmail(email)) {
            summary.invalid += 1
            if (summary.invalidSamples.length < 10 && row.email) summary.invalidSamples.push(row.email)
            continue
        }
        if (seen.has(email)) continue
        seen.add(email)
        valid.push({ ...row, email })
    }

    if (!valid.length) return summary

    const suppressed = await prisma.suppression.findMany({
        where: { email: { in: valid.map((r) => r.email) } },
        select: { email: true },
    })
    const blocked = new Set(suppressed.map((s) => s.email))

    for (const row of valid) {
        if (blocked.has(row.email)) {
            summary.suppressed += 1
            continue
        }

        const existing = await prisma.contact.findUnique({
            where: { email: row.email },
            select: { id: true, attributes: true },
        })

        if (existing) {
            await prisma.contact.update({
                where: { id: existing.id },
                data: {
                    firstName: row.firstName || undefined,
                    lastName: row.lastName || undefined,
                    company: row.company || undefined,
                    locale: row.locale || undefined,
                    attributes: {
                        ...((existing.attributes as Record<string, string>) ?? {}),
                        ...row.attributes,
                    } as Prisma.InputJsonValue,
                },
            })
            summary.updated += 1
            if (options.listId) {
                await prisma.contactListMember.upsert({
                    where: { contactId_listId: { contactId: existing.id, listId: options.listId } },
                    create: { contactId: existing.id, listId: options.listId },
                    update: {},
                })
            }
        } else {
            const created = await prisma.contact.create({
                data: {
                    email: row.email,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    company: row.company,
                    locale: row.locale || "en",
                    source: options.source,
                    status: options.doubleOptIn ? "PENDING" : "ACTIVE",
                    confirmToken: options.doubleOptIn
                        ? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
                        : undefined,
                    confirmedAt: options.doubleOptIn ? undefined : new Date(),
                    attributes: row.attributes,
                    memberships: options.listId ? { create: { listId: options.listId } } : undefined,
                },
            })
            void created
            summary.created += 1
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
