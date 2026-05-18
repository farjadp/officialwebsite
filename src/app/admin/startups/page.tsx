"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Rocket, Globe, Linkedin, Calendar, CheckCircle2, CircleDashed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { logUiEvent } from '@/lib/ui-log'
import Link from 'next/link'

interface MentoredStartup {
    id: string
    name: string
    industry: string
    satisfaction: string
    status: string
    isActive: boolean
    startDate: string
    endDate: string
    website: string | null
    linkedin: string | null
    logo: string | null
    description: string
    founderName: string
    founderPhoto: string | null
    order: number
    createdAt: string
}

export default function StartupsAdminPage() {
    const [startups, setStartups] = useState<MentoredStartup[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchStartups() {
        try {
            const res = await fetch("/api/admin/startups")
            const data = await res.json()
            if (data.success) {
                setStartups(data.data)
            }
        } catch (error) {
            toast.error("Failed to load startups or case studies")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStartups()
    }, [])

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this startup?")) return

        try {
            const res = await fetch(`/api/admin/startups?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                toast.success("Startup deleted")
                logUiEvent('Startup deleted', { id })
                setStartups(startups.filter(s => s.id !== id))
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <Rocket className="h-8 w-8 text-[#1B4B43]" />
                        Mentored Startups
                    </h1>
                    <p className="text-slate-500 mt-2">Manage the startups and companies you've advised or mentored.</p>
                </div>
                <Link href="/admin/startups/new">
                    <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white gap-2">
                        <Plus className="h-4 w-4" />
                        New Startup
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading startups...</div>
            ) : startups.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                        <Rocket className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300">No startups yet</h3>
                    <p className="text-slate-500 mt-1 mb-6 text-sm">Add your first mentored startup to showcase your portfolio.</p>
                    <Link href="/admin/startups/new">
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Startup
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {startups.map((startup) => (
                        <div key={startup.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col">
                            <div className="p-5 flex-1">
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-sm border border-slate-700 overflow-hidden shrink-0 bg-slate-800">
                                        {startup.logo && <img src={startup.logo} alt="" className="w-full h-full object-cover grayscale" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-lg text-slate-100 line-clamp-1">{startup.name}</h3>
                                            <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-0 text-[10px]">{startup.satisfaction}</Badge>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-400 border-none uppercase tracking-wider font-mono">
                                            {startup.industry}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
                                    {startup.description}
                                </p>

                                <div className="flex flex-col gap-2 mb-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>{startup.startDate} — {startup.endDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {startup.isActive ? <CircleDashed className="w-3 h-3 text-blue-400" /> : <CheckCircle2 className="w-3 h-3 text-green-400" />}
                                        <span>{startup.status}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full border border-slate-700 overflow-hidden shrink-0 bg-slate-800">
                                            {startup.founderPhoto && <img src={startup.founderPhoto} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <span>{startup.founderName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-slate-950/50 border-t border-slate-800/50 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {startup.website && (
                                        <a href={startup.website} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-white transition bg-slate-800 rounded-md hover:bg-slate-700">
                                            <Globe className="h-4 w-4" />
                                        </a>
                                    )}
                                    {startup.linkedin && (
                                        <a href={startup.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-white transition bg-slate-800 rounded-md hover:bg-slate-700">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/startups/${startup.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(startup.id)} className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10">
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
