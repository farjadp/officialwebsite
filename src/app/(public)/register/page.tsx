// ============================================================================
// File Path: src/app/(public)/register/page.tsx
// Why: The sign-up page in v3 "Light": warm charcoal ground, a quiet beam on
//      the aside, the form on the other side. Restyle only — the metadata,
//      the NOINDEX robots rule and the Suspense boundary are untouched.
// ============================================================================

import { Beam } from "@/components/v3/kit"
import { localeAlternates, NOINDEX } from "@/lib/seo"
import { Suspense } from "react"
import { RegisterForm } from "./register-form"

export const metadata = {
    robots: NOINDEX,
    alternates: localeAlternates("/register", "en"),
    title: "Create Account",
    description: "Sign up for a new account.",
}

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen overflow-x-clip bg-v3-ink font-v3-body text-v3-bone selection:bg-v3-light selection:text-v3-ink">
            {/* Left panel */}
            <div className="relative hidden w-1/2 flex-col items-start justify-end overflow-hidden border-e border-v3-line/70 p-16 lg:flex">
                <Beam />
                <div className="relative z-10 flex flex-col gap-6">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-v3-line px-3 py-1.5 text-[13px] text-v3-soft">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)]" />
                        farjadp.info
                    </span>
                    <h2 className="font-v3-display text-4xl font-light leading-[1.05] tracking-[-0.015em] md:text-5xl rtl:leading-[1.4] rtl:tracking-normal">
                        Start your<br />journey here.
                    </h2>
                    <p className="max-w-sm text-lg leading-relaxed text-v3-soft rtl:leading-loose">
                        Create a free account to explore all content, tools, and resources available on the platform.
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20 md:px-10">
                <Beam className="lg:hidden" />
                <div className="relative z-10 w-full max-w-sm">
                    <div className="mb-10 text-center lg:hidden">
                        <span className="font-v3-display text-xl font-light text-v3-bone">farjadp.info</span>
                    </div>
                    <Suspense>
                        <RegisterForm />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
