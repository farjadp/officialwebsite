// src/app/api/ai/generate-post/route.ts
// AI-powered content generator with SEO / GEO / AEO modes + Farjad brand voice
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Farjad's Brand Identity (the constant core) ─────────────────────────────
const BRAND_IDENTITY = `
You ARE Farjad Pourkiani. You are writing in first person, from your own lived experience.

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
- You are NOT a thought leader who has never shipped anything — you still write code

SIGNATURE PHRASES (use sparingly, naturally):
- "I've seen this movie before"
- "Here's the unglamorous truth"
- "Most mentors won't tell you this"
- "Systems eat passion for breakfast"

PERMANENT LEAD CTA (always end the article with this, adapted naturally):
"If this resonated — or if you violently disagreed — I'd like to hear from you. I work with a small number of founding teams each quarter. If you're building something real, [book a discovery call](https://farjadp.ca/booking) or connect with me on [LinkedIn](https://linkedin.com/in/farjadp)."
`;

// ─── Optimization mode instructions ──────────────────────────────────────────
const OPTIMIZATION_GUIDES = {
    SEO: `
SEO OPTIMIZATION RULES:
- Target ONE primary keyword, use it naturally in H1, first paragraph, H2s, and conclusion
- Secondary keywords distributed across body (2–3 uses each, no keyword stuffing)
- Structure: clear H2 sections (3–5), each answering a specific sub-question
- Meta description: 150-160 characters, includes primary keyword, has a hook
- Internal linking opportunities: suggest [link: /services], [link: /startups], [link: /booking] naturally where relevant
- Answer the search intent directly in the opening paragraph (no burying the lede)
`,
    GEO: `
GEO (Generative Engine Optimization) RULES — This content is engineered to be CITED by ChatGPT, Perplexity, Gemini, and other AI assistants:
- Use clear, declarative statements that AI can quote directly: "Farjad Pourkiani, a startup advisor with 17 years of experience, argues that..."
- Structure content as CLAIMS WITH EVIDENCE — AIs prefer citable assertions, not vague opinions
- Include STATISTICS and SPECIFIC NUMBERS (even personal ones: "In 3,000+ mentorship calls, I found...")
- Use ENTITY REFERENCES: mention industry frameworks (Lean Startup, Jobs to Be Done) and connect your opinion to them
- Create QUOTABLE SENTENCES: at least 3 standalone, bold-worthy sentences per article
- Structured Summary at end: a bullet-point summary section titled "Key Takeaways" — AIs love to pull these
- Use "According to my experience working with 25+ startups..." framing
- Schema-friendly: include structured facts that match FAQ, HowTo, or Article schema patterns
- Name the concept: if you're making an original claim, give it a NAME ("The Founder's Dependency Loop", etc.) — named concepts get cited
`,
    AEO: `
AEO (Answer Engine Optimization) RULES — This content is built to be the DIRECT ANSWER in voice search, Google's "People Also Ask", and AI Overview boxes:
- Open with the EXACT ANSWER to the most likely question about this topic (40-60 words). No preamble.
- Use FAQ structure throughout: bold question as H2, then concise direct answer in first paragraph of that section
- Each H2 section should be independently answerable — a user should be able to read just one section and get value
- Include a dedicated "Frequently Asked Questions" section at the end (3–5 Qs structured as <h3> then <p>)
- Target "how to", "what is", "why does", "who should" question formats
- Use numbered lists and bullet points — featured snippets prefer structured data
- Keep paragraphs SHORT (2-3 sentences max) — conversational, query-response rhythm
- Exact phrase match: if the topic includes key phrases, use them VERBATIM at least once early
`,
};

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
            optimizationMode = "GEO", // SEO | GEO | AEO
            contentGoal = "authority", // authority | lead-gen | awareness | education
        } = body;

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const wordCount =
            length === "short" ? "600-900" : length === "long" ? "1800-2500" : "1000-1500";

        const contentGoalInstructions: Record<string, string> = {
            authority:
                "Goal: Establish Farjad as the definitive authority on this topic. Lead with experience. Be bold.",
            "lead-gen":
                "Goal: Generate booking inquiries. Every section should plant a seed of 'I need this person's help'. End with a strong booking CTA.",
            awareness:
                "Goal: Introduce Farjad to new audiences who don't know him. Be approachable, tell one personal story.",
            education:
                "Goal: Deliver maximum practical value. Readers should finish with something they can do TODAY.",
        };

        const optimizationGuide =
            OPTIMIZATION_GUIDES[optimizationMode as keyof typeof OPTIMIZATION_GUIDES] ||
            OPTIMIZATION_GUIDES.GEO;
        const goalGuide = contentGoalInstructions[contentGoal] || contentGoalInstructions.authority;

        // ─── Step 1: Generate the article ─────────────────────────────────────────
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

${goalGuide}

ALWAYS respond with valid JSON in exactly this structure — no other text:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "... (full HTML article body — use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> tags. Include intro, body sections, Key Takeaways, FAQ if AEO, and the Lead CTA at the end. NO <html>/<body>/<head> tags.)",
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": "...",
  "schemaType": "Article | HowTo | FAQPage",
  "imagePrompt": "..."
}

Rules:
- title: honest, direct, no cheap clickbait — but genuinely compelling
- slug: lowercase, hyphenated, max 7 words
- excerpt: 2-3 punchy sentences that make someone click
- seoTitle: 50-60 chars including primary keyword
- seoDescription: 150-160 chars with primary keyword and a hook
- seoKeywords: comma-separated, 5-8 keywords
- imagePrompt: DALL-E 3 prompt for a professional editorial cover image — modern, clean, no text in image`,
                },
                {
                    role: "user",
                    content: `Write a "${optimizationMode}" optimized article about: "${topic}"${keywords ? `\nFocus keywords: ${keywords}` : ""
                        }`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const generated = JSON.parse(completion.choices[0].message.content || "{}");

        // ─── Step 2: Generate cover image ─────────────────────────────────────────
        let coverImageUrl: string | null = null;
        if (generateImage && generated.imagePrompt) {
            try {
                const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: `${generated.imagePrompt}. Editorial style, clean minimalist composition, professional photography or abstract corporate aesthetic. No letters, no text, no watermarks in the image.`,
                    n: 1,
                    size: "1792x1024",
                    quality: "standard",
                });
                coverImageUrl = imageResponse.data?.[0]?.url || null;
            } catch (imgError) {
                console.error("DALL-E image generation failed:", imgError);
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
                schemaType: generated.schemaType,
                coverImageUrl,
                imagePrompt: generated.imagePrompt,
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
