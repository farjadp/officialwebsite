import type { Metadata } from "next"
import { LegalPage } from "@/components/legal/legal-page"
import { PRIVACY_EN } from "@/data/legal/privacy.en"
import { localeAlternates } from "@/lib/seo"

export const metadata: Metadata = {
    alternates: localeAlternates("/privacy", "en"),
    title: "Privacy Policy",
    description: "What this site collects, why it collects it, which providers process it, and how to request access or deletion.",
}

export default function Page() {
    return <LegalPage doc={PRIVACY_EN} locale="en" />
}
