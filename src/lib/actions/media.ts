"use server"

// ============================================================================
// Hardware Source: media.ts
// Version: 1.0.0 — 2026-02-24
// Why: Core utility / logic function
// Env / Identity: Server Action / Module
// ============================================================================

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { Storage } from "@google-cloud/storage"

// Initialize Google Cloud Storage
const storage = new Storage()
const BUCKET_NAME = "officialwebsite-media-bucket"

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File
    if (!file) {
        return { error: "No file provided" }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`

    try {
        const bucket = storage.bucket(BUCKET_NAME)
        const gcsFile = bucket.file(filename)

        await gcsFile.save(buffer, {
            contentType: file.type,
            resumable: false,
        })

        const url = `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`

        await prisma.media.create({
            data: {
                filename: filename,
                url: url,
                type: file.type,
                size: file.size
            }
        })

        revalidatePath("/admin/media")
        return { success: true, url }
    } catch (e) {
        console.error("Upload error", e)
        return { error: "Upload failed" }
    }
}

export async function deleteFile(id: string) {
    try {
        const media = await prisma.media.findUnique({ where: { id } })
        if (media) {
            // Delete from GCS
            const filename = media.filename
            const bucket = storage.bucket(BUCKET_NAME)
            await bucket.file(filename).delete().catch(console.error)
        }

        await prisma.media.delete({ where: { id } })
        revalidatePath("/admin/media")
        return { success: true }
    } catch (e) {
        return { error: "Delete failed" }
    }
}
