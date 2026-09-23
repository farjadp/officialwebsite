"use client";

// Form for /fa/lab/perks. Validates with the same zod schema the API runs
// (src/lib/perk-offer.ts), so the two cannot disagree about what is valid.

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import {
  COUNTRIES,
  DESCRIPTION_MAX,
  HONEYPOT_FIELD,
  MARKETS,
  PERK_TYPES,
  fieldErrors,
  perkOfferSchema,
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
  companyName: "",
  website: "",
  contactName: "",
  email: "",
  telegram: "",
  country: "",
  perkType: "",
  description: "",
  valueEstimate: "",
  markets: [],
  validity: "",
  consent: false,
};

/** Field order on screen; the first invalid one gets focus. */
const ORDER: (keyof FormState)[] = [
  "companyName", "website", "contactName", "email", "telegram", "country",
  "perkType", "description", "valueEstimate", "markets", "validity", "consent",
];

const fieldClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200
   focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
   ${hasError ? "border-red-400 bg-red-50" : "border-stone-200"}`;

const toPersianDigits = (n: number) => n.toLocaleString("fa-IR", { useGrouping: false });

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-[#111827]">
      {children}
      {required && <span className="text-red-500" aria-hidden="true"> *</span>}
      {required && <span className="sr-only"> (الزامی)</span>}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-red-600 text-xs">
      {message}
    </p>
  );
}

export function PerkForm() {
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

  const focusFirstError = (errs: PerkOfferErrors) => {
    const first = ORDER.find((k) => errs[k]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
    el?.focus();
  };

  const showErrors = (errs: PerkOfferErrors) => {
    setErrors(errs);
    requestAnimationFrame(() => focusFirstError(errs));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const parsed = perkOfferSchema.safeParse(form);
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error));
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/perk-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, [HONEYPOT_FIELD]: trap }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("done");
        return;
      }

      setStatus("idle");
      if (res.status === 422 && data.fields) {
        showErrors(data.fields);
        setFormError(data.error ?? "چند فیلد نیاز به اصلاح دارد.");
      } else {
        setFormError(data.error ?? "ارسال انجام نشد. لطفاً دوباره امتحان کنید.");
      }
    } catch {
      setStatus("idle");
      setFormError("اتصال برقرار نشد. اینترنت را بررسی کنید و دوباره امتحان کنید.");
    }
  };

  if (status === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="outline-none bg-[#1B4B43] text-white rounded-2xl p-10 md:p-14 text-center space-y-6">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-black">پیشنهادتان رسید. ممنونم.</h3>
        <p className="text-emerald-100/90 leading-loose max-w-md mx-auto">
          فرم مستقیم به دست خودم رسید. برای نهایی کردن جزئیات، با همان ایمیلی که
          نوشتید با شما تماس می‌گیرم.
        </p>
        <p className="text-emerald-100/60 text-sm">فرجاد · آستانه</p>
      </div>
    );
  }

  const describedBy = (key: keyof FormState, hint?: boolean) =>
    [hint ? `${key}-hint` : "", errors[key] ? `${key}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6" aria-describedby="form-note">
      <p id="form-note" className="text-xs text-stone-500">
        فیلدهای ستاره‌دار الزامی است.
      </p>

      {/* Honeypot: hidden from people and screen readers; bots fill it. */}
      <div aria-hidden="true" className="absolute -start-[9999px] w-px h-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>این فیلد را خالی بگذارید</label>
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

      {/* شرکت + وب‌سایت */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" required>نام شرکت</Label>
          <input
            id="companyName"
            data-field="companyName"
            type="text"
            autoComplete="organization"
            required
            aria-invalid={!!errors.companyName}
            aria-describedby={describedBy("companyName")}
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            className={fieldClass(!!errors.companyName)}
          />
          <FieldError id="companyName-error" message={errors.companyName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" required>وب‌سایت</Label>
          <input
            id="website"
            data-field="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            dir="ltr"
            placeholder="https://example.com"
            required
            aria-invalid={!!errors.website}
            aria-describedby={describedBy("website")}
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className={fieldClass(!!errors.website)}
          />
          <FieldError id="website-error" message={errors.website} />
        </div>
      </div>

      {/* رابط + ایمیل */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName" required>نام رابط</Label>
          <input
            id="contactName"
            data-field="contactName"
            type="text"
            autoComplete="name"
            required
            aria-invalid={!!errors.contactName}
            aria-describedby={describedBy("contactName")}
            value={form.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            className={fieldClass(!!errors.contactName)}
          />
          <FieldError id="contactName-error" message={errors.contactName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" required>ایمیل</Label>
          <input
            id="email"
            data-field="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            placeholder="you@company.com"
            required
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={fieldClass(!!errors.email)}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      {/* تلگرام + کشور */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telegram">آیدی تلگرام</Label>
          <input
            id="telegram"
            data-field="telegram"
            type="text"
            dir="ltr"
            placeholder="@username"
            aria-invalid={!!errors.telegram}
            aria-describedby={describedBy("telegram")}
            value={form.telegram}
            onChange={(e) => set("telegram", e.target.value)}
            className={fieldClass(!!errors.telegram)}
          />
          <FieldError id="telegram-error" message={errors.telegram} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" required>کشور محل ثبت شرکت</Label>
          <select
            id="country"
            data-field="country"
            required
            aria-invalid={!!errors.country}
            aria-describedby={describedBy("country")}
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className={fieldClass(!!errors.country)}
          >
            <option value="" disabled>انتخاب کنید</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <FieldError id="country-error" message={errors.country} />
        </div>
      </div>

      {/* نوع Perk */}
      <div className="space-y-2">
        <Label htmlFor="perkType" required>نوع Perk</Label>
        <select
          id="perkType"
          data-field="perkType"
          required
          aria-invalid={!!errors.perkType}
          aria-describedby={describedBy("perkType")}
          value={form.perkType}
          onChange={(e) => set("perkType", e.target.value)}
          className={fieldClass(!!errors.perkType)}
        >
          <option value="" disabled>انتخاب کنید</option>
          {PERK_TYPES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <FieldError id="perkType-error" message={errors.perkType} />
      </div>

      {/* توضیح */}
      <div className="space-y-2">
        <Label htmlFor="description" required>توضیح Perk</Label>
        <p id="description-hint" className="text-xs text-stone-500">
          دقیقاً چه چیزی به تیم‌ها می‌دهید و چه شرطی دارد؟
        </p>
        <textarea
          id="description"
          data-field="description"
          rows={5}
          maxLength={DESCRIPTION_MAX}
          required
          placeholder="مثلاً: ۵۰۰ دلار اعتبار سرور برای هر تیم، سه ماه، فقط برای پروژه‌های تازه."
          aria-invalid={!!errors.description}
          aria-describedby={describedBy("description", true)}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={`${fieldClass(!!errors.description)} resize-none leading-loose`}
        />
        <div className="flex justify-between gap-4">
          <FieldError id="description-error" message={errors.description} />
          <span className="ms-auto text-xs text-stone-500 tabular-nums" aria-live="polite">
            {toPersianDigits(form.description.length)} از {toPersianDigits(DESCRIPTION_MAX)} کاراکتر
          </span>
        </div>
      </div>

      {/* ارزش + اعتبار */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valueEstimate">ارزش تقریبی</Label>
          <input
            id="valueEstimate"
            data-field="valueEstimate"
            type="text"
            placeholder="مثلاً: ۲۰۰ دلار برای هر تیم"
            aria-invalid={!!errors.valueEstimate}
            aria-describedby={describedBy("valueEstimate")}
            value={form.valueEstimate}
            onChange={(e) => set("valueEstimate", e.target.value)}
            className={fieldClass(!!errors.valueEstimate)}
          />
          <FieldError id="valueEstimate-error" message={errors.valueEstimate} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="validity">مدت اعتبار</Label>
          <input
            id="validity"
            data-field="validity"
            type="text"
            placeholder="مثلاً: تا پایان ۱۴۰۵"
            aria-invalid={!!errors.validity}
            aria-describedby={describedBy("validity")}
            value={form.validity}
            onChange={(e) => set("validity", e.target.value)}
            className={fieldClass(!!errors.validity)}
          />
          <FieldError id="validity-error" message={errors.validity} />
        </div>
      </div>

      {/* بازارها */}
      <fieldset
        className="space-y-3"
        aria-invalid={!!errors.markets}
        aria-describedby={describedBy("markets", true)}
      >
        <legend className="text-sm font-bold text-[#111827]">
          Perk در کدام بازارها قابل استفاده است؟
          <span className="text-red-500" aria-hidden="true"> *</span>
          <span className="sr-only"> (الزامی)</span>
        </legend>
        <p id="markets-hint" className="text-xs text-stone-500">هر تعداد که لازم است انتخاب کنید.</p>
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
                {m.label}
              </label>
            );
          })}
        </div>
        <FieldError id="markets-error" message={errors.markets} />
      </fieldset>

      {/* رضایت */}
      <div className="space-y-2">
        <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer">
          <input
            id="consent"
            data-field="consent"
            type="checkbox"
            required
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-1.5 w-4 h-4 shrink-0 accent-[#1B4B43]"
          />
          <span className="text-sm leading-[1.9] text-stone-700">
            موافقم که درباره‌ی همین پیشنهاد با من تماس گرفته شود.
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
            در حال ارسال…
          </>
        ) : (
          <>
            <ArrowLeft className="w-5 h-5" />
            ثبت پیشنهاد
          </>
        )}
      </button>
    </form>
  );
}
