"use client"

// ============================================================================
// File Path: src/components/auth/user-portal-nav.tsx
// Why: The portal's side navigation, in the v3 "Light" look. Restyle only —
//      the same items, the same words, the same logout action.
//      Fixed on the way: the Persian portal's "Admin Panel" link pointed at
//      the English /admin. Every href now goes through localePath(), so the
//      Persian portal stays inside the Persian portal.
// Env / Identity: Client Component
// ============================================================================

import Link from "next/link"
import { User, ShieldCheck } from "lucide-react"
import { Rocket, GraduationCap, BookOpen, CalendarDays, CreditCard } from "lucide-react"
import { localePath, type Locale } from "@/lib/nav"
import { LogoutButton } from "./logout-button"
import { AIBugReporter } from "@/components/profile/ai-bug-reporter"

export type PortalNavItem =
    | "profile"
    | "startup-intake"
    | "mentorship"
    | "edu-files"
    | "meetings-book"
    | "meetings-summaries"
    | "meetings-agendas"
    | "meetings-tasks"
    | "finance-payment"
    | "finance-invoices"
    | "finance-history"

interface UserPortalNavProps {
    locale: Locale
    activeItem?: PortalNavItem
    isPrivileged?: boolean
}

const content = {
    en: {
        title: "User Portal",
        profile: "Profile",
        startupIntake: "Startup Intake",
        mentorship: "Mentorship",
        eduFiles: "Educational Files",
        meetings: "Meetings",
        meetingsBook: "Bookings",
        meetingsSummaries: "Summaries",
        meetingsAgendas: "Agendas",
        meetingsTasks: "Tasks",
        finance: "Finance",
        financePayment: "Payment",
        financeInvoices: "Invoices List",
        financeHistory: "History",
        admin: "Admin Panel",
        logout: "Sign Out",
    },
    fa: {
        title: "پرتال کاربر",
        profile: "پروفایل",
        startupIntake: "فرم استارتاپ",
        mentorship: "منتورشیپ",
        eduFiles: "فایل‌های آموزشی",
        meetings: "جلسه",
        meetingsBook: "رزرو",
        meetingsSummaries: "خلاصه جلسات",
        meetingsAgendas: "دستور جلسات",
        meetingsTasks: "وظایف",
        finance: "امور مالی",
        financePayment: "پرداخت",
        financeInvoices: "لیست فاکتورها",
        financeHistory: "تاریخچه",
        admin: "پنل ادمین",
        logout: "خروج از حساب",
    },
}

export function UserPortalNav({ locale, activeItem, isPrivileged }: UserPortalNavProps) {
    const t = content[locale]
    const href = (path: string) => localePath(locale, path)

    const itemClass = (active: boolean) =>
        [
            "flex min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light",
            active
                ? "border-v3-light/50 bg-v3-light/10 text-v3-light"
                : "border-transparent text-v3-mute hover:border-v3-line hover:bg-v3-raise hover:text-v3-bone",
        ].join(" ")

    const subItemClass = (active: boolean) =>
        [
            "flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light",
            active
                ? "border-v3-light/40 bg-v3-light/[0.07] text-v3-light"
                : "border-transparent text-v3-mute hover:border-v3-line hover:bg-v3-raise hover:text-v3-bone",
        ].join(" ")

    const groupLabelClass =
        "mb-2 flex items-center gap-2 px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-v3-mute"

    return (
        <nav
            aria-label={t.title}
            className="h-fit space-y-2 rounded-2xl border border-v3-line/80 bg-v3-raise p-4 lg:sticky lg:top-24"
        >
            <p className="mb-3 px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-v3-light">{t.title}</p>

            <Link href={href("/profile")} className={itemClass(activeItem === "profile")}>
                <User className="h-4 w-4" aria-hidden />
                {t.profile}
            </Link>

            <Link href={href("/profile/startup-intake")} className={itemClass(activeItem === "startup-intake")}>
                <Rocket className="h-4 w-4" aria-hidden />
                {t.startupIntake}
            </Link>

            <Link href={href("/profile/mentorship")} className={itemClass(activeItem === "mentorship")}>
                <GraduationCap className="h-4 w-4" aria-hidden />
                {t.mentorship}
            </Link>

            <Link href={href("/profile/edu-files")} className={itemClass(activeItem === "edu-files")}>
                <BookOpen className="h-4 w-4" aria-hidden />
                {t.eduFiles}
            </Link>

            <div className="pb-1 pt-3">
                <p className={groupLabelClass}>
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {t.meetings}
                </p>
                <div className="ms-3 space-y-1 border-s border-v3-line ps-2">
                    <Link href={href("/profile/meetings/book")} className={subItemClass(activeItem === "meetings-book")}>
                        {t.meetingsBook}
                    </Link>
                    <Link
                        href={href("/profile/meetings/summaries")}
                        className={subItemClass(activeItem === "meetings-summaries")}
                    >
                        {t.meetingsSummaries}
                    </Link>
                    <Link
                        href={href("/profile/meetings/agendas")}
                        className={subItemClass(activeItem === "meetings-agendas")}
                    >
                        {t.meetingsAgendas}
                    </Link>
                    <Link href={href("/profile/meetings/tasks")} className={subItemClass(activeItem === "meetings-tasks")}>
                        {t.meetingsTasks}
                    </Link>
                </div>
            </div>

            <div className="pb-1 pt-3">
                <p className={groupLabelClass}>
                    <CreditCard className="h-3.5 w-3.5" aria-hidden />
                    {t.finance}
                </p>
                <div className="ms-3 space-y-1 border-s border-v3-line ps-2">
                    <Link
                        href={href("/profile/finance/payment")}
                        className={subItemClass(activeItem === "finance-payment")}
                    >
                        {t.financePayment}
                    </Link>
                    <Link
                        href={href("/profile/finance/invoices")}
                        className={subItemClass(activeItem === "finance-invoices")}
                    >
                        {t.financeInvoices}
                    </Link>
                    <Link
                        href={href("/profile/finance/history")}
                        className={subItemClass(activeItem === "finance-history")}
                    >
                        {t.financeHistory}
                    </Link>
                </div>
            </div>

            {isPrivileged && (
                <Link href={href("/admin")} className={itemClass(false)}>
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    {t.admin}
                </Link>
            )}

            <LogoutButton className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-start text-sm font-medium text-v3-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-line hover:bg-v3-raise hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light">
                {t.logout}
            </LogoutButton>

            <AIBugReporter />
        </nav>
    )
}
