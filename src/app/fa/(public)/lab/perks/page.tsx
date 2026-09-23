// ============================================================================
// Route: /fa/lab/perks
// Role: Persian call for perk partners. The page itself lives in
//       components/perks/perks-page.tsx and renders in both locales.
// ============================================================================

import { localeAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import { PerksPage } from "@/components/perks/perks-page";

export const metadata: Metadata = {
    alternates: localeAlternates("/lab/perks", "fa"),
    title: "همکاری با آستانه برای ارائه‌دهندگان Perk | فرجاد پورمحمد",
    description:
        "به تیم‌های آستانه، برنامه‌ی ۸ هفته‌ای منتورشیپ استارتاپ‌های اولیه، Perk بدهید و در عوض کاربر واقعی و بازخورد صادقانه و ساختارمند بگیرید. بدون سهام و بدون هزینه.",
    openGraph: {
        title: "همکاری با آستانه، برای ارائه‌دهندگان Perk",
        description: "کاربر واقعی و بازخورد ساختارمند، در ازای Perk برای تیم‌های آستانه.",
        images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "آستانه" }],
    },
};

export default function FaPerkPartnersPage() {
    return <PerksPage locale="fa" />;
}
