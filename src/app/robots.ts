// ============================================================================
// Hardware Source: robots.ts
// Version: 1.0.0 — 2026-02-24
// Why: Functional module
// Env / Identity: TypeScript Module
// ============================================================================

import { MetadataRoute } from 'next'
import { SITE_URL, DISALLOWED_PATHS } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Shared with sitemap.ts so robots and the sitemap cannot disagree.
            // /e/ matters most: those are per-recipient email views behind a
            // token, and a crawled token makes one person's mail public.
            disallow: [...DISALLOWED_PATHS],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
