"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Loader2, Mail, ArrowLeft } from "lucide-react"

const schema = z.object({ email: z.string().email("Please enter a valid email.") })

export function ForgotPasswordForm() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema), defaultValues: { email: "" }
    })

    async function onSubmit(values: z.infer<typeof schema>) {
        setIsLoading(true); setError(null)
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error || "Something went wrong."); return }
            setSuccess(true)
        } catch { setError("Network error. Please try again.") }
        finally { setIsLoading(false) }
    }

    if (success) {
        return (
            <div className="w-full max-w-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-white">Check your inbox</h2>
                <p className="text-slate-400 text-sm leading-relaxed">If that email exists in our system, you'll receive a reset link shortly. Check your spam folder too.</p>
                <Link href="/login" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />Back to Sign In
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
                <p className="text-slate-500 text-sm mt-1">Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input {...register("email")} type="email" placeholder="you@example.com"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]" />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                </div>

                {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button type="submit" disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : "Send Reset Link"}
                </button>
            </form>

            <p className="text-center mt-6">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-400 text-sm transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />Back to Sign In
                </Link>
            </p>
        </div>
    )
}
