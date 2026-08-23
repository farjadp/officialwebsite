// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-08-23
// Why: Single AI endpoint for every assist point in the campaign editor
// Env / Identity: Server Route Handler
// ============================================================================

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { withApiLogging } from "@/lib/api-logger"
import {
    generateSubjects,
    generateCampaign,
    rewriteText,
    reviewDeliverability,
    describeSegment,
    analyzeResults,
    generateSequence,
    type RewriteMode,
} from "@/lib/email/ai"

export const maxDuration = 120

type Payload = Record<string, unknown>

function str(payload: Payload, key: string, fallback = ""): string {
    const value = payload[key]
    return typeof value === "string" ? value : fallback
}

async function postHandler(request: Request) {
    const session = await auth()
    if (!session?.user || !["OWNER", "EDITOR"].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 503 })
    }

    let body: Payload
    try {
        body = (await request.json()) as Payload
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const task = str(body, "task")

    try {
        switch (task) {
            case "subjects":
                return NextResponse.json({
                    suggestions: await generateSubjects({
                        goal: str(body, "goal"),
                        audience: str(body, "audience"),
                        bodySummary: str(body, "bodySummary"),
                        count: typeof body.count === "number" ? body.count : 10,
                        locale: str(body, "locale", "en"),
                    }),
                })

            case "draft":
                return NextResponse.json(
                    await generateCampaign({
                        goal: str(body, "goal"),
                        audience: str(body, "audience"),
                        keyPoints: str(body, "keyPoints"),
                        cta: str(body, "cta"),
                        ctaUrl: str(body, "ctaUrl"),
                        tone: str(body, "tone"),
                        locale: str(body, "locale", "en"),
                        length: (str(body, "length", "medium") as "short" | "medium" | "long"),
                    })
                )

            case "rewrite":
                return NextResponse.json({
                    html: await rewriteText({
                        html: str(body, "html"),
                        mode: str(body, "mode", "punchier") as RewriteMode,
                        instruction: str(body, "instruction"),
                    }),
                })

            case "review":
                return NextResponse.json(
                    await reviewDeliverability({
                        subject: str(body, "subject"),
                        preheader: str(body, "preheader"),
                        html: str(body, "html"),
                        fromEmail: str(body, "fromEmail"),
                        hasUnsubscribe: body.hasUnsubscribe !== false,
                        hasPlainText: body.hasPlainText !== false,
                    })
                )

            case "segment":
                return NextResponse.json({ filter: await describeSegment(str(body, "prompt")) })

            case "sequence":
                return NextResponse.json(
                    await generateSequence({
                        goal: str(body, "goal"),
                        audience: str(body, "audience"),
                        stepCount: typeof body.stepCount === "number" ? body.stepCount : 4,
                        locale: str(body, "locale", "en"),
                    })
                )

            case "analyze": {
                const campaignId = str(body, "campaignId")
                const campaign = await prisma.campaign.findUnique({
                    where: { id: campaignId },
                    include: { links: { orderBy: { clickCount: "desc" }, take: 8 } },
                })
                if (!campaign) {
                    return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
                }

                const sent = campaign.sentCount || 1
                return NextResponse.json(
                    await analyzeResults({
                        campaignName: campaign.name,
                        subject: campaign.subject,
                        stats: {
                            recipients: campaign.totalRecipients,
                            sent: campaign.sentCount,
                            delivered: campaign.deliveredCount,
                            openRatePercent: Math.round((campaign.uniqueOpenCount / sent) * 1000) / 10,
                            clickRatePercent: Math.round((campaign.uniqueClickCount / sent) * 1000) / 10,
                            bounceRatePercent: Math.round((campaign.bounceCount / sent) * 1000) / 10,
                            complaintRatePercent: Math.round((campaign.complaintCount / sent) * 1000) / 10,
                            unsubscribeRatePercent: Math.round((campaign.unsubCount / sent) * 1000) / 10,
                        },
                        topLinks: campaign.links.map((l) => ({ url: l.url, clicks: l.clickCount })),
                    })
                )
            }

            default:
                return NextResponse.json({ error: `Unknown task: ${task}` }, { status: 400 })
        }
    } catch (error) {
        console.error("Email AI task failed:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "AI request failed" },
            { status: 500 }
        )
    }
}

export const POST = withApiLogging("POST", postHandler as never)
