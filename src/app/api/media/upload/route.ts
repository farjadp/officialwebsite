// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-02-24
// Why: API Route Handler
// Env / Identity: Server Route Handlers
// ============================================================================

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'
import { withApiLogging } from '@/lib/api-logger'

async function postHandler(request: Request) {
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

        // Upload to Vercel Blob
        const { url } = await put(filename, buffer, {
            access: 'public',
            contentType: file.type,
            token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
        })

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

export const POST = withApiLogging('POST', postHandler as any)
