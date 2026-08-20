"use client"

// ============================================================================
// Hardware Source: book-club-manager.tsx
// Version: 1.0.0 — 2026-08-20
// Why: Admin CRUD for book club sessions, books, members
// Env / Identity: Client Component
// ============================================================================

import { useActionState, useState } from "react"
import {
    createBookClubSession,
    updateBookClubSession,
    deleteBookClubSession,
    syncSessionAttendees,
    createBookClubBook,
    deleteBookClubBook,
    deleteBookClubMember,
    type AdminActionState,
} from "@/lib/actions/book-club"
import { SimpleEditor } from "@/components/startup-intake/simple-editor"
import { Button } from "@/components/ui/button"
import {
    BookOpen,
    CalendarDays,
    Loader2,
    RefreshCw,
    Trash2,
    Users,
    Pencil,
    X,
} from "lucide-react"

type SessionItem = {
    id: string
    title: string
    sessionDate: string
    googleEventId: string | null
    meetLink: string | null
    summary: string | null
    status: string
}

type BookItem = {
    id: string
    title: string
    author: string | null
    description: string | null
    link: string | null
    coverUrl: string | null
    order: number
}

type MemberItem = {
    id: string
    email: string
    name: string | null
    joinedAt: string
}

const initialState: AdminActionState = {}

function StateMessage({ state }: { state: AdminActionState }) {
    if (!state.message) return null
    return (
        <p
            className={`text-sm font-medium ${state.status === "error" ? "text-red-600" : "text-emerald-600"}`}
        >
            {state.message}
        </p>
    )
}

const inputCls =
    "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-slate-500 focus:outline-none"

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

function SessionForm({
    session,
    onDone,
}: {
    session?: SessionItem
    onDone?: () => void
}) {
    const action = session ? updateBookClubSession : createBookClubSession
    const [state, formAction, isPending] = useActionState(action, initialState)
    const [summary, setSummary] = useState(session?.summary ?? "")

    return (
        <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            {session && <input type="hidden" name="id" value={session.id} />}
            <div className="grid gap-3 md:grid-cols-2">
                <input name="title" defaultValue={session?.title} placeholder="Session title" required className={inputCls} />
                <input
                    name="sessionDate"
                    type="datetime-local"
                    defaultValue={session ? session.sessionDate.slice(0, 16) : ""}
                    required
                    className={inputCls}
                />
                <input
                    name="googleEventId"
                    defaultValue={session?.googleEventId ?? ""}
                    placeholder="Google Calendar Event ID"
                    className={inputCls}
                />
                <select name="status" defaultValue={session?.status ?? "UPCOMING"} className={inputCls}>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="DONE">Done</option>
                    <option value="CANCELED">Canceled</option>
                </select>
            </div>
            {session && (
                <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">خلاصه جلسه (روی صفحه عمومی نمایش داده می‌شود)</p>
                    <SimpleEditor value={summary} onChange={setSummary} placeholder="خلاصه جلسه را بنویسید..." />
                    <input type="hidden" name="summary" value={summary} />
                </div>
            )}
            <div className="flex items-center gap-3">
                <Button type="submit" disabled={isPending} size="sm">
                    {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    {session ? "Save Session" : "Create Session"}
                </Button>
                {onDone && (
                    <Button type="button" variant="ghost" size="sm" onClick={onDone}>
                        <X className="h-4 w-4" /> Close
                    </Button>
                )}
                <StateMessage state={state} />
            </div>
        </form>
    )
}

function SyncButton({ sessionId }: { sessionId: string }) {
    const [state, formAction, isPending] = useActionState(syncSessionAttendees, initialState)
    return (
        <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="id" value={sessionId} />
            <Button type="submit" variant="outline" size="sm" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="ml-1 h-4 w-4" />
                )}
                Sync members to event
            </Button>
            <StateMessage state={state} />
        </form>
    )
}

// ---------------------------------------------------------------------------
// Books
// ---------------------------------------------------------------------------

function BookForm() {
    const [state, formAction, isPending] = useActionState(createBookClubBook, initialState)
    return (
        <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2">
                <input name="title" placeholder="عنوان کتاب" required className={inputCls} />
                <input name="author" placeholder="نویسنده" className={inputCls} />
                <input name="link" placeholder="لینک دانلود/خرید" className={inputCls} dir="ltr" />
                <input name="coverUrl" placeholder="Cover image URL" className={inputCls} dir="ltr" />
                <input name="order" type="number" placeholder="ترتیب" defaultValue={0} className={inputCls} />
            </div>
            <textarea
                name="description"
                placeholder="توضیح کوتاه"
                rows={2}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            <div className="flex items-center gap-3">
                <Button type="submit" size="sm" disabled={isPending}>
                    {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    Add Book
                </Button>
                <StateMessage state={state} />
            </div>
        </form>
    )
}

// ---------------------------------------------------------------------------
// Main manager
// ---------------------------------------------------------------------------

export function BookClubManager({
    sessions,
    books,
    members,
    calendarConfigured,
}: {
    sessions: SessionItem[]
    books: BookItem[]
    members: MemberItem[]
    calendarConfigured: boolean
}) {
    const [editingId, setEditingId] = useState<string | null>(null)

    return (
        <div className="space-y-10">
            {!calendarConfigured && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
                    <strong>Google Calendar is not connected.</strong> Set{" "}
                    <code>GOOGLE_CALENDAR_CLIENT_ID</code>, <code>GOOGLE_CALENDAR_CLIENT_SECRET</code> and{" "}
                    <code>GOOGLE_CALENDAR_REFRESH_TOKEN</code> in the environment. Run{" "}
                    <code>node scripts/get-google-calendar-token.mjs</code> to obtain a refresh token.
                    Until then, signups are stored but invites are not sent.
                </div>
            )}

            {/* Sessions */}
            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <CalendarDays className="h-5 w-5" /> Sessions
                </h2>
                <SessionForm />
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div key={session.id} className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-slate-800">{session.title}</p>
                                    <p className="text-sm text-slate-500">
                                        {new Date(session.sessionDate).toLocaleString("en-CA")} ·{" "}
                                        <span
                                            className={
                                                session.status === "UPCOMING"
                                                    ? "text-emerald-600"
                                                    : session.status === "DONE"
                                                        ? "text-slate-500"
                                                        : "text-red-500"
                                            }
                                        >
                                            {session.status}
                                        </span>
                                        {session.googleEventId ? " · Event linked" : " · No event ID"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {session.googleEventId && <SyncButton sessionId={session.id} />}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingId(editingId === session.id ? null : session.id)}
                                    >
                                        <Pencil className="ml-1 h-4 w-4" /> Edit
                                    </Button>
                                    <form action={deleteBookClubSession}>
                                        <input type="hidden" name="id" value={session.id} />
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            {editingId === session.id && (
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                    <SessionForm session={session} onDone={() => setEditingId(null)} />
                                </div>
                            )}
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <p className="text-sm text-slate-400">No sessions yet.</p>
                    )}
                </div>
            </section>

            {/* Books */}
            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <BookOpen className="h-5 w-5" /> Books
                </h2>
                <BookForm />
                <div className="space-y-2">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                        >
                            <div>
                                <p className="font-medium text-slate-800">{book.title}</p>
                                <p className="text-sm text-slate-500">
                                    {book.author ?? "—"}
                                    {book.link && (
                                        <>
                                            {" · "}
                                            <a href={book.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                link
                                            </a>
                                        </>
                                    )}
                                </p>
                            </div>
                            <form action={deleteBookClubBook}>
                                <input type="hidden" name="id" value={book.id} />
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    ))}
                    {books.length === 0 && <p className="text-sm text-slate-400">No books yet.</p>}
                </div>
            </section>

            {/* Members */}
            <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Users className="h-5 w-5" /> Members ({members.length})
                </h2>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-500">
                            <tr>
                                <th className="px-4 py-2 font-medium">Email</th>
                                <th className="px-4 py-2 font-medium">Name</th>
                                <th className="px-4 py-2 font-medium">Joined</th>
                                <th className="px-4 py-2" />
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} className="border-t border-slate-100">
                                    <td className="px-4 py-2 font-mono text-xs">{member.email}</td>
                                    <td className="px-4 py-2">{member.name ?? "—"}</td>
                                    <td className="px-4 py-2 text-slate-500">
                                        {new Date(member.joinedAt).toLocaleDateString("en-CA")}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <form action={deleteBookClubMember}>
                                            <input type="hidden" name="id" value={member.id} />
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                                        No members yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
