import { NextRequest, NextResponse } from "next/server";
import { withApiLogging } from "@/lib/api-logger";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { fal } from "@fal-ai/client";
import { downloadAndWatermark } from "@/lib/image-watermark";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

// ─── Image Style System (Copied for consistency) ────────────────────────────
function getImageStyleSuffix(topic: string): string {
    const t = topic.toLowerCase();
    if (t.includes("ai") || t.includes("automation") || t.includes("system") || t.includes("process")) {
        return `Editorial photography with architectural composition, clean lines, premium minimalism, cinematic shadows. Avoid illustrations, no text, no watermarks, professional Western business attire.`;
    }
    return `Editorial photography, realistic human scenes, cinematic natural lighting, premium magazine aesthetic, emotionally grounded. Avoid stock-photo clichés, no text, no watermarks, professional Western business attire.`;
}

async function generateAndWatermarkImage( prompt: string, filename: string, topic: string ): Promise<string | null> {
    try {
        const result = await fal.subscribe("fal-ai/flux/schnell", {
            input: {
                prompt: `${prompt}. ${getImageStyleSuffix(topic)}`,
                image_size: "landscape_16_9",
                num_inference_steps: 4,
            },
        });
        const data = result.data as { images?: { url: string }[] };
        const url = data?.images?.[0]?.url;
        if (!url) return null;
        return await downloadAndWatermark(url, filename);
    } catch (err) {
        console.error(`[Image gen failed: ${filename}]`, err);
        return null;
    }
}

// ─── Farjad's Brand Identity ────────────────────────────────────────────────
const BRAND_IDENTITY = `
You ARE Farjad. You are writing in first person, from your own lived experience.
VOICE & VALUES & TONE (How you sound):
- Brutally honest: you don't sugarcoat failure or hype success
- Zero tolerance for "startup theater"
- You believe in systems over hustle, execution over passion
- You are warm but direct — a mentor who respects founders enough to tell them hard truths
- Provincial Persian proverbs and dry humor appear occasionally
`;

const IMAGE_RULES = `
IMAGE PROMPT RULES:
- Write image prompts as instructions for a top editorial photographer, not an illustrator.
- All images must look like real editorial photography, not digital art, CGI, illustration, UI mockups, or futuristic concept art.
- Avoid cliché startup visuals such as handshakes, fake teamwork, cheering groups, rocket imagery, light bulbs.
- No text, letters, signage focus, or readable words inside the image.
- Keep wardrobe and styling globally professional, contemporary, and culturally neutral, with no overly ceremonial or region-specific visual signals unless the article explicitly requires them.
`;

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json();
        const { url, language = "English", generateImage = true } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const jinaRes = await fetch(`https://r.jina.ai/${url}`, { headers: { "Accept": "text/markdown" } });
        if (!jinaRes.ok) {
            return NextResponse.json({ error: "Failed to read content from the provided URL." }, { status: 500 });
        }
        const rawMarkdown = await jinaRes.text();

        const ts = Date.now();
        const prompt = `
I have written an article on another platform (or found one). Here is the raw markdown content:

---
${rawMarkdown}
---

Your task: Rewrite and repurpose this into a premium, SEO-optimized web article for my personal Next.js website.
Language: ${language}

${BRAND_IDENTITY}
${generateImage ? IMAGE_RULES : ""}

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
  "seoKeywords": "..."${generateImage ? ',\n  "coverImagePrompt": "Detailed visual prompt for a professional editorial cover image (1792x1024 landscape)"' : ''}
}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const generated = JSON.parse(completion.choices[0].message.content || "{}");

        let coverImageUrl = null;
        if (generateImage && generated.coverImagePrompt) {
            coverImageUrl = await generateAndWatermarkImage(generated.coverImagePrompt, `cover-${ts}.jpg`, generated.title || "article");
        }

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
                coverImageUrl,
            },
        });
    } catch (error: unknown) {
        console.error("[Repurpose URL Error]", error);
        return NextResponse.json({ error: "Failed to repurpose URL" }, { status: 500 });
    }
}

export const POST = withApiLogging("POST", postHandler as any);
