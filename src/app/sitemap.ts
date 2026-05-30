// ============================================================================
// Hardware Source: sitemap.ts
// Version: 1.0.0 — 2026-02-24
// Why: Functional module
// Env / Identity: TypeScript Module
// ============================================================================

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://farjadp.info'

    // Static pages
    const staticPaths = [
        '',
        '/about',
        '/resume',
        '/topics',
        '/series',
        '/tools',
        '/newsletter',
    ]

    // English routes (canonical)
    const englishRoutes = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Persian subdomain routes (fa.farjadp.info)
    const persianBaseUrl = 'https://fa.farjadp.info'
    const persianRoutes = staticPaths.map((route) => ({
        url: `${persianBaseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 0.9 : 0.7,
    }))

    // Dynamic blog posts fetched from Prisma
    let dynamicPosts: MetadataRoute.Sitemap = []
    try {
        const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true }
        })

        dynamicPosts = posts.flatMap((post) => [
            {
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: post.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            },
            {
                url: `${persianBaseUrl}/blog/${post.slug}`,
                lastModified: post.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }
        ])
    } catch (e) {
        console.error("Failed to query posts for sitemap dynamic generation", e)
    }

    return [...englishRoutes, ...persianRoutes, ...dynamicPosts]
}
