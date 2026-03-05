// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-02-24
// Why: API Route Handler
// Env / Identity: Server Route Handlers
// ============================================================================

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Storage } from '@google-cloud/storage'

// Initialize Google Cloud Storage
// On Cloud Run, it automatically uses the attached service account credentials
const storage = new Storage()
const BUCKET_NAME = 'officialwebsite-media-bucket'

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

        // Upload to Google Cloud Storage
        const bucket = storage.bucket(BUCKET_NAME)
        const gcsFile = bucket.file(filename)

        await gcsFile.save(buffer, {
            contentType: file.type,
            resumable: false, // For small files
        })

        // GCS public URL format
        const url = `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`

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
