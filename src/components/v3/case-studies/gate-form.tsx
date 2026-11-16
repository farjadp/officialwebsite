"use client"

// ============================================================================
// File: src/components/v3/case-studies/gate-form.tsx
// Role: The email gate for a case study. Posts to /api/case-study/request;
//       the document itself is never linked from the page.
// States: idle → sending (button locked, so no double submit) → sent | error.
//       Field errors come back from the server in the visitor's language.
// Consent: the delivery box is required; the marketing box is separate and
//       starts unticked (CASL express consent).
// ============================================================================

import { useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { HONEYPOT_FIELD } from "@/lib/case-study-consent"
import type { Locale } from "@/components/home/v3/copy"

export type GateFormCopy = {
    email: string
    emailPlaceholder: string
    name: string
    namePlaceholder: string
    optional: string
    consent: string
    marketing: string
    submit: string
    sending: string
    privacyLink: string
    privacyNote: string
    successTitle: string
    /** `{email}` is replaced with the address. */
    successBody: string
    successAgain: string
    errorGeneric: string
    errorNetwork: string
}

type Status = "idle" | "sending" | "sent" | "error"

const FIELD =
    "w-full rounded-xl border border-v3-line bg-v3-ink/60 px-4 py-3.5 text-base text-v3-bone placeholder:text-v3-mute/70 outline-none transition-colors duration-300 focus:border-v3-light focus-visible:ring-2 focus-visible:ring-v3-light/30 aria-[invalid=true]:border-[#e0907a]"

export function CaseStudyGateForm({ slug, locale, t }: { slug: string; locale: Locale; t: GateFormCopy }) {
    // Fixed ids, not useId(): the layout above has a useId mismatch on hydration.
    const id = `cs-${slug}`
    const [status, setStatus] = useState<Status>("idle")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [consent, setConsent] = useState(false)
    const [marketing, setMarketing] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [message, setMessage] = useState("")
    const inFlight = useRef(false)
    const statusRef = useRef<HTMLDivElement>(null)

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (inFlight.current) return
        const form = e.currentTarget
        const trap = (form.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null)?.value ?? ""

        const local: Record<string, string> = {}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) local.email = locale === "fa" ? "یک نشانی ایمیل درست وارد کنید." : "Enter a valid email address."
        if (!consent) local.consent = locale === "fa" ? "برای ارسال، این گزینه لازم است." : "We need this to send it to you."
        setErrors(local)
        if (Object.keys(local).length) return

        inFlight.current = true
        setStatus("sending")
        setMessage("")
        try {
            const res = await fetch("/api/case-study/request", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ slug, email, name, consent, marketingOptIn: marketing, locale, [HONEYPOT_FIELD]: trap }),
            })
            const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> }
            if (res.ok && data.ok) {
                setStatus("sent")
            } else {
                setErrors(data.fields ?? {})
                setMessage(data.error || t.errorGeneric)
                setStatus("error")
            }
        } catch {
            setMessage(t.errorNetwork)
            setStatus("error")
        } finally {
            inFlight.current = false
            requestAnimationFrame(() => statusRef.current?.focus())
        }
    }

    if (status === "sent") {
        return (
            <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col gap-4 rounded-2xl border border-v3-light/50 bg-v3-raise p-7 outline-none md:p-9">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-v3-light shadow-[0_0_14px_rgb(var(--v3-glow)/0.9)]" />
                <h3 className="font-v3-display text-3xl font-light">{t.successTitle}</h3>
                <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">
                    {t.successBody.replace("{email}", email.trim())}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setStatus("idle")
                        setEmail("")
                    }}
                    className="self-start px-0 py-2 text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light"
                >
                    {t.successAgain}
                </button>
            </div>
        )
    }

    const sending = status === "sending"

    return (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5 rounded-2xl border border-v3-line/80 bg-v3-raise p-6 md:p-9" aria-busy={sending}>
            {/* Honeypot: off-screen, unfocusable, ignored by autofill. */}
            <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
                <label>
                    Website
                    <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
                </label>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-email`} className="text-sm text-v3-soft">
                    {t.email}
                </label>
                <input
                    id={`${id}-email`}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    dir="ltr"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${id}-email-err` : undefined}
                    className={`${FIELD} rtl:text-right`}
                />
                {errors.email && (
                    <p id={`${id}-email-err`} className="text-sm text-[#e0907a]">
                        {errors.email}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-name`} className="text-sm text-v3-soft">
                    {t.name} <span className="text-v3-mute">({t.optional})</span>
                </label>
                <input
                    id={`${id}-name`}
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={FIELD}
                />
            </div>

            <Check
                id={`${id}-consent`}
                checked={consent}
                onChange={setConsent}
                label={t.consent}
                error={errors.consent}
                required
            />
            <Check id={`${id}-marketing`} checked={marketing} onChange={setMarketing} label={t.marketing} />

            <button
                type="submit"
                disabled={sending}
                className="group mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v3-bone px-7 py-4 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
            >
                {sending && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-v3-ink/30 border-t-v3-ink" />}
                {sending ? t.sending : t.submit}
            </button>

            <div ref={statusRef} tabIndex={-1} role="alert" aria-live="assertive" className="outline-none">
                {status === "error" && message && <p className="text-sm text-[#e0907a]">{message}</p>}
            </div>

            <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">
                {t.privacyNote}{" "}
                <Link href={locale === "fa" ? "/fa/privacy" : "/privacy"} className="text-v3-soft underline decoration-v3-line underline-offset-4 hover:text-v3-light">
                    {t.privacyLink}
                </Link>
            </p>
        </form>
    )
}

function Check({
    id,
    checked,
    onChange,
    label,
    error,
    required,
}: {
    id: string
    checked: boolean
    onChange: (v: boolean) => void
    label: string
    error?: string
    required?: boolean
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    required={required}
                    onChange={(e) => onChange(e.target.checked)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-err` : undefined}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#e8c48a]"
                />
                <span className="text-[15px] leading-relaxed text-v3-soft rtl:leading-loose">{label}</span>
            </label>
            {error && (
                <p id={`${id}-err`} className="ps-8 text-sm text-[#e0907a]">
                    {error}
                </p>
            )}
        </div>
    )
}
