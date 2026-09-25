// ============================================================================
// Hardware Source: taxonomy.ts
// Version: 1.0.0 — 2026-09-25
// Why: The category tree the engine files articles under, read from the
//      Category table — never from a string in a prompt.
//
//      The older writer (api/ai/generate-post) offers a hardcoded tree —
//      "Insights", "AI & Automation", "Founder Infrastructure"… — that shares
//      not one name with the real table ("Business", "Technology",
//      "Immigration"…). The admin form matches the generated name against real
//      rows, so every AI-generated post has silently lost its category. Reading
//      the tree from the database makes that impossible here.
// Env / Identity: `loadTaxonomy` reads Postgres; everything else is pure.
// ============================================================================

import { prisma } from "@/lib/prisma"

export type TaxonomyNode = {
    id: string
    name: string
    children: { id: string; name: string }[]
}

export type ResolvedCategory = { categoryId: string; subcategoryId: string | undefined }

export async function loadTaxonomy(): Promise<TaxonomyNode[]> {
    const rows = await prisma.category.findMany({
        select: { id: true, name: true, parentId: true },
        orderBy: { name: "asc" },
    })
    return rows
        .filter((row) => !row.parentId)
        .map((root) => ({
            id: root.id,
            name: root.name,
            children: rows
                .filter((row) => row.parentId === root.id)
                .map((child) => ({ id: child.id, name: child.name })),
        }))
}

/** The tree as the model sees it: real names only. */
export function taxonomyForPrompt(tree: TaxonomyNode[]): string {
    return tree
        .map((node) =>
            node.children.length === 0
                ? `${node.name}   (no subcategories — choose it on its own)`
                : [node.name, ...node.children.map((child) => `  └ ${child.name}`)].join("\n"),
        )
        .join("\n\n")
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/**
 * Map a model's chosen names onto real category ids.
 *
 * Returns null — never a guess — when the parent does not exist, when the
 * child is not under that parent, or when a parent that has children is
 * chosen without one: a parent with children is a folder, not a destination.
 */
export function resolveCategory(
    tree: TaxonomyNode[],
    categoryName: string,
    subcategoryName: string | undefined,
): ResolvedCategory | null {
    const parent = tree.find((node) => same(node.name, categoryName))
    if (!parent) return null

    if (parent.children.length === 0) {
        return { categoryId: parent.id, subcategoryId: undefined }
    }

    if (!subcategoryName) return null
    const child = parent.children.find((node) => same(node.name, subcategoryName))
    return child ? { categoryId: parent.id, subcategoryId: child.id } : null
}
