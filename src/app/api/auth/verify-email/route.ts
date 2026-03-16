import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get("token")
        if (!token) {
            return NextResponse.redirect(new URL("/verify-email?error=missing", req.url))
        }

        const verificationToken = await prisma.emailVerificationToken.findUnique({ where: { token } })

        if (!verificationToken || verificationToken.used || verificationToken.expiresAt < new Date()) {
            return NextResponse.redirect(new URL("/verify-email?error=invalid", req.url))
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: verificationToken.userId },
                data: { emailVerified: new Date() },
            }),
            prisma.emailVerificationToken.update({
                where: { id: verificationToken.id },
                data: { used: true },
            }),
        ])

        return NextResponse.redirect(new URL("/verify-email?success=true", req.url))
    } catch (error) {
        console.error("[VerifyEmail Error]", error)
        return NextResponse.redirect(new URL("/verify-email?error=server", req.url))
    }
}
