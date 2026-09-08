import type { Metadata } from "next"
import { LegalPage } from "@/components/legal/legal-page"
import { PRIVACY_FA } from "@/data/legal/privacy.fa"
import { localeAlternates } from "@/lib/seo"

export const metadata: Metadata = {
    alternates: localeAlternates("/privacy", "fa"),
    title: "سیاست حریم خصوصی",
    description: "این سایت چه اطلاعاتی جمع می‌کند، چرا، کدام ارائه‌دهندگان آن را پردازش می‌کنند، و چطور درخواست دسترسی یا حذف بدهید.",
}

export default function Page() {
    return <LegalPage doc={PRIVACY_FA} locale="fa" />
}
