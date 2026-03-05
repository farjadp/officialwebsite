// src/app/api/admin/publish-logs/route.ts
// Returns social publish logs for the report panel
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const logs = await prisma.socialPublishLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return NextResponse.json(logs);
    } catch (error) {
        console.error("[Publish Logs API Error]", error);
        return NextResponse.json([], { status: 500 });
    }
}
