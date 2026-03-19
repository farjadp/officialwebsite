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
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useState, useCallback, useRef } from 'react'
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
    Table as TableIcon,
    Trash,
    Columns,
    Rows,
    Plus,
    Minus,
    BookOpen
} from 'lucide-react'
import { toast } from 'sonner'

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

    const [relatedOpen, setRelatedOpen] = useState(false)
    const [publishedPosts, setPublishedPosts] = useState<{slug: string, title: string}[]>([])
    const [loadingPosts, setLoadingPosts] = useState(false)

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
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'w-full border-collapse border border-stone-300 my-4 table-auto',
                },
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: 'border-b border-stone-200',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-stone-300 bg-stone-100 px-4 py-2 font-semibold text-left',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-stone-300 px-4 py-2',
                },
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

    const fetchPublishedPosts = useCallback(async () => {
        if (publishedPosts.length > 0) return
        setLoadingPosts(true)
        try {
            const res = await fetch('/api/admin/posts?status=PUBLISHED')
            const data = await res.json()
            if (Array.isArray(data)) setPublishedPosts(data)
        } catch {}
        setLoadingPosts(false)
    }, [publishedPosts.length])

    const insertRelatedArticle = useCallback((slug: string) => {
        if (!editor) return
        editor.chain().focus().insertContent(`[RELATED_ARTICLE slug="${slug}"]`).run()
        setRelatedOpen(false)
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

    const addImageURL = useCallback(() => {
        if (!editor) return
        const url = window.prompt('Image URL (or just upload from the icon next to it)')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !editor) return
        
        setIsUploadingImage(true)
        const toastId = toast.loading('Uploading image...')
        const formData = new FormData()
        formData.append('file', file)
        
        try {
            const res = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData
            })
            if (!res.ok) throw new Error('Upload failed')
            
            const data = await res.json()
            editor.chain().focus().setImage({ src: data.url }).run()
            toast.success('Image uploaded successfully', { id: toastId })
        } catch (error) {
            toast.error('Failed to upload image', { id: toastId })
        } finally {
            setIsUploadingImage(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

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

                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage} title="Upload Image">
                        {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                    </Button>
                    <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={uploadImage} />

                    <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-muted' : ''} title="Set Link">
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                    
                    <div className="w-px h-6 bg-border mx-1 my-auto" />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className={editor.isActive('table') ? 'bg-muted' : ''} title="Table">
                                <TableIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-1 flex items-center gap-1" align="start">
                            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
                                <TableIcon className="h-4 w-4 mr-2" /> Insert
                            </Button>
                            <div className="w-px h-6 bg-border mx-1 my-auto" />
                            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()} title="Add Column">
                                <Columns className="h-4 w-4" /> <Plus className="h-3 w-3 ml-1" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()} title="Delete Column">
                                <Columns className="h-4 w-4 text-red-500" /> <Minus className="h-3 w-3 ml-1 text-red-500" />
                            </Button>
                            <div className="w-px h-6 bg-border mx-1 my-auto" />
                            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()} title="Add Row">
                                <Rows className="h-4 w-4" /> <Plus className="h-3 w-3 ml-1" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()} title="Delete Row">
                                <Rows className="h-4 w-4 text-red-500" /> <Minus className="h-3 w-3 ml-1 text-red-500" />
                            </Button>
                            <div className="w-px h-6 bg-border mx-1 my-auto" />
                            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()} title="Delete Table">
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </PopoverContent>
                    </Popover>

                    <div className="w-px h-6 bg-border mx-1 my-auto" />

                    <Popover open={relatedOpen} onOpenChange={(open) => { setRelatedOpen(open); if (open) fetchPublishedPosts() }}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                title="Insert Related Article"
                                className="gap-1.5 text-blue-700 hover:bg-blue-50"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span className="text-xs font-semibold hidden sm:inline">Related Article</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-2" align="start">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 pb-2">Insert Related Article</p>
                            {loadingPosts ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
                                </div>
                            ) : publishedPosts.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-4">No published posts found.</p>
                            ) : (
                                <div className="space-y-1 max-h-60 overflow-y-auto">
                                    {publishedPosts.map(post => (
                                        <button
                                            key={post.slug}
                                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                                            onClick={() => insertRelatedArticle(post.slug)}
                                        >
                                            <p className="text-sm font-medium text-stone-800 leading-snug">{post.title}</p>
                                            <p className="text-[10px] text-stone-400 font-mono mt-0.5">[RELATED_ARTICLE slug=&quot;{post.slug}&quot;]</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>

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
