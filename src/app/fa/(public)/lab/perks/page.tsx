// ============================================================================
// Route: /fa/lab/perks
// Role: Call for perk partners for Astaneh, the Lab's 8-week cohort.
// Why:  Companies offer perks (credits, tools, advisory…) to the cohort's teams.
//       Offers land in the PerkOffer table via /api/perk-offer.
// Note: In the sitemap, deliberately NOT in the main nav yet.
// ============================================================================

import { canonicalOnly } from "@/lib/seo";
import type { Metadata } from "next";
import { ArrowDown, FileText, Mail, Send } from "lucide-react";
import { PerkForm } from "./perk-form";

const CONTACT_EMAIL = "its@farjadp.info";
const TELEGRAM_HANDLE = "FarjadTalks";

export const metadata: Metadata = {
  alternates: canonicalOnly("/fa/lab/perks"),
  title: "همکاری با آستانه برای ارائه‌دهندگان Perk | فرجاد پورمحمد",
  description:
    "به تیم‌های آستانه، برنامه‌ی ۸ هفته‌ای منتورشیپ استارتاپ‌های اولیه، Perk بدهید و در عوض کاربر واقعی و بازخورد صادقانه و ساختارمند بگیرید. بدون سهام و بدون هزینه.",
  openGraph: {
    title: "همکاری با آستانه، برای ارائه‌دهندگان Perk",
    description: "کاربر واقعی و بازخورد ساختارمند، در ازای Perk برای تیم‌های آستانه.",
    images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "آستانه" }],
  },
};

const ASKS = [
  ["اعتبار زیرساخت", "کلاد، سرور، دیتابیس یا هر سرویسی که تیم‌ها با آن محصول می‌سازند."],
  ["دسترسی رایگان به ابزار", "اشتراک نرم‌افزار برای طول دوره یا بیشتر."],
  ["جلسه‌ی مشاوره", "یک یا چند جلسه با متخصص شما: حقوقی، مالی، فنی یا فروش."],
  ["خدمات طراحی و مارکتینگ", "بررسی UX، طراحی برند، یا کمک در اولین آزمایش‌های جذب مشتری."],
  ["فضای کار اشتراکی", "میز یا اتاق جلسه برای روزهایی که تیم‌ها باید کنار هم باشند."],
];

const GETS = [
  [
    "کاربر واقعی با بازخورد صادقانه",
    "تیم‌های آستانه هر هفته فرض می‌سازند و با شاهد آزمایشش می‌کنند. همین عادت را روی محصول شما هم پیاده می‌کنند: بازخوردشان ساختارمند است و تعارف ندارد.",
  ],
  [
    "معرفی به‌عنوان شریک کوهورت اول آستانه",
    "نام و لوگوی شما کنار برنامه، به‌عنوان یکی از شرکت‌هایی که از روز اول پشت تیم‌ها بوده‌اند.",
  ],
];

const TERMS = [
  ["سهام", "هیچ. در ازای Perk هیچ سهمی از تیم‌ها یا از برنامه به شما نمی‌رسد."],
  ["تعهد خرید", "ندارد. تیم‌ها بعد از دوره هیچ تعهدی برای خرید محصول شما ندارند."],
  ["هزینه برای برگزارکننده", "هیچ. من بابت معرفی یا همکاری پولی نمی‌گیرم."],
  ["محل استفاده", "هر Perk فقط به تیمی معرفی می‌شود که قوانین کشور محل فعالیتش اجازه‌ی استفاده از آن را بدهد."],
];

export default function PerkPartnersPage() {
  const contacts = [
    { label: "فرم همین صفحه", value: "پنج دقیقه وقت می‌گیرد", href: "#offer", Icon: FileText, external: false, ltr: false },
    { label: "ایمیل", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail, external: false, ltr: true },
    { label: "تلگرام", value: `@${TELEGRAM_HANDLE}`, href: `https://t.me/${TELEGRAM_HANDLE}`, Icon: Send, external: true, ltr: true },
  ];

  return (
    <div
      dir="rtl"
      className="lab-page min-h-screen bg-[#FDFCF8] text-[#1C1917] selection:bg-[#1B4B43] selection:text-white"
    >
      <style>{`
        @keyframes lab-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .lab-rise { animation: lab-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) { .lab-rise { animation: none; } }
        .lab-page a, .lab-page button, .lab-page input, .lab-page textarea, .lab-page select { outline: none; }
        .lab-page a:focus-visible, .lab-page button:focus-visible { box-shadow: 0 0 0 2px #FDFCF8, 0 0 0 4px #1B4B43; border-radius: 4px; }
        .lab-page input, .lab-page textarea { caret-color: #1B4B43; }
      `}</style>

      {/* ─── هیرو ─────────────────────────────────────────────── */}
      <section className="px-6 pt-20 md:pt-28 pb-16">
        <div className="max-w-3xl mx-auto space-y-8 lab-rise">
          <p className="text-sm font-semibold text-[#1B4B43] tracking-wide">
            آستانه · کوهورت اول Founder Development Lab
          </p>

          <h1 className="text-[2.2rem] md:text-5xl font-black leading-[1.25] text-[#111827] text-balance">
            همکاری با آستانه — برای ارائه‌دهندگان Perk
          </h1>

          <div className="space-y-5 text-lg leading-[2.1] text-stone-700">
            <p>
              آستانه یک برنامه‌ی ۸ هفته‌ای منتورشیپ برای پنج تیم استارتاپی در
              مرحله‌ی ایده تا پیش از MVP است. قطب‌نمای برنامه یک مسیر ساده است:
            </p>
            <p
              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-2xl md:text-3xl font-black text-[#1B4B43]"
              aria-label="فرض، سپس شاهد، سپس تصمیم"
            >
              <span>فرض</span>
              <span aria-hidden="true" className="text-[#D97706]">←</span>
              <span>شاهد</span>
              <span aria-hidden="true" className="text-[#D97706]">←</span>
              <span>تصمیم</span>
            </p>
            <p>
              از شرکت‌ها و استارتاپ‌های ایرانی، داخل و خارج از ایران، دعوت می‌کنم
              چیزی به این تیم‌ها بدهند که ساختن را برایشان ارزان‌تر یا سریع‌تر کند.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-2">
            <a
              href="#offer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1B4B43] text-white font-bold rounded-full text-base transition-colors duration-300 hover:bg-[#123730]"
            >
              <Send className="w-4 h-4" />
              ثبت پیشنهاد
            </a>
            <a
              href="#terms"
              className="inline-flex items-center gap-2 font-bold text-[#111827] border-b-2 border-[#D97706] pb-0.5 hover:text-[#1B4B43] transition-colors"
            >
              شرایط همکاری
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── چه می‌خواهیم ─────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-stone-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
          <div className="md:sticky md:top-28 self-start space-y-4">
            <h2 className="text-3xl font-black text-[#111827] leading-snug">
              چه چیزی
              <br />
              به کار تیم‌ها می‌آید؟
            </h2>
            <p className="text-stone-600 leading-relaxed">
              چند نمونه. اگر چیز دیگری در ذهن دارید، همان را بنویسید.
            </p>
          </div>

          <ul className="max-w-2xl w-full">
            {ASKS.map(([t, d]) => (
              <li
                key={t}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 border-b border-stone-200/70"
              >
                <span className="font-bold text-lg text-[#111827]">{t}</span>
                <span className="text-stone-600 leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── چه می‌گیرید ──────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
          <h2 className="text-3xl font-black text-[#111827] leading-snug md:sticky md:top-28 self-start">
            در عوض،
            <br />
            چه می‌گیرید؟
          </h2>

          <div className="max-w-2xl w-full space-y-5">
            {GETS.map(([t, d]) => (
              <article
                key={t}
                className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_12px_-4px_rgba(28,25,23,0.08)] p-6 space-y-2"
              >
                <h3 className="font-black text-lg text-[#1B4B43]">{t}</h3>
                <p className="leading-[2] text-stone-700">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── شرایط ────────────────────────────────────────────── */}
      <section id="terms" className="px-6 py-20 scroll-mt-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
          <div className="md:sticky md:top-28 self-start space-y-4">
            <h2 className="text-3xl font-black text-[#111827] leading-snug">
              شرایط،
              <br />
              رک و راست.
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Perk هدیه است، نه معامله. این قاعده‌ها برای همه‌ی شریک‌ها یکسان است.
            </p>
          </div>

          <dl className="max-w-2xl w-full">
            {TERMS.map(([t, d]) => (
              <div
                key={t}
                className="grid grid-cols-[7.5rem_1fr] md:grid-cols-[11rem_1fr] gap-4 py-5 border-b border-stone-200/70 items-baseline"
              >
                <dt className="font-black text-[#1B4B43]">{t}</dt>
                <dd className="leading-[1.9] text-stone-700">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── راه‌های تماس ─────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-[#111827] mb-10">از هر راهی که راحت‌ترید.</h2>
          <ul className="grid sm:grid-cols-3 gap-4">
            {contacts.map(({ label, value, href, Icon, external, ltr }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-full flex-col gap-3 bg-white rounded-2xl border border-stone-200 p-6 transition-colors hover:border-[#1B4B43]/50"
                >
                  <span className="w-10 h-10 rounded-full bg-[#1B4B43]/10 text-[#1B4B43] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="font-black text-lg text-[#111827]">{label}</span>
                  <span dir={ltr ? "ltr" : undefined} className="self-start text-stone-600 break-all">
                    {value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── فرم ──────────────────────────────────────────────── */}
      <section id="offer" className="px-6 pt-20 pb-28 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#111827]">فرم پیشنهاد Perk</h2>
            <p className="text-lg text-stone-600 leading-[1.9] max-w-xl">
              هرچه دقیق‌تر بنویسید، سریع‌تر می‌توانم Perk را به تیم مناسب برسانم.
            </p>
          </div>

          <div className="relative bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-[0_2px_16px_-6px_rgba(28,25,23,0.1)]">
            <PerkForm />
          </div>
        </div>
      </section>
    </div>
  );
}
