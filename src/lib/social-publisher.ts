// src/lib/social-publisher.ts
// Auto-publish Content Waterfall results to Telegram and X (Twitter)
// Also logs results to SocialPublishLog via Prisma

import crypto from "crypto";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

// ─── Types ───────────────────────────────────────────────────────────────────
export interface WaterfallResult {
    analysis: { core_truth: string; sentiment: string };
    linkedin: { text: string; hook: string };
    telegram: { text: string };
    twitter: { thread: string[] };
}

// ─── Brand + Prompt (duplicated to avoid circular imports) ───────────────────
const WATERFALL_SYSTEM = `
You ARE Farjad. You are writing in first person, from your own lived experience.

IDENTITY:
- 17+ years in technology: software engineer, CTO, startup founder, product strategist
- MSc in Software Engineering + PhD in Anthropology (rare dual perspective: machines + humans)
- Immigrant founder who built companies in Iran, navigated Canadian startup ecosystem
- You've mentored 25+ startups, helped raise $3M+ for teams you believed in
- 3,000+ online meetings — you've seen what actually works vs what founders lie to themselves about

VOICE & VALUES:
- Brutally honest, zero tolerance for "startup theater"
- Systems over hustle, execution over passion
- Warm but direct — a mentor who tells hard truths

You are a Senior Content Engineer. Transmute the essay into platform-native assets.

RULES:
- NEVER use hype, fake numbers, or corporate jargon
- Archetype: The Sage (Mentor/Guide)

A. LINKEDIN (English):
- Hook → Problem → Shift → Solution → Conclusion. Under 1500 chars.
- USE EMOJIS: 3-5 (✅, 📌, 💡, ⚡, 🎯, 🧠, 📊). Place at start of key lines.
- END WITH 3-5 HASHTAGS on separate line. Never inside sentences.
- End main text with: "I dive deeper into this in the full essay. Link in the comments."

B. TELEGRAM (Persian / فارسی عامیانه):
- Write ENTIRELY in casual, colloquial Persian. Like a mentor texting a student.
- Start with "یه نکته درباره..." or "داشتم فکر می‌کردم..."
- Bullet points. Very direct. Under 200 words.
- USE EMOJIS: 3-5 (✅, 📌, 💡, ⚡, 🎯, 🧠).
- End with: "📖 مقاله کامل رو اینجا بخون: [Link Placeholder]"

C. X / TWITTER (English):
- Thread 3-5 tweets or one punchy tweet (max 280 chars).
- Contrarian opening. USE EMOJIS: 1-2 per tweet.
- EACH TWEET ends with 2-3 HASHTAGS. Never inside sentences.
- If not enough substance, return empty array.

OUTPUT: ONLY valid JSON:
{
  "analysis": { "core_truth": "String", "sentiment": "String" },
  "linkedin": { "text": "String (\\n for line breaks)", "hook": "String" },
  "telegram": { "text": "String — in casual Persian" },
  "twitter": { "thread": ["Tweet 1", "Tweet 2"] }
}
`;

// ─── Generate Waterfall (direct OpenAI call, no self-fetch) ──────────────────
export async function generateWaterfall(sourceText: string): Promise<WaterfallResult> {
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

    return JSON.parse(completion.choices[0].message.content || "{}");
}

// ─── Telegram Publisher ──────────────────────────────────────────────────────
export async function publishToTelegram(text: string, postUrl: string): Promise<{ ok: boolean; error?: string }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
        return { ok: false, error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID" };
    }

    const finalText = text.replace(/\[Link Placeholder\]/gi, postUrl);

    try {
        const res = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: channelId,
                    text: finalText,
                    parse_mode: "HTML",
                    disable_web_page_preview: false,
                }),
            }
        );

        const data = await res.json();
        if (!data.ok) {
            return { ok: false, error: `Telegram API: ${data.description}` };
        }

        console.log("[Telegram] Published successfully to", channelId);
        return { ok: true };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { ok: false, error: msg };
    }
}

// ─── Twitter/X Publisher (OAuth 1.0a) ────────────────────────────────────────

function percentEncode(str: string): string {
    return encodeURIComponent(str)
        .replace(/!/g, "%21")
        .replace(/\*/g, "%2A")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
}

function generateOAuthSignature(
    method: string,
    url: string,
    params: Record<string, string>,
    consumerSecret: string,
    tokenSecret: string
): string {
    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys
        .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
        .join("&");

    const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;
    const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

    return crypto
        .createHmac("sha1", signingKey)
        .update(baseString)
        .digest("base64");
}

function buildOAuthHeader(params: Record<string, string>): string {
    const headerParts = Object.keys(params)
        .filter((k) => k.startsWith("oauth_"))
        .sort()
        .map((k) => `${percentEncode(k)}="${percentEncode(params[k])}"`)
        .join(", ");

    return `OAuth ${headerParts}`;
}

async function postTweet(text: string): Promise<{ ok: boolean; error?: string }> {
    const consumerKey = process.env.TWITTER_API_KEY;
    const consumerSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_SECRET;

    if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
        return { ok: false, error: "Missing Twitter API credentials (API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET)" };
    }

    const url = "https://api.twitter.com/2/tweets";
    const method = "POST";

    const oauthParams: Record<string, string> = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: crypto.randomBytes(16).toString("hex"),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_token: accessToken,
        oauth_version: "1.0",
    };

    const signature = generateOAuthSignature(method, url, oauthParams, consumerSecret, accessTokenSecret);
    oauthParams.oauth_signature = signature;
    const authHeader = buildOAuthHeader(oauthParams);

    try {
        const res = await fetch(url, {
            method,
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            return { ok: false, error: `Twitter ${res.status}: ${errBody}` };
        }

        console.log("[Twitter] Tweet posted successfully");
        return { ok: true };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return { ok: false, error: msg };
    }
}

export async function publishToTwitter(
    thread: string[],
    postUrl: string
): Promise<{ ok: boolean; error?: string }> {
    if (!thread.length) {
        return { ok: false, error: "Empty thread — skipped" };
    }

    // Single tweet or first tweet of thread
    const firstTweet = thread.length === 1
        ? `${thread[0]}\n\n${postUrl}`
        : `${thread[0]}\n\n🔗 ${postUrl}`;

    const result = await postTweet(firstTweet.slice(0, 280));
    if (!result.ok) return result;

    // Remaining tweets in thread
    for (let i = 1; i < thread.length; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        await postTweet(thread[i].slice(0, 280));
    }

    return { ok: true };
}

// ─── Full Pipeline: Generate + Publish + Log ─────────────────────────────────
export async function runWaterfallPipeline(
    postId: string,
    postSlug: string,
    postTitle: string,
    postContent: string,
    postExcerpt?: string | null
): Promise<void> {
    const siteUrl = process.env.NEXTAUTH_URL || "https://farjadp.info";
    const postUrl = `${siteUrl}/blog/${postSlug}`;

    console.log(`[Auto-Publish] Starting pipeline for: "${postTitle}" (${postSlug})`);

    // Strip HTML for clean text
    const plainContent = postContent
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const sourceText = `Title: ${postTitle}\n\nExcerpt: ${postExcerpt || ""}\n\n${plainContent}`;

    let logData: {
        postId: string;
        postSlug: string;
        postTitle: string;
        coreTruth?: string;
        sentiment?: string;
        telegramStatus: string;
        telegramError?: string;
        telegramText?: string;
        twitterStatus: string;
        twitterError?: string;
        twitterText?: string;
        linkedinText?: string;
        linkedinHook?: string;
    } = {
        postId,
        postSlug,
        postTitle,
        telegramStatus: "PENDING",
        twitterStatus: "PENDING",
    };

    try {
        // Step 1: Generate waterfall content
        const result = await generateWaterfall(sourceText);

        logData.coreTruth = result.analysis?.core_truth;
        logData.sentiment = result.analysis?.sentiment;
        logData.linkedinText = result.linkedin?.text;
        logData.linkedinHook = result.linkedin?.hook;
        logData.telegramText = result.telegram?.text;
        logData.twitterText = result.twitter?.thread?.join("\n\n---\n\n");

        // Step 2: Publish to Telegram + Twitter in parallel
        const [tgResult, twResult] = await Promise.allSettled([
            publishToTelegram(result.telegram?.text || "", postUrl),
            publishToTwitter(result.twitter?.thread || [], postUrl),
        ]);

        // Telegram result
        if (tgResult.status === "fulfilled") {
            logData.telegramStatus = tgResult.value.ok ? "SUCCESS" : "FAILED";
            logData.telegramError = tgResult.value.error;
        } else {
            logData.telegramStatus = "FAILED";
            logData.telegramError = tgResult.reason?.message || "Unknown error";
        }

        // Twitter result
        if (twResult.status === "fulfilled") {
            logData.twitterStatus = twResult.value.ok ? "SUCCESS" : "FAILED";
            logData.twitterError = twResult.value.error;
        } else {
            logData.twitterStatus = "FAILED";
            logData.twitterError = twResult.reason?.message || "Unknown error";
        }

        console.log(`[Auto-Publish] Done. Telegram: ${logData.telegramStatus}, Twitter: ${logData.twitterStatus}`);
    } catch (err) {
        console.error("[Auto-Publish] Pipeline error:", err);
        const msg = err instanceof Error ? err.message : "Pipeline error";
        logData.telegramStatus = "FAILED";
        logData.telegramError = msg;
        logData.twitterStatus = "FAILED";
        logData.twitterError = msg;
    }

    // Step 3: Log to database
    try {
        await prisma.socialPublishLog.create({ data: logData });
    } catch (dbErr) {
        console.error("[Auto-Publish] Failed to write log:", dbErr);
    }
}
