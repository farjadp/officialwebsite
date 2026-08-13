"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    bio: z.string().max(500, "Bio must be under 500 characters.").optional(),
    phone: z.string().max(30, "Phone number is too long.").optional(),
})

function sanitizeFilename(name: string) {
    return name.replace(/[^a-zA-Z0-9.-]/g, "")
}

export type ProfileFormState =
    | { success: true; user: { id: string; name: string | null; email: string; bio: string | null; phone: string | null; image: string | null } }
    | { success: false; error: string }

export async function updateProfile(
    _prevState: unknown,
    formData: FormData
): Promise<ProfileFormState> {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "You must be signed in." }
        }

        const name = formData.get("name") as string
        const bio = (formData.get("bio") as string | null) ?? ""
        const phone = (formData.get("phone") as string | null) ?? ""
        const avatar = formData.get("avatar") as File | null

        const validated = profileSchema.safeParse({ name, bio, phone })
        if (!validated.success) {
            return { success: false, error: validated.error.issues[0]?.message || "Invalid input." }
        }

        let imageUrl: string | undefined

        if (avatar && avatar.size > 0) {
            if (!avatar.type.startsWith("image/")) {
                return { success: false, error: "Please upload an image file." }
            }
            if (avatar.size > 2 * 1024 * 1024) {
                return { success: false, error: "Avatar must be smaller than 2MB." }
            }

            const bytes = await avatar.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const originalName = sanitizeFilename(avatar.name) || "avatar"
            const filename = `avatars/${Date.now()}-${originalName}`

            const { url } = await put(filename, buffer, {
                access: "public",
                contentType: avatar.type,
                token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN,
            })

            imageUrl = url
        }

        const updateData: {
            name: string
            bio?: string | null
            phone?: string | null
            image?: string
        } = {
            name,
            bio: bio.trim() || null,
            phone: phone.trim() || null,
        }

        if (imageUrl) {
            updateData.image = imageUrl
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
            select: { id: true, name: true, email: true, bio: true, phone: true, image: true },
        })

        revalidatePath("/profile")

        return { success: true, user }
    } catch (error) {
        console.error("[updateProfile] error:", error)
        return { success: false, error: "Failed to update profile. Please try again." }
    }
}
