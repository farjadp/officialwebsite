import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, score, answers } = body;

        if (!email || score === undefined || !answers) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let segment = "";
        if (score <= 40) {
            segment = "The Operator";
        } else if (score <= 75) {
            segment = "The Scaler";
        } else {
            segment = "The Optimizer";
        }

        // Upsert the lead by email
        const lead = await prisma.lead.upsert({
            where: { email },
            update: {
                score,
                segment,
                answers,
            },
            create: {
                email,
                score,
                segment,
                answers,
            },
        });

        return NextResponse.json({ success: true, lead });
    } catch (error: any) {
        console.error("[Leads API Error]", error);
        return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }
}
