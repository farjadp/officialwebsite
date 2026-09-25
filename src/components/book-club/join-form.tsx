"use client"

// ============================================================================
// Hardware Source: join-form.tsx
// Version: 3.0.0 — 2026-09-25
// Why: Book club signup — email → Google Calendar invite. v3 "Light" look:
//      dark fields, visible labels, a ring of light on focus, the error
//      inline under the email field. Fields, action and messages unchanged.
// Env / Identity: Client Component
// ============================================================================

import { useActionState } from "react"
import { joinBookClub, type JoinFormState } from "@/lib/actions/book-club"
import { Loader2, MailCheck, ScrollText } from "lucide-react"

const initialState: JoinFormState = {}

const FIELD =
    "h-14 w-full rounded-xl border border-v3-line bg-v3-raise px-5 text-base text-v3-bone placeholder:text-v3-mute transition-colors hover:border-v3-mute focus:border-v3-light focus:outline-none focus-visible:ring-2 focus-visible:ring-v3-light/60 aria-invalid:border-v3-light"
const LABEL = "text-sm text-v3-soft"

export function BookClubJoinForm() {
    const [state, formAction, isPending] = useActionState(joinBookClub, initialState)
    const hasError = state.status === "error"

    if (state.status === "success" || state.status === "partial") {
        return (
            <div role="status" className="flex items-center gap-4 rounded-2xl border border-v3-light/50 bg-v3-raise p-6 text-start">
                <MailCheck className="h-8 w-8 shrink-0 text-v3-light" aria-hidden />
                <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">
                    {state.message}
                </p>
            </div>
        )
    }

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="book-club-name" className={LABEL}>
                    نام (اختیاری)
                </label>
                <input
                    id="book-club-name"
                    type="text"
                    name="name"
                    placeholder="نام (اختیاری)"
                    autoComplete="name"
                    className={FIELD}
                    dir="rtl"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="book-club-email" className={LABEL}>
                    ایمیل
                </label>
                <input
                    id="book-club-email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@gmail.com"
                    autoComplete="email"
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError ? "book-club-error" : undefined}
                    className={`${FIELD} text-left`}
                    dir="ltr"
                />
                {hasError && (
                    <p id="book-club-error" role="alert" className="text-sm font-medium text-v3-light">
                        {state.message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-v3-bone px-8 text-base font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-raise disabled:translate-y-0 disabled:opacity-60"
            >
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                ) : (
                    <ScrollText className="h-5 w-5" aria-hidden />
                )}
                {isPending ? "در حال ثبت..." : "به دورهمی بپیوند"}
            </button>
            <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">
                با ثبت ایمیل، دعوت‌نامه Google Calendar جلسه بعدی — همراه لینک Google Meet — مستقیم برایت ارسال می‌شود.
            </p>
        </form>
    )
}
