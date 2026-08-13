// ============================================================================
// /api/admin/intake/invites — manage intake invite codes (admin only)
// GET: list | POST: create | PATCH: update (label/isActive/maxUses) | DELETE
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { withApiLogging } from "@/lib/api-logger"
import { generateInviteCode } from "@/lib/intake"

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

async function getHandler() {
    const guard = await requireAdmin()
    if (guard) return guard
    try {
        const invites = await prisma.intakeInvite.findMany({
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { submissions: true } } },
        })
        return NextResponse.json({ success: true, data: invites })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

async function postHandler(req: NextRequest) {
    const guard = await requireAdmin()
    if (guard) return guard
    try {
        const body = await req.json().catch(() => ({}))
        const label = typeof body.label === "string" ? body.label.trim().slice(0, 200) || null : null
        const maxUses = Number.isInteger(body.maxUses) && body.maxUses > 0 ? body.maxUses : 1

        // Retry on the (unlikely) unique collision
        for (let attempt = 0; attempt < 5; attempt++) {
            const code = generateInviteCode()
            const exists = await prisma.intakeInvite.findUnique({ where: { code } })
            if (exists) continue
            const invite = await prisma.intakeInvite.create({
                data: { code, label, maxUses },
            })
            return NextResponse.json({ success: true, data: invite })
        }
        return NextResponse.json({ error: "Could not generate a unique code" }, { status: 500 })
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

        const data: { label?: string | null; isActive?: boolean; maxUses?: number } = {}
        if (typeof body.label === "string") data.label = body.label.trim().slice(0, 200) || null
        if (typeof body.isActive === "boolean") data.isActive = body.isActive
        if (Number.isInteger(body.maxUses) && body.maxUses > 0) data.maxUses = body.maxUses

        const invite = await prisma.intakeInvite.update({ where: { id }, data })
        return NextResponse.json({ success: true, data: invite })
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

        await prisma.intakeInvite.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

export const GET = withApiLogging("GET", getHandler as any)
export const POST = withApiLogging("POST", postHandler as any)
export const PATCH = withApiLogging("PATCH", patchHandler as any)
export const DELETE = withApiLogging("DELETE", deleteHandler as any)
