"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"

const schema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] })

export function ResetPasswordForm() {
    const router = useRouter()
    const token = useSearchParams().get("token")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPw, setShowPw] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema), defaultValues: { password: "", confirmPassword: "" }
    })

    if (!token) return (
        <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Invalid link</h2>
            <p className="text-slate-400 text-sm">This reset link is missing a token. Please request a new one.</p>
            <Link href="/forgot-password" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors">Request New Link</Link>
        </div>
    )

    async function onSubmit(values: z.infer<typeof schema>) {
        setIsLoading(true); setError(null)
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: values.password }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error || "Something went wrong."); return }
            setSuccess(true)
            setTimeout(() => router.push("/login"), 2500)
        } catch { setError("Network error. Please try again.") }
        finally { setIsLoading(false) }
    }

    if (success) return (
        <div className="w-full max-w-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Password updated!</h2>
            <p className="text-slate-400 text-sm">Your password has been changed. Redirecting to login...</p>
        </div>
    )

    return (
        <div className="w-full max-w-sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Set new password</h1>
                <p className="text-slate-500 text-sm mt-1">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input {...register("password")} type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-10 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]" />
                        <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input {...register("confirmPassword")} type="password" placeholder="Repeat password"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]" />
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
                </div>

                {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button type="submit" disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Updating...</> : "Update Password"}
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
