"use client"

// ============================================================================
// Hardware Source: rich-text-editor.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Full-featured rich text surface for email text blocks
// Env / Identity: Client Component
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle, Color, FontFamily, FontSize, BackgroundColor } from "@tiptap/extension-text-style"
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table"
import { Placeholder } from "@tiptap/extensions"
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link2, Link2Off,
    List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Table as TableIcon, ImagePlus, Undo2, Redo2, Type, Palette, Heading2, Heading3,
    Rows3, Columns3, Trash2, Loader2, RemoveFormatting, Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"]
const FONT_FAMILIES = [
    { label: "System", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
    { label: "Dana (FA)", value: "dana, Tahoma, 'Segoe UI', Arial, sans-serif" },
    { label: "IRANSansX (FA)", value: "iransans, Tahoma, 'Segoe UI', Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
    { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
    { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
    { label: "Tahoma (FA)", value: "Tahoma, 'Segoe UI', Arial, sans-serif" },
    { label: "Courier", value: "'Courier New', Courier, monospace" },
]
const SWATCHES = [
    "#18181b", "#52525b", "#a1a1aa", "#7c3aed", "#2563eb", "#0891b2",
    "#059669", "#ca8a04", "#ea580c", "#dc2626", "#db2777", "#ffffff",
]

interface ToolButtonProps {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
}

function ToolButton({ onClick, active, disabled, title, children }: ToolButtonProps) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={active}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClick}
            className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors",
                "hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40",
                active && "bg-violet-100 text-violet-700 hover:bg-violet-100 hover:text-violet-700"
            )}
        >
            {children}
        </button>
    )
}

function Divider() {
    return <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />
}

function ColorPicker({
    editor,
    kind,
}: {
    editor: Editor
    kind: "text" | "highlight"
}) {
    const [open, setOpen] = useState(false)

    const apply = (color: string) => {
        if (kind === "text") editor.chain().focus().setColor(color).run()
        else editor.chain().focus().setBackgroundColor(color).run()
        setOpen(false)
    }

    const clear = () => {
        if (kind === "text") editor.chain().focus().unsetColor().run()
        else editor.chain().focus().unsetBackgroundColor().run()
        setOpen(false)
    }

    return (
        <div className="relative">
            <ToolButton
                onClick={() => setOpen((v) => !v)}
                active={open}
                title={kind === "text" ? "Text colour" : "Highlight colour"}
            >
                {kind === "text" ? <Palette className="h-4 w-4" /> : <Type className="h-4 w-4" />}
            </ToolButton>
            {open && (
                <div className="absolute left-0 top-9 z-30 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                    <div className="grid grid-cols-6 gap-1.5">
                        {SWATCHES.map((color) => (
                            <button
                                key={color}
                                type="button"
                                title={color}
                                onClick={() => apply(color)}
                                style={{ backgroundColor: color }}
                                className="h-6 w-6 rounded border border-slate-200 transition-transform hover:scale-110"
                            />
                        ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-2">
                        <input
                            type="color"
                            onChange={(event) => apply(event.target.value)}
                            className="h-6 w-8 cursor-pointer rounded border border-slate-200 bg-white"
                            title="Custom colour"
                        />
                        <button
                            type="button"
                            onClick={clear}
                            className="text-xs text-slate-500 hover:text-slate-900"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
    direction?: "ltr" | "rtl"
    minHeight?: number
    /** Renders the AI rewrite affordances in the toolbar */
    onAiRewrite?: (selectionHtml: string, replace: (html: string) => void) => void
    compact?: boolean
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Write something worth opening…",
    direction = "ltr",
    minHeight = 180,
    onAiRewrite,
    compact = false,
}: RichTextEditorProps) {
    const [uploading, setUploading] = useState(false)
    const fileInput = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                link: false,
                underline: false,
            }),
            Underline,
            Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"] }),
            Image.configure({ inline: false, allowBase64: false }),
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            BackgroundColor,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        editorProps: {
            attributes: {
                dir: direction,
                class: "prose prose-sm max-w-none focus:outline-none px-4 py-3",
                style: `min-height:${minHeight}px`,
            },
        },
        onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    })

    // Reflect external changes (AI edits, template switches) without clobbering typing
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false })
        }
    }, [value, editor])

    const uploadImage = useCallback(
        async (file: File) => {
            if (!editor) return
            setUploading(true)
            try {
                const body = new FormData()
                body.append("file", file)
                const response = await fetch("/api/media/upload", { method: "POST", body })
                if (!response.ok) throw new Error("Upload failed")
                const { url } = (await response.json()) as { url: string }
                editor.chain().focus().setImage({ src: url }).run()
            } catch (error) {
                console.error(error)
                window.alert("Image upload failed. Try again.")
            } finally {
                setUploading(false)
            }
        },
        [editor]
    )

    const setLink = useCallback(() => {
        if (!editor) return
        const previous = editor.getAttributes("link").href as string | undefined
        const url = window.prompt("Link URL", previous ?? "https://")
        if (url === null) return
        if (!url.trim()) {
            editor.chain().focus().unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run()
    }, [editor])

    if (!editor) {
        return (
            <div
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50"
                style={{ minHeight }}
            >
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
        )
    }

    const inTable = editor.isActive("table")

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/80 px-2 py-1.5">
                <ToolButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo2 className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo2 className="h-4 w-4" />
                </ToolButton>

                <Divider />

                <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
                    <Bold className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
                    <Italic className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
                    <UnderlineIcon className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
                    <Strikethrough className="h-4 w-4" />
                </ToolButton>

                <ColorPicker editor={editor} kind="text" />
                <ColorPicker editor={editor} kind="highlight" />

                {!compact && (
                    <>
                        <Divider />
                        <select
                            aria-label="Font family"
                            className="h-8 max-w-[104px] rounded-md border border-slate-200 bg-white px-1.5 text-xs text-slate-700"
                            value={(editor.getAttributes("textStyle").fontFamily as string) ?? ""}
                            onChange={(event) =>
                                event.target.value
                                    ? editor.chain().focus().setFontFamily(event.target.value).run()
                                    : editor.chain().focus().unsetFontFamily().run()
                            }
                        >
                            <option value="">Font</option>
                            {FONT_FAMILIES.map((font) => (
                                <option key={font.label} value={font.value}>
                                    {font.label}
                                </option>
                            ))}
                        </select>
                        <select
                            aria-label="Font size"
                            className="h-8 rounded-md border border-slate-200 bg-white px-1.5 text-xs text-slate-700"
                            value={(editor.getAttributes("textStyle").fontSize as string) ?? ""}
                            onChange={(event) =>
                                event.target.value
                                    ? editor.chain().focus().setFontSize(event.target.value).run()
                                    : editor.chain().focus().unsetFontSize().run()
                            }
                        >
                            <option value="">Size</option>
                            {FONT_SIZES.map((size) => (
                                <option key={size} value={size}>
                                    {size.replace("px", "")}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <Divider />

                <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
                    <Heading2 className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
                    <Heading3 className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
                    <List className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
                    <ListOrdered className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
                    <Quote className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
                    <Code className="h-4 w-4" />
                </ToolButton>

                <Divider />

                {([
                    ["left", AlignLeft],
                    ["center", AlignCenter],
                    ["right", AlignRight],
                    ["justify", AlignJustify],
                ] as const).map(([align, Icon]) => (
                    <ToolButton
                        key={align}
                        onClick={() => editor.chain().focus().setTextAlign(align).run()}
                        active={editor.isActive({ textAlign: align })}
                        title={`Align ${align}`}
                    >
                        <Icon className="h-4 w-4" />
                    </ToolButton>
                ))}

                <Divider />

                <ToolButton onClick={setLink} active={editor.isActive("link")} title="Insert link">
                    <Link2 className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Remove link">
                    <Link2Off className="h-4 w-4" />
                </ToolButton>
                <ToolButton onClick={() => fileInput.current?.click()} disabled={uploading} title="Insert image">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                </ToolButton>
                <ToolButton
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    active={inTable}
                    title="Insert table"
                >
                    <TableIcon className="h-4 w-4" />
                </ToolButton>

                {inTable && (
                    <>
                        <ToolButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Add row">
                            <Rows3 className="h-4 w-4" />
                        </ToolButton>
                        <ToolButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add column">
                            <Columns3 className="h-4 w-4" />
                        </ToolButton>
                        <ToolButton onClick={() => editor.chain().focus().deleteTable().run()} title="Delete table">
                            <Trash2 className="h-4 w-4" />
                        </ToolButton>
                    </>
                )}

                <ToolButton
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    title="Clear formatting"
                >
                    <RemoveFormatting className="h-4 w-4" />
                </ToolButton>

                {onAiRewrite && (
                    <>
                        <Divider />
                        <button
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() =>
                                onAiRewrite(editor.getHTML(), (html) =>
                                    editor.commands.setContent(html, { emitUpdate: true })
                                )
                            }
                            className="flex h-8 items-center gap-1.5 rounded-md bg-violet-600 px-2.5 text-xs font-medium text-white transition-colors hover:bg-violet-700"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            AI
                        </button>
                    </>
                )}
            </div>

            <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void uploadImage(file)
                    event.target.value = ""
                }}
            />

            <EditorContent editor={editor} />
        </div>
    )
}
