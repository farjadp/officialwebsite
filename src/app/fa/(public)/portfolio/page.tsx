import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import PortfolioClientPageFa from "./portfolio-client"

export const metadata: Metadata = {
    alternates: localeAlternates("/portfolio", "fa"),
    title: "نمونه‌کارها | پروژه‌ها، استارتاپ‌ها و مطالعات موردی",
    description:
        "مروری گزیده بر پروژه‌های فرجاد: استارتاپ‌های ساخته‌شده، شرکت‌های مشاوره‌گرفته و سیستم‌های طراحی‌شده.",
}

export default function PortfolioPage() {
    return <PortfolioClientPageFa />
}
