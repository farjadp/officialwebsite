// ============================================================================
// File: src/lib/rate-limit.ts
// Role: Per-IP sliding-window rate limiting for public API routes.
// Why:  Every public endpoint — /api/leads, /api/logs, /api/tool-usage,
//       /api/lab-apply, /api/bug-report and the two tool runners — accepted
//       unlimited unauthenticated writes. Anyone with curl could fill the
//       database for free, and /api/tools/ai-website-readiness makes ~10
//       outbound HTTP requests per call, which makes it a request amplifier.
//
// LIMITATION, read before trusting this: the counters live in process memory.
//       On Vercel each serverless instance keeps its own, and they reset on a
//       cold start, so a distributed caller gets a higher effective limit than
//       the numbers below suggest. This blunts casual abuse and scripted loops;
//       it is not a defence against a determined attacker. The durable fix is a
//       shared store (Vercel KV or Upstash) — that is an infrastructure choice,
//       not a code one, so it is deliberately left open.
//       This generalises the limiter that already existed inline in
//       src/app/api/tools/business-model-stress-test/route.ts.
// ============================================================================

import { NextRequest, NextResponse } from "next/server"

export type RateLimitRule = {
    /** Requests allowed per window, per IP. */
    limit: number
    /** Window length in milliseconds. */
    windowMs: number
    /** Shown to the caller on 429. */
    message?: string
}

const buckets = new Map<string, number[]>()

/** Stop the map growing without bound on a long-lived instance. */
const MAX_TRACKED_KEYS = 10_000

export function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    return req.headers.get("x-real-ip") ?? "unknown"
}

/**
 * Record a hit and report whether the caller is over their limit.
 * `scope` keeps endpoints from sharing a budget.
 */
export function isRateLimited(scope: string, ip: string, rule: RateLimitRule): boolean {
    const key = `${scope}:${ip}`
    const now = Date.now()
    const hits = (buckets.get(key) || []).filter((time) => now - time < rule.windowMs)

    if (hits.length >= rule.limit) {
        buckets.set(key, hits)
        return true
    }

    hits.push(now)
    buckets.set(key, hits)

    if (buckets.size > MAX_TRACKED_KEYS) {
        for (const [k, times] of buckets) {
            if (!times.length || now - times[times.length - 1] > rule.windowMs) buckets.delete(k)
            if (buckets.size <= MAX_TRACKED_KEYS) break
        }
    }

    return false
}

type Handler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse>

/**
 * Wrap a public route handler so it refuses callers who are over the limit.
 * Compose inside withApiLogging so 429s are still logged:
 *   export const POST = withApiLogging("POST", withRateLimit("leads", RULE, postHandler))
 */
export function withRateLimit(scope: string, rule: RateLimitRule, handler: Handler): Handler {
    return async (req: NextRequest, ctx?: unknown) => {
        if (isRateLimited(scope, getClientIp(req), rule)) {
            return NextResponse.json(
                { error: rule.message ?? "Too many requests. Please try again later." },
                {
                    status: 429,
                    headers: { "retry-after": String(Math.ceil(rule.windowMs / 1000)) },
                }
            )
        }
        return handler(req, ctx)
    }
}

/**
 * Budgets, set by what each endpoint costs and how often a real person hits it.
 * A visitor finishing every tool on the site sends well under the lead limit.
 */
export const RATE_RULES = {
    /** One row per completed tool run. */
    leads: { limit: 20, windowMs: 60 * 60 * 1000, message: "Too many submissions. Please try again later." },
    toolUsage: { limit: 60, windowMs: 60 * 60 * 1000 },
    /** Client-side log shipping — chatty by design, so a higher ceiling. */
    logs: { limit: 120, windowMs: 60 * 60 * 1000 },
    /** Application forms: a person submits once. */
    labApply: { limit: 5, windowMs: 60 * 60 * 1000, message: "Too many applications from this address. Please try again later." },
    bugReport: { limit: 10, windowMs: 60 * 60 * 1000 },
    /** Makes ~10 outbound requests per call against a caller-supplied host. */
    websiteAudit: { limit: 8, windowMs: 60 * 60 * 1000, message: "You have run several audits recently. Please try again in a little while." },
    /** File uploads. */
    upload: { limit: 10, windowMs: 60 * 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>
