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
    firstname: "firstName",
    "first name": "firstName",
    first_name: "firstName",
    fname: "firstName",
    "given name": "firstName",
    name: "firstName",
    "full name": "firstName",
    lastname: "lastName",
    "last name": "lastName",
    last_name: "lastName",
    lname: "lastName",
    surname: "lastName",
    "family name": "lastName",
    company: "company",
    organization: "company",
    organisation: "company",
    org: "company",
    business: "company",
    "company name": "company",
    locale: "locale",
    language: "locale",
    lang: "locale",
}

/**
 * Recognises an email column by shape rather than by an exact name.
 *
 * Exports name this column every way imaginable — "Email Address", "E-Mail",
 * "Primary Email", "Contact Email". Requiring an exact match meant a perfectly
 * good file was rejected with a message that gave no clue why.
 */
function looksLikeEmailHeader(header: string): boolean {
    const key = header.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ")
    if (!key) return false
    // Reject columns that merely mention mail, e.g. "email opt-in" or "mail sent"
    if (/\b(opt|status|count|sent|date|verified|valid|bounce|type|domain)\b/.test(key)) return false
    return /\b(e ?mail|emails|mail)\b/.test(key)
}

function normalizeHeader(header: string): keyof ParsedRow | string {
    const key = header.trim().toLowerCase()
    return HEADER_ALIASES[key] ?? header.trim()
}

export interface HeaderMatch {
    /** Index of the row holding the headers, or -1 when detected by content */
    headerIndex: number
    emailIndex: number
    headers: string[]
    /** True when no header named the column and it was found by its values */
    detectedByContent: boolean
}

function emailLikeRatio(values: string[]): number {
    const filled = values.filter((v) => v.trim().length)
    if (!filled.length) return 0
    return filled.filter((v) => isValidEmail(v)).length / filled.length
}

/**
 * Finds the header row and the email column.
 *
 * Files routinely carry a title or blank rows above the real header, so the
 * first ten rows are searched rather than assuming row zero. Failing that, a
 * column whose values are overwhelmingly email addresses is used directly —
 * which is what a headerless export looks like.
 */
export function findHeader(grid: string[][]): HeaderMatch | null {
    const limit = Math.min(grid.length, 10)

    for (let r = 0; r < limit; r++) {
        const emailIndex = grid[r].findIndex(looksLikeEmailHeader)
        if (emailIndex === -1) continue
        // A header row's own cells must not themselves be data
        if (isValidEmail(grid[r][emailIndex])) continue
        return { headerIndex: r, emailIndex, headers: grid[r], detectedByContent: false }
    }

    // No usable header — look for a column that is plainly full of addresses
    const sample = grid.slice(0, 50)
    const width = Math.max(...sample.map((row) => row.length), 0)
    let best = { index: -1, ratio: 0 }
    for (let c = 0; c < width; c++) {
        const ratio = emailLikeRatio(sample.map((row) => row[c] ?? ""))
        if (ratio > best.ratio) best = { index: c, ratio }
    }
    if (best.index >= 0 && best.ratio >= 0.8) {
        return {
            headerIndex: -1,
            emailIndex: best.index,
            headers: [],
            detectedByContent: true,
        }
    }

    return null
}

/** Explains, in the user's terms, why a file could not be read. */
export function describeHeaderFailure(grid: string[][]): string {
    if (!grid.length) return "The file is empty."

    const headers = grid[0].map((h) => h.trim()).filter(Boolean)
    if (!headers.length) return "The first row of the file is blank."

    const shown = headers.slice(0, 12).map((h) => `"${h}"`).join(", ")
    const more = headers.length > 12 ? ` and ${headers.length - 12} more` : ""

    return `No email column found. The columns in this file are: ${shown}${more}. Rename the one holding email addresses to "email" and try again.`
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

export function rowsToContacts(grid: string[][]): ParsedRow[] {
    const match = findHeader(grid)
    if (!match) return []

    const dataRows = grid.slice(match.headerIndex + 1)
    const headers = match.detectedByContent
        ? []
        : match.headers.map(normalizeHeader)

    return dataRows.map((cells) => {
        const parsed: ParsedRow = { email: (cells[match.emailIndex] ?? "").trim(), attributes: {} }

        headers.forEach((header, i) => {
            const value = (cells[i] ?? "").trim()
            if (!value || i === match.emailIndex) return
            if (header === "firstName" || header === "lastName" || header === "company" || header === "locale") {
                // Never let a later column clobber an earlier one, e.g. a file
                // carrying both "name" and "first name"
                if (!parsed[header]) parsed[header] = value
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
