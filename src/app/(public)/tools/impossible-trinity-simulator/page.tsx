import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import ImpossibleTrinitySimulator from "./simulator-client"

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/impossible-trinity-simulator", "en"),
    title: "Impossible Trinity Simulator | Trade-offs You Cannot Avoid",
    description:
        "Move the sliders and watch what breaks. An interactive model of the trade-offs every founder has to choose between rather than solve.",
}

export default function ImpossibleTrinitySimulatorPage() {
    return <ImpossibleTrinitySimulator />
}
