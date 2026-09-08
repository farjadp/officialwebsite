import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import ImpossibleTrinitySimulator from "./simulator-client"

export const metadata: Metadata = {
    alternates: canonicalOnly("/tools/impossible-trinity-simulator"),
    title: "Impossible Trinity Simulator | Trade-offs You Cannot Avoid",
    description:
        "Move the sliders and watch what breaks. An interactive model of the trade-offs every founder has to choose between rather than solve.",
}

export default function ImpossibleTrinitySimulatorPage() {
    return <ImpossibleTrinitySimulator />
}
