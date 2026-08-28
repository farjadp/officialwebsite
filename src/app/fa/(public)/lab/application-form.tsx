"use client";

import { useState } from "react";
import { ArrowLeft, Check, FileText, Loader2, Upload, X } from "lucide-react";

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

const STAGES: { value: Stage; label: string; sub: string }[] = [
  { value: "idea", label: "Idea", sub: "ایده دارم، هنوز آزمایش نکردم" },
  { value: "validation", label: "Validation", sub: "با چند نفر صحبت کردم" },
  { value: "pre-mvp", label: "Pre-MVP", sub: "می‌سازم یا آماده ساختنم" },
];

const fieldClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200
   focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
   ${hasError ? "border-red-400 bg-red-50" : "border-stone-200"}`;

export function ApplicationForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    social: "",
    stage: "",
    problem: "",
    why: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // pitch deck
  const [deck, setDeck] = useState<{ url: string; name: string } | null>(null);
  const [deckUploading, setDeckUploading] = useState(false);
  const [deckError, setDeckError] = useState("");

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = "نام خود را وارد کنید";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "ایمیل معتبر وارد کنید";
    if (!form.phone.trim()) e.phone = "شماره تماس را وارد کنید";
    if (!form.telegram.trim()) e.telegram = "آیدی یا شماره تلگرام را وارد کنید";
    if (!form.stage) e.stage = "مرحله‌ای را انتخاب کنید";
    if (!form.problem.trim() || form.problem.length < 30)
      e.problem = "حداقل ۳۰ کاراکتر توضیح دهید";
    if (!form.why.trim() || form.why.length < 20)
      e.why = "حداقل ۲۰ کاراکتر توضیح دهید";
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
        setDeckError(data.error || "آپلود ناموفق بود.");
        return;
      }
      setDeck({ url: data.url, name: data.name });
    } catch {
      setDeckError("خطا در آپلود فایل.");
    } finally {
      setDeckUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/lab-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          deckUrl: deck?.url ?? "",
          deckName: deck?.name ?? "",
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("done");
    } catch {
      setStatus("idle");
      alert("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    }
  };

  if (status === "done") {
    return (
      <div className="bg-[#1B4B43] text-white rounded-2xl p-10 md:p-14 text-center space-y-6">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-black">رسید. ممنون که وقت گذاشتید.</h3>
        <p className="text-emerald-100/90 leading-loose max-w-md mx-auto">
          درخواست‌تان مستقیم برای خودم آمد. کوهورت اول (آستانه) پر شده، پس الان
          در صف دوره‌ی بعدی هستید — وقتی باز شود، اول از همه با شما تماس
          می‌گیرم.
        </p>
        <p className="text-emerald-100/60 text-sm">فرجاد · Founder Development Lab</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* نام + ایمیل */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#111827]">
            نام و نام خانوادگی <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="مثلاً: علی احمدی"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={fieldClass(!!errors.name)}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#111827]">
            ایمیل <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={fieldClass(!!errors.email)}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>
      </div>

      {/* تلفن + تلگرام */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#111827]">
            شماره تماس <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="+98 912 000 0000"
            dir="ltr"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={fieldClass(!!errors.phone)}
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#111827]">
            آیدی یا شماره تلگرام <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="@username"
            dir="ltr"
            value={form.telegram}
            onChange={(e) => setForm({ ...form, telegram: e.target.value })}
            className={fieldClass(!!errors.telegram)}
          />
          {errors.telegram && <p className="text-red-500 text-xs">{errors.telegram}</p>}
        </div>
      </div>

      {/* سوشیال */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">
          آدرس شبکه اجتماعی یا وب‌سایت
        </label>
        <p className="text-xs text-stone-400">
          لینکدین، اینستاگرام، سایت استارتاپ — هرکدام که بهتر معرفی‌تان می‌کند.
        </p>
        <input
          type="text"
          placeholder="https://linkedin.com/in/..."
          dir="ltr"
          value={form.social}
          onChange={(e) => setForm({ ...form, social: e.target.value })}
          className={fieldClass(false)}
        />
      </div>

      {/* مرحله */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-[#111827]">
          الان در چه مرحله‌ای هستید؟ <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setForm({ ...form, stage: s.value })}
              className={`p-4 rounded-2xl border-2 text-right transition-all duration-200 hover:border-[#1B4B43]/50
                ${
                  form.stage === s.value
                    ? "border-[#1B4B43] bg-[#1B4B43]/8"
                    : "border-stone-200 bg-white"
                }`}
            >
              <p
                dir="ltr"
                className={`font-bold text-sm mb-1 text-right ${form.stage === s.value ? "text-[#1B4B43]" : "text-[#111827]"}`}
              >
                {s.label}
              </p>
              <p className="text-xs text-stone-500 leading-tight">{s.sub}</p>
            </button>
          ))}
        </div>
        {errors.stage && <p className="text-red-500 text-xs">{errors.stage}</p>}
      </div>

      {/* مسئله */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">
          مسئله یا ایده‌ای که روی آن کار می‌کنید چیست؟{" "}
          <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-stone-400">
          لازم نیست کامل باشد — فقط صادقانه توضیح دهید.
        </p>
        <textarea
          rows={4}
          placeholder="مثلاً: می‌خواهم برای فریلنسرهای ایرانی ابزاری بسازم که بتوانند فاکتور ارزی صادر کنند. هنوز نمی‌دانم چقدر حاضرند پول بدهند."
          value={form.problem}
          onChange={(e) => setForm({ ...form, problem: e.target.value })}
          className={`${fieldClass(!!errors.problem)} resize-none leading-loose`}
        />
        <div className="flex justify-between">
          {errors.problem ? (
            <p className="text-red-500 text-xs">{errors.problem}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-stone-400 tabular-nums">
            {form.problem.length} کاراکتر
          </span>
        </div>
      </div>

      {/* چرا */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">
          چرا الان و چرا این برنامه؟ <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-stone-400">انتظار شما از ۸ هفته کار مشترک چیست؟</p>
        <textarea
          rows={3}
          placeholder="مثلاً: می‌خواهم بفهمم آیا این ایده واقعاً مشتری دارد یا فقط خودم به آن علاقه دارم."
          value={form.why}
          onChange={(e) => setForm({ ...form, why: e.target.value })}
          className={`${fieldClass(!!errors.why)} resize-none leading-loose`}
        />
        {errors.why && <p className="text-red-500 text-xs">{errors.why}</p>}
      </div>

      {/* پیچ‌دک */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">پیچ‌دک یا هر سندی که دارید</label>
        <p className="text-xs text-stone-400">
          اختیاری — PDF، PowerPoint یا Word، تا ۲۰ مگابایت. نداشتنش امتیاز منفی نیست.
        </p>

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
              aria-label="حذف فایل"
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
                در حال آپلود…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                انتخاب فایل
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
        {deckError && <p className="text-red-500 text-xs">{deckError}</p>}
      </div>

      {/* ارسال */}
      <button
        type="submit"
        disabled={status === "loading" || deckUploading}
        className="w-full py-4 bg-[#1B4B43] text-white font-bold rounded-full text-base hover:bg-[#123730] transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            در حال ارسال...
          </>
        ) : (
          <>
            <ArrowLeft className="w-5 h-5" />
            ثبت درخواست
          </>
        )}
      </button>
    </form>
  );
}
