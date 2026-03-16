import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json()
        if (!token || !password) {
            return NextResponse.json({ error: "Token and new password are required." }, { status: 400 })
        }
        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
        }

        const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

        if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
            return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ])

        return NextResponse.json({ success: true, message: "Password updated successfully." })
    } catch (error) {
        console.error("[ResetPassword Error]", error)
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
    }
}
