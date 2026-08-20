// ============================================================================
// Hardware Source: get-google-calendar-token.mjs
// Version: 1.0.0 — 2026-08-20
// Why: One-time helper — obtain a Google Calendar OAuth refresh token
// Usage:
//   1. In Google Cloud Console create an OAuth Client (type: Web application)
//      with redirect URI http://localhost:8765/callback and enable the
//      "Google Calendar API".
//   2. GOOGLE_CALENDAR_CLIENT_ID=... GOOGLE_CALENDAR_CLIENT_SECRET=... \
//      node scripts/get-google-calendar-token.mjs
//   3. Open the printed URL, approve with YOUR Google account (the calendar
//      that owns the book-club events), copy the printed refresh token into
//      the env as GOOGLE_CALENDAR_REFRESH_TOKEN.
// ============================================================================

import http from "node:http"
import { google } from "googleapis"

const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID
const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET

if (!clientId || !clientSecret) {
    console.error("Set GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET first.")
    process.exit(1)
}

const REDIRECT = "http://localhost:8765/callback"
const oauth2 = new google.auth.OAuth2(clientId, clientSecret, REDIRECT)

const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
})

console.log("\nOpen this URL in your browser and approve access:\n")
console.log(authUrl + "\n")

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost:8765")
    if (url.pathname !== "/callback") { res.writeHead(404).end(); return }

    const code = url.searchParams.get("code")
    if (!code) { res.writeHead(400).end("Missing code"); return }

    try {
        const { tokens } = await oauth2.getToken(code)
        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("Done! Check your terminal for the refresh token. You can close this tab.")
        console.log("\n=== SUCCESS ===")
        console.log("Add this to your environment:\n")
        console.log(`GOOGLE_CALENDAR_REFRESH_TOKEN=${tokens.refresh_token}\n`)
    } catch (err) {
        res.writeHead(500).end("Token exchange failed — see terminal.")
        console.error("Token exchange failed:", err.message)
    } finally {
        server.close()
    }
})

server.listen(8765, () => console.log("Waiting for the OAuth redirect on http://localhost:8765 ..."))
