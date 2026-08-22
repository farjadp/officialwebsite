"use server"

// ============================================================================
// Hardware Source: book-club.ts
// Version: 1.0.0 — 2026-08-20
// Why: Book club (دورهمی کتاب‌خوانی مشروطه) — signup, sessions, books
// Env / Identity: Server Actions
// ============================================================================

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import { addAttendeesToEvent, isCalendarConfigured } from "@/lib/google-calendar"

const PUBLIC_PATH = "/fa/book-club"
const ADMIN_PATH = "/admin/book-club"

// ---------------------------------------------------------------------------
// Public: join the club
// ---------------------------------------------------------------------------

const JoinSchema = z.object({
    email: z.string().email("ایمیل معتبر وارد کنید"),
    name: z.string().max(100).optional(),
})

export type JoinFormState = {
    status?: "success" | "partial" | "error"
    message?: string
}

export async function joinBookClub(
    prevState: JoinFormState,
    formData: FormData
): Promise<JoinFormState> {
    const parsed = JoinSchema.safeParse({
        email: formData.get("email"),
        name: formData.get("name") || undefined,
    })

    if (!parsed.success) {
        return { status: "error", message: "ایمیل معتبر وارد کنید." }
    }

    const email = parsed.data.email.trim().toLowerCase()

    try {
        await prisma.bookClubMember.upsert({
            where: { email },
            update: { name: parsed.data.name || undefined },
            create: { email, name: parsed.data.name || null },
        })

        // نگهداری در لیست خبرنامه با تگ مخصوص
        await prisma.subscriber.upsert({
            where: { email },
            update: {},
            create: { email, tags: ["BookClub"], source: "book-club" },
        })
    } catch {
        return { status: "error", message: "خطا در ثبت‌نام. دوباره تلاش کنید." }
    }

    // اضافه کردن به ایونت‌های گوگل کلندر جلسات پیش رو
    const upcoming = await prisma.bookClubSession.findMany({
        where: {
            status: "UPCOMING",
            googleEventId: { not: null },
            sessionDate: { gte: new Date() },
        },
    })

    let calendarOk = true
    for (const session of upcoming) {
        const result = await addAttendeesToEvent(session.googleEventId!, [email])
        if (!result.ok) calendarOk = false
    }

    revalidatePath(PUBLIC_PATH)

    if (upcoming.length > 0 && calendarOk) {
        return {
            status: "success",
            message: "ثبت شد! دعوت‌نامه گوگل کلندر (همراه لینک Google Meet) به ایمیلت ارسال شد.",
        }
    }
    if (upcoming.length > 0 && !calendarOk) {
        return {
            status: "partial",
            message: "ثبت شد! دعوت‌نامه کلندر به‌زودی برایت ارسال می‌شود.",
        }
    }
    return {
        status: "success",
        message: "ثبت شد! به محض اعلام جلسه بعدی، دعوت‌نامه دریافت می‌کنی.",
    }
}

// ---------------------------------------------------------------------------
// Admin helpers
// ---------------------------------------------------------------------------

async function requireAdmin() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")
}

export type AdminActionState = { status?: "success" | "error"; message?: string }

// ---------------------------------------------------------------------------
// Admin: sessions
// ---------------------------------------------------------------------------

const SessionSchema = z.object({
    title: z.string().min(1),
    sessionDate: z.string().min(1),
    googleEventId: z.string().optional(),
    meetLink: z.string().optional(),
    readingAssignment: z.string().optional(),
    status: z.enum(["UPCOMING", "DONE", "CANCELED"]).default("UPCOMING"),
})

export async function createBookClubSession(
    prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    await requireAdmin()

    const parsed = SessionSchema.safeParse({
        title: formData.get("title"),
        sessionDate: formData.get("sessionDate"),
        googleEventId: formData.get("googleEventId") || undefined,
        meetLink: formData.get("meetLink") || undefined,
        readingAssignment: formData.get("readingAssignment") || undefined,
        status: formData.get("status") || "UPCOMING",
    })
    if (!parsed.success) return { status: "error", message: "Title and date are required." }

    await prisma.bookClubSession.create({
        data: {
            title: parsed.data.title,
            sessionDate: new Date(parsed.data.sessionDate),
            googleEventId: parsed.data.googleEventId || null,
            meetLink: parsed.data.meetLink || null,
            readingAssignment: parsed.data.readingAssignment || null,
            status: parsed.data.status,
        },
    })

    revalidatePath(ADMIN_PATH)
    revalidatePath(PUBLIC_PATH)
    return { status: "success", message: "Session created." }
}

export async function updateBookClubSession(
    prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    await requireAdmin()

    const id = formData.get("id") as string
    if (!id) return { status: "error", message: "Missing session id." }

    const parsed = SessionSchema.safeParse({
        title: formData.get("title"),
        sessionDate: formData.get("sessionDate"),
        googleEventId: formData.get("googleEventId") || undefined,
        meetLink: formData.get("meetLink") || undefined,
        readingAssignment: formData.get("readingAssignment") || undefined,
        status: formData.get("status") || "UPCOMING",
    })
    if (!parsed.success) return { status: "error", message: "Title and date are required." }

    await prisma.bookClubSession.update({
        where: { id },
        data: {
            title: parsed.data.title,
            sessionDate: new Date(parsed.data.sessionDate),
            googleEventId: parsed.data.googleEventId || null,
            meetLink: parsed.data.meetLink || null,
            readingAssignment: parsed.data.readingAssignment || null,
            status: parsed.data.status,
            summary: (formData.get("summary") as string) || undefined,
        },
    })

    revalidatePath(ADMIN_PATH)
    revalidatePath(PUBLIC_PATH)
    return { status: "success", message: "Session updated." }
}

export async function deleteBookClubSession(formData: FormData): Promise<void> {
    await requireAdmin()
    const id = formData.get("id") as string
    if (!id) return
    await prisma.bookClubSession.delete({ where: { id } })
    revalidatePath(ADMIN_PATH)
    revalidatePath(PUBLIC_PATH)
}

// Push every registered member into the session's Google Calendar event.
export async function syncSessionAttendees(
    prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    await requireAdmin()

    const id = formData.get("id") as string
    if (!id) return { status: "error", message: "Missing session id." }

    if (!isCalendarConfigured()) {
        return { status: "error", message: "Google Calendar is not configured (missing env vars)." }
    }

    const session = await prisma.bookClubSession.findUnique({ where: { id } })
    if (!session?.googleEventId) {
        return { status: "error", message: "This session has no Google Event ID." }
    }

    const members = await prisma.bookClubMember.findMany()
    if (members.length === 0) return { status: "success", message: "No members to sync." }

    const result = await addAttendeesToEvent(
        session.googleEventId,
        members.map((m) => m.email)
    )

    if (!result.ok) {
        return { status: "error", message: `Calendar error: ${"detail" in result ? result.detail : result.reason}` }
    }

    if (result.data?.meetLink && result.data.meetLink !== session.meetLink) {
        await prisma.bookClubSession.update({
            where: { id },
            data: { meetLink: result.data.meetLink },
        })
    }

    revalidatePath(ADMIN_PATH)
    revalidatePath(PUBLIC_PATH)
    return { status: "success", message: `Synced ${members.length} members to the event.` }
}

// ---------------------------------------------------------------------------
// Admin: books
// ---------------------------------------------------------------------------

const BookSchema = z.object({
    title: z.string().min(1),
    author: z.string().optional(),
    description: z.string().optional(),
    link: z.string().optional(),
    coverUrl: z.string().optional(),
    order: z.coerce.number().default(0),
})

export async function createBookClubBook(
    prevState: AdminActionState,
    formData: FormData
): Promise<AdminActionState> {
    await requireAdmin()

    const parsed = BookSchema.safeParse({
        title: formData.get("title"),
        author: formData.get("author") || undefined,
        description: formData.get("description") || undefined,
        link: formData.get("link") || undefined,
        coverUrl: formData.get("coverUrl") || undefined,
        order: formData.get("order") || 0,
    })
    if (!parsed.success) return { status: "error", message: "Title is required." }

    await prisma.bookClubBook.create({
        data: {
            title: parsed.data.title,
            author: parsed.data.author || null,
            description: parsed.data.description || null,
            link: parsed.data.link || null,
            coverUrl: parsed.data.coverUrl || null,
            order: parsed.data.order,
        },
    })

    revalidatePath(ADMIN_PATH)
    revalidatePath(PUBLIC_PATH)
    return { status: "success", message: "Book added." }
}

export async function deleteBookClubBook(formData: FormData): Promise<void> {
    await requireAdmin()
    const id = formData.get("id") as string
    if (!id) return
    await prisma.bookClubBook.delete({ where: { id } })
    revalidatePath(ADMIN_PATH)
    revalidatePath(PUBLIC_PATH)
}

// ---------------------------------------------------------------------------
// Admin: members
// ---------------------------------------------------------------------------

export async function deleteBookClubMember(formData: FormData): Promise<void> {
    await requireAdmin()
    const id = formData.get("id") as string
    if (!id) return
    await prisma.bookClubMember.delete({ where: { id } })
    revalidatePath(ADMIN_PATH)
}
