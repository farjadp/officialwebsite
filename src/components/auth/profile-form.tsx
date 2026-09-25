"use client"

// ============================================================================
// File Path: src/components/auth/profile-form.tsx
// Why: The portal's profile form in the v3 "Light" look: visible labels, a
//      raised field ground, a light focus ring and 44px+ targets. Email,
//      phone and other Latin values keep dir="ltr" so they read correctly
//      on the Persian page. Restyle only — the server action, the field
//      names, the validation attributes and the avatar rules are untouched.
// Env / Identity: Client Component
// ============================================================================

import { useEffect, useRef, useState, useActionState } from "react"
import Image from "next/image"
import { Camera, Loader2 } from "lucide-react"
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

const FIELD =
    "w-full rounded-xl border border-v3-line bg-v3-raise px-4 text-base text-v3-bone placeholder:text-v3-mute/70 transition-colors focus:border-v3-light/60 focus:outline-none focus:ring-2 focus:ring-v3-light/70"
const LABEL = "text-sm font-medium text-v3-soft"
const HINT = "text-xs text-v3-mute"

export function ProfileForm({ initialUser, locale = "en" }: ProfileFormProps) {
    const t = copy[locale]

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
        <form action={formAction} className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label={t.upload}
                    className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-v3-line bg-v3-ink transition-colors hover:border-v3-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
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
                        <span className="flex h-full w-full items-center justify-center font-v3-display text-2xl text-v3-light">
                            {initials}
                        </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-v3-ink/70 opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera className="h-5 w-5 text-v3-light" aria-hidden />
                    </span>
                </button>
                <div className="flex flex-1 flex-col gap-1 text-start">
                    <p className="text-sm font-medium text-v3-bone">{t.profilePhoto}</p>
                    <p className={HINT}>{t.photoHint}</p>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-v3-light transition-colors hover:text-v3-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                    >
                        <Camera className="h-4 w-4" aria-hidden /> {t.upload}
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
            <div className="flex flex-col gap-2 text-start">
                <label htmlFor="name" className={LABEL}>
                    {t.fullName}
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={initialUser.name || ""}
                    required
                    minLength={2}
                    placeholder={t.namePlaceholder}
                    className={`${FIELD} h-14`}
                />
            </div>

            {/* Email (read-only) */}
            <div className="flex flex-col gap-2 text-start">
                <label htmlFor="email" className={LABEL}>
                    {t.email}
                </label>
                <input
                    id="email"
                    type="email"
                    value={initialUser.email}
                    disabled
                    dir="ltr"
                    className="h-14 w-full cursor-not-allowed rounded-xl border border-v3-line bg-v3-ink px-4 text-base text-v3-mute"
                />
                <p className={HINT}>{t.emailHint}</p>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2 text-start">
                <label htmlFor="bio" className={LABEL}>
                    {t.bio}
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    defaultValue={initialUser.bio || ""}
                    rows={3}
                    maxLength={500}
                    placeholder={t.bioPlaceholder}
                    className={`${FIELD} resize-none py-3 leading-relaxed`}
                />
                <p className={HINT}>{t.bioHint}</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2 text-start">
                <label htmlFor="phone" className={LABEL}>
                    {t.phone}
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={initialUser.phone || ""}
                    maxLength={30}
                    placeholder={t.phonePlaceholder}
                    dir="ltr"
                    className={`${FIELD} h-14`}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-v3-line disabled:text-v3-mute"
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        {t.saving}
                    </>
                ) : (
                    t.save
                )}
            </button>
        </form>
    )
}
