// ============================================================================
// Hardware Source: src/app/admin/categories/category-manager.tsx
// Version: 1.1.0
// Why: Category Management (Hierarchy + Icons + Seeding)
// ============================================================================

'use client'

import { useState, useMemo } from 'react'
import { Category } from '@prisma/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createCategory, deleteCategory } from '@/app/actions/categories'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Trash, RefreshCw } from 'lucide-react'
import { IconPicker } from '@/components/admin/icon-picker'
import * as LucideIcons from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ExtendedCategory extends Category {
    _count: { posts: number }
    children?: ExtendedCategory[]
}

interface CategoryManagerProps {
    categories: (Category & { _count: { posts: number } })[]
}

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
    const router = useRouter()
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [icon, setIcon] = useState('')
    const [parentId, setParentId] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [isSeeding, setIsSeeding] = useState(false)

    // Build hierarchy
    const hierarchy = useMemo(() => {
        // First identify roots
        const roots = initialCategories.filter(c => !c.parentId)

        // Helper to find children recursively
        const buildTree = (cats: typeof initialCategories): ExtendedCategory[] => {
            return cats.map(cat => ({
                ...cat,
                children: buildTree(initialCategories.filter(c => c.parentId === cat.id))
            }))
        }

        return buildTree(roots)
    }, [initialCategories])

    // Helper for rendering indented options
    const renderOptions = (cats: ExtendedCategory[], depth = 0): React.ReactNode[] => {
        return cats.flatMap(cat => [
            <SelectItem key={cat.id} value={cat.id}>
                {'\u00A0'.repeat(depth * 4)} {cat.name}
            </SelectItem>,
            ...renderOptions(cat.children || [], depth + 1)
        ])
    }

    // Helper for rendering indented table rows
    const renderRows = (cats: ExtendedCategory[], depth = 0): React.ReactNode[] => {
        return cats.flatMap(cat => {
            const Icon = cat.icon ? (LucideIcons as any)[cat.icon] : null
            return [
                <tr key={cat.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">
                        <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
                            {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                            {cat.name}
                        </div>
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{cat.description}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{cat.slug}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">{cat._count.posts}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </td>
                </tr>,
                ...renderRows(cat.children || [], depth + 1)
            ]
        })
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setName(val)
        if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPending(true)
        try {
            const res = await createCategory({
                name,
                slug,
                description,
                icon,
                parentId: parentId === "none" ? undefined : (parentId || undefined)
            })
            if (res.success) {
                toast.success('Category created')
                setName('')
                setSlug('')
                setDescription('')
                setIcon('')
                setParentId(null)
                router.refresh()
            } else {
                toast.error(res.error || 'Failed to create category')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsPending(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This might act weird if it has children.')) return
        try {
            const res = await deleteCategory(id)
            if (res.success) {
                toast.success('Category deleted')
                router.refresh()
            } else {
                toast.error('Failed to delete')
            }
        } catch (error) {
            toast.error('Error deleting')
        }
    }

    const handleSeed = async () => {
        setIsSeeding(true)
        try {
            const res = await fetch('/api/admin/seed')
            const data = await res.json()
            if (data.success) {
                toast.success('Categories seeded successfully')
                router.refresh()
            } else {
                toast.error(`Failed to seed: ${data.error}`)
            }
        } catch (error) {
            toast.error('Seed request failed')
        } finally {
            setIsSeeding(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={name} onChange={handleNameChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parent">Parent Category</Label>
                                <Select value={parentId || "none"} onValueChange={setParentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {renderOptions(hierarchy)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Icon</Label>
                                <IconPicker value={icon} onChange={setIcon} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? 'Adding...' : 'Add New Category'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                        <CardDescription>Helper utilities for setup.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" size="sm" className="w-full" onClick={handleSeed} disabled={isSeeding}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${isSeeding ? 'animate-spin' : ''}`} />
                            {isSeeding ? 'Seeding...' : 'Seed Default Categories'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Description</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Slug</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Count</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {renderRows(hierarchy)}
                                    {initialCategories.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No categories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
