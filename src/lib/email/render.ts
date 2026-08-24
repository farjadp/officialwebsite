// ============================================================================
// Hardware Source: render.ts
// Version: 1.0.0 — 2026-08-23
// Why: Compile editor blocks into email-safe, Outlook-tolerant HTML
// Env / Identity: Shared module (server + client preview)
// ============================================================================

import {
    type Align,
    type Block,
    type EmailTheme,
    DEFAULT_THEME,
} from "./blocks"
import {
    sanitizeRichText,
    sanitizeEmailHtml,
    inlineThemeStyles,
    escapeHtml,
    htmlToText,
} from "./sanitize"

export interface RenderOptions {
    theme?: Partial<EmailTheme>
    preheader?: string
    /** Rendered into the footer — legally required and reputation-critical */
    unsubscribeUrl?: string
    preferencesUrl?: string
    viewInBrowserUrl?: string
    /** Physical address — CAN-SPAM / CASL requirement */
    postalAddress?: string
    footerNote?: string
    /** Transparent pixel endpoint for open tracking */
    trackingPixelUrl?: string
}

function pad(block: Block, theme: EmailTheme): string {
    const p = block.padding ?? [12, 32, 12, 32]
    const [top, right, bottom, left] = p
    // Swap horizontal padding for RTL layouts
    const [r, l] = theme.direction === "rtl" ? [left, right] : [right, left]
    return `padding:${top}px ${r}px ${bottom}px ${l}px;`
}

/**
 * Blocks store physical alignment, but a template authored in LTR must flip when
 * the same design is reused for a Persian campaign. Treat left/right as
 * start/end and mirror them under RTL — exactly as `pad` does for padding.
 */
function align(value: Align, theme: EmailTheme): Align {
    if (theme.direction !== "rtl" || value === "center") return value
    return value === "left" ? "right" : "left"
}

function bg(block: Block): string {
    return block.backgroundColor ? `background-color:${block.backgroundColor};` : ""
}

function mobileClass(block: Block): string {
    return block.hideOnMobile ? ' class="hide-mobile"' : ""
}

/** Every block sits in its own full-width row table — the only layout primitive Outlook agrees with. */
function row(block: Block, theme: EmailTheme, inner: string): string {
    return `<tr${mobileClass(block)}><td style="${pad(block, theme)}${bg(block)}">${inner}</td></tr>`
}

function renderBlock(block: Block, theme: EmailTheme): string {
    switch (block.type) {
        case "heading": {
            const sizes = { 1: 30, 2: 24, 3: 20 }
            const size = block.fontSize ?? sizes[block.level]
            const inner = `<h${block.level} style="margin:0;font-family:${theme.fontFamily};font-size:${size}px;line-height:1.3;font-weight:700;color:${block.color ?? theme.textColor};text-align:${align(block.align, theme)};">${escapeHtml(block.text)}</h${block.level}>`
            return row(block, theme, inner)
        }

        case "text": {
            const clean = inlineThemeStyles(sanitizeRichText(block.html), {
                ...theme,
                fontSize: block.fontSize ?? theme.fontSize,
                lineHeight: block.lineHeight ?? theme.lineHeight,
                textColor: block.color ?? theme.textColor,
            })
            const inner = `<div style="text-align:${block.align ? align(block.align, theme) : theme.direction === "rtl" ? "right" : "left"};">${clean}</div>`
            return row(block, theme, inner)
        }

        case "image": {
            if (!block.src) return ""
            const width = Math.min(block.width ?? theme.width, theme.width)
            const radius = block.radius != null ? `border-radius:${block.radius}px;` : ""
            let img = `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" width="${width}" style="display:block;width:100%;max-width:${width}px;height:auto;border:0;outline:none;text-decoration:none;${radius}" />`
            if (block.href) {
                img = `<a href="${escapeHtml(block.href)}" target="_blank" style="text-decoration:none;">${img}</a>`
            }
            return row(block, theme, `<div style="text-align:${align(block.align, theme)};">${img}</div>`)
        }

        case "button": {
            const bgColor = block.backgroundColorButton ?? theme.accentColor
            const color = block.textColor ?? "#ffffff"
            const radius = block.radius ?? theme.radius
            const size = block.fontSize ?? 16
            const width = block.fullWidth ? 'width="100%"' : ""
            const resolved = align(block.align, theme)
            // VML fallback keeps the button a real filled rectangle in Outlook 2007-2019
            const inner = `
<table role="presentation" border="0" cellpadding="0" cellspacing="0" ${width} style="${block.fullWidth ? "width:100%;" : ""}margin:0 ${resolved === "center" ? "auto" : resolved === "right" ? "0 0 auto" : "auto 0 0"};">
  <tr>
    <td align="center" bgcolor="${bgColor}" style="border-radius:${radius}px;background-color:${bgColor};">
      <a href="${escapeHtml(block.href)}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:${theme.fontFamily};font-size:${size}px;font-weight:600;color:${color};text-decoration:none;border-radius:${radius}px;${block.fullWidth ? "width:100%;box-sizing:border-box;text-align:center;" : ""}">${escapeHtml(block.label)}</a>
    </td>
  </tr>
</table>`
            return row(block, theme, `<div style="text-align:${resolved};">${inner}</div>`)
        }

        case "divider": {
            const inner = `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${block.width ?? 100}%" style="width:${block.width ?? 100}%;margin:0 auto;"><tr><td style="border-top:${block.thickness ?? 1}px solid ${block.color ?? "#e4e4e7"};font-size:0;line-height:0;">&nbsp;</td></tr></table>`
            return row(block, theme, inner)
        }

        case "spacer":
            return `<tr><td style="height:${block.height}px;font-size:0;line-height:0;${bg(block)}">&nbsp;</td></tr>`

        case "columns": {
            const gap = block.gap ?? 16
            const cols = block.columns
            const cells = cols
                .map((col) => {
                    const clean = inlineThemeStyles(sanitizeRichText(col.html), theme)
                    return `<td class="${block.stackOnMobile !== false ? "stack-col" : ""}" width="${col.width}%" valign="top" style="width:${col.width}%;padding:0 ${gap / 2}px;">${clean}</td>`
                })
                .join("")
            const inner = `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;border-collapse:collapse;"><tr>${cells}</tr></table>`
            return row(block, theme, inner)
        }

        case "social": {
            const size = block.iconSize ?? 24
            const icons = block.links
                .filter((l) => l.href)
                .map(
                    (l) =>
                        `<a href="${escapeHtml(l.href)}" target="_blank" style="display:inline-block;margin:0 6px;font-family:${theme.fontFamily};font-size:${Math.round(size * 0.55)}px;color:${theme.mutedColor};text-decoration:none;text-transform:capitalize;">${escapeHtml(l.network)}</a>`
                )
                .join("")
            return row(block, theme, `<div style="text-align:${align(block.align, theme)};">${icons}</div>`)
        }

        case "video": {
            if (!block.thumbnail || !block.href) return ""
            // No client plays inline video — a thumbnail linking out is the reliable pattern
            const inner = `<a href="${escapeHtml(block.href)}" target="_blank" style="text-decoration:none;display:block;"><img src="${escapeHtml(block.thumbnail)}" alt="${escapeHtml(block.alt)}" width="${theme.width - 64}" style="display:block;width:100%;max-width:${theme.width - 64}px;height:auto;border:0;border-radius:${theme.radius}px;" /></a>`
            return row(block, theme, inner)
        }

        case "quote": {
            const clean = inlineThemeStyles(sanitizeRichText(block.html), theme)
            const side = theme.direction === "rtl" ? "right" : "left"
            const inner = `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-${side}:3px solid ${block.accentColor ?? theme.accentColor};padding:4px 16px;">${clean}${block.cite ? `<div style="font-family:${theme.fontFamily};font-size:14px;color:${theme.mutedColor};margin-top:4px;">— ${escapeHtml(block.cite)}</div>` : ""}</td></tr></table>`
            return row(block, theme, inner)
        }

        case "html":
            // Author-supplied markup keeps its own structure; the strict
            // rich-text profile would strip every container and flatten it
            return row(block, theme, sanitizeEmailHtml(block.html))
    }
}

/** Hidden preview text — controls the grey line next to the subject in the inbox. */
function preheaderMarkup(text: string): string {
    if (!text) return ""
    // The trailing entities push the rest of the body out of the preview snippet
    const filler = "&#847;&zwnj;&nbsp;".repeat(60)
    return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(text)}${filler}</div>`
}

function footerMarkup(theme: EmailTheme, opts: RenderOptions): string {
    const parts: string[] = []
    if (opts.viewInBrowserUrl) {
        parts.push(`<a href="${escapeHtml(opts.viewInBrowserUrl)}" style="color:${theme.mutedColor};text-decoration:underline;">View in browser</a>`)
    }
    if (opts.preferencesUrl) {
        parts.push(`<a href="${escapeHtml(opts.preferencesUrl)}" style="color:${theme.mutedColor};text-decoration:underline;">Email preferences</a>`)
    }
    if (opts.unsubscribeUrl) {
        parts.push(`<a href="${escapeHtml(opts.unsubscribeUrl)}" style="color:${theme.mutedColor};text-decoration:underline;">Unsubscribe</a>`)
    }

    const links = parts.join(' <span style="color:#d4d4d8;">·</span> ')
    const note = opts.footerNote ? `<div style="margin-bottom:8px;">${escapeHtml(opts.footerNote)}</div>` : ""
    const address = opts.postalAddress
        ? `<div style="margin-top:8px;">${escapeHtml(opts.postalAddress)}</div>`
        : ""

    return `<tr><td style="padding:24px 32px 32px;text-align:center;font-family:${theme.fontFamily};font-size:12px;line-height:1.6;color:${theme.mutedColor};">${note}${links}${address}</td></tr>`
}

export function renderEmail(
    blocks: Block[],
    options: RenderOptions = {}
): { html: string; text: string } {
    const theme: EmailTheme = { ...DEFAULT_THEME, ...(options.theme ?? {}) }
    const body = blocks.map((b) => renderBlock(b, theme)).join("\n")

    const pixel = options.trackingPixelUrl
        ? `<img src="${escapeHtml(options.trackingPixelUrl)}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />`
        : ""

    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${theme.direction === "rtl" ? "fa" : "en"}" dir="${theme.direction}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>&#8203;</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style type="text/css">
  body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; }
  a { text-decoration:underline; }
  @media only screen and (max-width:480px) {
    .wrapper { width:100% !important; }
    .stack-col { display:block !important; width:100% !important; padding:0 0 16px !important; }
    .hide-mobile { display:none !important; }
    .px { padding-left:20px !important; padding-right:20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${theme.pageBackground};" dir="${theme.direction}">
${preheaderMarkup(options.preheader ?? "")}
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${theme.pageBackground};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${theme.width}" class="wrapper" style="width:${theme.width}px;max-width:${theme.width}px;background-color:${theme.contentBackground};border-radius:${theme.radius}px;overflow:hidden;">
${body}
${footerMarkup(theme, options)}
      </table>
    </td>
  </tr>
</table>
${pixel}
</body>
</html>`

    const textParts = blocks.map((b) => {
        if (b.type === "spacer" || b.type === "divider") return ""
        if (b.type === "heading") return b.text
        if (b.type === "button") return `${b.label}: ${b.href}`
        if (b.type === "image") return b.alt ? `[${b.alt}]` : ""
        if (b.type === "video") return `${b.alt}: ${b.href}`
        if (b.type === "columns") return b.columns.map((c) => htmlToText(c.html)).join("\n\n")
        if ("html" in b) return htmlToText(b.html)
        return ""
    })

    if (options.unsubscribeUrl) {
        textParts.push(`\n---\nUnsubscribe: ${options.unsubscribeUrl}`)
    }
    if (options.postalAddress) textParts.push(options.postalAddress)

    const text = textParts.filter(Boolean).join("\n\n").replace(/\n{3,}/g, "\n\n").trim()

    return { html, text }
}
