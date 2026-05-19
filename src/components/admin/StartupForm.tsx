"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Save, Loader2, UploadCloud } from "lucide-react"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import Link from "next/link"

interface StartupFormProps {
    initialData?: any
    isEdit?: boolean
}

export default function StartupForm({ initialData, isEdit }: StartupFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploadingField, setUploadingField] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        industry: initialData?.industry || "",
        satisfaction: initialData?.satisfaction || "100%",
        status: initialData?.status || "Active Advisory",
        isActive: initialData?.isActive ?? true,
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || "",
        website: initialData?.website || "",
        linkedin: initialData?.linkedin || "",
        logo: initialData?.logo || "",
        description: initialData?.description || "",
        founderName: initialData?.founderName || "",
        founderPhoto: initialData?.founderPhoto || "",
        order: initialData?.order || 0,
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingField(fieldName)

        try {
            const formData = new FormData()
            formData.append('file', file)
            
            const res = await fetch('/api/media/upload', { 
                method: 'POST', 
                body: formData 
            })
            
            if (!res.ok) throw new Error('Upload failed')
            
            const data = await res.json()
            setFormData(prev => ({ ...prev, [fieldName]: data.url }))
            toast.success('Image uploaded successfully')
        } catch (error) {
            toast.error('Failed to upload image')
        } finally {
            setUploadingField(null)
            if (e.target) e.target.value = ''
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement
        if (type === 'checkbox') {
             const checked = (e.target as HTMLInputElement).checked
             setFormData(prev => ({ ...prev, [name]: checked }))
        } else if (name === 'order') {
             setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
        } else {
             setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEdit ? `/api/admin/startups?id=${initialData.id}` : "/api/admin/startups"
            const method = isEdit ? "PATCH" : "POST"

            const body = isEdit ? { id: initialData.id, ...formData } : formData

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (data.success) {
                toast.success(isEdit ? "Startup updated" : "Startup created")
                router.push("/admin/startups")
                router.refresh()
            } else {
                toast.error(data.error || "Something went wrong")
            }
        } catch (error) {
            toast.error("Failed to save startup")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Startup Name</label>
                    <Input required name="name" value={formData.name} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="e.g. Imedica" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Industry</label>
                    <Input required name="industry" value={formData.industry} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="e.g. HealthTech" />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Start Date</label>
                    <Input required name="startDate" value={formData.startDate} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="e.g. Jan 2018" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">End Date</label>
                    <Input required name="endDate" value={formData.endDate} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="e.g. Present" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Status</label>
                    <Input required name="status" value={formData.status} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="e.g. Active Advisory" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Satisfaction/Health</label>
                    <Input required name="satisfaction" value={formData.satisfaction} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="e.g. 98%" />
                </div>

                <div className="space-y-2 flex items-center gap-3">
                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-[#1B4B43] focus:ring-[#1B4B43] focus:ring-offset-slate-900" />
                    <label htmlFor="isActive" className="text-sm font-medium text-slate-300 cursor-pointer mb-0">Is Active Advisory?</label>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Display Order</label>
                    <Input required type="number" name="order" value={formData.order} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
                    <TiptapEditor 
                        content={formData.description} 
                        onChange={(html) => setFormData(prev => ({ ...prev, description: html }))} 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Founder Name</label>
                    <Input required name="founderName" value={formData.founderName} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Founder Photo URL</label>
                    <div className="flex gap-2">
                        <Input name="founderPhoto" value={formData.founderPhoto || ''} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100 flex-1" placeholder="https://..." />
                        <label className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md px-3 cursor-pointer transition-colors shrink-0">
                            {uploadingField === 'founderPhoto' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'founderPhoto')} disabled={!!uploadingField} />
                        </label>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Company Logo URL</label>
                    <div className="flex gap-2">
                        <Input name="logo" value={formData.logo || ''} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100 flex-1" placeholder="https://..." />
                        <label className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md px-3 cursor-pointer transition-colors shrink-0">
                            {uploadingField === 'logo' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} disabled={!!uploadingField} />
                        </label>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Website URL</label>
                    <Input name="website" value={formData.website || ''} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">LinkedIn URL</label>
                    <Input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className="bg-slate-950 border-slate-800 text-slate-100" placeholder="https://linkedin.com/..." />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
                <Link href="/admin/startups">
                    <Button type="button" variant="ghost" className="text-slate-400 hover:text-white">Cancel</Button>
                </Link>
                <Button type="submit" disabled={loading} className="bg-[#1B4B43] hover:bg-[#133832] text-white">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? "Save Changes" : "Create Startup"}
                </Button>
            </div>
        </form>
    )
}
