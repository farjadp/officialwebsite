import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import ImpossibleTrinitySimulator from "@/app/(public)/tools/impossible-trinity-simulator/simulator-client"

// The simulator itself is the shared English client component. Only TRL has
// a Persian config today; making the rest truly Persian is separate work.
export const metadata: Metadata = {
    alternates: localeAlternates("/tools/impossible-trinity-simulator", "fa"),
    title: "شبیه‌ساز مثلث ناممکن | بده‌بستان‌هایی که راه فرار ندارند",
    description:
        "اسلایدرها را جابه‌جا کنید و ببینید چه چیزی می‌شکند. مدلی تعاملی از بده‌بستان‌هایی که هر بنیان‌گذار باید میانشان انتخاب کند، نه اینکه حلشان کند.",
}

export default function ImpossibleTrinitySimulatorFaPage() {
    return <ImpossibleTrinitySimulator />
}
