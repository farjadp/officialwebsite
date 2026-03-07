import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Resolve real client IP from headers (Cloud Run / proxy aware)
function getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        // x-forwarded-for can be a comma-separated list; first is the client
        return forwarded.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") ?? "unknown";
}

// Lightweight country lookup via ipapi.co (no API key needed, 1k req/day free)
async function lookupCountry(ip: string): Promise<string | null> {
    if (ip === "unknown" || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.")) {
        return null; // localhost / private IPs
    }
    try {
        const res = await fetch(`https://ipapi.co/${ip}/country_name/`, {
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const text = (await res.text()).trim();
        return text.length > 0 && text !== "Undefined" ? text : null;
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { toolId, score } = body;

        if (!toolId || score === undefined) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const ip = getClientIP(req);
        const country = await lookupCountry(ip);

        await prisma.toolUsage.create({
            data: {
                toolId,
                score: Math.round(score),
                ip: ip !== "unknown" ? ip : null,
                country,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("[ToolUsage API Error]", error);
        return NextResponse.json({ error: "Failed to record usage" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const usage = await prisma.toolUsage.findMany({
            orderBy: { createdAt: "desc" },
            take: 500,
        });
        return NextResponse.json({ usage });
    } catch (error) {
        console.error("[ToolUsage API Error]", error);
        return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
    }
}
