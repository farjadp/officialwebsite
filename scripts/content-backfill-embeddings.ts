// ============================================================================
// Hardware Source: content-backfill-embeddings.ts
// Version: 1.0.0 — 2026-09-25
// Why: The semantic duplicate guard compares a new brief with every existing
//      post's embedding. Until the existing posts are embedded, that guard sees
//      nothing — it silently passes everything. Run this once before the
//      engine writes for real, and again after any bulk import of posts.
//      (The lexical guard needs none of this and is already live.)
// Env / Identity: Local script. Needs OPENAI_API_KEY and DATABASE_URL.
//      Run: npx tsx scripts/content-backfill-embeddings.ts [--all]
//      Default embeds only posts that have none; --all re-embeds everything.
// ============================================================================

import "./_env"

import OpenAI from "openai"
import { prisma } from "../src/lib/prisma"
import { EMBEDDING_MODEL, postFingerprintText } from "../src/lib/content/duplicates"
import { hasKey } from "../src/lib/content/provider"

const BATCH = 50

async function main() {
    if (!hasKey("openai")) {
        console.log("No OPENAI_API_KEY in .env.local — nothing embedded. The lexical guard is still active.")
        process.exit(1)
    }

    const all = process.argv.includes("--all")
    const posts = await prisma.post.findMany({
        where: all ? {} : { embedding: { isEmpty: true } },
        select: { id: true, title: true, excerpt: true, seoKeywords: true },
        orderBy: { createdAt: "asc" },
    })
    console.log(`${posts.length} post(s) to embed with ${EMBEDDING_MODEL}${all ? " (--all)" : ""}`)

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    let done = 0
    let tokens = 0

    for (let i = 0; i < posts.length; i += BATCH) {
        const batch = posts.slice(i, i + BATCH)
        const response = await client.embeddings.create({
            model: EMBEDDING_MODEL,
            input: batch.map((post) => postFingerprintText(post).slice(0, 8000)),
        })
        tokens += response.usage.total_tokens

        // The API returns one embedding per input, in input order.
        for (const [index, item] of response.data.entries()) {
            await prisma.post.update({
                where: { id: batch[index].id },
                data: { embedding: item.embedding },
            })
            done++
        }
        console.log(`  ${done}/${posts.length}`)
    }

    // text-embedding-3-small: $0.02 per million tokens.
    console.log(`done — ${done} embedded, ${tokens} tokens, ≈ $${((tokens / 1e6) * 0.02).toFixed(4)}`)
    await prisma.$disconnect()
}

main().catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
})
