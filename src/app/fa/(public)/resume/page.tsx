// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-09-21
// Why: Persian resume / CV page — viewable and downloadable as PDF. A
//      translation of the English resume; every entry, date and bullet is the
//      English page's, nothing added.
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates } from "@/lib/seo"
import type { Metadata } from "next";
import Link from "next/link";
import { DownloadResumeButton } from "@/app/(public)/resume/download-button";

export const metadata: Metadata = {
  alternates: localeAlternates("/resume", "fa"),
  title: "رزومه‌ی فرجاد پورمحمد | استراتژیست و سازنده‌ی سیستم",
  description:
    "رزومه‌ی کامل فرجاد پورمحمد: بنیان‌گذار، مدیر ارشد فنی، منتور استارتاپ، ممیز ارشد ISO 27001 و سازنده‌ی سیستم، با بیش از ۲۲ سال تجربه در ایران و کانادا.",
};

// ─── Resume Data ─────────────────────────────────────────────────────────────

const WORK_EXPERIENCE = [
  {
    company: "AshaVid",
    location: "تورنتو، انتاریو",
    period: "ژوئن ۲۰۲۵ تا اکنون",
    duration: "فعلی",
    role: "بنیان‌گذار و مدیر ارشد استراتژی",
    bullets: [
      "تعریف و پالایش چشم‌انداز علمی بلندمدت، هم‌راستا با استراتژی کلی شرکت و نیازهای در حال تغییر بازار.",
      "هدایت طراحی و اجرای نقشه‌ی راه تحقیق و توسعه، با اولویت‌بندی برنامه‌ها بر اساس اعتبار علمی و پتانسیل تجاری.",
      "ساختن، منتور کردن و نگه داشتن تیم‌های علمی پرکار در چند رشته و چند جغرافیا.",
      "ایجاد و مدیریت همکاری‌های استراتژیک با نهادهای دانشگاهی، شرکت‌های بیوتک و دارویی و شرکای فناوری.",
    ],
  },
  {
    company: "DPF (شرکت پردازش داده‌ی فرجاد)",
    location: "تهران",
    period: "مارس ۲۰۰۶ تا ژانویه‌ی ۲۰۲۳",
    duration: "۱۶ سال و ۱۱ ماه",
    role: "بنیان‌گذار و مدیر",
    bullets: [
      "بنیان‌گذاری نخستین شرکت تخصصی طراحی و برنامه‌نویسی وب‌سایت در ایران و ورود پیشگامانه به یک بازار دیجیتال تازه.",
      "ساختن رابطه‌های مبتنی بر اعتماد با مشتریان و تثبیت شرکت به‌عنوان شریک فناوری قابل‌اتکا و بلندمدت.",
      "جذب، منتور کردن و پرورش یک تیم فنی توانمند و شکل دادن فرهنگی مشارکتی و پربازده.",
      "هدایت رشد شرکت از راه برنامه‌ریزی استراتژیک، رهبری مؤثر و راهنمایی عملیاتی مستقیم.",
      "گذار به نقش عضو هیئت‌مدیره و مشارکت در حاکمیت و جهت‌گیری استراتژیک، پس از انتقال مالکیت به کارکنان پیشین.",
    ],
  },
  {
    company: "HoFin",
    location: "تورنتو، انتاریو",
    period: "ژانویه‌ی ۲۰۲۰ تا اکنون",
    duration: "۶ سال و ۲ ماه",
    role: "هم‌بنیان‌گذار",
    bullets: [
      "بنیان‌گذاری استارتاپی با تمرکز بر راه‌حل‌های پشتیبانی سلامت روان.",
      "هدایت طراحی و توسعه‌ی نسخه‌ی اولیه‌ی محصول، منتشرشده روی اپ‌استور.",
      "تعریف رویکرد ورود به بازار و آماده‌سازی برنامه‌های بازاریابی برای بازار کانادا.",
      "نظارت بر فعالیت‌های اصلی کسب‌وکار، از چشم‌انداز محصول و عملیات پایه تا جایگاه‌سازی اولیه‌ی برند.",
    ],
  },
  {
    company: "VisaRoads",
    location: "دورکاری",
    period: "ژانویه‌ی ۲۰۲۲ تا اکنون",
    duration: "۴ سال و ۲ ماه",
    role: "منتور",
    bullets: [
      "کمک به تیم‌های استارتاپی در شناسایی برنامه‌های شتاب‌دهی متناسب با مرحله، صنعت و هدف‌های استراتژیک‌شان.",
      "راهنمایی بنیان‌گذاران در تعریف و ساخت MVP بهینه، با تمرکز بر قابلیت‌های اصلی، نیاز کاربر و محدودیت منابع.",
      "کمک به تیم‌ها در سنجش تناسب محصول و بازار از راه بازخورد کاربران، آزمون تکرارشونده و تحلیل سیگنال‌های بازار.",
      "پشتیبانی از استارتاپ‌ها برای جذب مشتریان اول، با پالایش ارزش پیشنهادی، استراتژی جست‌وجوی مشتری و روایت فروش.",
      "تحلیل بازار برای روشن کردن فضای رقابتی، بخش‌های هدف و فرصت‌های جایگاه‌سازی.",
      "مشاوره درباره‌ی ساختار تیم، نقش‌ها و شیوه‌های همکاری برای بالا بردن کارایی عملیاتی و ظرفیت اجرا.",
      "همکاری با بنیان‌گذاران برای تدوین استراتژی ورود به بازار، از انتخاب کانال و رویکرد قیمت‌گذاری تا برنامه‌ریزی عرضه.",
    ],
  },
  {
    company: "NFTsShip",
    location: "تهران",
    period: "ژانویه‌ی ۲۰۲۲ تا فوریه‌ی ۲۰۲۶",
    duration: "۴ سال و ۲ ماه",
    role: "بنیان‌گذار",
    bullets: [
      "بنیان‌گذاری نخستین پلتفرم NFT ایران و نظارت بر چشم‌انداز محصول، استراتژی و کل عملیات.",
      "برگزاری و هدایت نخستین رویداد متمرکز بر NFT در ایران، برای آگاهی‌بخشی و آموزش درباره‌ی هنر دیجیتال و بلاک‌چین.",
      "جذب و همراه کردن هنرمندان شناخته‌شده با پلتفرم و تثبیت آن به‌عنوان فضایی معتبر برای خلق و مبادله‌ی NFT.",
      "عبور از شرایط پیچیده‌ی بازار، مقررات و جامعه، تا توقف فعالیت به دلیل مسائل داخلی تیم و خیزش سراسری.",
    ],
  },
  {
    company: "نخستین شرکت رایانش ابری ایران (با پشتوانه‌ی دولتی)",
    location: "تهران",
    period: "ژانویه‌ی ۲۰۱۷ تا ژانویه‌ی ۲۰۲۰",
    duration: "۳ سال و ۱ ماه",
    role: "مدیر ارشد فنی",
    bullets: [
      "ایفای نقش مدیر ارشد فنی و ساختن و هدایت تیم فنی از نقطه‌ی صفر.",
      "مدیریت زیرساخت شبکه و تضمین اتصال و عملیات پایدار.",
      "تسهیل همکاری میان تیم‌های تحقیق و توسعه، توسعه‌ی نرم‌افزار و شبکه برای هم‌راستایی روی راه‌حل‌های فنی.",
      "نظارت بر طراحی و معماری سیستم برای چند پلتفرم سازمانی.",
      "هماهنگی تحویل فنی سرتاسری پروژه و سرپرستی واگذاری آن به شرکت ابرآروان.",
    ],
  },
  {
    company: "رایان اندیشان فراز (RAF)",
    location: "تهران",
    period: "ژانویه‌ی ۲۰۱۰ تا دسامبر ۲۰۱۰",
    duration: "۱ سال",
    role: "مدیر واحد فناوری اطلاعات",
    bullets: [
      "مدیریت واحد فناوری اطلاعات و تضمین تداوم عملیات روزانه و ارائه‌ی خدمات.",
      "هدایت و هماهنگی تیم فناوری اطلاعات و سازمان‌دهی وظایف و مسئولیت‌ها در واحد.",
      "شناسایی و رفع مشکلات اولیه‌ی همکاری در تیم و اجرای اقدام‌هایی برای بهبود هم‌افزایی.",
      "تسهیل ارتباط درون تیم برای حل تعارض‌ها و هم‌راستا کردن اعضا روی هدف‌های مشترک.",
      "کار نزدیک با اعضای تیم برای پشتیبانی از کارشان، راهنمایی و حفظ محیطی پربازده.",
    ],
  },
  {
    company: "وزارت صنایع ایران",
    location: "تهران",
    period: "ژانویه‌ی ۲۰۰۸ تا دسامبر ۲۰۰۹",
    duration: "۲ سال",
    role: "همکاری با وزارت صنایع ایران",
    bullets: [
      "شناسایی مشکلات زمان‌بندی و نبود هماهنگی که به هدررفت انرژی در پروژه‌ها می‌انجامید.",
      "مدیریت پروژه‌ها با تمرکز بر بهبود زمان‌بندی، هماهنگی و کارایی منابع.",
      "به‌روز نگه داشتن دانش روش‌ها و بهترین شیوه‌های مدیریت پروژه برای بهبود نتایج.",
    ],
  },
  {
    company: "Fibo Group",
    location: "دورکاری",
    period: "ژانویه‌ی ۲۰۰۵ تا ژوئن ۲۰۰۵",
    duration: "۶ ماه",
    role: "پشتیبان وب‌سایت بخش فارسی",
    bullets: [
      "پشتیبانی از وب‌سایت بخش زبان فارسی شرکت انگلیسی Fibo Group.",
    ],
  },
];

const EDUCATION = [
  {
    degree: "دکتری انسان‌شناسی (ناتمام)",
    institution: "دانشگاه آزاد تهران مرکز",
    year: "۲۰۱۹",
    notes: [],
  },
  {
    degree: "DBA، دکتری مدیریت کسب‌وکار",
    institution: "آکادمی برند ایران",
    year: "۲۰۱۹",
    notes: [
      "دکتری مدیریت کسب‌وکار (DBA) با تمرکز بر مدیریت برند",
      "تخصص در برندسازی حسی برای تقویت ادراک برند و تعامل مشتری",
      "تجربه در تدوین و اجرای استراتژی‌های برندسازی",
    ],
  },
  {
    degree: "کارشناسی ارشد انسان‌شناسی",
    institution: "دانشگاه آزاد تهران مرکز",
    year: "۲۰۱۶",
    notes: [],
  },
  {
    degree: "کارشناسی ارشد مهندسی نرم‌افزار",
    institution: "دانشگاه آزاد، واحد رودهن",
    year: "۲۰۱۴",
    notes: [],
  },
  {
    degree: "کارشناسی انسان‌شناسی",
    institution: "دانشگاه آزاد، واحد تهران",
    year: "۲۰۱۴",
    notes: [],
  },
  {
    degree: "دیپلم ریاضی",
    institution: "تهران",
    year: "۲۰۰۸",
    notes: [],
  },
];

const CERTIFICATIONS_COURSES = [
  { title: "تحول دیجیتال", institution: "دانشگاه یورک", date: "مارس ۲۰۲۶" },
  { title: "مسترکلاس استعداد ونچر", institution: "شولیک", date: "دسامبر ۲۰۲۴ تا مارس ۲۰۲۵" },
  { title: "مبانی بازاریابی دیجیتال", institution: "Google", date: "فوریه تا نوامبر ۲۰۲۳" },
  { title: "مدل کسب‌وکار", institution: "MaRS", date: "اکتبر ۲۰۲۳" },
  { title: "استراتژی دیجیتال", institution: "LinkedIn", date: "ژانویه تا اکتبر ۲۰۲۲" },
  { title: "راهنمای مسیر شغلی مدیر ارشد فنی", institution: "LinkedIn", date: "ژانویه‌ی ۲۰۲۰" },
  { title: "متاورس و NFT برای بازاریابی", institution: "LinkedIn", date: "مارس تا ژوئیه‌ی ۲۰۱۹" },
  { title: "مبانی بلاک‌چین", institution: "LinkedIn", date: "فوریه‌ی ۲۰۱۹" },
  { title: "اسکرام: مبانی", institution: "LinkedIn", date: "ژانویه تا مه ۲۰۱۸" },
];

const ISO_CERT = {
  title: "سرممیز بین‌المللی سیستم مدیریت امنیت اطلاعات",
  institution: "International Standard Institute",
  year: "۲۰۱۸",
  bullets: [
    "دارنده‌ی گواهی‌نامه‌ی ISO 27001 Lead Implementer",
    "دارنده‌ی گواهی‌نامه‌ی ISO 27001 Lead Auditor",
    "مدیر ارشد امنیت اطلاعات (CISO) گواهی‌شده بر پایه‌ی ISO 27001",
    "تخصص در پیاده‌سازی و ممیزی سیستم‌های مدیریت امنیت اطلاعات (ISMS)",
    "توانایی اثبات‌شده در مدیریت ریسک‌های امنیت اطلاعات هم‌راستا با استاندارد بین‌المللی ISO 27001",
  ],
};

const SKILLS = [
  "حل مسئله",
  "تفکر انتقادی",
  "حل تعارض",
  "انطباق‌پذیری",
  "رهبری",
  "ارتباط مؤثر",
  "مدیریت برند",
  "رهبری فنی",
  "توسعه‌ی محصول",
  "توسعه‌ی وب",
  "مدیریت پروژه",
  "منتورشیپ استارتاپ",
  "تفکر استراتژیک",
  "معماری نرم‌افزار",
  "هوش مصنوعی و خودکارسازی",
  "تحول دیجیتال",
];

const LANGUAGES = [
  { name: "فارسی", level: "زبان مادری", percent: 100 },
  { name: "انگلیسی", level: "حرفه‌ای", percent: 75 },
];

const LINKS = [
  { label: "لینکدین", value: "farjadpourmohammad", href: "https://www.linkedin.com/in/farjadpourmohammad/" },
  { label: "وب‌سایت", value: "farjadp.info", href: "https://farjadp.info" },
  { label: "ایکس", value: "FarjadTalks", href: "https://twitter.com/FarjadTalks" },
  { label: "تلگرام", value: "FarjadTalks", href: "https://t.me/FarjadTalks" },
  { label: "گیت‌هاب", value: "Farjadp", href: "https://github.com/Farjadp" },
  { label: "یوتیوب", value: "Farjadtalks", href: "https://youtube.com/@Farjadtalks" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResumeFaPage() {
  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#1C1917]">

      {/* ── Sticky Action Bar ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#0F3F35]">فرجاد پورمحمد</span>
            <span className="text-stone-400 text-xs hidden sm:block">استراتژیست و سازنده‌ی سیستم</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/fa/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0F3F35] border border-[#0F3F35] rounded-full hover:bg-[#0F3F35] hover:text-white transition-all"
            >
              همکاری با من
            </Link>
            <DownloadResumeButton label="دریافت PDF" />
          </div>
        </div>
      </div>

      {/* ── Main Resume Container ── */}
      <div id="resume-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 print:py-0 print:px-0 print:max-w-none">

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <div className="bg-[#0F2B47] text-white rounded-2xl print:rounded-none overflow-hidden mb-6 print:mb-4">
          <div className="flex items-center justify-center pt-8 pb-2" dir="ltr">
            <span className="text-[#C9A84C] font-mono text-sm tracking-[0.4em] uppercase">F | P</span>
          </div>

          <div className="text-center pb-8 px-8">
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none mb-3">
              فرجاد پورمحمد
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-bold">استراتژیست</span>
              <div className="h-px w-16 bg-[#C9A84C]" />
            </div>

            {/* Contact strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-stone-300 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span>نیومارکت، انتاریو، کانادا</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <span dir="ltr">+1 437 661 1674</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span dir="ltr">farjadp@live.com</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                <span dir="ltr">farjadp.info</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ TWO-COLUMN LAYOUT ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 print:grid-cols-[220px_1fr] print:gap-4">

          {/* ─── SIDEBAR ───────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Monogram */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#C9A84C]/30 shadow-xl mb-4">
                <div className="w-full h-full bg-gradient-to-br from-[#0F2B47] to-[#0F3F35] flex items-center justify-center">
                  <span className="text-white font-serif text-4xl font-bold">F</span>
                </div>
              </div>
              <p className="text-center text-xs text-stone-500">فرجاد پورمحمد</p>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                درباره‌ی من
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                با بیش از ۲۲ سال تجربه، مسیرم از نقش‌های پایه‌ی فناوری اطلاعات تا رهبری سازمان‌ها به‌عنوان بنیان‌گذار، مدیر ارشد فنی و مدیر ارشد استراتژی رسیده است. دو کارشناسی ارشد دارم، مهندسی نرم‌افزار و انسان‌شناسی؛ ترکیبی کمیاب که شکل سیستم‌سازی و رهبری کردنم را تعیین می‌کند.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed mt-3">
                بیش از ۲۵ استارتاپ را منتور کرده‌ام، در ایران و کانادا ۴ شرکت هم‌بنیان‌گذاری کرده‌ام و به تیم‌هایی که به آن‌ها باور داشتم کمک کرده‌ام بیش از ۳ میلیون دلار جذب کنند. با شفافیت، سیستم و صداقت بی‌تعارف می‌سازم.
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                مهارت‌ها
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-medium px-2 py-1 bg-[#0F2B47]/5 text-[#0F2B47] rounded border border-[#0F2B47]/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                زبان‌ها
              </h2>
              <div className="space-y-4">
                {LANGUAGES.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-[#0F2B47]">{lang.name}</span>
                      <span className="text-[10px] text-stone-400">{lang.level}</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A84C] rounded-full"
                        style={{ width: `${lang.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                پیوندها
              </h2>
              <div className="space-y-2">
                {LINKS.map((link) => (
                  <div key={link.label} className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-[#C9A84C] w-16 shrink-0 mt-0.5">{link.label}:</span>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="text-[10px] text-stone-600 hover:text-[#0F3F35] transition-colors break-all"
                    >
                      {link.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ─── MAIN CONTENT ──────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Work Experience */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                سوابق کاری
              </h2>

              <div className="space-y-8">
                {WORK_EXPERIENCE.map((job, idx) => (
                  <div key={idx} className="group">
                    <div className="grid grid-cols-[1fr_auto] gap-4 mb-3">
                      <div>
                        <h3 className="font-bold text-[#0F2B47] text-sm leading-tight">{job.company}</h3>
                        <p className="text-[#C9A84C] text-xs mt-0.5">{job.period}</p>
                        <p className="text-stone-400 text-[10px] mt-0.5">{job.location} · {job.duration}</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-[10px] font-black text-[#0F2B47] bg-[#0F2B47]/5 px-2 py-1 rounded border border-[#0F2B47]/10 text-end leading-tight max-w-[140px]">
                          {job.role}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 ms-3">
                      {job.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                          <span className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {idx < WORK_EXPERIENCE.length - 1 && (
                      <div className="mt-6 h-px bg-stone-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                تحصیلات
              </h2>
              <div className="space-y-5">
                {EDUCATION.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-[#0F2B47] text-sm leading-tight">{edu.degree}</h3>
                    <p className="text-[#C9A84C] text-xs mt-1">{edu.institution} / {edu.year}</p>
                    {edu.notes.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {edu.notes.map((note, nIdx) => (
                          <li key={nIdx} className="flex items-start gap-2 text-xs text-stone-600">
                            <span className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    )}
                    {idx < EDUCATION.length - 1 && <div className="mt-4 h-px bg-stone-100" />}
                  </div>
                ))}
              </div>
            </div>

            {/* ISO Certification */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                گواهی‌نامه‌ی حرفه‌ای
              </h2>
              <h3 className="font-bold text-[#0F2B47] text-sm leading-tight">{ISO_CERT.title}</h3>
              <p className="text-[#C9A84C] text-xs mt-1">{ISO_CERT.institution} / {ISO_CERT.year}</p>
              <ul className="mt-3 space-y-1.5">
                {ISO_CERT.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                دوره‌ها و یادگیری مستمر
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CERTIFICATIONS_COURSES.map((course, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs font-bold text-[#0F2B47] leading-tight">{course.title}</span>
                    <span className="text-[#C9A84C] text-[10px] mt-0.5">{course.institution}</span>
                    <span className="text-stone-400 text-[10px] mt-0.5">{course.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Print Footer ── */}
        <div className="hidden print:block mt-8 pt-4 border-t border-stone-200 text-center text-[9px] text-stone-400 font-mono" dir="ltr">
          farjadp.info · farjadp@live.com · +1 437 661 1674 · linkedin.com/in/farjadpourmohammad
        </div>

      </div>

      {/* ── Bottom CTA (screen only) ── */}
      <div className="print:hidden bg-[#0F2B47] mt-12 py-16 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">آماده‌ی همکاری هستید؟</h2>
          <p className="text-stone-300 text-sm mb-8 leading-relaxed">
            چه به شریک استراتژیک نیاز داشته باشید، چه هم‌بنیان‌گذار فنی، چه منتور استارتاپ؛ با هم حرف بزنیم.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/fa/contact"
              className="px-8 py-3 rounded-full bg-[#C9A84C] text-[#0F2B47] font-bold text-sm hover:bg-[#b8963e] transition-colors"
            >
              رزرو جلسه‌ی استراتژی
            </Link>
            <DownloadResumeButton variant="outline" label="دریافت PDF" />
          </div>
        </div>
      </div>

    </div>
  );
}
