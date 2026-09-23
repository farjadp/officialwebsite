// ============================================================================
// Route: /lab/perks
// Role: English call for perk partners. Shares its body with /fa/lab/perks.
// ============================================================================

import { localeAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { PerksPage } from "@/components/perks/perks-page";

export const metadata: Metadata = {
    alternates: localeAlternates("/lab/perks", "en"),
    title: "Partner with Astaneh — for perk providers | Farjad Pourmohammad",
    description:
        "Offer a perk to the teams in Astaneh, an eight-week mentorship programme for early-stage startups, and get real users with honest, structured feedback in return. No equity, no cost.",
    openGraph: {
        title: "Partner with Astaneh — for perk providers",
        description: "Real users and structured feedback, in return for a perk for the Astaneh teams.",
        images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "Astaneh" }],
    },
};

export default function PerkPartnersPage() {
    return <PerksPage locale="en" />;
}
