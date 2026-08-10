"use client";

import { useState } from "react";
import { ArrowLeft, Check, Loader2, Send } from "lucide-react";

type Stage = "idea" | "validation" | "pre-mvp" | "";

interface FormData {
  name: string;
  email: string;
  stage: Stage;
  problem: string;
  why: string;
}

const STAGES: { value: Stage; label: string; sub: string }[] = [
  { value: "idea", label: "Idea", sub: "ایده دارم، هنوز آزمایش نکردم" },
  { value: "validation", label: "Validation", sub: "با چند نفر صحبت کردم" },
  { value: "pre-mvp", label: "Pre-MVP", sub: "می‌سازم یا آماده ساختنم" },
];

export function ApplicationForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    stage: "",
    problem: "",
    why: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "نام خود را وارد کنید";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "ایمیل معتبر وارد کنید";
    if (!form.stage) e.stage = "مرحله‌ای را انتخاب کنید" as Stage;
    if (!form.problem.trim() || form.problem.length < 30)
      e.problem = "حداقل ۳۰ کاراکتر توضیح دهید";
    if (!form.why.trim() || form.why.length < 20)
      e.why = "حداقل ۲۰ کاراکتر توضیح دهید";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/lab-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <div className="bg-[#1B4B43] text-white rounded-3xl p-10 md:p-14 text-center space-y-6">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-black">درخواست شما ثبت شد!</h3>
        <p className="text-white/80 leading-loose max-w-md mx-auto">
          ممنون که وقت گذاشتید. طی ۴۸ ساعت آینده با شما تماس می‌گیریم تا زمان یک گفت‌وگوی ۳۰ دقیقه‌ای را هماهنگ کنیم.
        </p>
        <p className="text-white/50 text-sm font-mono">COHORT &apos;26 · Founder Development Lab</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Row 1: Name + Email */}
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
            className={`w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200
              focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
              ${errors.name ? "border-red-400 bg-red-50" : "border-stone-200"}`}
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
            className={`w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200
              focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
              ${errors.email ? "border-red-400 bg-red-50" : "border-stone-200"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Row 2: Stage selector */}
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
                    ? "border-[#1B4B43] bg-[#1B4B43]/8 shadow-sm"
                    : "border-stone-200 bg-white"
                }`}
            >
              <p
                className={`font-bold text-sm mb-1 ${form.stage === s.value ? "text-[#1B4B43]" : "text-[#111827]"}`}
              >
                {s.label}
              </p>
              <p className="text-xs text-stone-500 leading-tight">{s.sub}</p>
            </button>
          ))}
        </div>
        {errors.stage && (
          <p className="text-red-500 text-xs">{errors.stage}</p>
        )}
      </div>

      {/* Row 3: Problem */}
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
          className={`w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200 resize-none leading-loose
            focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
            ${errors.problem ? "border-red-400 bg-red-50" : "border-stone-200"}`}
        />
        <div className="flex justify-between">
          {errors.problem ? (
            <p className="text-red-500 text-xs">{errors.problem}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-stone-400">{form.problem.length} کاراکتر</span>
        </div>
      </div>

      {/* Row 4: Why */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">
          چرا الان و چرا این برنامه؟ <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-stone-400">
          انتظار شما از ۸ هفته کار مشترک چیست؟
        </p>
        <textarea
          rows={3}
          placeholder="مثلاً: می‌خواهم بفهمم آیا این ایده واقعاً مشتری دارد یا فقط خودم به آن علاقه دارم."
          value={form.why}
          onChange={(e) => setForm({ ...form, why: e.target.value })}
          className={`w-full px-4 py-3 rounded-2xl border bg-white text-[#1C1917] placeholder-stone-400 outline-none transition-all duration-200 resize-none leading-loose
            focus:ring-2 focus:ring-[#1B4B43]/30 focus:border-[#1B4B43]
            ${errors.why ? "border-red-400 bg-red-50" : "border-stone-200"}`}
        />
        {errors.why && <p className="text-red-500 text-xs">{errors.why}</p>}
      </div>

      {/* Notice */}
      <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm text-stone-500 leading-relaxed">
        📌 بعد از ثبت درخواست، طی ۴۸ ساعت با شما تماس می‌گیریم تا یک گفت‌وگوی ۳۰ دقیقه‌ای هماهنگ کنیم. این فرم Application نهایی نیست.
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-[#111827] text-white font-bold rounded-full text-base hover:bg-[#1B4B43] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
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
