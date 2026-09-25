// ============================================================================
// Hardware Source: content-scout-check.ts
// Version: 1.0.0 — 2026-09-25
// Why: Feeds change shape without telling anyone. This hits one source of every
//      kind against the real network and prints what came back, so a parser
//      that has quietly stopped understanding Medium is visible in one run.
// Env / Identity: Local script, network only — it does not touch the database.
//      Run: npx tsx scripts/content-scout-check.ts
//      Exit 1 if any kind returns nothing.
// ============================================================================

import "./_env"

import type { ContentSource } from "@prisma/client"
import { fetchSource, referenceText } from "../src/lib/content/sources"
import { canonicalUrl, peakEngagement, scoreSignal } from "../src/lib/content/scout"

function fakeSource(over: Partial<ContentSource>): ContentSource {
    return {
        id: "check",
        kind: "RSS",
        label: "check",
        url: null,
        fileUrl: null,
        weight: 1,
        enabled: true,
        isReference: false,
        lastFetchedAt: null,
        lastError: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...over,
    } as ContentSource
}

const TRENDS = [
    fakeSource({ kind: "RSS", label: "Medium · artificial-intelligence", url: "https://medium.com/feed/tag/artificial-intelligence" }),
    fakeSource({ kind: "RSS", label: "Stratechery", url: "https://stratechery.com/feed/" }),
    fakeSource({ kind: "HN", label: "HN · AI agents", url: "AI agents" }),
    fakeSource({ kind: "REDDIT", label: "r/startups", url: "startups" }),
]

const REFERENCES = [
    fakeSource({ kind: "URL", label: "Farjad · about", url: "https://www.farjadp.info/about", isReference: true }),
]

async function main() {
    const now = new Date()
    let empty = 0

    console.log("\n── Trend sources ────────────────────────────────────────────\n")

    for (const source of TRENDS) {
        try {
            const signals = await fetchSource(source)
            if (signals.length === 0) {
                empty++
                console.log(`✗  ${source.kind.padEnd(7)} ${source.label}\n   returned no items — the parser or the feed has changed\n`)
                continue
            }

            const peak = peakEngagement(signals)
            const score = (s: (typeof signals)[number]) =>
                scoreSignal(s, { weight: source.weight, peakEngagement: peak, now })
            const top = [...signals].sort((a, b) => score(b) - score(a)).slice(0, 2)

            const dated = signals.filter((s) => s.publishedAt).length
            console.log(
                `✓  ${source.kind.padEnd(7)} ${source.label}\n` +
                    `   ${signals.length} items · ${dated} dated · engagement ${Math.max(...signals.map((s) => s.engagement))} max\n` +
                    top
                        .map(
                            (s) =>
                                `   · ${s.title.slice(0, 68)}\n     ${canonicalUrl(s.url).slice(0, 78)}\n     score ${score(s).toFixed(2)}`,
                        )
                        .join("\n") +
                    "\n",
            )
        } catch (error) {
            empty++
            console.log(`✗  ${source.kind.padEnd(7)} ${source.label}\n   ${(error as Error).message}\n`)
        }
    }

    console.log("── Reference sources ───────────────────────────────────────\n")

    for (const source of REFERENCES) {
        try {
            const body = await referenceText(source)
            if (!body.trim()) {
                empty++
                console.log(`✗  ${source.kind.padEnd(7)} ${source.label}\n   extracted no text\n`)
                continue
            }
            console.log(
                `✓  ${source.kind.padEnd(7)} ${source.label}\n` +
                    `   ${body.length} chars · "${body.replace(/\s+/g, " ").slice(0, 90)}…"\n`,
            )
        } catch (error) {
            empty++
            console.log(`✗  ${source.kind.padEnd(7)} ${source.label}\n   ${(error as Error).message}\n`)
        }
    }

    console.log("(PDF is exercised by uploading one in /admin/content/sources — no fixture here.)\n")
    console.log("────────────────────────────────────────────────────────────")
    console.log(`${TRENDS.length + REFERENCES.length - empty} ok · ${empty} empty or failed\n`)
    if (empty > 0) process.exit(1)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
