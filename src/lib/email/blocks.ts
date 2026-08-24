// ============================================================================
// Hardware Source: blocks.ts
// Version: 1.0.0 — 2026-08-23
// Why: Canonical block schema for the email editor (source of truth)
// Env / Identity: Shared module (server + client)
// ============================================================================

/**
 * The editor never stores raw HTML as its source of truth. It stores an ordered
 * list of blocks. Layout lives in the block structure; formatting lives inside
 * `RichText` blocks as a constrained HTML subset that the compiler rewrites into
 * table-based, inline-styled markup that Outlook understands.
 *
 * Storing structure (not HTML) is what lets the AI assistant edit a campaign
 * surgically — "shorten the intro", "add a CTA after the second paragraph" —
 * instead of regenerating the whole document.
 */

export type BlockType =
    | "heading"
    | "text"
    | "image"
    | "button"
    | "divider"
    | "spacer"
    | "columns"
    | "social"
    | "video"
    | "quote"
    | "html"

export type Align = "left" | "center" | "right"

export interface BaseBlock {
    id: string
    type: BlockType
    /** Padding in px: [top, right, bottom, left] */
    padding?: [number, number, number, number]
    backgroundColor?: string
    /** Hide on screens narrower than 480px */
    hideOnMobile?: boolean
}

export interface HeadingBlock extends BaseBlock {
    type: "heading"
    text: string
    level: 1 | 2 | 3
    align: Align
    color?: string
    fontSize?: number
}

export interface TextBlock extends BaseBlock {
    type: "text"
    /** Constrained HTML subset — see sanitize.ts for the allow-list */
    html: string
    align?: Align
    fontSize?: number
    lineHeight?: number
    color?: string
}

export interface ImageBlock extends BaseBlock {
    type: "image"
    src: string
    alt: string
    href?: string
    width?: number // px, capped to content width
    align: Align
    radius?: number
}

export interface ButtonBlock extends BaseBlock {
    type: "button"
    label: string
    href: string
    align: Align
    backgroundColorButton?: string
    textColor?: string
    radius?: number
    fullWidth?: boolean
    fontSize?: number
}

export interface DividerBlock extends BaseBlock {
    type: "divider"
    color?: string
    thickness?: number
    width?: number // percent
}

export interface SpacerBlock extends BaseBlock {
    type: "spacer"
    height: number
}

export interface ColumnsBlock extends BaseBlock {
    type: "columns"
    /** 2 or 3 columns; each holds its own rich-text HTML */
    columns: { html: string; width: number }[]
    gap?: number
    /** Stack columns vertically on mobile */
    stackOnMobile?: boolean
}

export interface SocialBlock extends BaseBlock {
    type: "social"
    align: Align
    iconSize?: number
    links: { network: string; href: string }[]
}

export interface VideoBlock extends BaseBlock {
    type: "video"
    /** Email clients do not play video — we render a thumbnail with a play badge */
    thumbnail: string
    href: string
    alt: string
}

export interface QuoteBlock extends BaseBlock {
    type: "quote"
    html: string
    cite?: string
    accentColor?: string
}

export interface HtmlBlock extends BaseBlock {
    type: "html"
    html: string
}

export type Block =
    | HeadingBlock
    | TextBlock
    | ImageBlock
    | ButtonBlock
    | DividerBlock
    | SpacerBlock
    | ColumnsBlock
    | SocialBlock
    | VideoBlock
    | QuoteBlock
    | HtmlBlock

/** Persian families served from /public/fonts, embeddable via @font-face. */
export type EmailWebfont = "dana" | "iransans" | null

export interface WebfontDefinition {
    label: string
    family: string
    /** Paths under the public origin, one per weight we actually use */
    faces: { weight: number; woff2: string; woff: string }[]
    /** Rendered after the family name — what most clients will really use */
    fallback: string
}

export const WEBFONTS: Record<"dana" | "iransans", WebfontDefinition> = {
    dana: {
        label: "Dana",
        family: "dana",
        faces: [
            { weight: 400, woff2: "/fonts/dana/woff2/Dana-Regular.woff2", woff: "/fonts/dana/woff/Dana-Regular.woff" },
            { weight: 500, woff2: "/fonts/dana/woff2/Dana-Medium.woff2", woff: "/fonts/dana/woff/Dana-Medium.woff" },
            { weight: 700, woff2: "/fonts/dana/woff2/Dana-Bold.woff2", woff: "/fonts/dana/woff/Dana-Bold.woff" },
        ],
        fallback: "Tahoma, 'Segoe UI', Arial, sans-serif",
    },
    iransans: {
        label: "IRANSansX",
        family: "iransans",
        faces: [
            { weight: 400, woff2: "/fonts/iransans/woff2/IRANSansX-Regular.woff2", woff: "/fonts/iransans/woff/IRANSansX-Regular.woff" },
            { weight: 500, woff2: "/fonts/iransans/woff2/IRANSansX-Medium.woff2", woff: "/fonts/iransans/woff/IRANSansX-Medium.woff" },
            { weight: 700, woff2: "/fonts/iransans/woff2/IRANSansX-Bold.woff2", woff: "/fonts/iransans/woff/IRANSansX-Bold.woff" },
        ],
        fallback: "Tahoma, 'Segoe UI', Arial, sans-serif",
    },
}

export interface EmailTheme {
    /** Content width in px — 600 is the safe universal maximum */
    width: number
    pageBackground: string
    contentBackground: string
    fontFamily: string
    textColor: string
    mutedColor: string
    linkColor: string
    accentColor: string
    fontSize: number
    lineHeight: number
    direction: "ltr" | "rtl"
    radius: number
    /**
     * Embeds a Persian webfont. Gmail and Outlook strip @font-face, so the
     * fallback in fontFamily is what most readers actually see — Apple Mail,
     * iOS Mail and the browser view get the real face.
     */
    webfont?: EmailWebfont
}

export const DEFAULT_THEME: EmailTheme = {
    width: 600,
    pageBackground: "#f4f4f5",
    contentBackground: "#ffffff",
    // System stack only — webfonts are stripped by most clients and cost render time
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    textColor: "#18181b",
    mutedColor: "#71717a",
    linkColor: "#7c3aed",
    accentColor: "#7c3aed",
    fontSize: 16,
    lineHeight: 1.65,
    direction: "ltr",
    radius: 8,
    webfont: null,
}

export const RTL_THEME: EmailTheme = {
    ...DEFAULT_THEME,
    direction: "rtl",
    fontFamily: `iransans, ${WEBFONTS.iransans.fallback}`,
    webfont: "iransans",
    // Persian sits lower in its line box than Latin; a little extra room stops
    // descenders from crowding the line beneath
    lineHeight: 1.9,
}

/** Builds the font stack for a chosen webfont, always keeping the fallback. */
export function fontStackFor(webfont: EmailWebfont): string {
    if (!webfont) return DEFAULT_THEME.fontFamily
    const definition = WEBFONTS[webfont]
    return `${definition.family}, ${definition.fallback}`
}

/**
 * Decides direction the way Unicode does: the first strong directional
 * character wins (UAX #9, and what `dir="auto"` implements in a browser).
 *
 * Counting letters instead looks reasonable and gets bilingual copy wrong —
 * "مسیر Startup Visa اروپا" holds more Latin letters than Persian ones despite
 * plainly being a Persian line.
 */
export function isRtlText(value: string): boolean {
    const text = value
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;|&#\d+;/gi, " ")

    for (const char of text) {
        // Arabic, Persian, Hebrew and their presentation forms
        if (/[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\uFB1D-\uFDFF\uFE70-\uFEFF]/.test(char)) {
            return true
        }
        if (/[A-Za-z\u00C0-\u024F]/.test(char)) return false
    }

    return false
}

let counter = 0
export function blockId(): string {
    counter += 1
    return `b${Date.now().toString(36)}${counter.toString(36)}`
}

/** Factory for a new block of the given type with sensible defaults. */
export function createBlock(type: BlockType): Block {
    const id = blockId()
    const padding: [number, number, number, number] = [12, 32, 12, 32]

    switch (type) {
        case "heading":
            return { id, type, text: "Your headline", level: 2, align: "left", padding }
        case "text":
            // No default alignment: the renderer follows the text's own script
            // until the author picks one explicitly
            return {
                id,
                type,
                html: "<p>Write something worth opening.</p>",
                padding,
            }
        case "image":
            return { id, type, src: "", alt: "", align: "center", padding: [12, 32, 12, 32] }
        case "button":
            return {
                id,
                type,
                label: "Read more",
                href: "https://farjadp.info",
                align: "left",
                padding: [16, 32, 16, 32],
            }
        case "divider":
            return { id, type, color: "#e4e4e7", thickness: 1, width: 100, padding: [8, 32, 8, 32] }
        case "spacer":
            return { id, type, height: 24, padding: [0, 0, 0, 0] }
        case "columns":
            return {
                id,
                type,
                columns: [
                    { html: "<p>Left column</p>", width: 50 },
                    { html: "<p>Right column</p>", width: 50 },
                ],
                gap: 16,
                stackOnMobile: true,
                padding,
            }
        case "social":
            return {
                id,
                type,
                align: "center",
                iconSize: 24,
                links: [
                    { network: "linkedin", href: "https://linkedin.com" },
                    { network: "x", href: "https://x.com" },
                ],
                padding,
            }
        case "video":
            return { id, type, thumbnail: "", href: "", alt: "Watch the video", padding }
        case "quote":
            return { id, type, html: "<p>A line worth quoting.</p>", padding }
        case "html":
            return { id, type, html: "<!-- custom html -->", padding: [0, 0, 0, 0] }
    }
}

export const BLOCK_LABELS: Record<BlockType, string> = {
    heading: "Heading",
    text: "Rich Text",
    image: "Image",
    button: "Button",
    divider: "Divider",
    spacer: "Spacer",
    columns: "Columns",
    social: "Social Links",
    video: "Video",
    quote: "Quote",
    html: "Custom HTML",
}
