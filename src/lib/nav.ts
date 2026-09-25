// ============================================================================
// File Path: src/lib/nav.ts
// Why: One source of truth for the public navigation in both locales.
//
// The header and footer each used to hardcode English hrefs and English
// labels, so every link in the Persian site pointed back into the English
// site. Labels and hrefs now come from here, which also records WHICH pages
// actually have a Persian translation — the Persian nav omits the ones that
// do not rather than linking a visitor to a 404.
//
// When a Persian page is added, flip its `fa` flag to true. Nothing else
// needs to change: the nav, the footer and the language switcher all read
// this table.
// ============================================================================

export type Locale = "en" | "fa"

/** Public routes, written without a locale prefix. */
export const ROUTES = {
    home: "/",
    services: "/services",
    portfolio: "/portfolio",
    startups: "/startups",
    stats: "/stats",
    blog: "/blog",
    tools: "/tools",
    about: "/about",
    resume: "/resume",
    work: "/work",
    booking: "/booking",
    contact: "/contact",
    login: "/login",
    register: "/register",
    profile: "/profile",
    privacy: "/privacy",
    terms: "/terms",
    bookClub: "/book-club",
    lab: "/lab",
    labPerks: "/lab/perks",
} as const

type RouteKey = keyof typeof ROUTES

/**
 * Which locales each route is actually published in.
 * A route missing from this map is assumed to exist in both.
 */
const AVAILABILITY: Partial<Record<RouteKey, { en: boolean; fa: boolean }>> = {
    // No Persian blog: the Post model has no locale, so /fa/blog was deleted
    // on 8 Sep and 301s to /blog. Flip this only once real Persian posts exist.
    blog: { en: true, fa: false },
    // Persian-only: this has never had an English counterpart.
    bookClub: { en: false, fa: true },
    // The Lab and its perk-partner call are published in both languages.
}

export function hasRoute(key: RouteKey, locale: Locale): boolean {
    return AVAILABILITY[key]?.[locale] ?? true
}

/** Prefix a locale-less path for the given locale. `/about` → `/fa/about`. */
export function localePath(locale: Locale, path: string): string {
    if (locale !== "fa") return path
    return path === "/" ? "/fa" : `/fa${path}`
}

/** Strip the `/fa` segment off a pathname. `/fa/about` → `/about`. */
export function stripLocale(pathname: string): string {
    if (pathname === "/fa") return "/"
    if (pathname.startsWith("/fa/")) return pathname.slice(3)
    return pathname
}

/**
 * Where the language toggle should send someone standing on `pathname`.
 *
 * Staying on the same page across the switch is the useful behaviour, but
 * only when the counterpart exists — otherwise the toggle would hand the
 * visitor a 404. Unknown paths (blog posts, portfolio slugs, tool pages)
 * fall back to the target locale's home page.
 */
export function counterpartPath(pathname: string, target: Locale): string {
    const bare = stripLocale(pathname)
    const entry = (Object.entries(ROUTES) as [RouteKey, string][]).find(
        ([, path]) => path === bare
    )
    if (entry && hasRoute(entry[0], target)) return localePath(target, bare)
    return localePath(target, "/")
}

type NavLabels = {
    services: string
    proofOfWork: string
    portfolio: string
    portfolioNote: string
    startups: string
    startupsNote: string
    stats: string
    statsNote: string
    blog: string
    tools: string
    about: string
    resume: string
    bookClub: string
    lab: string
    labProgramme: string
    labProgrammeNote: string
    labPerks: string
    labPerksNote: string
    portal: string
    portalMobile: string
    login: string
    loginNote: string
    register: string
    registerNote: string
    profile: string
    profileNote: string
    cta: string
    ctaMobile: string
    tagline: string
    brand: string
    menu: string
    switchTo: string
    switchLabel: string
}

export const NAV: Record<Locale, NavLabels> = {
    en: {
        services: "Services",
        proofOfWork: "Proof of Work",
        portfolio: "Business Ventures",
        portfolioNote: "Active portfolio companies",
        startups: "Mentorship Portfolio",
        startupsNote: "Startups I've advised",
        stats: "Stats & Reality",
        statsNote: "By the numbers",
        blog: "Essays",
        tools: "Tools",
        about: "About",
        resume: "Resume",
        bookClub: "Book Club",
        lab: "Lab",
        labProgramme: "The Programme",
        labProgrammeNote: "Eight weeks, five teams",
        labPerks: "Perk Partners",
        labPerksNote: "Offer a perk to the teams",
        portal: "Portal",
        portalMobile: "User Portal",
        login: "Login",
        loginNote: "Access your account",
        register: "Register",
        registerNote: "Create a new account",
        profile: "Profile",
        profileNote: "Manage account & avatar",
        cta: "Book a call",
        ctaMobile: "Book a call",
        tagline: "AI · Mentorship · Coaching",
        brand: "Farjad",
        menu: "Toggle menu",
        switchTo: "فارسی",
        switchLabel: "Persian",
    },
    fa: {
        services: "خدمات",
        proofOfWork: "کارنامه",
        portfolio: "کسب‌وکارها",
        portfolioNote: "شرکت‌های فعال پورتفولیو",
        startups: "استارتاپ‌های منتورشده",
        startupsNote: "استارتاپ‌هایی که مشاورشان بوده‌ام",
        stats: "آمار و واقعیت",
        statsNote: "به زبان عدد",
        blog: "یادداشت‌ها",
        tools: "ابزارها",
        about: "درباره من",
        resume: "رزومه",
        bookClub: "باشگاه کتاب",
        lab: "منتورشیپ",
        labProgramme: "دوره‌ی منتورشیپ",
        labProgrammeNote: "۸ هفته، ۵ تیم",
        labPerks: "شرکای Perk",
        labPerksNote: "ارائه‌ی Perk به تیم‌ها",
        portal: "پرتال",
        portalMobile: "پرتال کاربر",
        login: "ورود",
        loginNote: "دسترسی به حساب کاربری",
        register: "ثبت‌نام",
        registerNote: "ایجاد حساب کاربری جدید",
        profile: "پروفایل",
        profileNote: "مدیریت حساب و آواتار",
        cta: "رزرو جلسه",
        ctaMobile: "رزرو جلسه",
        tagline: "هوش مصنوعی · منتورشیپ · کوچینگ",
        brand: "فرجاد",
        menu: "باز و بسته کردن منو",
        switchTo: "English",
        switchLabel: "English",
    },
}

type FooterLabels = {
    manifesto: string
    available: string
    newsletterTitle: string
    newsletterBody: string
    newsletterPlaceholder: string
    subscribe: string
    colLibrary: string
    colPractice: string
    colResources: string
    colConnect: string
    allEssays: string
    work: string
    resume: string
    startHere: string
    advisory: string
    portfolio: string
    startups: string
    stats: string
    aboutFarjad: string
    contact: string
    tools: string
    booking: string
    bookClub: string
    lab: string
    labPerks: string
    privacy: string
    terms: string
    location: string
    follow: string
    localTime: string
}

export const FOOTER: Record<Locale, FooterLabels> = {
    en: {
        manifesto:
            "A personal library for founders and immigrants who are tired of the noise. We focus on clarity, systems, and the engineering of a real business.",
        available: "Available for Advisory",
        newsletterTitle: "Join the Inner Circle",
        newsletterBody:
            "One email a week. Mental models, essays, and honest notes. No spam.",
        newsletterPlaceholder: "founder@email.com",
        subscribe: "Subscribe",
        colLibrary: "The Library",
        colPractice: "The Practice",
        colResources: "Resources",
        colConnect: "Connect",
        allEssays: "All Essays",
        work: "Work & Ventures",
        resume: "Resume",
        startHere: "Start Here",
        advisory: "Advisory Services",
        portfolio: "Business Ventures",
        startups: "Mentored Startups",
        stats: "Stats & Reality",
        aboutFarjad: "About Farjad",
        contact: "Contact",
        tools: "Founder Tools",
        booking: "Book a Call",
        bookClub: "Book Club",
        lab: "Lab",
        labPerks: "Perk Partners",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        location: "Newmarket, Ontario, Canada",
        follow: "Follow the work",
        localTime: "Toronto time",
    },
    fa: {
        manifesto:
            "کتابخانه‌ای شخصی برای بنیان‌گذاران و مهاجرانی که از شلوغی خسته‌اند. تمرکز ما بر شفافیت، سیستم‌سازی و مهندسی یک کسب‌وکار واقعی است.",
        available: "پذیرای همکاری مشاوره‌ای",
        newsletterTitle: "به حلقه‌ی داخلی بپیوندید",
        newsletterBody:
            "هفته‌ای یک ایمیل. مدل‌های ذهنی، یادداشت‌ها و نکته‌های بی‌تعارف. بدون هرزنامه.",
        newsletterPlaceholder: "founder@email.com",
        subscribe: "عضویت",
        colLibrary: "کتابخانه",
        colPractice: "کار حرفه‌ای",
        colResources: "منابع",
        colConnect: "ارتباط",
        allEssays: "همه‌ی یادداشت‌ها",
        work: "کارها و کسب‌وکارها",
        resume: "رزومه",
        startHere: "از اینجا شروع کنید",
        advisory: "خدمات مشاوره",
        portfolio: "کسب‌وکارها",
        startups: "استارتاپ‌های منتورشده",
        stats: "آمار و واقعیت",
        aboutFarjad: "درباره‌ی فرجاد",
        contact: "تماس",
        tools: "ابزارهای بنیان‌گذار",
        booking: "رزرو جلسه",
        bookClub: "باشگاه کتاب",
        lab: "منتورشیپ",
        labPerks: "شرکای Perk",
        privacy: "سیاست حریم خصوصی",
        terms: "شرایط استفاده",
        location: "نیومارکت، انتاریو، کانادا",
        follow: "دنبال کردن کارها",
        localTime: "ساعت تورنتو",
    },
}
