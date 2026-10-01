// ============================================================================
// Hardware Source: agents.ts
// Version: 1.0.0 — 2026-09-25
// Why: Every step of the content engine is one named agent, and which model
//      runs it is Farjad's choice from /admin/content, not a constant in code.
//      This file is the whole vocabulary: the names, the defaults, and the one
//      rule that cannot be edited away — a reviewer never runs on the same
//      vendor as the writer it is reviewing, because a model does not catch
//      the failure modes of its own family.
// Env / Identity: Pure. No database, no network — the caller supplies settings.
// ============================================================================

export const PROVIDERS = ["openai", "google", "anthropic"] as const
export type Provider = (typeof PROVIDERS)[number]

export const AGENT_NAMES = [
    "brief",
    "writer.en",
    "writer.fa",
    "seo",
    "review.en",
    "review.fa",
    "art.prompt",
    // Not a content agent: the job search (src/lib/jobs) scores postings
    // through the same provider layer, so its model is chosen here too.
    "jobs.score",
    "jobs.resume",
] as const
export type AgentName = (typeof AGENT_NAMES)[number]

export type ResolvedAgent = { provider: Provider; model: string }

/**
 * The environment variable each provider's key is read from. Keys live in the
 * environment, never in the database: the admin selects a provider, it does not
 * store a secret.
 */
export const KEY_ENV_VAR: Record<Provider, string> = {
    openai: "OPENAI_API_KEY",
    google: "GEMINI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
}

/**
 * Model used when a provider is chosen without naming a model.
 *
 * `gpt-4o` is what the rest of this repo already calls with the live key
 * (`generate-post`, `content-waterfall`, `ai-tools`), so it is the one OpenAI
 * id proven to work here. `claude-opus-5` is Anthropic's current default.
 * The Gemini id is the least certain of the three — `scripts/content-provider-check.ts`
 * is what confirms it, and the admin can change any of them without a deploy.
 */
export const DEFAULT_MODEL_FOR_PROVIDER: Record<Provider, string> = {
    openai: "gpt-4o",
    google: "gemini-2.5-pro",
    anthropic: "claude-opus-5",
}

/**
 * Per-agent defaults. The two reviewers deliberately sit on the opposite vendor
 * from the writer they audit.
 */
export const DEFAULT_AGENTS: Record<AgentName, ResolvedAgent> = {
    brief: { provider: "openai", model: DEFAULT_MODEL_FOR_PROVIDER.openai },
    "writer.en": { provider: "openai", model: DEFAULT_MODEL_FOR_PROVIDER.openai },
    "writer.fa": { provider: "anthropic", model: DEFAULT_MODEL_FOR_PROVIDER.anthropic },
    seo: { provider: "openai", model: DEFAULT_MODEL_FOR_PROVIDER.openai },
    "review.en": { provider: "anthropic", model: DEFAULT_MODEL_FOR_PROVIDER.anthropic },
    "review.fa": { provider: "openai", model: DEFAULT_MODEL_FOR_PROVIDER.openai },
    "art.prompt": { provider: "openai", model: DEFAULT_MODEL_FOR_PROVIDER.openai },
    // On OpenAI because that is the key production has; gpt-4o is the id
    // already proven against it. Changeable from settings without a deploy.
    "jobs.score": { provider: "openai", model: DEFAULT_MODEL_FOR_PROVIDER.openai },
    "jobs.resume": { provider: "openai", model: DEFAULT_MODEL_FOR_PROVIDER.openai },
}

/** Which writer each reviewer must not share a vendor with. */
const REVIEWS: Partial<Record<AgentName, AgentName>> = {
    "review.en": "writer.en",
    "review.fa": "writer.fa",
}

export function settingKey(agent: AgentName, field: "provider" | "model"): string {
    return `content.agent.${agent}.${field}`
}

function isProvider(value: string): value is Provider {
    return (PROVIDERS as readonly string[]).includes(value)
}

function readOne(agent: AgentName, settings: Record<string, string>): ResolvedAgent {
    const fallback = DEFAULT_AGENTS[agent]
    const storedProvider = settings[settingKey(agent, "provider")]?.trim()
    const storedModel = settings[settingKey(agent, "model")]?.trim()

    let provider = fallback.provider
    if (storedProvider) {
        if (!isProvider(storedProvider)) {
            throw new Error(
                `Unknown provider "${storedProvider}" for agent "${agent}". Expected one of: ${PROVIDERS.join(", ")}`,
            )
        }
        provider = storedProvider
    }

    // A stored provider without a stored model means "this vendor, its default
    // model" — carrying the other vendor's model id across would 404.
    const model = storedModel
        ? storedModel
        : provider === fallback.provider
          ? fallback.model
          : DEFAULT_MODEL_FOR_PROVIDER[provider]

    return { provider, model }
}

/**
 * Resolve one agent's provider and model from stored settings.
 *
 * Throws when the settings are self-defeating: an unknown provider, an unknown
 * agent, or a reviewer sharing a vendor with its writer.
 */
export function resolveAgentFrom(
    agent: AgentName,
    settings: Record<string, string>,
): ResolvedAgent {
    if (!(AGENT_NAMES as readonly string[]).includes(agent)) {
        throw new Error(`Unknown agent "${agent}"`)
    }

    const resolved = readOne(agent, settings)

    const writer = REVIEWS[agent]
    if (writer) {
        const writerResolved = readOne(writer, settings)
        if (writerResolved.provider === resolved.provider) {
            throw new Error(
                `Agent "${agent}" is set to the same provider as "${writer}" (${resolved.provider}). ` +
                    `A reviewer must run on a different vendor than the writer it reviews — ` +
                    `change one of them in /admin/content/settings.`,
            )
        }
    }

    return resolved
}
