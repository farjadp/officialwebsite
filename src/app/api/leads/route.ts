import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiLogging } from "@/lib/api-logger";

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, name, toolId = "unknown", score, answers } = body;

        if (!email || score === undefined || !answers) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let segment = "";
        if (score <= 39) {
            segment = "Needs Foundation Work";
        } else if (score <= 59) {
            segment = "Needs Major Redesign";
        } else if (score <= 74) {
            segment = "Promising — Incomplete";
        } else if (score <= 89) {
            segment = "Strong — Minor Gaps";
        } else {
            segment = "Highly Strong";
        }

        const lead = await prisma.lead.upsert({
            where: { email_toolId: { email, toolId } },
            update: { name, score, segment, answers },
            create: { email, name, toolId, score, segment, answers },
        });

        return NextResponse.json({ success: true, lead });
    } catch (error: unknown) {
        console.error("[Leads API Error]", error);
        return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }
}

async function getHandler() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ leads });
    } catch (error: unknown) {
        console.error("[Leads API Error]", error);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}

export const POST = withApiLogging("POST", postHandler as any);
export const GET = withApiLogging("GET", getHandler as any);
