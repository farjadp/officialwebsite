import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import * as bcrypt from "bcryptjs"

async function requireAdmin() {
    const session = await auth()
    if (!session?.user) return null
    const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!user || (user.role !== "OWNER" && user.role !== "EDITOR")) return null
    return user
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

        const { id } = await params
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, role: true,
                isActive: true, emailVerified: true, image: true,
                bio: true, phone: true, createdAt: true, updatedAt: true,
            },
        })
        if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 })
        return NextResponse.json({ user })
    } catch (error) {
        console.error("[AdminUsers/:id GET]", error)
        return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await requireAdmin()
        if (!admin || admin.role !== "OWNER") return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

        const { id } = await params
        const { name, role, isActive, password } = await req.json()

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (role !== undefined) updateData.role = role
        if (isActive !== undefined) updateData.isActive = isActive
        if (password) {
            if (password.length < 8) return NextResponse.json({ error: "Password too short." }, { status: 400 })
            updateData.password = await bcrypt.hash(password, 12)
        }

        const user = await prisma.user.update({ where: { id }, data: updateData })
        return NextResponse.json({ user })
    } catch (error) {
        console.error("[AdminUsers/:id PATCH]", error)
        return NextResponse.json({ error: "Failed to update user." }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await requireAdmin()
        if (!admin || admin.role !== "OWNER") return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

        const { id } = await params
        const session = await auth()
        const selfUser = await prisma.user.findUnique({ where: { email: session!.user!.email! } })

        if (selfUser?.id === id) {
            return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 })
        }

        await prisma.user.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[AdminUsers/:id DELETE]", error)
        return NextResponse.json({ error: "Failed to delete user." }, { status: 500 })
    }
}
