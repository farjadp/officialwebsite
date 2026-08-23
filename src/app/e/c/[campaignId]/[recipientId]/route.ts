// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-08-23
// Why: First-party click tracking redirect (keeps link reputation on our domain)
// Env / Identity: Server Route Handler
// ============================================================================

import { NextResponse } from "next/server"
import { recordClick } from "@/lib/email/tracking"
import { marketingBaseUrl } from "@/lib/email/provider"

export const dynamic = "force-dynamic"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ campaignId: string; recipientId: string }> }
) {
    const { campaignId, recipientId } = await params
    const target = new URL(request.url).searchParams.get("u")

    if (!target) return NextResponse.redirect(marketingBaseUrl(), 302)

    // Only ever redirect to http(s) — an open redirect here would be handed
    // straight to phishers, since the link lives on our authenticated domain.
    let destination: URL
    try {
        destination = new URL(target)
        if (destination.protocol !== "https:" && destination.protocol !== "http:") {
            return NextResponse.redirect(marketingBaseUrl(), 302)
        }
    } catch {
        return NextResponse.redirect(marketingBaseUrl(), 302)
    }

    try {
        await recordClick(campaignId, recipientId, destination.toString(), request.headers.get("user-agent"))
    } catch (error) {
        console.error("Click tracking failed:", error)
    }

    return NextResponse.redirect(destination.toString(), 302)
}
