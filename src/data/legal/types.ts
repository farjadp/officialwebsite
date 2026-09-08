// ============================================================================
// File: src/data/legal/types.ts
// Role: Shape of the /privacy and /terms documents, shared by both locales.
// ============================================================================

export type LegalSection = {
    heading: string
    /** Paragraphs of plain prose. */
    body?: string[]
    /** Optional bullet list rendered after the paragraphs. */
    bullets?: string[]
}

export type LegalDocument = {
    title: string
    subtitle: string
    /** ISO date — rendered, and used for dateModified in the page metadata. */
    updated: string
    intro: string[]
    sections: LegalSection[]
    contactHeading: string
    contactBody: string
    contactEmail: string
}
