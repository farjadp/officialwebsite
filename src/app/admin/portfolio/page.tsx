"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, FolderGit2, Globe, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Project {
    id: string
    title: string
    slug: string
    description: string | null
    featured: boolean
    technologies: string[]
    websiteUrl: string | null
    githubUrl: string | null
    createdAt: string
}

export default function PortfolioAdminPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchProjects() {
        try {
            const res = await fetch("/api/admin/projects")
            const data = await res.json()
            if (data.success) {
                setProjects(data.data)
            }
        } catch (error) {
            toast.error("Failed to load projects")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return

        try {
            const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                toast.success("Project deleted")
                setProjects(projects.filter(p => p.id !== id))
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
                        <FolderGit2 className="h-8 w-8 text-violet-500" />
                        Portfolio Manager
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your client case studies and personal projects.</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                        <FolderGit2 className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300">No projects yet</h3>
                    <p className="text-slate-500 mt-1 mb-6 text-sm">Create your first portfolio item to showcase your work.</p>
                    <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col">
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg text-slate-100 line-clamp-1">{project.title}</h3>
                                    {project.featured && <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-0">Featured</Badge>}
                                </div>
                                
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                                    {project.description || "No description provided."}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.slice(0, 3).map((tech, i) => (
                                        <Badge key={i} variant="outline" className="border-slate-700 text-slate-300 text-[10px] py-0">{tech}</Badge>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="text-xs text-slate-500">+{project.technologies.length - 3}</span>
                                    )}
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-slate-950/50 border-t border-slate-800/50 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {project.websiteUrl && (
                                        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-white transition bg-slate-800 rounded-md hover:bg-slate-700">
                                            <Globe className="h-4 w-4" />
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-white transition bg-slate-800 rounded-md hover:bg-slate-700">
                                            <Github className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
