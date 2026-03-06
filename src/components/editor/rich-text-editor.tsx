'use client'

// ============================================================================
// Hardware Source: rich-text-editor.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Reusable UI component
// Env / Identity: Client Component
// ============================================================================

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    FileText,
    Loader2,
} from 'lucide-react'

interface VaultAsset {
    id: string
    topic: string
    type: string
}

// Define props for the editor
interface RichTextEditorProps {
    value?: string
    onChange?: (content: string) => void
    editable?: boolean
}

export function RichTextEditor({ value = '', onChange, editable = true }: RichTextEditorProps) {
    const [vaultOpen, setVaultOpen] = useState(false)
    const [vaultAssets, setVaultAssets] = useState<VaultAsset[]>([])
    const [loadingVaults, setLoadingVaults] = useState(false)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: 'Write something amazing...',
            }),
        ],
        content: value,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]',
            },
        },
    })

    const fetchVaultAssets = useCallback(async () => {
        if (vaultAssets.length > 0) return
        setLoadingVaults(true)
        try {
            const res = await fetch('/api/admin/ai-tools?type=vault')
            const data = await res.json()
            if (data.success) setVaultAssets(data.assets)
        } catch {}
        setLoadingVaults(false)
    }, [vaultAssets.length])

    const insertVaultAsset = useCallback((id: string) => {
        if (!editor) return
        editor.chain().focus().insertContent(`[VAULT_ASSET id="${id}"]`).run()
        setVaultOpen(false)
    }, [editor])

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) return

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('Image URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    // Custom file upload handler could be added here
    // For now simple URL prompt is fallback

    if (!editor) {
        return null
    }

    return (
        <div className="rounded-md border border-input bg-background ring-offset-background">
            {editable && (
                <div className="border-b bg-muted/40 p-2 flex flex-wrap gap-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('strike')}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough className="h-4 w-4" />
                    </Toggle>

                    <div className="w-px h-6 bg-border mx-1 my-auto" />

                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    >
                        <Heading1 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 3 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        <Heading3 className="h-4 w-4" />
                    </Toggle>

                    <div className="w-px h-6 bg-border mx-1 my-auto" />

                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('blockquote')}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('codeBlock')}
                        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                    >
                        <Code className="h-4 w-4" />
                    </Toggle>

                    <div className="w-px h-6 bg-border mx-1 my-auto" />

                    <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-muted' : ''}>
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={addImage}>
                        <ImageIcon className="h-4 w-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1 my-auto" />

                    <Popover open={vaultOpen} onOpenChange={(open) => { setVaultOpen(open); if (open) fetchVaultAssets() }}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                title="Insert Vault Asset"
                                className="gap-1.5 text-[#1B4B43] hover:bg-[#1B4B43]/10"
                            >
                                <FileText className="h-4 w-4" />
                                <span className="text-xs font-semibold hidden sm:inline">Vault Asset</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-2" align="start">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 pb-2">Insert Vault Asset Shortcode</p>
                            {loadingVaults ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-[#1B4B43]" />
                                </div>
                            ) : vaultAssets.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-4">No vault assets found. Generate one first.</p>
                            ) : (
                                <div className="space-y-1 max-h-60 overflow-y-auto">
                                    {vaultAssets.map(asset => (
                                        <button
                                            key={asset.id}
                                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                                            onClick={() => insertVaultAsset(asset.id)}
                                        >
                                            <p className="text-sm font-medium text-stone-800 leading-snug">{asset.topic}</p>
                                            <p className="text-[10px] text-stone-400 font-mono mt-0.5">[VAULT_ASSET id=&quot;{asset.id}&quot;]</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>

                    <div className="ml-auto flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            <EditorContent editor={editor} className="p-4" />
        </div>
    )
}
