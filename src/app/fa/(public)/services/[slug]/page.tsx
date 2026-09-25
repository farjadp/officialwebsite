// ============================================================================
// File Path: src/app/fa/(public)/services/[slug]/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/service-detail.tsx,
//      shared by both locales; this file resolves the service from this
//      locale's data.ts and supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { localeAlternates } from "@/lib/seo"
import { ServiceDetail } from "@/components/v3/pages/service-detail"
import { SERVICES } from "../data"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const service = SERVICES.find((s) => s.id === slug)
    if (!service) return { title: "Service Not Found", robots: { index: false, follow: true } }

    return {
        alternates: localeAlternates(`/services/${slug}`, "fa"),
        title: service.title,
        description: `${service.for} ${service.outcomes[0] ?? ""}`.trim().slice(0, 155),
    }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const service = SERVICES.find((s) => s.id === slug)

    if (!service) {
        notFound()
    }

    return <ServiceDetail locale="fa" service={service} />
}
