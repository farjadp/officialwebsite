import type { Metadata } from "next"
import { NOINDEX } from "@/lib/seo"
import { requirePortalUser } from "@/lib/portal-guard"
import { PortalPlaceholder } from "@/components/v3/pages/portal-shell"

export const metadata: Metadata = { robots: NOINDEX }

export default async function FaFinancePaymentPage() {
    const { isPrivileged } = await requirePortalUser("/login")
    return (
        <PortalPlaceholder
            locale="fa"
            active="finance-payment"
            isPrivileged={isPrivileged}
            title="Access Denied"
            body="You do not have permission to access this section."
        />
    )
}
