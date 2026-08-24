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

// ── Author-supplied email HTML ──────────────────────────────────────────────

/**
 * Layout and presentation tags an imported email template relies on.
 *
 * `sanitizeRichText` deliberately forbids most of these: it guards the rich-text
 * blocks, where arbitrary structure would fight the block model. A Custom HTML
 * block is the opposite case — its whole purpose is to carry markup someone
 * already designed — so running it through the strict profile stripped every
 * <div> and collapsed the design into unstyled text, in the sent mail as well as
 * the preview.
 */
const EMAIL_TAGS = new Set([
    "div", "center", "span", "p", "br", "hr", "a", "img",
    "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption", "colgroup", "col",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "dl", "dt", "dd",
    "strong", "b", "em", "i", "u", "s", "strike", "small", "big", "sub", "sup",
    "blockquote", "code", "pre", "font", "abbr", "cite", "q",
    "section", "article", "header", "footer", "main", "aside", "nav", "figure", "figcaption",
    "style",
])

/** Anything that can execute, navigate or exfiltrate is removed outright. */
const EMAIL_FORBIDDEN = [
    "script", "iframe", "frame", "frameset", "object", "embed", "applet",
    "form", "input", "button", "select", "textarea", "option",
    "link", "meta", "base", "svg", "math", "portal",
]

const EMAIL_GLOBAL_ATTRS = new Set([
    "style", "class", "id", "dir", "lang", "title", "role", "align", "valign",
    "width", "height", "bgcolor", "background", "border", "cellpadding",
    "cellspacing", "colspan", "rowspan", "nowrap",
])

const EMAIL_TAG_ATTRS: Record<string, Set<string>> = {
    a: new Set(["href", "target", "rel", "name"]),
    img: new Set(["src", "alt", "srcset", "usemap"]),
    font: new Set(["color", "face", "size"]),
    col: new Set(["span"]),
    colgroup: new Set(["span"]),
    table: new Set(["summary"]),
}

/** Strips executable constructs from a CSS block while leaving layout intact. */
function sanitizeCss(css: string): string {
    return css
        .replace(/@import[^;]*;?/gi, "")
        .replace(/expression\s*\(/gi, "(")
        .replace(/(javascript|vbscript)\s*:/gi, "")
        .replace(/behavior\s*:[^;}]*/gi, "")
        .replace(/-moz-binding\s*:[^;}]*/gi, "")
}

/**
 * Sanitizes a complete email design without flattening it.
 *
 * Keeps structure and inline styling as authored — including the table layouts
 * and box models real email templates are built from — and removes only what
 * could execute or phone home.
 */
export function sanitizeEmailHtml(input: string): string {
    if (!input) return ""

    let html = input
        // Comments can hide markup from a naive pass; MSO conditionals are the
        // one exception worth keeping, so they are preserved verbatim below.
        .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")

    for (const tag of EMAIL_FORBIDDEN) {
        html = html
            .replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi"), "")
            .replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "")
    }

    // Inline event handlers, in either quoting style or bare
    html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")

    // Keep <style> content, minus anything executable
    html = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (_m, attrs, css) => {
        void attrs
        return `<style type="text/css">${sanitizeCss(String(css))}</style>`
    })

    html = html.replace(/<\/?([a-zA-Z0-9]+)((?:\s+[^>]*)?)\/?>/g, (match, rawTag, rawAttrs) => {
        const tag = String(rawTag).toLowerCase()
        if (!EMAIL_TAGS.has(tag)) return ""
        if (match.startsWith("</")) return `</${tag}>`
        if (tag === "style") return match

        const allowed = EMAIL_TAG_ATTRS[tag]
        const attrs: string[] = []
        const attrRe = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g
        let m: RegExpExecArray | null

        while ((m = attrRe.exec(String(rawAttrs))) !== null) {
            const name = m[1].toLowerCase()
            if (!EMAIL_GLOBAL_ATTRS.has(name) && !allowed?.has(name)) continue

            let value = m[3] ?? m[4] ?? m[5] ?? ""
            if ((name === "href" || name === "src" || name === "background") && !isSafeUrl(value)) continue
            if (name === "style") {
                value = sanitizeCss(value)
                if (!value.trim()) continue
            }
            attrs.push(`${name}="${escapeAttr(value)}"`)
        }

        if (tag === "a" && !attrs.some((a) => a.startsWith("target="))) {
            attrs.push('target="_blank"', 'rel="noopener noreferrer"')
        }
        if (tag === "img" || tag === "br" || tag === "hr" || tag === "col") {
            return `<${tag}${attrs.length ? " " + attrs.join(" ") : ""} />`
        }
        return `<${tag}${attrs.length ? " " + attrs.join(" ") : ""}>`
    })

    return html.trim()
}
