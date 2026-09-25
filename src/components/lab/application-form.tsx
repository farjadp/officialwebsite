"use client";

// Shared by /lab and /fa/lab. One component in two languages, posting to the
// same /api/lab-apply endpoint, so the two application forms cannot drift.
// v3 "Light" (2026-09-25): restyled only — fields, validation, payload,
// endpoints and messages are unchanged. The deck input is now visually
// hidden (sr-only) rather than display:none, so it can be reached by keyboard.

import { useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, FileText, Loader2, Upload, X } from "lucide-react";
import type { Locale } from "@/lib/perk-offer";

type Stage = "idea" | "validation" | "pre-mvp" | "";

interface FormData {
  name: string;
  email: string;
  phone: string;
  telegram: string;
  social: string;
  stage: Stage;
  problem: string;
  why: string;
}

const PROBLEM_MIN = 30;
const WHY_MIN = 20;

const COPY = {
  en: {
    stages: [
      { value: "idea" as const, label: "Idea", sub: "I have an idea, not tested yet" },
      { value: "validation" as const, label: "Validation", sub: "I've spoken to a few people" },
      { value: "pre-mvp" as const, label: "Pre-MVP", sub: "Building, or ready to build" },
    ],
    name: "Full name",
    namePlaceholder: "e.g. Ali Ahmadi",
    email: "Email",
    phone: "Phone",
    telegram: "Telegram handle or number",
    social: "Social profile or website",
    socialHint: "LinkedIn, Instagram, your startup's site — whichever introduces you best.",
    stage: "What stage are you at?",
    problem: "What problem or idea are you working on?",
    problemHint: "It does not have to be complete — just be honest.",
    problemPlaceholder: "e.g. I want to build a tool for Iranian freelancers to invoice in foreign currency. I don't yet know how much they'd pay.",
    why: "Why now, and why this programme?",
    whyHint: "What do you expect from eight weeks of working together?",
    whyPlaceholder: "e.g. I want to find out whether this idea has real customers, or whether I'm the only one who likes it.",
    deck: "Pitch deck or any document you have",
    deckHint: "Optional — PDF, PowerPoint or Word, up to 20 MB. Not having one costs you nothing.",
    deckChoose: "Choose a file",
    deckUploading: "Uploading…",
    deckRemove: "Remove file",
    deckFailed: "Upload failed.",
    deckError: "Something went wrong uploading the file.",
    submit: "Send application",
    sending: "Sending…",
    charCount: (n: number) => `${n} characters`,
    errors: {
      name: "Enter your name",
      email: "Enter a valid email address",
      phone: "Enter a phone number",
      telegram: "Enter your Telegram handle or number",
      stage: "Choose a stage",
      problem: `Please write at least ${PROBLEM_MIN} characters`,
      why: `Please write at least ${WHY_MIN} characters`,
    },
    submitError: "Something went wrong. Please try again.",
    doneTitle: "Received. Thank you for the time.",
    doneBody: "Your application came straight to me. Cohort one (Astaneh) is full, so you are now in the queue for the next one — when it opens, you will hear from me first.",
    doneSign: "Farjad · Founder Development Lab",
  },
  fa: {
    stages: [
      { value: "idea" as const, label: "Idea", sub: "ایده دارم، هنوز آزمایش نکردم" },
      { value: "validation" as const, label: "Validation", sub: "با چند نفر صحبت کردم" },
      { value: "pre-mvp" as const, label: "Pre-MVP", sub: "می‌سازم یا آماده ساختنم" },
    ],
    name: "نام و نام خانوادگی",
    namePlaceholder: "مثلاً: علی احمدی",
    email: "ایمیل",
    phone: "شماره تماس",
    telegram: "آیدی یا شماره تلگرام",
    social: "آدرس شبکه اجتماعی یا وب‌سایت",
    socialHint: "لینکدین، اینستاگرام، سایت استارتاپ — هرکدام که بهتر معرفی‌تان می‌کند.",
    stage: "الان در چه مرحله‌ای هستید؟",
    problem: "مسئله یا ایده‌ای که روی آن کار می‌کنید چیست؟",
    problemHint: "لازم نیست کامل باشد — فقط صادقانه توضیح دهید.",
    problemPlaceholder: "مثلاً: می‌خواهم برای فریلنسرهای ایرانی ابزاری بسازم که بتوانند فاکتور ارزی صادر کنند. هنوز نمی‌دانم چقدر حاضرند پول بدهند.",
    why: "چرا الان و چرا این برنامه؟",
    whyHint: "انتظار شما از ۸ هفته کار مشترک چیست؟",
    whyPlaceholder: "مثلاً: می‌خواهم بفهمم آیا این ایده واقعاً مشتری دارد یا فقط خودم به آن علاقه دارم.",
    deck: "پیچ‌دک یا هر سندی که دارید",
    deckHint: "اختیاری — PDF، PowerPoint یا Word، تا ۲۰ مگابایت. نداشتنش امتیاز منفی نیست.",
    deckChoose: "انتخاب فایل",
    deckUploading: "در حال آپلود…",
    deckRemove: "حذف فایل",
    deckFailed: "آپلود ناموفق بود.",
    deckError: "خطا در آپلود فایل.",
    submit: "ثبت درخواست",
    sending: "در حال ارسال…",
    charCount: (n: number) => `${n.toLocaleString("fa-IR", { useGrouping: false })} کاراکتر`,
    errors: {
      name: "نام خود را وارد کنید",
      email: "ایمیل معتبر وارد کنید",
      phone: "شماره تماس را وارد کنید",
      telegram: "آیدی یا شماره تلگرام را وارد کنید",
      stage: "مرحله‌ای را انتخاب کنید",
      problem: "حداقل ۳۰ کاراکتر توضیح دهید",
      why: "حداقل ۲۰ کاراکتر توضیح دهید",
    },
    submitError: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
    doneTitle: "رسید. ممنون که وقت گذاشتید.",
    doneBody: "درخواست‌تان مستقیم برای خودم آمد. کوهورت اول (آستانه) پر شده، پس الان در صف دوره‌ی بعدی هستید — وقتی باز شود، اول از همه با شما تماس می‌گیرم.",
    doneSign: "فرجاد · Founder Development Lab",
  },
} as const;

// v3 "Light": dark raised fields on the ink ground, one light accent for
// focus, selection and errors. No second colour — an error is marked by the
// light border, an icon and its message, never by colour alone.
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink";

const fieldClass = (hasError: boolean) =>
  `block min-h-12 w-full rounded-xl border bg-v3-raise px-4 py-3 text-base text-v3-bone placeholder:text-v3-mute/70 caret-v3-light outline-none transition-colors duration-200
   focus:border-v3-light focus:ring-2 focus:ring-v3-light/40
   ${hasError ? "border-v3-light/80" : "border-v3-line hover:border-v3-mute/60"}`;

const LABEL = "block text-sm font-medium text-v3-bone";
const HINT = "text-sm leading-relaxed text-v3-mute rtl:leading-loose";
const REQ = <span className="text-v3-light">*</span>;

function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 text-sm text-v3-light">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function ApplicationForm({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const SubmitIcon = locale === "fa" ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", telegram: "", social: "", stage: "", problem: "", why: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState("");

  const [deck, setDeck] = useState<{ url: string; name: string } | null>(null);
  const [deckUploading, setDeckUploading] = useState(false);
  const [deckError, setDeckError] = useState("");

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = t.errors.name;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t.errors.email;
    if (!form.phone.trim()) e.phone = t.errors.phone;
    if (!form.telegram.trim()) e.telegram = t.errors.telegram;
    if (!form.stage) e.stage = t.errors.stage;
    if (!form.problem.trim() || form.problem.length < PROBLEM_MIN) e.problem = t.errors.problem;
    if (!form.why.trim() || form.why.length < WHY_MIN) e.why = t.errors.why;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const uploadDeck = async (file: File) => {
    setDeckError("");
    setDeckUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/lab-apply/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setDeckError(data.error || t.deckFailed);
        return;
      }
      setDeck({ url: data.url, name: data.name });
    } catch {
      setDeckError(t.deckError);
    } finally {
      setDeckUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/lab-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, deckUrl: deck?.url ?? "", deckName: deck?.name ?? "" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
    } catch {
      setStatus("idle");
      setSubmitError(t.submitError);
    }
  };

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-6 rounded-2xl border border-v3-light/50 bg-v3-raise p-10 text-center shadow-[0_0_60px_-30px_rgba(232,196,138,0.5)] md:p-14"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-v3-light/60">
          <Check className="h-8 w-8 text-v3-light" aria-hidden />
        </div>
        <h3 className="font-v3-display text-3xl font-light text-v3-bone rtl:leading-snug">{t.doneTitle}</h3>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.doneBody}</p>
        <p className="text-sm text-v3-mute">{t.doneSign}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="lab-name" className={LABEL}>
            {t.name} {REQ}
          </label>
          <input
            id="lab-name" type="text" placeholder={t.namePlaceholder} autoComplete="name"
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "lab-name-error" : undefined}
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={fieldClass(!!errors.name)}
          />
          {errors.name && <FieldError id="lab-name-error">{errors.name}</FieldError>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lab-email" className={LABEL}>
            {t.email} {REQ}
          </label>
          <input
            id="lab-email" type="email" placeholder="you@example.com" dir="ltr" autoComplete="email"
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "lab-email-error" : undefined}
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={fieldClass(!!errors.email)}
          />
          {errors.email && <FieldError id="lab-email-error">{errors.email}</FieldError>}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="lab-phone" className={LABEL}>
            {t.phone} {REQ}
          </label>
          <input
            id="lab-phone" type="tel" placeholder="+98 912 000 0000" dir="ltr" autoComplete="tel"
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "lab-phone-error" : undefined}
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={fieldClass(!!errors.phone)}
          />
          {errors.phone && <FieldError id="lab-phone-error">{errors.phone}</FieldError>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lab-telegram" className={LABEL}>
            {t.telegram} {REQ}
          </label>
          <input
            id="lab-telegram" type="text" placeholder="@username" dir="ltr"
            aria-invalid={!!errors.telegram} aria-describedby={errors.telegram ? "lab-telegram-error" : undefined}
            value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })}
            className={fieldClass(!!errors.telegram)}
          />
          {errors.telegram && <FieldError id="lab-telegram-error">{errors.telegram}</FieldError>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="lab-social" className={LABEL}>{t.social}</label>
        <p id="lab-social-hint" className={HINT}>{t.socialHint}</p>
        <input
          id="lab-social" type="text" placeholder="https://linkedin.com/in/..." dir="ltr"
          aria-describedby="lab-social-hint"
          value={form.social} onChange={(e) => setForm({ ...form, social: e.target.value })}
          className={fieldClass(false)}
        />
      </div>

      <fieldset className="flex flex-col gap-3" aria-invalid={!!errors.stage} aria-describedby={errors.stage ? "lab-stage-error" : undefined}>
        <legend className={`${LABEL} mb-3`}>
          {t.stage} {REQ}
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {t.stages.map((s) => {
            const selected = form.stage === s.value;
            return (
              <button
                key={s.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setForm({ ...form, stage: s.value })}
                className={`flex min-h-16 flex-col gap-1 rounded-xl border p-4 text-start transition-all duration-300 hover:-translate-y-0.5 ${FOCUS}
                  ${selected
                    ? "border-v3-light bg-v3-light/10 shadow-[0_0_40px_-24px_rgba(232,196,138,0.7)]"
                    : errors.stage
                      ? "border-v3-light/60 bg-v3-raise hover:border-v3-light"
                      : "border-v3-line bg-v3-raise hover:border-v3-mute/60"}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span dir="ltr" className={`text-sm font-semibold ${selected ? "text-v3-light" : "text-v3-bone"}`}>
                    {s.label}
                  </span>
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full transition-colors ${selected ? "bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)]" : "bg-v3-line"}`}
                  />
                </span>
                <span className="text-sm leading-snug text-v3-mute">{s.sub}</span>
              </button>
            );
          })}
        </div>
        {errors.stage && <FieldError id="lab-stage-error">{errors.stage}</FieldError>}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="lab-problem" className={LABEL}>
          {t.problem} {REQ}
        </label>
        <p id="lab-problem-hint" className={HINT}>{t.problemHint}</p>
        <textarea
          id="lab-problem" rows={4} placeholder={t.problemPlaceholder}
          aria-invalid={!!errors.problem}
          aria-describedby={`lab-problem-hint${errors.problem ? " lab-problem-error" : ""}`}
          value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })}
          className={`${fieldClass(!!errors.problem)} resize-none leading-loose`}
        />
        <div className="flex justify-between gap-4">
          {errors.problem ? <FieldError id="lab-problem-error">{errors.problem}</FieldError> : <span />}
          <span className="ms-auto shrink-0 text-xs tabular-nums text-v3-mute" aria-live="polite">
            {t.charCount(form.problem.length)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="lab-why" className={LABEL}>
          {t.why} {REQ}
        </label>
        <p id="lab-why-hint" className={HINT}>{t.whyHint}</p>
        <textarea
          id="lab-why" rows={3} placeholder={t.whyPlaceholder}
          aria-invalid={!!errors.why}
          aria-describedby={`lab-why-hint${errors.why ? " lab-why-error" : ""}`}
          value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })}
          className={`${fieldClass(!!errors.why)} resize-none leading-loose`}
        />
        {errors.why && <FieldError id="lab-why-error">{errors.why}</FieldError>}
      </div>

      <div className="flex flex-col gap-2">
        <span className={LABEL}>{t.deck}</span>
        <p className={HINT}>{t.deckHint}</p>

        {deck ? (
          <div className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-v3-light/40 bg-v3-light/5 ps-4 pe-1">
            <span className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-v3-bone">
              <FileText className="h-4 w-4 shrink-0 text-v3-light" aria-hidden />
              <span className="truncate" dir="ltr">{deck.name}</span>
            </span>
            <button
              type="button"
              onClick={() => setDeck(null)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-v3-mute transition-colors hover:text-v3-light ${FOCUS}`}
              aria-label={t.deckRemove}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : (
          <label
            htmlFor="deck"
            className={`flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-dashed px-4 py-3.5 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-v3-light focus-within:ring-offset-2 focus-within:ring-offset-v3-ink
              ${deckUploading
                ? "cursor-wait border-v3-line text-v3-mute"
                : "cursor-pointer border-v3-mute/50 text-v3-bone hover:border-v3-light hover:bg-v3-light/5 hover:text-v3-light"}`}
          >
            {deckUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {t.deckUploading}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" aria-hidden />
                {t.deckChoose}
              </>
            )}
            <input
              id="deck"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              className="sr-only"
              disabled={deckUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadDeck(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
        {deckError && <FieldError>{deckError}</FieldError>}
      </div>

      {submitError && (
        <p role="alert" className="flex items-start gap-3 rounded-xl border border-v3-light/60 bg-v3-light/10 px-4 py-3 text-sm text-v3-bone">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-v3-light" aria-hidden />
          <span>{submitError}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || deckUploading}
        className={`group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-v3-bone py-4 text-base font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-v3-bone ${FOCUS}`}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            {t.sending}
          </>
        ) : (
          <>
            {t.submit}
            <SubmitIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
