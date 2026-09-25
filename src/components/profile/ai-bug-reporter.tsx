"use client"

// ============================================================================
// File Path: src/components/profile/ai-bug-reporter.tsx
// Why: The portal's bug reporter in the v3 "Light" look. Restyle only —
//      both /api/bug-report calls, the AI guess, the reset-on-navigation
//      effect and every word of the Persian copy are unchanged.
// Env / Identity: Client Component
// ============================================================================

import { useState, useEffect } from "react"
import { Bug, Sparkles, X, Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { usePathname } from "next/navigation"

export function AIBugReporter() {
    const [isOpen, setIsOpen] = useState(false)
    const [aiGuess, setAiGuess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [userDescription, setUserDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResolved, setIsResolved] = useState(false)
    const pathname = usePathname()

    const openReporter = async () => {
        setIsOpen(true)
        setIsResolved(false)
        setUserDescription("")

        if (!aiGuess) {
            setIsLoading(true)
            try {
                const res = await fetch("/api/bug-report/ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ currentUrl: window.location.href })
                })
                const data = await res.json()
                if (data.guess) {
                    setAiGuess(data.guess)
                }
            } catch (error) {
                console.error("AI Error:", error)
                setAiGuess("به نظر می‌رسد در این بخش به مشکلی برخوردید. آیا نیازی به گزارش آن دارید؟")
            } finally {
                setIsLoading(false)
            }
        }
    }

    const submitReport = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/bug-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentUrl: window.location.href,
                    aiGuess: aiGuess,
                    userDescription: userDescription
                })
            })

            if (res.ok) {
                toast.success("گزارش اشکال شما با موفقیت ثبت شد.")
                setIsResolved(true)
                setTimeout(() => {
                    setIsOpen(false)
                }, 2000)
            } else {
                toast.error("خطا در ثبت گزارش. لطفاً دوباره تلاش کنید.")
            }
        } catch (error) {
            console.error(error)
            toast.error("خطا در ارتباط با سرور.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Reset AI guess when navigating to a different page so it regenerates contextually
    useEffect(() => {
        setAiGuess(null)
    }, [pathname])

    return (
        <>
            {/* Floating Button */}
            <button
                type="button"
                onClick={openReporter}
                className="fixed bottom-6 start-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-v3-line bg-v3-raise text-v3-light transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-light/60 hover:bg-v3-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                title="گزارش اشکال"
            >
                <Bug className="h-5 w-5" aria-hidden />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-v3-ink/80 p-4 backdrop-blur-sm">
                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-raise font-v3-body text-v3-bone shadow-[0_40px_120px_-60px_rgba(232,196,138,0.5)]"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-v3-line/70 p-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-v3-light" aria-hidden />
                                <h3 className="font-v3-display text-lg font-light">گزارش هوشمند اشکال</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex h-11 w-11 items-center justify-center rounded-lg text-v3-mute transition-colors hover:bg-v3-ink hover:text-v3-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                            >
                                <X className="h-5 w-5" aria-hidden />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-6 p-5">
                            {isResolved ? (
                                <div className="flex flex-col items-center gap-3 py-6 text-center">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-v3-light/50 bg-v3-light/10 text-v3-light">
                                        <Bug className="h-6 w-6" aria-hidden />
                                    </span>
                                    <h4 className="font-v3-display text-lg font-light">با تشکر از گزارش شما</h4>
                                    <p className="text-sm leading-loose text-v3-soft">مشکل با موفقیت ثبت شد و به زودی توسط تیم بررسی می‌شود.</p>
                                </div>
                            ) : (
                                <>
                                    {/* AI Message Bubble */}
                                    <div className="flex gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-v3-light/50 bg-v3-light/10">
                                            <Sparkles className="h-4 w-4 text-v3-light" aria-hidden />
                                        </span>
                                        <div className="flex-1 rounded-2xl rounded-ss-none border border-v3-line/70 bg-v3-ink p-4">
                                            {isLoading ? (
                                                <div className="flex items-center gap-2 text-sm text-v3-mute">
                                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                                    در حال بررسی صفحه فعلی...
                                                </div>
                                            ) : (
                                                <p className="text-sm leading-loose text-v3-soft">
                                                    {aiGuess}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Input */}
                                    {!isLoading && (
                                        <div className="flex flex-col gap-2 pt-2 text-start">
                                            <label htmlFor="bug-report-note" className="text-sm font-medium text-v3-soft">
                                                توضیحات بیشتر (اختیاری):
                                            </label>
                                            <textarea
                                                id="bug-report-note"
                                                className="h-24 w-full resize-none rounded-xl border border-v3-line bg-v3-ink p-3 text-sm leading-loose text-v3-bone placeholder:text-v3-mute/70 transition-colors focus:border-v3-light/60 focus:outline-none focus:ring-2 focus:ring-v3-light/70"
                                                placeholder="اگر حدس هوش مصنوعی درست نیست، مشکل اصلی را اینجا بنویسید..."
                                                value={userDescription}
                                                onChange={(e) => setUserDescription(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {!isResolved && !isLoading && (
                            <div className="flex justify-end gap-3 border-t border-v3-line/70 p-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-v3-soft transition-colors hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                                >
                                    انصراف
                                </button>
                                <button
                                    type="button"
                                    onClick={submitReport}
                                    disabled={isSubmitting}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-v3-bone px-5 text-sm font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-raise disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-v3-line disabled:text-v3-mute"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                    ) : (
                                        <Send className="h-4 w-4" aria-hidden />
                                    )}
                                    ثبت گزارش
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
