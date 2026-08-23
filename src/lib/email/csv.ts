// ============================================================================
// Hardware Source: csv.ts
// Version: 1.0.0 — 2026-08-23
// Why: Pure contact-file parsing, safe to run in the browser
// Env / Identity: Shared module (server + client)
// ============================================================================

/**
 * Kept free of Prisma and Node imports on purpose. Large lists are parsed in the
 * browser and uploaded in batches, because a 15k-row file exceeds the server
 * action body limit and a row-at-a-time server import cannot finish inside a
 * function timeout.
 */

export interface ParsedRow {
    email: string
    firstName?: string
    lastName?: string
    company?: string
    locale?: string
    attributes: Record<string, string>
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
    first_name: "firstName",
    fname: "firstName",
    name: "firstName",
    lastname: "lastName",
    "last name": "lastName",
    last_name: "lastName",
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

export function rowsToContacts(rows: string[][]): ParsedRow[] {
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

/**
 * Drops invalid and repeated addresses before anything touches the network.
 * Returns the reasons too, so the UI can explain what it discarded.
 */
export function normalizeRows(rows: ParsedRow[]): {
    valid: ParsedRow[]
    invalid: number
    duplicates: number
    invalidSamples: string[]
} {
    const seen = new Set<string>()
    const valid: ParsedRow[] = []
    const invalidSamples: string[] = []
    let invalid = 0
    let duplicates = 0

    for (const row of rows) {
        const email = row.email?.trim().toLowerCase()
        if (!email || !isValidEmail(email)) {
            invalid += 1
            if (invalidSamples.length < 10 && row.email) invalidSamples.push(row.email)
            continue
        }
        if (seen.has(email)) {
            duplicates += 1
            continue
        }
        seen.add(email)
        valid.push({ ...row, email })
    }

    return { valid, invalid, duplicates, invalidSamples }
}
