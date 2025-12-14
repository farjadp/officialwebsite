// ============================================================================
// Hardware Source: src/app/actions/tags.ts
// Version: 1.0.0
// Why: Server Actions for Tag Management
// ============================================================================

'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTags() {
    return await prisma.tag.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        },
        orderBy: { name: 'asc' }
    })
}

export async function createTag(data: { name: string; slug: string }) {
    try {
        const tag = await prisma.tag.create({ data })
        revalidatePath('/admin/posts')
        return { success: true, data: tag }
    } catch (error) {
        console.error('Error creating tag:', error)
        return { success: false, error: 'Failed to create tag' }
    }
}

export async function deleteTag(id: string) {
    try {
        await prisma.tag.delete({ where: { id } })
        revalidatePath('/admin/posts')
        return { success: true }
    } catch (error) {
        console.error('Error deleting tag:', error)
        return { success: false, error: 'Failed to delete tag' }
    }
}
