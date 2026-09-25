// ============================================================================
// Hardware Source: duplicates.ts
// Version: 1.0.0 — 2026-09-25
// Why: The cheapest article is the one not written. Before a brief is accepted,
//      its angle is compared with everything already on the blog, so a
//      near-duplicate stops the job before any writing money is spent.
// Env / Identity: Server only. Reads Post; embeddings need OPENAI_API_KEY and
//      degrade to the lexical check alone without it.
// ============================================================================

import OpenAI from "openai"
import { prisma } from "@/lib/prisma"
import { cosine, lexicalSimilarity } from "./similarity"
import { hasKey } from "./provider"

export const EMBEDDING_MODEL = "text-embedding-3-small"

/**
 * Word overlap at or above this is the same article reworded. Deliberately
 * high: two different pieces on one broad topic share some words, and a guard
 * that refuses those would starve the engine.
 */
export const LEXICAL_DUPLICATE = 0.6

export type DuplicateMatch = {
    postId: string
    slug: string
    title: string
    score: number
    method: "lexical" | "semantic"
}

export async function embed(text: string): Promise<number[]> {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await client.embeddings.create({ model: EMBEDDING_MODEL, input: text.slice(0, 8000) })
    return response.data[0].embedding
}

/** The text a post is compared by: what it is about, not how it is written. */
export function postFingerprintText(post: { title: string; excerpt: string | null; seoKeywords: string | null }): string {
    return [post.title, post.excerpt ?? "", post.seoKeywords ?? ""].join("\n").trim()
}

/**
 * The closest existing article, if it is close enough to count as the same.
 *
 * Lexical first — free and always available. Semantic second, only with a key
 * and only against posts that have been embedded; an empty embedding means
 * "not yet backfilled", never "unrelated".
 */
export async function findNearDuplicate(
    candidate: { title: string; angle: string },
    semanticThreshold: number,
): Promise<DuplicateMatch | null> {
    const posts = await prisma.post.findMany({
        where: { status: { in: ["PUBLISHED", "SCHEDULED", "DRAFT"] } },
        select: { id: true, slug: true, title: true, excerpt: true, seoKeywords: true, embedding: true },
    })

    let best: DuplicateMatch | null = null
    const consider = (match: DuplicateMatch) => {
        if (!best || match.score > best.score) best = match
    }

    for (const post of posts) {
        const score = lexicalSimilarity(candidate.title, post.title)
        if (score >= LEXICAL_DUPLICATE) {
            consider({ postId: post.id, slug: post.slug, title: post.title, score, method: "lexical" })
        }
    }
    if (best) return best

    const embedded = posts.filter((post) => post.embedding.length > 0)
    if (embedded.length === 0 || !hasKey("openai")) return null

    const vector = await embed(`${candidate.title}\n${candidate.angle}`)
    for (const post of embedded) {
        if (post.embedding.length !== vector.length) continue
        const score = cosine(vector, post.embedding)
        if (score >= semanticThreshold) {
            consider({ postId: post.id, slug: post.slug, title: post.title, score, method: "semantic" })
        }
    }
    return best
}

/** How much of the blog the semantic guard can currently see. */
export async function embeddingCoverage(): Promise<{ embedded: number; total: number }> {
    const [total, embedded] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { NOT: { embedding: { isEmpty: true } } } }),
    ])
    return { embedded, total }
}
