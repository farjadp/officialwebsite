// src/lib/social-publisher.ts
// Auto-publish Content Waterfall results to Telegram and X (Twitter)

import crypto from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface WaterfallResult {
    analysis: { core_truth: string; sentiment: string };
    linkedin: { text: string; hook: string };
    telegram: { text: string };
    twitter: { thread: string[] };
}

// ─── Telegram Publisher ──────────────────────────────────────────────────────
export async function publishToTelegram(text: string, postUrl: string): Promise<boolean> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
        console.warn("[Telegram] Missing BOT_TOKEN or CHANNEL_ID — skipping");
        return false;
    }

    // Replace [Link Placeholder] with actual URL
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
            console.error("[Telegram] API error:", data.description);
            return false;
        }

        console.log("[Telegram] Published successfully to", channelId);
        return true;
    } catch (err) {
        console.error("[Telegram] Send failed:", err);
        return false;
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

async function postTweet(text: string): Promise<boolean> {
    const consumerKey = process.env.TWITTER_API_KEY;
    const consumerSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_SECRET;

    if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
        console.warn("[Twitter] Missing API credentials — skipping");
        return false;
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

    const signature = generateOAuthSignature(
        method,
        url,
        oauthParams,
        consumerSecret,
        accessTokenSecret
    );

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
            console.error("[Twitter] API error:", res.status, errBody);
            return false;
        }

        console.log("[Twitter] Tweet posted successfully");
        return true;
    } catch (err) {
        console.error("[Twitter] Post failed:", err);
        return false;
    }
}

export async function publishToTwitter(
    thread: string[],
    postUrl: string
): Promise<boolean> {
    if (!thread.length) {
        console.log("[Twitter] Empty thread — skipping");
        return false;
    }

    // For a single tweet, just post it with the link
    if (thread.length === 1) {
        const tweetText = `${thread[0]}\n\n${postUrl}`;
        return postTweet(tweetText.slice(0, 280));
    }

    // For a thread, post each tweet sequentially
    // First tweet includes the link
    const firstTweet = `${thread[0]}\n\n🔗 ${postUrl}`;
    const success = await postTweet(firstTweet.slice(0, 280));

    if (!success) return false;

    // Post remaining tweets (small delay between each)
    for (let i = 1; i < thread.length; i++) {
        await new Promise((r) => setTimeout(r, 1000)); // 1s delay
        await postTweet(thread[i].slice(0, 280));
    }

    return true;
}

// ─── Orchestrator ────────────────────────────────────────────────────────────
export async function publishAll(
    result: WaterfallResult,
    postUrl: string
): Promise<{ telegram: boolean; twitter: boolean }> {
    const [telegram, twitter] = await Promise.allSettled([
        publishToTelegram(result.telegram.text, postUrl),
        publishToTwitter(result.twitter.thread, postUrl),
    ]);

    return {
        telegram: telegram.status === "fulfilled" ? telegram.value : false,
        twitter: twitter.status === "fulfilled" ? twitter.value : false,
    };
}
