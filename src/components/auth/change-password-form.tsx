"use client"

import { useState } from "react"
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

export function ChangePasswordForm({ locale, userEmail }: ChangePasswordFormProps) {
    const t = content[locale]
    const [isPending, setIsPending] = useState(false)

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir={locale === "fa" ? "rtl" : "ltr"}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.oldPassword}</label>
                    <input
                        type="password"
                        {...register("oldPassword")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-iran-lajvard/50 focus:border-iran-lajvard transition-all"
                        dir="ltr"
                    />
                    {errors.oldPassword && <p className="text-red-400 text-xs mt-1.5">{errors.oldPassword.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.newPassword}</label>
                    <input
                        type="password"
                        {...register("newPassword")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-iran-lajvard/50 focus:border-iran-lajvard transition-all"
                        dir="ltr"
                    />
                    {errors.newPassword && <p className="text-red-400 text-xs mt-1.5">{errors.newPassword.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.confirmPassword}</label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-iran-lajvard/50 focus:border-iran-lajvard transition-all"
                        dir="ltr"
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-iran-lajvard hover:bg-iran-lajvard/80 text-white px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    {t.save}
                </button>
            </div>
        </form>
    )
}
