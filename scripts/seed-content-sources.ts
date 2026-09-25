// ============================================================================
// Hardware Source: seed-content-sources.ts
// Version: 1.0.0 — 2026-09-25
// Why: The starting set of trend sources for the content engine. Farjad edits,
//      weights and disables these from /admin/content/sources; this only puts a
//      sensible first list in place.
// Env / Identity: Local script. Idempotent on `label` — re-running updates the
//      url/weight of an existing row instead of duplicating it, and never
//      re-enables something that was deliberately switched off.
//      Run: npx tsx scripts/seed-content-sources.ts
// ============================================================================

import "./_env"

import { prisma } from "../src/lib/prisma"

type Seed = { kind: "RSS" | "HN" | "REDDIT"; label: string; url: string; weight: number }

/**
 * Every URL here was fetched successfully on 25 Sep 2026 and returned items.
 *
 * Deliberately absent: a16z (no working feed — /feed/, /rss/ and
 * /news-content/feed/ all 404), Every (200 with an empty feed), First Round
 * Review (404), Paul Graham (no feed items). Weight is the multiplier on a
 * signal's score: a considered weekly essay outranks a tag feed's volume.
 */
const SOURCES: Seed[] = [
    // Considered, low-volume, high-signal
    { kind: "RSS", label: "Stratechery", url: "https://stratechery.com/feed/", weight: 3 },
    { kind: "RSS", label: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com/feed", weight: 3 },
    { kind: "RSS", label: "The Diff", url: "https://www.thediff.co/feed", weight: 3 },
    { kind: "RSS", label: "Platformer", url: "https://www.platformer.news/rss/", weight: 2 },
    { kind: "RSS", label: "Sifted", url: "https://sifted.eu/feed", weight: 2 },
    { kind: "RSS", label: "SaaStr", url: "https://www.saastr.com/feed/", weight: 2 },
    { kind: "RSS", label: "Lobsters", url: "https://lobste.rs/rss", weight: 1 },

    // High volume, low signal — kept at weight 1 so they inform rather than lead
    { kind: "RSS", label: "Medium · artificial-intelligence", url: "https://medium.com/feed/tag/artificial-intelligence", weight: 1 },
    { kind: "RSS", label: "Medium · startup", url: "https://medium.com/feed/tag/startup", weight: 1 },
    { kind: "RSS", label: "Medium · product-management", url: "https://medium.com/feed/tag/product-management", weight: 1 },
    { kind: "RSS", label: "Medium · saas", url: "https://medium.com/feed/tag/saas", weight: 1 },
    { kind: "RSS", label: "Medium · entrepreneurship", url: "https://medium.com/feed/tag/entrepreneurship", weight: 1 },

    // Hacker News: the `url` field holds the search query, not an address.
    { kind: "HN", label: "HN · AI agents", url: "AI agents", weight: 2 },
    { kind: "HN", label: "HN · product market fit", url: "product market fit", weight: 2 },
    { kind: "HN", label: "HN · founders", url: "founder startup", weight: 2 },

    // Reddit: the `url` field holds the subreddit.
    { kind: "REDDIT", label: "r/startups", url: "startups", weight: 2 },
    { kind: "REDDIT", label: "r/SaaS", url: "SaaS", weight: 2 },
    { kind: "REDDIT", label: "r/ExperiencedDevs", url: "ExperiencedDevs", weight: 2 },
    { kind: "REDDIT", label: "r/ProductManagement", url: "ProductManagement", weight: 2 },
    { kind: "REDDIT", label: "r/LocalLLaMA", url: "LocalLLaMA", weight: 1 },
]

async function main() {
    let created = 0
    let updated = 0

    for (const seed of SOURCES) {
        const existing = await prisma.contentSource.findFirst({ where: { label: seed.label } })

        if (existing) {
            await prisma.contentSource.update({
                where: { id: existing.id },
                // `enabled` is untouched on purpose: if Farjad switched a source
                // off, re-seeding must not switch it back on.
                data: { kind: seed.kind, url: seed.url, weight: seed.weight },
            })
            updated++
        } else {
            await prisma.contentSource.create({
                data: { kind: seed.kind, label: seed.label, url: seed.url, weight: seed.weight },
            })
            created++
        }
    }

    const total = await prisma.contentSource.count()
    console.log(`${created} created, ${updated} updated — ${total} sources in total`)
    await prisma.$disconnect()
}

main().catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
})
