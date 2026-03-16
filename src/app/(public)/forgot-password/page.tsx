import { Suspense } from "react"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata = { title: "Forgot Password | farjadp.info" }

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712] px-6 py-16 relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-700/8 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 w-full max-w-sm">
                <div className="text-center mb-10">
                    <span className="text-lg font-bold text-white">farjadp.info</span>
                </div>
                <Suspense>
                    <ForgotPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
