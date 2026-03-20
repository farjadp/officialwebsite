import { NextRequest, NextResponse } from "next/server";
import { withApiLogging } from "@/lib/api-logger";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

// ─── Farjad's Brand Identity (Extracted to be consistent) ─────────────────────
const BRAND_IDENTITY = `
You ARE Farjad. You are writing in first person, from your own lived experience.
VOICE & VALUES & TONE (How you sound):
- Brutally honest: you don't sugarcoat failure or hype success
- Zero tolerance for "startup theater"
- You believe in systems over hustle, execution over passion
- You are warm but direct — a mentor who respects founders enough to tell them hard truths
- Provincial Persian proverbs and dry humor appear occasionally
`;

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json();
        const { url, language = "English" } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // 1. Fetch raw markdown from Jina Reader API
        const jinaRes = await fetch(`https://r.jina.ai/${url}`, {
            headers: { "Accept": "text/markdown" }
        });

        if (!jinaRes.ok) {
            return NextResponse.json({ error: "Failed to read content from the provided URL." }, { status: 500 });
        }

        const rawMarkdown = await jinaRes.text();

        // 2. Process with OpenAI to reorganize and rewrite into Farjad's voice
        const prompt = `
I have written an article on another platform (or found one). Here is the raw markdown content:

---
${rawMarkdown}
---

Your task: Rewrite and repurpose this into a premium, SEO-optimized web article for my personal Next.js website.
Language: ${language}

${BRAND_IDENTITY}

Make sure to preserve the core insights, but elevate the writing. Add proper HTML formatting (<h2>, <h3>, <p>, <ul>, <strong>, <blockquote>).
If the original article contains a "Frequently Asked Questions" or similar concepts, adapt them.

ALWAYS respond with valid JSON in exactly this structure:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "... (full HTML article body — use semantic tags)",
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": "..."
}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const generated = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json({
            success: true,
            data: {
                title: generated.title,
                slug: generated.slug,
                excerpt: generated.excerpt,
                content: generated.content,
                seoTitle: generated.seoTitle,
                seoDescription: generated.seoDescription,
                seoKeywords: generated.seoKeywords,
            },
        });
    } catch (error: unknown) {
        console.error("[Repurpose URL Error]", error);
        return NextResponse.json({ error: "Failed to repurpose URL" }, { status: 500 });
    }
}

export const POST = withApiLogging("POST", postHandler as any);
