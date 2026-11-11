// ============================================================================
// Hardware Source: route.ts
// Version: 1.1.0 — 2026-11-11
// Why: One-click unsubscribe (RFC 8058) + human-facing confirmation.
//      1.1.0: GET no longer unsubscribes. Link scanners open every URL in an
//      email, so GET only shows a confirmation page; the change happens on POST.
// Env / Identity: Server Route Handler
// ============================================================================

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { suppress, marketingBaseUrl } from "@/lib/email/provider"
import { confirmPage, donePage, invalidPage, postResponseKind } from "@/lib/email/unsubscribe"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ token: string }> }

function findContact(token: string) {
    return prisma.contact.findUnique({
        where: { unsubToken: token },
        select: { id: true, email: true, status: true },
    })
}

async function unsubscribe(token: string): Promise<string | null> {
    const contact = await findContact(token)
    if (!contact) return null

    if (contact.status !== "UNSUBSCRIBED") {
        await suppress(contact.email, "UNSUBSCRIBE", "one-click")
        await prisma.emailEvent.create({
            data: { type: "UNSUBSCRIBED", contactId: contact.id, email: contact.email },
        })
    }

    return contact.email
}

function page({ title, titleFa, body }: { title: string; titleFa: string; body: string }, status = 200): NextResponse {
    return new NextResponse(
        `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#f2ecdf; color:#17150f;
         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,Tahoma,sans-serif; padding:24px; }
  .card { max-width:440px; width:100%; background:#faf8f3; border:1px solid #ddd4c2; border-radius:14px; padding:36px; text-align:center; }
  h1 { margin:0 0 4px; font-size:21px; }
  h2 { margin:0 0 16px; font-size:16px; font-weight:500; color:#6d6559; }
  p { margin:0 0 8px; color:#4a443b; line-height:1.7; font-size:15px; }
  a { color:#8d5d16; }
  button { font:inherit; font-size:15px; font-weight:600; color:#faf8f3; background:#8d5d16; border:0; border-radius:8px; padding:12px 24px; cursor:pointer; }
  @media (prefers-color-scheme: dark) {
    body { background:#141312; color:#ede8df; }
    .card { background:#1f1d1b; border-color:#33302c; }
    p { color:#cfc8bb; } h2 { color:#a39c90; } a { color:#e8c48a; }
    button { background:#e8c48a; color:#141312; }
  }
</style></head>
<body><div class="card"><h1>${title}</h1><h2 dir="rtl" lang="fa">${titleFa}</h2>${body}</div></body></html>`,
        { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
    )
}

/**
 * Two callers POST here:
 * - mail clients, when the reader hits the native "Unsubscribe" button
 *   (RFC 8058). It must succeed silently and immediately;
 * - our own confirmation page (form field confirm=1), which gets HTML back.
 */
export async function POST(request: Request, { params }: Params) {
    const { token } = await params

    let form: URLSearchParams | null = null
    try {
        form = new URLSearchParams(await request.text())
    } catch {
        form = null
    }

    const email = await unsubscribe(token)
    const prefsUrl = `${marketingBaseUrl()}/e/p/${token}`

    if (postResponseKind(form) === "page") {
        return email ? page(donePage(email, prefsUrl)) : page(invalidPage(), 404)
    }
    return NextResponse.json({ ok: !!email }, { status: email ? 200 : 404 })
}

/** Opening the link only asks. Nothing changes until the button is pressed. */
export async function GET(_request: Request, { params }: Params) {
    const { token } = await params
    const contact = await findContact(token)
    if (!contact) return page(invalidPage(), 404)

    const base = marketingBaseUrl()
    const prefsUrl = `${base}/e/p/${token}`
    if (contact.status === "UNSUBSCRIBED") return page(donePage(contact.email, prefsUrl))

    return page(confirmPage(contact.email, `${base}/e/u/${token}`, prefsUrl))
}
