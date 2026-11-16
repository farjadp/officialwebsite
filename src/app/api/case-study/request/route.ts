// ============================================================================
// File: src/app/api/case-study/request/route.ts
// Route: POST /api/case-study/request
// Role: Email-gated case-study delivery. Validates the request, records the
//       lead and its consent, and emails a signed, expiring reading link.
// Why:  The document is never linked from the page; the only way in is the
//       link in the email, so the address must be real to read it.
// Abuse: per-IP limit (RATE_RULES.caseStudy, per instance — see rate-limit.ts),
//       a honeypot, a per-address cooldown (canSendAgain) and no sending to
//       hard-bounced or complaining addresses. Every non-error outcome gets the
//       same answer, so the endpoint never reveals whether an address asked
//       before or is suppressed.
// Storage: the Lead table (toolId "case-study:<slug>"). Only an explicit,
//       unticked-by-default marketing opt-in also creates an email-suite
//       Contact, added to the "Official Website" list.
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { withRateLimit, RATE_RULES, getClientIp } from "@/lib/rate-limit"
import { sendCaseStudyLink } from "@/lib/email"
import { SITE_URL } from "@/lib/seo"
import {
    CONSENT_TEXT,
    CONSENT_VERSION,
    GATED_CASE_STUDIES,
    HONEYPOT_FIELD,
    LINK_TTL_MS,
    canSendAgain,
    leadToolId,
    linkSecret,
    requestSchema,
    sendsFromAnswers,
    downloadPath,
    signLink,
    type GateLocale,
} from "@/lib/case-study-gate"

const OK = { ok: true }

/**
 * Where the reading link points. Production always links to the canonical
 * www host (never a Host header an attacker controls); local runs link back
 * to the dev server that sent the mail.
 */
function baseUrl(req: NextRequest) {
    if (process.env.NODE_ENV !== "production") return req.nextUrl.origin
    return SITE_URL
}

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
    const out: Record<string, string> = {}
    for (const i of issues) {
        const k = String(i.path[0] ?? "form")
        if (!out[k]) out[k] = i.message
    }
    return out
}

async function handler(req: NextRequest) {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "Invalid request. / درخواست نامعتبر است." }, { status: 400 })
    }
    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "Invalid request. / درخواست نامعتبر است." }, { status: 400 })
    }
    const raw = body as Record<string, unknown>

    const trap = raw[HONEYPOT_FIELD]
    if (typeof trap === "string" && trap.trim() !== "") {
        console.warn("[case-study] honeypot filled — dropped")
        return NextResponse.json(OK)
    }

    const locale: GateLocale = raw.locale === "fa" ? "fa" : "en"
    const parsed = requestSchema(locale).safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            {
                error: locale === "fa" ? "چند مورد نیاز به اصلاح دارد." : "A couple of things need fixing.",
                fields: fieldErrors(parsed.error.issues),
            },
            { status: 422 }
        )
    }
    const data = parsed.data
    const study = GATED_CASE_STUDIES[data.slug as keyof typeof GATED_CASE_STUDIES]
    const toolId = leadToolId(data.slug as keyof typeof GATED_CASE_STUDIES)

    const failed = () =>
        NextResponse.json(
            {
                error:
                    locale === "fa"
                        ? "ارسال ایمیل الان ممکن نشد. چند دقیقه‌ی دیگر دوباره امتحان کنید."
                        : "We couldn't send the email just now. Please try again in a few minutes.",
            },
            { status: 502 }
        )

    const secret = linkSecret()
    if (!secret) {
        console.error("[case-study] no signing secret (CASE_STUDY_LINK_SECRET / AUTH_SECRET)")
        return failed()
    }

    try {
        // Never mail an address that bounced hard or complained.
        const suppressed = await prisma.suppression.findUnique({ where: { email: data.email } })
        if (suppressed && ["HARD_BOUNCE", "COMPLAINT", "INVALID"].includes(suppressed.reason)) {
            console.warn(`[case-study] suppressed (${suppressed.reason}) — not sent`)
            return NextResponse.json(OK)
        }

        const existing = await prisma.lead.findUnique({ where: { email_toolId: { email: data.email, toolId } } })
        const prev = (existing?.answers ?? {}) as Record<string, unknown>
        const sends = sendsFromAnswers(prev)
        if (!canSendAgain(sends)) {
            console.warn("[case-study] cooldown — not resent")
            return NextResponse.json(OK)
        }

        const now = new Date()
        const consent = {
            version: CONSENT_VERSION,
            delivery: { text: CONSENT_TEXT.delivery[locale], at: now.toISOString() },
            marketing: data.marketingOptIn
                ? { text: CONSENT_TEXT.marketing[locale], at: now.toISOString() }
                : ((prev.consent as { marketing?: unknown } | undefined)?.marketing ?? null),
        }
        const marketingOptIn = data.marketingOptIn || prev.marketingOptIn === true
        const answers = {
            locale,
            page: study.pagePath,
            consent,
            marketingOptIn,
            ip: getClientIp(req),
            sends: sends.map((t) => new Date(t).toISOString()),
        }
        const segment = marketingOptIn ? "Case study + newsletter" : "Case study request"

        const lead = existing
            ? await prisma.lead.update({
                  where: { id: existing.id },
                  data: { name: data.name || existing.name, segment, answers: answers as Prisma.InputJsonValue },
              })
            : await prisma.lead.create({
                  data: {
                      email: data.email,
                      name: data.name || null,
                      toolId,
                      score: 0,
                      segment,
                      answers: answers as Prisma.InputJsonValue,
                  },
              })

        const expiresAt = new Date(now.getTime() + LINK_TTL_MS)
        const token = signLink({ slug: data.slug as keyof typeof GATED_CASE_STUDIES, leadId: lead.id, exp: expiresAt.getTime() }, secret)
        const localePrefix = locale === "fa" ? "/fa" : ""
        const link = `${baseUrl(req)}${localePrefix}${study.reportPath}?t=${encodeURIComponent(token)}`

        try {
            await sendCaseStudyLink({
                to: data.email,
                locale,
                title: study.title[locale],
                link,
                downloadLink: "dataFile" in study ? `${baseUrl(req)}${downloadPath(token)}` : undefined,
                downloadLabel: locale === "fa" ? "دانلود فایل اکسل (۱۳٬۶۳۶ شرکت)" : "Download the Excel (13,636 companies)",
                name: data.name,
                expiresAt,
            })
        } catch (err) {
            console.error("[case-study] send failed — lead saved:", err)
            return failed()
        }

        await prisma.lead.update({
            where: { id: lead.id },
            data: { answers: { ...answers, sends: [...answers.sends, now.toISOString()] } as Prisma.InputJsonValue },
        })

        if (data.marketingOptIn) {
            await addToMailingList(data.email, data.name, locale, consent.marketing as { text: string; at: string }, toolId).catch((err) =>
                console.error("[case-study] opt-in contact sync failed:", err)
            )
        }

        return NextResponse.json(OK)
    } catch (err) {
        console.error("[case-study] request failed:", err)
        return failed()
    }
}

/**
 * Explicit opt-in only. Creates the Contact when it is new; an existing
 * Contact keeps its status (an unsubscribe is never silently reversed) and
 * only gains the list membership.
 */
async function addToMailingList(email: string, name: string, locale: GateLocale, consent: { text: string; at: string }, origin: string) {
    const [firstName, ...rest] = name.trim().split(/\s+/).filter(Boolean)
    const contact = await prisma.contact.upsert({
        where: { email },
        update: {},
        create: {
            email,
            firstName: firstName || null,
            lastName: rest.join(" ") || null,
            locale,
            source: "form",
            confirmedAt: new Date(consent.at),
            attributes: { origin, consentText: consent.text, consentAt: consent.at, consentVersion: CONSENT_VERSION },
        },
    })
    const list = await prisma.contactList.findFirst({ where: { name: "Official Website", isDynamic: false } })
    if (list) {
        await prisma.contactListMember.upsert({
            where: { contactId_listId: { contactId: contact.id, listId: list.id } },
            update: {},
            create: { contactId: contact.id, listId: list.id },
        })
    }
}

export const POST = withRateLimit("case-study", RATE_RULES.caseStudy, handler)
