"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

const SeriesSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
    description: z.string().optional(),
})

export type SeriesFormState = {
    errors?: {
        name?: string[]
        slug?: string[]
        description?: string[]
    }
    message?: string
}

export async function createSeries(prevState: SeriesFormState, formData: FormData): Promise<SeriesFormState> {
    const validatedFields = SeriesSchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation Error",
        }
    }

    try {
        const existing = await prisma.series.findUnique({ where: { slug: validatedFields.data.slug } })
        if (existing) {
            return {
                errors: { slug: ["Slug already exists"] },
                message: "Slug already exists"
            }
        }

        await prisma.series.create({
            data: validatedFields.data,
        })
    } catch (error) {
        return {
            message: "Database Error",
        }
    }

    revalidatePath("/admin/series")
    redirect("/admin/series")
}
