import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })

        // Always return success to avoid email enumeration
        if (!user || !user.password) {
            return NextResponse.json({ success: true })
        }

        // Invalidate old tokens
        await prisma.passwordResetToken.updateMany({
            where: { email, used: false },
            data: { used: true },
        })

        const token = crypto.randomBytes(32).toString("hex")
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1h

        await prisma.passwordResetToken.create({
            data: { token, email, userId: user.id, expiresAt },
        })

        await sendPasswordResetEmail(email, token)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[ForgotPassword Error]", error)
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
    }
}
