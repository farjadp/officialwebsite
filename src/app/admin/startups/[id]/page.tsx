import { prisma } from "@/lib/prisma"
import StartupForm from "@/components/admin/StartupForm"
import { Rocket } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditStartupPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const startup = await prisma.mentoredStartup.findUnique({
        where: { id: resolvedParams.id }
    })

    if (!startup) {
        notFound()
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <Rocket className="h-8 w-8 text-[#1B4B43]" />
                    Edit Mentored Startup
                </h1>
                <p className="text-slate-500 mt-2">Update the details of this startup.</p>
            </div>

            <StartupForm initialData={startup} isEdit />
        </div>
    )
}
