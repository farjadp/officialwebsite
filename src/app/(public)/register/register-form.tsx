"use client"

// ============================================================================
// File Path: src/app/(public)/register/register-form.tsx
// Why: The sign-up form in v3 "Light" — the kit's labelled fields and button,
//      a calm staggered reveal. Restyle only: the schema, the server action,
//      the auto sign-in and the redirect are exactly as they were.
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser } from "@/app/actions/authActions"
import { signIn } from "next-auth/react"
import { Check, CircleAlert, Eye, EyeOff } from "lucide-react"
import { StepIn, ToolButton, ToolField } from "@/components/v3/tool-kit"
import { localePath } from "@/lib/nav"

const LOCALE = "en" as const

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
            <StepIn className="flex flex-col items-center gap-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-v3-light/50 bg-v3-light/10">
                    <Check className="h-7 w-7 text-v3-light" aria-hidden />
                </span>
                <h2 className="font-v3-display text-2xl font-light text-v3-bone">Account created!</h2>
                <p className="text-sm text-v3-soft">A verification email has been sent. Redirecting...</p>
            </StepIn>
        )
    }

    return (
        <div className="w-full max-w-sm">
            <StepIn className="mb-8 flex flex-col gap-2">
                <h1 className="font-v3-display text-3xl font-light leading-tight text-v3-bone rtl:leading-snug">Create account</h1>
                <p className="text-sm text-v3-mute">Join and get access to all features.</p>
            </StepIn>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <StepIn delay={0.08}>
                    <ToolField
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                </StepIn>

                <StepIn delay={0.16}>
                    <ToolField
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                </StepIn>

                <StepIn delay={0.24}>
                    <div className="flex flex-col gap-2 text-start">
                        <label htmlFor="register-password" className="text-sm font-medium text-v3-soft">Password</label>
                        <div className="relative">
                            <input
                                id="register-password"
                                {...register("password")}
                                type={showPw ? "text" : "password"}
                                placeholder="Min. 8 characters"
                                autoComplete="new-password"
                                aria-invalid={errors.password ? true : undefined}
                                aria-describedby={errors.password ? "register-password-err" : undefined}
                                className={`h-14 w-full rounded-xl border bg-v3-raise px-4 pe-14 text-base text-v3-bone caret-v3-light placeholder:text-v3-mute/70 transition-colors focus:outline-none focus:ring-2 focus:ring-v3-light/70 ${errors.password ? "border-v3-light" : "border-v3-line focus:border-v3-light/60"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(p => !p)}
                                aria-pressed={showPw}
                                className="absolute inset-y-0 end-0 flex w-14 items-center justify-center rounded-e-xl text-v3-mute transition-colors hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                            >
                                {showPw ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                                <span className="sr-only">{showPw ? "Hide password" : "Show password"}</span>
                            </button>
                        </div>
                        {errors.password && (
                            <p id="register-password-err" className="text-sm text-v3-light">{errors.password.message}</p>
                        )}
                    </div>
                </StepIn>

                {error && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl border border-v3-light/50 bg-v3-light/10 px-4 py-3 text-sm text-v3-light">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        {error}
                    </p>
                )}

                <StepIn delay={0.32}>
                    <ToolButton type="submit" loading={isPending} className="w-full">
                        {isPending ? "Creating account..." : "Create Account"}
                    </ToolButton>
                </StepIn>
            </form>

            <StepIn delay={0.4}>
                <p className="mt-8 text-center text-sm text-v3-mute">
                    Already have an account?{" "}
                    <Link
                        href={localePath(LOCALE, "/login")}
                        className="text-v3-bone underline decoration-v3-line underline-offset-4 transition-colors hover:text-v3-light hover:decoration-v3-light"
                    >
                        Sign in
                    </Link>
                </p>
            </StepIn>
        </div>
    )
}
