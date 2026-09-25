'use client'

// ============================================================================
// File Path: src/components/public/interactive-checklist.tsx
// Why: The body of the Vault asset widget, in the v3 "Light" look — one v3
//      card on the warm charcoal ground with a rule of light for progress,
//      instead of the old near-black header over a stone-50 tray.
//
//      The markdown parsing, the localStorage persistence and the toggle
//      behaviour are the v2 component's, untouched. Only the look changed,
//      plus accessibility: each row is now a real checkbox button rather than
//      a click handler on a div.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ChecklistItem {
    id: string
    text: string
    isChecked: boolean
}

interface InteractiveChecklistProps {
    assetId: string
    topic: string
    content: string
}

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function InteractiveChecklist({ assetId, topic, content }: InteractiveChecklistProps) {
    // Parse markdown list items into interactive state
    const [items, setItems] = useState<ChecklistItem[]>([])
    const [mounted, setMounted] = useState(false)
    const [introText, setIntroText] = useState("")

    useEffect(() => {
        // Load saved state from localStorage if it exists
        const savedState = localStorage.getItem(`vault_asset_${assetId}`)

        if (savedState) {
            try {
                setItems(JSON.parse(savedState))
            } catch (e) {
                console.error("Failed to parse saved checklist state", e)
                parseContent(content)
            }
        } else {
            parseContent(content)
        }

        setMounted(true)
    }, [assetId, content])

    // Save to localStorage whenever items change
    useEffect(() => {
        if (mounted && items.length > 0) {
            localStorage.setItem(`vault_asset_${assetId}`, JSON.stringify(items))
        }
    }, [items, assetId, mounted])

    const parseContent = (md: string) => {
        const lines = md.split('\n')
        const initialItems: ChecklistItem[] = []
        const introLines: string[] = []
        let inList = false

        lines.forEach((line, index) => {
            const trimmed = line.trim()

            // Match markdown checkbox items like "- [ ]" or "- [x]" or simple list items "-" or "*"
            const checkboxMatch = trimmed.match(/^[-*]\s*\[([ xX])\]\s+(.+)$/)
            const listMatch = trimmed.match(/^[-*]\s+(.+)$/)

            if (checkboxMatch) {
                inList = true
                initialItems.push({
                    id: `item-${index}`,
                    text: checkboxMatch[2],
                    isChecked: checkboxMatch[1].toLowerCase() === 'x'
                })
            } else if (listMatch && !line.includes('##') && !line.includes('**')) { // avoid confusing with bold headers
                inList = true
                initialItems.push({
                    id: `item-${index}`,
                    text: listMatch[1],
                    isChecked: false
                })
            } else if (!inList && trimmed.length > 0 && !trimmed.startsWith('#')) {
                // Collect introductory paragraph text
                introLines.push(trimmed)
            }
        })

        // If no list items found, just treat bold lines or headers as items for the sake of the widget
        if (initialItems.length === 0) {
            const fallbackItems = lines
                .filter(l => l.trim().startsWith('###') || l.trim().startsWith('**'))
                .map((l, i) => ({
                    id: `fallback-${i}`,
                    text: l.replace(/^###\s*/, '').replace(/\*\*/g, ''),
                    isChecked: false
                }))
            if (fallbackItems.length > 0) setItems(fallbackItems)
        } else {
            setItems(initialItems)
        }

        setIntroText(introLines.slice(0, 2).join(' '))
    }

    if (!mounted) return null

    const checkedCount = items.filter(i => i.isChecked).length
    const totalCount = items.length
    const progress = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100)

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        ))
    }

    return (
        <div className="my-12 overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-raise">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-v3-line/70 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex rounded-full border border-v3-light/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-v3-light">
                        Interactive Checklist
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-v3-mute">
                        Vault Asset
                    </span>
                </div>
                <h3 className="font-v3-display text-2xl font-light leading-tight tracking-[-0.015em] text-v3-bone md:text-3xl rtl:leading-snug rtl:tracking-normal">
                    {topic}
                </h3>
                {introText && (
                    <p className="max-w-2xl text-sm leading-relaxed text-v3-soft md:text-base rtl:leading-loose">
                        {introText}
                    </p>
                )}

                {totalCount > 0 && (
                    <div className="mt-4 flex flex-col gap-2.5">
                        <div className="flex items-end justify-between gap-4 text-[10px] uppercase tracking-[0.18em]">
                            <span className="text-v3-mute">Progress</span>
                            <span className="tabular-nums text-v3-light">{progress}% Complete</span>
                        </div>
                        <div
                            className="relative h-px bg-v3-line"
                            role="progressbar"
                            aria-label="Checklist progress"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={progress}
                        >
                            <motion.div
                                className="absolute inset-y-0 start-0 w-full origin-left bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.7)] rtl:origin-right"
                                initial={false}
                                animate={{ scaleX: progress / 100 }}
                                transition={{ duration: 0.5, ease: ARRIVE }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Checklist */}
            <div className="p-6 md:p-8">
                <div className="flex flex-col gap-2.5">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: ARRIVE }}
                        >
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={item.isChecked}
                                onClick={() => toggleItem(item.id)}
                                className={`flex min-h-14 w-full items-start gap-3 rounded-xl border p-4 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light ${
                                    item.isChecked
                                        ? 'border-v3-light/50 bg-v3-light/10'
                                        : 'border-v3-line bg-v3-ink hover:-translate-y-0.5 hover:border-v3-light/50'
                                }`}
                            >
                                <span className="mt-0.5 shrink-0">
                                    {item.isChecked ? (
                                        <CheckCircle2 className="h-5 w-5 text-v3-light" aria-hidden />
                                    ) : (
                                        <Circle className="h-5 w-5 text-v3-mute" aria-hidden />
                                    )}
                                </span>
                                <span className={`text-sm leading-relaxed transition-colors md:text-base rtl:leading-loose ${
                                    item.isChecked ? 'text-v3-mute line-through' : 'text-v3-soft'
                                }`}>
                                    {/* Basic markdown bold parsing for inline text */}
                                    {item.text.split(/(\*\*.*?\*\*)/).map((part, i) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return <span key={i} className="font-semibold text-v3-bone">{part.slice(2, -2)}</span>
                                        }
                                        return <span key={i}>{part}</span>
                                    })}
                                </span>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Area */}
                <div className="mt-8 flex flex-col items-center gap-4 border-t border-v3-line/70 pt-8 text-center">
                    <h4 className="font-v3-display text-lg font-light text-v3-bone">Need help executing this?</h4>
                    <p className="mx-auto max-w-md text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                        My team and I help founders implement these exact systems and strategies.
                    </p>
                    <Link
                        href="/booking"
                        className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink sm:w-auto"
                    >
                        Book a Discovery Call
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
                    </Link>
                </div>
            </div>
        </div>
    )
}
