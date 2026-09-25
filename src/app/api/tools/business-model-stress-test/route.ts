// Business Model Stress Test — runs the AI-assisted heat map (steps 3, 4, 6 of the method).
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiLogging } from "@/lib/api-logger";
import { runStressTest, stressTestRequestSchema } from "@/lib/business-model-stress-test";
import {
    BmLocale,
    MAX_STRESS_FACTORS,
    MIN_STRESS_FACTORS,
} from "@/data/business-model-stress-test/config";
import { getBusinessModelContent } from "@/data/business-model-stress-test/logic";

export const runtime = "nodejs";
export const maxDuration = 120;

// Each run costs two model calls, so a single caller cannot loop on it unattended.
// In-memory only: on Cloud Run this limits per instance, which is enough to blunt abuse.
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const recentRuns = new Map<string, number[]>();

function getClientIP(req: NextRequest) {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
    const now = Date.now();
    const runs = (recentRuns.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
    if (runs.length >= RATE_LIMIT) {
        recentRuns.set(ip, runs);
        return true;
    }
    runs.push(now);
    recentRuns.set(ip, runs);
    return false;
}

async function postHandler(req: NextRequest) {
    // Read the locale before validation so even the rejection speaks the visitor's language.
    let locale: BmLocale = "en";
    try {
        const raw = await req.json();
        if (raw && typeof raw === "object" && (raw as { locale?: string }).locale === "fa")
            locale = "fa";
        const strings = getBusinessModelContent(locale).logic;

        if (isRateLimited(getClientIP(req)))
            return NextResponse.json({ error: strings.errorRateLimited }, { status: 429 });

        const body = stressTestRequestSchema.parse(raw);
        const report = await runStressTest(body);
        return NextResponse.json(report);
    } catch (error) {
        const strings = getBusinessModelContent(locale).logic;
        if (error instanceof z.ZodError)
            return NextResponse.json(
                { error: strings.errorIncomplete(MIN_STRESS_FACTORS, MAX_STRESS_FACTORS) },
                { status: 400 }
            );
        console.error("[BM Stress Test Error]", error);
        const message = error instanceof Error ? error.message : strings.errorGeneric;
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export const POST = withApiLogging("POST", postHandler);
