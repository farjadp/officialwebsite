"use server"

// ============================================================================
// Hardware Source: email.ts
// Version: 1.0.0 — 2026-08-23
// Why: Server actions backing the email marketing admin panel
// Env / Identity: Server Actions
// ============================================================================

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { Block, EmailTheme } from "@/lib/email/blocks"
import { DEFAULT_THEME } from "@/lib/email/blocks"
import { renderEmail } from "@/lib/email/render"
import { auditEmail } from "@/lib/email/spam"
import { buildContactWhere, type SegmentFilter } from "@/lib/email/segment"
import {
    buildAudience,
    drainQueue,
    resolveAbWinner,
    syncCampaignLinks,
} from "@/lib/email/campaign-engine"
import {
    marketingFrom,
    sendOne,
    suppress,
    marketingBaseUrl,
} from "@/lib/email/provider"
import type { ParsedRow } from "@/lib/email/csv"
import type { ConflictStrategy, ImportPreview } from "@/lib/email/import"
import {
    previewImport,
    importContacts,
    importFromSiteTables,
    parseCsvContacts,
    fetchMailchimpLists,
    fetchMailchimpMembers,
    fetchMailchimpSuppressions,
    type ImportSummary,
} from "@/lib/email/import"

const ROOT = "/admin/newsletter"

export interface ActionResult<T = undefined> {
    success: boolean
    error?: string
    data?: T
}

async function requireAdmin(): Promise<string | null> {
    const session = await auth()
    if (!session?.user || !["OWNER", "EDITOR"].includes(session.user.role)) {
        return "Unauthorized"
    }
    return null
}

function fail(error: string): ActionResult<never> {
    return { success: false, error }
}

// ── Lists ──────────────────────────────────────────────────────────────────

export async function createList(formData: FormData): Promise<ActionResult<{ id: string }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const name = String(formData.get("name") ?? "").trim()
    if (!name) return fail("List name is required")

    const isDynamic = formData.get("isDynamic") === "on"
    let filter: SegmentFilter | null = null

    if (isDynamic) {
        const raw = String(formData.get("filter") ?? "").trim()
        if (raw) {
            try {
                filter = JSON.parse(raw) as SegmentFilter
            } catch {
                return fail("Segment filter is not valid JSON")
            }
        }
    }

    const list = await prisma.contactList.create({
        data: {
            name,
            description: String(formData.get("description") ?? "").trim() || null,
            color: String(formData.get("color") ?? "#7c3aed"),
            isDynamic,
            filter: (filter ?? undefined) as object | undefined,
        },
    })

    revalidatePath(`${ROOT}/lists`)
    return { success: true, data: { id: list.id } }
}

export async function deleteList(id: string): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    // Contacts survive; only the grouping goes away.
    await prisma.contactList.delete({ where: { id } })
    revalidatePath(`${ROOT}/lists`)
    return { success: true }
}

export async function countSegment(filter: SegmentFilter): Promise<ActionResult<{ count: number }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const count = await prisma.contact.count({
        where: buildContactWhere(filter, { sendableOnly: true }),
    })
    return { success: true, data: { count } }
}

// ── Contacts ───────────────────────────────────────────────────────────────

export async function upsertContact(formData: FormData): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    if (!email.includes("@")) return fail("A valid email address is required")

    const data = {
        firstName: String(formData.get("firstName") ?? "").trim() || null,
        lastName: String(formData.get("lastName") ?? "").trim() || null,
        company: String(formData.get("company") ?? "").trim() || null,
        locale: String(formData.get("locale") ?? "en"),
    }

    const contact = await prisma.contact.upsert({
        where: { email },
        create: { email, ...data, source: "manual", confirmedAt: new Date() },
        update: data,
    })

    const listIds = formData.getAll("lists").map(String).filter(Boolean)
    if (listIds.length) {
        await prisma.contactListMember.createMany({
            data: listIds.map((listId) => ({ contactId: contact.id, listId })),
            skipDuplicates: true,
        })
    }

    revalidatePath(`${ROOT}/contacts`)
    return { success: true }
}

export async function deleteContact(id: string): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    await prisma.contact.delete({ where: { id } })
    revalidatePath(`${ROOT}/contacts`)
    return { success: true }
}

export async function suppressContact(email: string): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    await suppress(email, "MANUAL", "removed from admin")
    revalidatePath(`${ROOT}/contacts`)
    return { success: true }
}

export async function addContactsToList(
    contactIds: string[],
    listId: string
): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    await prisma.contactListMember.createMany({
        data: contactIds.map((contactId) => ({ contactId, listId })),
        skipDuplicates: true,
    })
    revalidatePath(`${ROOT}/contacts`)
    return { success: true }
}

// ── Import ─────────────────────────────────────────────────────────────────

/**
 * Reports what a batch of rows would do, writing nothing.
 *
 * The client runs this over the whole file before importing so an address that
 * already exists becomes a decision rather than a silent side effect.
 */
export async function previewImportBatch(
    rows: ParsedRow[],
    options: { listId?: string }
): Promise<ActionResult<ImportPreview>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    if (!Array.isArray(rows) || !rows.length) return fail("Empty batch")
    if (rows.length > 2000) return fail("Batch too large — send at most 2000 rows at a time")

    try {
        return { success: true, data: await previewImport(rows, { listId: options.listId || undefined }) }
    } catch (error) {
        return fail(error instanceof Error ? error.message : "Preview failed")
    }
}

/**
 * Imports one batch of already-parsed rows.
 *
 * Large files are parsed in the browser and sent in chunks rather than uploaded
 * whole: a 15,000-row file exceeds the server action body limit outright, and
 * even under it, a single request cannot finish the work inside a function
 * timeout. Chunking also means a failure costs one batch instead of everything.
 */
export async function importContactBatch(
    rows: ParsedRow[],
    options: {
        listId?: string
        source: string
        doubleOptIn?: boolean
        onConflict?: ConflictStrategy
    }
): Promise<ActionResult<ImportSummary>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    if (!Array.isArray(rows) || !rows.length) return fail("Empty batch")
    if (rows.length > 2000) return fail("Batch too large — send at most 2000 rows at a time")

    try {
        const summary = await importContacts(rows, {
            listId: options.listId || undefined,
            source: options.source || "csv",
            doubleOptIn: options.doubleOptIn,
            onConflict: options.onConflict,
        })
        return { success: true, data: summary }
    } catch (error) {
        return fail(error instanceof Error ? error.message : "Import failed")
    }
}

/** Called once after the last batch so the contact views refresh. */
export async function finishImport(): Promise<ActionResult> {
    revalidatePath(`${ROOT}/contacts`)
    revalidatePath(`${ROOT}/lists`)
    return { success: true }
}

export async function importPastedContacts(formData: FormData): Promise<ActionResult<ImportSummary>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const raw = String(formData.get("content") ?? "").trim()
    if (!raw) return fail("Paste some rows first")

    // Accept a bare list of addresses as well as full CSV
    const content = raw.includes("@") && !/email/i.test(raw.split("\n")[0]) ? `email\n${raw}` : raw

    const rows = parseCsvContacts(content)
    if (!rows.length) return fail("Could not read any contacts from that text")

    const summary = await importContacts(rows, {
        listId: String(formData.get("listId") ?? "") || undefined,
        source: "paste",
        doubleOptIn: formData.get("doubleOptIn") === "on",
    })

    revalidatePath(`${ROOT}/contacts`)
    return { success: true, data: summary }
}

export async function listMailchimpAudiences(): Promise<
    ActionResult<{ id: string; name: string; memberCount: number }[]>
> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const key = process.env.MAILCHIMP_API_KEY
    if (!key) return fail("MAILCHIMP_API_KEY is not configured")

    try {
        return { success: true, data: await fetchMailchimpLists(key) }
    } catch (error) {
        return fail(error instanceof Error ? error.message : "Mailchimp request failed")
    }
}

export async function importMailchimpAudience(
    audienceId: string,
    targetListId?: string
): Promise<ActionResult<ImportSummary>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const key = process.env.MAILCHIMP_API_KEY
    if (!key) return fail("MAILCHIMP_API_KEY is not configured")

    try {
        // Pull suppressions first so a previously-unsubscribed address can never
        // be re-imported as active in the same run.
        const suppressions = await fetchMailchimpSuppressions(key, audienceId)
        for (const entry of suppressions) {
            await suppress(entry.email, entry.reason, "imported from Mailchimp")
        }

        const rows = await fetchMailchimpMembers(key, audienceId)
        const summary = await importContacts(rows, {
            listId: targetListId,
            source: "mailchimp",
        })

        revalidatePath(`${ROOT}/contacts`)
        return { success: true, data: summary }
    } catch (error) {
        return fail(error instanceof Error ? error.message : "Mailchimp import failed")
    }
}

export async function importSiteContacts(listId?: string): Promise<ActionResult<ImportSummary>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const summary = await importFromSiteTables(listId)
    revalidatePath(`${ROOT}/contacts`)
    return { success: true, data: summary }
}

// ── Templates ──────────────────────────────────────────────────────────────

export async function createTemplate(formData: FormData): Promise<void> {
    const denied = await requireAdmin()
    if (denied) throw new Error(denied)

    const template = await prisma.emailTemplate.create({
        data: {
            name: String(formData.get("name") ?? "").trim() || "Untitled template",
            category: String(formData.get("category") ?? "general"),
            blocks: [],
            theme: DEFAULT_THEME as unknown as object,
        },
    })

    redirect(`${ROOT}/templates/${template.id}`)
}

export async function saveTemplate(
    id: string,
    payload: { name?: string; blocks: Block[]; theme: EmailTheme }
): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const { html } = renderEmail(payload.blocks, { theme: payload.theme })

    await prisma.emailTemplate.update({
        where: { id },
        data: {
            name: payload.name,
            blocks: payload.blocks as unknown as object,
            theme: payload.theme as unknown as object,
            html,
        },
    })

    revalidatePath(`${ROOT}/templates`)
    return { success: true }
}

export async function deleteTemplate(id: string): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    await prisma.emailTemplate.delete({ where: { id } })
    revalidatePath(`${ROOT}/templates`)
    return { success: true }
}

/** Imports a raw HTML template as a single custom-HTML block. */
export async function importHtmlTemplate(formData: FormData): Promise<ActionResult<{ id: string }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const file = formData.get("file") as File | null
    const pasted = String(formData.get("html") ?? "").trim()
    const html = file?.size ? await file.text() : pasted

    if (!html) return fail("Provide an HTML file or paste the markup")

    // The renderer supplies its own document shell, so only the body survives —
    // but <style> lives in <head>, and dropping it takes the template's media
    // queries and any class-based styling with it.
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const body = bodyMatch ? bodyMatch[1] : html

    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
    const headStyles = headMatch
        ? (headMatch[1].match(/<style[\s\S]*?<\/style>/gi) ?? []).join("\n")
        : ""

    // Carry the body's own styling too — a <body style="..."> holds the
    // background and font the design was built around
    const bodyAttrs = html.match(/<body([^>]*)>/i)?.[1] ?? ""
    const bodyStyle = bodyAttrs.match(/style\s*=\s*"([^"]*)"/i)?.[1] ?? ""

    const inner = bodyStyle
        ? `${headStyles}<div style="${bodyStyle}">${body}</div>`
        : `${headStyles}${body}`

    const template = await prisma.emailTemplate.create({
        data: {
            name: String(formData.get("name") ?? "").trim() || file?.name || "Imported template",
            category: "imported",
            blocks: [
                { id: `b${Date.now().toString(36)}`, type: "html", html: inner, padding: [0, 0, 0, 0] },
            ] as unknown as object,
            theme: DEFAULT_THEME as unknown as object,
            html,
        },
    })

    revalidatePath(`${ROOT}/templates`)
    return { success: true, data: { id: template.id } }
}

// ── Campaigns ──────────────────────────────────────────────────────────────

export async function createCampaign(formData: FormData): Promise<void> {
    const denied = await requireAdmin()
    if (denied) throw new Error(denied)

    const templateId = String(formData.get("templateId") ?? "") || null
    const template = templateId
        ? await prisma.emailTemplate.findUnique({ where: { id: templateId } })
        : null

    const campaign = await prisma.campaign.create({
        data: {
            name: String(formData.get("name") ?? "").trim() || "Untitled campaign",
            templateId,
            listId: String(formData.get("listId") ?? "") || null,
            blocks: (template?.blocks ?? []) as object,
            theme: (template?.theme ?? DEFAULT_THEME) as unknown as object,
            fromEmail: process.env.EMAIL_MARKETING_FROM ?? "",
        },
    })

    redirect(`${ROOT}/campaigns/${campaign.id}`)
}

export interface CampaignPayload {
    name?: string
    subject?: string
    preheader?: string
    fromName?: string
    fromEmail?: string
    replyTo?: string | null
    listId?: string | null
    blocks?: Block[]
    theme?: EmailTheme
    abEnabled?: boolean
    abTestPercent?: number
    abWinnerMetric?: string
    optimizeSendTime?: boolean
    throttlePerHour?: number
    scheduledAt?: string | null
    segmentFilter?: SegmentFilter | null
}

export async function saveCampaign(
    id: string,
    payload: CampaignPayload
): Promise<ActionResult<{ spamScore: number }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const blocks = payload.blocks ?? []
    const theme = payload.theme ?? DEFAULT_THEME

    const { html, text } = renderEmail(blocks, {
        theme,
        preheader: payload.preheader,
        unsubscribeUrl: `${marketingBaseUrl()}/e/u/preview`,
        postalAddress: process.env.EMAIL_POSTAL_ADDRESS,
    })

    const audit = auditEmail({
        subject: payload.subject ?? "",
        preheader: payload.preheader,
        html,
        fromEmail: payload.fromEmail,
        hasUnsubscribe: true,
        hasPlainText: !!text,
    })

    await prisma.campaign.update({
        where: { id },
        data: {
            name: payload.name,
            subject: payload.subject,
            preheader: payload.preheader,
            fromName: payload.fromName,
            fromEmail: payload.fromEmail,
            replyTo: payload.replyTo,
            listId: payload.listId,
            blocks: blocks as unknown as object,
            theme: theme as unknown as object,
            html,
            text,
            abEnabled: payload.abEnabled,
            abTestPercent: payload.abTestPercent,
            abWinnerMetric: payload.abWinnerMetric,
            optimizeSendTime: payload.optimizeSendTime,
            throttlePerHour: payload.throttlePerHour,
            scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null,
            segmentFilter: (payload.segmentFilter ?? undefined) as object | undefined,
            spamScore: audit.score,
            spamReport: audit as unknown as object,
        },
    })

    await syncCampaignLinks(id, html)
    revalidatePath(`${ROOT}/campaigns/${id}`)
    return { success: true, data: { spamScore: audit.score } }
}

export async function saveVariant(
    campaignId: string,
    label: string,
    payload: { subject: string; preheader?: string; blocks?: Block[] }
): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    await prisma.campaignVariant.upsert({
        where: { campaignId_label: { campaignId, label } },
        create: {
            campaignId,
            label,
            subject: payload.subject,
            preheader: payload.preheader ?? "",
            blocks: (payload.blocks ?? undefined) as object | undefined,
        },
        update: {
            subject: payload.subject,
            preheader: payload.preheader ?? "",
            blocks: (payload.blocks ?? undefined) as object | undefined,
        },
    })

    revalidatePath(`${ROOT}/campaigns/${campaignId}`)
    return { success: true }
}

export async function deleteCampaign(id: string): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const campaign = await prisma.campaign.findUnique({
        where: { id },
        select: { status: true },
    })
    if (campaign?.status === "SENDING") return fail("Pause the campaign before deleting it")

    await prisma.campaign.delete({ where: { id } })
    revalidatePath(`${ROOT}/campaigns`)
    return { success: true }
}

/** Sends the campaign to a handful of seed inboxes to check real placement. */
export async function sendTestEmail(
    campaignId: string,
    recipients: string
): Promise<ActionResult<{ sent: number; failed: string[] }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } })
    if (!campaign) return fail("Campaign not found")

    const addresses = recipients
        .split(/[,\n;]/)
        .map((a) => a.trim())
        .filter((a) => a.includes("@"))
        .slice(0, 10)

    if (!addresses.length) return fail("Add at least one test address")

    const { html, text } = renderEmail(campaign.blocks as unknown as Block[], {
        theme: campaign.theme as Partial<EmailTheme>,
        preheader: campaign.preheader,
        unsubscribeUrl: `${marketingBaseUrl()}/e/u/test`,
        postalAddress: process.env.EMAIL_POSTAL_ADDRESS,
    })

    const failed: string[] = []
    let sent = 0

    for (const address of addresses) {
        const outcome = await sendOne({
            to: address,
            from: marketingFrom(campaign.fromName, campaign.fromEmail || undefined),
            replyTo: campaign.replyTo || undefined,
            subject: `[TEST] ${campaign.subject}`,
            html,
            text,
            unsubscribeUrl: `${marketingBaseUrl()}/e/u/test`,
            tags: [{ name: "type", value: "seed-test" }],
        })
        if (outcome.ok) sent += 1
        else failed.push(`${address}: ${outcome.error ?? "failed"}`)
    }

    return { success: true, data: { sent, failed } }
}

export async function prepareCampaign(id: string): Promise<ActionResult<{ audience: number }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const campaign = await prisma.campaign.findUnique({ where: { id } })
    if (!campaign) return fail("Campaign not found")
    if (!campaign.subject.trim()) return fail("Add a subject line before preparing the send")
    if (campaign.status === "SENDING") return fail("This campaign is already sending")

    const audience = await buildAudience(id)
    if (!audience) return fail("No eligible contacts match this audience")

    revalidatePath(`${ROOT}/campaigns/${id}`)
    return { success: true, data: { audience } }
}

export async function startCampaign(id: string): Promise<ActionResult<{ queued: number }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const campaign = await prisma.campaign.findUnique({
        where: { id },
        select: { totalRecipients: true, spamScore: true, status: true },
    })
    if (!campaign) return fail("Campaign not found")

    if (!campaign.totalRecipients) {
        const audience = await buildAudience(id)
        if (!audience) return fail("No eligible contacts match this audience")
    }

    // A critical-severity audit result means near-certain spam foldering.
    if (campaign.spamScore != null && campaign.spamScore < 40) {
        return fail(
            `Deliverability score is ${campaign.spamScore}/100. Fix the critical issues before sending.`
        )
    }

    await prisma.campaign.update({ where: { id }, data: { status: "SENDING" } })

    const queued = await prisma.campaignRecipient.count({
        where: { campaignId: id, status: "QUEUED" },
    })

    revalidatePath(`${ROOT}/campaigns/${id}`)
    return { success: true, data: { queued } }
}

export async function pauseCampaign(id: string): Promise<ActionResult> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    await prisma.campaign.update({ where: { id }, data: { status: "PAUSED" } })
    revalidatePath(`${ROOT}/campaigns/${id}`)
    return { success: true }
}

/** Manually pushes one batch — the cron does this automatically. */
export async function sendNextBatch(
    id: string,
    limit = 50
): Promise<ActionResult<{ sent: number; failed: number; remaining: number; quotaExhausted: boolean }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const result = await drainQueue(id, limit)
    revalidatePath(`${ROOT}/campaigns/${id}`)

    return {
        success: true,
        data: {
            sent: result.sent,
            failed: result.failed,
            remaining: result.remainingQueued,
            quotaExhausted: result.quotaExhausted,
        },
    }
}

export async function pickAbWinner(id: string): Promise<ActionResult<{ winner: string | null }>> {
    const denied = await requireAdmin()
    if (denied) return fail(denied)

    const winner = await resolveAbWinner(id)
    revalidatePath(`${ROOT}/campaigns/${id}`)
    return { success: true, data: { winner } }
}

export async function previewCampaignHtml(
    blocks: Block[],
    theme: EmailTheme,
    preheader: string
): Promise<string> {
    const { html } = renderEmail(blocks, {
        theme,
        preheader,
        unsubscribeUrl: "#",
        preferencesUrl: "#",
        postalAddress: process.env.EMAIL_POSTAL_ADDRESS,
        footerNote: "Preview — links are inert",
    })
    return html
}
