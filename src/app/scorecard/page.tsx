import { ScorecardWidget } from "@/components/public/scorecard-widget"

export default function ScorecardPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-4 py-20">
            <div className="w-full max-w-3xl">
                <ScorecardWidget />
            </div>
        </div>
    )
}

