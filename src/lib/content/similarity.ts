// ============================================================================
// Hardware Source: similarity.ts
// Version: 1.0.0 — 2026-09-25
// Why: The duplicate guard stops the engine paying to write an article the
//      blog already has. Two measures, deliberately:
//        · lexical — word overlap after stopwords. Free, instant, needs no key,
//          and catches the common case: the same headline reworded.
//        · semantic — cosine over embeddings. Catches a different headline for
//          the same argument, but needs an OpenAI key and embedded posts.
//      The lexical check always runs, so the guard protects the blog even on
//      the day the embedding key is missing.
// Env / Identity: Pure.
// ============================================================================

const STOPWORDS = new Set(
    (
        "a an and are as at be been being but by can could did do does doing don't for from had has have " +
        "how i i'm if in into is it it's its just me more most my no not of on or our out over so than " +
        "that the their them then there these they this those to too up us very was we were what when " +
        "where which while who why will with would you your yours about after all also any because before " +
        "between both each few here if its itself only other own same should some such through under until " +
        "again against down further once off"
    ).split(" "),
)

/** Lower-cased content words, stopwords and punctuation removed. */
export function contentWords(text: string): Set<string> {
    const words = text
        .toLowerCase()
        .replace(/[‘’]/g, "'")
        .split(/[^a-z0-9'؀-ۿ]+/)
        .map((word) => word.replace(/^'+|'+$/g, ""))
        .filter((word) => word.length > 1 && !STOPWORDS.has(word))
    return new Set(words)
}

/** Jaccard overlap of content words: 0 unrelated, 1 the same words. */
export function lexicalSimilarity(a: string, b: string): number {
    const left = contentWords(a)
    const right = contentWords(b)
    if (left.size === 0 || right.size === 0) return 0

    let shared = 0
    for (const word of left) if (right.has(word)) shared++
    return shared / (left.size + right.size - shared)
}

/** Cosine similarity. Throws on mismatched lengths rather than lying. */
export function cosine(a: readonly number[], b: readonly number[]): number {
    if (a.length !== b.length) {
        throw new Error(`Vector length mismatch: ${a.length} vs ${b.length}`)
    }
    let dot = 0
    let normA = 0
    let normB = 0
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    if (normA === 0 || normB === 0) return 0
    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}
