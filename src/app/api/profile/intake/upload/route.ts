// ============================================================================
// POST /api/profile/intake/upload — authenticated file upload for user intake
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { withApiLogging } from "@/lib/api-logger"
import { INTAKE_ALLOWED_MIME, INTAKE_MAX_FILE_BYTES } from "@/lib/intake"

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9.\-_]/g, "") || "file"
}

async function postHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    })
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get("file") as File | null

        if (!file || file.size === 0) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 })
        }

        if (file.size > INTAKE_MAX_FILE_BYTES) {
            return NextResponse.json(
                { error: "File size must be under 20 MB." },
                { status: 400 }
            )
        }

        if (!INTAKE_ALLOWED_MIME.has(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only PDF, images, and Office files are allowed." },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const filename = `intake/${user.id}/${uniqueSuffix}-${sanitizeFilename(file.name)}`

        const { url } = await put(filename, buffer, {
            access: "public",
            contentType: file.type,
            token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN,
        })

        return NextResponse.json({ url, name: file.name, size: file.size })
    } catch (error) {
        console.error("[profile/intake/upload] error:", error)
        return NextResponse.json(
            { error: "Upload failed. Please try again." },
            { status: 500 }
        )
    }
}

export const POST = withApiLogging("POST", postHandler as any)
