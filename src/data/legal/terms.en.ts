// ============================================================================
// File: src/data/legal/terms.en.ts
// Role: Terms of service copy (English).
// NOTE: written to describe how this site actually works. Not legal advice and
//   not reviewed by a lawyer — have it checked before relying on it.
// ============================================================================

import type { LegalDocument } from "./types"

export const TERMS_EN: LegalDocument = {
    title: "Terms of Service",
    subtitle: "What you can expect from this site, and what it expects from you.",
    updated: "2026-09-08",
    intro: [
        "This site is operated by Farjad Pourmohammad, an independent advisor based in Newmarket, Ontario, Canada. Using the site means accepting the terms below.",
    ],
    sections: [
        {
            heading: "What this site is",
            body: [
                "A body of writing, a set of free diagnostic tools, and a description of advisory services. Everything on it is published for general information.",
            ],
        },
        {
            heading: "The diagnostics are not a verdict",
            body: [
                "The tools on this site — including the TRL Assessment, Startup Readiness, Investor Readiness, the Business Model tools, the Sales Funnel Score, the NPI Assessment and the AI Website Readiness audit — score the answers you give them against a published framework. They do not inspect your company, verify your claims, or know your circumstances.",
                "A score from this site is a prompt for a conversation, not a valuation, an audit, a credit assessment, or a funding decision. Do not present one to an investor or a government program as an independent assessment, because it is not one.",
                "The AI Website Readiness audit fetches only publicly available pages of the address you enter. Run it against a site you own or have permission to test.",
            ],
        },
        {
            heading: "Not professional advice",
            body: [
                "Nothing here is legal, immigration, financial, tax, accounting, or investment advice. Content about Canadian startup and immigration programs describes those programs as published and can go out of date without notice. For your own situation, retain a professional who is licensed to advise on it — for immigration matters in Canada, that means an authorised representative such as an RCIC or a lawyer.",
            ],
        },
        {
            heading: "Advisory engagements",
            body: [
                "Booking a call through this site starts a conversation; it does not create an advisory relationship. Any actual engagement is governed by a separate written agreement, and that agreement takes precedence over these terms.",
            ],
        },
        {
            heading: "Accounts",
            body: [
                "If you create an account, keep your credentials to yourself; you are responsible for what happens under your account. Accounts used to attack, scrape, or abuse the site can be suspended without notice.",
            ],
        },
        {
            heading: "Acceptable use",
            bullets: [
                "Do not attempt to gain access to areas of the site or to data that are not yours.",
                "Do not submit other people's personal information to the tools or the forms.",
                "Do not use automated means to hammer the tools or the APIs.",
                "Do not upload anything unlawful or anything you do not have the right to share.",
            ],
        },
        {
            heading: "Your content",
            body: [
                "You keep ownership of what you submit — form answers, uploaded decks, application materials. You grant permission to store and process that material for the purpose you submitted it for. How it is handled is described in the Privacy Policy.",
            ],
        },
        {
            heading: "This site's content",
            body: [
                "The writing, tools, frameworks and designs on this site belong to Farjad Pourmohammad unless stated otherwise. You are welcome to quote from and link to the articles with attribution. Republishing them wholesale, or rebuilding the tools as your own product, is not permitted without written permission.",
            ],
        },
        {
            heading: "Availability",
            body: [
                "The site is provided as it is, with no promise that it will be available, uninterrupted, or free of errors. Features can change or be withdrawn at any time.",
            ],
        },
        {
            heading: "Limitation of liability",
            body: [
                "To the extent the law allows, Farjad Pourmohammad is not liable for indirect or consequential loss arising from your use of this site or reliance on anything published on it, including any decision taken on the basis of a tool's score.",
            ],
        },
        {
            heading: "Governing law",
            body: [
                "These terms are governed by the laws of the Province of Ontario and the applicable laws of Canada. Disputes belong to the courts of Ontario.",
            ],
        },
        {
            heading: "Changes",
            body: [
                "These terms can change. The date at the top of the page shows when they last did.",
            ],
        },
    ],
    contactHeading: "Contact",
    contactBody: "Questions about these terms, or about working together.",
    contactEmail: "contact@farjadp.info",
}
