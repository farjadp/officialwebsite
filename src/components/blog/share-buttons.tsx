'use client'

// ============================================================================
// File Path: src/components/blog/share-buttons.tsx
// Why: Sharing a post, in the v3 "Light" look — real labelled controls on the
//      warm charcoal ground instead of four unlabelled light squares. Every
//      target is at least 44px, the icon-only copy control carries an
//      aria-label and a live region, and every outbound link is
//      rel="noopener noreferrer".
//
//      The clipboard copy and the toast are the v2 component's, untouched.
// Env / Identity: Client Component
// ============================================================================

import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface ShareButtonsProps {
    title: string
    slug: string
}

const CONTROL =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-v3-line px-4 py-2.5 text-sm text-v3-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-light/60 hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    // The origin is read after mount, not during render: reading it during
    // render made the server emit a relative URL and the client an absolute
    // one, which React reported as a hydration mismatch on every post.
    const [origin, setOrigin] = useState('')
    useEffect(() => setOrigin(window.location.origin), [])
    const shareUrl = `${origin}/blog/${slug}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-wrap items-center gap-2.5">
            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={CONTROL}
            >
                <Twitter className="h-4 w-4" aria-hidden />
                Twitter
            </a>
            <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={CONTROL}
            >
                <Linkedin className="h-4 w-4" aria-hidden />
                LinkedIn
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={CONTROL}
            >
                <Facebook className="h-4 w-4" aria-hidden />
                Facebook
            </a>
            <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Link copied" : "Copy link"}
                className={`${CONTROL} min-w-11`}
            >
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <LinkIcon className="h-4 w-4" aria-hidden />}
                <span aria-hidden>{copied ? "Copied" : "Copy link"}</span>
            </button>
        </div>
    )
}
