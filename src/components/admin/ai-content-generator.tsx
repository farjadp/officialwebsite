'use client'

// src/components/admin/ai-content-generator.tsx
// A modal panel that lets the user specify generation params and
// get back a fully-filled post ready to publish.

import { useState } from 'react'
import { toast } from 'sonner'
import { Sparkles, Loader2, X, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface GeneratedPost {
    title: string
    slug: string
    excerpt: string
    content: string
    seoTitle: string
    seoDescription: string
    seoKeywords: string
    coverImageUrl: string | null
    imagePrompt: string
}

interface AIContentGeneratorProps {
    onGenerated: (post: GeneratedPost) => void
}

const TONES = [
    { value: 'Professional and insightful', label: 'Professional & Insightful' },
    { value: 'Provocative and direct', label: 'Provocative & Direct' },
    { value: 'Educational and structured', label: 'Educational & Structured' },
    { value: 'Conversational and personal', label: 'Conversational & Personal' },
    { value: 'Data-driven and analytical', label: 'Data-Driven & Analytical' },
]

const AUDIENCES = [
    { value: 'Startup founders and tech entrepreneurs', label: 'Startup Founders' },
    { value: 'Non-technical SME owners', label: 'Non-Tech SME Owners' },
    { value: 'Product managers and designers', label: 'Product Managers' },
    { value: 'Investors and VCs', label: 'Investors & VCs' },
    { value: 'Engineering teams and CTOs', label: 'Engineering Teams' },
]

const LENGTHS = [
    { value: 'short', label: 'Short (600–900 words)' },
    { value: 'medium', label: 'Medium (1000–1500 words)' },
    { value: 'long', label: 'Long (1800–2500 words)' },
]

const LANGUAGES = [
    { value: 'English', label: 'English' },
    { value: 'Persian (Farsi)', label: 'Persian (Farsi)' },
]

export function AIContentGenerator({ onGenerated }: AIContentGeneratorProps) {
    const [open, setOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [preview, setPreview] = useState<GeneratedPost | null>(null)
    const [showAdvanced, setShowAdvanced] = useState(false)

    const [params, setParams] = useState({
        topic: '',
        tone: 'Professional and insightful',
        targetAudience: 'Startup founders and tech entrepreneurs',
        keywords: '',
        length: 'medium',
        generateImage: true,
        language: 'English',
    })

    const handleGenerate = async () => {
        if (!params.topic.trim()) {
            toast.error('Please enter a topic first')
            return
        }
        setIsGenerating(true)
        setPreview(null)
        try {
            const res = await fetch('/api/ai/generate-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            })
            const json = await res.json()
            if (!res.ok || !json.success) throw new Error(json.error || 'Generation failed')
            setPreview(json.data)
            toast.success('Article generated! Review it below.')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Something went wrong'
            toast.error(msg)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleUse = () => {
        if (!preview) return
        onGenerated(preview)
        setOpen(false)
        setPreview(null)
        toast.success('Content applied to the editor ✓')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-violet-300 text-violet-700 hover:bg-violet-50 hover:text-violet-900 font-semibold"
                >
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-violet-600" />
                        AI Content Generator
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Powered by GPT-4o + DALL-E 3. Fill in the details and get a ready-to-publish article.
                    </p>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    {/* Topic */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Topic / Title Idea*</label>
                        <Textarea
                            placeholder="e.g. Why most startup MVPs are over-engineered by developers who've never sold anything"
                            value={params.topic}
                            onChange={(e) => setParams({ ...params, topic: e.target.value })}
                            className="resize-none h-20"
                        />
                    </div>

                    {/* Tone + Audience */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Tone</label>
                            <Select value={params.tone} onValueChange={(v) => setParams({ ...params, tone: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Target Audience</label>
                            <Select value={params.targetAudience} onValueChange={(v) => setParams({ ...params, targetAudience: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {AUDIENCES.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Length + Language */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Article Length</label>
                            <Select value={params.length} onValueChange={(v) => setParams({ ...params, length: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {LENGTHS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Language</label>
                            <Select value={params.language} onValueChange={(v) => setParams({ ...params, language: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Advanced toggle */}
                    <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        Advanced Options
                    </button>

                    {showAdvanced && (
                        <div className="space-y-4 pt-1 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Focus Keywords (comma-separated)</label>
                                <Input
                                    placeholder="e.g. startup mentorship, product market fit, fundraising"
                                    value={params.keywords}
                                    onChange={(e) => setParams({ ...params, keywords: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="generateImage"
                                    checked={params.generateImage}
                                    onChange={(e) => setParams({ ...params, generateImage: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="generateImage" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-violet-600" />
                                    Generate cover image with DALL-E 3
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Generate Button */}
                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating || !params.topic.trim()}
                        className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating article{params.generateImage ? ' + cover image' : ''}...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Article
                            </>
                        )}
                    </Button>

                    {isGenerating && (
                        <p className="text-xs text-center text-muted-foreground animate-pulse">
                            GPT-4o is writing your article{params.generateImage ? ' and DALL-E 3 is creating the cover image' : ''}. This may take 30–60 seconds...
                        </p>
                    )}

                    {/* Preview */}
                    {preview && (
                        <div className="border rounded-xl overflow-hidden">
                            {/* Cover image */}
                            {preview.coverImageUrl && (
                                <div className="relative aspect-video w-full bg-stone-100">
                                    <img src={preview.coverImageUrl} alt="Generated cover" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="p-5 space-y-3">
                                <h3 className="font-serif text-xl font-bold">{preview.title}</h3>
                                <p className="text-sm text-muted-foreground italic">{preview.excerpt}</p>
                                <div className="text-xs text-stone-400 space-y-1 border-t pt-3">
                                    <p><span className="font-semibold text-stone-600">Slug:</span> {preview.slug}</p>
                                    <p><span className="font-semibold text-stone-600">SEO Title:</span> {preview.seoTitle}</p>
                                    <p><span className="font-semibold text-stone-600">Meta Desc:</span> {preview.seoDescription}</p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        onClick={handleUse}
                                        className="flex-1 bg-[#1B4B43] hover:bg-[#133832] text-white font-bold"
                                    >
                                        Use This Article ✓
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setPreview(null)}
                                        className="gap-1"
                                    >
                                        <X className="w-4 h-4" /> Discard
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="gap-1"
                                    >
                                        <Sparkles className="w-4 h-4" /> Regenerate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
