"use client";

// Shared by /lab and /fa/lab. One component in two languages, posting to the
// same /api/lab-apply endpoint, so the two application forms cannot drift.

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Loader2, Upload, X } from "lucide-react";
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

const fieldClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200
   focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
   ${hasError ? "border-red-400 bg-red-50" : "border-stone-200"}`;

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
      <div role="status" className="bg-[#1B4B43] text-white rounded-2xl p-10 md:p-14 text-center space-y-6">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-black">{t.doneTitle}</h3>
        <p className="text-emerald-100/90 leading-loose max-w-md mx-auto">{t.doneBody}</p>
        <p className="text-emerald-100/60 text-sm">{t.doneSign}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="lab-name" className="block text-sm font-bold text-[#111827]">
            {t.name} <span className="text-red-500">*</span>
          </label>
          <input
            id="lab-name" type="text" placeholder={t.namePlaceholder} autoComplete="name"
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "lab-name-error" : undefined}
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={fieldClass(!!errors.name)}
          />
          {errors.name && <p id="lab-name-error" className="text-red-600 text-xs">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="lab-email" className="block text-sm font-bold text-[#111827]">
            {t.email} <span className="text-red-500">*</span>
          </label>
          <input
            id="lab-email" type="email" placeholder="you@example.com" dir="ltr" autoComplete="email"
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "lab-email-error" : undefined}
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={fieldClass(!!errors.email)}
          />
          {errors.email && <p id="lab-email-error" className="text-red-600 text-xs">{errors.email}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="lab-phone" className="block text-sm font-bold text-[#111827]">
            {t.phone} <span className="text-red-500">*</span>
          </label>
          <input
            id="lab-phone" type="tel" placeholder="+98 912 000 0000" dir="ltr" autoComplete="tel"
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "lab-phone-error" : undefined}
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={fieldClass(!!errors.phone)}
          />
          {errors.phone && <p id="lab-phone-error" className="text-red-600 text-xs">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="lab-telegram" className="block text-sm font-bold text-[#111827]">
            {t.telegram} <span className="text-red-500">*</span>
          </label>
          <input
            id="lab-telegram" type="text" placeholder="@username" dir="ltr"
            aria-invalid={!!errors.telegram} aria-describedby={errors.telegram ? "lab-telegram-error" : undefined}
            value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })}
            className={fieldClass(!!errors.telegram)}
          />
          {errors.telegram && <p id="lab-telegram-error" className="text-red-600 text-xs">{errors.telegram}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="lab-social" className="block text-sm font-bold text-[#111827]">{t.social}</label>
        <p id="lab-social-hint" className="text-xs text-stone-500">{t.socialHint}</p>
        <input
          id="lab-social" type="text" placeholder="https://linkedin.com/in/..." dir="ltr"
          aria-describedby="lab-social-hint"
          value={form.social} onChange={(e) => setForm({ ...form, social: e.target.value })}
          className={fieldClass(false)}
        />
      </div>

      <fieldset className="space-y-3" aria-invalid={!!errors.stage} aria-describedby={errors.stage ? "lab-stage-error" : undefined}>
        <legend className="text-sm font-bold text-[#111827]">
          {t.stage} <span className="text-red-500">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {t.stages.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={form.stage === s.value}
              onClick={() => setForm({ ...form, stage: s.value })}
              className={`p-4 rounded-2xl border-2 text-start transition-all duration-200 hover:border-[#1B4B43]/50
                ${form.stage === s.value ? "border-[#1B4B43] bg-[#1B4B43]/8" : "border-stone-200 bg-white"}`}
            >
              <p dir="ltr" className={`font-bold text-sm mb-1 text-start ${form.stage === s.value ? "text-[#1B4B43]" : "text-[#111827]"}`}>
                {s.label}
              </p>
              <p className="text-xs text-stone-500 leading-tight">{s.sub}</p>
            </button>
          ))}
        </div>
        {errors.stage && <p id="lab-stage-error" className="text-red-600 text-xs">{errors.stage}</p>}
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="lab-problem" className="block text-sm font-bold text-[#111827]">
          {t.problem} <span className="text-red-500">*</span>
        </label>
        <p id="lab-problem-hint" className="text-xs text-stone-500">{t.problemHint}</p>
        <textarea
          id="lab-problem" rows={4} placeholder={t.problemPlaceholder}
          aria-invalid={!!errors.problem}
          aria-describedby={`lab-problem-hint${errors.problem ? " lab-problem-error" : ""}`}
          value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })}
          className={`${fieldClass(!!errors.problem)} resize-none leading-loose`}
        />
        <div className="flex justify-between gap-4">
          {errors.problem ? <p id="lab-problem-error" className="text-red-600 text-xs">{errors.problem}</p> : <span />}
          <span className="ms-auto text-xs text-stone-500 tabular-nums" aria-live="polite">
            {t.charCount(form.problem.length)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="lab-why" className="block text-sm font-bold text-[#111827]">
          {t.why} <span className="text-red-500">*</span>
        </label>
        <p id="lab-why-hint" className="text-xs text-stone-500">{t.whyHint}</p>
        <textarea
          id="lab-why" rows={3} placeholder={t.whyPlaceholder}
          aria-invalid={!!errors.why}
          aria-describedby={`lab-why-hint${errors.why ? " lab-why-error" : ""}`}
          value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })}
          className={`${fieldClass(!!errors.why)} resize-none leading-loose`}
        />
        {errors.why && <p id="lab-why-error" className="text-red-600 text-xs">{errors.why}</p>}
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-bold text-[#111827]">{t.deck}</span>
        <p className="text-xs text-stone-500">{t.deckHint}</p>

        {deck ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-[#1B4B43]/30 bg-[#1B4B43]/5">
            <span className="flex items-center gap-2.5 min-w-0 text-sm text-[#1B4B43] font-medium">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate" dir="ltr">{deck.name}</span>
            </span>
            <button
              type="button"
              onClick={() => setDeck(null)}
              className="text-stone-400 hover:text-red-600 transition-colors shrink-0"
              aria-label={t.deckRemove}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="deck"
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 border-dashed text-sm font-bold transition-colors
              ${deckUploading
                ? "border-stone-200 text-stone-400 cursor-wait"
                : "border-stone-300 text-[#1B4B43] cursor-pointer hover:border-[#1B4B43] hover:bg-[#1B4B43]/5"}`}
          >
            {deckUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.deckUploading}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {t.deckChoose}
              </>
            )}
            <input
              id="deck"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              className="hidden"
              disabled={deckUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadDeck(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
        {deckError && <p className="text-red-600 text-xs">{deckError}</p>}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || deckUploading}
        className="w-full py-4 bg-[#1B4B43] text-white font-bold rounded-full text-base hover:bg-[#123730] transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t.sending}
          </>
        ) : (
          <>
            <SubmitIcon className="w-5 h-5" />
            {t.submit}
          </>
        )}
      </button>
    </form>
  );
}
