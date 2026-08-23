// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Template library with creation and HTML import
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { createTemplate } from "@/lib/actions/email"
import { TemplateImport } from "@/components/email/template-import"

export const dynamic = "force-dynamic"

export default async function TemplatesPage() {
    const templates = await prisma.emailTemplate.findMany({ orderBy: { updatedAt: "desc" } })

    return (
        <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-2">
                <form action={createTemplate} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="font-semibold text-slate-900">New template</h2>
                    <p className="text-xs text-slate-500">
                        Start from an empty canvas and build it with blocks — or let the AI assistant draft one for you
                        inside the editor.
                    </p>
                    <div className="flex gap-2">
                        <input
                            name="name"
                            required
                            placeholder="Monthly newsletter"
                            className="flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />
                        <select name="category" className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm">
                            <option value="newsletter">Newsletter</option>
                            <option value="announcement">Announcement</option>
                            <option value="welcome">Welcome</option>
                            <option value="promo">Promo</option>
                            <option value="general">General</option>
                        </select>
                        <button
                            type="submit"
                            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                        >
                            Create
                        </button>
                    </div>
                </form>

                <TemplateImport />
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {templates.length === 0 && (
                    <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-400">
                        No templates yet.
                    </p>
                )}
                {templates.map((template) => (
                    <Link
                        key={template.id}
                        href={`/admin/newsletter/templates/${template.id}`}
                        className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-violet-400"
                    >
                        <div className="h-36 overflow-hidden border-b border-slate-100 bg-slate-50">
                            {template.html ? (
                                <iframe
                                    title={template.name}
                                    srcDoc={template.html}
                                    className="pointer-events-none h-[432px] w-[900px] origin-top-left scale-[0.4] border-0"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                    Empty template
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-slate-900 group-hover:text-violet-700">{template.name}</h3>
                            <p className="mt-0.5 text-xs text-slate-400">
                                {template.category} · updated {template.updatedAt.toLocaleDateString()}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
