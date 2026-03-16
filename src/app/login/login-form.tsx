"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(1, "Password is required."),
})

export function LoginForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPw, setShowPw] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setError(null)
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            })
            if (res?.error) {
                setError("Incorrect email or password. Please try again.")
            } else {
                router.push("/admin")
                router.refresh()
            }
        } catch {
            setError("Connection error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm">
            {/* Title */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input
                            {...register("email")}
                            type="email"
                            autoComplete="email"
                            autoFocus
                            placeholder="you@example.com"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]"
                        />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">Password</label>
                        <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input
                            {...register("password")}
                            type={showPw ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm pl-10 pr-10 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06]"
                        />
                        <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</> : "Sign In"}
                </button>
            </form>

            <p className="text-center text-slate-600 text-sm mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create one</Link>
            </p>
        </div>
    )
}
