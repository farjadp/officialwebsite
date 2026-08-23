// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-08-23
// Why: Double opt-in confirmation — the strongest deliverability safeguard
// Env / Identity: Server Route Handler
// ============================================================================

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params

    const contact = await prisma.contact.findUnique({
        where: { confirmToken: token },
        select: { id: true, status: true },
    })

    if (contact && contact.status === "PENDING") {
        await prisma.contact.update({
            where: { id: contact.id },
            data: { status: "ACTIVE", confirmedAt: new Date(), confirmToken: null },
        })
    }

    const ok = !!contact
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" /><title>${ok ? "Subscription confirmed" : "Link not recognised"}</title>
<style>:root{color-scheme:light dark}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fafafa;color:#18181b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:24px}
.card{max-width:440px;width:100%;background:#fff;border:1px solid #e4e4e7;border-radius:14px;padding:36px;text-align:center}
h1{margin:0 0 10px;font-size:21px}p{margin:0;color:#52525b;line-height:1.6;font-size:15px}
@media(prefers-color-scheme:dark){body{background:#09090b;color:#fafafa}.card{background:#18181b;border-color:#27272a}p{color:#a1a1aa}}</style></head>
<body><div class="card"><h1>${ok ? "You're in" : "Link not recognised"}</h1><p>${
        ok
            ? "Your subscription is confirmed. Thanks for double-checking — it keeps this list clean for everyone."
            : "This confirmation link is invalid or has already been used."
    }</p></div></body></html>`

    return new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
    })
}
