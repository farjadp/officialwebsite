// src/app/api/admin/posts/route.ts
// Returns published posts for admin UI dropdowns (slug + title)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withApiLogging } from "@/lib/api-logger";

async function getHandler(req: NextRequest) {
    const status = req.nextUrl.searchParams.get("status") || "PUBLISHED";

    try {
        const posts = await prisma.post.findMany({
            where: { status: status as "PUBLISHED" | "DRAFT" | "SCHEDULED" },
            orderBy: { createdAt: "desc" },
            select: { slug: true, title: true },
            take: 100,
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("[Admin Posts API Error]", error);
        return NextResponse.json([], { status: 500 });
    }
}

export const GET = withApiLogging("GET", getHandler as any);
