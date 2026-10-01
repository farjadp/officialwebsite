// ============================================================================
// Route: /admin/jobs/profile
// Role: Who is looking and for what — the one description the prefilter and
//       the scorer both read.
// Note: Owner only (see ../layout.tsx). Stored in the database, never in the
//       repository.
// ============================================================================

import { ProfileForm } from "@/components/admin/jobs/profile-form"
import { formatEducation, formatHistory } from "@/lib/jobs/history"
import { formatLanes, loadProfile } from "@/lib/jobs/profile"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
    const profile = await loadProfile()

    return (
        <div className="max-w-3xl">
            <ProfileForm
                initial={{
                    headline: profile.headline,
                    summary: profile.summary,
                    authCA: profile.authorisation.CA,
                    authUS: profile.authorisation.US,
                    lanes: formatLanes(profile.lanes),
                    exclude: profile.excludeTitleKeywords.join(", "),
                    name: profile.contact.name,
                    email: profile.contact.email,
                    phone: profile.contact.phone,
                    location: profile.contact.location,
                    links: profile.contact.links.join(", "),
                    history: formatHistory(profile.history),
                    education: formatEducation(profile.education),
                    certifications: profile.certifications.join("\n"),
                    skills: profile.skills.join(", "),
                }}
            />
        </div>
    )
}
