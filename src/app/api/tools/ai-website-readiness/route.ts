import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeWebsite } from "@/lib/ai-website-readiness";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 45;

const requestSchema = z.object({ url: z.string().trim().min(3).max(2048) });

function getHostname(value: string) {
  try {
    return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).hostname;
  } catch {
    return "invalid-url";
  }
}

async function saveAuditLog(data: Parameters<typeof prisma.websiteAuditLog.create>[0]["data"]) {
  try {
    await prisma.websiteAuditLog.create({ data });
  } catch (error) {
    console.error("[Website Audit Log Error]", error);
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let requestedUrl = "unknown";
  try {
    const body = requestSchema.parse(await request.json());
    requestedUrl = body.url;
    const report = await analyzeWebsite(body.url);
    const scores = Object.fromEntries(
      report.categories.map((category) => [category.id, category.score])
    );
    await saveAuditLog({
      requestedUrl: body.url,
      finalUrl: report.finalUrl,
      hostname: new URL(report.finalUrl).hostname,
      status: "SUCCESS",
      overallScore: report.overallScore,
      grade: report.grade,
      accessScore: scores.access,
      metadataScore: scores.metadata,
      agentScore: scores["agent-readiness"],
      citabilityScore: scores["content-citability"],
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json(report);
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? "Enter a valid website URL."
        : error instanceof Error
          ? error.message
          : "The scan could not be completed.";
    await saveAuditLog({
      requestedUrl,
      hostname: getHostname(requestedUrl),
      status: "FAILED",
      durationMs: Date.now() - startedAt,
      error: message,
    });
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
