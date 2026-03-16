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

export async function GET(req: NextRequest) {
    try {
        const admin = await requireAdmin()
        if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

        const { searchParams } = req.nextUrl
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const search = searchParams.get("search") || ""
        const role = searchParams.get("role") || ""

        const where: any = {}
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ]
        }
        if (role) where.role = role

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    emailVerified: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.user.count({ where }),
        ])

        return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) })
    } catch (error) {
        console.error("[AdminUsers GET]", error)
        return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const admin = await requireAdmin()
        if (!admin || admin.role !== "OWNER") return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

        const { name, email, password, role } = await req.json()
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 })
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) return NextResponse.json({ error: "Email already in use." }, { status: 409 })

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: role || "USER", emailVerified: new Date() },
        })

        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        console.error("[AdminUsers POST]", error)
        return NextResponse.json({ error: "Failed to create user." }, { status: 500 })
    }
}
