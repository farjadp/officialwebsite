// ============================================================================
// Hardware Source: layout.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Sub-navigation shell for the email marketing suite
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { NewsletterNav } from "@/components/email/newsletter-nav"

export const dynamic = "force-dynamic"

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="-m-8 flex min-h-full flex-col">
            <header className="border-b border-slate-200 bg-white px-8 pt-6">
                <div className="flex items-baseline gap-3">
                    <Link href="/admin/newsletter" className="text-2xl font-bold tracking-tight text-slate-900">
                        Email Marketing
                    </Link>
                    <span className="text-sm text-slate-400">Resend engine · self-hosted analytics</span>
                </div>
                <NewsletterNav />
            </header>
            <div className="flex-1 bg-slate-50 p-8">{children}</div>
        </div>
    )
}
