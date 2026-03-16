'use client'

// src/components/admin/ai-content-generator.tsx
// AI content generator with SEO / GEO / AEO modes + Brand Voice + Lead Gen

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Sparkles, Loader2, X, ChevronDown, ChevronUp, Image as ImageIcon, Brain, Target, TrendingUp, UploadCloud, Trash2, Send, Twitter, Linkedin } from 'lucide-react'
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
    schemaType?: string
    coverImageUrl: string | null
    imagePrompt: string
    optimizationMode: string
    contentGoal: string
    socialPlatforms?: { telegram: boolean; twitter: boolean; linkedin: boolean }
}

interface AIContentGeneratorProps {
    onGenerated: (post: GeneratedPost) => void
}

const OPTIMIZATION_MODES = [
    {
        value: 'GEO',
        label: '🤖 GEO — Generative Engine Optimization',
        desc: 'Get cited by ChatGPT, Perplexity, Gemini. Best for authority & AI visibility.',
    },
    {
        value: 'AEO',
        label: '🎯 AEO — Answer Engine Optimization',
        desc: 'Win Google Featured Snippets, People Also Ask, and voice search.',
    },
    {
        value: 'SEO',
        label: '🔍 SEO — Search Engine Optimization',
        desc: 'Traditional Google ranking. Keyword-driven, structured for SERP.',
    },
]

const CONTENT_GOALS = [
    { value: 'authority', label: '👑 Build Authority — Establish Farjad as #1 expert' },
    { value: 'lead-gen', label: '📥 Lead Generation — Drive booking inquiries' },
    { value: 'awareness', label: '📢 Brand Awareness — Introduce Farjad to new audiences' },
    { value: 'education', label: '📚 Education — Maximum practical value for readers' },
]

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
    { value: 'Engineering teams and CTOs', label: 'Engineering Teams / CTOs' },
    { value: 'Immigrant founders navigating Canadian startup ecosystem', label: 'Immigrant Founders (Canada)' },
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

const modeColors: Record<string, string> = {
    GEO: 'bg-purple-100 text-purple-800 border-purple-300',
    AEO: 'bg-orange-100 text-orange-800 border-orange-300',
    SEO: 'bg-blue-100 text-blue-800 border-blue-300',
}

export function AIContentGenerator({ onGenerated }: AIContentGeneratorProps) {
    const [open, setOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [preview, setPreview] = useState<GeneratedPost | null>(null)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<{ url: string; name: string }[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const [socialPlatforms, setSocialPlatforms] = useState({
        telegram: true,
        twitter: true,
        linkedin: true,
    })

    const [params, setParams] = useState({
        topic: '',
        tone: 'Professional and insightful',
        targetAudience: 'Startup founders and tech entrepreneurs',
        keywords: '',
        length: 'medium',
        generateImage: true,
        language: 'English',
        optimizationMode: 'GEO',
        contentGoal: 'authority',
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const remaining = 5 - uploadedImages.length
        if (remaining <= 0) {
            toast.error('Maximum 5 images allowed')
            return
        }

        const filesToUpload = Array.from(files).slice(0, remaining)
        setIsUploading(true)

        for (const file of filesToUpload) {
            const formData = new FormData()
            formData.append('file', file)
            try {
                const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
                if (!res.ok) throw new Error('Upload failed')
                const data = await res.json()
                setUploadedImages(prev => [...prev, { url: data.url, name: file.name }])
            } catch {
                toast.error(`Failed to upload ${file.name}`)
            }
        }

        setIsUploading(false)
        if (imageInputRef.current) imageInputRef.current.value = ''
    }

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index))
    }

    const selectedMode = OPTIMIZATION_MODES.find(m => m.value === params.optimizationMode)

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
                body: JSON.stringify({
                    ...params,
                    referenceImageUrls: uploadedImages.map(img => img.url),
                }),
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
        const anySelected = socialPlatforms.telegram || socialPlatforms.twitter || socialPlatforms.linkedin
        onGenerated({ ...preview, socialPlatforms: anySelected ? socialPlatforms : undefined })
        setOpen(false)
        setPreview(null)
        const platformNames = [
            socialPlatforms.telegram && 'Telegram',
            socialPlatforms.twitter && 'X/Twitter',
            socialPlatforms.linkedin && 'LinkedIn',
        ].filter(Boolean).join(', ')
        toast.success(anySelected
            ? `Content applied ✓ — will publish to ${platformNames} after saving`
            : 'Content applied to the editor ✓'
        )
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

            <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-violet-600" />
                        AI Content Generator
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        GPT-4o + DALL-E 3 × Farjad's brand voice. Engineered to dominate search engines AND AI chatbots.
                    </p>
                </DialogHeader>

                <div className="space-y-5 pt-2">

                    {/* Topic */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Topic / Title Idea *</label>
                        <Textarea
                            placeholder="e.g. Why most startup MVPs are over-engineered by developers who've never sold anything"
                            value={params.topic}
                            onChange={(e) => setParams({ ...params, topic: e.target.value })}
                            className="resize-none h-20"
                        />
                    </div>

                    {/* Optimization Mode — full-width, prominently displayed */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-violet-600" />
                            Optimization Strategy
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {OPTIMIZATION_MODES.map((mode) => (
                                <button
                                    key={mode.value}
                                    type="button"
                                    onClick={() => setParams({ ...params, optimizationMode: mode.value })}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${params.optimizationMode === mode.value
                                        ? 'border-violet-500 bg-violet-50'
                                        : 'border-stone-200 hover:border-stone-300'
                                        }`}
                                >
                                    <p className="font-bold text-xs leading-tight">{mode.label}</p>
                                </button>
                            ))}
                        </div>
                        {selectedMode && (
                            <p className="text-xs text-muted-foreground bg-stone-50 p-2.5 rounded-lg border">
                                {selectedMode.desc}
                            </p>
                        )}
                    </div>

                    {/* Content Goal */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            Content Goal
                        </label>
                        <Select value={params.contentGoal} onValueChange={(v) => setParams({ ...params, contentGoal: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {CONTENT_GOALS.map((g) => (
                                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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

                    {/* Reference Images Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-teal-600" />
                            Reference Images (optional)
                        </label>
                        <p className="text-xs text-muted-foreground -mt-1">
                            Upload images you want the AI to analyze and embed in the article. Max 5.
                        </p>

                        {/* Uploaded images grid */}
                        {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {uploadedImages.map((img, i) => (
                                    <div key={i} className="relative group rounded-lg overflow-hidden border bg-stone-50">
                                        <img src={img.url} alt={img.name} className="w-full aspect-square object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        <p className="text-[10px] text-center truncate px-1 py-0.5 bg-white/80">{img.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload button */}
                        {uploadedImages.length < 5 && (
                            <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed rounded-xl cursor-pointer hover:bg-stone-50 transition-colors text-sm text-muted-foreground">
                                {isUploading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                ) : (
                                    <><UploadCloud className="w-4 h-4" /> Click to upload images</>
                                )}
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        )}
                    </div>

                    {/* Brand voice reminder */}
                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        <Brain className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                        <span>
                            <strong>Brand Voice Active:</strong> All content is written as Farjad — first person, with 17y experience, honest mentorship perspective, and a lead-gen CTA embedded naturally.
                        </span>
                    </div>

                    {/* Social Auto-Publish */}
                    <div className="space-y-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Send className="w-4 h-4 text-slate-600" />
                            Auto-Publish to Social After Saving
                        </label>
                        <p className="text-xs text-muted-foreground -mt-1">Select which platforms to auto-publish to when you save this article.</p>
                        <div className="flex gap-4 mt-1">
                            {/* Telegram */}
                            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${
                                socialPlatforms.telegram
                                    ? 'border-[#229ED9] bg-[#229ED9]/10 text-[#1a7ba8]'
                                    : 'border-slate-200 text-slate-400 hover:border-slate-300'
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={socialPlatforms.telegram}
                                    onChange={(e) => setSocialPlatforms(p => ({ ...p, telegram: e.target.checked }))}
                                    className="hidden"
                                />
                                <Send className="w-3.5 h-3.5" />
                                Telegram
                            </label>
                            {/* Twitter/X */}
                            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${
                                socialPlatforms.twitter
                                    ? 'border-black bg-black/10 text-black'
                                    : 'border-slate-200 text-slate-400 hover:border-slate-300'
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={socialPlatforms.twitter}
                                    onChange={(e) => setSocialPlatforms(p => ({ ...p, twitter: e.target.checked }))}
                                    className="hidden"
                                />
                                <Twitter className="w-3.5 h-3.5" />
                                X / Twitter
                            </label>
                            {/* LinkedIn */}
                            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${
                                socialPlatforms.linkedin
                                    ? 'border-[#0A66C2] bg-[#0A66C2]/10 text-[#0A66C2]'
                                    : 'border-slate-200 text-slate-400 hover:border-slate-300'
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={socialPlatforms.linkedin}
                                    onChange={(e) => setSocialPlatforms(p => ({ ...p, linkedin: e.target.checked }))}
                                    className="hidden"
                                />
                                <Linkedin className="w-3.5 h-3.5" />
                                LinkedIn
                            </label>
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
                                    placeholder="e.g. startup mentorship, product market fit, fundraising Canada"
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
                                Writing your article...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate {params.optimizationMode}-Optimized Article
                            </>
                        )}
                    </Button>

                    {isGenerating && (
                        <p className="text-xs text-center text-muted-foreground animate-pulse">
                            GPT-4o is writing your {params.optimizationMode.toLowerCase()}-optimized article in Farjad&apos;s voice
                            {params.generateImage ? ' + DALL-E 3 is creating the cover image' : ''}.
                            This may take 30–60 seconds...
                        </p>
                    )}

                    {/* Preview */}
                    {preview && (
                        <div className="border rounded-xl overflow-hidden">
                            {preview.coverImageUrl && (
                                <div className="relative aspect-video w-full bg-stone-100">
                                    <img src={preview.coverImageUrl} alt="Generated cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-5 space-y-3">
                                {/* Mode badge */}
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${modeColors[preview.optimizationMode] || ''}`}>
                                        {preview.optimizationMode}
                                    </span>
                                    {preview.schemaType && (
                                        <span className="text-[10px] text-stone-400 font-mono">Schema: {preview.schemaType}</span>
                                    )}
                                </div>

                                <h3 className="font-serif text-xl font-bold">{preview.title}</h3>
                                <p className="text-sm text-muted-foreground italic">{preview.excerpt}</p>
                                <div className="text-xs text-stone-400 space-y-1 border-t pt-3">
                                    <p><span className="font-semibold text-stone-600">Slug:</span> /{preview.slug}</p>
                                    <p><span className="font-semibold text-stone-600">SEO Title:</span> {preview.seoTitle}</p>
                                    <p><span className="font-semibold text-stone-600">Meta Desc:</span> {preview.seoDescription}</p>
                                    <p><span className="font-semibold text-stone-600">Keywords:</span> {preview.seoKeywords}</p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button type="button" onClick={handleUse} className="flex-1 bg-[#1B4B43] hover:bg-[#133832] text-white font-bold">
                                        Use This Article ✓
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setPreview(null)} className="gap-1">
                                        <X className="w-4 h-4" /> Discard
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleGenerate} disabled={isGenerating} className="gap-1">
                                        <Sparkles className="w-4 h-4" /> Redo
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
