'use server'

// ============================================================================
// Hardware Source: posts.ts
// Version: 1.2.0 — 2026-03-05
// Why: Functional module + auto-publish via Content Waterfall
// Env / Identity: Server Action / Module
// ============================================================================

import { prisma } from "@/lib/prisma"
import { Post, PostStatus, Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { runWaterfallPipeline } from "@/lib/social-publisher"

export type CreatePostInput = {
    title: string
    slug: string
    content?: string
    excerpt?: string
    coverImage?: string
    status?: PostStatus
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    categoryIds?: string[]
    tagIds?: string[]
}

export type UpdatePostInput = Partial<CreatePostInput> & {
    id: string
}

export async function getPosts(params?: {
    status?: PostStatus
    categoryId?: string
    tagId?: string
    page?: number
    limit?: number
    query?: string
}) {
    const { status, categoryId, tagId, page = 1, limit = 10, query } = params || {}
    const skip = (page - 1) * limit

    const where: Prisma.PostWhereInput = {
        AND: [
            status ? { status } : {},
            categoryId ? { categories: { some: { id: categoryId } } } : {},
            tagId ? { tags: { some: { id: tagId } } } : {},
            query ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } }
                ]
            } : {}
        ]
    }

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            include: {
                categories: true,
                tags: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.post.count({ where })
    ])

    return { posts, total, totalPages: Math.ceil(total / limit) }
}

export async function getPost(idOrSlug: string) {
    const post = await prisma.post.findFirst({
        where: {
            OR: [
                { id: idOrSlug },
                { slug: idOrSlug }
            ]
        },
        include: {
            categories: true,
            tags: true,
        }
    })
    return post
}

export async function createPost(data: CreatePostInput) {
    const { categoryIds, tagIds, content, ...rest } = data

    // Calculate reading time
    let readingTime = 0
    let finalExcerpt = rest.excerpt

    if (content) {
        const text = content.replace(/<[^>]+>/g, '') // Strip HTML tags
        const words = text.trim().split(/\s+/).length
        readingTime = Math.ceil(words / 200)

        if (!finalExcerpt) {
            finalExcerpt = text.slice(0, 377)
            if (text.length > 377) finalExcerpt += '...'
        }
    }

    try {
        const post = await prisma.post.create({
            data: {
                ...rest,
                content,
                excerpt: finalExcerpt,
                readingTime,
                categories: categoryIds ? {
                    connect: categoryIds.map(id => ({ id }))
                } : undefined,
                tags: tagIds ? {
                    connect: tagIds.map(id => ({ id }))
                } : undefined,
            }
        })
        revalidatePath('/admin/posts')

        // ─── Auto-publish if created directly as PUBLISHED ───────────────
        if (post.status === 'PUBLISHED' && post.content) {
            runWaterfallPipeline(
                post.id,
                post.slug,
                post.title,
                post.content,
                post.excerpt
            ).catch((err) => console.error('[Auto-Publish] Background error:', err))
        }

        return { success: true, data: post }
    } catch (error) {
        console.error('Error creating post:', error)
        return { success: false, error: 'Failed to create post' }
    }
}

export async function updatePost(data: UpdatePostInput) {
    const { id, categoryIds, tagIds, content, ...rest } = data

    // Check if this is a publish action (status changing to PUBLISHED)
    let isNewPublish = false
    if (rest.status === 'PUBLISHED') {
        const currentPost = await prisma.post.findUnique({ where: { id }, select: { status: true } })
        isNewPublish = currentPost?.status !== 'PUBLISHED'
    }

    // Calculate reading time and excerpt
    let readingTime = undefined
    let finalExcerpt = rest.excerpt

    if (content) {
        const text = content.replace(/<[^>]+>/g, '')
        const words = text.trim().split(/\s+/).length
        readingTime = Math.ceil(words / 200)

        if (!finalExcerpt) {
            finalExcerpt = text.slice(0, 377)
            if (text.length > 377) finalExcerpt += '...'
        }
    }

    try {
        const post = await prisma.post.update({
            where: { id },
            data: {
                ...rest,
                content,
                excerpt: finalExcerpt,
                readingTime,
                categories: categoryIds ? {
                    set: [],
                    connect: categoryIds.map(cid => ({ id: cid }))
                } : undefined,
                tags: tagIds ? {
                    set: [],
                    connect: tagIds.map(tid => ({ id: tid }))
                } : undefined,
            }
        })
        revalidatePath('/admin/posts')
        revalidatePath(`/blog/${post.slug}`)

        // ─── Auto-publish on first PUBLISH ───────────────────────────────
        if (isNewPublish && post.content) {
            runWaterfallPipeline(
                post.id,
                post.slug,
                post.title,
                post.content,
                post.excerpt
            ).catch((err) => console.error('[Auto-Publish] Background error:', err))
        }

        return { success: true, data: post }
    } catch (error) {
        console.error('Error updating post:', error)
        return { success: false, error: 'Failed to update post' }
    }
}

export async function deletePost(id: string) {
    try {
        await prisma.post.delete({ where: { id } })
        revalidatePath('/admin/posts')
        return { success: true }
    } catch (error) {
        console.error('Error deleting post:', error)
        return { success: false, error: 'Failed to delete post' }
    }
}
