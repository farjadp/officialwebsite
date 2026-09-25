// ============================================================================
// File Path: src/components/v3/pages/portal-profile.tsx
// Why: /profile and /fa/profile in the v3 "Light" look, one component for
//      both locales so they cannot drift apart. Every word is the pages'
//      own, carried over verbatim; only the look changed. The session
//      check, the Prisma query and both forms' actions stay in the pages
//      and in the form components.
// Env / Identity: React Server Component
// ============================================================================

import { format } from "date-fns"
import Link from "next/link"
import { Calendar, Mail, ShieldCheck, User } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { ProfileForm } from "@/components/auth/profile-form"
import { ChangePasswordForm } from "@/components/auth/change-password-form"
import { PortalPanel, PortalShell } from "./portal-shell"

type Copy = {
  kicker: string
  title: string
  lead: string
  admin: string
  editProfile: string
  changePassword: string
  accountDetails: string
  email: string
  role: string
  memberSince: string
  unknown: string
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Account",
    title: "Your Portal",
    lead: "Manage your profile and account details.",
    admin: "Admin Panel",
    editProfile: "Edit Profile",
    changePassword: "Change Password",
    accountDetails: "Account Details",
    email: "Email Address",
    role: "Role",
    memberSince: "Member Since",
    unknown: "Unknown",
  },
  fa: {
    kicker: "حساب کاربری",
    title: "پرتال شما",
    lead: "پروفایل و جزئیات حسابتان را مدیریت کنید.",
    admin: "پنل ادمین",
    editProfile: "ویرایش پروفایل",
    changePassword: "تغییر رمز عبور",
    accountDetails: "جزئیات حساب",
    email: "آدرس ایمیل",
    role: "نقش",
    memberSince: "عضو از",
    unknown: "Unknown",
  },
}

const ROLE_CHIP: Record<string, string> = {
  OWNER: "border-v3-light/50 bg-v3-light/10 text-v3-light",
  EDITOR: "border-v3-line bg-v3-raise text-v3-soft",
  USER: "border-v3-line text-v3-mute",
}

export type PortalProfileUser = {
  id: string
  name: string | null
  email: string
  bio: string | null
  phone: string | null
  image: string | null
  role: string
  createdAt: Date | null
}

export function PortalProfile({
  locale,
  user,
  isPrivileged,
}: {
  locale: Locale
  user: PortalProfileUser
  isPrivileged: boolean
}) {
  const t = COPY[locale]
  const roleChip = ROLE_CHIP[user.role] ?? ROLE_CHIP.USER

  const rows = [
    { icon: Mail, label: t.email, value: <span dir="ltr" className="break-all text-v3-bone">{user.email}</span> },
    {
      icon: User,
      label: t.role,
      value: (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${roleChip}`}>
          {user.role}
        </span>
      ),
    },
    {
      icon: Calendar,
      label: t.memberSince,
      value: (
        <span className="text-v3-bone">
          {user.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : t.unknown}
        </span>
      ),
    },
  ]

  return (
    <PortalShell
      locale={locale}
      active="profile"
      isPrivileged={isPrivileged}
      kicker={t.kicker}
      title={t.title}
      lead={t.lead}
      actions={
        isPrivileged ? (
          <Link
            href={localePath(locale, "/admin")}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-v3-bone/60 px-6 text-sm font-medium text-v3-bone transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-light hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {t.admin}
          </Link>
        ) : undefined
      }
    >
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <PortalPanel title={t.editProfile}>
            <ProfileForm
              locale={locale}
              initialUser={{
                id: user.id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                phone: user.phone,
                image: user.image,
                role: user.role,
              }}
            />
          </PortalPanel>

          <PortalPanel title={t.changePassword} delay={0.08}>
            <ChangePasswordForm locale={locale} userEmail={user.email} />
          </PortalPanel>
        </div>

        <PortalPanel title={t.accountDetails} delay={0.16}>
          <ul className="flex flex-col">
            {rows.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4 border-b border-v3-line/60 py-4 first:pt-0 last:border-b-0 last:pb-0">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-v3-line bg-v3-ink">
                  <Icon className="h-4 w-4 text-v3-light" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col gap-1 text-start">
                  <span className="text-xs text-v3-mute">{label}</span>
                  <span className="text-sm font-medium">{value}</span>
                </span>
              </li>
            ))}
          </ul>
        </PortalPanel>
      </div>
    </PortalShell>
  )
}
