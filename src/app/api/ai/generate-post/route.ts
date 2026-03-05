// src/app/api/ai/generate-post/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            topic,
            tone = "Professional and insightful",
            targetAudience = "Startup founders and tech entrepreneurs",
            keywords = "",
            length = "medium",
            generateImage = true,
            language = "English",
        } = body;

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const wordCount = length === "short" ? "600-900" : length === "long" ? "1800-2500" : "1000-1500";

        // ─── Step 1: Generate the article text ────────────────────────────────
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `You are Farjad, a senior startup advisor, product strategist, and tech entrepreneur with 17+ years of experience. 
You write essays and articles that are honest, insightful, and sometimes provocative.
Your writing style: ${tone}.
Your target audience: ${targetAudience}.
You write in ${language}.

ALWAYS respond with valid JSON in exactly this structure:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "... (full HTML article body)",
  "seoTitle": "...",
  "seoDescription": "...",  
  "seoKeywords": "...",
  "imagePrompt": "..."
}

Rules:
- title: compelling, honest, no clickbait
- slug: lowercase, hyphenated, SEO-friendly
- excerpt: 2-3 sentences, hook the reader
- content: full HTML with <h2>, <p>, <ul>, <strong> tags. ${wordCount} words. No <html>, <body>, or <head> tags.
- imagePrompt: a DALL-E image prompt for a professional cover image matching the article topic. Should be modern, editorial style, no text in image.`,
                },
                {
                    role: "user",
                    content: `Write a compelling article about: "${topic}"\n${keywords ? `Focus keywords: ${keywords}` : ""}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const generated = JSON.parse(completion.choices[0].message.content || "{}");

        // ─── Step 2: Generate cover image with DALL-E 3 ───────────────────────
        let coverImageUrl: string | null = null;
        if (generateImage && generated.imagePrompt) {
            try {
                const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: `${generated.imagePrompt}. Editorial style, clean minimalist composition, professional photography aesthetic. No text, no watermarks.`,
                    n: 1,
                    size: "1792x1024",
                    quality: "standard",
                });
                coverImageUrl = imageResponse.data?.[0]?.url || null;
            } catch (imgError) {
                console.error("Image generation failed:", imgError);
                // Non-fatal — just return text content without image
            }
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
                imagePrompt: generated.imagePrompt,
            },
        });
    } catch (error: unknown) {
        console.error("[AI Generate Post Error]", error);
        const message = error instanceof Error ? error.message : "Generation failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
