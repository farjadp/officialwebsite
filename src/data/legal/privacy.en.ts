// ============================================================================
// File: src/data/legal/privacy.en.ts
// Role: Privacy policy copy (English).
// Sources: written from what this codebase actually does — PostHog in
//   src/instrumentation-client.ts, the ToolUsage/Lead/LabApplication models in
//   prisma/schema.prisma, Resend in src/lib/email, and the hosting stack.
// NOTE: reviewed for accuracy against the code, NOT reviewed by a lawyer.
// ============================================================================

import type { LegalDocument } from "./types"

export const PRIVACY_EN: LegalDocument = {
    title: "Privacy Policy",
    subtitle: "What this site collects, why, and how to make it stop.",
    updated: "2026-09-08",
    intro: [
        "This site is run by Farjad Pourmohammad, an independent advisor based in Newmarket, Ontario, Canada. It is not a company website; there is no sales team and no data broker behind it.",
        "This policy describes the personal information the site actually collects. It was written by reading the code, not from a template, and it is kept in the same repository as the site so the two cannot drift apart.",
    ],
    sections: [
        {
            heading: "What is collected, and when",
            body: [
                "Nothing is asked of you to read this site. Information is only collected when you use a feature that needs it.",
            ],
            bullets: [
                "Diagnostic tools — when you finish a tool and choose to receive your result by email, your email address, your name if you give one, your answers and your score are stored so the report can be produced and sent.",
                "Anonymous tool usage — each completed tool run records which tool it was, the resulting score, your country and your IP address. This is used to see which tools get finished and which get abandoned.",
                "Contact and booking forms — the name, email and message you type.",
                "Founder Lab applications — the answers on the form and any pitch deck you upload.",
                "Accounts — if you register, an email address and a password. Passwords are stored only as a bcrypt hash and cannot be read back.",
                "Email campaigns — if you subscribe, your email address, plus whether a message was delivered, opened, or unsubscribed from.",
                "Page views — an aggregate counter per URL. It is a number, not a record of who visited.",
            ],
        },
        {
            heading: "Analytics and cookies",
            body: [
                "The site uses PostHog for product analytics and Vercel Speed Insights for performance measurement. PostHog sets cookies and records page views and interactions in order to attribute them to a single browsing session.",
                "Signing in sets a session cookie. That cookie is what keeps you signed in; without it the account area cannot work.",
                "There is no advertising network on this site, no advertising cookie, no cross-site tracking pixel, and nothing here is sold or shared with data brokers.",
            ],
        },
        {
            heading: "Why your IP address is stored",
            body: [
                "Completed tool runs store the IP address the submission came from. It is used to derive an approximate country and to tell genuine usage apart from automated submissions. It is not used to build a profile of you and it is not linked to your email address unless you asked for your report by email.",
            ],
        },
        {
            heading: "Who else sees it",
            body: [
                "Service providers process data on this site's behalf. They are bound by their own terms and are not permitted to use your information for their own purposes.",
            ],
            bullets: [
                "Vercel — hosting and delivery of the site itself.",
                "Neon — the PostgreSQL database where the records above are stored.",
                "Resend — sending transactional and campaign email.",
                "PostHog — product analytics.",
                "Google Cloud Storage and Vercel Blob — file storage, including uploaded pitch decks.",
                "OpenAI and fal.ai — used to generate content and to power the AI-assisted diagnostics. Where a tool sends your answers to a model to produce your report, that is stated on the tool itself.",
            ],
        },
        {
            heading: "Where it is stored",
            body: [
                "The providers above operate outside Canada, including in the United States and the European Union. Information handled by this site may therefore be stored or processed outside Canada and may be accessible to the courts and authorities of those countries.",
            ],
        },
        {
            heading: "How long it is kept",
            body: [
                "Leads, tool results and applications are kept while they are still useful for the advisory work they relate to, and deleted on request. Email subscription records are kept for as long as you stay subscribed, plus a suppression record after you unsubscribe — that record exists precisely so you are not emailed again.",
                "Aggregate page-view counters contain no personal information and are kept indefinitely.",
            ],
        },
        {
            heading: "Your rights",
            body: [
                "Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) you can ask what personal information is held about you, ask for it to be corrected, and withdraw consent. If you are in the EU or the UK you additionally have the rights of access, rectification, erasure, restriction, portability and objection under the GDPR.",
                "Every marketing email includes a working one-click unsubscribe link. Unsubscribing takes effect immediately; you do not need to email anyone to make it happen.",
                "To ask for a copy of your data or its deletion, write to the address below. Expect a reply within 30 days.",
            ],
        },
        {
            heading: "Children",
            body: [
                "This site is aimed at founders and operators. It is not directed at children and does not knowingly collect information from anyone under 16.",
            ],
        },
        {
            heading: "Changes",
            body: [
                "When this policy changes, the date at the top of the page changes with it. Material changes will be announced to email subscribers.",
            ],
        },
    ],
    contactHeading: "Contact",
    contactBody:
        "Privacy questions, access requests and deletion requests all go to the same place. You can also reach the same inbox about anything else on this site.",
    contactEmail: "contact@farjadp.info",
}
