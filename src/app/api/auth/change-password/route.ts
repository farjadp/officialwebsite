import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
        }

        const { currentPassword, newPassword } = await req.json()
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Both current and new passwords are required." }, { status: 400 })
        }
        if (newPassword.length < 8) {
            return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user || !user.password) {
            return NextResponse.json({ error: "User not found." }, { status: 404 })
        }

        const passwordsMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passwordsMatch) {
            return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        })

        return NextResponse.json({ success: true, message: "Password changed successfully." })
    } catch (error) {
        console.error("[ChangePassword Error]", error)
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
    }
}
