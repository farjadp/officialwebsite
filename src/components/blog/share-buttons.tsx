'use client'

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from "react"
import { toast } from "sonner"

interface ShareButtonsProps {
    title: string
    slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    // We can confidently use window here because it's a client component
    // effectively guarded by the fact it's interactive, but for SSR safety in hydration:
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const shareUrl = `${origin}/blog/${slug}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex gap-4">
            <Button variant="outline" size="icon" asChild>
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Twitter className="h-4 w-4" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Linkedin className="h-4 w-4" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Facebook className="h-4 w-4" />
                </a>
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            </Button>
        </div>
    )
}
