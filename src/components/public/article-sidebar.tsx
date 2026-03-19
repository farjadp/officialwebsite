'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { ShareButtons } from '@/components/blog/share-buttons'

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

export function ArticleSidebar({
    headings,
    excerpt,
    targetAudience,
    difficulty,
    tags,
    relatedService,
    postTitle,
    postSlug,
    realReadingTime,
}: ArticleSidebarProps) {
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
        <div className="space-y-3">

            {/* ── Reading Progress ──────────────────────────── */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Reading</p>
                    <span className="text-xs font-bold text-[#1B4B43]">{readingProgress}%</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#1B4B43] rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${readingProgress}%` }}
                    />
                </div>
                <p className="text-[10px] text-stone-400">
                    {readingProgress === 100 ? 'Done reading' : minutesLeft === 0 ? 'Almost done' : `~${minutesLeft} min left`}
                </p>
            </div>

            {/* ── Table of Contents ─────────────────────────── */}
            {headings.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                        On this page
                    </p>
                    <nav className="space-y-0.5">
                        {headings.map((h) => (
                            <a
                                key={h.id}
                                href={`#${h.id}`}
                                onClick={(e) => { e.preventDefault(); scrollTo(h.id) }}
                                className={`block text-[12px] py-1 px-2 rounded-md leading-snug transition-all ${h.level === 3 ? 'ml-3' : ''
                                    } ${activeId === h.id
                                        ? 'text-[#1B4B43] font-semibold bg-[#1B4B43]/8'
                                        : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
                                    }`}
                            >
                                {h.text}
                            </a>
                        ))}
                    </nav>
                </div>
            )}

            {/* ── Before You Read ───────────────────────────── */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Before You Read</p>

                <div className="space-y-2.5">
                    {excerpt && (
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-300 mb-1">Covers</p>
                            <p className="text-[11px] text-stone-600 leading-relaxed">
                                {excerpt.length > 90 ? excerpt.slice(0, 90) + '…' : excerpt}
                            </p>
                        </div>
                    )}
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-300 mb-1">For</p>
                        <p className="text-[11px] text-stone-600 leading-relaxed">{targetAudience}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-300 mb-1">Level</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficulty.color}`}>
                            {difficulty.label}
                        </span>
                        <p className="text-[10px] text-stone-400 mt-1 leading-snug">{difficulty.description}</p>
                    </div>
                </div>

                {relatedService && (
                    <div className="pt-2 border-t border-stone-100 flex items-start gap-1.5">
                        <Zap className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-stone-500 leading-relaxed">
                            Related:{' '}
                            <Link href={relatedService.href} className="font-bold text-[#1B4B43] hover:underline">
                                {relatedService.title} →
                            </Link>
                        </p>
                    </div>
                )}
            </div>



            {/* ── Back to top ───────────────────────────────── */}
            {readingProgress > 15 && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-full text-[11px] text-stone-400 hover:text-[#1B4B43] font-medium py-1.5 transition-colors text-center rounded-lg hover:bg-stone-50"
                >
                    ↑ Back to top
                </button>
            )}
        </div>
    )
}
