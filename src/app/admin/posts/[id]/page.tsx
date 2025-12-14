// ============================================================================
// Hardware Source: src/app/admin/posts/[id]/page.tsx
// Version: 1.0.0
// Why: Edit Existing Post Page
// ============================================================================

import { PostForm } from "../post-form"
import { getPost } from "@/app/actions/posts"
import { getCategories } from "@/app/actions/categories"
import { getTags } from "@/app/actions/tags"
import { notFound } from "next/navigation"

interface EditPostPageProps {
    params: {
        id: string
    }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    // In Next.js 15+, params is async so we should await it if needed, 
    // but the type here might differ slightly based on version. 
    // Assuming Next.js 14/15 pattern where params is accessible. 
    // Wait, params is a Promise in the latest Next.js 15 canary, 
    // but for 14 it's an object. I'll treat it as object for now, 
    // but if it errors I'll fix.

    // Actually, in the latest Next.js versions (15), params is a promise.
    // I should await it if this is Next.js 15. The package.json said "next": "16.0.7"? 
    // Wait, no, it said "next": "16.0.7" in dependencies? That's likely a typo or custom.
    // Ah, package.json in Step 14 said: "next": "16.0.7", which doesn't exist yet officially? 
    // Maybe it's 15.0.7. 
    // Regardless, I'll access it safely.

    const { id } = await Promise.resolve(params) // Safe wrap

    const post = await getPost(id)
    if (!post) {
        notFound()
    }

    const categories = await getCategories()
    const tags = await getTags()

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                <p className="text-muted-foreground mt-2">Update your content.</p>
            </div>

            <PostForm
                post={post}
                categories={categories}
                tags={tags}
            />
        </div>
    )
}
