// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-08-23
// Why: One-click unsubscribe (RFC 8058) + human-facing confirmation
// Env / Identity: Server Route Handler
// ============================================================================

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { suppress, marketingBaseUrl } from "@/lib/email/provider"

export const dynamic = "force-dynamic"

async function unsubscribe(token: string): Promise<string | null> {
    const contact = await prisma.contact.findUnique({
        where: { unsubToken: token },
        select: { id: true, email: true, status: true },
    })
    if (!contact) return null

    if (contact.status !== "UNSUBSCRIBED") {
        await suppress(contact.email, "UNSUBSCRIBE", "one-click")
        await prisma.emailEvent.create({
            data: { type: "UNSUBSCRIBED", contactId: contact.id, email: contact.email },
        })
    }

    return contact.email
}

function page(title: string, body: string, prefsUrl?: string): NextResponse {
    return new NextResponse(
        `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#fafafa; color:#18181b;
         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; padding:24px; }
  .card { max-width:440px; width:100%; background:#fff; border:1px solid #e4e4e7; border-radius:14px; padding:36px; text-align:center; }
  h1 { margin:0 0 10px; font-size:21px; }
  p { margin:0 0 8px; color:#52525b; line-height:1.6; font-size:15px; }
  a { color:#7c3aed; }
  @media (prefers-color-scheme: dark) {
    body { background:#09090b; color:#fafafa; }
    .card { background:#18181b; border-color:#27272a; }
    p { color:#a1a1aa; }
  }
</style></head>
<body><div class="card"><h1>${title}</h1>${body}${
            prefsUrl
                ? `<p style="margin-top:18px;">Prefer fewer emails instead of none? <a href="${prefsUrl}">Update your preferences</a>.</p>`
                : ""
        }</div></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
}

/**
 * Mail clients POST here without any user interaction when the reader hits the
 * native "Unsubscribe" button. It must succeed silently and immediately.
 */
export async function POST(
    _request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params
    const email = await unsubscribe(token)
    return NextResponse.json({ ok: !!email }, { status: email ? 200 : 404 })
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params
    const email = await unsubscribe(token)

    if (!email) {
        return page("Link not recognised", "<p>This unsubscribe link is invalid or has already been used.</p>")
    }

    return page(
        "You're unsubscribed",
        `<p><strong>${email}</strong> has been removed. You will not receive further campaigns.</p>`,
        `${marketingBaseUrl()}/e/p/${token}`
    )
}
