import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, CheckCircle2, Linkedin, Send, Youtube } from "lucide-react";
import { ApplicationForm } from "./application-form";

export const metadata: Metadata = {
  title: "Founder Development Lab | فرجاد پورمحمد",
  description:
    "۸ هفته کار واقعی روی استارتاپ شما — ۵ تیم، رایگان. از ایده تا شواهد، با منتورشیپ مستقیم فرجاد پورمحمد.",
  openGraph: {
    title: "Founder Development Lab — از ایده تا شواهد",
    description:
      "۸ هفته، ۵ تیم، رایگان. هر هفته روی مسئله‌ی واقعی استارتاپ شما کار می‌کنیم.",
    images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "Founder Development Lab" }],
  },
};

const WEEKS = [
  { n: "۱", title: "The Founder & The Thesis", desc: "تفکیک آنچه می‌دانیم، آنچه باور داریم و آنچه هنوز نمی‌دانیم.", out: "Venture Thesis v0.1" },
  { n: "۲", title: "Problem Deconstruction", desc: "شکستن مسئله به Trigger، Frequency، Severity و Cost.", out: "Problem Map + ۵ فرض بحرانی" },
  { n: "۳", title: "Customer Discovery", desc: "گفت‌وگوی درست با مشتری واقعی، به‌جای سؤال‌های تأییدی.", out: "Customer Hypothesis + Evidence Log" },
  { n: "۴", title: "Market Reality", desc: "دیدن بازار همان‌طور که هست — رقبا، جایگزین‌ها، و Doing Nothing.", out: "Market Map + Thesis v0.2" },
  { n: "۵", title: "Solution & Value", desc: "کوچک‌ترین راه‌حلی که ارزش اصلی را قابل آزمایش کند.", out: "Solution Hypothesis + آنچه نمی‌سازیم" },
  { n: "۶", title: "Business Model & Kill Risks", desc: "چه کسی پول می‌دهد، چرا، چقدر — و سه ریسکی که می‌تواند همه‌چیز را بکشد.", out: "Kill-Risk Map" },
  { n: "۷", title: "The Critical Experiment", desc: "ارزان‌ترین آزمایش معتبر برای پرریسک‌ترین فرض.", out: "Experiment + Evidence" },
  { n: "۸", title: "Founder Decision Board", desc: "چه باور داشتیم، چه یاد گرفتیم، چه اشتباه بود — و تصمیم ۹۰ روز بعد.", out: "Decision + برنامه ۹۰ روزه" },
];

const TRACK_RECORD = [
  "بیش از بیست سال در صنعت آی‌تی ایران",
  "بیش از هفت سال کنار استارتاپ‌های ایران",
  "سه سال در اکوسیستم استارتاپی کانادا",
  "منتورشیپ بیش از ۵۰ تیم استارتاپی",
  "ریزفاند بیش از ۱۰ میلیون دلار برای تیم‌های استارتاپی",
];

const SOCIALS = [
  { label: "کانال تلگرام — سفر قهرمانی یک منتور", href: "https://t.me/Heros_Journey", Icon: Send },
  { label: "یوتیوب — Farjad Talks", href: "https://youtube.com/@FarjadTalks", Icon: Youtube },
  { label: "لینکدین", href: "https://www.linkedin.com/in/farjadpourmohammad/", Icon: Linkedin },
];

/** عکس‌های واقعی — فایل‌ها در public/images/lab/ */
const PHOTOS = [
  { src: "/images/lab/council.jpg", alt: "ارائه‌ی نتایج برنامه در صحن شورای منطقه‌ای یورک", caption: "شورای منطقه‌ای یورک — ارائه‌ی نتایج تیم‌ها", span: "col-span-2 md:col-span-2 md:row-span-2" },
  { src: "/images/lab/online-session.jpg", alt: "جلسه‌ی آنلاین منتورشیپ با فاندرهای ایرانی", caption: "جلسه‌ی آنلاین با فاندرهای ایرانی" },
  { src: "/images/lab/cohort.jpg", alt: "تیم‌های دوره در ساختمان منطقه‌ی یورک", caption: "روز آخر یک Cohort" },
  { src: "/images/lab/panel.jpg", alt: "پنل پایانی برنامه‌ی Digital Transformation", caption: "پنل پایانی — تورنتو" },
  { src: "/images/lab/accelerator.jpg", alt: "جشن پایان دوره با تیم شتاب‌دهنده", caption: "آخر دوره، با تیم شتاب‌دهنده" },
];

const LENS_QUESTIONS = [
  "این آدم چطور فکر می‌کند؟",
  "چطور تصمیم می‌گیرد؟",
  "وقتی hypothesis خودش غلط از آب درمی‌آید، چه می‌کند؟",
  "وقتی market جواب نمی‌دهد، چه می‌کند؟",
  "وقتی با co-founder اختلاف دارد، چه می‌کند؟",
  "آیا execute می‌کند؟",
  "آیا excuse می‌آورد؟",
  "آیا data را manipulate می‌کند؟",
  "آیا مشتری را می‌فهمد؟",
  "آیا فقط عاشق product خودش است — و چشم‌هایش بسته؟",
];

export default function FounderLabPage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Founder Development Lab",
    description:
      "برنامه ۸ هفته‌ای منتورشیپ برای فاندرها و تیم‌های بسیار اولیه — از ایده تا شواهد.",
    provider: {
      "@type": "Person",
      name: "Farjad Pourmohammad",
      url: "https://farjadp.info",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Blended",
      location: "Toronto / Online",
    },
  };

  return (
    <div
      dir="rtl"
      className="lab-page min-h-screen bg-[#FDFCF8] text-[#1C1917] selection:bg-[#1B4B43] selection:text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <style>{`
        @keyframes lab-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .lab-rise { animation: lab-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) { .lab-rise { animation: none; } }
        .lab-page a, .lab-page button, .lab-page input, .lab-page textarea { outline: none; }
        .lab-page a:focus-visible, .lab-page button:focus-visible { box-shadow: 0 0 0 2px #FDFCF8, 0 0 0 4px #1B4B43; border-radius: 4px; }
        .lab-page input, .lab-page textarea { caret-color: #1B4B43; }
      `}</style>

      {/* ─── نامه ─────────────────────────────────────────────── */}
      <section className="px-6 pt-20 md:pt-28 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_260px] gap-12 lg:gap-20 items-start lab-rise">
          <div className="space-y-8">
            <p className="text-sm font-semibold text-[#1B4B43] tracking-wide">
              Founder Development Lab · از ایده تا شواهد
            </p>

            <h1 className="text-[2.4rem] md:text-6xl font-black leading-[1.2] md:leading-[1.18] text-[#111827] text-balance">
              استارتاپ، چهار صفحه بیزینس‌پلن و یک پیچ‌دک نیست.
            </h1>

            <div className="space-y-5 text-lg leading-[2.1] text-stone-700 max-w-2xl">
              <p>
                بعد از این‌همه سال سر و کله زدن با فاندرها — و تجربه‌ی خودم توی
                استارتاپ — به یک چیز رسیده‌ام: راه انداختن استارتاپ را نمی‌شود از
                لابه‌لای کتاب‌ها و فریمورک‌ها درآورد. لین کانواس پر کردن، استارتاپ
                داشتن نیست.
              </p>
              <p>
                برای همین یک دوره‌ی کوچک گذاشته‌ام: <strong className="font-bold text-[#111827]">۸ هفته، ۵ تیم، رایگان.</strong>{" "}
                هر هفته می‌نشینیم روی مسئله‌ی واقعیِ استارتاپ شما کار می‌کنیم — نه
                سخنرانی، نه مدرک. آخرش یا با شواهد ادامه می‌دهید، یا با شواهد
                می‌فهمید که نباید ادامه دهید. هر دو پیشرفت است.
              </p>
            </div>

            <div className="flex items-center gap-5 pt-2">
              <a
                href="#apply"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1B4B43] text-white font-bold rounded-full text-base transition-colors duration-300 hover:bg-[#123730]"
              >
                <Send className="w-4 h-4" />
                فرم درخواست
              </a>
              <a
                href="#terms"
                className="inline-flex items-center gap-2 font-bold text-[#111827] border-b-2 border-[#D97706] pb-0.5 hover:text-[#1B4B43] transition-colors"
              >
                شرایط دوره
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* عکس + کارنامه */}
          <figure className="max-w-xs md:max-w-none">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-200">
              <Image
                src="/images/farjad-portrait.jpg"
                alt="فرجاد پورمحمد"
                fill
                sizes="(max-width: 768px) 20rem, 260px"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-4">
              <span className="block font-bold text-[#111827] text-base mb-3">فرجاد پورمحمد</span>
              <ul className="space-y-2 text-sm leading-relaxed text-stone-600">
                {TRACK_RECORD.map((t) => (
                  <li key={t} className="border-r-2 border-[#D97706] pr-3">{t}</li>
                ))}
              </ul>
              <ul className="mt-5 space-y-2.5 text-sm">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-stone-500 hover:text-[#1B4B43] transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ─── منتورینگ چی نیست ─────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-stone-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
          <h2 className="text-3xl font-black text-[#111827] leading-snug md:sticky md:top-28 self-start">
            منتورینگ،
            <br />
            <span className="text-stone-400">answering questions</span>
            <br />
            نیست.
          </h2>

          <div className="space-y-8 max-w-2xl">
            <p className="text-lg leading-[2.1] text-stone-700">
              اینکه یک نفر به همه‌ی سؤال‌های شما جواب بدهد، دلیل نمی‌شود نتیجه‌ی
              درستی بگیرید. جواب دادن به سؤال، کارِ مشاور و کارشناس است. کار من در
              این ۸ هفته چیز دیگری است:
            </p>

            <ul className="space-y-0 text-lg font-medium text-[#111827]">
              {[
                ["تشخیص مسئله‌ی اشتباه", "قبل از اینکه شش ماه رویش وقت بگذارید"],
                ["پرسیدن سؤال درست", "همان‌که خودتان از خودتان نمی‌پرسید"],
                ["دیدن pattern", "چیزی که بار اول است می‌بینید، من بار صدم است"],
                ["طراحی آزمایش", "ارزان‌ترین راهِ فهمیدنِ حقیقت"],
                ["ایجاد accountability", "هفته‌ی بعد می‌پرسم انجامش دادید یا نه"],
                ["فشار روی execution", "ایده ارزان است؛ اجرا همه‌چیز است"],
              ].map(([t, d]) => (
                <li
                  key={t}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 border-b border-stone-200/70"
                >
                  <span className="font-bold">{t}</span>
                  <span className="text-sm font-normal text-stone-500">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── از کانال تلگرام ──────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20 items-start">
          <div className="md:sticky md:top-28 space-y-4">
            <h2 className="text-3xl font-black text-[#111827] leading-snug">
              این حرف‌ها
              <br />
              تازه نیست.
            </h2>
            <p className="text-stone-600 leading-relaxed">
              قبل از اینکه این صفحه وجود داشته باشد، همه‌اش را توی کانالم نوشته
              بودم.
            </p>
            <a
              href="https://t.me/Heros_Journey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#1B4B43] font-bold hover:text-[#123730] transition-colors"
            >
              <Send className="w-4 h-4" />
              سفر قهرمانی یک منتور
            </a>
          </div>

          <div className="space-y-5 max-w-2xl w-full">
            {/* پیام ۱: نظرسنجی */}
            <article className="bg-white rounded-2xl rounded-tr-md border border-stone-200 shadow-[0_2px_12px_-4px_rgba(28,25,23,0.08)] p-6">
              <header className="flex items-baseline justify-between gap-4 mb-3">
                <span dir="ltr" className="font-bold text-[#1B4B43]">Farjad A Startup Geek :)</span>
                <time className="text-xs text-stone-400 shrink-0">۹ آگوست</time>
              </header>
              <p className="leading-[2] text-[#1C1917] mb-5">
                دوره‌ی خصوصی منتورشیپ بذارم؟ ماکسیمم ۵ تیم. دوره‌ی ۸ هفته‌ای. هر
                هفته ۹۰ دقیقه. هر دو هفته یک جلسه‌ی اضافه‌ی خصوصی منتورشیپ ۱:۱
                برای هر تیم…
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1.5 font-medium text-[#111827]">
                    <span>آره حتماً. ما شرکت می‌کنیم</span>
                    <span className="font-bold">٪۷۱</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full w-[71%] bg-[#1B4B43] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5 text-stone-500">
                    <span>جذابیتی نداره!</span>
                    <span>٪۲۹</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full w-[29%] bg-stone-300 rounded-full" />
                  </div>
                </div>
                <p className="text-xs text-stone-400 pt-1">۲۱ رأی · نظرسنجی کانال</p>
              </div>
            </article>

            {/* پیام ۲ */}
            <article className="bg-white rounded-2xl rounded-tr-md border border-stone-200 shadow-[0_2px_12px_-4px_rgba(28,25,23,0.08)] p-6">
              <header className="flex items-baseline justify-between gap-4 mb-3">
                <span dir="ltr" className="font-bold text-[#1B4B43]">Farjad A Startup Geek :)</span>
                <time className="text-xs text-stone-400 shrink-0">۹ آگوست</time>
              </header>
              <p className="leading-[2] text-[#1C1917]">
                پاسخ به سؤال اساساً وظیفه‌ی مشاور و کارشناس است! اینکه یک نفر به
                همه‌ی سؤالات شما جواب بدهد، دلیل بر این نمی‌شود که نتیجه‌ی درستی
                برایتان کسب بشود. در مواجهه با آدم‌ها این دو تا را از هم جدا کنید:
                Credibility و Competency.
              </p>
            </article>
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
              همان‌چیزی که توی کانال نوشتم؛ نه کمتر، نه بیشتر.
            </p>
          </div>

          <dl className="max-w-2xl w-full">
            {[
              ["ظرفیت", "۵ تیم. بیشتر نمی‌گیرم، چون وقت واقعی می‌گذارم."],
              ["طول دوره", "۸ هفته."],
              ["جلسه‌ی گروهی", "هر هفته ۹۰ دقیقه — ۲۰ دقیقه Concept، ۵۰ دقیقه Hot Seat، ۲۰ دقیقه تصمیم و قدم بعد."],
              ["جلسه‌ی خصوصی", "هر دو هفته یک‌بار، ۱:۱ با هر تیم — هفته‌های ۲، ۴، ۶ و ۸."],
              ["هزینه", "رایگان. در این ۸ هفته هیچ پولی و هیچ سهامی رد و بدل نمی‌شود."],
              ["بعد از هفته‌ی هشتم", "اگر رشد ببینم، با ۳ تیم وارد همکاری ۱۲ ماهه می‌شویم — آنجا ۲.۵٪ سهام قرارداد می‌شود."],
              ["Demo Day", "نداریم. Decision Day داریم — روزی که تصمیم می‌گیرید، نه روزی که اجرا می‌روید."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="grid grid-cols-[7.5rem_1fr] md:grid-cols-[10rem_1fr] gap-4 py-5 border-b border-stone-200/70 items-baseline"
              >
                <dt className="font-black text-[#1B4B43]">{t}</dt>
                <dd className="leading-[1.9] text-stone-700">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── مسیر ۸ هفته ─────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12 space-y-4">
            <h2 className="text-3xl font-black text-[#111827]">هفته به هفته چه می‌کنیم؟</h2>
            <p className="text-stone-600 leading-[1.9]">
              هر هفته حداقل یک عدم‌قطعیت مهم کم می‌شود — حتی اگر پیشرفت به معنی
              کشف یک اشتباه باشد. هر تیم هفته‌ای یک Founder Journal هم می‌نویسد:
              چه باور داشتم، چه شواهدی به چالشش کشید، چه تصمیمی عوض شد، از چه
              کاری فرار کردم.
            </p>
          </div>

          <ol className="max-w-3xl">
            {WEEKS.map((w) => (
              <li
                key={w.n}
                className="grid grid-cols-[2.5rem_1fr] gap-5 py-5 border-b border-stone-300/50 items-baseline"
              >
                <span className="text-2xl font-black text-stone-300 tabular-nums text-center">{w.n}</span>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-bold text-lg text-[#111827]" dir="ltr">{w.title}</h3>
                  <p className="text-stone-600 basis-full leading-relaxed">{w.desc}</p>
                  <p className="text-sm font-semibold text-[#1B4B43]">خروجی: {w.out}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="max-w-3xl mt-8 text-stone-600 leading-[1.9]">
            بعضی هفته‌ها عمداً یک اقدام واقعی وسط است: صحبت با آدم واقعی، حذف
            feature محبوب‌تان، یا آزمایشی که ممکن است نشان بدهد فرض اصلی غلط بوده.
            هدف فشار مصنوعی نیست — دیدن رفتار شما در موقعیت واقعی است.
          </p>
        </div>
      </section>

      {/* ─── به چی نگاه می‌کنم ─────────────────────────────────── */}
      <section className="px-6 py-24 bg-[#111827] text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
          <div className="md:sticky md:top-28 self-start space-y-4">
            <h2 className="text-3xl font-black leading-snug">
              فقط به ایده
              <br />
              نگاه نمی‌کنم.
            </h2>
            <p className="text-stone-300/90 leading-[1.9]">
              اگر قرار باشد یک سال کنار تیمی بمانم، کیفیت فاندر از جذابیت ایده
              مهم‌تر است. توی این ۸ هفته دنبال جواب این سؤال‌ها هستم:
            </p>
          </div>

          <div className="max-w-2xl">
            <ul className="text-xl md:text-2xl font-bold leading-relaxed space-y-0">
              {LENS_QUESTIONS.map((q, i) => (
                <li key={i} className="py-4 border-b border-white/10 last:border-0">
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-stone-300/80 leading-[1.9]">
              این‌ها را همان موقع توی کانال هم نوشتم — حتی اگر هیچ‌وقت با من
              همکاری نکنید، برای شروعِ خودتان سرنخ خوبی است.
            </p>
          </div>
        </div>
      </section>

      {/* ─── برای کی هست ──────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-[#111827]">بیایید، اگر…</h2>
            <ul className="space-y-3.5 text-lg leading-[1.9] text-stone-700">
              <li>در مرحله‌ی Idea، Validation یا Pre-MVP هستید.</li>
              <li>ایده‌ی مشخصی دارید ولی مسیر روشن نیست.</li>
              <li>آماده‌اید فرض‌هایتان را زیر سؤال ببرید — واقعاً.</li>
              <li>بین جلسات کار می‌کنید، نه فقط توی جلسات.</li>
            </ul>
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-stone-400">نیایید، اگر…</h2>
            <ul className="space-y-3.5 text-lg leading-[1.9] text-stone-500">
              <li>دنبال مدرک یا جلسه‌ی انگیزشی هستید.</li>
              <li>انتظار دارید منتور برایتان مشتری بیاورد.</li>
              <li>فقط می‌خواهید کسی ایده‌تان را تأیید کند.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── عکس‌ها ───────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-10 space-y-4">
            <h2 className="text-3xl font-black text-[#111827]">این کار را واقعاً انجام می‌دهم.</h2>
            <p className="text-stone-600 leading-[1.9]">
              نه یک دوره‌ی آنلاین که یک‌بار ضبط شده باشد. این چند سال، همین کار
              را کنار تیم‌ها کرده‌ام — در جلسه‌ی هفتگی، در اتاق شورای منطقه‌ای
              یورک، و پشت میکروفون.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[9rem] md:auto-rows-[11rem] gap-3">
            {PHOTOS.map((p) => (
              <figure
                key={p.src}
                className={`relative rounded-2xl overflow-hidden bg-stone-300 group ${p.span ?? ""}`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs md:text-sm text-white font-medium bg-gradient-to-t from-black/75 via-black/40 to-transparent pt-10">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── فرم ──────────────────────────────────────────────── */}
      <section id="apply" className="px-6 pb-28 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 bg-[#1B4B43] text-white rounded-2xl p-6 md:p-8 flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 bg-white/15 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <p className="font-black text-lg md:text-xl">کوهورت اول — آستانه — بسته شد</p>
              <p className="text-emerald-100/90 leading-[1.9]">
                ۵ تیم پذیرش شدند و کار شروع شده. اگر فرم زیر را پر کنید، برای دوره‌ی
                بعدی جزو اولویت‌های من خواهید بود — وقتی باز شود، اول از همه با شما
                تماس می‌گیرم.
              </p>
            </div>
          </div>

          <div className="mb-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#111827]">فرم درخواست برای دوره‌ی بعدی</h2>
            <p className="text-lg text-stone-600 leading-[1.9] max-w-xl">
              پنج دقیقه وقت می‌گیرد و جواب صادقانه مهم‌تر از جواب کامل است. دوره‌ی
              بعدی که باز شود، این فرم‌ها اول بررسی می‌شوند — این فرم اپلیکیشن نهایی
              نیست.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-[0_2px_16px_-6px_rgba(28,25,23,0.1)]">
            <ApplicationForm />
          </div>

          <div className="mt-14 flex flex-col items-center gap-4">
            <Image
              src="/images/logo-lockup.png"
              alt="فرجاد پورمحمد — AI Strategist"
              width={997}
              height={821}
              className="w-60 max-w-full"
            />
            <p className="text-sm text-stone-400 text-center">
              Cohort ’26 · Toronto / Online ·{" "}
              <a href="mailto:its@farjadp.info" className="underline hover:text-[#1B4B43] transition-colors" dir="ltr">
                its@farjadp.info
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
