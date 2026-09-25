import { withRateLimit, RATE_RULES } from "@/lib/rate-limit"
import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeWebsite, gradeKeyFor } from "@/lib/ai-website-readiness";
import { getScannerStrings } from "@/data/ai-website-readiness/scanner-strings";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 45;

// `locale` is optional and defaults to English, so the existing English
// request shape is untouched. It only selects which language the scanner
// writes its findings in; the checks, weights and scoring are identical.
const requestSchema = z.object({
  url: z.string().trim().min(3).max(2048),
  locale: z.enum(["en", "fa"]).optional().default("en"),
});

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

async function rateLimitedPOSTHandler(request: Request) {
  const startedAt = Date.now();
  let requestedUrl = "unknown";
  let locale: "en" | "fa" = "en";
  try {
    const raw = await request.json();
    // Read the locale before validation so a rejected URL is still explained
    // in the visitor's own language.
    if (raw && typeof raw === "object" && (raw as { locale?: unknown }).locale === "fa")
      locale = "fa";
    const body = requestSchema.parse(raw);
    requestedUrl = body.url;
    const report = await analyzeWebsite(body.url, body.locale);
    const scores = Object.fromEntries(
      report.categories.map((category) => [category.id, category.score])
    );
    await saveAuditLog({
      requestedUrl: body.url,
      finalUrl: report.finalUrl,
      hostname: new URL(report.finalUrl).hostname,
      status: "SUCCESS",
      overallScore: report.overallScore,
      // Logged in English regardless of the report language, so the audit
      // history stays comparable across locales.
      grade: getScannerStrings("en").grades[gradeKeyFor(report.overallScore)],
      accessScore: scores.access,
      metadataScore: scores.metadata,
      agentScore: scores["agent-readiness"],
      citabilityScore: scores["content-citability"],
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.json(report);
  } catch (error) {
    const strings = getScannerStrings(locale);
    const message =
      error instanceof z.ZodError
        ? strings.errors.invalidUrl
        : error instanceof Error
          ? error.message
          : strings.errors.scanFailed;
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

export const POST = withRateLimit("website-audit", RATE_RULES.websiteAudit, rateLimitedPOSTHandler as any)
