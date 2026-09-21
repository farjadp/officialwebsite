// ============================================================================
// File: src/app/sitemap.ts
// Route: /sitemap.xml
// Role: Every indexable URL on the site, in both locales.
// Why:  This file used to list ~14 static English paths and 5 Persian ones, so
//       all 10 diagnostic tools — the actual conversion path — were invisible to
//       search. It also submitted /newsletter (a 404) and stamped every static
//       entry with `new Date()`, which makes lastmod meaningless.
// Note: Anything listed here must be indexable. Routes carrying NOINDEX or
//       matching DISALLOWED_PATHS are deliberately absent.
// ============================================================================

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/seo'
import { PORTFOLIO_ITEMS } from './(public)/portfolio/data'

type Entry = MetadataRoute.Sitemap[number]

/**
 * Static English routes that also exist under /fa.
 * Kept as one list so the two locales cannot drift apart.
 */
const BILINGUAL_PATHS = [
    '',
    '/about',
    '/contact',
    '/booking',
    '/portfolio',
    '/services',
    '/startups',
    '/stats',
    '/resume',
    '/services/founder-advisory',
    '/services/startup-visa',
    '/services/digital-systems',
    '/services/private-mentorship',
    '/tools',
    '/tools/ai-adoption-score',
    '/tools/ai-website-readiness',
    '/tools/business-model-score',
    '/tools/business-model-stress-test',
    '/tools/impossible-trinity-simulator',
    '/tools/investor-readiness',
    '/tools/npi-assessment',
    '/tools/sales-funnel-score',
    '/tools/startup-readiness',
    '/tools/trl-assessment',
    '/work',
    '/privacy',
    '/terms',
]

/** English-only routes — no Persian twin exists. */
const EN_ONLY_PATHS = [
    // The blog is English-only. The Persian blog routes rendered the same post
    // records under Persian URLs and were deleted.
    '/blog',
]

/** Persian-only routes. */
const FA_ONLY_PATHS = [
    '/lab',
    '/book-club',
]

/**
 * Static content changes when it is edited, not on every crawl. Stamping
 * `new Date()` on every entry — which this file used to do — tells crawlers
 * the whole site changed on every fetch, and the signal is then ignored.
 * Bump this when the static pages are meaningfully rewritten.
 */
const STATIC_LAST_MODIFIED = new Date('2026-09-21T00:00:00.000Z')

function entry(path: string, priority: number, changeFrequency: Entry['changeFrequency'], lastModified: Date = STATIC_LAST_MODIFIED): Entry {
    return { url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority }
}

/** Tools and services are the conversion path, so they rank above generic pages. */
function priorityFor(path: string, locale: 'en' | 'fa'): number {
    const base =
        path === '' ? 1
            : path.startsWith('/tools') || path.startsWith('/services') ? 0.9
                : path === '/blog' || path === '/portfolio' ? 0.8
                    : 0.7
    return locale === 'fa' ? Math.round((base - 0.1) * 10) / 10 : base
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: Entry[] = [
        ...BILINGUAL_PATHS.flatMap((path) => [
            entry(path, priorityFor(path, 'en'), 'monthly'),
            entry(`/fa${path}`, priorityFor(path, 'fa'), 'monthly'),
        ]),
        ...EN_ONLY_PATHS.map((path) => entry(path, priorityFor(path, 'en'), 'monthly')),
        ...FA_ONLY_PATHS.map((path) => entry(`/fa${path}`, priorityFor(path, 'fa'), 'monthly')),
    ]

    // Portfolio case studies come from a static list, not the database.
    const portfolioEntries: Entry[] = PORTFOLIO_ITEMS.flatMap((item) => [
        entry(`/portfolio/${item.id}`, 0.7, 'yearly'),
        entry(`/fa/portfolio/${item.id}`, 0.6, 'yearly'),
    ])

    // Blog posts carry a real lastModified, so they get an honest one.
    let postEntries: Entry[] = []
    try {
        const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true },
        })
        postEntries = posts.map((post) =>
            entry(`/blog/${post.slug}`, 0.9, 'weekly', post.updatedAt)
        )
    } catch (e) {
        console.error('Failed to query posts for sitemap generation', e)
    }

    return [...staticEntries, ...portfolioEntries, ...postEntries]
}
