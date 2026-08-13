import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        const body = await req.json()
        const { currentUrl, aiGuess, userDescription } = body

        let userId = null
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true },
            })
            if (user) {
                userId = user.id
            }
        }

        const bugReport = await prisma.bugReport.create({
            data: {
                userId,
                currentUrl,
                aiGuess,
                userDescription,
            },
        })

        return NextResponse.json({ success: true, id: bugReport.id })
    } catch (error) {
        console.error("[BUG_REPORT_ERROR]", error)
        return NextResponse.json({ error: "Failed to submit bug report" }, { status: 500 })
    }
}
