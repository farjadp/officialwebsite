import type { Metadata } from "next"
import { LegalPage } from "@/components/legal/legal-page"
import { TERMS_EN } from "@/data/legal/terms.en"
import { localeAlternates } from "@/lib/seo"

export const metadata: Metadata = {
    alternates: localeAlternates("/terms", "en"),
    title: "Terms of Service",
    description: "Terms for using this site, its free diagnostic tools, and its content — including what a tool score is and is not.",
}

export default function Page() {
    return <LegalPage doc={TERMS_EN} locale="en" />
}
