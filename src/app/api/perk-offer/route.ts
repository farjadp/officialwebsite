// ============================================================================
// File: src/app/api/perk-offer/route.ts
// Route: POST /api/perk-offer
// Role: Receives Astaneh perk-partner offers from /fa/lab/perks.
// Why:  Order matters: validate → save → notify. The database row is the
//       durable record; the email is only a notification, so a Resend outage
//       loses nothing — `emailOk` stays false and the row is still there.
// Spam: a honeypot field plus the per-IP limit in RATE_RULES.perkOffer. No
//       CAPTCHA, by decision. The limiter is per-instance (see rate-limit.ts).
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withRateLimit, RATE_RULES } from "@/lib/rate-limit"
import { sendPerkOfferNotification } from "@/lib/email"
import { COUNTRIES, HONEYPOT_FIELD, MARKETS, PERK_TYPES, fieldErrors, labelOf, perkOfferSchema } from "@/lib/perk-offer"

async function handler(req: NextRequest) {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 })
    }
    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 })
    }

    // Answer a bot exactly like a success, so it has nothing to learn from.
    const trap = (body as Record<string, unknown>)[HONEYPOT_FIELD]
    if (typeof trap === "string" && trap.trim() !== "") {
        console.warn("[perk-offer] honeypot filled — dropped")
        return NextResponse.json({ ok: true })
    }

    const parsed = perkOfferSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: "چند فیلد نیاز به اصلاح دارد.", fields: fieldErrors(parsed.error) },
            { status: 422 }
        )
    }
    const data = parsed.data

    try {
        const offer = await prisma.perkOffer.create({
            data: {
                companyName: data.companyName,
                website: data.website,
                contactName: data.contactName,
                email: data.email,
                telegram: data.telegram || null,
                country: data.country,
                perkType: data.perkType,
                description: data.description,
                valueEstimate: data.valueEstimate || null,
                markets: data.markets,
                validity: data.validity || null,
                consent: data.consent,
            },
        })

        let emailOk = false
        try {
            await sendPerkOfferNotification({
                id: offer.id,
                companyName: data.companyName,
                website: data.website,
                contactName: data.contactName,
                email: data.email,
                telegram: data.telegram,
                country: labelOf(COUNTRIES, data.country),
                perkType: labelOf(PERK_TYPES, data.perkType),
                description: data.description,
                valueEstimate: data.valueEstimate,
                markets: data.markets.map((m) => labelOf(MARKETS, m)).join("، "),
                validity: data.validity,
            })
            emailOk = true
        } catch (err) {
            console.error("[perk-offer] notification failed — offer saved to DB only:", err)
        }

        if (emailOk) {
            await prisma.perkOffer.update({ where: { id: offer.id }, data: { emailOk } })
        }

        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error("[perk-offer] save failed:", err)
        return NextResponse.json(
            { error: "ثبت پیشنهاد با خطا روبه‌رو شد. لطفاً چند دقیقه‌ی دیگر دوباره امتحان کنید یا ایمیل بزنید." },
            { status: 500 }
        )
    }
}

export const POST = withRateLimit("perk-offer", RATE_RULES.perkOffer, handler)
