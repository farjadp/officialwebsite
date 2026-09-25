"use client"

// ============================================================================
// File Path: src/components/layout/header.tsx
// Version: 3.0.0 — 2026-09-25
// Why: The site header in the v3 "Light" language: warm charcoal, one light
//      accent, a calm serif wordmark. It stays out of the way while you
//      read — it slides away on scroll down and returns on scroll up — and
//      a thin line of light along its edge shows how far down the page you
//      are. Dropdowns open on hover, click or keyboard and close on Escape.
//
// Labels and hrefs come from @/lib/nav, so the Persian header is a Persian
// header and the language switch keeps the visitor on the same page.
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
} from "framer-motion"
import { ChevronDown, Menu, UserRound, X } from "lucide-react"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import {
    NAV,
    ROUTES,
    hasRoute,
    localePath,
    counterpartPath,
    type Locale,
} from "@/lib/nav"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

type Item = { href: string; label: string; note?: string }
type Entry = { label: string; href?: string; items?: Item[] }

export function Header({ locale = "en" }: { locale?: Locale }) {
    const pathname = usePathname() ?? "/"
    const t = NAV[locale]
    const href = (path: string) => localePath(locale, path)
    const other: Locale = locale === "fa" ? "en" : "fa"
    const switchHref = counterpartPath(pathname, other)
    const reduce = useReducedMotion()

    const [menuOpen, setMenuOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const openDropdowns = useRef(0)

    const { scrollY, scrollYProgress } = useScroll()
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })

    useMotionValueEvent(scrollY, "change", (y) => {
        const prev = scrollY.getPrevious() ?? 0
        setScrolled(y > 8)
        if (menuOpen || openDropdowns.current > 0) return setHidden(false)
        setHidden(y > 240 && y > prev + 4 ? true : y < prev - 4 ? false : hidden)
    })

    // Close the mobile menu on navigation.
    useEffect(() => setMenuOpen(false), [pathname])

    const entries: Entry[] = [
        { label: t.services, href: href(ROUTES.services) },
        {
            label: t.proofOfWork,
            items: [
                { href: href(ROUTES.portfolio), label: t.portfolio, note: t.portfolioNote },
                { href: href(ROUTES.startups), label: t.startups, note: t.startupsNote },
                { href: href(ROUTES.stats), label: t.stats, note: t.statsNote },
            ],
        },
        ...(hasRoute("blog", locale) ? [{ label: t.blog, href: href(ROUTES.blog) }] : []),
        ...(hasRoute("bookClub", locale) ? [{ label: t.bookClub, href: href(ROUTES.bookClub) }] : []),
        ...(hasRoute("lab", locale)
            ? [
                  {
                      label: t.lab,
                      items: [
                          { href: href(ROUTES.lab), label: t.labProgramme, note: t.labProgrammeNote },
                          { href: href(ROUTES.labPerks), label: t.labPerks, note: t.labPerksNote },
                      ],
                  },
              ]
            : []),
        { label: t.tools, href: href(ROUTES.tools) },
        { label: t.about, href: href(ROUTES.about) },
        ...(hasRoute("resume", locale) ? [{ label: t.resume, href: href(ROUTES.resume) }] : []),
    ]

    const portal: Item[] = [
        { href: href(ROUTES.login), label: t.login, note: t.loginNote },
        { href: href(ROUTES.register), label: t.register, note: t.registerNote },
        { href: href(ROUTES.profile), label: t.profile, note: t.profileNote },
    ]

    const isActive = (h?: string) =>
        !!h && (pathname === h || (h !== "/" && h !== "/fa" && pathname.startsWith(`${h}/`)))

    const trackDropdown = (open: boolean) => {
        openDropdowns.current = Math.max(0, openDropdowns.current + (open ? 1 : -1))
        if (open) setHidden(false)
    }

    return (
        <>
            <motion.header
                className={`sticky top-0 z-50 font-v3-body text-v3-bone transition-[background-color,border-color] duration-500 ${
                    scrolled ? "border-b border-v3-line/80 bg-v3-ink/85 backdrop-blur-md" : "border-b border-v3-line/40 bg-v3-ink"
                }`}
                animate={{ y: hidden && !reduce ? "-100%" : "0%" }}
                transition={{ duration: 0.45, ease: ARRIVE }}
            >
                <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10 lg:px-14">
                    <Link href={href(ROUTES.home)} className="group flex items-center gap-3" aria-label={t.brand}>
                        <Image
                            src="/images/logo-mark-light.png"
                            alt=""
                            width={571}
                            height={556}
                            priority
                            className="h-9 w-auto shrink-0 transition-transform duration-700 group-hover:rotate-[8deg]"
                        />
                        <span className="flex flex-col">
                            <span className="font-v3-display text-[26px] leading-none tracking-[-0.01em] rtl:text-[22px] rtl:font-medium">
                                {t.brand}
                            </span>
                            <span className="mt-1 text-[11px] text-v3-mute">{t.tagline}</span>
                        </span>
                    </Link>

                    <nav aria-label={locale === "fa" ? "منوی اصلی" : "Main"} className="hidden items-center gap-7 text-[14px] xl:flex">
                        {entries.map((e) =>
                            e.items ? (
                                <Dropdown key={e.label} label={e.label} items={e.items} onToggle={trackDropdown} active={e.items.some((i) => isActive(i.href))} />
                            ) : (
                                <NavLink key={e.label} href={e.href!} active={isActive(e.href)}>
                                    {e.label}
                                </NavLink>
                            ),
                        )}
                    </nav>

                    <div className="flex items-center gap-2 md:gap-4">
                        <a
                            href={switchHref}
                            lang={other}
                            className="hidden min-h-11 items-center px-2 text-sm text-v3-soft transition-colors hover:text-v3-light sm:inline-flex"
                        >
                            {t.switchTo}
                        </a>
                        <div className="hidden xl:block">
                            <Dropdown
                                label={t.portal}
                                items={portal}
                                onToggle={trackDropdown}
                                icon={<UserRound className="h-[18px] w-[18px]" aria-hidden />}
                                align="end"
                            />
                        </div>
                        <Link
                            href={href(ROUTES.booking)}
                            className="hidden min-h-11 items-center rounded-full border border-v3-bone/70 px-5 text-sm font-medium transition-colors duration-300 hover:border-v3-light hover:bg-v3-light hover:text-v3-ink md:inline-flex"
                        >
                            {t.cta}
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-expanded={menuOpen}
                            aria-controls="v3-mobile-menu"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-v3-line text-v3-bone transition-colors hover:border-v3-light xl:hidden"
                        >
                            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                            <span className="sr-only">{t.menu}</span>
                        </button>
                    </div>
                </div>

                {/* How far down the page you are: a thin line of light. */}
                <motion.div
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-px origin-left bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.7)] rtl:origin-right"
                    style={{ scaleX: reduce ? 0 : progress }}
                />
            </motion.header>

            <MobileMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                entries={entries}
                portal={portal}
                portalLabel={t.portalMobile}
                cta={{ href: href(ROUTES.booking), label: t.ctaMobile }}
                switchLink={{ href: switchHref, label: t.switchTo, lang: other }}
                isActive={isActive}
            />
        </>
    )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group relative py-2 transition-colors duration-300 ${active ? "text-v3-bone" : "text-v3-soft hover:text-v3-bone"}`}
        >
            {children}
            <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-v3-light transition-transform duration-500 ease-out rtl:origin-right ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
            />
        </Link>
    )
}

function Dropdown({
    label,
    items,
    onToggle,
    active = false,
    icon,
    align = "start",
}: {
    label: string
    items: Item[]
    onToggle: (open: boolean) => void
    active?: boolean
    icon?: ReactNode
    align?: "start" | "end"
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const id = useId()
    const reduce = useReducedMotion()

    const set = (next: boolean) =>
        setOpen((prev) => {
            if (prev !== next) onToggle(next)
            return next
        })

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && set(false)
        const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && set(false)
        document.addEventListener("keydown", onKey)
        document.addEventListener("pointerdown", onDown)
        return () => {
            document.removeEventListener("keydown", onKey)
            document.removeEventListener("pointerdown", onDown)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <div
            ref={ref}
            className="relative"
            // Move, not enter: when the header slides back in under a still
            // cursor, enter fires and would pop the menu open uninvited.
            onPointerMove={(e) => e.pointerType === "mouse" && !open && set(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && set(false)}
            onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && set(false)}
        >
            <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                aria-label={icon ? label : undefined}
                onClick={() => set(!open)}
                className={`flex min-h-11 items-center gap-1.5 py-2 transition-colors duration-300 ${
                    open || active ? "text-v3-bone" : "text-v3-soft hover:text-v3-bone"
                } ${icon ? "h-11 w-11 justify-center rounded-full border border-v3-line hover:border-v3-light" : ""}`}
            >
                {icon ?? (
                    <>
                        {label}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
                    </>
                )}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        id={id}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3, ease: ARRIVE }}
                        className={`absolute top-full z-10 pt-3 ${align === "end" ? "end-0" : "-start-4"}`}
                    >
                        <ul className="w-72 overflow-hidden rounded-2xl border border-v3-line bg-v3-raise/95 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
                            {items.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => set(false)}
                                        className="group flex flex-col gap-1 rounded-xl px-4 py-3 transition-colors hover:bg-v3-ink/70 focus-visible:bg-v3-ink/70"
                                    >
                                        <span className="text-[15px] text-v3-bone transition-colors group-hover:text-v3-light">{item.label}</span>
                                        {item.note && <span className="text-[13px] text-v3-mute">{item.note}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function MobileMenu({
    open,
    onClose,
    entries,
    portal,
    portalLabel,
    cta,
    switchLink,
    isActive,
}: {
    open: boolean
    onClose: () => void
    entries: Entry[]
    portal: Item[]
    portalLabel: string
    cta: Item
    switchLink: { href: string; label: string; lang: Locale }
    isActive: (h?: string) => boolean
}) {
    const reduce = useReducedMotion()

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
        document.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prev
            document.removeEventListener("keydown", onKey)
        }
    }, [open, onClose])

    const flat: { label: string; href?: string; items?: Item[] }[] = [...entries, { label: portalLabel, items: portal }]

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    id="v3-mobile-menu"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-v3-ink font-v3-body text-v3-bone xl:hidden"
                >
                    <motion.nav
                        className="flex flex-col px-5 pb-16 pt-6 md:px-10"
                        initial={reduce ? false : "hidden"}
                        animate="shown"
                        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.045 } } }}
                    >
                        {flat.map((e) => (
                            <motion.div
                                key={e.label}
                                variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ARRIVE } } }}
                                className="border-b border-v3-line/70 py-4"
                            >
                                {e.href ? (
                                    <Link
                                        href={e.href}
                                        onClick={onClose}
                                        aria-current={isActive(e.href) ? "page" : undefined}
                                        className={`font-v3-display text-3xl rtl:text-2xl ${isActive(e.href) ? "text-v3-light" : ""}`}
                                    >
                                        {e.label}
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <span className="text-sm text-v3-mute">{e.label}</span>
                                        {e.items!.map((i) => (
                                            <Link
                                                key={i.href}
                                                href={i.href}
                                                onClick={onClose}
                                                className={`font-v3-display text-2xl rtl:text-xl ${isActive(i.href) ? "text-v3-light" : ""}`}
                                            >
                                                {i.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ARRIVE } } }}
                            className="flex flex-wrap items-center gap-4 pt-8"
                        >
                            <Link
                                href={cta.href}
                                onClick={onClose}
                                className="inline-flex min-h-12 items-center rounded-full bg-v3-light px-7 font-semibold text-v3-ink"
                            >
                                {cta.label}
                            </Link>
                            <a href={switchLink.href} lang={switchLink.lang} className="inline-flex min-h-12 items-center px-3 text-v3-soft">
                                {switchLink.label}
                            </a>
                        </motion.div>
                    </motion.nav>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
