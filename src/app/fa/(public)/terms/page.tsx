import type { Metadata } from "next"
import { LegalPage } from "@/components/legal/legal-page"
import { TERMS_FA } from "@/data/legal/terms.fa"
import { localeAlternates } from "@/lib/seo"

export const metadata: Metadata = {
    alternates: localeAlternates("/terms", "fa"),
    title: "شرایط استفاده",
    description: "شرایط استفاده از این سایت، ابزارهای تشخیصی رایگان و محتوای آن — از جمله اینکه امتیاز یک ابزار چه هست و چه نیست.",
}

export default function Page() {
    return <LegalPage doc={TERMS_FA} locale="fa" />
}
