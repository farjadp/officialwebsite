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
import { put, del } from "@vercel/blob"

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File
    if (!file) {
        return { error: "No file provided" }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`

    try {
        const { url } = await put(filename, buffer, {
            access: 'public',
            contentType: file.type,
            token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN,
        })

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
            // Delete from Vercel Blob
            await del(media.url, {
                token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
            }).catch(console.error)
        }

        await prisma.media.delete({ where: { id } })
        revalidatePath("/admin/media")
        return { success: true }
    } catch (e) {
        return { error: "Delete failed" }
    }
}
