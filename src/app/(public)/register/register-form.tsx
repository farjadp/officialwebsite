"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser } from "@/app/actions/authActions"
import { signIn } from "next-auth/react"
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react"

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
})

type Values = z.infer<typeof schema>

export function RegisterForm() {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPw, setShowPw] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "" },
    })

    async function onSubmit(data: Values) {
        setIsPending(true)
        setError(null)
        try {
            const result = await registerUser(data)
            if (!result.success) { setError(result.error || "Registration failed."); return }

            setSuccess(true)
            // Auto sign-in
            const res = await signIn("credentials", { redirect: false, email: data.email, password: data.password })
            if (!res?.error) { router.push("/profile"); router.refresh() }
        } catch { setError("An unexpected error occurred. Please try again.") }
        finally { setIsPending(false) }
    }

    if (success) {
        return (
            <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-white">Account created!</h2>
                <p className="text-slate-400 text-sm">A verification email has been sent. Redirecting...</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Create account</h1>
                <p className="text-slate-500 text-sm mt-1">Join and get access to all features.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input {...register("name")} type="text" placeholder="John Doe" autoComplete="name"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]" />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input {...register("email")} type="email" placeholder="you@example.com" autoComplete="email"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]" />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input {...register("password")} type={showPw ? "text" : "password"} placeholder="Min. 8 characters" autoComplete="new-password"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-10 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]" />
                        <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
                </div>

                {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">{error}</div>
                )}

                <button type="submit" disabled={isPending}
                    className="w-full mt-2 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</> : "Create Account"}
                </button>
            </form>

            <p className="text-center text-slate-600 text-sm mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
            </p>
        </div>
    )
}
