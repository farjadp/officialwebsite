// ============================================================================
// Hardware Source: robots.ts
// Version: 1.0.0 — 2026-02-24
// Why: Functional module
// Env / Identity: TypeScript Module
// ============================================================================

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: 'https://farjad.io/sitemap.xml',
    }
}
