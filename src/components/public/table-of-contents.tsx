'use client'

import { useState, useEffect } from 'react'

export interface Heading {
    id: string
    text: string
    level: number
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
        if (headings.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const intersecting = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (intersecting.length > 0) {
                    setActiveId(intersecting[0].target.id)
                }
            },
            { rootMargin: '-80px 0% -60% 0%', threshold: 0 }
        )

        headings.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [headings])

    if (headings.length === 0) return null

    return (
        <nav aria-label="Table of contents" className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 px-2">
                On this page
            </p>
            {headings.map((h) => (
                <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                        e.preventDefault()
                        const el = document.getElementById(h.id)
                        if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 88
                            window.scrollTo({ top: y, behavior: 'smooth' })
                        }
                        setActiveId(h.id)
                    }}
                    className={`block text-[13px] py-1.5 px-2 rounded-md leading-snug transition-all ${
                        h.level === 3 ? 'ml-3' : ''
                    } ${
                        activeId === h.id
                            ? 'text-[#1B4B43] font-semibold bg-[#1B4B43]/8'
                            : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                    }`}
                >
                    {h.text}
                </a>
            ))}
        </nav>
    )
}
