// ============================================================================
// Hardware Source: content-provider-check.ts
// Version: 1.0.0 — 2026-09-25
// Why: The content engine runs each agent on a vendor Farjad picks from the
//      admin. This asks all three vendors the same schema-constrained question
//      and reports which ones actually answer, with tokens and cost — the
//      cheapest possible proof that the provider layer works before any agent
//      depends on it.
// Env / Identity: Local script. Run: npx tsx scripts/content-provider-check.ts
//      Reads keys from .env.local, then .env. A missing key is reported, not a
//      failure; a present key that errors IS a failure (exit 1).
// ============================================================================

import { config } from "dotenv"
config({ path: ".env.local" })
config()

import { z } from "zod"
import { complete, hasKey, ProviderKeyMissing } from "../src/lib/content/provider"
import { PROVIDERS, KEY_ENV_VAR, DEFAULT_MODEL_FOR_PROVIDER, resolveAgentFrom, settingKey } from "../src/lib/content/agents"

const Answer = z.object({
    city: z.string(),
    country: z.string(),
    population_millions: z.number(),
})

async function main() {
    console.log("\n── Provider round-trip ──────────────────────────────────────\n")

    let failures = 0
    let skipped = 0

    for (const provider of PROVIDERS) {
        const model = DEFAULT_MODEL_FOR_PROVIDER[provider]
        const label = `${provider.padEnd(10)} ${model}`

        if (!hasKey(provider)) {
            console.log(`⊘  ${label}\n   no key — set ${KEY_ENV_VAR[provider]} in .env.local\n`)
            skipped++
            continue
        }

        try {
            const result = await complete({
                agent: "brief",
                // Force this provider regardless of what is stored in the database.
                settings: { [settingKey("brief", "provider")]: provider },
                system: "You answer with facts only. No commentary.",
                user: "Tehran: give the city, its country, and its population in millions.",
                schema: Answer,
                schemaName: "city_fact",
                maxTokens: 512,
            })

            const cost = (result.costCents / 100).toFixed(4)
            console.log(
                `✓  ${label}\n` +
                    `   ${result.data.city}, ${result.data.country} — ${result.data.population_millions}M\n` +
                    `   ${result.inputTokens} in / ${result.outputTokens} out · $${cost} · ${result.ms}ms\n`,
            )
        } catch (error) {
            failures++
            const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
            console.log(`✗  ${label}\n   ${message.split("\n")[0]}\n`)
        }
    }

    // The guard that matters most needs no key at all: a reviewer must never be
    // resolvable onto the same vendor as the writer it reviews.
    console.log("── Reviewer/writer vendor guard ────────────────────────────\n")
    const clash = {
        [settingKey("writer.fa", "provider")]: "openai",
        [settingKey("review.fa", "provider")]: "openai",
    }
    try {
        resolveAgentFrom("review.fa", clash)
        console.log("✗  a same-vendor reviewer resolved — the guard is not working\n")
        failures++
    } catch (error) {
        console.log(`✓  refused: ${(error as Error).message.split(" — ")[0]}\n`)
    }

    // And a missing key must name the variable rather than failing obscurely.
    try {
        await complete({
            agent: "brief",
            settings: { [settingKey("brief", "provider")]: "google" },
            system: "x",
            user: "x",
            schema: Answer,
            schemaName: "city_fact",
        })
        console.log("(google key present — skipped the missing-key check)\n")
    } catch (error) {
        if (error instanceof ProviderKeyMissing) {
            console.log(`✓  missing key reported clearly: ${error.message}\n`)
        }
    }

    console.log("────────────────────────────────────────────────────────────")
    console.log(`${PROVIDERS.length - skipped - failures} ok · ${skipped} no key · ${failures} failed\n`)
    if (failures > 0) process.exit(1)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
