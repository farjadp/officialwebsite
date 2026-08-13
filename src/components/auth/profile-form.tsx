"use client"

import { useEffect, useRef, useState, useActionState } from "react"
import Image from "next/image"
import { Camera, Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { updateProfile, type ProfileFormState } from "@/app/actions/user"

interface ProfileFormProps {
    locale?: "en" | "fa"
    initialUser: {
        id: string
        name: string | null
        email: string
        bio: string | null
        phone: string | null
        image: string | null
        role: string
    }
}

const copy = {
    en: {
        profilePhoto: "Profile Photo",
        photoHint: "JPG, PNG, or WebP. Max 2MB.",
        upload: "Upload photo",
        fullName: "Full Name",
        namePlaceholder: "Your name",
        email: "Email Address",
        emailHint: "Email cannot be changed here.",
        bio: "Bio",
        bioPlaceholder: "A short bio...",
        bioHint: "Maximum 500 characters.",
        phone: "Phone Number",
        phonePlaceholder: "+1 416 000 0000",
        save: "Save Changes",
        saving: "Saving...",
        success: "Profile updated successfully",
        selectImageError: "Please select an image file",
        sizeError: "Avatar must be smaller than 2MB",
    },
    fa: {
        profilePhoto: "عکس پروفایل",
        photoHint: "JPG، PNG یا WebP. حداکثر ۲ مگابایت.",
        upload: "آپلود عکس",
        fullName: "نام کامل",
        namePlaceholder: "نام شما",
        email: "آدرس ایمیل",
        emailHint: "ایمیل اینجا قابل تغییر نیست.",
        bio: "بیو",
        bioPlaceholder: "یک بیوی کوتاه...",
        bioHint: "حداکثر ۵۰۰ کاراکتر.",
        phone: "شماره تماس",
        phonePlaceholder: "+98 912 000 0000",
        save: "ذخیره تغییرات",
        saving: "در حال ذخیره...",
        success: "پروفایل با موفقیت به‌روزرسانی شد",
        selectImageError: "لطفاً یک فایل تصویری انتخاب کنید",
        sizeError: "عکس پروفایل باید کمتر از ۲ مگابایت باشد",
    },
}

export function ProfileForm({ initialUser, locale = "en" }: ProfileFormProps) {
    const t = copy[locale]
    const isRtl = locale === "fa"

    const [state, formAction, isPending] = useActionState<ProfileFormState | null, FormData>(updateProfile, null)
    const [preview, setPreview] = useState<string | null>(initialUser.image)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!state) return
        if (state.success) {
            toast.success(t.success)
            if (state.user.image) {
                setPreview(state.user.image)
            }
        } else {
            toast.error(state.error)
        }
    }, [state, t.success])

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error(t.selectImageError)
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error(t.sizeError)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }

    const initials = (initialUser.name || initialUser.email || "?")
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()

    return (
        <form action={formAction} className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
            {/* Avatar */}
            <div className={`flex items-center gap-5 ${isRtl ? "flex-row-reverse" : ""}`}>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 ring-2 ring-white/10 transition-all hover:ring-indigo-500/50 focus-visible:outline-none focus-visible:ring-indigo-500"
                >
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Avatar preview"
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                            {initials}
                        </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera className="h-5 w-5 text-white" />
                    </span>
                </button>
                <div className={`flex-1 ${isRtl ? "text-right" : ""}`}>
                    <p className="text-sm font-medium text-white">{t.profilePhoto}</p>
                    <p className="text-xs text-slate-500">{t.photoHint}</p>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-iran-firouzeh hover:text-iran-firouzeh"
                    >
                        <Camera className="h-3.5 w-3.5" /> {t.upload}
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Name */}
            <div>
                <label htmlFor="name" className={`block text-xs font-medium text-slate-400 tracking-wide uppercase mb-1.5 ${isRtl ? "text-right" : ""}`}>
                    {t.fullName}
                </label>
                <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 ${isRtl ? "right-3.5" : "left-3.5"}`} />
                    <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={initialUser.name || ""}
                        required
                        minLength={2}
                        placeholder={t.namePlaceholder}
                        className={`w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06] ${isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4"}`}
                    />
                </div>
            </div>

            {/* Email (read-only) */}
            <div>
                <label htmlFor="email" className={`block text-xs font-medium text-slate-400 tracking-wide uppercase mb-1.5 ${isRtl ? "text-right" : ""}`}>
                    {t.email}
                </label>
                <input
                    id="email"
                    type="email"
                    value={initialUser.email}
                    disabled
                    className="w-full bg-white/[0.02] border border-white/8 rounded-xl text-slate-500 text-sm px-4 py-3 cursor-not-allowed"
                />
                <p className={`text-xs text-slate-600 mt-1.5 ${isRtl ? "text-right" : ""}`}>{t.emailHint}</p>
            </div>

            {/* Bio */}
            <div>
                <label htmlFor="bio" className={`block text-xs font-medium text-slate-400 tracking-wide uppercase mb-1.5 ${isRtl ? "text-right" : ""}`}>
                    {t.bio}
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={initialUser.bio || ""}
                    rows={3}
                    maxLength={500}
                    placeholder={t.bioPlaceholder}
                    className={`w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm px-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06] resize-none ${isRtl ? "text-right" : ""}`}
                />
                <p className={`text-xs text-slate-600 mt-1.5 ${isRtl ? "text-right" : ""}`}>{t.bioHint}</p>
            </div>

            {/* Phone */}
            <div>
                <label htmlFor="phone" className={`block text-xs font-medium text-slate-400 tracking-wide uppercase mb-1.5 ${isRtl ? "text-right" : ""}`}>
                    {t.phone}
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={initialUser.phone || ""}
                    maxLength={30}
                    placeholder={t.phonePlaceholder}
                    className={`w-full bg-white/[0.04] border border-white/8 rounded-xl text-white placeholder:text-slate-700 text-sm px-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all hover:bg-white/[0.06] ${isRtl ? "text-right" : ""}`}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-iran-lajvard disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.saving}
                    </>
                ) : (
                    t.save
                )}
            </button>
        </form>
    )
}
