// src/app/api/admin/posts/[id]/publish-social/route.ts
// Trigger social publish for a specific post with platform selection

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    generateWaterfall,
    publishToTelegram,
    publishToTwitter,
    publishToLinkedIn,
} from "@/lib/social-publisher";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await req.json();
        const platforms: { telegram: boolean; twitter: boolean; linkedin: boolean } = {
            telegram: body.platforms?.telegram ?? true,
            twitter: body.platforms?.twitter ?? true,
            linkedin: body.platforms?.linkedin ?? true,
        };

        // Fetch the post
        const post = await prisma.post.findUnique({
            where: { id },
            select: { id: true, slug: true, title: true, content: true, excerpt: true, status: true },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const siteUrl = process.env.NEXTAUTH_URL?.trim() || "https://farjadp.info";
        const postUrl = `${siteUrl}/blog/${post.slug}`;

        // Strip HTML for plain text
        const plainContent = (post.content || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const sourceText = `Title: ${post.title}\n\nExcerpt: ${post.excerpt || ""}\n\n${plainContent}`;

        // Generate waterfall content
        const waterfall = await generateWaterfall(sourceText);

        // Build log data
        const logData: Record<string, unknown> = {
            postId: post.id,
            postSlug: post.slug,
            postTitle: post.title,
            coreTruth: waterfall.analysis?.core_truth,
            sentiment: waterfall.analysis?.sentiment,
            linkedinText: waterfall.linkedin?.text,
            linkedinHook: waterfall.linkedin?.hook,
            telegramText: waterfall.telegram?.text,
            twitterText: waterfall.twitter?.thread?.join("\n\n---\n\n"),
            retargetingSegment: waterfall.sniper_retargeting?.analysis?.detected_segment,
            retargetingPainPoint: waterfall.sniper_retargeting?.analysis?.primary_pain_point,
            retargetingHeadline: waterfall.sniper_retargeting?.ad_creative?.headline,
            retargetingPrimaryText: waterfall.sniper_retargeting?.ad_creative?.primary_text,
            retargetingVisual: waterfall.sniper_retargeting?.ad_creative?.visual_directive,
            retargetingStoryHook: waterfall.sniper_retargeting?.story_creative?.text_overlay_1,
            retargetingStorySolution: waterfall.sniper_retargeting?.story_creative?.text_overlay_2,
            telegramStatus: platforms.telegram ? "PENDING" : "SKIPPED",
            twitterStatus: platforms.twitter ? "PENDING" : "SKIPPED",
            linkedinStatus: platforms.linkedin ? "PENDING" : "SKIPPED",
        };

        // Publish to selected platforms
        const publishTasks: Promise<{ ok: boolean; error?: string }>[] = [
            platforms.telegram
                ? publishToTelegram(waterfall.telegram?.text || "", postUrl)
                : Promise.resolve({ ok: true }),
            platforms.twitter
                ? publishToTwitter(waterfall.twitter?.thread || [], postUrl)
                : Promise.resolve({ ok: true }),
            platforms.linkedin
                ? publishToLinkedIn(waterfall.linkedin?.text || "", postUrl)
                : Promise.resolve({ ok: true }),
        ];

        const [tgResult, twResult, liResult] = await Promise.allSettled(publishTasks);

        if (platforms.telegram) {
            const r = tgResult.status === "fulfilled" ? tgResult.value : { ok: false, error: "Rejected" };
            logData.telegramStatus = r.ok ? "SUCCESS" : "FAILED";
            logData.telegramError = r.error;
        }
        if (platforms.twitter) {
            const r = twResult.status === "fulfilled" ? twResult.value : { ok: false, error: "Rejected" };
            logData.twitterStatus = r.ok ? "SUCCESS" : "FAILED";
            logData.twitterError = r.error;
        }
        if (platforms.linkedin) {
            const r = liResult.status === "fulfilled" ? liResult.value : { ok: false, error: "Rejected" };
            logData.linkedinStatus = r.ok ? "SUCCESS" : "FAILED";
            logData.linkedinError = r.error;
        }

        // Write log
        await prisma.socialPublishLog.create({ data: logData as Parameters<typeof prisma.socialPublishLog.create>[0]["data"] });

        return NextResponse.json({
            success: true,
            telegram: logData.telegramStatus,
            twitter: logData.twitterStatus,
            linkedin: logData.linkedinStatus,
        });
    } catch (error) {
        console.error("[Publish Social API Error]", error);
        const message = error instanceof Error ? error.message : "Publish failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
