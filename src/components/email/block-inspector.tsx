"use client"

// ============================================================================
// Hardware Source: block-inspector.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Property panel for the selected block and the global email theme
// Env / Identity: Client Component
// ============================================================================

import { useRef, useState } from "react"
import { Loader2, Upload, Trash2, Plus } from "lucide-react"
import type { Block, EmailTheme, Align, EmailWebfont } from "@/lib/email/blocks"
import { WEBFONTS, DEFAULT_THEME, fontStackFor } from "@/lib/email/blocks"
import { cn } from "@/lib/utils"

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-700">{label}</span>
            {children}
            {hint && <span className="block text-[11px] leading-snug text-slate-400">{hint}</span>}
        </label>
    )
}

const inputClass =
    "w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none transition-colors focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={cn(inputClass, props.className)} />
}

function NumberInput({
    value,
    onChange,
    min,
    max,
    suffix,
}: {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    suffix?: string
}) {
    return (
        <div className="relative">
            <input
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={(event) => onChange(Number(event.target.value))}
                className={cn(inputClass, suffix && "pr-8")}
            />
            {suffix && (
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {suffix}
                </span>
            )}
        </div>
    )
}

function ColorInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
            />
            <TextInput value={value} onChange={(event) => onChange(event.target.value)} className="font-mono text-xs" />
        </div>
    )
}

function AlignPicker({ value, onChange }: { value: Align; onChange: (value: Align) => void }) {
    return (
        <div className="grid grid-cols-3 gap-1 rounded-md bg-slate-100 p-1">
            {(["left", "center", "right"] as const).map((align) => (
                <button
                    key={align}
                    type="button"
                    onClick={() => onChange(align)}
                    className={cn(
                        "rounded px-2 py-1 text-xs font-medium capitalize transition-colors",
                        value === align ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    )}
                >
                    {align}
                </button>
            ))}
        </div>
    )
}

function ImageUploadField({
    value,
    onChange,
    label,
}: {
    value: string
    onChange: (url: string) => void
    label: string
}) {
    const input = useRef<HTMLInputElement>(null)
    const [busy, setBusy] = useState(false)

    const upload = async (file: File) => {
        setBusy(true)
        try {
            const body = new FormData()
            body.append("file", file)
            const response = await fetch("/api/media/upload", { method: "POST", body })
            if (!response.ok) throw new Error("Upload failed")
            const { url } = (await response.json()) as { url: string }
            onChange(url)
        } catch {
            window.alert("Upload failed. Try a smaller file.")
        } finally {
            setBusy(false)
        }
    }

    return (
        <Field label={label}>
            <div className="space-y-2">
                {value && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={value} alt="" className="h-24 w-full rounded-md border border-slate-200 object-cover" />
                )}
                <TextInput
                    value={value}
                    placeholder="https://…"
                    onChange={(event) => onChange(event.target.value)}
                />
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => input.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-violet-400 hover:text-violet-700 disabled:opacity-50"
                >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {busy ? "Uploading…" : "Upload image"}
                </button>
                <input
                    ref={input}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) void upload(file)
                        event.target.value = ""
                    }}
                />
            </div>
        </Field>
    )
}

export interface BlockInspectorProps {
    block: Block | null
    theme: EmailTheme
    onBlockChange: (patch: Partial<Block>) => void
    onThemeChange: (patch: Partial<EmailTheme>) => void
}

export function BlockInspector({ block, theme, onBlockChange, onThemeChange }: BlockInspectorProps) {
    const [tab, setTab] = useState<"block" | "theme">("block")
    const activeTab = block ? tab : "theme"

    const patch = onBlockChange as (patch: Record<string, unknown>) => void

    return (
        <div className="flex h-full flex-col">
            <div className="flex border-b border-slate-200">
                {(["block", "theme"] as const).map((key) => (
                    <button
                        key={key}
                        type="button"
                        disabled={key === "block" && !block}
                        onClick={() => setTab(key)}
                        className={cn(
                            "flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors disabled:opacity-40",
                            activeTab === key
                                ? "border-b-2 border-violet-600 text-violet-700"
                                : "text-slate-500 hover:text-slate-800"
                        )}
                    >
                        {key === "block" ? "Block" : "Design"}
                    </button>
                ))}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {activeTab === "theme" && (
                    <>
                        <Field label="Content width" hint="600px is the safe universal maximum.">
                            <NumberInput
                                value={theme.width}
                                min={320}
                                max={800}
                                suffix="px"
                                onChange={(width) => onThemeChange({ width })}
                            />
                        </Field>
                        <Field label="Page background">
                            <ColorInput value={theme.pageBackground} onChange={(pageBackground) => onThemeChange({ pageBackground })} />
                        </Field>
                        <Field label="Content background">
                            <ColorInput value={theme.contentBackground} onChange={(contentBackground) => onThemeChange({ contentBackground })} />
                        </Field>
                        <Field label="Text colour">
                            <ColorInput value={theme.textColor} onChange={(textColor) => onThemeChange({ textColor })} />
                        </Field>
                        <Field label="Accent / button colour">
                            <ColorInput value={theme.accentColor} onChange={(accentColor) => onThemeChange({ accentColor, linkColor: accentColor })} />
                        </Field>
                        <Field
                            label="Font"
                            hint="Gmail and Outlook strip webfonts and fall back to Tahoma. Apple Mail, iOS Mail and the browser view show the real face."
                        >
                            <select
                                className={inputClass}
                                value={theme.webfont ?? "system"}
                                onChange={(event) => {
                                    const choice = event.target.value
                                    const webfont: EmailWebfont =
                                        choice === "system" ? null : (choice as "dana" | "iransans")
                                    onThemeChange({
                                        webfont,
                                        fontFamily: webfont ? fontStackFor(webfont) : DEFAULT_THEME.fontFamily,
                                    })
                                }}
                            >
                                <option value="system">System (Latin)</option>
                                {Object.entries(WEBFONTS).map(([key, font]) => (
                                    <option key={key} value={key}>
                                        {font.label} (Persian)
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Base font size">
                            <NumberInput value={theme.fontSize} min={12} max={22} suffix="px" onChange={(fontSize) => onThemeChange({ fontSize })} />
                        </Field>
                        <Field label="Corner radius">
                            <NumberInput value={theme.radius} min={0} max={24} suffix="px" onChange={(radius) => onThemeChange({ radius })} />
                        </Field>
                        <Field label="Direction" hint="Switch to RTL for Persian campaigns.">
                            <div className="grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1">
                                {(["ltr", "rtl"] as const).map((dir) => (
                                    <button
                                        key={dir}
                                        type="button"
                                        onClick={() =>
                                            onThemeChange(
                                                dir === "rtl"
                                                    ? {
                                                          direction: "rtl",
                                                          webfont: theme.webfont ?? "iransans",
                                                          fontFamily: fontStackFor(theme.webfont ?? "iransans"),
                                                          lineHeight: Math.max(theme.lineHeight, 1.9),
                                                      }
                                                    : {
                                                          direction: "ltr",
                                                          webfont: null,
                                                          fontFamily: DEFAULT_THEME.fontFamily,
                                                      }
                                            )
                                        }
                                        className={cn(
                                            "rounded px-2 py-1 text-xs font-medium uppercase transition-colors",
                                            theme.direction === dir ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                                        )}
                                    >
                                        {dir}
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </>
                )}

                {activeTab === "block" && block && (
                    <>
                        {block.type === "heading" && (
                            <>
                                <Field label="Text">
                                    <TextInput value={block.text} onChange={(e) => patch({ text: e.target.value })} />
                                </Field>
                                <Field label="Level">
                                    <div className="grid grid-cols-3 gap-1 rounded-md bg-slate-100 p-1">
                                        {([1, 2, 3] as const).map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => patch({ level })}
                                                className={cn(
                                                    "rounded px-2 py-1 text-xs font-medium transition-colors",
                                                    block.level === level ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                                                )}
                                            >
                                                H{level}
                                            </button>
                                        ))}
                                    </div>
                                </Field>
                                <Field label="Alignment">
                                    <AlignPicker value={block.align} onChange={(align) => patch({ align })} />
                                </Field>
                                <Field label="Colour">
                                    <ColorInput value={block.color ?? theme.textColor} onChange={(color) => patch({ color })} />
                                </Field>
                            </>
                        )}

                        {block.type === "text" && (
                            <>
                                <Field label="Alignment">
                                    <AlignPicker value={block.align ?? "left"} onChange={(align) => patch({ align })} />
                                </Field>
                                <Field label="Font size">
                                    <NumberInput value={block.fontSize ?? theme.fontSize} min={11} max={28} suffix="px" onChange={(fontSize) => patch({ fontSize })} />
                                </Field>
                                <Field label="Line height">
                                    <NumberInput value={block.lineHeight ?? theme.lineHeight} min={1} max={2.4} onChange={(lineHeight) => patch({ lineHeight })} />
                                </Field>
                            </>
                        )}

                        {block.type === "image" && (
                            <>
                                <ImageUploadField label="Image" value={block.src} onChange={(src) => patch({ src })} />
                                <Field label="Alt text" hint="Most clients block images by default — this is what the reader sees first.">
                                    <TextInput value={block.alt} onChange={(e) => patch({ alt: e.target.value })} />
                                </Field>
                                <Field label="Link (optional)">
                                    <TextInput value={block.href ?? ""} placeholder="https://…" onChange={(e) => patch({ href: e.target.value })} />
                                </Field>
                                <Field label="Width">
                                    <NumberInput value={block.width ?? theme.width} min={40} max={theme.width} suffix="px" onChange={(width) => patch({ width })} />
                                </Field>
                                <Field label="Alignment">
                                    <AlignPicker value={block.align} onChange={(align) => patch({ align })} />
                                </Field>
                                <Field label="Corner radius">
                                    <NumberInput value={block.radius ?? 0} min={0} max={40} suffix="px" onChange={(radius) => patch({ radius })} />
                                </Field>
                            </>
                        )}

                        {block.type === "button" && (
                            <>
                                <Field label="Label">
                                    <TextInput value={block.label} onChange={(e) => patch({ label: e.target.value })} />
                                </Field>
                                <Field label="Destination URL">
                                    <TextInput value={block.href} onChange={(e) => patch({ href: e.target.value })} />
                                </Field>
                                <Field label="Alignment">
                                    <AlignPicker value={block.align} onChange={(align) => patch({ align })} />
                                </Field>
                                <Field label="Background">
                                    <ColorInput value={block.backgroundColorButton ?? theme.accentColor} onChange={(v) => patch({ backgroundColorButton: v })} />
                                </Field>
                                <Field label="Text colour">
                                    <ColorInput value={block.textColor ?? "#ffffff"} onChange={(textColor) => patch({ textColor })} />
                                </Field>
                                <Field label="Corner radius">
                                    <NumberInput value={block.radius ?? theme.radius} min={0} max={40} suffix="px" onChange={(radius) => patch({ radius })} />
                                </Field>
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={!!block.fullWidth}
                                        onChange={(e) => patch({ fullWidth: e.target.checked })}
                                        className="h-4 w-4 accent-violet-600"
                                    />
                                    Full width
                                </label>
                            </>
                        )}

                        {block.type === "divider" && (
                            <>
                                <Field label="Colour">
                                    <ColorInput value={block.color ?? "#e4e4e7"} onChange={(color) => patch({ color })} />
                                </Field>
                                <Field label="Thickness">
                                    <NumberInput value={block.thickness ?? 1} min={1} max={8} suffix="px" onChange={(thickness) => patch({ thickness })} />
                                </Field>
                                <Field label="Width">
                                    <NumberInput value={block.width ?? 100} min={10} max={100} suffix="%" onChange={(width) => patch({ width })} />
                                </Field>
                            </>
                        )}

                        {block.type === "spacer" && (
                            <Field label="Height">
                                <NumberInput value={block.height} min={4} max={120} suffix="px" onChange={(height) => patch({ height })} />
                            </Field>
                        )}

                        {block.type === "columns" && (
                            <>
                                <Field label="Column widths" hint="Must total 100.">
                                    <div className="flex gap-2">
                                        {block.columns.map((col, index) => (
                                            <NumberInput
                                                key={index}
                                                value={col.width}
                                                min={10}
                                                max={90}
                                                suffix="%"
                                                onChange={(width) => {
                                                    const columns = block.columns.map((c, i) => (i === index ? { ...c, width } : c))
                                                    patch({ columns })
                                                }}
                                            />
                                        ))}
                                    </div>
                                </Field>
                                <Field label="Gap">
                                    <NumberInput value={block.gap ?? 16} min={0} max={48} suffix="px" onChange={(gap) => patch({ gap })} />
                                </Field>
                                <div className="flex gap-2">
                                    {block.columns.length < 3 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const count = block.columns.length + 1
                                                const width = Math.floor(100 / count)
                                                patch({
                                                    columns: [...block.columns, { html: "<p>New column</p>", width }].map((c) => ({ ...c, width })),
                                                })
                                            }}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add column
                                        </button>
                                    )}
                                    {block.columns.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const columns = block.columns.slice(0, -1)
                                                const width = Math.floor(100 / columns.length)
                                                patch({ columns: columns.map((c) => ({ ...c, width })) })
                                            }}
                                            className="flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:border-rose-300"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={block.stackOnMobile !== false}
                                        onChange={(e) => patch({ stackOnMobile: e.target.checked })}
                                        className="h-4 w-4 accent-violet-600"
                                    />
                                    Stack on mobile
                                </label>
                            </>
                        )}

                        {block.type === "social" && (
                            <>
                                <Field label="Alignment">
                                    <AlignPicker value={block.align} onChange={(align) => patch({ align })} />
                                </Field>
                                <div className="space-y-2">
                                    {block.links.map((link, index) => (
                                        <div key={index} className="flex gap-1.5">
                                            <TextInput
                                                value={link.network}
                                                placeholder="network"
                                                className="w-24"
                                                onChange={(e) => {
                                                    const links = block.links.map((l, i) => (i === index ? { ...l, network: e.target.value } : l))
                                                    patch({ links })
                                                }}
                                            />
                                            <TextInput
                                                value={link.href}
                                                placeholder="https://…"
                                                onChange={(e) => {
                                                    const links = block.links.map((l, i) => (i === index ? { ...l, href: e.target.value } : l))
                                                    patch({ links })
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => patch({ links: block.links.filter((_, i) => i !== index) })}
                                                className="rounded-md px-2 text-rose-500 hover:bg-rose-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => patch({ links: [...block.links, { network: "site", href: "" }] })}
                                        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-slate-300 py-1.5 text-xs font-medium text-slate-600 hover:border-violet-400"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Add link
                                    </button>
                                </div>
                            </>
                        )}

                        {block.type === "video" && (
                            <>
                                <ImageUploadField label="Thumbnail" value={block.thumbnail} onChange={(thumbnail) => patch({ thumbnail })} />
                                <Field label="Video URL" hint="Email clients cannot play video — this links out.">
                                    <TextInput value={block.href} onChange={(e) => patch({ href: e.target.value })} />
                                </Field>
                                <Field label="Alt text">
                                    <TextInput value={block.alt} onChange={(e) => patch({ alt: e.target.value })} />
                                </Field>
                            </>
                        )}

                        {block.type === "quote" && (
                            <Field label="Attribution">
                                <TextInput value={block.cite ?? ""} onChange={(e) => patch({ cite: e.target.value })} />
                            </Field>
                        )}

                        <div className="space-y-3 border-t border-slate-200 pt-4">
                            <Field label="Padding" hint="Top · Right · Bottom · Left">
                                <div className="grid grid-cols-4 gap-1.5">
                                    {(block.padding ?? [12, 32, 12, 32]).map((value, index) => (
                                        <NumberInput
                                            key={index}
                                            value={value}
                                            min={0}
                                            max={96}
                                            onChange={(next) => {
                                                const padding = [...(block.padding ?? [12, 32, 12, 32])] as [number, number, number, number]
                                                padding[index] = next
                                                patch({ padding })
                                            }}
                                        />
                                    ))}
                                </div>
                            </Field>
                            <Field label="Background">
                                <ColorInput
                                    value={block.backgroundColor ?? theme.contentBackground}
                                    onChange={(backgroundColor) => patch({ backgroundColor })}
                                />
                            </Field>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={!!block.hideOnMobile}
                                    onChange={(e) => patch({ hideOnMobile: e.target.checked })}
                                    className="h-4 w-4 accent-violet-600"
                                />
                                Hide on mobile
                            </label>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
