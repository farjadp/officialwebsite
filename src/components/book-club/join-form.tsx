"use client"

// ============================================================================
// Hardware Source: join-form.tsx
// Version: 1.0.0 — 2026-08-20
// Why: Book club signup — email → Google Calendar invite
// Env / Identity: Client Component
// ============================================================================

import { useActionState } from "react"
import { joinBookClub, type JoinFormState } from "@/lib/actions/book-club"
import { Loader2, MailCheck, ScrollText } from "lucide-react"

const initialState: JoinFormState = {}

export function BookClubJoinForm() {
    const [state, formAction, isPending] = useActionState(joinBookClub, initialState)

    if (state.status === "success" || state.status === "partial") {
        return (
            <div className="flex items-center gap-4 rounded-2xl border-2 border-[#1B4B43]/30 bg-[#1B4B43]/5 p-6 text-right">
                <MailCheck className="h-8 w-8 shrink-0 text-[#1B4B43]" />
                <p className="text-lg font-medium leading-relaxed text-[#1B4B43]">
                    {state.message}
                </p>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    name="name"
                    placeholder="نام (اختیاری)"
                    className="h-14 rounded-xl border-2 border-[#3E2723]/20 bg-[#FDFAF3] px-5 text-base text-[#2B1B12] placeholder:text-[#8D7B6F] focus:border-[#7B2D26] focus:outline-none sm:w-1/3"
                    dir="rtl"
                />
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@gmail.com"
                    className="h-14 flex-1 rounded-xl border-2 border-[#3E2723]/20 bg-[#FDFAF3] px-5 text-base text-[#2B1B12] placeholder:text-[#8D7B6F] focus:border-[#7B2D26] focus:outline-none"
                    dir="ltr"
                    style={{ textAlign: "left" }}
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#7B2D26] px-8 text-base font-bold text-[#FDFAF3] transition-colors hover:bg-[#5E1F1A] disabled:opacity-60"
                >
                    {isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <ScrollText className="h-5 w-5" />
                    )}
                    {isPending ? "در حال ثبت..." : "به دورهمی بپیوند"}
                </button>
            </div>
            {state.status === "error" && (
                <p className="text-sm font-medium text-[#7B2D26]">{state.message}</p>
            )}
            <p className="text-sm leading-relaxed text-[#8D7B6F]">
                با ثبت ایمیل، دعوت‌نامه Google Calendar جلسه بعدی — همراه لینک Google Meet — مستقیم برایت ارسال می‌شود.
            </p>
        </form>
    )
}
