// ============================================================================
// File Path: src/app/fa/(public)/page.tsx
// Version: 3.0.0 — 2026-09-21
// Why: The Persian home page, rebuilt inside the site's established world
//      (the dark editorial identity of the English home and the shell).
//      Every fact on this page already appears elsewhere on the site —
//      resume, about/data.ts, services/data.ts, the lab page. Nothing here
//      is claimed for the first time.
// Env / Identity: React Server Component (motion lives in fa-motion.tsx)
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import {
  ArrowDownLeft,
  ArrowUpLeft,
  Asterisk,
  BookOpen,
  Check,
  FlaskConical,
  Gauge,
} from "lucide-react"
import {
  CountUp,
  DrawnRule,
  Develop,
  HeroFade,
  HeroLine,
  Reveal,
} from "@/components/home/fa-motion"

export const metadata: Metadata = {
  alternates: localeAlternates("/", "fa"),
  title: "فرجاد | ونچر بیلدر و معمار سیستم",
  description:
    "به تیم‌های جدی کمک می‌کنم ایده‌های مبهم، محصول‌های شکننده و عملیات دستی را به شرکتی تبدیل کنند که مقیاس می‌گیرد.",
}

// Dates and roles come from the resume; institutions from about/data.ts.
const LEDGER: { year: string; lines: string[] }[] = [
  { year: "۲۰۰۶", lines: ["بنیان‌گذار و مدیر DPF، شرکت پردازش داده. تا ۲۰۲۳."] },
  { year: "۲۰۱۷", lines: ["مدیر ارشد فنی نخستین شرکت رایانش ابری دولتی ایران. تا ۲۰۲۰."] },
  {
    year: "۲۰۲۰",
    lines: [
      "هم‌بنیان‌گذار HoFin، اپلیکیشن سلامت روان، منتشرشده روی اپ‌استور.",
      "دکتری انسان‌شناسی.",
    ],
  },
  {
    year: "۲۰۲۲",
    lines: [
      "منتور استارتاپ‌ها در VisaRoads.",
      "بنیان‌گذار NFTsShip، نخستین پلتفرم و رویداد NFT ایران. تا ۲۰۲۶.",
    ],
  },
  { year: "۲۰۲۴", lines: ["برنامه‌ی شتاب‌دهی Treefrog، انتاریو."] },
  {
    year: "۲۰۲۵",
    lines: ["بنیان‌گذار و مدیر ارشد استراتژی AshaVid، تورنتو.", "مسترکلاس ونچر، آکادمی شولیک."],
  },
  { year: "۲۰۲۶", lines: ["متخصص تحول دیجیتال، دانشکده‌ی کسب‌وکار شولیک، دانشگاه یورک."] },
]

// Captions are the lab page's own, word for word.
const EVIDENCE = [
  {
    src: "/images/lab/council.jpg",
    alt: "ارائه‌ی نتایج برنامه در صحن شورای منطقه‌ای یورک",
    caption: "شورای منطقه‌ای یورک، ارائه‌ی نتایج تیم‌ها",
  },
  {
    src: "/images/lab/panel.jpg",
    alt: "پنل پایانی برنامه‌ی Digital Transformation",
    caption: "پنل پایانی، تورنتو",
  },
]

const SERVICES = [
  {
    href: "/fa/services/founder-advisory",
    label: "مشاوره",
    title: "مشاوره‌ی بنیان‌گذار",
    copy: "یک طرف مقابل فکری برای تصمیم‌های سخت، نه تشویق‌کننده.",
  },
  {
    href: "/fa/services/startup-visa",
    label: "استارتاپ ویزا",
    title: "بیزینس‌کیسی که دوام بیاورد",
    copy: "برای بنیان‌گذاران مهاجری که می‌خواهند شرکت واقعی بسازند، نه پرونده‌ای قالبی.",
  },
  {
    href: "/fa/services/digital-systems",
    label: "سیستم و هوش مصنوعی",
    title: "طراحی شکل کارکرد کسب‌وکار",
    copy: "اول ساختار، بعد ابزار. هوش مصنوعی فقط جایی که اهرم بسازد.",
  },
]

const PERSIAN_ONLY = [
  {
    href: "/fa/lab",
    icon: FlaskConical,
    title: "آزمایشگاه بنیان‌گذار",
    copy: "۸ هفته کار واقعی روی استارتاپ شما. ۵ تیم، رایگان.",
  },
  {
    href: "/fa/book-club",
    icon: BookOpen,
    title: "باشگاه کتاب",
    copy: "خواندن جمعی، برای کسانی که می‌سازند.",
  },
  {
    href: "/fa/tools",
    icon: Gauge,
    title: "ابزارهای رایگان",
    copy: "۶ سنجه‌ی خودارزیابی برای بنیان‌گذاران، از آمادگی استارتاپ تا TRL.",
  },
]

const FACTS = [
  { value: 22, suffix: "+", label: "سال در فناوری" },
  { value: 25, suffix: "", label: "استارتاپ منتورشده" },
  { value: 3, suffix: "", label: "میلیون دلار جذب‌شده توسط تیم‌ها" },
]

export default function PersianHomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-emerald-500 selection:text-black">
      {/* ---------------------------------------------------------------- */}
      {/* 1. HERO                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative flex min-h-[100dvh] flex-col border-b border-white/10 px-5 pb-10 pt-24 md:px-10 lg:px-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.06),transparent_40%)]" />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div className="lg:w-2/3 lg:pb-12">
            <HeroFade delay={0} className="mb-12 flex items-center gap-3 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              نیومارکت، انتاریو · کار با تیم‌ها در سراسر دنیا · ۲۰۲۶
            </HeroFade>

            <h1 className="text-[clamp(3rem,7.4vw,7.5rem)] font-black leading-[1.08] text-zinc-50">
              <HeroLine i={0}>چیزی بساز</HeroLine>
              <HeroLine i={1} className="text-emerald-500">
                که در واقعیت
              </HeroLine>
              <HeroLine i={2}>دوام بیاورد.</HeroLine>
            </h1>

            <HeroFade
              delay={0.55}
              className="mt-12 grid max-w-4xl gap-8 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto] md:items-end"
            >
              <p className="max-w-xl text-lg leading-relaxed text-zinc-400 md:text-2xl">
                فرجاد هستم. ایده‌های مبهم، تیم‌های گیرکرده و عملیات دستی را به محصول و شرکتی تبدیل می‌کنم که روی خودش رشد می‌کند.
              </p>
              <Link
                href="/fa/booking"
                className="group inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:h-20 md:w-20"
                aria-label="رزرو جلسه‌ی آشنایی"
              >
                <ArrowUpLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 md:h-8 md:w-8" />
              </Link>
            </HeroFade>
          </div>

          <div className="relative lg:w-1/3 lg:justify-self-end">
            <HeroFade
              delay={0.9}
              className="absolute -end-4 top-6 z-10 bg-emerald-500 px-3 py-2 text-[11px] font-bold text-zinc-950 md:-end-8"
            >
              مهندس × مشاور
            </HeroFade>
            <Develop className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-zinc-900 grayscale transition duration-700 hover:grayscale-0">
              <Image
                src="/images/farjad-portrait.jpg"
                alt="فرجاد پورمحمد"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="h-full w-full object-cover object-top opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent px-6 pb-6 pt-24">
                <div className="flex items-end justify-between gap-5">
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    نرم‌افزار / انسان‌شناسی
                    <br />
                    استراتژی / اجرا
                  </p>
                  <Asterisk className="h-8 w-8 animate-[spin_16s_linear_infinite] text-emerald-500" />
                </div>
              </div>
            </Develop>
          </div>
        </div>

        <HeroFade
          delay={1.1}
          className="relative mx-auto mt-12 flex w-full max-w-[1600px] items-center justify-between border-t border-white/10 pt-6 text-[11px] text-zinc-500"
        >
          <span>برای دیدن کارنامه پایین بروید</span>
          <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
        </HeroFade>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2. FACTS — a marquee, and only figures already on the site        */}
      {/* ---------------------------------------------------------------- */}
      <div className="overflow-hidden border-b border-zinc-950 bg-zinc-50 py-4 text-zinc-950" dir="ltr">
        <div className="flex w-max animate-[home-marquee_30s_linear_infinite] items-center gap-8 whitespace-nowrap text-xs font-bold motion-reduce:animate-none">
          {[0, 1].map((set) => (
            <div className="flex items-center gap-8" key={set} aria-hidden={set === 1} dir="rtl">
              <span>۲۲+ سال در فناوری</span>
              <Asterisk className="h-3 w-3" />
              <span>۲۵ استارتاپ منتورشده</span>
              <Asterisk className="h-3 w-3" />
              <span>بیش از ۳ میلیون دلار جذب‌شده توسط تیم‌ها</span>
              <Asterisk className="h-3 w-3" />
              <span>ممیز ارشد ISO 27001</span>
              <Asterisk className="h-3 w-3" />
              <span>دکتری انسان‌شناسی</span>
              <Asterisk className="h-3 w-3" />
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 3. THE RECORD — dated, no adjectives                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-white/10 px-5 py-24 md:px-10 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal className="mb-16 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:items-end">
            <h2 className="text-4xl font-bold leading-tight md:text-6xl lg:col-span-8 lg:text-7xl">
              کارنامه، به ترتیب تاریخ.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-zinc-400 lg:col-span-4">
              بدون صفت. فقط اینکه کِی چه کاری کرده‌ام. هر خط این فهرست جای دیگری از همین سایت هم هست.
            </p>
          </Reveal>

          <div className="grid gap-16 lg:grid-cols-12">
            {/* Ledger */}
            <div className="lg:col-span-7">
              <DrawnRule ruleClassName="start-[3.25rem] md:start-[4.5rem]">
              <ol className="space-y-0">
                {LEDGER.map((row, i) => (
                  <Reveal
                    as="li"
                    key={row.year}
                    delay={Math.min(i * 0.05, 0.3)}
                    className="group grid grid-cols-[3.25rem_1fr] gap-6 border-b border-white/10 py-7 md:grid-cols-[4.5rem_1fr] md:gap-10"
                  >
                    <span className="pt-1 text-sm font-bold tabular-nums text-emerald-400 md:text-base">
                      {row.year}
                    </span>
                    <div className="space-y-2 ps-6">
                      {row.lines.map((line) => (
                        <p
                          key={line}
                          className="text-lg leading-relaxed text-zinc-200 transition-colors group-hover:text-zinc-50 md:text-2xl"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </ol>
              </DrawnRule>

              <div className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-6 border-t border-white/10 pt-8">
                {FACTS.map((f) => (
                  <div key={f.label} className="flex items-baseline gap-3">
                    <CountUp
                      to={f.value}
                      suffix={f.suffix}
                      className="text-4xl font-black tabular-nums text-zinc-50 md:text-5xl"
                    />
                    <span className="text-sm text-zinc-400">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence */}
            <div className="grid gap-6 lg:col-span-5">
              {EVIDENCE.map((photo, i) => (
                <Reveal as="figure" key={photo.src} delay={0.1 * i} className="group">
                  <div className="relative aspect-[3/2] overflow-hidden bg-zinc-900">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover grayscale transition duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs text-zinc-500">
                    <span>{photo.caption}</span>
                    <Asterisk className="h-3 w-3 shrink-0 text-emerald-500" />
                  </figcaption>
                </Reveal>
              ))}
              <Reveal delay={0.2}>
                <Link
                  href="/fa/startups"
                  className="group flex items-center justify-between border-t border-white/10 pt-5 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  ۲۵ استارتاپی که کنارشان بوده‌ام
                  <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4. PRACTICE                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-white/10 px-5 py-24 md:px-10 lg:px-14 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal className="mb-20">
            <h2 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              استراتژی تا وقتی چیزی را که دوشنبه ساخته می‌شود عوض نکند، بی‌فایده است.
            </h2>
          </Reveal>

          <Reveal className="border-t border-white/10">
            {SERVICES.map((service) => (
              <Link
                href={service.href}
                key={service.href}
                className="group grid gap-6 border-b border-white/10 py-10 transition-colors hover:bg-white/[0.02] focus-visible:bg-white/[0.03] focus-visible:outline-none md:grid-cols-12 md:items-center md:px-6"
              >
                <span className="text-sm font-medium text-emerald-400 md:col-span-3">{service.label}</span>
                <h3 className="text-2xl font-bold leading-snug text-zinc-50 md:col-span-4 md:text-4xl">
                  {service.title}
                </h3>
                <p className="max-w-lg leading-relaxed text-zinc-400 md:col-span-4">{service.copy}</p>
                <ArrowUpLeft className="h-6 w-6 text-zinc-600 transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-500 md:col-span-1 md:justify-self-end" />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 5. PERSIAN-ONLY                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid border-b border-white/10 lg:grid-cols-2">
        <div className="flex min-h-[520px] flex-col justify-between bg-zinc-900 p-8 md:p-14 lg:p-20">
          <Asterisk className="h-5 w-5 text-zinc-600" />
          <Reveal>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-zinc-400">
              بخشی از کارم فقط به فارسی اتفاق می‌افتد: برای بنیان‌گذاران ایرانی، چه داخل ایران، چه در راه.
            </p>
            <h2 className="text-[clamp(3rem,6.5vw,6.5rem)] font-black leading-[1.05] text-zinc-50">
              فقط
              <br />
              <span className="text-emerald-500">به فارسی.</span>
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center bg-zinc-950 p-8 md:p-14 lg:p-20">
          <Reveal>
            {PERSIAN_ONLY.map(({ href, icon: Icon, title, copy }) => (
              <Link
                key={href}
                href={href}
                className="group grid gap-6 border-b border-white/10 py-10 transition-colors first:border-t hover:bg-white/[0.02] focus-visible:bg-white/[0.03] focus-visible:outline-none md:grid-cols-[70px_1fr_auto] md:items-center"
              >
                <Icon className="h-8 w-8 text-emerald-500" />
                <div>
                  <h3 className="mb-2 text-xl font-bold text-zinc-50">{title}</h3>
                  <p className="max-w-md leading-relaxed text-zinc-400">{copy}</p>
                </div>
                <ArrowUpLeft className="hidden h-5 w-5 text-zinc-600 transition-all group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-500 md:block" />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 6. CTA                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-5 py-10 md:px-10 lg:px-14">
        <Reveal className="relative mx-auto overflow-hidden bg-emerald-500 px-8 py-16 text-zinc-950 md:px-16 md:py-24 lg:max-w-[1600px]">
          <Asterisk className="absolute -start-16 -top-24 h-80 w-80 text-black/5" />
          <div className="relative grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="text-[clamp(3rem,6.5vw,7rem)] font-black leading-[1.05]">
                بیایید
                <br />
                راهش بیندازیم.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <ul className="mb-10 space-y-4 text-sm font-semibold">
                {["یک جلسه‌ی تشخیص", "بازخورد مستقیم و بی‌تعارف", "بدون نمایش آژانسی"].map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <Check className="h-5 w-5" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/fa/booking"
                className="group flex items-center justify-between border-t-2 border-zinc-950 py-6 text-lg font-black hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
              >
                رزرو گفت‌وگو
                <ArrowUpLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
