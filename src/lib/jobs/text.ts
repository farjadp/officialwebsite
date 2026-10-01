// ============================================================================
// Hardware Source: text.ts
// Version: 1.0.0 — 2026-10-01
// Why: Boards hand back descriptions as HTML, and Greenhouse hands it back
//      entity-escaped on top. The prefilter, the scorer and the detail page
//      all want the same plain text.
// Env / Identity: Pure.
// ============================================================================

const ENTITIES: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
    ndash: "–",
    mdash: "—",
    hellip: "…",
    bull: "•",
}

export function decodeEntities(input: string): string {
    return input.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body: string) => {
        if (body[0] === "#") {
            const code = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10)
            return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole
        }
        return ENTITIES[body.toLowerCase()] ?? whole
    })
}

/** HTML to readable plain text: block tags become line breaks, the rest go. */
export function htmlToText(html: string): string {
    return decodeEntities(
        html
            .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
            .replace(/<li[^>]*>/gi, "\n- ")
            .replace(/<\/(p|div|ul|ol|h[1-6]|tr|section)>/gi, "\n")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]+>/g, ""),
    )
        .replace(/[ \t ]+/g, " ")
        .replace(/ *\n */g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}
