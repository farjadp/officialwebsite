// ============================================================================
// Hardware Source: src/app/admin/categories/page.tsx
// Version: 1.0.0
// Why: Category Management Page
// ============================================================================

import { getCategories } from "@/app/actions/categories"
import { CategoryManager } from "./category-manager"

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                <p className="text-muted-foreground">
                    Manage categories for your posts.
                </p>
            </div>
            <CategoryManager categories={categories} />
        </div>
    )
}
