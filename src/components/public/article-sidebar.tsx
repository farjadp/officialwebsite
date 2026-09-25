'use client'

// ============================================================================
// File Path: src/components/public/article-sidebar.tsx
// Why: The post's side column in the v3 "Light" look — a quiet table of
//      contents on the warm charcoal ground rather than a stack of white
//      cards. Hairline rules instead of borders, the active heading in the
//      one light accent, everything else muted.
//
//      Behaviour is the v2 component's, untouched: the scroll listener that
//      drives the reading percentage, the IntersectionObserver scroll-spy and
//      the smooth scroll-to-heading. Only the look changed.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export interface Heading {
    id: string
    text: string
    level: number
}

interface DifficultyInfo {
    label: string
    color: string
    description: string
}

interface ArticleSidebarProps {
    headings: Heading[]
    excerpt: string | null
    targetAudience: string
    difficulty: DifficultyInfo
    tags: { id: string; name: string }[]
    relatedService: { title: string; href: string } | null
    postTitle: string
    postSlug: string
    realReadingTime: number
}

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** A small uppercase label above a block. */
function Label({ children }: { children: React.ReactNode }) {
    return <p className="text-[10px] uppercase tracking-[0.18em] text-v3-mute">{children}</p>
}

export function ArticleSidebar({
    headings,
    excerpt,
    targetAudience,
    difficulty,
    relatedService,
    realReadingTime,
}: ArticleSidebarProps) {
    const reduce = useReducedMotion()
    const [activeId, setActiveId] = useState('')
    const [readingProgress, setReadingProgress] = useState(0)
    const [minutesLeft, setMinutesLeft] = useState(realReadingTime)

    // Reading progress
    useEffect(() => {
        const update = () => {
            const article = document.querySelector('article')
            if (!article) return
            const top = article.offsetTop
            const height = article.scrollHeight
            const scrolled = Math.max(0, window.scrollY - top)
            const pct = Math.min(100, Math.round((scrolled / height) * 100))
            setReadingProgress(pct)
            setMinutesLeft(Math.max(0, Math.ceil((1 - pct / 100) * realReadingTime)))
        }
        window.addEventListener('scroll', update, { passive: true })
        update()
        return () => window.removeEventListener('scroll', update)
    }, [realReadingTime])

    // Active heading (IntersectionObserver)
    useEffect(() => {
        if (headings.length === 0) return
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible.length > 0) setActiveId(visible[0].target.id)
            },
            { rootMargin: '-80px 0% -60% 0%', threshold: 0 }
        )
        headings.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [headings])

    const scrollTo = (id: string) => {
        const el = document.getElementById(id)
        if (!el) return
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
        setActiveId(id)
    }

    return (
        <div className="v3-under-header sticky flex max-h-[calc(100vh-7rem)] flex-col gap-7 overflow-y-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:w-0">

            {/* ── Reading Progress ──────────────────────────── */}
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                    <Label>Reading</Label>
                    <span className="text-xs tabular-nums text-v3-light">{readingProgress}%</span>
                </div>
                <div
                    className="relative h-px bg-v3-line"
                    role="progressbar"
                    aria-label="Reading progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={readingProgress}
                >
                    <motion.div
                        className="absolute inset-y-0 start-0 w-full origin-left bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.7)] rtl:origin-right"
                        initial={false}
                        animate={{ scaleX: readingProgress / 100 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: ARRIVE }}
                    />
                </div>
                <p className="text-[11px] text-v3-mute">
                    {readingProgress === 100 ? 'Done reading' : minutesLeft === 0 ? 'Almost done' : `~${minutesLeft} min left`}
                </p>
            </div>

            {/* ── Table of Contents ─────────────────────────── */}
            {headings.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-v3-line/70 pt-6">
                    <Label>On this page</Label>
                    <nav aria-label="On this page" className="flex flex-col">
                        {headings.map((h) => {
                            const active = activeId === h.id
                            return (
                                <a
                                    key={h.id}
                                    href={`#${h.id}`}
                                    aria-current={active ? 'true' : undefined}
                                    onClick={(e) => { e.preventDefault(); scrollTo(h.id) }}
                                    className={`block border-s py-2 text-[13px] leading-snug transition-colors duration-300 ${
                                        h.level === 3 ? 'ps-7' : 'ps-4'
                                    } ${
                                        active
                                            ? 'border-v3-light text-v3-light'
                                            : 'border-v3-line/70 text-v3-mute hover:text-v3-bone'
                                    }`}
                                >
                                    {h.text}
                                </a>
                            )
                        })}
                    </nav>
                </div>
            )}

            {/* ── Before You Read ───────────────────────────── */}
            <div className="flex flex-col gap-4 border-t border-v3-line/70 pt-6">
                <Label>Before You Read</Label>

                {excerpt && (
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-v3-mute/70">Covers</p>
                        <p className="text-xs leading-relaxed text-v3-soft">
                            {excerpt.length > 90 ? excerpt.slice(0, 90) + '…' : excerpt}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-v3-mute/70">For</p>
                    <p className="text-xs leading-relaxed text-v3-soft">{targetAudience}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-v3-mute/70">Level</p>
                    <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] ${difficulty.color}`}>
                        {difficulty.label}
                    </span>
                    <p className="text-[11px] leading-snug text-v3-mute">{difficulty.description}</p>
                </div>

                {relatedService && (
                    <p className="border-t border-v3-line/70 pt-4 text-[11px] leading-relaxed text-v3-mute">
                        Related:{' '}
                        <Link
                            href={relatedService.href}
                            className="text-v3-light underline decoration-v3-light/40 underline-offset-4 transition-colors hover:decoration-v3-light"
                        >
                            {relatedService.title}
                        </Link>
                    </p>
                )}
            </div>

            {/* ── Back to top ───────────────────────────────── */}
            {readingProgress > 15 && (
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex min-h-11 w-full items-center justify-center border-t border-v3-line/70 text-[11px] text-v3-mute transition-colors duration-300 hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                >
                    ↑ Back to top
                </button>
            )}
        </div>
    )
}
