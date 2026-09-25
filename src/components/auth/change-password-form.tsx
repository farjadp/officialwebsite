"use client"

// ============================================================================
// File Path: src/components/auth/change-password-form.tsx
// Why: The portal's change-password form in the v3 "Light" look: labelled
//      fields on the raised ground, a light focus ring, inline errors tied
//      to their input, and 44px+ targets. Restyle only — the schema, the
//      validation messages and the changePassword() call are untouched.
// Env / Identity: Client Component
// ============================================================================

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, KeyRound } from "lucide-react"

import { changePassword } from "@/app/actions/authActions"

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
})

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

const content = {
    en: {
        oldPassword: "Current Password",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        save: "Change Password",
        success: "Password updated successfully.",
        error: "Failed to update password.",
        passwordsNotMatch: "Passwords do not match.",
        oldRequired: "Old password is required.",
        newLength: "New password must be at least 8 characters.",
        confirmRequired: "Please confirm your new password."
    },
    fa: {
        oldPassword: "رمز عبور فعلی",
        newPassword: "رمز عبور جدید",
        confirmPassword: "تکرار رمز عبور جدید",
        save: "تغییر رمز عبور",
        success: "رمز عبور با موفقیت بروزرسانی شد.",
        error: "تغییر رمز عبور با خطا مواجه شد.",
        passwordsNotMatch: "رمزهای عبور جدید با هم مطابقت ندارند.",
        oldRequired: "وارد کردن رمز عبور فعلی الزامی است.",
        newLength: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد.",
        confirmRequired: "لطفاً رمز عبور جدید را تکرار کنید."
    }
}

interface ChangePasswordFormProps {
    locale: "en" | "fa"
    userEmail: string
}

const INPUT_BASE =
    "h-14 w-full rounded-xl border bg-v3-raise px-4 text-base text-v3-bone placeholder:text-v3-mute/70 transition-colors focus:outline-none focus:ring-2 focus:ring-v3-light/70"

export function ChangePasswordForm({ locale, userEmail }: ChangePasswordFormProps) {
    const t = content[locale]
    const [isPending, setIsPending] = useState(false)
    const ids = useId()

    // Override zod error messages for Persian if needed
    const schema = z.object({
        oldPassword: z.string().min(1, t.oldRequired),
        newPassword: z.string().min(8, t.newLength),
        confirmPassword: z.string().min(1, t.confirmRequired),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t.passwordsNotMatch,
        path: ["confirmPassword"],
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: ChangePasswordFormValues) => {
        setIsPending(true)
        const result = await changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword }, userEmail)
        setIsPending(false)

        if (result.success) {
            toast.success(t.success)
            reset()
        } else {
            toast.error(result.error || t.error)
        }
    }

    const fields = [
        { key: "oldPassword", label: t.oldPassword, error: errors.oldPassword?.message, autoComplete: "current-password" },
        { key: "newPassword", label: t.newPassword, error: errors.newPassword?.message, autoComplete: "new-password" },
        { key: "confirmPassword", label: t.confirmPassword, error: errors.confirmPassword?.message, autoComplete: "new-password" },
    ] as const

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-5">
                {fields.map(({ key, label, error, autoComplete }) => {
                    const inputId = `${ids}-${key}`
                    const errId = `${inputId}-err`
                    return (
                        <div key={key} className="flex flex-col gap-2 text-start">
                            <label htmlFor={inputId} className="text-sm font-medium text-v3-soft">
                                {label}
                            </label>
                            <input
                                id={inputId}
                                type="password"
                                autoComplete={autoComplete}
                                {...register(key)}
                                aria-invalid={error ? true : undefined}
                                aria-describedby={error ? errId : undefined}
                                className={`${INPUT_BASE} ${error ? "border-v3-light" : "border-v3-line focus:border-v3-light/60"}`}
                                dir="ltr"
                            />
                            {error && (
                                <p id={errId} className="text-sm text-v3-light">
                                    {error}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-end pt-1">
                <button
                    type="submit"
                    disabled={isPending}
                    className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-v3-line disabled:text-v3-mute"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
                    {t.save}
                </button>
            </div>
        </form>
    )
}
