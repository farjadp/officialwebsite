"use client"

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
                onClick={openReporter}
                className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-red-600/90 text-white rounded-full shadow-xl hover:bg-red-500 hover:scale-110 transition-all duration-300"
                title="گزارش اشکال"
            >
                <Bug className="w-5 h-5" />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div 
                        className="bg-[#0B1425] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-iran-firouzeh" />
                                <h3 className="text-lg font-bold text-white">گزارش هوشمند اشکال</h3>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-6">
                            {isResolved ? (
                                <div className="text-center space-y-3 py-6">
                                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                                        <Bug className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-white font-medium text-lg">با تشکر از گزارش شما</h4>
                                    <p className="text-white/60 text-sm">مشکل با موفقیت ثبت شد و به زودی توسط تیم بررسی می‌شود.</p>
                                </div>
                            ) : (
                                <>
                                    {/* AI Message Bubble */}
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-iran-lajvard flex items-center justify-center shrink-0">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white/10 rounded-2xl rounded-tr-none p-4 flex-1">
                                            {isLoading ? (
                                                <div className="flex items-center gap-2 text-white/70 text-sm">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    در حال بررسی صفحه فعلی...
                                                </div>
                                            ) : (
                                                <p className="text-white/90 text-sm leading-relaxed">
                                                    {aiGuess}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Input */}
                                    {!isLoading && (
                                        <div className="space-y-3 pt-2">
                                            <label className="text-sm text-white/80 font-medium block">
                                                توضیحات بیشتر (اختیاری):
                                            </label>
                                            <textarea
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-iran-firouzeh/50 resize-none h-24"
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
                            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={submitReport}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-iran-lajvard hover:bg-iran-lajvard/80 text-white transition-colors text-sm font-medium"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
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
