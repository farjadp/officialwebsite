"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success === "true") return (
        <div className="text-center space-y-4 w-full max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Email verified!</h1>
            <p className="text-slate-400 text-sm">Your email has been verified. You can now sign in.</p>
            <Link href="/login" className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">Sign In Now</Link>
        </div>
    )

    if (error) {
        const msg: Record<string, string> = {
            invalid: "This link is invalid or has expired. Please register again.",
            missing: "Verification token is missing from the URL.",
            server: "Something went wrong on our end. Please try again.",
        }
        return (
            <div className="text-center space-y-4 w-full max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h1 className="text-2xl font-bold text-white">Verification failed</h1>
                <p className="text-slate-400 text-sm">{msg[error] || "Unknown error occurred."}</p>
                <Link href="/register" className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">Register Again</Link>
            </div>
        )
    }

    return (
        <div className="text-center space-y-4 w-full max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Verify your email</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
                We sent a verification link to your inbox.<br />Click the link to activate your account.
            </p>
            <p className="text-slate-600 text-xs">Didn't receive it? Check your spam folder.</p>
        </div>
    )
}
