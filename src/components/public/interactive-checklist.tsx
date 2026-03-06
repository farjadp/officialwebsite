'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

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
    const isComplete = totalCount > 0 && checkedCount === totalCount

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        ))
    }

    return (
        <div className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden shadow-sm my-12">
            {/* Header */}
            <div className="bg-[#111827] text-white p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                        Interactive Checklist
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400">
                        Vault Asset
                    </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">{topic}</h3>
                {introText && (
                    <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-2xl">
                        {introText}
                    </p>
                )}

                {totalCount > 0 && (
                    <div className="mt-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Progress</span>
                            <span className="text-sm font-medium text-white">{progress}% Complete</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-stone-800" indicatorClassName="bg-emerald-400" />
                    </div>
                )}
            </div>

            {/* Checklist */}
            <div className="p-6 md:p-8 bg-stone-50">
                <div className="space-y-3">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${item.isChecked
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                                }`}
                            onClick={() => toggleItem(item.id)}
                        >
                            <button className="mt-0.5 shrink-0 focus:outline-none">
                                {item.isChecked ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-stone-300" />
                                )}
                            </button>
                            <span className={`text-sm md:text-base transition-colors ${item.isChecked ? 'text-stone-500 line-through' : 'text-stone-700 font-medium'
                                }`}>
                                {/* Basic markdown bold parsing for inline text */}
                                {item.text.split(/(\*\*.*?\*\*)/).map((part, i) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return <span key={i} className="font-bold text-stone-900">{part.slice(2, -2)}</span>
                                    }
                                    return <span key={i}>{part}</span>
                                })}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Area */}
                <div className="mt-8 pt-6 border-t border-stone-200">
                    <div className="bg-[#1B4B43]/5 rounded-xl p-6 border border-[#1B4B43]/10 text-center space-y-4">
                        <h4 className="font-bold text-[#1B4B43] text-lg">Need help executing this?</h4>
                        <p className="text-sm text-stone-600 max-w-md mx-auto">
                            My team and I help founders implement these exact systems and strategies.
                        </p>
                        <Link href="/booking" className="inline-block mt-2">
                            <Button className="bg-[#1B4B43] hover:bg-green-700 text-white w-full sm:w-auto gap-2">
                                Book a Discovery Call <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
