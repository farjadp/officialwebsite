// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-08-23
// Why: Open-tracking pixel — always returns an image, never an error
// Env / Identity: Server Route Handler
// ============================================================================

import { NextResponse } from "next/server"
import { recordOpen } from "@/lib/email/tracking"

export const dynamic = "force-dynamic"

// 1x1 transparent GIF — smaller and more universally rendered than a PNG
const PIXEL = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
)

function pixelResponse() {
    return new NextResponse(new Uint8Array(PIXEL), {
        status: 200,
        headers: {
            "Content-Type": "image/gif",
            "Content-Length": String(PIXEL.length),
            // Caching would hide repeat opens and let proxies serve a stale hit
            "Cache-Control": "no-store, no-cache, must-revalidate, private",
            Pragma: "no-cache",
        },
    })
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ campaignId: string; file: string }> }
) {
    const { campaignId, file } = await params
    // The filename carries the recipient id: "<recipientId>.png"
    const recipientId = file.replace(/\.(png|gif|jpg)$/i, "")

    try {
        await recordOpen(campaignId, recipientId, request.headers.get("user-agent"))
    } catch (error) {
        // Tracking must never break image rendering in the client
        console.error("Open tracking failed:", error)
    }

    return pixelResponse()
}
