"use client"

// ============================================================================
// File Path: src/components/v3/intro/industry-flows.tsx
// Why: The simple picker above shows one chore automated. This shows what a
//      serious system looks like for a professional: seven trades, each a
//      pipeline where the machine does the heavy, repetitive part and one
//      step is marked as the professional's own judgement. The steps light
//      up in turn; clicking one stops on it. The architect gets a picture of
//      design options being generated, because that was the example asked
//      for; the others show the outputs the pipeline hands over.
//
//      These are designs for systems that can be built, not case studies.
//      The section's lead says so, and no step carries a time or money
//      figure we could not stand behind.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Building2,
  Calculator,
  Clapperboard,
  FileCheck2,
  HardHat,
  House,
  Scale,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { localDigits } from "@/lib/digits"

type Step = { title: string; body: string; you?: boolean }

type Industry = {
  key: string
  label: string
  icon: ReactNode
  today: string
  outcome: string
  steps: Step[]
  tools: string[]
  outputs: string[]
  note?: string
}

const INDUSTRIES: Industry[] = [
  {
    key: "architect",
    label: "معماری و طراحی داخلی",
    icon: <Building2 className="h-5 w-5" aria-hidden />,
    today:
      "هر گزینه‌ی طراحی روزها کار دستی می‌برد: ترسیم، حساب متراژ، رندر. برای همین معمولاً فقط یکی دو گزینه به کارفرما می‌رسد.",
    outcome:
      "به‌جای یک گزینه، چند گزینه‌ی سنجیده و رندرشده جلوی کارفرما می‌گذارید؛ وقت شما صرف طراحی می‌شود، نه ترسیم تکراری.",
    steps: [
      {
        title: "گرفتن نیاز کارفرما",
        body: "جلسه ضبط می‌شود یا کارفرما فرمی را پر می‌کند. هوش مصنوعی از آن برنامه‌ی فیزیکی درمی‌آورد: تعداد اتاق، متراژ، بودجه، سبک و نور دلخواه.",
      },
      {
        title: "خواندن ضوابط زمین",
        body: "ضوابط منطقه‌بندی شهرداری برای همان زمین، مثل عقب‌نشینی و حداکثر ارتفاع، جمع می‌شود و به محدودیت‌های طراحی تبدیل می‌شود.",
      },
      {
        title: "تولید ده‌ها گزینه",
        body: "یک اسکریپت طراحی پارامتریک در همان محدودیت‌ها ده‌ها حجم و چیدمان می‌سازد و هر کدام را از نظر متراژ، نور و هزینه امتیاز می‌دهد.",
      },
      {
        title: "رندر در چند سبک",
        body: "گزینه‌های برتر با مدل‌های تصویرساز به رندرهای واقعی‌نما تبدیل می‌شوند؛ مدرن، مینیمال یا گرم، به انتخاب شما.",
      },
      {
        title: "انتخاب و اصلاح",
        body: "شما گزینه‌های برتر را می‌بینید، یکی را انتخاب می‌کنید و با تجربه‌ی خودتان اصلاح می‌کنید. طراحی همچنان کار شماست؛ سیستم فقط نقطه‌ی شروع را جلو می‌آورد.",
        you: true,
      },
      {
        title: "بسته‌ی ارائه به کارفرما",
        body: "جدول مساحت‌ها، برآورد اولیه‌ی هزینه و فایل ارائه، خودکار از مدل نهایی ساخته می‌شود.",
      },
    ],
    tools: ["Rhino و Grasshopper", "Revit و Dynamo", "مدل‌های تصویرساز", "داده‌های باز شهرداری"],
    outputs: [],
  },
  {
    key: "immigration",
    label: "مشاور مهاجرت و دفتر حقوقی",
    icon: <Scale className="h-5 w-5" aria-hidden />,
    today:
      "هر پرونده ده‌ها مدرک دارد. بیشتر وقت صرف پیدا کردن مدرک جاافتاده، تطبیق تاریخ‌ها و پر کردن فرم‌های تکراری می‌شود.",
    outcome: "وقت شما صرف مشاوره و استراتژی پرونده می‌شود، نه دنبال کاغذ گشتن.",
    steps: [
      {
        title: "پرسش‌نامه‌ی هوشمند",
        body: "موکل به فارسی یا انگلیسی جواب می‌دهد و سؤال بعدی بر اساس جواب قبلی عوض می‌شود؛ نه یک فرم بیست‌صفحه‌ای.",
      },
      {
        title: "خواندن مدارک",
        body: "پاسپورت، مدرک تحصیلی و سوابق کاری خوانده، دسته‌بندی و با جواب‌های پرسش‌نامه تطبیق داده می‌شود.",
      },
      {
        title: "پیدا کردن کمبودها",
        body: "مدرک منقضی، تاریخ ناهمخوان یا ترجمه‌ی جاافتاده علامت می‌خورد و خودکار از موکل خواسته می‌شود.",
      },
      { title: "پیش‌نویس فرم‌ها و نامه‌ها", body: "فرم‌ها از روی پرونده پیش‌پر می‌شوند و پیش‌نویس نامه‌ها آماده است." },
      {
        title: "بازبینی و امضا",
        body: "شما پرونده را بررسی می‌کنید، استراتژی را تعیین می‌کنید و امضا می‌کنید. مسئولیت حرفه‌ای با شما می‌ماند.",
        you: true,
      },
      { title: "پیگیری مهلت‌ها", body: "مهلت‌ها و درخواست‌های اداره‌ی مهاجرت دنبال می‌شود و یادآوری به شما و موکل می‌رسد." },
    ],
    tools: ["پرسش‌نامه‌ی دوزبانه", "خواندن خودکار مدارک", "پرونده‌ی مشتری (CRM)", "تقویم مهلت‌ها"],
    outputs: ["پرونده‌ی مرتب و دسته‌بندی‌شده", "فهرست کمبودها", "فرم‌های پیش‌پرشده", "تقویم مهلت‌ها"],
  },
  {
    key: "accounting",
    label: "حسابداری و مالیات",
    icon: <Calculator className="h-5 w-5" aria-hidden />,
    today: "آخر ماه یک کیسه رسید کاغذی و چند صورت‌حساب بانکی می‌رسد که باید ردیف‌به‌ردیف دستی وارد شود.",
    outcome: "به‌جای صدها ردیف، فقط چند مورد مشکوک را نگاه می‌کنید و بقیه‌ی وقت را صرف مشاوره‌ی مالیاتی می‌کنید.",
    steps: [
      { title: "جمع کردن رسیدها", body: "مشتری از رسید عکس می‌گیرد یا ایمیل فاکتور را فوروارد می‌کند؛ همین." },
      {
        title: "خواندن و دسته‌بندی",
        body: "مبلغ، تاریخ، فروشنده و مالیات بر فروش (HST) خوانده می‌شود و هر رسید در دسته‌ی درست ثبت می‌شود.",
      },
      { title: "تطبیق با بانک", body: "هر تراکنش بانکی با رسید خودش جفت می‌شود." },
      { title: "علامت زدن موارد عجیب", body: "تراکنش تکراری، مبلغ غیرعادی یا رسید گمشده جدا می‌شود." },
      { title: "بررسی موارد علامت‌دار", body: "شما فقط همین چند مورد را بررسی و تصمیم‌گیری می‌کنید.", you: true },
      { title: "گزارش برای مشتری", body: "خلاصه‌ی ماهانه به زبان ساده برای مشتری فرستاده می‌شود؛ فارسی یا انگلیسی." },
    ],
    tools: ["خواندن خودکار رسید", "اتصال به نرم‌افزار حسابداری", "اتصال به بانک", "گزارش خودکار"],
    outputs: ["رسیدهای دسته‌بندی‌شده", "تطبیق بانکی", "فهرست موارد مشکوک", "گزارش ماهانه‌ی مشتری"],
  },
  {
    key: "clinic",
    label: "کلینیک دندانپزشکی و سلامت",
    icon: <Stethoscope className="h-5 w-5" aria-hidden />,
    today: "پزشک بعد از ساعت کاری می‌نشیند و یادداشت پرونده می‌نویسد، و منشی نصف روز پشت تلفن است.",
    outcome: "پزشک وقت بیشتری برای بیمار دارد و کارهای اداری بعد از ساعت کاری کم می‌شود.",
    steps: [
      { title: "نوبت و یادآوری", body: "بیمار آنلاین نوبت می‌گیرد و پیامک یادآوری خودکار می‌رود." },
      { title: "فرم پذیرش", body: "بیمار پیش از آمدن فرم را روی گوشی پر می‌کند و اطلاعات مستقیم به پرونده می‌رود." },
      {
        title: "یادداشت‌نویس هوشمند",
        body: "با رضایت بیمار، گفت‌وگوی معاینه به پیش‌نویس یادداشت بالینی تبدیل می‌شود.",
      },
      { title: "تأیید یادداشت", body: "شما پیش‌نویس را می‌خوانید، اصلاح و تأیید می‌کنید. تشخیص با شماست.", you: true },
      { title: "کارهای بیمه", body: "فرم‌های بیمه از روی پرونده پر می‌شود." },
      { title: "فراخوان دوره‌ای", body: "بیمارانی که وقت چکاپشان رسیده خودکار دعوت می‌شوند." },
    ],
    tools: ["نوبت‌دهی آنلاین", "یادداشت‌نویس صوتی", "فرم پذیرش دیجیتال", "پیامک خودکار"],
    outputs: ["تقویم پر", "پرونده‌ی کامل پیش از ورود بیمار", "یادداشت بالینی آماده‌ی تأیید", "فهرست فراخوان"],
    note: "اطلاعات سلامت در انتاریو تابع قانون PHIPA است و ابزارها با همین محدودیت انتخاب می‌شوند.",
  },
  {
    key: "construction",
    label: "پیمانکاری و ساختمان",
    icon: <HardHat className="h-5 w-5" aria-hidden />,
    today: "برآورد قیمت هر پروژه شب‌ها با نقشه‌ی PDF و ماشین‌حساب انجام می‌شود، و خیلی از پیش‌فاکتورها بی‌جواب می‌مانند.",
    outcome: "پیش‌فاکتور سریع‌تر به دست کارفرما می‌رسد و هیچ پیشنهادی بی‌پیگیری نمی‌ماند.",
    steps: [
      { title: "دریافت نقشه و عکس", body: "کارفرما نقشه و عکس محل را از طریق یک فرم می‌فرستد." },
      { title: "برآورد مقادیر", body: "متراژ دیوار، کف و مصالح از روی نقشه برآورد می‌شود." },
      { title: "قیمت روز مصالح", body: "قیمت‌ها از فهرست تأمین‌کننده‌های خودتان خوانده می‌شود." },
      {
        title: "تنظیم و تأیید پیش‌فاکتور",
        body: "شما سود، ریسک و جزئیات اجرایی را تنظیم می‌کنید؛ عددهای نهایی را شما می‌دهید.",
        you: true,
      },
      { title: "ارسال و پیگیری", body: "پیش‌فاکتور مرتب برای کارفرما می‌رود و اگر جواب نداد، پیگیری می‌شود." },
      { title: "گزارش روزانه از کارگاه", body: "یک پیام صوتی سر کار به گزارش مرتب با عکس برای کارفرما تبدیل می‌شود." },
    ],
    tools: ["خواندن نقشه‌ی PDF", "فهرست قیمت تأمین‌کننده", "پیش‌فاکتور خودکار", "گزارش صوتی"],
    outputs: ["برآورد مقادیر", "پیش‌فاکتور آماده", "یادآوری پیگیری", "گزارش روزانه برای کارفرما"],
  },
  {
    key: "realestate",
    label: "مشاور املاک",
    icon: <House className="h-5 w-5" aria-hidden />,
    today:
      "هر ملک تازه یعنی ساعت‌ها نوشتن آگهی، آماده کردن عکس و پست، و جواب دادن به ده‌ها پیامی که بیشترشان از خریدار جدی نیست.",
    outcome: "آگهی زودتر و بهتر منتشر می‌شود و وقت شما صرف خریدارهای جدی و مذاکره می‌شود، نه جواب دادن به «قیمتش چنده؟».",
    steps: [
      {
        title: "از عکس تا آگهی",
        body: "عکس‌ها و مشخصات ملک را می‌دهید؛ متن آگهی به فارسی و انگلیسی نوشته می‌شود و نکته‌های مهم محله هم در آن می‌آید.",
      },
      {
        title: "چیدمان مجازی",
        body: "از عکس اتاق خالی، تصویر همان اتاق با مبلمان ساخته می‌شود تا خریدار فضا را تصور کند. هر تصویر برچسب «چیدمان مجازی» می‌خورد.",
      },
      {
        title: "انتشار همه‌جا",
        body: "پست اینستاگرام، ویدئوی کوتاه و ایمیل برای خریدارانی که دنبال همین نوع ملک بودند، آماده و منتشر می‌شود.",
      },
      {
        title: "غربال پیام‌ها",
        body: "دستیار به سؤال‌های اولیه جواب می‌دهد و بودجه، زمان خرید و وضعیت تأیید وام را می‌پرسد.",
      },
      {
        title: "گفت‌وگو با خریدار جدی",
        body: "فقط خریدارهای جدی، با خلاصه‌ی کامل گفت‌وگو، به شما می‌رسند. بازدید و مذاکره کار شماست.",
        you: true,
      },
      {
        title: "پیگیری بلندمدت",
        body: "خریداری که امروز آماده نیست، ماه‌ها بعد وقتی ملک مناسبش آمد دوباره پیگیری می‌شود.",
      },
    ],
    tools: ["نویسنده‌ی دوزبانه", "مدل‌های تصویرساز", "فهرست مشتری‌ها (CRM)", "زمان‌بندی انتشار"],
    outputs: ["آگهی فارسی و انگلیسی", "تصاویر چیدمان مجازی", "پست و ویدئوی کوتاه", "فهرست خریداران جدی"],
  },
  {
    key: "content",
    label: "تولید محتوا و بازاریابی",
    icon: <Clapperboard className="h-5 w-5" aria-hidden />,
    today: "یک ویدئو ضبط می‌کنید و بعد هفته‌ها وقت ندارید از آن پست، کپشن، مقاله و ایمیل دربیاورید.",
    outcome: "یک بار حرف می‌زنید و محتوای یک هفته، در دو زبان، آماده‌ی بازبینی است.",
    steps: [
      { title: "یک ویدئو یا فایل صوتی", body: "شما فقط یک بار درباره‌ی موضوعی که بلدید حرف می‌زنید." },
      { title: "متن و خلاصه", body: "حرف‌ها به متن تبدیل و نکته‌های اصلی بیرون کشیده می‌شود." },
      { title: "تکه‌های کوتاه", body: "بهترین لحظه‌ها برای ریلز و استوری جدا می‌شود." },
      { title: "نسخه‌های فارسی و انگلیسی", body: "پست، کپشن، مقاله و خبرنامه در هر دو زبان نوشته می‌شود." },
      { title: "بازبینی لحن و ادعاها", body: "شما می‌خوانید و مطمئن می‌شوید حرف خودتان است.", you: true },
      { title: "انتشار زمان‌بندی‌شده", body: "هر تکه در زمان مناسب در شبکه‌ی مناسب منتشر می‌شود." },
    ],
    tools: ["تبدیل صدا به متن", "مدل‌های زبانی", "زمان‌بندی انتشار", "خبرنامه‌ی ایمیلی"],
    outputs: ["مقاله", "کپشن‌های فارسی و انگلیسی", "تکه‌های ویدئوی کوتاه", "خبرنامه"],
    note: "نسخه‌ای از همین سیستم را برای سایت خودم ساخته‌ام و هر روز با آن کار می‌کنم.",
  },
]

const STEP_MS = 3000

export function IndustryFlows() {
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const ind = INDUSTRIES[idx]

  useEffect(() => {
    if (reduce || paused) return
    const t = setInterval(() => setStep((s) => (s + 1) % ind.steps.length), STEP_MS)
    return () => clearInterval(t)
  }, [reduce, paused, ind.steps.length])

  const pick = (i: number) => {
    setIdx(i)
    setStep(0)
    setPaused(false)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* industry picker */}
      <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        <div className="flex w-max gap-2 md:w-auto md:flex-wrap">
          {INDUSTRIES.map((it, i) => (
            <button
              key={it.key}
              onClick={() => pick(i)}
              aria-pressed={i === idx}
              className={`relative inline-flex min-h-12 items-center gap-2.5 rounded-full border px-5 text-base transition-colors ${
                i === idx ? "border-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-bone/40 hover:text-v3-bone"
              }`}
            >
              {i === idx && (
                <motion.span
                  layoutId="industry-pill"
                  className="absolute inset-0 rounded-full bg-v3-light"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2.5 whitespace-nowrap">
                {it.icon}
                {it.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={ind.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 lg:grid-cols-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* today → pipeline */}
          <div className="flex flex-col gap-6 rounded-3xl border border-v3-line bg-v3-raise p-6 md:p-8 lg:col-span-7">
            <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-v3-line p-5">
              <span className="text-sm text-v3-mute">امروز چه می‌گذرد</span>
              <p className="leading-loose text-v3-soft">{ind.today}</p>
            </div>

            <ol className="flex flex-col">
              {ind.steps.map((s, i) => {
                const on = reduce || i <= step
                const current = !reduce && i === step
                const last = i === ind.steps.length - 1
                return (
                  <li key={s.title} className="relative pb-3 last:pb-0">
                    {!last && (
                      <span aria-hidden className="absolute bottom-0 start-5 top-11 w-px bg-v3-line">
                        <motion.span
                          className="absolute inset-0 origin-top bg-v3-light"
                          initial={false}
                          animate={{ scaleY: reduce || i < step ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setStep(i)
                        setPaused(true)
                      }}
                      aria-expanded={current}
                      className="flex w-full items-start gap-4 text-start"
                    >
                      <motion.span
                        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border ${
                          s.you ? "rounded-xl" : ""
                        }`}
                        animate={{
                          borderColor: on ? (s.you ? "#ede8df" : "rgba(232,196,138,0.9)") : "#33302c",
                          backgroundColor: current ? (s.you ? "#ede8df" : "#e8c48a") : "#141312",
                          color: current ? "#141312" : on ? (s.you ? "#ede8df" : "#e8c48a") : "#a39c90",
                          scale: current ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.35 }}
                      >
                        {s.you ? <UserRound className="h-4 w-4" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
                      </motion.span>
                      <span className="flex flex-1 flex-col gap-1 pt-1.5">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className={`text-lg ${on ? "text-v3-bone" : "text-v3-mute"}`}>{s.title}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] ${
                              s.you ? "bg-v3-bone text-v3-ink" : "border border-v3-light/40 text-v3-light"
                            }`}
                          >
                            {s.you ? "کار شما" : "خودکار"}
                          </span>
                        </span>
                        <AnimatePresence initial={false}>
                          {(current || reduce) && (
                            <motion.span
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35 }}
                              className="block overflow-hidden leading-loose text-v3-soft"
                            >
                              {s.body}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* what comes out */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-3xl border border-v3-light/50 bg-v3-raise p-6 shadow-[0_0_80px_-30px_rgba(232,196,138,0.45)] md:p-8">
              {ind.key === "architect" ? <MassingOptions step={step} /> : <Outputs items={ind.outputs} />}
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-v3-line p-6 md:p-8">
              <span className="text-sm text-v3-light">نتیجه</span>
              <p className="text-lg leading-loose text-v3-bone">{ind.outcome}</p>
              {ind.note && <p className="text-sm leading-loose text-v3-mute">{ind.note}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                {ind.tools.map((t) => (
                  <span key={t} className="rounded-full border border-v3-line px-3 py-1 text-xs text-v3-soft">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── Output pictures ─────────────────────────────────────────────────── */

// Nine massing studies, each three blocks of different heights (in steps of 12%).
const MASSES = [
  [60, 84, 48],
  [36, 72, 96],
  [84, 60, 60],
  [48, 96, 36],
  [72, 48, 84],
  [96, 72, 48],
  [60, 36, 72],
  [84, 96, 60],
  [36, 60, 84],
]
const PICK = 4

/** Architect: design options generate, get scored, and one is chosen. */
function MassingOptions({ step }: { step: number }) {
  const reduce = useReducedMotion()
  const generating = !reduce && step === 2
  const chosen = reduce || step >= 4
  return (
    <div className="flex flex-col gap-4" role="img" aria-label="نه گزینه‌ی حجم ساختمان که ساخته و امتیازدهی می‌شوند و یکی انتخاب می‌شود">
      <div className="flex items-baseline justify-between">
        <span className="text-v3-bone">گزینه‌های طراحی</span>
        <span className="text-xs text-v3-mute">{chosen ? "یکی را شما انتخاب کردید" : generating ? "در حال ساخت…" : "همه در محدوده‌ی ضوابط"}</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {MASSES.map((m, i) => {
          const picked = chosen && i === PICK
          return (
            <motion.div
              key={i}
              className={`relative flex aspect-square items-end justify-center gap-1 overflow-hidden rounded-xl border p-2 ${
                picked ? "border-v3-light bg-v3-light/10" : "border-v3-line bg-v3-ink/60"
              }`}
              animate={{ opacity: chosen && !picked ? 0.35 : 1, scale: picked ? 1.04 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <span aria-hidden className="absolute inset-x-2 bottom-2 h-px bg-v3-line" />
              {m.map((h, j) => (
                <motion.span
                  key={j}
                  className={`w-1/4 rounded-t-sm ${picked ? "bg-v3-light" : "bg-v3-soft/60"}`}
                  initial={false}
                  animate={{
                    height: generating ? [`${h}%`, `${MASSES[(i + 3) % 9][j]}%`, `${h}%`] : `${h}%`,
                  }}
                  transition={{ duration: 1.2, repeat: generating ? Infinity : 0, delay: (i + j) * 0.05 }}
                />
              ))}
              <span className="absolute top-1.5 start-2 text-[10px] text-v3-mute">{localDigits(60 + ((i * 7) % 38), "fa")}</span>
            </motion.div>
          )
        })}
      </div>
      <p className="text-xs leading-loose text-v3-mute">عدد گوشه‌ی هر کارت، امتیاز آن گزینه از نظر متراژ، نور و هزینه است.</p>
    </div>
  )
}

/** Everyone else: the finished pieces the pipeline hands over. */
function Outputs({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-v3-bone">چیزی که تحویل می‌گیرید</span>
      <ul className="flex flex-col gap-2.5">
        {items.map((it, i) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
            className="flex items-center gap-3 rounded-xl border border-v3-line bg-v3-ink/60 px-4 py-3 text-v3-bone"
          >
            <FileCheck2 className="h-4 w-4 shrink-0 text-v3-light" aria-hidden />
            {it}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
