import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendEmailVerificationEmail, sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 })
        }
        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
            },
        })

        // Create email verification token
        const token = crypto.randomBytes(32).toString("hex")
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
        await prisma.emailVerificationToken.create({
            data: { token, userId: user.id, expiresAt },
        })

        // Send emails (non-blocking)
        try {
            await Promise.all([
                sendEmailVerificationEmail(email, token),
                sendWelcomeEmail(email, name),
            ])
        } catch (e) {
            console.error("[Email Error]", e)
        }

        return NextResponse.json({ success: true, message: "Account created. Please check your email to verify." }, { status: 201 })
    } catch (error) {
        console.error("[Register Error]", error)
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }
}
