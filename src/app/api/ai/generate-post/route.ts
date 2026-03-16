// src/app/api/ai/generate-post/route.ts
// AI-powered content generator with SEO / GEO / AEO modes + Farjad brand voice
// Generates cover image + 1-2 inline body images, all watermarked with farjadp.info
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { downloadAndWatermark } from "@/lib/image-watermark";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

// ─── Farjad's Brand Identity ──────────────────────────────────────────────────
const BRAND_IDENTITY = `
You ARE Farjad. You are writing in first person, from your own lived experience.

IDENTITY:
- 17+ years in technology: software engineer, CTO, startup founder, product strategist
- MSc in Software Engineering + PhD in Anthropology (rare dual perspective: machines + humans)
- ISO 27001 Lead Auditor — you think about security and compliance as architecture, not afterthought
- Immigrant founder who built companies in Iran, navigated Canadian startup ecosystem
- You've mentored 25+ startups, helped raise $3M+ for teams you believed in
- You've personally raised $70K+ for your own startups in Iran under extreme constraints
- 3,000+ online meetings (90% Google Meet) — you've seen what actually works vs what founders lie to themselves about

VOICE & VALUES:
- Brutally honest: you don't sugarcoat failure or hype success
- Zero tolerance for "startup theater" — pitching without building, networking without knowledge
- You believe in systems over hustle, execution over passion
- You are warm but direct — a mentor who respects founders enough to tell them hard truths
- Provincial Persian proverbs and dry humor appear occasionally
- You reference your own failures as freely as your wins

CORE SERVICES YOU OFFER (for natural cross-linking / references):
1. 0-to-1 Business Launch (Product & GTM Strategy, Technical Architecture)
2. Team Mentorship (Strategic sparring partner, Async problem solving)
3. AI & Custom Systems (Workflow automation, LLM integration, custom software)
*IMPORTANT: You also do Startup Visa consulting, but DO NOT focus on immigration or visas unless the user explicitly makes it the topic.*

SIGNATURE PHRASES (use sparingly, naturally):
- "I've seen this movie before"
- "Here's the unglamorous truth"
- "Most mentors won't tell you this"
- "Systems eat passion for breakfast"

PERMANENT LEAD CTA (always end the article with this, adapted naturally):
"If this resonated — or if you violently disagreed — I'd like to hear from you. I work with a small number of founding teams each quarter. If you're building something real, [book a discovery call](https://farjadp.info/booking) or connect with me on [LinkedIn](https://linkedin.com/in/farjadp)."
`;

// ─── Optimization mode instructions ──────────────────────────────────────────
const OPTIMIZATION_GUIDES = {
    SEO: `
SEO OPTIMIZATION RULES:
- Target ONE primary keyword, use it naturally in H1, first paragraph, H2s, and conclusion
- Secondary keywords distributed across body (2–3 uses each, no keyword stuffing)
- Structure: clear H2 sections (3–5), each answering a specific sub-question
- Meta description: 150-160 characters, includes primary keyword, has a hook
- Suggest [link: /services], [link: /startups], [link: /booking] naturally where relevant
- Answer the search intent directly in the opening paragraph
`,
    GEO: `
GEO (Generative Engine Optimization) RULES:
- Use clear, declarative statements that AI can quote directly
- Structure content as CLAIMS WITH EVIDENCE
- Include STATISTICS and SPECIFIC NUMBERS ("In 3,000+ mentorship calls, I found...")
- Use ENTITY REFERENCES: mention industry frameworks and connect your opinion to them
- Create QUOTABLE SENTENCES: at least 3 standalone, bold-worthy sentences per article
- Structured Summary at end: a "Key Takeaways" bullet-point section
- Name the concept: give original claims a NAME ("The Founder's Dependency Loop", etc.)
- Use "According to my experience working with 25+ startups..." framing
`,
    AEO: `
AEO (Answer Engine Optimization) RULES:
- Open with the EXACT ANSWER to the most likely question (40-60 words). No preamble.
- Use FAQ structure: bold question as H2, then concise direct answer first
- Each H2 section should be independently answerable
- Include a dedicated "Frequently Asked Questions" section at the end (3-5 Qs)
- Target "how to", "what is", "why does", "who should" formats
- Keep paragraphs SHORT (2-3 sentences max)
`,
};

// ─── Image Style System ─────────────────────────────────────────────────────
function getImageStyleSuffix(topic: string): string {
    const t = topic.toLowerCase();

    // AI / Systems / Automation / Process articles
    if (
        t.includes("ai") ||
        t.includes("automation") ||
        t.includes("system") ||
        t.includes("workflow") ||
        t.includes("process") ||
        t.includes("architecture")
    ) {
        return `Editorial photography with architectural composition, structured geometry, clean lines, visual depth, premium minimalism, cinematic shadows, modern systems aesthetic, highly realistic, subtle atmosphere, sophisticated color grading, shot on a professional full-frame camera. Prefer environments, objects, spatial structure, and symbolic scenes. Avoid illustrations, futuristic UI overlays, handshake scenes, and generic corporate teamwork visuals. No text, no letters, no watermarks in the image itself.`;
    }

    // Founder psychology / deep thinking / hard truths
    if (
        t.includes("burnout") ||
        t.includes("failure") ||
        t.includes("decision") ||
        t.includes("psychology") ||
        t.includes("identity") ||
        t.includes("truth")
    ) {
        return `Moody editorial photography, cinematic low-key lighting, intelligent minimalist composition, subtle emotional tension, realistic environments, premium magazine aesthetic, nuanced shadows, restrained tone, highly detailed and realistic, natural textures, shot on a professional full-frame camera. Avoid commercial stock-photo style, glossy advertising visuals, exaggerated emotions, and cartoonish AI aesthetics. No text, no letters, no watermarks in the image itself.`;
    }

    // Default: business / startup / mentorship
    return `Editorial photography, realistic human scenes, cinematic natural lighting, shallow depth of field, subtle contrast, premium magazine aesthetic, modern business editorial, emotionally grounded, highly detailed, realistic textures, restrained composition, shot on a professional full-frame camera. Avoid stock-photo clichés, exaggerated smiles, fake office staging, handshake scenes, rocket metaphors, and generic startup visuals. No text, no letters, no watermarks in the image itself.`;
}

// ─── Helper: generate one DALL-E image, watermark it, return local URL ────────
async function generateAndWatermarkImage(
    prompt: string,
    filename: string,
    topic: string,
    size: "1792x1024" | "1024x1024" = "1792x1024"
): Promise<string | null> {
    try {
        const resp = await openai.images.generate({
            model: "dall-e-3",
            prompt: `${prompt}. ${getImageStyleSuffix(topic)}`,
            n: 1,
            size,
            quality: "standard",
        });
        const url = resp.data?.[0]?.url;
        if (!url) return null;
        return await downloadAndWatermark(url, filename);
    } catch (err) {
        console.error(`[Image gen failed: ${filename}]`, err);
        return null;
    }
}

// ─── Helper: inject body images into HTML content ─────────────────────────────
function injectBodyImages(html: string, imageUrls: string[]): string {
    if (!imageUrls.length) return html;

    // Split at </h2> tags (section breaks) to find injection points
    const parts = html.split(/(<\/h2>)/i);
    const injectAt = [
        Math.floor(parts.length * 0.3),  // ~30% — after first major section
        Math.floor(parts.length * 0.65), // ~65% — mid-article
    ];

    let imgIndex = 0;
    const result: string[] = [];

    for (let i = 0; i < parts.length; i++) {
        result.push(parts[i]);
        if (injectAt.includes(i) && imgIndex < imageUrls.length) {
            result.push(`
<figure style="margin: 2rem 0; text-align: center;">
  <img 
    src="${imageUrls[imgIndex]}" 
    alt="Illustration for article" 
    style="width: 100%; max-width: 800px; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);"
  />
</figure>`);
            imgIndex++;
        }
    }

    return result.join("");
}

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
            optimizationMode = "GEO",
            contentGoal = "authority",
            referenceImageUrls = [],
        } = body;

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const wordCount =
            length === "extra-long" ? "3000+" :
            length === "long" ? "1800-2500" :
            length === "short" ? "600-900" :
            "1000-1500";

        const contentGoalInstructions: Record<string, string> = {
            authority: "Goal: Establish Farjad as the definitive authority. Lead with experience. Be bold.",
            "lead-gen": "Goal: Generate booking inquiries. Plant seeds of 'I need this person's help'. Strong booking CTA.",
            awareness: "Goal: Introduce Farjad to new audiences. Be approachable, tell one personal story.",
            education: "Goal: Deliver maximum practical value. Readers should finish with something to do TODAY.",
        };

        const optimizationGuide =
            OPTIMIZATION_GUIDES[optimizationMode as keyof typeof OPTIMIZATION_GUIDES] ||
            OPTIMIZATION_GUIDES.GEO;
        const goalGuide = contentGoalInstructions[contentGoal] || contentGoalInstructions.authority;

        const ts = Date.now();

        // ─── Step 1: Pre-fetch Vault Assets to suggest ─────────────────────────────
        const vaultAssets = await prisma.aIGeneratedAsset.findMany({
            where: { type: "vault" },
            orderBy: { createdAt: "desc" },
            take: 10,
            select: { id: true, topic: true }
        });

        const vaultAssetList = vaultAssets.map((a: { id: string; topic: string }) => `- ID: ${a.id} | Topic: "${a.topic}"`).join("\n");
        const vaultAssetInstructions = vaultAssets.length > 0
            ? `\n\nVAULT ASSETS AVAILABLE TO EMBED:\nYou have access to the following 'Vault Assets' (Checklists/Guides) created by Farjad:\n${vaultAssetList}\n\nIf one of these assets is HIGHLY relevant to the article's topic, you MUST embed it naturally in the article by inserting the exact shortcode: [VAULT_ASSET id="THE_ID"] on its own line. Do not invent assets, only use the provided ones. Introduce the asset naturally in the text before embedding it.`
            : '';

        // ─── Step 2: Generate article text + image prompts ─────────────────────
        // Build user message parts (text + optional image vision)
        const hasRefImages = Array.isArray(referenceImageUrls) && referenceImageUrls.length > 0;

        const refImageInstructions = hasRefImages
            ? `\n\nIMPORTANT — REFERENCE IMAGES PROVIDED:\nThe user has uploaded ${referenceImageUrls.length} reference image(s). Analyze each image carefully.\n- Describe what you see in each image and tie it to the article content.\n- Embed these images naturally in the article HTML using <figure> tags with the EXACT URLs provided below.\n- Format: <figure style="margin: 2rem 0; text-align: center;"><img src="IMAGE_URL" alt="descriptive alt text" style="width: 100%; max-width: 800px; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);" /><figcaption style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">Caption describing the image</figcaption></figure>\n- Place images at relevant points in the article where they enhance the content.\n- Image URLs: ${referenceImageUrls.join(', ')}\n`
            : '';

        // Build message parts for vision-capable request
        type ContentPart = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string; detail: 'low' | 'high' | 'auto' } };
        const userParts: ContentPart[] = [
            {
                type: 'text' as const,
                text: `Write a "${optimizationMode}" optimized article about: "${topic}"${keywords ? `\nFocus keywords: ${keywords}` : ''}${refImageInstructions}`,
            },
        ];

        // Add image parts for GPT-4o vision
        if (hasRefImages) {
            for (const imgUrl of referenceImageUrls) {
                userParts.push({
                    type: 'image_url' as const,
                    image_url: { url: imgUrl, detail: 'low' as const },
                });
            }
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.72,
            messages: [
                {
                    role: "system",
                    content: `${BRAND_IDENTITY}

WRITING STYLE: ${tone}
TARGET AUDIENCE: ${targetAudience}
LANGUAGE: ${language}
ARTICLE LENGTH: ${wordCount} words

${optimizationGuide}
${goalGuide}${vaultAssetInstructions}

ALWAYS respond with valid JSON in exactly this structure — no other text:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "... (full HTML article body — use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <mark>, <table>, <thead>, <tbody>, <tr>, <th>, <td> tags. Include intro, body sections, Key Takeaways, a Frequently Asked Questions (FAQ) section, and the Lead CTA at the end. NO <html>/<body>/<head> tags. ${hasRefImages ? 'EMBED the user-provided reference images using <figure><img> tags at relevant points.' : ''})",
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": "...",
  "schemaType": "Article | HowTo | FAQPage",
  "coverImagePrompt": "DALL-E 3 prompt for a professional editorial cover image (1792x1024 landscape)",
  "bodyImage1Prompt": "DALL-E 3 prompt for a supplementary body image that illustrates the main concept of the first half of this article",
  "bodyImage2Prompt": "DALL-E 3 prompt for a supplementary body image that illustrates the second half of this article"
}

Rules:
- title: honest, direct, genuinely compelling
- slug: lowercase, hyphenated, max 7 words
- excerpt: 2-3 punchy sentences that make someone click
- seoTitle: 50-60 chars including primary keyword
- seoDescription: 150-160 chars with primary keyword and hook
- seoKeywords: comma-separated, 5-8 keywords
- **TABLES**: Include at least one well-structured HTML <table> whenever comparing concepts, listing pros/cons, or presenting structured data.
- **QUOTES**: Include at least one highly relevant, profound quote from a famous founder, philosopher, or influential figure using <blockquote>.
- **FORMATTING**: Use <strong> aggressively to bold key concepts. Use <mark> to highlight the 2-3 most critical sentences or takeaways in the entire article to make the text highly scannable.
- **FAQ**: You MUST include a "Frequently Asked Questions" section containing 3-4 highly relevant Q&As near the end of the article, regardless of the optimization mode.

IMAGE PROMPT RULES:
- Write image prompts as instructions for a top editorial photographer, not an illustrator
- For the cover image, prioritize a symbolic editorial scene — it must feel like a premium magazine feature, not a blog illustration
- For body images, make one human-centered (a realistic founder/human moment) and one systems/environment-centered (architecture, objects, space)
- Prefer realistic scenes, environments, architecture, objects, and thoughtful human presence
- Use strong editorial metaphors: crossroads, empty desks, city streets, industrial spaces, quiet moments of decision
- Avoid cliché startup visuals: people shaking hands, rocket ships, light bulbs, groups smiling at laptops, fake office teamwork
- Avoid illustrations, UI mockups, holographic interfaces, floating overlays, or futuristic CGI
- All prompts must produce realistic photography, not digital art or illustration
- No text or letters inside the image`,
                },
                {
                    role: "user",
                    content: userParts,
                },
            ],
            response_format: { type: "json_object" },
        });

        const generated = JSON.parse(completion.choices[0].message.content || "{}");

        // ─── Step 2: Generate all images in parallel (if enabled) ─────────────
        let coverImageUrl: string | null = null;
        let bodyImageUrls: string[] = [];

        if (generateImage) {
            const [cover, body1, body2] = await Promise.allSettled([
                generated.coverImagePrompt
                    ? generateAndWatermarkImage(generated.coverImagePrompt, `cover-${ts}.jpg`, topic, "1792x1024")
                    : Promise.resolve(null),
                generated.bodyImage1Prompt
                    ? generateAndWatermarkImage(generated.bodyImage1Prompt, `body1-${ts}.jpg`, topic, "1792x1024")
                    : Promise.resolve(null),
                generated.bodyImage2Prompt
                    ? generateAndWatermarkImage(generated.bodyImage2Prompt, `body2-${ts}.jpg`, topic, "1792x1024")
                    : Promise.resolve(null),
            ]);

            coverImageUrl = cover.status === "fulfilled" ? cover.value : null;
            const b1 = body1.status === "fulfilled" ? body1.value : null;
            const b2 = body2.status === "fulfilled" ? body2.value : null;
            bodyImageUrls = [b1, b2].filter(Boolean) as string[];
        }

        // ─── Step 3: Inject body images into HTML ─────────────────────────────
        const contentWithImages = injectBodyImages(generated.content || "", bodyImageUrls);

        return NextResponse.json({
            success: true,
            data: {
                title: generated.title,
                slug: generated.slug,
                excerpt: generated.excerpt,
                content: contentWithImages,
                seoTitle: generated.seoTitle,
                seoDescription: generated.seoDescription,
                seoKeywords: generated.seoKeywords,
                schemaType: generated.schemaType,
                coverImageUrl,
                bodyImageUrls,
                optimizationMode,
                contentGoal,
            },
        });
    } catch (error: unknown) {
        console.error("[AI Generate Post Error]", error);
        const message = error instanceof Error ? error.message : "Generation failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
