"use client"

// Opens the browser's print dialog, where "Save as PDF" lives.
export function PrintButton({ label }: { label: string }) {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-12 items-center gap-3 rounded-full border border-v3-bone/60 px-7 py-4 font-medium text-v3-bone transition-all duration-300 hover:border-v3-light hover:text-v3-light print:hidden"
        >
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {label}
        </button>
    )
}
