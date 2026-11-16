// ============================================================================
// File: src/app/api/case-study/download/route.ts
// Route: GET /api/case-study/download?t=<signed link token>
// Role: Streams a gated case study's dataset (the Belink Excel file) to someone
//       holding a valid, unexpired link that this site emailed, whose Lead
//       still exists. The file lives in a PRIVATE Vercel Blob, so this route is
//       the only way to it. Each download is logged on the Lead.
// Abuse: per-IP limit (RATE_RULES.caseStudyDownload). An invalid link gets a
//       redirect to the case-study page, not an error dump.
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"
import { get } from "@vercel/blob"
import { prisma } from "@/lib/prisma"
import { withRateLimit, RATE_RULES } from "@/lib/rate-limit"
import { GATED_CASE_STUDIES, linkSecret, verifyLink } from "@/lib/case-study-gate"

async function handler(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("t")
    const study = GATED_CASE_STUDIES.belink
    const back = new URL(`${study.pagePath}#get`, req.nextUrl.origin)

    const result = verifyLink(token, "belink", linkSecret())
    if (!result.ok) return NextResponse.redirect(back, 303)

    const lead = await prisma.lead.findUnique({ where: { id: result.claims.leadId } }).catch(() => null)
    if (!lead) return NextResponse.redirect(back, 303)

    let file: Awaited<ReturnType<typeof get>>
    try {
        file = await get(study.dataFile.blobPath, { access: "private" })
    } catch (err) {
        console.error("[case-study] dataset fetch failed:", err)
        file = null
    }
    if (!file || file.statusCode !== 200) {
        return NextResponse.json({ error: "The file is unavailable right now. Please try again in a few minutes." }, { status: 503 })
    }

    // Log the download; never block the file on it.
    const answers = (lead.answers ?? {}) as Record<string, unknown>
    const downloads = Array.isArray(answers.downloads) ? answers.downloads : []
    prisma.lead
        .update({ where: { id: lead.id }, data: { answers: { ...answers, downloads: [...downloads, new Date().toISOString()].slice(-50) } as Prisma.InputJsonValue } })
        .catch((err) => console.error("[case-study] download log failed:", err))

    return new NextResponse(file.stream, {
        headers: {
            "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "content-disposition": `attachment; filename="${study.dataFile.filename}"`,
            "content-length": String(file.blob.size),
            "cache-control": "private, no-store",
            "referrer-policy": "no-referrer",
            "x-robots-tag": "noindex",
        },
    })
}

export const GET = withRateLimit("case-study-download", RATE_RULES.caseStudyDownload, handler)
