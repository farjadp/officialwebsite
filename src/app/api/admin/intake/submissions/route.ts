// ============================================================================
// /api/admin/intake/submissions — manage intake submissions (admin only)
// GET: list (or ?id= detail) | PATCH: status/reviewNote | DELETE
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { withApiLogging } from "@/lib/api-logger"

async function requireAdmin() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const role = session.user.role
    if (role !== "OWNER" && role !== "EDITOR") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return null
}

async function getHandler(req: NextRequest) {
    const guard = await requireAdmin()
    if (guard) return guard
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (id) {
            const submission = await prisma.startupIntake.findUnique({
                where: { id },
                include: {
                    user: { select: { name: true, email: true } },
                    invite: { select: { code: true, label: true } },
                },
            })
            if (!submission) {
                return NextResponse.json({ error: "Not found" }, { status: 404 })
            }
            return NextResponse.json({ success: true, data: submission })
        }

        const submissions = await prisma.startupIntake.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                invite: { select: { code: true, label: true } },
            },
        })
        return NextResponse.json({ success: true, data: submissions })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

async function patchHandler(req: NextRequest) {
    const guard = await requireAdmin()
    if (guard) return guard
    try {
        const body = await req.json().catch(() => ({}))
        const id = typeof body.id === "string" ? body.id : ""
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 })

        const data: { status?: string; reviewNote?: string | null } = {}
        if (body.status === "SUBMITTED" || body.status === "REVIEWED") data.status = body.status
        if (typeof body.reviewNote === "string") data.reviewNote = body.reviewNote.trim().slice(0, 5000) || null

        const submission = await prisma.startupIntake.update({ where: { id }, data })
        return NextResponse.json({ success: true, data: submission })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

async function deleteHandler(req: NextRequest) {
    const guard = await requireAdmin()
    if (guard) return guard
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 })

        await prisma.startupIntake.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

export const GET = withApiLogging("GET", getHandler as any)
export const PATCH = withApiLogging("PATCH", patchHandler as any)
export const DELETE = withApiLogging("DELETE", deleteHandler as any)
