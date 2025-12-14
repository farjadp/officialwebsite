"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const TopicSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
    description: z.string().optional(),
})

export type TopicFormState = {
    errors?: {
        name?: string[]
        slug?: string[]
        description?: string[]
        _form?: string[]
    }
    message?: string
}

export async function createTopic(prevState: TopicFormState, formData: FormData): Promise<TopicFormState> {
    const validatedFields = TopicSchema.safeParse({
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Topic.",
        }
    }

    const { name, slug, description } = validatedFields.data

    try {
        // Check if slug exists
        const existing = await prisma.topic.findUnique({ where: { slug } })
        if (existing) {
            return {
                errors: { slug: ["Slug already exists"] },
                message: "Slug already exists"
            }
        }

        await prisma.topic.create({
            data: {
                name,
                slug,
                description,
            },
        })
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Topic.",
        }
    }

    revalidatePath("/admin/topics")
    return { message: "Topic created successfully" }
}

export async function deleteTopic(id: string) {
    try {
        await prisma.topic.delete({
            where: { id },
        })
        revalidatePath("/admin/topics")
        return { message: "Deleted Topic" }
    } catch (error) {
        return { message: "Database Error: Failed to Delete Topic." }
    }
}

export async function updateTopic(id: string, prevState: TopicFormState, formData: FormData) {
    // Implementation for update similar to create
    // omitting for brevity of this initial step, can be added when editing is wired up
    return { message: "Not implemented yet" }
}
