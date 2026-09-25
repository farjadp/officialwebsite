import type { Metadata } from "next"
import { NOINDEX } from "@/lib/seo"
import { requirePortalUser } from "@/lib/portal-guard"
import { PortalPlaceholder } from "@/components/v3/pages/portal-shell"

export const metadata: Metadata = { robots: NOINDEX }

export default async function FaEduFilesPage() {
    const { isPrivileged } = await requirePortalUser("/fa/login")
    return (
        <PortalPlaceholder
            locale="fa"
            active="edu-files"
            isPrivileged={isPrivileged}
            title="دسترسی مسدود است"
            body="دسترسی به این بخش در حال حاضر برای شما مجاز نمی‌باشد."
        />
    )
}
