import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import ImpossibleTrinitySimulator from "@/app/(public)/tools/impossible-trinity-simulator/simulator-client"

// The simulator is one shared client component for both locales: `locale`
// picks its Persian strings and keeps its internal links under /fa.
export const metadata: Metadata = {
    alternates: localeAlternates("/tools/impossible-trinity-simulator", "fa"),
    title: "شبیه‌ساز مثلث ناممکن | بده‌بستان‌هایی که راه فرار ندارند",
    description:
        "اسلایدرها را جابه‌جا کنید و ببینید چه چیزی می‌شکند. مدلی تعاملی از بده‌بستان‌هایی که هر بنیان‌گذار باید میانشان انتخاب کند، نه اینکه حلشان کند.",
}

export default function ImpossibleTrinitySimulatorFaPage() {
    return <ImpossibleTrinitySimulator locale="fa" />
}
