// ============================================================================
// Route: /admin/jobs/*
// Role: The owner's private job search.
// Why:  /admin admits editors; this section is the owner's own business, so
//       the layout turns everyone else away before any of it renders. The
//       actions repeat the check — a layout does not guard a server action.
// ============================================================================

import { Briefcase } from "lucide-react"
import { JobsNav } from "@/components/admin/jobs/jobs-nav"
import { PauseToggle } from "@/components/admin/jobs/pause-toggle"
import { isPaused } from "@/lib/jobs/control"
import { requireOwnerPage } from "@/lib/jobs/guard"

export const dynamic = "force-dynamic"

export default async function JobsLayout({ children }: { children: React.ReactNode }) {
    await requireOwnerPage()
    const paused = await isPaused()

    return (
        <div className="max-w-6xl space-y-6 print:max-w-none print:space-y-0">
            <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-slate-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Job Search</h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Postings from the sources you watch, ranked against your profile. You apply; this keeps track.
                        </p>
                    </div>
                </div>
                <PauseToggle paused={paused} />
            </div>
            {paused && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 print:hidden">
                    <b>Paused.</b> The daily run reads no sources and scores nothing until you resume. Résumés can still be written and edited.
                </p>
            )}
            <div className="print:hidden">
                <JobsNav />
            </div>
            {children}
        </div>
    )
}
