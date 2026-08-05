// Business Model Stress Test — runs the AI-assisted heat map (steps 3, 4, 6 of the method).
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiLogging } from "@/lib/api-logger";
import { runStressTest, stressTestRequestSchema } from "@/lib/business-model-stress-test";

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
    try {
        if (isRateLimited(getClientIP(req)))
            return NextResponse.json(
                { error: "You have run several stress tests recently. Please try again later." },
                { status: 429 }
            );

        const body = stressTestRequestSchema.parse(await req.json());
        const report = await runStressTest(body);
        return NextResponse.json(report);
    } catch (error) {
        if (error instanceof z.ZodError)
            return NextResponse.json(
                { error: "Complete your business model and select 3-5 stress factors." },
                { status: 400 }
            );
        console.error("[BM Stress Test Error]", error);
        const message =
            error instanceof Error ? error.message : "The stress test could not be completed.";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

export const POST = withApiLogging("POST", postHandler);
