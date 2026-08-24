"use client"

// ============================================================================
// Hardware Source: email-editor.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Block canvas + inspector + AI panel — the campaign authoring surface
// Env / Identity: Client Component
// ============================================================================

import { useCallback, useMemo, useState, useTransition } from "react"
import {
    Type, Heading as HeadingIcon, Image as ImageIcon, MousePointerClick, Minus,
    MoveVertical, Columns2, Share2, Play, Quote as QuoteIcon, Code2,
    ChevronUp, ChevronDown, Copy, Trash2, Monitor, Smartphone, Eye, Save,
    Loader2, Sparkles, PanelRightClose, PanelRightOpen,
} from "lucide-react"
import {
    type Block, type BlockType, type EmailTheme,
    createBlock, blockId, DEFAULT_THEME, BLOCK_LABELS,
} from "@/lib/email/blocks"
import { renderEmail } from "@/lib/email/render"
import { sanitizeEmailHtml } from "@/lib/email/sanitize"
import { RichTextEditor } from "./rich-text-editor"
import { BlockInspector } from "./block-inspector"
import { AiAssistant } from "./ai-assistant"
import { cn } from "@/lib/utils"

const PALETTE: { type: BlockType; icon: typeof Type }[] = [
    { type: "heading", icon: HeadingIcon },
    { type: "text", icon: Type },
    { type: "image", icon: ImageIcon },
    { type: "button", icon: MousePointerClick },
    { type: "columns", icon: Columns2 },
    { type: "quote", icon: QuoteIcon },
    { type: "divider", icon: Minus },
    { type: "spacer", icon: MoveVertical },
    { type: "social", icon: Share2 },
    { type: "video", icon: Play },
    { type: "html", icon: Code2 },
]

/** Deep-clones a block and gives it a fresh id so duplicates stay independent. */
function cloneBlock(block: Block): Block {
    return { ...structuredClone(block), id: blockId() }
}

interface CanvasBlockProps {
    block: Block
    theme: EmailTheme
    selected: boolean
    onSelect: () => void
    onChange: (patch: Record<string, unknown>) => void
    onMove: (direction: -1 | 1) => void
    onDuplicate: () => void
    onDelete: () => void
    onAiRewrite: (html: string, replace: (html: string) => void) => void
    isFirst: boolean
    isLast: boolean
}

function CanvasBlock({
    block, theme, selected, onSelect, onChange,
    onMove, onDuplicate, onDelete, onAiRewrite, isFirst, isLast,
}: CanvasBlockProps) {
    const padding = block.padding ?? [12, 32, 12, 32]

    return (
        <div
            onClick={onSelect}
            className={cn(
                "group relative cursor-pointer transition-shadow",
                selected ? "ring-2 ring-violet-500 ring-offset-1" : "hover:ring-1 hover:ring-violet-300"
            )}
            style={{
                paddingTop: padding[0],
                paddingRight: padding[1],
                paddingBottom: padding[2],
                paddingLeft: padding[3],
                backgroundColor: block.backgroundColor ?? "transparent",
            }}
        >
            <div
                className={cn(
                    "absolute -top-3 z-10 flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1 py-0.5 shadow-sm transition-opacity",
                    theme.direction === "rtl" ? "left-2" : "right-2",
                    selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
            >
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {BLOCK_LABELS[block.type]}
                </span>
                {[
                    { icon: ChevronUp, action: () => onMove(-1), disabled: isFirst, title: "Move up" },
                    { icon: ChevronDown, action: () => onMove(1), disabled: isLast, title: "Move down" },
                    { icon: Copy, action: onDuplicate, disabled: false, title: "Duplicate" },
                ].map(({ icon: Icon, action, disabled, title }) => (
                    <button
                        key={title}
                        type="button"
                        title={title}
                        disabled={disabled}
                        onClick={(event) => {
                            event.stopPropagation()
                            action()
                        }}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
                    >
                        <Icon className="h-3.5 w-3.5" />
                    </button>
                ))}
                <button
                    type="button"
                    title="Delete"
                    onClick={(event) => {
                        event.stopPropagation()
                        onDelete()
                    }}
                    className="rounded p-1 text-rose-500 hover:bg-rose-50"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            {block.type === "heading" && (
                <input
                    value={block.text}
                    onChange={(event) => onChange({ text: event.target.value })}
                    onClick={(event) => event.stopPropagation()}
                    className="w-full border-0 bg-transparent p-0 font-bold outline-none"
                    style={{
                        fontSize: block.fontSize ?? { 1: 30, 2: 24, 3: 20 }[block.level],
                        color: block.color ?? theme.textColor,
                        textAlign: block.align,
                        fontFamily: theme.fontFamily,
                        lineHeight: 1.3,
                    }}
                />
            )}

            {block.type === "text" && (
                <div onClick={(event) => event.stopPropagation()}>
                    <RichTextEditor
                        value={block.html}
                        onChange={(html) => onChange({ html })}
                        direction={theme.direction}
                        minHeight={100}
                        onAiRewrite={onAiRewrite}
                    />
                </div>
            )}

            {block.type === "image" &&
                (block.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={block.src}
                        alt={block.alt}
                        style={{
                            width: "100%",
                            maxWidth: block.width ?? theme.width,
                            borderRadius: block.radius ?? 0,
                            marginLeft: block.align === "center" ? "auto" : block.align === "right" ? "auto" : 0,
                            marginRight: block.align === "center" ? "auto" : block.align === "left" ? "auto" : 0,
                            display: "block",
                        }}
                    />
                ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
                        Pick an image in the panel on the right
                    </div>
                ))}

            {block.type === "button" && (
                <div style={{ textAlign: block.align }}>
                    <span
                        style={{
                            display: "inline-block",
                            padding: "14px 32px",
                            backgroundColor: block.backgroundColorButton ?? theme.accentColor,
                            color: block.textColor ?? "#ffffff",
                            borderRadius: block.radius ?? theme.radius,
                            fontFamily: theme.fontFamily,
                            fontSize: block.fontSize ?? 16,
                            fontWeight: 600,
                            width: block.fullWidth ? "100%" : undefined,
                            textAlign: "center",
                        }}
                    >
                        {block.label}
                    </span>
                </div>
            )}

            {block.type === "divider" && (
                <hr
                    style={{
                        border: 0,
                        borderTop: `${block.thickness ?? 1}px solid ${block.color ?? "#e4e4e7"}`,
                        width: `${block.width ?? 100}%`,
                        margin: "0 auto",
                    }}
                />
            )}

            {block.type === "spacer" && (
                <div
                    className="flex items-center justify-center rounded border border-dashed border-slate-200 text-[10px] text-slate-400"
                    style={{ height: block.height }}
                >
                    {block.height}px
                </div>
            )}

            {block.type === "columns" && (
                <div className="flex gap-3" onClick={(event) => event.stopPropagation()}>
                    {block.columns.map((column, index) => (
                        <div key={index} style={{ width: `${column.width}%` }}>
                            <RichTextEditor
                                value={column.html}
                                onChange={(html) => {
                                    const columns = block.columns.map((c, i) => (i === index ? { ...c, html } : c))
                                    onChange({ columns })
                                }}
                                direction={theme.direction}
                                minHeight={80}
                                compact
                            />
                        </div>
                    ))}
                </div>
            )}

            {block.type === "quote" && (
                <div
                    onClick={(event) => event.stopPropagation()}
                    style={{
                        [theme.direction === "rtl" ? "borderRight" : "borderLeft"]:
                            `3px solid ${block.accentColor ?? theme.accentColor}`,
                        paddingInlineStart: 16,
                    }}
                >
                    <RichTextEditor
                        value={block.html}
                        onChange={(html) => onChange({ html })}
                        direction={theme.direction}
                        minHeight={70}
                        compact
                    />
                    {block.cite && <p className="mt-1 text-sm text-slate-500">— {block.cite}</p>}
                </div>
            )}

            {block.type === "social" && (
                <div style={{ textAlign: block.align }} className="text-sm text-slate-500">
                    {block.links.map((link) => (
                        <span key={link.network} className="mx-1.5 capitalize">
                            {link.network}
                        </span>
                    ))}
                </div>
            )}

            {block.type === "video" &&
                (block.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={block.thumbnail} alt={block.alt} className="w-full rounded-md" />
                ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
                        Add a thumbnail and a video URL
                    </div>
                ))}

            {block.type === "html" && (
                <div onClick={(event) => event.stopPropagation()}>
                    <textarea
                        value={block.html}
                        onChange={(event) => onChange({ html: event.target.value })}
                        rows={6}
                        spellCheck={false}
                        className="w-full rounded-md border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-emerald-300 outline-none"
                    />
                    <div
                        className="mt-2 rounded-md border border-slate-200 p-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(block.html) }}
                    />
                </div>
            )}
        </div>
    )
}

export interface EmailEditorProps {
    initialBlocks: Block[]
    initialTheme: EmailTheme
    subject: string
    preheader: string
    fromEmail?: string
    onSave: (blocks: Block[], theme: EmailTheme) => Promise<void>
    onSubjectChange?: (subject: string, preheader: string) => void
    /**
     * Extra controls for the top bar. Receives the live document so an action
     * like "send a test" operates on what is on screen rather than on the last
     * saved row.
     */
    toolbarExtra?: (context: {
        blocks: Block[]
        theme: EmailTheme
        dirty: boolean
        save: () => Promise<void>
    }) => React.ReactNode
}

export function EmailEditor({
    initialBlocks,
    initialTheme,
    subject,
    preheader,
    fromEmail = "",
    onSave,
    onSubjectChange,
    toolbarExtra,
}: EmailEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
    const [theme, setTheme] = useState<EmailTheme>({ ...DEFAULT_THEME, ...initialTheme })
    const [selectedId, setSelectedId] = useState<string | null>(initialBlocks[0]?.id ?? null)
    const [mode, setMode] = useState<"edit" | "preview">("edit")
    const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
    const [showAi, setShowAi] = useState(true)
    const [dirty, setDirty] = useState(false)
    const [saving, startSave] = useTransition()

    const selected = useMemo(() => blocks.find((b) => b.id === selectedId) ?? null, [blocks, selectedId])

    const mutate = useCallback((next: Block[]) => {
        setBlocks(next)
        setDirty(true)
    }, [])

    const addBlock = (type: BlockType) => {
        const block = createBlock(type)
        const index = selectedId ? blocks.findIndex((b) => b.id === selectedId) : blocks.length - 1
        const next = [...blocks]
        next.splice(index + 1, 0, block)
        mutate(next)
        setSelectedId(block.id)
    }

    const patchBlock = (id: string, patch: Record<string, unknown>) => {
        mutate(blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)))
    }

    const moveBlock = (id: string, direction: -1 | 1) => {
        const index = blocks.findIndex((b) => b.id === id)
        const target = index + direction
        if (index < 0 || target < 0 || target >= blocks.length) return
        const next = [...blocks]
        ;[next[index], next[target]] = [next[target], next[index]]
        mutate(next)
    }

    const previewHtml = useMemo(
        () =>
            renderEmail(blocks, {
                theme,
                preheader,
                unsubscribeUrl: "#",
                preferencesUrl: "#",
                postalAddress: "Newmarket, Ontario, Canada",
            }).html,
        [blocks, theme, preheader]
    )

    const aiRewrite = useCallback((html: string, replace: (html: string) => void) => {
        const instruction = window.prompt(
            "How should this be rewritten?\n\nExamples: shorten it · make it punchier · translate to Persian · fix grammar",
            "make it punchier"
        )
        if (!instruction) return

        const modeMap: Record<string, string> = {
            shorten: "shorten", short: "shorten", expand: "expand",
            punchier: "punchier", warmer: "warmer", formal: "formal",
            simplify: "simplify", grammar: "fix-grammar",
            persian: "translate-fa", farsi: "translate-fa", english: "translate-en",
        }
        const key = Object.keys(modeMap).find((k) => instruction.toLowerCase().includes(k))

        void fetch("/api/email/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                task: "rewrite",
                html,
                mode: key ? modeMap[key] : "punchier",
                instruction,
            }),
        })
            .then((response) => response.json())
            .then((data: { html?: string; error?: string }) => {
                if (data.error) window.alert(data.error)
                else if (data.html) replace(data.html)
            })
            .catch(() => window.alert("AI rewrite failed"))
    }, [])

    const persist = useCallback(async () => {
        await onSave(blocks, theme)
        setDirty(false)
    }, [blocks, theme, onSave])

    const save = () => startSave(persist)

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50/70 px-3 py-2">
                <div className="flex rounded-md bg-slate-200/70 p-0.5">
                    {([
                        ["edit", "Edit"],
                        ["preview", "Preview"],
                    ] as const).map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setMode(key)}
                            className={cn(
                                "rounded px-3 py-1 text-xs font-medium transition-colors",
                                mode === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex rounded-md bg-slate-200/70 p-0.5">
                    {([
                        ["desktop", Monitor],
                        ["mobile", Smartphone],
                    ] as const).map(([key, Icon]) => (
                        <button
                            key={key}
                            type="button"
                            title={key}
                            onClick={() => setDevice(key)}
                            className={cn(
                                "rounded px-2.5 py-1 transition-colors",
                                device === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                    {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
                    {toolbarExtra?.({ blocks, theme, dirty, save: persist })}
                    <button
                        type="button"
                        onClick={() => setShowAi((v) => !v)}
                        title={showAi ? "Hide AI panel" : "Show AI panel"}
                        className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400"
                    >
                        {showAi ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
                        <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save
                    </button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1">
                {mode === "edit" && (
                    <aside className="hidden w-[92px] shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50/50 p-2 lg:block">
                        {PALETTE.map(({ type, icon: Icon }) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => addBlock(type)}
                                className="mb-1.5 flex w-full flex-col items-center gap-1 rounded-lg border border-transparent px-1 py-2.5 text-[10px] font-medium text-slate-600 transition-colors hover:border-violet-300 hover:bg-white hover:text-violet-700"
                            >
                                <Icon className="h-4 w-4" />
                                {BLOCK_LABELS[type]}
                            </button>
                        ))}
                    </aside>
                )}

                <div className="min-w-0 flex-1 overflow-y-auto p-6" style={{ backgroundColor: theme.pageBackground }}>
                    {mode === "preview" ? (
                        <iframe
                            title="Email preview"
                            srcDoc={previewHtml}
                            className="mx-auto block h-[calc(100vh-11rem)] w-full rounded-lg border border-slate-200 bg-white"
                            style={{ maxWidth: device === "mobile" ? 400 : theme.width + 48 }}
                        />
                    ) : (
                        <div
                            className="mx-auto"
                            style={{
                                maxWidth: device === "mobile" ? 380 : theme.width,
                                backgroundColor: theme.contentBackground,
                                borderRadius: theme.radius,
                                direction: theme.direction,
                            }}
                        >
                            {blocks.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
                                    <Eye className="h-6 w-6 text-slate-300" />
                                    <p className="text-sm text-slate-400">
                                        Empty canvas. Add a block from the left, or generate a draft with AI.
                                    </p>
                                </div>
                            )}
                            {blocks.map((block, index) => (
                                <CanvasBlock
                                    key={block.id}
                                    block={block}
                                    theme={theme}
                                    selected={block.id === selectedId}
                                    isFirst={index === 0}
                                    isLast={index === blocks.length - 1}
                                    onSelect={() => setSelectedId(block.id)}
                                    onChange={(patch) => patchBlock(block.id, patch)}
                                    onMove={(direction) => moveBlock(block.id, direction)}
                                    onDuplicate={() => {
                                        const copy = cloneBlock(block)
                                        const next = [...blocks]
                                        next.splice(index + 1, 0, copy)
                                        mutate(next)
                                        setSelectedId(copy.id)
                                    }}
                                    onDelete={() => {
                                        mutate(blocks.filter((b) => b.id !== block.id))
                                        if (selectedId === block.id) setSelectedId(null)
                                    }}
                                    onAiRewrite={aiRewrite}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {mode === "edit" && (
                    <aside className="hidden w-[300px] shrink-0 overflow-hidden border-l border-slate-200 xl:block">
                        <BlockInspector
                            block={selected}
                            theme={theme}
                            onBlockChange={(patch) => selected && patchBlock(selected.id, patch as Record<string, unknown>)}
                            onThemeChange={(patch) => {
                                setTheme((current) => ({ ...current, ...patch }))
                                setDirty(true)
                            }}
                        />
                    </aside>
                )}

                {showAi && (
                    <aside className="hidden w-[320px] shrink-0 overflow-hidden border-l border-slate-200 2xl:block">
                        <AiAssistant
                            subject={subject}
                            preheader={preheader}
                            fromEmail={fromEmail}
                            blocks={blocks}
                            html={previewHtml}
                            locale={theme.direction === "rtl" ? "fa" : "en"}
                            onApplyDraft={(draft) => {
                                mutate(draft.blocks)
                                setSelectedId(draft.blocks[0]?.id ?? null)
                                onSubjectChange?.(draft.subject, draft.preheader)
                            }}
                            onApplySubject={(nextSubject, nextPreheader) =>
                                onSubjectChange?.(nextSubject, nextPreheader)
                            }
                        />
                    </aside>
                )}
            </div>
        </div>
    )
}
