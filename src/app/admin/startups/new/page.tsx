import StartupForm from "@/components/admin/StartupForm"
import { Rocket } from "lucide-react"

export default function NewStartupPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <Rocket className="h-8 w-8 text-[#1B4B43]" />
                    New Mentored Startup
                </h1>
                <p className="text-slate-500 mt-2">Add a new startup to your portfolio.</p>
            </div>

            <StartupForm />
        </div>
    )
}
