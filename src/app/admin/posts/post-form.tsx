'use client'

// ============================================================================
// Hardware Source: post-form.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Functional module
// Env / Identity: Client Component
// ============================================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RichTextEditor } from '@/components/editor/rich-text-editor'
import { createPost, updatePost } from '@/app/actions/posts'
import type { Post, Category, Tag } from '@prisma/client'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react'
import { TagInput } from '@/components/admin/tag-input'
import { AIContentGenerator } from '@/components/admin/ai-content-generator'

type SocialPlatforms = { telegram: boolean; twitter: boolean; linkedin: boolean }

enum PostStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
}

const postSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    slug: z.string().min(2, {
        message: "Slug must be at least 2 characters.",
    }),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    status: z.nativeEnum(PostStatus),
    categoryIds: z.array(z.string()),
    tagIds: z.array(z.string()),
    coverImage: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostFormProps {
    post?: Post & { categories: Category[]; tags: Tag[] }
    categories: Category[]
    tags: Tag[] // Assuming simple list for now
}

export function PostForm({ post, categories, tags }: PostFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [socialPublishConfig, setSocialPublishConfig] = useState<SocialPlatforms | null>(null)

    // AI Generation handler — fills all form fields with generated content
    const handleAIGenerated = (generated: {
        title: string
        slug: string
        excerpt: string
        content: string
        seoTitle: string
        seoDescription: string
        seoKeywords: string
        coverImageUrl: string | null
        socialPlatforms?: SocialPlatforms
    }) => {
        form.setValue('title', generated.title)
        form.setValue('slug', generated.slug)
        form.setValue('excerpt', generated.excerpt)
        form.setValue('content', generated.content)
        form.setValue('seoTitle', generated.seoTitle)
        form.setValue('seoDescription', generated.seoDescription)
        form.setValue('seoKeywords', generated.seoKeywords)
        if (generated.coverImageUrl) {
            form.setValue('coverImage', generated.coverImageUrl)
        }
        // Store social platform config for auto-publish after save
        setSocialPublishConfig(generated.socialPlatforms || null)
    }

    const defaultValues: PostFormValues = {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        excerpt: post?.excerpt || "",
        status: (post?.status as unknown as PostStatus) || PostStatus.DRAFT,
        categoryIds: post?.categories?.map((c) => c.id) || [],
        tagIds: post?.tags?.map((t) => t.id) || [],
        coverImage: post?.coverImage || "",
        seoTitle: post?.seoTitle || "",
        seoDescription: post?.seoDescription || "",
        seoKeywords: post?.seoKeywords || "",
    }

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues,
    })

    // Auto-generate slug from title if creating new post
    const title = form.watch("title")
    useEffect(() => {
        if (!post && title) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "")
            form.setValue("slug", slug)
        }
    }, [title, post, form])

    async function onSubmit(data: PostFormValues) {
        setIsPending(true)
        try {
            if (post) {
                const result = await updatePost({ id: post.id, ...data })
                if (result.success) {
                    toast.success("Post updated successfully")
                    router.push("/admin/posts")
                } else {
                    toast.error(result.error || "Something went wrong")
                }
            } else {
                const result = await createPost({ ...data, ...(socialPublishConfig ? { skipAutoPublish: true } : {}) })
                if (result.success && result.data?.id) {
                    const postId = result.data.id
                    toast.success("Post created successfully")

                    // Trigger social auto-publish in background if configured
                    if (socialPublishConfig) {
                        const anyEnabled = socialPublishConfig.telegram || socialPublishConfig.twitter || socialPublishConfig.linkedin
                        if (anyEnabled) {
                            const platformNames = [
                                socialPublishConfig.telegram && 'Telegram',
                                socialPublishConfig.twitter && 'X/Twitter',
                                socialPublishConfig.linkedin && 'LinkedIn',
                            ].filter(Boolean).join(', ')
                            toast.loading(`Publishing to ${platformNames}...`, { id: 'social-publish' })

                            fetch(`/api/admin/posts/${postId}/publish-social`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ platforms: socialPublishConfig }),
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.success) {
                                        toast.success(`Published to ${platformNames} ✓`, { id: 'social-publish' })
                                    } else {
                                        toast.error(`Social publish failed: ${data.error}`, { id: 'social-publish' })
                                    }
                                })
                                .catch(() => {
                                    toast.error('Social publish request failed', { id: 'social-publish' })
                                })
                        }
                    }

                    router.push("/admin/posts")
                } else if (result.success) {
                    toast.success("Post created successfully")
                    router.push("/admin/posts")
                } else {
                    toast.error(result.error || "Something went wrong")
                }
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsPending(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Upload failed')

            const data = await res.json()
            form.setValue('coverImage', data.url)
            toast.success('Image uploaded')
        } catch (error) {
            toast.error('Failed to upload image')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column (2 cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* AI Generator button bar */}
                        <div className="flex items-center justify-between p-4 bg-violet-50 border border-violet-200 rounded-xl">
                            <div>
                                <p className="font-semibold text-violet-900 text-sm">✨ AI Content Generator</p>
                                <p className="text-xs text-violet-600">Generate a complete article with cover image using GPT-4o + DALL-E 3</p>
                            </div>
                            <AIContentGenerator onGenerated={handleAIGenerated} />
                        </div>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter post title" className="text-lg font-medium" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="seoTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SEO Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Meta title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="seoDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Brief summary for search engines" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Right Column (1 col) */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publishing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="post-slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-4 flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? "Saving..." : post ? "Update" : "Publish"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="tagIds"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <TagInput
                                                    selectedTagIds={field.value}
                                                    onTagsChange={field.onChange}
                                                    availableTags={tags}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="categoryIds"
                                    render={() => (
                                        <FormItem>
                                            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                                                {categories.map((category) => (
                                                    <FormField
                                                        key={category.id}
                                                        control={form.control}
                                                        name="categoryIds"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={category.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="h-4 w-4 rounded border-gray-300"
                                                                            checked={field.value?.includes(category.id)}
                                                                            onChange={(checked) => {
                                                                                return checked.target.checked
                                                                                    ? field.onChange([...field.value, category.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== category.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {category.name}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex flex-col gap-4">
                                                    {field.value && (
                                                        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                                            <img
                                                                src={field.value}
                                                                alt="Cover"
                                                                className="object-cover w-full h-full"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                size="icon"
                                                                className="absolute top-2 right-2 h-6 w-6"
                                                                onClick={() => field.onChange('')}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {!field.value && (
                                                        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                                                <p className="text-sm text-muted-foreground text-center">
                                                                    <span className="font-semibold">Click to upload</span>
                                                                    <br /> or drag and drop
                                                                </p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                disabled={isUploading}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Excerpt</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Short summary..."
                                                    className="resize-none h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    )
}
