// ============================================================================
// Hardware Source: provider.ts
// Version: 1.0.0 — 2026-09-25
// Why: One call site for every agent in the content engine, so the reviewer can
//      run on a different vendor than the writer without any agent knowing
//      which vendor it is on. One Zod schema per agent drives native structured
//      output on all three vendors AND validates the answer, so a malformed
//      reply fails here instead of three states later.
// Env / Identity: Server only. Keys from OPENAI_API_KEY / GEMINI_API_KEY /
//      ANTHROPIC_API_KEY — never from the database.
// ============================================================================

import OpenAI from "openai"
import Anthropic from "@anthropic-ai/sdk"
import { zodResponseFormat } from "openai/helpers/zod"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import type { z } from "zod"
import { KEY_ENV_VAR, resolveAgentFrom, type AgentName, type Provider, type ResolvedAgent } from "./agents"
import { loadContentSettings } from "./settings"

/** Gemini speaks the OpenAI wire format at this base URL. */
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

const DEFAULT_MAX_TOKENS = 16_000

export class ProviderKeyMissing extends Error {
    constructor(readonly provider: Provider) {
        super(`No API key for ${provider}: set ${KEY_ENV_VAR[provider]}`)
        this.name = "ProviderKeyMissing"
    }
}

export class ProviderBadOutput extends Error {
    constructor(agent: AgentName, model: string, detail: string) {
        super(`Agent "${agent}" on ${model} returned output that failed its schema: ${detail}`)
        this.name = "ProviderBadOutput"
    }
}

/**
 * Per-million-token rates, input and output.
 *
 * Anthropic's are the published first-party rates. The OpenAI and Gemini rows
 * are **estimates** used only to drive the monthly budget ceiling and the
 * per-job cost shown in the admin — they are not billing figures, and an
 * unlisted model falls back to the most expensive row so the budget errs
 * towards stopping early rather than overspending.
 */
const RATES: Record<string, { in: number; out: number }> = {
    "claude-opus-5": { in: 5, out: 25 },
    "claude-sonnet-5": { in: 2, out: 10 },
    "claude-haiku-4-5": { in: 1, out: 5 },
    "gpt-4o": { in: 2.5, out: 10 },
    "gpt-4o-mini": { in: 0.15, out: 0.6 },
    "gemini-2.5-pro": { in: 1.25, out: 10 },
    "gemini-2.5-flash": { in: 0.3, out: 2.5 },
}
const FALLBACK_RATE = { in: 5, out: 25 }

function costCents(model: string, inputTokens: number, outputTokens: number): number {
    const rate = RATES[model] ?? FALLBACK_RATE
    const dollars = (inputTokens / 1e6) * rate.in + (outputTokens / 1e6) * rate.out
    return Math.round(dollars * 100)
}

function keyFor(provider: Provider): string {
    const key = process.env[KEY_ENV_VAR[provider]]?.trim()
    // The repo's build-time placeholder must not read as a usable key.
    if (!key || key === "dummy_key_for_build") throw new ProviderKeyMissing(provider)
    return key
}

export function hasKey(provider: Provider): boolean {
    try {
        keyFor(provider)
        return true
    } catch {
        return false
    }
}

export type CompleteOptions<T> = {
    agent: AgentName
    system: string
    user: string
    /** Image URLs the agent should look at, e.g. the writer's reference images. */
    imageUrls?: string[]
    schema: z.ZodType<T>
    /** Schema name sent to the vendor; lowercase snake_case. */
    schemaName: string
    maxTokens?: number
    /** Pass an already-loaded settings map to avoid re-reading per agent. */
    settings?: Record<string, string>
}

export type CompleteResult<T> = {
    data: T
    provider: Provider
    model: string
    inputTokens: number
    outputTokens: number
    costCents: number
    ms: number
}

/**
 * Ask one agent for one structured answer.
 *
 * Throws `ProviderKeyMissing` when the vendor has no key, `ProviderBadOutput`
 * when the answer does not satisfy the schema, and whatever the vendor SDK
 * throws for transport failures — the engine records all three on the job.
 */
export async function complete<T>(opts: CompleteOptions<T>): Promise<CompleteResult<T>> {
    const settings = opts.settings ?? (await loadContentSettings())
    const resolved = resolveAgentFrom(opts.agent, settings)
    const started = Date.now()

    const raw =
        resolved.provider === "anthropic"
            ? await callAnthropic(resolved, opts)
            : await callOpenAICompatible(resolved, opts)

    const parsed = opts.schema.safeParse(raw.value)
    if (!parsed.success) {
        throw new ProviderBadOutput(opts.agent, resolved.model, parsed.error.message)
    }

    return {
        data: parsed.data,
        provider: resolved.provider,
        model: resolved.model,
        inputTokens: raw.inputTokens,
        outputTokens: raw.outputTokens,
        costCents: costCents(resolved.model, raw.inputTokens, raw.outputTokens),
        ms: Date.now() - started,
    }
}

type RawAnswer = { value: unknown; inputTokens: number; outputTokens: number }

// ─── OpenAI, and Gemini through its OpenAI-compatible endpoint ───────────────

async function callOpenAICompatible<T>(
    resolved: ResolvedAgent,
    opts: CompleteOptions<T>,
): Promise<RawAnswer> {
    const client = new OpenAI({
        apiKey: keyFor(resolved.provider),
        ...(resolved.provider === "google" ? { baseURL: GEMINI_BASE_URL } : {}),
    })

    const content: OpenAI.Chat.ChatCompletionContentPart[] = [{ type: "text", text: opts.user }]
    for (const url of opts.imageUrls ?? []) {
        content.push({ type: "image_url", image_url: { url, detail: "low" } })
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: opts.system },
        { role: "user", content },
    ]

    try {
        const response = await client.chat.completions.parse({
            model: resolved.model,
            max_completion_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
            messages,
            response_format: zodResponseFormat(opts.schema, opts.schemaName),
        })
        return {
            value: response.choices[0]?.message.parsed,
            inputTokens: response.usage?.prompt_tokens ?? 0,
            outputTokens: response.usage?.completion_tokens ?? 0,
        }
    } catch (error) {
        // Gemini's compatibility layer does not implement every corner of
        // `json_schema`. Fall back to plain JSON mode with the shape described
        // in the prompt; the Zod parse in `complete` still guards the result.
        if (resolved.provider !== "google" || !looksLikeSchemaRejection(error)) throw error

        const response = await client.chat.completions.create({
            model: resolved.model,
            max_completion_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
            messages: [
                { role: "system", content: `${opts.system}\n\nReply with JSON only, matching this shape:\n${describeSchema(opts.schema, opts.schemaName)}` },
                { role: "user", content },
            ],
            response_format: { type: "json_object" },
        })
        const text = response.choices[0]?.message.content ?? ""
        return {
            value: parseJsonOrThrow(text, opts.agent, resolved.model),
            inputTokens: response.usage?.prompt_tokens ?? 0,
            outputTokens: response.usage?.completion_tokens ?? 0,
        }
    }
}

function looksLikeSchemaRejection(error: unknown): boolean {
    if (!(error instanceof OpenAI.APIError)) return false
    if (error.status !== 400) return false
    return /json_schema|response_format|schema/i.test(error.message)
}

function describeSchema<T>(schema: z.ZodType<T>, name: string): string {
    // zodResponseFormat already produces the JSON Schema; reuse it as prose so
    // the two paths cannot describe different shapes.
    const format = zodResponseFormat(schema, name)
    return JSON.stringify(format.json_schema.schema, null, 2)
}

function parseJsonOrThrow(text: string, agent: AgentName, model: string): unknown {
    try {
        return JSON.parse(text)
    } catch {
        throw new ProviderBadOutput(agent, model, "response was not valid JSON")
    }
}

// ─── Anthropic ───────────────────────────────────────────────────────────────

async function callAnthropic<T>(
    resolved: ResolvedAgent,
    opts: CompleteOptions<T>,
): Promise<RawAnswer> {
    const client = new Anthropic({ apiKey: keyFor(resolved.provider) })

    const content: Anthropic.ContentBlockParam[] = [{ type: "text", text: opts.user }]
    for (const url of opts.imageUrls ?? []) {
        content.push({ type: "image", source: { type: "url", url } })
    }

    const response = await client.messages.parse({
        model: resolved.model,
        max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
        system: opts.system,
        messages: [{ role: "user", content }],
        output_config: { format: zodOutputFormat(opts.schema) },
    })

    if (response.stop_reason === "refusal") {
        throw new ProviderBadOutput(
            opts.agent,
            resolved.model,
            `the model declined the request (${response.stop_details?.category ?? "no category"})`,
        )
    }

    return {
        value: response.parsed_output,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
    }
}
