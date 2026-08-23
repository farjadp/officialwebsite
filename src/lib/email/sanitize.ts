// ============================================================================
// Hardware Source: sanitize.ts
// Version: 1.0.0 — 2026-08-23
// Why: Convert rich-text HTML into the subset email clients actually render
// Env / Identity: Shared module (server + client)
// ============================================================================

import type { EmailTheme } from "./blocks"

/**
 * The editor produces modern semantic HTML. Email clients — Outlook's Word
 * rendering engine above all — do not. This module strips anything unsafe and
 * inlines the styles that clients drop when they live in a <style> tag.
 */

const ALLOWED_TAGS = new Set([
    "p", "br", "strong", "b", "em", "i", "u", "s", "strike", "a", "span",
    "ul", "ol", "li", "blockquote", "code", "pre",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "table", "thead", "tbody", "tr", "td", "th", "img", "sub", "sup", "hr",
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {
    a: new Set(["href", "title", "target", "rel", "style"]),
    img: new Set(["src", "alt", "width", "height", "style"]),
    td: new Set(["colspan", "rowspan", "align", "valign", "style", "width"]),
    th: new Set(["colspan", "rowspan", "align", "valign", "style", "width"]),
    table: new Set(["style", "width", "border", "cellpadding", "cellspacing"]),
    span: new Set(["style"]),
    p: new Set(["style"]),
    li: new Set(["style"]),
    ul: new Set(["style"]),
    ol: new Set(["style"]),
    blockquote: new Set(["style"]),
}

/** CSS properties email clients honour reliably. Everything else is dropped. */
const ALLOWED_CSS = new Set([
    "color", "background-color", "background", "font-size", "font-weight",
    "font-style", "font-family", "text-align", "text-decoration", "line-height",
    "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "margin", "margin-top", "margin-bottom", "border", "border-top",
    "border-bottom", "border-left", "border-right", "border-radius",
    "border-collapse", "width", "height", "max-width", "vertical-align",
    "letter-spacing", "direction", "list-style-type",
])

function escapeAttr(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function isSafeUrl(url: string): boolean {
    const trimmed = url.trim().toLowerCase()
    if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:text/html")) return false
    if (trimmed.startsWith("vbscript:")) return false
    return true
}

function filterStyle(style: string): string {
    return style
        .split(";")
        .map((decl) => decl.trim())
        .filter(Boolean)
        .filter((decl) => {
            const prop = decl.split(":")[0]?.trim().toLowerCase()
            if (!prop || !ALLOWED_CSS.has(prop)) return false
            // Block CSS-based script vectors
            return !/expression\(|javascript:|url\(\s*['"]?javascript/i.test(decl)
        })
        .join("; ")
}

/**
 * Tag-level sanitizer. Regex-based on purpose: this runs on both the server and
 * inside the browser preview, and the input is always our own editor's output —
 * never third-party HTML rendered in a user's session.
 */
export function sanitizeRichText(input: string): string {
    if (!input) return ""

    let html = input
        // Drop entire dangerous elements including their content
        .replace(/<(script|style|iframe|object|embed|form|input|link|meta)[\s\S]*?<\/\1>/gi, "")
        .replace(/<(script|style|iframe|object|embed|form|input|link|meta)[^>]*\/?>/gi, "")
        // Drop inline event handlers
        .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")

    html = html.replace(/<\/?([a-zA-Z0-9]+)((?:\s+[^>]*)?)\/?>/g, (match, rawTag, rawAttrs) => {
        const tag = String(rawTag).toLowerCase()
        if (!ALLOWED_TAGS.has(tag)) return ""
        if (match.startsWith("</")) return `</${tag}>`

        const allowed = ALLOWED_ATTRS[tag]
        if (!allowed) return `<${tag}>`

        const attrs: string[] = []
        const attrRe = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g
        let m: RegExpExecArray | null
        while ((m = attrRe.exec(String(rawAttrs))) !== null) {
            const name = m[1].toLowerCase()
            if (!allowed.has(name)) continue
            let value = m[3] ?? m[4] ?? m[5] ?? ""

            if (name === "href" || name === "src") {
                if (!isSafeUrl(value)) continue
            }
            if (name === "style") {
                value = filterStyle(value)
                if (!value) continue
            }
            attrs.push(`${name}="${escapeAttr(value)}"`)
        }

        // Every link opens externally and drops the referrer
        if (tag === "a") {
            if (!attrs.some((a) => a.startsWith("target="))) attrs.push('target="_blank"')
            if (!attrs.some((a) => a.startsWith("rel="))) attrs.push('rel="noopener noreferrer"')
        }
        // Self-closing void elements
        if (tag === "img" || tag === "br" || tag === "hr") {
            return `<${tag}${attrs.length ? " " + attrs.join(" ") : ""} />`
        }
        return `<${tag}${attrs.length ? " " + attrs.join(" ") : ""}>`
    })

    return html.trim()
}

/**
 * Push theme defaults onto bare tags. Gmail strips <style> blocks in some
 * contexts and Outlook.com rewrites class names, so anything that matters has to
 * be an inline attribute.
 */
export function inlineThemeStyles(html: string, theme: EmailTheme): string {
    const base = `font-family:${theme.fontFamily};font-size:${theme.fontSize}px;line-height:${theme.lineHeight};color:${theme.textColor};`

    return html
        .replace(/<p(?![^>]*style=)/g, `<p style="margin:0 0 16px;${base}"`)
        .replace(/<li(?![^>]*style=)/g, `<li style="margin:0 0 8px;${base}"`)
        .replace(/<ul(?![^>]*style=)/g, `<ul style="margin:0 0 16px;padding-${theme.direction === "rtl" ? "right" : "left"}:24px;"`)
        .replace(/<ol(?![^>]*style=)/g, `<ol style="margin:0 0 16px;padding-${theme.direction === "rtl" ? "right" : "left"}:24px;"`)
        .replace(/<a(?![^>]*style=)/g, `<a style="color:${theme.linkColor};text-decoration:underline;"`)
        .replace(/<h([1-6])(?![^>]*style=)/g, (_m, lvl) => {
            const sizes: Record<string, number> = { "1": 30, "2": 24, "3": 20, "4": 18, "5": 16, "6": 14 }
            return `<h${lvl} style="margin:0 0 12px;font-family:${theme.fontFamily};font-size:${sizes[lvl]}px;line-height:1.3;color:${theme.textColor};font-weight:700;"`
        })
        .replace(/<table(?![^>]*style=)/g, `<table style="border-collapse:collapse;width:100%;margin:0 0 16px;"`)
        .replace(/<(td|th)(?![^>]*style=)/g, (_m, tag) =>
            `<${tag} style="border:1px solid #e4e4e7;padding:8px 12px;${base}${tag === "th" ? "font-weight:700;background-color:#fafafa;" : ""}"`
        )
        .replace(/<blockquote(?![^>]*style=)/g, `<blockquote style="margin:0 0 16px;padding:8px 16px;border-${theme.direction === "rtl" ? "right" : "left"}:3px solid ${theme.accentColor};color:${theme.mutedColor};${base}"`)
        .replace(/<code(?![^>]*style=)/g, `<code style="font-family:Consolas,Monaco,monospace;font-size:14px;background-color:#f4f4f5;padding:2px 5px;border-radius:4px;"`)
        .replace(/<img(?![^>]*style=)/g, `<img style="max-width:100%;height:auto;display:block;border:0;"`)
}

/** Strip tags for the plain-text alternative part. */
export function htmlToText(html: string): string {
    return html
        .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
        .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
            const text = String(label).replace(/<[^>]+>/g, "").trim()
            return text && !String(href).includes(text) ? `${text} (${href})` : String(href)
        })
        // Separate table cells before collapsing rows, or columns run together
        .replace(/<\/(td|th)>/gi, "\t")
        .replace(/<\/(p|div|h[1-6]|tr|li|blockquote)>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<li[^>]*>/gi, "- ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim()
}
