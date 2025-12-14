// ============================================================================
// Hardware Source: src/app/api/media/upload/route.ts
// Version: 1.0.0
// Why: Media Upload Endpoint (Local filesystem storage for MVP)
// ============================================================================

import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
        const filename = `${uniqueSuffix}-${originalName}`

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), 'public/uploads')
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // ignore if exists
        }

        const filepath = join(uploadDir, filename)
        await writeFile(filepath, buffer)

        const url = `/uploads/${filename}`

        // Save to database
        const media = await prisma.media.create({
            data: {
                filename: filename,
                url: url,
                type: file.type,
                size: file.size
            }
        })

        return NextResponse.json({ url, id: media.id })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        )
    }
}
