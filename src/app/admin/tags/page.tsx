// ============================================================================
// Hardware Source: src/app/admin/tags/page.tsx
// Version: 1.0.0
// Why: Tag Management Page
// ============================================================================

import { getTags } from "@/app/actions/tags"
import { TagManager } from "./tag-manager"

export const dynamic = 'force-dynamic'

export default async function TagsPage() {
    const tags = await getTags()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tags</h2>
                <p className="text-muted-foreground">
                    Manage tags to organize your content.
                </p>
            </div>
            <TagManager tags={tags} />
        </div>
    )
}
