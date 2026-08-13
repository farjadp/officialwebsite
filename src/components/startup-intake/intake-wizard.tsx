"use client"

// ============================================================================
// Startup Intake Wizard — authenticated Persian onboarding form
// Steps: startup info → founders → 7 question sections → uploads → review → success
//        User mode is tied to the logged-in account (one intake per user).
// Draft autosaved to localStorage (debounced), cleared after submit.
// ============================================================================

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CheckCircle2,
    FileText,
    KeyRound,
    Loader2,
    Paperclip,
    Plus,
    Save,
    Send,
    Trash2,
    Upload,
    Users,
} from "lucide-react"
import { toast } from "sonner"
import {
    COUNTRIES,
    INTAKE_SECTIONS,
    faDigits,
    questionHint,
    questionText,
    type IntakeCountry,
    type IntakeFile,
} from "@/data/startup-intake/config"

// ── Types ────────────────────────────────────────────────────────────────────

interface FounderDraft {
    name: string
    role: string
    email: string
    phone: string
    linkedin: string
    photoUrl: string
}

interface FilesDraft {
    logo?: IntakeFile
    pitchDeck?: IntakeFile
    documents: IntakeFile[]
}

interface Draft {
    id?: string
    code: string
    label: string | null
    startupName: string
    website: string
    country: IntakeCountry | ""
    founders: FounderDraft[]
    answers: Record<string, string>
    files: FilesDraft
    step: number
}

interface IntakeWizardProps {
    /** Public invite-gated mode (default) or authenticated per-user mode. */
    mode?: "public" | "user"
    /** Initial data from the server for user mode. */
    initialData?: Partial<Draft>
    /** POST endpoint for final submission. */
    submitEndpoint?: string
    /** POST endpoint for file uploads. */
    uploadEndpoint?: string
}

const EMPTY_FOUNDER: FounderDraft = { name: "", role: "", email: "", phone: "", linkedin: "", photoUrl: "" }

const EMPTY_DRAFT: Draft = {
    code: "",
    label: null,
    startupName: "",
    website: "",
    country: "",
    founders: [{ ...EMPTY_FOUNDER }],
    answers: {},
    files: { documents: [] },
    step: 0,
}

const DRAFT_KEY_PUBLIC = "startup-intake-draft-v1"
const DRAFT_KEY_USER = "startup-intake-draft-user"

// Steps: 0=startup, 1=founders, 2..8=sections, 9=uploads, 10=review
const SECTION_STEP_OFFSET = 2
const UPLOAD_STEP = SECTION_STEP_OFFSET + INTAKE_SECTIONS.length // 9
const REVIEW_STEP = UPLOAD_STEP + 1 // 10
const TOTAL_STEPS = REVIEW_STEP + 1 // 11

// ── Small shared UI ──────────────────────────────────────────────────────────

const inputCls =
    "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-[#1C1917] placeholder:text-stone-400 focus:outline-none focus:border-iran-lajvard focus:ring-2 focus:ring-iran-lajvard/20 transition-all"
const labelCls = "block text-sm font-semibold text-[#1C1917] mb-1.5"
const hintCls = "text-xs text-stone-500 mt-1 leading-relaxed"

function PrimaryButton({ children, onClick, disabled, type = "button" }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: "button" | "submit"
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-iran-lajvard px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#003380] disabled:opacity-50"
        >
            {children}
        </button>
    )
}

function GhostButton({ children, onClick, disabled }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-600 transition-all hover:border-stone-400 hover:text-[#1C1917] disabled:opacity-50"
        >
            {children}
        </button>
    )
}

// ── File upload helper ──────────────────────────────────────────────────────

async function uploadIntakeFile(file: File, code: string | undefined, uploadEndpoint: string): Promise<IntakeFile> {
    const fd = new FormData()
    fd.append("file", file)
    if (code) fd.append("code", code)
    const res = await fetch(uploadEndpoint, { method: "POST", body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "آپلود فایل با خطا مواجه شد.")
    return { url: data.url, name: data.name, size: data.size }
}

function FileUploadField({ label, hint, accept, value, onChange, code, uploadEndpoint }: {
    label: string
    hint?: string
    accept: string
    value?: IntakeFile
    onChange: (f?: IntakeFile) => void
    code: string | undefined
    uploadEndpoint: string
}) {
    const [busy, setBusy] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    async function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return
        setBusy(true)
        try {
            onChange(await uploadIntakeFile(file, code, uploadEndpoint))
            toast.success("فایل با موفقیت آپلود شد.")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "آپلود فایل با خطا مواجه شد.")
        } finally {
            setBusy(false)
        }
    }

    return (
        <div>
            <span className={labelCls}>{label}</span>
            {value ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="h-4 w-4 shrink-0 text-iran-lajvard" />
                        <span className="truncate text-sm text-[#1C1917]" dir="ltr">{value.name}</span>
                    </div>
                    <button type="button" onClick={() => onChange(undefined)} className="text-stone-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-white px-4 py-5 text-sm text-stone-500 transition-all hover:border-iran-lajvard/50 hover:text-iran-lajvard disabled:opacity-50"
                >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {busy ? "در حال آپلود..." : "انتخاب فایل"}
                </button>
            )}
            {hint && <p className={hintCls}>{hint}</p>}
            <input ref={ref} type="file" accept={accept} className="hidden" onChange={handle} />
        </div>
    )
}

// ── Main wizard ─────────────────────────────────────────────────────────────

export function IntakeWizard({
    mode = "public",
    initialData,
    submitEndpoint = "/api/profile/intake",
    uploadEndpoint = "/api/profile/intake/upload",
}: IntakeWizardProps) {
    const router = useRouter()
    const isUserMode = mode === "user"
    const [phase, setPhase] = useState<"gate" | "form" | "success">(isUserMode ? "form" : "gate")
    const [draft, setDraft] = useState<Draft>(() => ({
        ...EMPTY_DRAFT,
        ...initialData,
        founders: initialData?.founders?.length ? initialData.founders : [{ ...EMPTY_FOUNDER }],
        files: { documents: [], ...initialData?.files },
    }))
    const [gateCode, setGateCode] = useState("")
    const [gateBusy, setGateBusy] = useState(false)
    const [submitBusy, setSubmitBusy] = useState(false)
    const [draftBusy, setDraftBusy] = useState(false)
    const restoredRef = useRef(false)

    // Restore draft on mount (public mode only; user mode loads from server)
    useEffect(() => {
        if (isUserMode) {
            restoredRef.current = true
            return
        }
        try {
            const raw = localStorage.getItem(DRAFT_KEY_PUBLIC)
            if (raw) {
                const saved = JSON.parse(raw) as Draft
                if (saved && saved.code) {
                    setDraft({
                        ...EMPTY_DRAFT,
                        ...saved,
                        files: { ...saved.files, documents: saved.files?.documents ?? [] },
                    })
                    setGateCode(saved.code)
                }
            }
        } catch { /* corrupted draft — ignore */ }
        restoredRef.current = true
    }, [isUserMode])

    // Debounced autosave
    useEffect(() => {
        if (!restoredRef.current || phase !== "form") return
        const key = isUserMode ? DRAFT_KEY_USER : DRAFT_KEY_PUBLIC
        const t = setTimeout(() => {
            try { localStorage.setItem(key, JSON.stringify(draft)) } catch { /* quota */ }
        }, 600)
        return () => clearTimeout(t)
    }, [draft, phase, isUserMode])

    const patch = useCallback((p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p })), [])

    const country = (draft.country || null) as IntakeCountry | null
    const step = draft.step

    // ── Gate ────────────────────────────────────────────────────────────────

    async function verifyCode() {
        const code = gateCode.trim().toUpperCase()
        if (!code) { toast.error("لطفاً کد دعوت را وارد کنید."); return }
        setGateBusy(true)
        try {
            const res = await fetch("/api/intake/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            })
            const data = await res.json()
            if (!res.ok || !data.valid) {
                toast.error(data.error || "کد دعوت معتبر نیست.")
                return
            }
            patch({ code, label: data.label ?? null })
            setPhase("form")
        } catch {
            toast.error("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.")
        } finally {
            setGateBusy(false)
        }
    }

    // If a draft exists with a code, skip the gate straight to the form
    useEffect(() => {
        if (restoredRef.current && phase === "gate" && draft.code && draft.step > 0) {
            setPhase("form")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft.code])

    // ── Per-step validation ────────────────────────────────────────────────

    function validateStep(s: number): string | null {
        if (s === 0) {
            if (!draft.startupName.trim()) return "نام استارتاپ الزامی است."
            if (!draft.country) return "لطفاً کشور مقصد را انتخاب کنید."
        }
        if (s === 1) {
            const named = draft.founders.filter((f) => f.name.trim())
            if (named.length === 0) return "حداقل یک هم‌بنیان‌گذار الزامی است."
            for (const f of draft.founders) {
                if (!f.name.trim()) continue
                if (!f.role.trim()) return `نقش «${f.name}» را وارد کنید.`
                if (!f.email.trim()) return `ایمیل «${f.name}» را وارد کنید.`
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return `ایمیل «${f.name}» معتبر نیست.`
            }
        }
        if (s >= SECTION_STEP_OFFSET && s < UPLOAD_STEP) {
            const section = INTAKE_SECTIONS[s - SECTION_STEP_OFFSET]
            for (const q of section.questions) {
                if (!draft.answers[q.id]?.trim()) return "لطفاً به همه سوالات این بخش پاسخ دهید."
            }
        }
        return null
    }

    function goNext() {
        const err = validateStep(step)
        if (err) { toast.error(err); return }
        patch({ step: Math.min(step + 1, REVIEW_STEP) })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function goBack() {
        patch({ step: Math.max(step - 1, 0) })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // ── Save Draft ─────────────────────────────────────────────────────────

    async function saveDraft() {
        if (!isUserMode) {
            toast.success("پیش‌نویس در مرورگر شما ذخیره شد.")
            return
        }
        setDraftBusy(true)
        try {
            const founders = draft.founders
                .filter((f) => f.name.trim())
                .map((f) => ({
                    name: f.name.trim(),
                    role: f.role.trim(),
                    email: f.email.trim(),
                    phone: f.phone.trim() || undefined,
                    linkedin: f.linkedin.trim() || undefined,
                    photoUrl: f.photoUrl || undefined,
                }))

            const res = await fetch(submitEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: draft.id,
                    startupName: draft.startupName.trim(),
                    website: draft.website.trim(),
                    country: draft.country,
                    founders,
                    answers: draft.answers,
                    files: {
                        logo: draft.files.logo,
                        pitchDeck: draft.files.pitchDeck,
                        documents: draft.files.documents,
                    },
                    status: "DRAFT",
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.error || "خطا در ذخیره پیش‌نویس.")
                return
            }
            toast.success("پیش‌نویس در حساب شما ذخیره شد.")
            router.push("/profile/startup-intake")
        } catch {
            toast.error("خطا در ارتباط با سرور.")
        } finally {
            setDraftBusy(false)
        }
    }

    // ── Submit ─────────────────────────────────────────────────────────────

    async function submit() {
        setSubmitBusy(true)
        try {
            const founders = draft.founders
                .filter((f) => f.name.trim())
                .map((f) => ({
                    name: f.name.trim(),
                    role: f.role.trim(),
                    email: f.email.trim(),
                    phone: f.phone.trim() || undefined,
                    linkedin: f.linkedin.trim() || undefined,
                    photoUrl: f.photoUrl || undefined,
                }))

            const res = await fetch(submitEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: draft.id,
                    ...(isUserMode ? {} : { code: draft.code }),
                    startupName: draft.startupName.trim(),
                    website: draft.website.trim(),
                    country: draft.country,
                    founders,
                    answers: draft.answers,
                    files: {
                        logo: draft.files.logo,
                        pitchDeck: draft.files.pitchDeck,
                        documents: draft.files.documents,
                    },
                    status: isUserMode ? "SUBMITTED" : undefined,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.error || "ثبت اطلاعات با خطا مواجه شد.")
                return
            }
            try { localStorage.removeItem(isUserMode ? DRAFT_KEY_USER : DRAFT_KEY_PUBLIC) } catch { /* noop */ }
            
            if (isUserMode) {
                toast.success("استارتاپ شما با موفقیت ثبت شد.")
                router.push("/profile/startup-intake")
            } else {
                setPhase("success")
                window.scrollTo({ top: 0 })
            }
        } catch {
            toast.error("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.")
        } finally {
            setSubmitBusy(false)
        }
    }

    // ── Render: success ────────────────────────────────────────────────────

    if (phase === "success") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-iran-lajvard/10">
                        <CheckCircle2 className="h-8 w-8 text-iran-lajvard" />
                    </div>
                    <h1 className="mb-3 text-2xl font-black text-[#1C1917]">اطلاعات شما ثبت شد</h1>
                    <p className="text-sm leading-relaxed text-stone-500">
                        پرسشنامه شما با موفقیت ارسال شد. پس از بررسی، از طریق ایمیل یا تلگرام با شما در تماس خواهم بود.
                    </p>
                </div>
            </div>
        )
    }

    // ── Render: gate ───────────────────────────────────────────────────────

    if (phase === "gate") {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-10 shadow-sm">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-iran-lajvard/10">
                            <KeyRound className="h-7 w-7 text-iran-lajvard" />
                        </div>
                        <h1 className="mb-2 text-2xl font-black text-[#1C1917]">پرسشنامه ورود استارتاپ</h1>
                        <p className="text-sm leading-relaxed text-stone-500">
                            این فرم مخصوص تیم‌هایی است که برای برنامه منتورشیپ پذیرفته شده‌اند. کد دعوتی که دریافت کرده‌اید را وارد کنید.
                        </p>
                    </div>
                    <label className={labelCls} htmlFor="invite-code">کد دعوت</label>
                    <input
                        id="invite-code"
                        dir="ltr"
                        value={gateCode}
                        onChange={(e) => setGateCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === "Enter") verifyCode() }}
                        placeholder="ASH-XXXXXX"
                        className={`${inputCls} text-center font-mono tracking-[0.2em]`}
                        maxLength={10}
                        autoFocus
                    />
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={verifyCode}
                            disabled={gateBusy}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-iran-lajvard px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#003380] disabled:opacity-50"
                        >
                            {gateBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
                            ورود به فرم
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Render: form ───────────────────────────────────────────────────────

    const progressPct = Math.round(((step + 1) / TOTAL_STEPS) * 100)

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
            {/* Header + progress */}
            <div className="mb-8">
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-lg font-black text-[#1C1917]">پرسشنامه ورود استارتاپ</h1>
                    {draft.label && (
                        <span className="rounded-full bg-[#D97706]/10 px-3 py-1 text-xs font-bold text-[#D97706]">
                            {draft.label}
                        </span>
                    )}
                </div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-stone-500">
                    <span>مرحله {faDigits(step + 1)} از {faDigits(TOTAL_STEPS)}</span>
                    <span>{faDigits(progressPct)}٪</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                    <div
                        className="h-full rounded-full bg-iran-lajvard transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                {step === 0 && <StepStartup draft={draft} patch={patch} />}
                {step === 1 && <StepFounders draft={draft} patch={patch} isUserMode={isUserMode} uploadEndpoint={uploadEndpoint} />}
                {step >= SECTION_STEP_OFFSET && step < UPLOAD_STEP && (
                    <StepSection
                        section={INTAKE_SECTIONS[step - SECTION_STEP_OFFSET]}
                        country={country}
                        answers={draft.answers}
                        onAnswer={(qid, val) => patch({ answers: { ...draft.answers, [qid]: val } })}
                    />
                )}
                {step === UPLOAD_STEP && <StepUploads draft={draft} patch={patch} isUserMode={isUserMode} uploadEndpoint={uploadEndpoint} />}
                {step === REVIEW_STEP && <StepReview draft={draft} country={country} />}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
                <GhostButton onClick={goBack} disabled={step === 0}>
                    <ArrowRight className="h-4 w-4" />
                    قبلی
                </GhostButton>
                
                <div className="flex items-center gap-3">
                    {isUserMode && step < REVIEW_STEP && (
                        <GhostButton onClick={saveDraft} disabled={draftBusy}>
                            {draftBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            ذخیره پیش‌نویس
                        </GhostButton>
                    )}
                    {step < REVIEW_STEP ? (
                        <PrimaryButton onClick={goNext}>
                            بعدی
                            <ArrowLeft className="h-4 w-4" />
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton onClick={submit} disabled={submitBusy}>
                            {submitBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            ارسال نهایی
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Step 0: Startup info ─────────────────────────────────────────────────────

function StepStartup({ draft, patch }: { draft: Draft; patch: (p: Partial<Draft>) => void }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-iran-lajvard" />
                <h2 className="text-lg font-black text-[#1C1917]">اطلاعات استارتاپ</h2>
            </div>

            <div>
                <label className={labelCls} htmlFor="startup-name">نام استارتاپ <span className="text-red-500">*</span></label>
                <input
                    id="startup-name"
                    dir="auto"
                    value={draft.startupName}
                    onChange={(e) => patch({ startupName: e.target.value })}
                    placeholder="نام تیم یا شرکت"
                    className={inputCls}
                />
            </div>

            <div>
                <label className={labelCls} htmlFor="startup-website">وب‌سایت (اختیاری)</label>
                <input
                    id="startup-website"
                    dir="ltr"
                    value={draft.website}
                    onChange={(e) => patch({ website: e.target.value })}
                    placeholder="https://example.com"
                    className={inputCls}
                />
            </div>

            <div>
                <span className={labelCls}>کشور مقصد <span className="text-red-500">*</span></span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {COUNTRIES.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => patch({ country: c.id })}
                            className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 transition-all ${
                                draft.country === c.id
                                    ? "border-iran-lajvard bg-iran-lajvard/5"
                                    : "border-stone-200 bg-white hover:border-stone-300"
                            }`}
                        >
                            <span className="text-3xl">{c.flag}</span>
                            <span className="text-sm font-bold text-[#1C1917]">{c.nameFa}</span>
                        </button>
                    ))}
                </div>
                <p className={hintCls}>سوالات بخش پایانی بر اساس کشور انتخابی شما تنظیم می‌شود.</p>
            </div>
        </div>
    )
}

// ── Step 1: Founders ─────────────────────────────────────────────────────────

function StepFounders({ draft, patch, isUserMode, uploadEndpoint }: {
    draft: Draft
    patch: (p: Partial<Draft>) => void
    isUserMode: boolean
    uploadEndpoint: string
}) {
    function update(i: number, p: Partial<FounderDraft>) {
        const founders = draft.founders.map((f, idx) => (idx === i ? { ...f, ...p } : f))
        patch({ founders })
    }
    function add() {
        patch({ founders: [...draft.founders, { ...EMPTY_FOUNDER }] })
    }
    function remove(i: number) {
        if (draft.founders.length === 1) return
        patch({ founders: draft.founders.filter((_, idx) => idx !== i) })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-iran-lajvard" />
                <h2 className="text-lg font-black text-[#1C1917]">هم‌بنیان‌گذاران</h2>
            </div>
            <p className="text-sm leading-relaxed text-stone-500">
                اطلاعات همه هم‌بنیان‌گذاران را وارد کنید. حداقل یک نفر الزامی است.
            </p>

            {draft.founders.map((f, i) => (
                <div key={i} className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-iran-lajvard">هم‌بنیان‌گذار {faDigits(i + 1)}</span>
                        {draft.founders.length > 1 && (
                            <button type="button" onClick={() => remove(i)} className="text-stone-400 transition-colors hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>نام و نام خانوادگی <span className="text-red-500">*</span></label>
                            <input dir="auto" value={f.name} onChange={(e) => update(i, { name: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>نقش <span className="text-red-500">*</span></label>
                            <input dir="auto" value={f.role} onChange={(e) => update(i, { role: e.target.value })} placeholder="مثلاً CEO / CTO" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>ایمیل <span className="text-red-500">*</span></label>
                            <input dir="ltr" type="email" value={f.email} onChange={(e) => update(i, { email: e.target.value })} placeholder="you@example.com" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>تلفن (اختیاری)</label>
                            <input dir="ltr" type="tel" value={f.phone} onChange={(e) => update(i, { phone: e.target.value })} className={inputCls} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>لینکدین (اختیاری)</label>
                            <input dir="ltr" value={f.linkedin} onChange={(e) => update(i, { linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className={inputCls} />
                        </div>
                        <div className="sm:col-span-2">
                            <FounderPhotoField
                                value={f.photoUrl}
                                code={isUserMode ? undefined : draft.code}
                                onChange={(url) => update(i, { photoUrl: url })}
                                uploadEndpoint={uploadEndpoint}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={add}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 px-4 py-3.5 text-sm font-bold text-stone-500 transition-all hover:border-iran-lajvard/50 hover:text-iran-lajvard"
            >
                <Plus className="h-4 w-4" />
                افزودن هم‌بنیان‌گذار
            </button>
        </div>
    )
}

function FounderPhotoField({ value, code, onChange, uploadEndpoint }: {
    value: string
    code: string | undefined
    onChange: (url: string) => void
    uploadEndpoint: string
}) {
    const [busy, setBusy] = useState(false)
    const ref = useRef<HTMLInputElement>(null)

    async function handle(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return
        setBusy(true)
        try {
            const uploaded = await uploadIntakeFile(file, code, uploadEndpoint)
            onChange(uploaded.url)
            toast.success("عکس آپلود شد.")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "آپلود عکس با خطا مواجه شد.")
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="flex items-center gap-4">
            {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="" className="h-12 w-12 rounded-xl object-cover ring-1 ring-stone-200" />
            ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-400">
                    <Users className="h-5 w-5" />
                </div>
            )}
            <button
                type="button"
                onClick={() => ref.current?.click()}
                disabled={busy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-iran-lajvard hover:underline disabled:opacity-50"
            >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {value ? "تغییر عکس" : "آپلود عکس (اختیاری)"}
            </button>
            {value && (
                <button type="button" onClick={() => onChange("")} className="text-xs text-stone-400 hover:text-red-600">
                    حذف
                </button>
            )}
            <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handle} />
        </div>
    )
}

// ── Steps 2..8: Question sections ────────────────────────────────────────────

function StepSection({ section, country, answers, onAnswer }: {
    section: (typeof INTAKE_SECTIONS)[number]
    country: IntakeCountry | null
    answers: Record<string, string>
    onAnswer: (qid: string, val: string) => void
}) {
    return (
        <div className="space-y-8">
            <div className="mb-4 flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-iran-lajvard/5">
                    <FileText className="h-5 w-5 text-iran-lajvard" />
                </div>
                <h2 className="text-xl font-black text-[#1C1917]">{section.title}</h2>
            </div>
            {section.questions.map((q) => {
                const hint = questionHint(q, country)
                const val = answers[q.id] ?? ""
                const isFilled = val.trim().length > 0
                return (
                    <div key={q.id} className="group relative">
                        <label className="mb-2 block text-[15px] font-bold text-[#1C1917]" htmlFor={`q-${q.id}`}>
                            {questionText(q, country)} <span className="text-red-500">*</span>
                        </label>
                        {hint && <p className="mb-3 text-[13px] font-medium leading-relaxed text-[#D97706]/80">راهنما: {hint}</p>}
                        <div className="relative">
                            <textarea
                                id={`q-${q.id}`}
                                dir="auto"
                                rows={4}
                                value={val}
                                onChange={(e) => onAnswer(q.id, e.target.value)}
                                placeholder="پاسخ خود را بنویسید..."
                                className="w-full resize-none overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50 px-5 py-4 text-[15px] leading-loose text-[#1C1917] placeholder:text-stone-300 shadow-sm transition-all duration-300 hover:border-stone-300 hover:bg-white focus:border-iran-lajvard focus:bg-white focus:outline-none focus:ring-4 focus:ring-iran-lajvard/15 min-h-[140px]"
                                onInput={(e) => {
                                    const t = e.target as HTMLTextAreaElement;
                                    t.style.height = "auto";
                                    t.style.height = t.scrollHeight + "px";
                                }}
                            />
                            {isFilled && (
                                <div className="pointer-events-none absolute left-4 top-4 text-iran-lajvard opacity-50 transition-all duration-300 group-focus-within:opacity-100 group-focus-within:scale-110">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// ── Step 9: Uploads ──────────────────────────────────────────────────────────

function StepUploads({ draft, patch, isUserMode, uploadEndpoint }: {
    draft: Draft
    patch: (p: Partial<Draft>) => void
    isUserMode: boolean
    uploadEndpoint: string
}) {
    const docRef = useRef<HTMLInputElement>(null)
    const [docBusy, setDocBusy] = useState(false)

    async function addDocument(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return
        setDocBusy(true)
        try {
            const uploaded = await uploadIntakeFile(file, isUserMode ? undefined : draft.code, uploadEndpoint)
            patch({ files: { ...draft.files, documents: [...draft.files.documents, uploaded] } })
            toast.success("فایل با موفقیت آپلود شد.")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "آپلود فایل با خطا مواجه شد.")
        } finally {
            setDocBusy(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-iran-lajvard" />
                <h2 className="text-lg font-black text-[#1C1917]">فایل‌ها و مدارک</h2>
            </div>
            <p className="text-sm leading-relaxed text-stone-500">
                همه فایل‌ها اختیاری هستند، اما ارسال پیچ‌دک و لوگو روند بررسی را سریع‌تر می‌کند.
            </p>

            <FileUploadField
                label="لوگو استارتاپ"
                hint="PNG، JPG، WebP یا SVG"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                value={draft.files.logo}
                onChange={(f) => patch({ files: { ...draft.files, logo: f } })}
                code={isUserMode ? undefined : draft.code}
                uploadEndpoint={uploadEndpoint}
            />

            <FileUploadField
                label="پیچ‌دک (Pitch Deck)"
                hint="PDF یا PowerPoint — حداکثر ۲۰ مگابایت"
                accept="application/pdf,.ppt,.pptx"
                value={draft.files.pitchDeck}
                onChange={(f) => patch({ files: { ...draft.files, pitchDeck: f } })}
                code={isUserMode ? undefined : draft.code}
                uploadEndpoint={uploadEndpoint}
            />

            <div>
                <span className={labelCls}>سایر مدارک</span>
                {draft.files.documents.length > 0 && (
                    <div className="mb-3 space-y-2">
                        {draft.files.documents.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <Paperclip className="h-4 w-4 shrink-0 text-iran-lajvard" />
                                    <span className="truncate text-sm" dir="ltr">{doc.name}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => patch({ files: { ...draft.files, documents: draft.files.documents.filter((_, idx) => idx !== i) } })}
                                    className="text-stone-400 transition-colors hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => docRef.current?.click()}
                    disabled={docBusy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-white px-4 py-5 text-sm text-stone-500 transition-all hover:border-iran-lajvard/50 hover:text-iran-lajvard disabled:opacity-50"
                >
                    {docBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {docBusy ? "در حال آپلود..." : "افزودن مدرک"}
                </button>
                <p className={hintCls}>PDF، فایل‌های آفیس یا تصویر — هر فایل حداکثر ۲۰ مگابایت</p>
                <input
                    ref={docRef}
                    type="file"
                    accept="application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={addDocument}
                />
            </div>
        </div>
    )
}

// ── Step 10: Review ──────────────────────────────────────────────────────────

function StepReview({ draft, country }: { draft: Draft; country: IntakeCountry | null }) {
    const countryData = useMemo(() => COUNTRIES.find((c) => c.id === draft.country), [draft.country])

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-iran-lajvard" />
                <h2 className="text-lg font-black text-[#1C1917]">بازبینی نهایی</h2>
            </div>
            <p className="text-sm leading-relaxed text-stone-500">
                لطفاً همه اطلاعات را بررسی کنید. پس از ارسال، امکان ویرایش از این صفحه وجود ندارد.
            </p>

            {/* Startup */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
                <h3 className="mb-3 text-sm font-black text-iran-lajvard">استارتاپ</h3>
                <dl className="space-y-2 text-sm">
                    <div className="flex gap-2"><dt className="font-bold text-stone-500">نام:</dt><dd dir="auto">{draft.startupName}</dd></div>
                    {draft.website && <div className="flex gap-2"><dt className="font-bold text-stone-500">وب‌سایت:</dt><dd dir="ltr">{draft.website}</dd></div>}
                    <div className="flex gap-2 items-center">
                        <dt className="font-bold text-stone-500">کشور مقصد:</dt>
                        <dd>{countryData ? `${countryData.flag} ${countryData.nameFa}` : "—"}</dd>
                    </div>
                </dl>
            </div>

            {/* Founders */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
                <h3 className="mb-3 text-sm font-black text-iran-lajvard">هم‌بنیان‌گذاران</h3>
                <div className="space-y-3">
                    {draft.founders.filter((f) => f.name.trim()).map((f, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                            {f.photoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={f.photoUrl} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-stone-200" />
                            ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-400">
                                    <Users className="h-4 w-4" />
                                </div>
                            )}
                            <div>
                                <span className="font-bold" dir="auto">{f.name}</span>
                                <span className="text-stone-500"> — {f.role}</span>
                                <span className="block text-xs text-stone-400" dir="ltr">{f.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Answers per section */}
            {INTAKE_SECTIONS.map((section) => (
                <div key={section.id} className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
                    <h3 className="mb-4 text-sm font-black text-iran-lajvard">{section.title}</h3>
                    <div className="space-y-4">
                        {section.questions.map((q) => (
                            <div key={q.id}>
                                <p className="mb-1 text-xs font-bold text-stone-500">{questionText(q, country)}</p>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed" dir="auto">
                                    {draft.answers[q.id] || "—"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Files */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
                <h3 className="mb-3 text-sm font-black text-iran-lajvard">فایل‌ها</h3>
                <ul className="space-y-1.5 text-sm">
                    <li>لوگو: {draft.files.logo ? <span dir="ltr">{draft.files.logo.name}</span> : <span className="text-stone-400">ارسال نشده</span>}</li>
                    <li>پیچ‌دک: {draft.files.pitchDeck ? <span dir="ltr">{draft.files.pitchDeck.name}</span> : <span className="text-stone-400">ارسال نشده</span>}</li>
                    <li>
                        سایر مدارک: {draft.files.documents.length > 0
                            ? faDigits(draft.files.documents.length) + " فایل"
                            : <span className="text-stone-400">ارسال نشده</span>}
                    </li>
                </ul>
            </div>
        </div>
    )
}
