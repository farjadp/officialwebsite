// ============================================================================
// /api/profile/intake — authenticated user's own startup intake
// GET: load the current user's intake (null if not started)
// POST: upsert the current user's intake (draft or final submit)
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { withApiLogging } from "@/lib/api-logger"
import {
    INTAKE_COUNTRIES,
    ALL_QUESTION_IDS,
    type IntakeCountry,
    type IntakeFounder,
    type IntakeFiles,
} from "@/data/startup-intake/config"

function cleanString(v: unknown, max = 500): string {
    return typeof v === "string" ? v.trim().slice(0, max) : ""
}

const ALLOWED_STATUS = new Set(["DRAFT", "SUBMITTED"])

async function getHandler() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const intakes = await prisma.startupIntake.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ intakes })
}

interface PostBody {
    id?: string
    startupName?: string
    website?: string
    country?: string
    founders?: unknown
    answers?: unknown
    files?: unknown
    status?: string
}

async function postHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = (await req.json().catch(() => ({}))) as PostBody

        const status = cleanString(body.status, 20) || "DRAFT"
        if (!ALLOWED_STATUS.has(status)) {
            return NextResponse.json({ error: "Invalid status." }, { status: 400 })
        }

        const startupName = cleanString(body.startupName, 200)
        if (status === "SUBMITTED" && !startupName) {
            return NextResponse.json({ error: "Startup name is required." }, { status: 400 })
        }
        const website = cleanString(body.website, 300) || null

        const country = cleanString(body.country, 10)
        if (status === "SUBMITTED" && !INTAKE_COUNTRIES.includes(country as IntakeCountry)) {
            return NextResponse.json({ error: "Invalid destination country." }, { status: 400 })
        }

        const rawFounders = Array.isArray(body.founders) ? body.founders : []
        const founders: IntakeFounder[] = rawFounders
            .map((f: unknown) => {
                const o = (f ?? {}) as Record<string, unknown>
                return {
                    name: cleanString(o.name, 150),
                    role: cleanString(o.role, 150),
                    email: cleanString(o.email, 200),
                    phone: cleanString(o.phone, 50) || undefined,
                    linkedin: cleanString(o.linkedin, 300) || undefined,
                    photoUrl: cleanString(o.photoUrl, 500) || undefined,
                }
            })
            .filter((f) => f.name.length > 0)

        if (status === "SUBMITTED" && founders.length === 0) {
            return NextResponse.json(
                { error: "At least one founder with a name is required." },
                { status: 400 }
            )
        }

        const rawAnswers = (body.answers ?? {}) as Record<string, unknown>
        const answers: Record<string, string> = {}
        const missing: string[] = []
        if (status === "SUBMITTED") {
            for (const qid of ALL_QUESTION_IDS) {
                const val = cleanString(rawAnswers[qid], 10000)
                if (!val) {
                    missing.push(qid)
                } else {
                    answers[qid] = val
                }
            }
            if (missing.length > 0) {
                return NextResponse.json(
                    { error: "Please answer all questions.", missing },
                    { status: 400 }
                )
            }
        } else {
            for (const qid of ALL_QUESTION_IDS) {
                const val = cleanString(rawAnswers[qid], 10000)
                if (val) answers[qid] = val
            }
        }

        const rawFiles = (body.files ?? {}) as Record<string, unknown>
        const cleanFile = (v: unknown) => {
            const o = (v ?? {}) as Record<string, unknown>
            const url = cleanString(o.url, 600)
            if (!url) return undefined
            return {
                url,
                name: cleanString(o.name, 300) || "file",
                size: typeof o.size === "number" ? o.size : 0,
            }
        }
        const files: IntakeFiles = {}
        const logo = cleanFile(rawFiles.logo)
        if (logo) files.logo = logo
        const pitchDeck = cleanFile(rawFiles.pitchDeck)
        if (pitchDeck) files.pitchDeck = pitchDeck
        if (Array.isArray(rawFiles.documents)) {
            const docs = rawFiles.documents
                .map(cleanFile)
                .filter((f): f is NonNullable<typeof f> => !!f)
            if (docs.length > 0) files.documents = docs
        }

        const data = {
            startupName,
            website,
            country,
            founders: founders as object[],
            answers,
            files: files as object,
            status,
        }

        let intake
        if (body.id) {
            // Check if it belongs to the user
            const existing = await prisma.startupIntake.findUnique({
                where: { id: body.id },
                select: { userId: true },
            })
            if (!existing || existing.userId !== user.id) {
                return NextResponse.json({ error: "Intake not found or unauthorized." }, { status: 404 })
            }
            intake = await prisma.startupIntake.update({
                where: { id: body.id },
                data,
            })
        } else {
            intake = await prisma.startupIntake.create({
                data: { userId: user.id, ...data },
            })
        }

        return NextResponse.json({ success: true, intake })
    } catch (error) {
        console.error("[profile/intake] error:", error)
        return NextResponse.json(
            { error: "Failed to save intake." },
            { status: 500 }
        )
    }
}

export const GET = withApiLogging("GET", getHandler as any)
export const POST = withApiLogging("POST", postHandler as any)
