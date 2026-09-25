"use client";

// Shared by /lab/perks and /fa/lab/perks. One component rather than two
// translations of the same 400 lines, so the two versions cannot drift.
// Validation runs the same zod schema the API runs (src/lib/perk-offer.ts),
// built for whichever locale is rendering.
// Look: v3 "Light" — dark fields, one light accent, visible focus. Only the
// styling changed; fields, validation, payload and messages are as they were.

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleAlert, Loader2 } from "lucide-react";
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
  `min-h-12 w-full rounded-xl border bg-v3-raise px-4 py-3 text-base text-v3-bone caret-v3-light placeholder:text-v3-mute/70
   outline-none transition-[border-color,box-shadow] duration-300 hover:border-v3-mute/60
   focus:border-v3-light focus:ring-2 focus:ring-v3-light/40
   ${hasError ? "border-v3-light/80" : "border-v3-line"}`;

/** Native select with the arrow redrawn, so it matches the text fields. */
const selectClass = (hasError: boolean) =>
  `${fieldClass(hasError)} cursor-pointer appearance-none pe-11 [color-scheme:dark]`;

const optionClass = "bg-v3-raise text-v3-bone";

const hintClass = "text-sm text-v3-mute";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-2 text-sm text-v3-light">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

/** Label with a visible star and a spoken "(required)". */
function Label({
  htmlFor,
  required,
  requiredText,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  requiredText: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-v3-bone">
      {children}
      {required && <span className="text-v3-light" aria-hidden="true"> *</span>}
      {required && <span className="sr-only"> {requiredText}</span>}
    </label>
  );
}

/** A square check drawn over a native checkbox, so keyboard and forms behave natively. */
function CheckMark() {
  return (
    <Check
      className="pointer-events-none col-start-1 row-start-1 h-3.5 w-3.5 text-v3-ink opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
      strokeWidth={3}
      aria-hidden="true"
    />
  );
}

const checkboxClass =
  "peer col-start-1 row-start-1 h-5 w-5 cursor-pointer appearance-none rounded-md border border-v3-mute/70 bg-v3-ink outline-none transition-colors duration-200 checked:border-v3-light checked:bg-v3-light";

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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    doneRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
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

  if (status === "done") {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center gap-6 rounded-2xl border border-v3-light/50 bg-v3-raise px-6 py-12 text-center outline-none md:px-14 md:py-16"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-v3-light/60 text-v3-light">
          <Check className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="font-v3-display text-3xl font-light text-v3-bone">{t.doneTitle}</h3>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.doneBody}</p>
        <p className="text-sm text-v3-mute">{t.doneSign}</p>
      </div>
    );
  }

  const describedBy = (key: keyof FormState, hint?: boolean) =>
    [hint ? `${key}-hint` : "", errors[key] ? `${key}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-7" aria-describedby="form-note">
      <p id="form-note" className={hintClass}>{t.requiredNote}</p>

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

      <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyName" required requiredText={t.required}>{t.companyName}</Label>
          <input
            id="companyName" data-field="companyName" type="text" autoComplete="organization" required
            aria-invalid={!!errors.companyName} aria-describedby={describedBy("companyName")}
            value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
            className={fieldClass(!!errors.companyName)}
          />
          <FieldError id="companyName-error" message={errors.companyName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" required requiredText={t.required}>{t.website}</Label>
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

      <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactName" required requiredText={t.required}>{t.contactName}</Label>
          <input
            id="contactName" data-field="contactName" type="text" autoComplete="name" required
            aria-invalid={!!errors.contactName} aria-describedby={describedBy("contactName")}
            value={form.contactName} onChange={(e) => set("contactName", e.target.value)}
            className={fieldClass(!!errors.contactName)}
          />
          <FieldError id="contactName-error" message={errors.contactName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" required requiredText={t.required}>{t.email}</Label>
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

      <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="telegram" requiredText={t.required}>{t.telegram}</Label>
          <input
            id="telegram" data-field="telegram" type="text" dir="ltr" placeholder="@username"
            aria-invalid={!!errors.telegram} aria-describedby={describedBy("telegram")}
            value={form.telegram} onChange={(e) => set("telegram", e.target.value)}
            className={fieldClass(!!errors.telegram)}
          />
          <FieldError id="telegram-error" message={errors.telegram} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" required requiredText={t.required}>{t.country}</Label>
          <div className="relative">
            <select
              id="country" data-field="country" required
              aria-invalid={!!errors.country} aria-describedby={describedBy("country")}
              value={form.country} onChange={(e) => set("country", e.target.value)}
              className={selectClass(!!errors.country)}
            >
              <option value="" disabled className={optionClass}>{t.choose}</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value} className={optionClass}>{c[locale]}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-v3-mute" aria-hidden="true" />
          </div>
          <FieldError id="country-error" message={errors.country} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="perkType" required requiredText={t.required}>{t.perkType}</Label>
        <div className="relative">
          <select
            id="perkType" data-field="perkType" required
            aria-invalid={!!errors.perkType} aria-describedby={describedBy("perkType")}
            value={form.perkType} onChange={(e) => set("perkType", e.target.value)}
            className={selectClass(!!errors.perkType)}
          >
            <option value="" disabled className={optionClass}>{t.choose}</option>
            {PERK_TYPES.map((p) => (
              <option key={p.value} value={p.value} className={optionClass}>{p[locale]}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-v3-mute" aria-hidden="true" />
        </div>
        <FieldError id="perkType-error" message={errors.perkType} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" required requiredText={t.required}>{t.description}</Label>
        <p id="description-hint" className={hintClass}>{t.descriptionHint}</p>
        <textarea
          id="description" data-field="description" rows={5} maxLength={DESCRIPTION_MAX} required
          placeholder={t.descriptionPlaceholder}
          aria-invalid={!!errors.description} aria-describedby={describedBy("description", true)}
          value={form.description} onChange={(e) => set("description", e.target.value)}
          className={`${fieldClass(!!errors.description)} resize-none leading-relaxed rtl:leading-loose`}
        />
        <div className="flex justify-between gap-4">
          <FieldError id="description-error" message={errors.description} />
          <span className="ms-auto shrink-0 text-sm tabular-nums text-v3-mute" aria-live="polite">
            {t.charCount(form.description.length, DESCRIPTION_MAX)}
          </span>
        </div>
      </div>

      <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="valueEstimate" requiredText={t.required}>{t.valueEstimate}</Label>
          <input
            id="valueEstimate" data-field="valueEstimate" type="text" placeholder={t.valuePlaceholder}
            aria-invalid={!!errors.valueEstimate} aria-describedby={describedBy("valueEstimate")}
            value={form.valueEstimate} onChange={(e) => set("valueEstimate", e.target.value)}
            className={fieldClass(!!errors.valueEstimate)}
          />
          <FieldError id="valueEstimate-error" message={errors.valueEstimate} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="validity" requiredText={t.required}>{t.validity}</Label>
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
        <legend className="text-sm font-medium text-v3-bone">
          {t.markets}
          <span className="text-v3-light" aria-hidden="true"> *</span>
          <span className="sr-only"> {t.required}</span>
        </legend>
        <p id="markets-hint" className={hintClass}>{t.marketsHint}</p>
        <div className="flex flex-wrap gap-2.5">
          {MARKETS.map((m, i) => {
            const checked = form.markets.includes(m.value);
            return (
              <label
                key={m.value}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300
                  hover:-translate-y-0.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-v3-light has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-v3-ink
                  ${checked
                    ? "border-v3-light/70 bg-v3-light/10 text-v3-light"
                    : `bg-v3-raise text-v3-bone hover:border-v3-mute/60 ${errors.markets ? "border-v3-light/80" : "border-v3-line"}`}`}
              >
                <span className="grid place-items-center">
                  <input
                    type="checkbox"
                    data-field={i === 0 ? "markets" : undefined}
                    className={checkboxClass}
                    checked={checked}
                    onChange={() => toggleMarket(m.value)}
                  />
                  <CheckMark />
                </span>
                {m[locale]}
              </label>
            );
          })}
        </div>
        <FieldError id="markets-error" message={errors.markets} />
      </fieldset>

      <div className="space-y-2">
        <label
          htmlFor="consent"
          className="-mx-2 flex min-h-11 cursor-pointer items-start gap-3 rounded-xl px-2 py-2.5 transition-colors duration-300 hover:bg-v3-raise has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-v3-light"
        >
          <span className="mt-0.5 grid shrink-0 place-items-center">
            <input
              id="consent" data-field="consent" type="checkbox" required
              aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")}
              checked={form.consent} onChange={(e) => set("consent", e.target.checked)}
              className={`${checkboxClass} ${errors.consent ? "border-v3-light" : ""}`}
            />
            <CheckMark />
          </span>
          <span className="text-base leading-relaxed text-v3-soft rtl:leading-loose">
            {t.consent}
            <span className="text-v3-light" aria-hidden="true"> *</span>
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />
      </div>

      {formError && (
        <p role="alert" className="flex items-start gap-3 rounded-xl border border-v3-light/60 bg-v3-light/10 px-4 py-3 text-sm text-v3-bone">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-v3-light" aria-hidden="true" />
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-v3-bone px-7 py-4 text-base font-semibold text-v3-ink outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-4 focus-visible:ring-offset-v3-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-v3-bone"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {t.sending}
          </>
        ) : (
          <>
            {t.submit}
            <SubmitIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
