import { Suspense } from "react"
import { VerifyEmailContent } from "./verify-email-content"

export const metadata = { title: "Verify Email | farjadp.info" }

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030712]">
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 w-full max-w-md px-4 py-16">
                <div className="text-center mb-8">
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">farjadp.info</span>
                </div>
                <Suspense>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    )
}
