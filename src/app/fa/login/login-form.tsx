"use client"

// ============================================================================
// File Path: src/app/fa/login/login-form.tsx
// Why: The sign-in form in v3 "Light" — the kit's labelled fields and button,
//      a calm staggered reveal. Restyle only: the schema, the NextAuth call,
//      the error handling and the redirect are exactly as they were.
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CircleAlert, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { StepIn, ToolButton, ToolField } from "@/components/v3/tool-kit"
import { localePath } from "@/lib/nav"

const LOCALE = "fa" as const

const formSchema = z.object({
    email: z.string().email("یک ایمیل معتبر وارد کنید."),
    password: z.string().min(1, "رمز عبور را وارد کنید."),
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
                setError("ایمیل یا رمز عبور درست نیست. دوباره تلاش کنید.")
            } else {
                router.push("/fa/profile")
                router.refresh()
            }
        } catch {
            setError("خطا در ارتباط. دوباره تلاش کنید.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm">
            {/* Title */}
            <StepIn className="mb-8 flex flex-col gap-2">
                <h1 className="font-v3-display text-3xl font-light leading-tight text-v3-bone rtl:leading-snug">دوباره خوش آمدید</h1>
                <p className="text-sm text-v3-mute">برای ادامه وارد حساب کاربری‌تان شوید.</p>
            </StepIn>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Email */}
                <StepIn delay={0.08}>
                    <ToolField
                        label="ایمیل"
                        type="email"
                        dir="ltr"
                        autoComplete="email"
                        autoFocus
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                </StepIn>

                {/* Password */}
                <StepIn delay={0.16}>
                    <div className="flex flex-col gap-2 text-start">
                        <label htmlFor="login-password" className="text-sm font-medium text-v3-soft">رمز عبور</label>
                        <div className="relative">
                            <input
                                id="login-password"
                                {...register("password")}
                                type={showPw ? "text" : "password"}
                                dir="ltr"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                aria-invalid={errors.password ? true : undefined}
                                aria-describedby={errors.password ? "login-password-err" : undefined}
                                className={`h-14 w-full rounded-xl border bg-v3-raise px-4 pe-14 text-base text-v3-bone caret-v3-light placeholder:text-v3-mute/70 transition-colors focus:outline-none focus:ring-2 focus:ring-v3-light/70 ${errors.password ? "border-v3-light" : "border-v3-line focus:border-v3-light/60"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(p => !p)}
                                aria-pressed={showPw}
                                className="absolute inset-y-0 end-0 flex w-14 items-center justify-center rounded-e-xl text-v3-mute transition-colors hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                            >
                                {showPw ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                                <span className="sr-only">{showPw ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}</span>
                            </button>
                        </div>
                        {errors.password && (
                            <p id="login-password-err" className="text-sm text-v3-light">{errors.password.message}</p>
                        )}
                    </div>
                </StepIn>

                {/* Error */}
                {error && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl border border-v3-light/50 bg-v3-light/10 px-4 py-3 text-sm text-v3-light">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        {error}
                    </p>
                )}

                {/* Submit */}
                <StepIn delay={0.24}>
                    <ToolButton type="submit" loading={isLoading} className="w-full">
                        {isLoading ? "در حال ورود…" : "ورود"}
                    </ToolButton>
                </StepIn>
            </form>

            <StepIn delay={0.32}>
                <p className="mt-8 text-center text-sm text-v3-mute">
                    حساب کاربری ندارید؟{" "}
                    <Link
                        href={localePath(LOCALE, "/register")}
                        className="text-v3-bone underline decoration-v3-line underline-offset-4 transition-colors hover:text-v3-light hover:decoration-v3-light"
                    >
                        ایجاد حساب
                    </Link>
                </p>
            </StepIn>
        </div>
    )
}
