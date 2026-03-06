// src/app/api/auth/callback/linkedin/route.ts
// LinkedIn OAuth 2.0 callback — exchanges code for access_token and stores it
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    const error = req.nextUrl.searchParams.get("error");
    const siteUrl = process.env.NEXTAUTH_URL || "https://farjadp.info";

    if (error || !code) {
        return NextResponse.redirect(
            `${siteUrl}/admin/publish-report?linkedin=error&msg=${encodeURIComponent(error || "No code")}`
        );
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = `${siteUrl}/api/auth/callback/linkedin`;

    if (!clientId || !clientSecret) {
        return NextResponse.redirect(
            `${siteUrl}/admin/publish-report?linkedin=error&msg=Missing+LinkedIn+env+vars`
        );
    }

    try {
        // Step 1: Exchange code for access_token
        const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.access_token) {
            console.error("[LinkedIn OAuth] Token exchange failed:", tokenData);
            return NextResponse.redirect(
                `${siteUrl}/admin/publish-report?linkedin=error&msg=${encodeURIComponent(tokenData.error_description || "Token exchange failed")}`
            );
        }

        const accessToken = tokenData.access_token;
        const expiresIn = tokenData.expires_in; // seconds

        // Step 2: Get user profile (to get the person URN for posting)
        const profileRes = await fetch("https://api.linkedin.com/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const profile = await profileRes.json();
        console.log("[LinkedIn OAuth] Profile response:", JSON.stringify(profile));

        // LinkedIn /v2/me can return the ID in different fields
        const personId = profile.id || profile.sub;
        if (!personId) {
            console.error("[LinkedIn OAuth] Could not find person ID in profile:", profile);
            return NextResponse.redirect(
                `${siteUrl}/admin/publish-report?linkedin=error&msg=${encodeURIComponent("Could not get LinkedIn user ID. Check server logs.")}`
            );
        }

        const personUrn = `urn:li:person:${personId}`;
        const displayName = [profile.localizedFirstName, profile.localizedLastName].filter(Boolean).join(" ") || profile.name || "Connected";

        // Step 3: Store token + URN in DB
        await prisma.appSetting.upsert({
            where: { key: "LINKEDIN_ACCESS_TOKEN" },
            update: { value: accessToken },
            create: { key: "LINKEDIN_ACCESS_TOKEN", value: accessToken },
        });

        await prisma.appSetting.upsert({
            where: { key: "LINKEDIN_PERSON_URN" },
            update: { value: personUrn },
            create: { key: "LINKEDIN_PERSON_URN", value: personUrn },
        });

        await prisma.appSetting.upsert({
            where: { key: "LINKEDIN_TOKEN_EXPIRES" },
            update: { value: String(Date.now() + expiresIn * 1000) },
            create: { key: "LINKEDIN_TOKEN_EXPIRES", value: String(Date.now() + expiresIn * 1000) },
        });

        console.log(`[LinkedIn OAuth] Connected as ${displayName} (${personUrn}). Token expires in ${Math.round(expiresIn / 86400)} days.`);

        return NextResponse.redirect(
            `${siteUrl}/admin/publish-report?linkedin=success&name=${encodeURIComponent(displayName)}`
        );
    } catch (err) {
        console.error("[LinkedIn OAuth] Error:", err);
        const msg = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.redirect(
            `${siteUrl}/admin/publish-report?linkedin=error&msg=${encodeURIComponent(msg)}`
        );
    }
}
