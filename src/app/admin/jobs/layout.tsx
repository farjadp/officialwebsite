// ============================================================================
// Route: /admin/jobs/*
// Role: The owner's private job search.
// Why:  /admin admits editors; this section is the owner's own business, so
//       the layout turns everyone else away before any of it renders. The
//       actions repeat the check — a layout does not guard a server action.
// ============================================================================

import { Briefcase } from "lucide-react"
import { JobsNav } from "@/components/admin/jobs/jobs-nav"
import { requireOwnerPage } from "@/lib/jobs/guard"

export const dynamic = "force-dynamic"

export default async function JobsLayout({ children }: { children: React.ReactNode }) {
    await requireOwnerPage()

    return (
        <div className="max-w-6xl space-y-6">
            <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Job Search</h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Postings from the boards you watch, ranked against your profile. You apply; this keeps track.
                    </p>
                </div>
            </div>
            <JobsNav />
            {children}
        </div>
    )
}
