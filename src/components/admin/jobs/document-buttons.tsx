"use client"

import { useState } from "react"
import { Copy, Printer } from "lucide-react"

const BUTTON =
    "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"

export function PrintButton() {
    return (
        <button type="button" onClick={() => window.print()} className={BUTTON}>
            <Printer className="h-4 w-4" /> Print or save PDF
        </button>
    )
}

export function CopyButton({ text }: { text: string }) {
    const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
    return (
        <button
            type="button"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text)
                    setState("copied")
                } catch {
                    setState("failed")
                }
            }}
            className={BUTTON}
        >
            <Copy className="h-4 w-4" /> {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy text"}
        </button>
    )
}
