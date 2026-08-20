// ============================================================================
// Hardware Source: google-calendar.ts
// Version: 1.0.0 — 2026-08-20
// Why: Add book-club members as attendees to pre-created Google Calendar events
// Env / Identity: Server Module (OAuth2 refresh-token flow)
// ============================================================================

import { google, calendar_v3 } from "googleapis"

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary"

export type CalendarResult<T = undefined> =
    | { ok: true; data?: T }
    | { ok: false; reason: "not_configured" | "api_error"; detail?: string }

function getCalendarClient(): calendar_v3.Calendar | null {
    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET
    const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN

    if (!clientId || !clientSecret || !refreshToken) return null

    const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
    oauth2.setCredentials({ refresh_token: refreshToken })
    return google.calendar({ version: "v3", auth: oauth2 })
}

export function isCalendarConfigured(): boolean {
    return Boolean(
        process.env.GOOGLE_CALENDAR_CLIENT_ID &&
        process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
        process.env.GOOGLE_CALENDAR_REFRESH_TOKEN
    )
}

// Merge new attendee emails into an existing event; Google emails the invite.
export async function addAttendeesToEvent(
    eventId: string,
    emails: string[]
): Promise<CalendarResult<{ meetLink?: string }>> {
    const calendar = getCalendarClient()
    if (!calendar) return { ok: false, reason: "not_configured" }

    try {
        const { data: event } = await calendar.events.get({
            calendarId: CALENDAR_ID,
            eventId,
        })

        const existing = event.attendees ?? []
        const existingEmails = new Set(
            existing.map((a) => (a.email || "").toLowerCase())
        )
        const toAdd = emails
            .map((e) => e.trim().toLowerCase())
            .filter((e) => e && !existingEmails.has(e))

        if (toAdd.length === 0) {
            return { ok: true, data: { meetLink: event.hangoutLink ?? undefined } }
        }

        const { data: updated } = await calendar.events.patch({
            calendarId: CALENDAR_ID,
            eventId,
            sendUpdates: "all",
            requestBody: {
                attendees: [...existing, ...toAdd.map((email) => ({ email }))],
            },
        })

        return { ok: true, data: { meetLink: updated.hangoutLink ?? undefined } }
    } catch (error) {
        return {
            ok: false,
            reason: "api_error",
            detail: error instanceof Error ? error.message : String(error),
        }
    }
}

export async function getEventDetails(
    eventId: string
): Promise<CalendarResult<{ meetLink?: string; start?: string; summary?: string }>> {
    const calendar = getCalendarClient()
    if (!calendar) return { ok: false, reason: "not_configured" }

    try {
        const { data: event } = await calendar.events.get({
            calendarId: CALENDAR_ID,
            eventId,
        })
        return {
            ok: true,
            data: {
                meetLink: event.hangoutLink ?? undefined,
                start: event.start?.dateTime ?? event.start?.date ?? undefined,
                summary: event.summary ?? undefined,
            },
        }
    } catch (error) {
        return {
            ok: false,
            reason: "api_error",
            detail: error instanceof Error ? error.message : String(error),
        }
    }
}
