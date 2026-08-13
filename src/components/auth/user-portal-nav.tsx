"use client"

// ============================================================================
// User Portal Nav — sidebar menu used inside authenticated portal pages
// ============================================================================

import Link from "next/link"
import { User, ShieldCheck } from "lucide-react"
import { LogoutButton } from "./logout-button"
import { AIBugReporter } from "@/components/profile/ai-bug-reporter"

interface UserPortalNavProps {
    locale: "en" | "fa"
    activeItem?: "profile" | "startup-intake" | "mentorship" | "edu-files" | "meetings-book" | "meetings-summaries" | "meetings-agendas" | "meetings-tasks"
    isPrivileged?: boolean
}

import { Rocket, GraduationCap, BookOpen, CalendarDays, Lock } from "lucide-react"

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
        admin: "پنل ادمین",
        logout: "خروج از حساب",
    },
}

export function UserPortalNav({ locale, activeItem, isPrivileged }: UserPortalNavProps) {
    const t = content[locale]

    const itemClass = (active: boolean) =>
        [
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            active
                ? "bg-iran-lajvard/20 text-iran-firouzeh border border-iran-lajvard/40"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent",
        ].join(" ")

    const subItemClass = (active: boolean) =>
        [
            "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
            active
                ? "bg-iran-lajvard/10 text-iran-firouzeh border border-iran-lajvard/20"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent",
        ].join(" ")

    return (
        <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 space-y-2 h-fit">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">
                {t.title}
            </p>

            <Link
                href={locale === "en" ? "/profile" : "/fa/profile"}
                className={itemClass(activeItem === "profile")}
            >
                <User className="w-4 h-4" />
                {t.profile}
            </Link>

            <Link
                href={locale === "en" ? "/profile/startup-intake" : "/fa/profile/startup-intake"}
                className={itemClass(activeItem === "startup-intake")}
            >
                <Rocket className="w-4 h-4" />
                {t.startupIntake}
            </Link>

            <Link
                href={locale === "en" ? "/profile/mentorship" : "/fa/profile/mentorship"}
                className={itemClass(activeItem === "mentorship")}
            >
                <GraduationCap className="w-4 h-4" />
                {t.mentorship}
            </Link>

            <Link
                href={locale === "en" ? "/profile/edu-files" : "/fa/profile/edu-files"}
                className={itemClass(activeItem === "edu-files")}
            >
                <BookOpen className="w-4 h-4" />
                {t.eduFiles}
            </Link>

            <div className="pt-3 pb-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {t.meetings}
                </p>
                <div className="space-y-1 pl-2 border-l border-white/10 ml-3">
                    <Link
                        href={locale === "en" ? "/profile/meetings/book" : "/fa/profile/meetings/book"}
                        className={subItemClass(activeItem === "meetings-book")}
                    >
                        {t.meetingsBook}
                    </Link>
                    <Link
                        href={locale === "en" ? "/profile/meetings/summaries" : "/fa/profile/meetings/summaries"}
                        className={subItemClass(activeItem === "meetings-summaries")}
                    >
                        {t.meetingsSummaries}
                    </Link>
                    <Link
                        href={locale === "en" ? "/profile/meetings/agendas" : "/fa/profile/meetings/agendas"}
                        className={subItemClass(activeItem === "meetings-agendas")}
                    >
                        {t.meetingsAgendas}
                    </Link>
                    <Link
                        href={locale === "en" ? "/profile/meetings/tasks" : "/fa/profile/meetings/tasks"}
                        className={subItemClass(activeItem === "meetings-tasks")}
                    >
                        {t.meetingsTasks}
                    </Link>
                </div>
            </div>

            {isPrivileged && (
                <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all border border-transparent"
                >
                    <ShieldCheck className="w-4 h-4" />
                    {t.admin}
                </Link>
            )}

            <LogoutButton className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left">
                {t.logout}
            </LogoutButton>

            <AIBugReporter />
        </div>
    )
}
