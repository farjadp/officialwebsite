// ============================================================================
// File Path: src/components/layout/footer.tsx
// Version: 4.0.0 — 2026-09-25
// Why: The site footer in the v3 "Light" language. It ends every page the
//      way the portrait begins the home: warm dark, one light. A giant
//      wordmark rises into view with light passing across it.
//
//      The old footer had a newsletter form with no action and no endpoint
//      behind it — typing an email did nothing. It is replaced here by the
//      channels that do exist, until a real, consented signup is built.
//
// Copy and hrefs come from @/lib/nav, so the Persian footer is Persian.
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Instagram, Linkedin, Send, Youtube } from "lucide-react"
import { FOOTER, NAV, ROUTES, counterpartPath, hasRoute, localePath, type Locale } from "@/lib/nav"
import { FooterWordmark, TorontoTime } from "./footer-motion"

const SOCIALS = [
    { href: "https://t.me/Heros_Journey", label: "Telegram · Hero's Journey", Icon: Send },
    { href: "https://t.me/FarjadTalks", label: "Telegram · Farjad Talks", Icon: Send },
    { href: "https://instagram.com/FarjadTalks", label: "Instagram", Icon: Instagram },
    { href: "https://youtube.com/@FarjadTalks", label: "YouTube", Icon: Youtube },
    { href: "https://www.linkedin.com/in/farjadpourmohammad/", label: "LinkedIn", Icon: Linkedin },
]

function FooterLink({ href, children, strong = false }: { href: string; children: React.ReactNode; strong?: boolean }) {
    return (
        <li>
            <Link
                href={href}
                className={`group relative inline-flex min-h-9 items-center transition-colors duration-300 hover:text-v3-bone ${
                    strong ? "text-v3-bone" : "text-v3-soft"
                }`}
            >
                {children}
                <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-v3-light transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                />
            </Link>
        </li>
    )
}

export function Footer({ locale = "en" }: { locale?: Locale }) {
    const t = FOOTER[locale]
    const nav = NAV[locale]
    const href = (path: string) => localePath(locale, path)
    const other: Locale = locale === "fa" ? "en" : "fa"
    const Arrow = locale === "fa" ? ArrowLeft : ArrowRight

    return (
        <footer className="relative isolate overflow-hidden border-t border-v3-line/70 bg-v3-ink font-v3-body text-v3-bone">
            <div className="mx-auto max-w-[1600px] px-5 pt-20 md:px-10 lg:px-14 lg:pt-28">
                {/* ── Brand and channels ───────────────────────────────── */}
                <div className="grid gap-14 lg:grid-cols-12">
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        <Link href={href(ROUTES.home)} className="inline-flex items-center gap-3 self-start">
                            <Image src="/images/logo-mark-light.png" alt="" width={571} height={556} className="h-11 w-auto" />
                            <span className="font-v3-display text-3xl rtl:text-2xl rtl:font-medium">{nav.brand}</span>
                        </Link>
                        <p className="max-w-md text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.manifesto}</p>
                        <Link
                            href={href(ROUTES.booking)}
                            className="group inline-flex items-center gap-3 self-start text-sm text-v3-bone"
                        >
                            <span className="relative flex h-2 w-2" aria-hidden>
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-v3-light opacity-60 motion-reduce:animate-none" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-v3-light" />
                            </span>
                            {t.available}
                            <Arrow className="h-3.5 w-3.5 text-v3-light transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                        </Link>
                    </div>

                    <div className="lg:col-span-6 lg:col-start-7">
                        <p className="mb-3 text-sm text-v3-mute">{t.follow}</p>
                        <ul className="border-t border-v3-line/70">
                            {SOCIALS.map(({ href: url, label, Icon }) => (
                                <li key={url} className="border-b border-v3-line/70">
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        dir="ltr"
                                        className="group flex min-h-14 items-center justify-between gap-4 py-3 text-v3-soft transition-colors duration-300 hover:text-v3-bone"
                                    >
                                        <span className="flex items-center gap-4">
                                            <Icon className="h-4 w-4 text-v3-mute transition-colors group-hover:text-v3-light" aria-hidden />
                                            <span className="text-lg transition-transform duration-500 group-hover:translate-x-2">{label}</span>
                                        </span>
                                        <ArrowRight
                                            className="h-4 w-4 -rotate-45 text-v3-light opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100"
                                            aria-hidden
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Index ────────────────────────────────────────────── */}
                <div className="mt-20 grid grid-cols-2 gap-10 border-t border-v3-line/70 pt-12 md:grid-cols-3">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm text-v3-mute">{t.colLibrary}</h2>
                        <ul className="flex flex-col">
                            {hasRoute("blog", locale) && <FooterLink href={href(ROUTES.blog)}>{t.allEssays}</FooterLink>}
                            {hasRoute("bookClub", locale) && <FooterLink href={href(ROUTES.bookClub)}>{t.bookClub}</FooterLink>}
                            {hasRoute("lab", locale) && <FooterLink href={href(ROUTES.lab)}>{t.lab}</FooterLink>}
                            {hasRoute("labPerks", locale) && <FooterLink href={href(ROUTES.labPerks)}>{t.labPerks}</FooterLink>}
                            <FooterLink href={href(ROUTES.work)}>{t.work}</FooterLink>
                            {hasRoute("resume", locale) && <FooterLink href={href(ROUTES.resume)}>{t.resume}</FooterLink>}
                            <FooterLink href={href(ROUTES.about)} strong>{t.startHere}</FooterLink>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm text-v3-mute">{t.colPractice}</h2>
                        <ul className="flex flex-col">
                            <FooterLink href={href(ROUTES.services)}>{t.advisory}</FooterLink>
                            <FooterLink href={href(ROUTES.portfolio)}>{t.portfolio}</FooterLink>
                            <FooterLink href={href(ROUTES.startups)}>{t.startups}</FooterLink>
                            <FooterLink href={href(ROUTES.stats)}>{t.stats}</FooterLink>
                            <FooterLink href={href(ROUTES.about)}>{t.aboutFarjad}</FooterLink>
                            <FooterLink href={href(ROUTES.contact)}>{t.contact}</FooterLink>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm text-v3-mute">{t.colResources}</h2>
                        <ul className="flex flex-col">
                            <FooterLink href={href(ROUTES.tools)}>{t.tools}</FooterLink>
                            <FooterLink href={href(ROUTES.booking)}>{t.booking}</FooterLink>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Wordmark ─────────────────────────────────────────────── */}
            <div className="mx-auto mt-16 max-w-[1600px] px-5 md:px-10 lg:px-14">
                <FooterWordmark text={nav.brand} />
            </div>

            {/* ── Colophon ─────────────────────────────────────────────── */}
            <div className="border-t border-v3-line/70">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-6 text-sm text-v3-mute md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span dir="ltr">© {new Date().getFullYear()} Farjad</span>
                        <Link href={href(ROUTES.privacy)} className="transition-colors hover:text-v3-bone">{t.privacy}</Link>
                        <Link href={href(ROUTES.terms)} className="transition-colors hover:text-v3-bone">{t.terms}</Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span>{t.location}</span>
                        <TorontoTime label={t.localTime} />
                        <a
                            href={counterpartPath("/", other)}
                            lang={other}
                            className="text-v3-soft transition-colors hover:text-v3-light"
                        >
                            {nav.switchTo}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
