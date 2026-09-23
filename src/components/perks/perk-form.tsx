"use client";

// Shared by /lab/perks and /fa/lab/perks. One component rather than two
// translations of the same 400 lines, so the two versions cannot drift.
// Validation runs the same zod schema the API runs (src/lib/perk-offer.ts),
// built for whichever locale is rendering.

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import {
  COUNTRIES,
  DESCRIPTION_MAX,
  HONEYPOT_FIELD,
  MARKETS,
  PERK_TYPES,
  fieldErrors,
  perkOfferSchema,
  type Locale,
  type PerkOfferErrors,
} from "@/lib/perk-offer";

type FormState = {
  companyName: string;
  website: string;
  contactName: string;
  email: string;
  telegram: string;
  country: string;
  perkType: string;
  description: string;
  valueEstimate: string;
  markets: string[];
  validity: string;
  consent: boolean;
};

const EMPTY: FormState = {
  companyName: "", website: "", contactName: "", email: "", telegram: "",
  country: "", perkType: "", description: "", valueEstimate: "",
  markets: [], validity: "", consent: false,
};

/** Field order on screen; the first invalid one gets focus. */
const ORDER: (keyof FormState)[] = [
  "companyName", "website", "contactName", "email", "telegram", "country",
  "perkType", "description", "valueEstimate", "markets", "validity", "consent",
];

const COPY = {
  en: {
    requiredNote: "Fields marked with a star are required.",
    honeypot: "Leave this field empty",
    companyName: "Company name",
    website: "Website",
    contactName: "Contact person",
    email: "Email",
    telegram: "Telegram handle",
    country: "Where the company is registered",
    choose: "Choose one",
    perkType: "Perk type",
    description: "What is the perk?",
    descriptionHint: "What exactly do the teams get, and on what condition?",
    descriptionPlaceholder: "For example: $500 of server credit per team, for three months, for new projects only.",
    valueEstimate: "Estimated value",
    valuePlaceholder: "For example: $200 per team",
    validity: "Valid for",
    validityPlaceholder: "For example: until the end of 2026",
    markets: "Where can the perk be used?",
    marketsHint: "Choose as many as apply.",
    consent: "I agree to be contacted about this offer.",
    required: "(required)",
    charCount: (n: number, max: number) => `${n} of ${max} characters`,
    submit: "Send offer",
    sending: "Sending…",
    genericError: "That did not send. Please try again.",
    offlineError: "Could not reach the server. Check your connection and try again.",
    doneTitle: "Got it. Thank you.",
    doneBody: "Your offer came straight to me. I will get in touch at the email address you gave to work out the details.",
    doneSign: "Farjad · Astaneh",
  },
  fa: {
    requiredNote: "فیلدهای ستاره‌دار الزامی است.",
    honeypot: "این فیلد را خالی بگذارید",
    companyName: "نام شرکت",
    website: "وب‌سایت",
    contactName: "نام رابط",
    email: "ایمیل",
    telegram: "آیدی تلگرام",
    country: "کشور محل ثبت شرکت",
    choose: "انتخاب کنید",
    perkType: "نوع Perk",
    description: "توضیح Perk",
    descriptionHint: "دقیقاً چه چیزی به تیم‌ها می‌دهید و چه شرطی دارد؟",
    descriptionPlaceholder: "مثلاً: ۵۰۰ دلار اعتبار سرور برای هر تیم، سه ماه، فقط برای پروژه‌های تازه.",
    valueEstimate: "ارزش تقریبی",
    valuePlaceholder: "مثلاً: ۲۰۰ دلار برای هر تیم",
    validity: "مدت اعتبار",
    validityPlaceholder: "مثلاً: تا پایان ۱۴۰۵",
    markets: "Perk در کدام بازارها قابل استفاده است؟",
    marketsHint: "هر تعداد که لازم است انتخاب کنید.",
    consent: "موافقم که درباره‌ی همین پیشنهاد با من تماس گرفته شود.",
    required: "(الزامی)",
    charCount: (n: number, max: number) =>
      `${n.toLocaleString("fa-IR", { useGrouping: false })} از ${max.toLocaleString("fa-IR", { useGrouping: false })} کاراکتر`,
    submit: "ثبت پیشنهاد",
    sending: "در حال ارسال…",
    genericError: "ارسال انجام نشد. لطفاً دوباره امتحان کنید.",
    offlineError: "اتصال برقرار نشد. اینترنت را بررسی کنید و دوباره امتحان کنید.",
    doneTitle: "پیشنهادتان رسید. ممنونم.",
    doneBody: "فرم مستقیم به دست خودم رسید. برای نهایی کردن جزئیات، با همان ایمیلی که نوشتید با شما تماس می‌گیرم.",
    doneSign: "فرجاد · آستانه",
  },
} as const;

const fieldClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200
   focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
   ${hasError ? "border-red-400 bg-red-50" : "border-stone-200"}`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="text-red-600 text-xs">{message}</p>;
}

export function PerkForm({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const schema = useMemo(() => perkOfferSchema(locale), [locale]);
  const SubmitIcon = locale === "fa" ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<PerkOfferErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // The success card is much shorter than the form, so without this the visitor
  // is left looking at the footer and never sees the confirmation.
  useEffect(() => {
    if (status !== "done") return;
    doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleMarket = (value: string) =>
    set("markets", form.markets.includes(value) ? form.markets.filter((m) => m !== value) : [...form.markets, value]);

  const showErrors = (errs: PerkOfferErrors) => {
    setErrors(errs);
    requestAnimationFrame(() => {
      const first = ORDER.find((k) => errs[k]);
      if (!first) return;
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error));
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/perk-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale, [HONEYPOT_FIELD]: trap }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("done");
        return;
      }

      setStatus("idle");
      if (res.status === 422 && data.fields) {
        showErrors(data.fields);
        setFormError(data.error ?? t.genericError);
      } else {
        setFormError(data.error ?? t.genericError);
      }
    } catch {
      setStatus("idle");
      setFormError(t.offlineError);
    }
  };

  const Label = ({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-[#111827]">
      {children}
      {required && <span className="text-red-500" aria-hidden="true"> *</span>}
      {required && <span className="sr-only"> {t.required}</span>}
    </label>
  );

  if (status === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="outline-none bg-[#1B4B43] text-white rounded-2xl p-10 md:p-14 text-center space-y-6">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-black">{t.doneTitle}</h3>
        <p className="text-emerald-100/90 leading-loose max-w-md mx-auto">{t.doneBody}</p>
        <p className="text-emerald-100/60 text-sm">{t.doneSign}</p>
      </div>
    );
  }

  const describedBy = (key: keyof FormState, hint?: boolean) =>
    [hint ? `${key}-hint` : "", errors[key] ? `${key}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6" aria-describedby="form-note">
      <p id="form-note" className="text-xs text-stone-500">{t.requiredNote}</p>

      {/* Honeypot: hidden from people and screen readers; bots fill it. */}
      <div aria-hidden="true" className="absolute -start-[9999px] w-px h-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>{t.honeypot}</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" required>{t.companyName}</Label>
          <input
            id="companyName" data-field="companyName" type="text" autoComplete="organization" required
            aria-invalid={!!errors.companyName} aria-describedby={describedBy("companyName")}
            value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
            className={fieldClass(!!errors.companyName)}
          />
          <FieldError id="companyName-error" message={errors.companyName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" required>{t.website}</Label>
          <input
            id="website" data-field="website" type="url" inputMode="url" autoComplete="url" dir="ltr"
            placeholder="https://example.com" required
            aria-invalid={!!errors.website} aria-describedby={describedBy("website")}
            value={form.website} onChange={(e) => set("website", e.target.value)}
            className={fieldClass(!!errors.website)}
          />
          <FieldError id="website-error" message={errors.website} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName" required>{t.contactName}</Label>
          <input
            id="contactName" data-field="contactName" type="text" autoComplete="name" required
            aria-invalid={!!errors.contactName} aria-describedby={describedBy("contactName")}
            value={form.contactName} onChange={(e) => set("contactName", e.target.value)}
            className={fieldClass(!!errors.contactName)}
          />
          <FieldError id="contactName-error" message={errors.contactName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" required>{t.email}</Label>
          <input
            id="email" data-field="email" type="email" inputMode="email" autoComplete="email" dir="ltr"
            placeholder="you@company.com" required
            aria-invalid={!!errors.email} aria-describedby={describedBy("email")}
            value={form.email} onChange={(e) => set("email", e.target.value)}
            className={fieldClass(!!errors.email)}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telegram">{t.telegram}</Label>
          <input
            id="telegram" data-field="telegram" type="text" dir="ltr" placeholder="@username"
            aria-invalid={!!errors.telegram} aria-describedby={describedBy("telegram")}
            value={form.telegram} onChange={(e) => set("telegram", e.target.value)}
            className={fieldClass(!!errors.telegram)}
          />
          <FieldError id="telegram-error" message={errors.telegram} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" required>{t.country}</Label>
          <select
            id="country" data-field="country" required
            aria-invalid={!!errors.country} aria-describedby={describedBy("country")}
            value={form.country} onChange={(e) => set("country", e.target.value)}
            className={fieldClass(!!errors.country)}
          >
            <option value="" disabled>{t.choose}</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c[locale]}</option>
            ))}
          </select>
          <FieldError id="country-error" message={errors.country} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="perkType" required>{t.perkType}</Label>
        <select
          id="perkType" data-field="perkType" required
          aria-invalid={!!errors.perkType} aria-describedby={describedBy("perkType")}
          value={form.perkType} onChange={(e) => set("perkType", e.target.value)}
          className={fieldClass(!!errors.perkType)}
        >
          <option value="" disabled>{t.choose}</option>
          {PERK_TYPES.map((p) => (
            <option key={p.value} value={p.value}>{p[locale]}</option>
          ))}
        </select>
        <FieldError id="perkType-error" message={errors.perkType} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" required>{t.description}</Label>
        <p id="description-hint" className="text-xs text-stone-500">{t.descriptionHint}</p>
        <textarea
          id="description" data-field="description" rows={5} maxLength={DESCRIPTION_MAX} required
          placeholder={t.descriptionPlaceholder}
          aria-invalid={!!errors.description} aria-describedby={describedBy("description", true)}
          value={form.description} onChange={(e) => set("description", e.target.value)}
          className={`${fieldClass(!!errors.description)} resize-none leading-loose`}
        />
        <div className="flex justify-between gap-4">
          <FieldError id="description-error" message={errors.description} />
          <span className="ms-auto text-xs text-stone-500 tabular-nums" aria-live="polite">
            {t.charCount(form.description.length, DESCRIPTION_MAX)}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valueEstimate">{t.valueEstimate}</Label>
          <input
            id="valueEstimate" data-field="valueEstimate" type="text" placeholder={t.valuePlaceholder}
            aria-invalid={!!errors.valueEstimate} aria-describedby={describedBy("valueEstimate")}
            value={form.valueEstimate} onChange={(e) => set("valueEstimate", e.target.value)}
            className={fieldClass(!!errors.valueEstimate)}
          />
          <FieldError id="valueEstimate-error" message={errors.valueEstimate} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="validity">{t.validity}</Label>
          <input
            id="validity" data-field="validity" type="text" placeholder={t.validityPlaceholder}
            aria-invalid={!!errors.validity} aria-describedby={describedBy("validity")}
            value={form.validity} onChange={(e) => set("validity", e.target.value)}
            className={fieldClass(!!errors.validity)}
          />
          <FieldError id="validity-error" message={errors.validity} />
        </div>
      </div>

      <fieldset className="space-y-3" aria-invalid={!!errors.markets} aria-describedby={describedBy("markets", true)}>
        <legend className="text-sm font-bold text-[#111827]">
          {t.markets}
          <span className="text-red-500" aria-hidden="true"> *</span>
          <span className="sr-only"> {t.required}</span>
        </legend>
        <p id="markets-hint" className="text-xs text-stone-500">{t.marketsHint}</p>
        <div className="flex flex-wrap gap-2.5">
          {MARKETS.map((m, i) => {
            const checked = form.markets.includes(m.value);
            return (
              <label
                key={m.value}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-bold cursor-pointer transition-colors duration-200
                  has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1B4B43]/40
                  ${checked ? "border-[#1B4B43] bg-[#1B4B43]/8 text-[#1B4B43]" : "border-stone-200 bg-white text-[#111827] hover:border-[#1B4B43]/50"}`}
              >
                <input
                  type="checkbox"
                  data-field={i === 0 ? "markets" : undefined}
                  className="w-4 h-4 accent-[#1B4B43]"
                  checked={checked}
                  onChange={() => toggleMarket(m.value)}
                />
                {m[locale]}
              </label>
            );
          })}
        </div>
        <FieldError id="markets-error" message={errors.markets} />
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer">
          <input
            id="consent" data-field="consent" type="checkbox" required
            aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")}
            checked={form.consent} onChange={(e) => set("consent", e.target.checked)}
            className="mt-1.5 w-4 h-4 shrink-0 accent-[#1B4B43]"
          />
          <span className="text-sm leading-[1.9] text-stone-700">
            {t.consent}
            <span className="text-red-500" aria-hidden="true"> *</span>
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />
      </div>

      {formError && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
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
