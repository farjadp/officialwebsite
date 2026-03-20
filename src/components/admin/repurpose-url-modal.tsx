'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Link2, Sparkles, Loader2, Send, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface RepurposedData {
    title: string
    slug: string
    excerpt: string
    content: string
    seoTitle: string
    seoDescription: string
    seoKeywords: string
    coverImageUrl: string | null
    categoryName?: string
    subcategoryName?: string
    socialPlatforms?: { telegram: boolean; twitter: boolean; linkedin: boolean }
}

interface RepurposeUrlModalProps {
    onGenerated: (data: RepurposedData) => void
}

export function RepurposeUrlModal({ onGenerated }: RepurposeUrlModalProps) {
    const [open, setOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [url, setUrl] = useState('')
    const [socialPlatforms, setSocialPlatforms] = useState({
        telegram: true,
        twitter: true,
        linkedin: true,
    })

    const handleGenerate = async () => {
        if (!url.trim()) {
            toast.error('Please enter a valid URL')
            return
        }
        setIsGenerating(true)
        try {
            const res = await fetch('/api/admin/repurpose-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
            const json = await res.json()
            if (!res.ok || !json.success) throw new Error(json.error || 'Failed to repurpose')
            
            // Pass the data back to the editor form
            const anySelected = socialPlatforms.telegram || socialPlatforms.twitter || socialPlatforms.linkedin
            onGenerated({
                ...json.data,
                coverImageUrl: null,
                socialPlatforms: anySelected ? socialPlatforms : undefined
            })
            
            toast.success('Successfully extracted and populated the editor!')
            setOpen(false)
            setUrl('')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Something went wrong'
            toast.error(msg)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold"
                >
                    <Link2 className="w-4 h-4" />
                    Repurpose from URL
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Link2 className="w-5 h-5 text-emerald-600" />
                        Repurpose Content from URL
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Paste a link from Twitter, Medium, LinkedIn, etc. The AI will extract the content, rewrite it into an English web article for your site, and prepare the Telegram/LinkedIn texts for auto-publish.
                    </p>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Source URL *</label>
                        <Input
                            placeholder="https://x.com/your-username/status/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Send className="w-4 h-4 text-slate-600" />
                            Auto-Publish to Social After Saving
                        </label>
                        <p className="text-xs text-muted-foreground -mt-1">
                            The Waterfall pipeline generates short Persian for Telegram and attractive English for LinkedIn.
                        </p>
                        <div className="flex gap-4 mt-1">
                            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${socialPlatforms.telegram ? 'border-[#229ED9] bg-[#229ED9]/10 text-[#1a7ba8]' : 'border-slate-200 text-slate-400'}`}>
                                <input
                                    type="checkbox"
                                    checked={socialPlatforms.telegram}
                                    onChange={(e) => setSocialPlatforms(p => ({ ...p, telegram: e.target.checked }))}
                                    className="hidden"
                                />
                                <Send className="w-3.5 h-3.5" /> Telegram
                            </label>
                            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${socialPlatforms.twitter ? 'border-black bg-black/10 text-black' : 'border-slate-200 text-slate-400'}`}>
                                <input
                                    type="checkbox"
                                    checked={socialPlatforms.twitter}
                                    onChange={(e) => setSocialPlatforms(p => ({ ...p, twitter: e.target.checked }))}
                                    className="hidden"
                                />
                                <Twitter className="w-3.5 h-3.5" /> X / Twitter
                            </label>
                            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${socialPlatforms.linkedin ? 'border-[#0A66C2] bg-[#0A66C2]/10 text-[#0A66C2]' : 'border-slate-200 text-slate-400'}`}>
                                <input
                                    type="checkbox"
                                    checked={socialPlatforms.linkedin}
                                    onChange={(e) => setSocialPlatforms(p => ({ ...p, linkedin: e.target.checked }))}
                                    className="hidden"
                                />
                                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                            </label>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating || !url.trim()}
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Extracting and processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Extract & Populate Editor
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
