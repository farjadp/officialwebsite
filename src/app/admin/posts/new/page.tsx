// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: React Server Component
// ============================================================================

import { PostForm } from "../post-form"
import { getCategories } from "@/app/actions/categories"
import { getTags } from "@/app/actions/tags"

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
    const categories = await getCategories()
    const tags = await getTags()

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
                <p className="text-muted-foreground mt-2">Write and publish your latest thoughts.</p>
            </div>

            <PostForm categories={categories} tags={tags} />
        </div>
    )
}
