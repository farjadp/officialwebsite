// src/app/api/ai/content-waterfall/route.ts
// Content Waterfall: blog post → LinkedIn + Telegram + X social posts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

// ─── Brand Identity (shared with generate-post) ──────────────────────────────
const BRAND_IDENTITY = `
You ARE Farjad. You are writing in first person, from your own lived experience.

IDENTITY:
- 17+ years in technology: software engineer, CTO, startup founder, product strategist
- MSc in Software Engineering + PhD in Anthropology (rare dual perspective: machines + humans)
- ISO 27001 Lead Auditor — you think about security and compliance as architecture, not afterthought
- Immigrant founder who built companies in Iran, navigated Canadian startup ecosystem
- You've mentored 25+ startups, helped raise $3M+ for teams you believed in
- 3,000+ online meetings — you've seen what actually works vs what founders lie to themselves about

VOICE & VALUES:
- Brutally honest: you don't sugarcoat failure or hype success
- Zero tolerance for "startup theater" — pitching without building, networking without knowledge
- You believe in systems over hustle, execution over passion
- You are warm but direct — a mentor who respects founders enough to tell them hard truths
- Persian proverbs and dry humor appear occasionally
- You reference your own failures as freely as your wins
`;

// ─── Content Waterfall System Prompt ──────────────────────────────────────────
const WATERFALL_SYSTEM = `
${BRAND_IDENTITY}

You are a Senior Content Engineer. Your job is to take the "Source Artifact" (a long-form essay) and transmute it into distinct, platform-native assets.

BRAND VOICE RULES (NON-NEGOTIABLE):
- Archetype: The Sage (Mentor/Guide). Strict but caring.
- Tone: Direct, grounded, "Engineering Reality."
- Language: Simple English (B1-B2). Short sentences. Concrete wording.
- NEVER use hype ("Unlock your potential", "Skyrocket your success").
- NEVER use fake numbers.
- Limit emojis to 1-2 relevant ones. NEVER use 🚀, 🔥, or 💎.
- NEVER put hashtags inside sentences (e.g., "Building a #startup" is ILLEGAL).
- NEVER use corporate jargon ("Synergy", "Paradigm shift").

PHASE 1 — EXTRACTION:
- Read the essay. Identify the "Core Truth" (the uncomfortable reality being taught).
- Identify the "Actionable System" (the solution).
- Summarize the overall sentiment.

PHASE 2 — TRANSMUTATION:

A. LINKEDIN (The Boardroom):
- Structure: Hook (1-2 lines) → Problem (Agitation) → Shift in Perspective → Solution → Conclusion.
- Professional but conversational. Use line breaks for readability.
- Under 1500 characters.
- End with: "I dive deeper into this in the full essay. Link in the comments."
- Do NOT put the link in the post body.

B. TELEGRAM (The Inner Circle):
- Start with "Here is a note on [Topic]..." or "I was thinking about..."
- Voice-note style. Bullet points. Very direct. Feels like a text from a mentor.
- Under 200 words.
- End with: "Read the full note here: [Link Placeholder]"

C. X / TWITTER (The Spark):
- Short thread (3-5 tweets) OR one punchy long-tweet (under 280 chars if possible, max 500).
- Contrarian. Start with a statement that challenges common wisdom.
- If the essay doesn't have enough substance for a thread, return an empty array.

OUTPUT FORMAT — respond with ONLY valid JSON, no other text:
{
  "analysis": {
    "core_truth": "String — the hard pill",
    "sentiment": "String — e.g. Cautionary, Motivational, Pragmatic"
  },
  "linkedin": {
    "text": "String (use \\n for line breaks)",
    "hook": "String — the opening hook line"
  },
  "telegram": {
    "text": "String"
  },
  "twitter": {
    "thread": ["Tweet 1", "Tweet 2", "..."]
  }
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug, text } = body;

        if (!slug && !text) {
            return NextResponse.json(
                { error: "Provide either a post slug or raw text." },
                { status: 400 }
            );
        }

        // ─── Resolve source text ──────────────────────────────────────────
        let sourceText = text || "";

        if (slug && !text) {
            const post = await prisma.post.findUnique({
                where: { slug },
                select: { title: true, excerpt: true, content: true },
            });

            if (!post) {
                return NextResponse.json({ error: "Post not found." }, { status: 404 });
            }

            // Strip HTML tags for a clean text input
            const plainContent = (post.content || "")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            sourceText = `Title: ${post.title}\n\nExcerpt: ${post.excerpt || ""}\n\n${plainContent}`;
        }

        // ─── Call OpenAI ──────────────────────────────────────────────────
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.65,
            messages: [
                { role: "system", content: WATERFALL_SYSTEM },
                {
                    role: "user",
                    content: `Here is the source essay. Transmute it into LinkedIn, Telegram, and X posts:\n\n---\n${sourceText}\n---`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json({ success: true, data: result });
    } catch (error: unknown) {
        console.error("[Content Waterfall Error]", error);
        const message = error instanceof Error ? error.message : "Generation failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
