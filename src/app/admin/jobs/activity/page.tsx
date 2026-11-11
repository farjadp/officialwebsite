// ============================================================================
// Route: /admin/jobs/activity
// Role: Every step the job search takes, live: daily and on-demand runs, each
//       source read, scoring, résumés written, status changes, pause/resume,
//       and the job-hunter agent's own steps.
// Note: Owner only (see ../layout.tsx). The feed polls for new lines.
// ============================================================================

import { ActivityFeed } from "@/components/admin/jobs/activity-feed"
import { listActivity } from "@/lib/jobs/activity"

export const dynamic = "force-dynamic"

export default async function JobsActivityPage() {
    const initial = await listActivity({ limit: 200 })

    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-600">
                Everything the job search and the job-hunter agent do, newest first. New lines appear on their own
                every few seconds while this tab is open.
            </p>
            <ActivityFeed initial={initial} />
        </div>
    )
}
