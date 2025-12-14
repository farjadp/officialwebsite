import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://farjad.io' // Replace with actual domain later

    // Static pages
    const routes = [
        '',
        '/about',
        '/topics',
        '/series',
        '/tools',
        '/newsletter',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // In a real app, fetch dynamic posts here
    // const posts = await prisma.post.findMany(...)
    const posts = [
        { slug: 'passion-metric', date: new Date() },
        { slug: 'valley-of-death', date: new Date() },
    ].map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: post.date,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    return [...routes, ...posts]
}
