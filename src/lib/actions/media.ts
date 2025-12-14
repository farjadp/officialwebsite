"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import fs from "fs/promises"
import path from "path"

// For Development: Saving to public/uploads
// In Production: Replace with S3/R2 upload
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File
    if (!file) {
        return { error: "No file provided" }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`

    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true })
        await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer)

        const url = `/uploads/${filename}`

        await prisma.media.create({
            data: {
                filename: file.name,
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
        // In a real app we would delete from S3/Storage here too
        await prisma.media.delete({ where: { id } })
        revalidatePath("/admin/media")
        return { success: true }
    } catch (e) {
        return { error: "Delete failed" }
    }
}
