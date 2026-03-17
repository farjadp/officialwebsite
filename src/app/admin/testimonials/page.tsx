"use client"

import { useState, useEffect } from "react"
import { MessageSquareQuote, Plus, Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { logUiEvent } from '@/lib/ui-log'

interface Testimonial {
    id: string
    name: string
    company: string | null
    role: string | null
    content: string
    avatar: string | null
    featured: boolean
    createdAt: string
}

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchTestimonials() {
        try {
            const res = await fetch("/api/admin/testimonials")
            const data = await res.json()
            if (data.success) {
                setTestimonials(data.data)
            }
        } catch (error) {
            toast.error("Failed to load testimonials")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTestimonials()
    }, [])

    async function toggleFeatured(id: string, currentFeatured: boolean) {
        try {
            const res = await fetch(`/api/admin/testimonials`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, featured: !currentFeatured })
            })
            const data = await res.json()
            if (data.success) {
                setTestimonials(testimonials.map(t => t.id === id ? { ...t, featured: !currentFeatured } : t))
                logUiEvent('Testimonial featured toggled', { id, featured: !currentFeatured })
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this testimonial?")) return

        try {
            const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                toast.success("Testimonial deleted")
                logUiEvent('Testimonial deleted', { id })
                setTestimonials(testimonials.filter(t => t.id !== id))
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
                        <MessageSquareQuote className="h-8 w-8 text-emerald-500" />
                        Testimonials
                    </h1>
                    <p className="text-slate-400 mt-2">Manage client endorsements and reviews.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Add Testimonial
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading testimonials...</div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                        <MessageSquareQuote className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300">No testimonials yet</h3>
                    <p className="text-slate-500 mt-1 mb-6 text-sm">Add quotes from clients to build trust on your site.</p>
                    <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Testimonial
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col">
                            <div className="p-6 flex-1 relative">
                                <MessageSquareQuote className="absolute top-6 right-6 h-12 w-12 text-slate-800/50" />
                                
                                <p className="text-sm italic text-slate-300 mb-6 relative z-10">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-3 mt-auto relative z-10">
                                    <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                                        {testimonial.avatar ? (
                                            <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-slate-400 font-medium">{testimonial.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-100">{testimonial.name}</h4>
                                        <p className="text-[11px] text-slate-400">
                                            {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-slate-950/50 border-t border-slate-800/50 flex items-center justify-between">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => toggleFeatured(testimonial.id, testimonial.featured)}
                                    className={`h-8 gap-2 text-xs font-medium ${testimonial.featured ? 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Star className={`h-3 w-3 ${testimonial.featured ? 'fill-current' : ''}`} />
                                    {testimonial.featured ? "Featured" : "Feature on site"}
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)} className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10">
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
