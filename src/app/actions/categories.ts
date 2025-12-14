// ============================================================================
// Hardware Source: src/app/actions/categories.ts
// Version: 1.0.0
// Why: Server Actions for Category Management
// ============================================================================

'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCategories() {
    return await prisma.category.findMany({
        include: {
            _count: {
                select: { posts: true }
            },
            parent: true,
            children: true
        },
        orderBy: { name: 'asc' }
    })
}

export async function createCategory(data: { name: string; slug: string; description?: string; parentId?: string; icon?: string }) {
    try {
        const category = await prisma.category.create({
            data: {
                ...data,
                parentId: data.parentId || null // Ensure null if empty string
            }
        })
        revalidatePath('/admin/posts')
        revalidatePath('/admin/categories')
        return { success: true, data: category }
    } catch (error) {
        console.error('Error creating category:', error)
        return { success: false, error: 'Failed to create category' }
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } })
        revalidatePath('/admin/posts')
        return { success: true }
    } catch (error) {
        console.error('Error deleting category:', error)
        return { success: false, error: 'Failed to delete category' }
    }
}
