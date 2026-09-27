// ============================================================================
// File Path: src/components/v3/pages/intro-fa.tsx
// Why: /fa/intro — a plain-language introduction for Persian speakers in
//      Canada who run, or want to run, a small business and have no idea
//      what "web design", "custom software" or "AI automation" would do for
//      them. The focus is those three services; mentoring is left out on
//      purpose. Persian only: it is a page to send to someone.
//
//      Every idea is shown before it is named: a chat that books a haircut
//      at 11pm, an automation run for the reader's own trade, a before/after
//      site, a time calculator with the reader's numbers, and six
//      professions' end-to-end automations with the human step marked.
//
//      Copy rules: no jargon without its everyday meaning; only Farjad's own
//      projects under "built myself"; no promise about price, timelines or
//      results that the rest of the site does not make.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import { ArrowUpLeft } from "lucide-react"
import {
  CountUp,
  CtaBand,
  Headline,
  PageHero,
  Reveal,
  Section,
  V3Button,
  V3Faq,
  V3Page,
} from "@/components/v3/kit"
import { HeroChat } from "@/components/v3/intro/hero-chat"
import { ServiceTabs } from "@/components/v3/intro/service-tabs"
import { AutomationPicker } from "@/components/v3/intro/automation-picker"
import { BeforeAfter } from "@/components/v3/intro/before-after"
import { TimeCalculator } from "@/components/v3/intro/time-calculator"
import { IndustryFlows } from "@/components/v3/intro/industry-flows"
import { FlipGlossary } from "@/components/v3/intro/flip-glossary"

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-v3-bone">{children}</strong>

const SITE_GAINS = [
  { title: "روی گوشی درست دیده می‌شود", body: "بیشتر مشتری‌ها با گوشی می‌آیند. اگر متن ریز باشد و دکمه‌ها گم، می‌روند." },
  { title: "مشتری می‌داند چه کند", body: "یک دکمه‌ی روشن: سفارش، رزرو یا تماس. نه شش منو و یک اطلاعیه‌ی قرمز." },
  { title: "اعتماد می‌سازد", body: "نظر مشتری‌ها، ساعت کاری درست و ظاهری که نشان می‌دهد این کسب‌وکار زنده است." },
  { title: "در گوگل پیدا می‌شود", body: "ساختار درست باعث می‌شود وقتی کسی در محله‌ی شما جست‌وجو می‌کند، شما را ببیند." },
]

const BUILT = [
  {
    title: "همین سایتی که در آن هستید",
    body: "سایت دوزبانه‌ی فارسی و انگلیسی، با یک سیستم هوش مصنوعی که موضوع‌های روز را پیدا می‌کند و پیش‌نویس محتوا آماده می‌کند، و سیستم ایمیل‌مارکتینگ مخصوص خودش.",
    tag: "طراحی سایت · اتوماسیون",
    href: "https://github.com/farjadp/officialwebsite",
  },
  {
    title: "پورتال‌های سازمانی",
    body: "از ۲۰۱۰ تا ۲۰۱۵ در VaniaIT، پورتال‌های وب چند شرکت بزرگ ایرانی را طراحی و برنامه‌نویسی کردم.",
    tag: "برنامه‌نویسی",
  },
  {
    title: "زیرساخت ابری دولتی",
    body: "مدیر ارشد فنی نخستین شرکت رایانش ابری دولتی ایران بودم، از ۲۰۱۷ تا ۲۰۲۰. یعنی سرورهایی که سازمان‌های بزرگ رویشان کار می‌کردند.",
    tag: "زیرساخت",
  },
  {
    title: "ایجنت ساخت دوره‌ی آموزشی",
    body: "چند ایجنت هوش مصنوعی که با هم کار می‌کنند تا از یک موضوع، یک دوره‌ی آموزشی کامل بسازند.",
    tag: "هوش مصنوعی",
    href: "https://github.com/farjadp/course-creation-agent",
  },
  {
    title: "اپلیکیشن آیفون تقویم پارسی",
    body: "اپلیکیشن بومی iOS که تقویم جلالی و زرتشتی را به گوشی‌های امروزی می‌آورد.",
    tag: "اپلیکیشن موبایل",
    href: "https://github.com/farjadp/parscalendar",
  },
  {
    title: "داشبورد بیماران iMedica",
    body: "پنلی امن برای اینکه کلینیک پرونده و نوبت بیماران را یک‌جا مدیریت کند.",
    tag: "برنامه‌نویسی",
  },
]

const STEPS = [
  { n: "۱", title: "گفت‌وگو", body: "شما می‌گویید کجای کار وقتتان را می‌گیرد یا مشتری از دست می‌رود. لازم نیست اصطلاح فنی بلد باشید." },
  { n: "۲", title: "نقشه", body: "پیشنهاد می‌دهم چه چیزی ساخته شود و، به همان اندازه مهم، چه چیزی لازم نیست." },
  { n: "۳", title: "ساخت", body: "قدم‌به‌قدم می‌سازم و در طول کار نشانتان می‌دهم، تا چیزی که تحویل می‌گیرید غافلگیرتان نکند." },
  { n: "۴", title: "تحویل و آموزش", body: "یاد می‌گیرید خودتان با آن کار کنید. ابزاری که فقط سازنده‌اش بلد باشد، ابزار خوبی نیست." },
]

const FAQ = [
  {
    q: "باید چیزی از کامپیوتر و برنامه‌نویسی بلد باشم؟",
    a: "نه. کافی است کار خودتان را بشناسید. بخش فنی با من است، و هر چیزی را که لازم باشد بدانید به زبان ساده توضیح می‌دهم.",
  },
  {
    q: "کسب‌وکارم کوچک است. این کارها برای شرکت‌های بزرگ نیست؟",
    a: "برعکس. در یک کسب‌وکار کوچک، صاحب کار همه‌کاره است، پس هر ساعتی که از کار تکراری آزاد شود مستقیم به خود کار برمی‌گردد. خیلی از ابزارهایی که ده سال پیش فقط برای شرکت‌های بزرگ بود، امروز برای یک آرایشگاه هم در دسترس است.",
  },
  {
    q: "هوش مصنوعی اطلاعات مشتری‌های من را جایی می‌فرستد؟",
    a: (
      <>
        بستگی به ابزار و تنظیمات آن دارد، و همین را پیش از شروع روشن می‌کنم. من <B>ممیز ارشد ISO 27001</B> هستم، یعنی
        استاندارد بین‌المللی امنیت اطلاعات کار هر روزم است. جایی که اطلاعات حساس است، ابزاری انتخاب می‌کنیم که داده را
        نگه ندارد یا روی سرور خودتان کار کند.
      </>
    ),
  },
  {
    q: "سایت فارسی می‌سازید یا انگلیسی؟",
    a: "هر دو. همین سایت دو زبان دارد. در کانادا معمولاً نسخه‌ی انگلیسی لازم است، و نسخه‌ی فارسی برای مشتری‌های فارسی‌زبانتان.",
  },
  {
    q: "هزینه‌اش چقدر است؟",
    a: "به اندازه‌ی کار بستگی دارد؛ یک چت‌بات ساده با یک سامانه‌ی کامل فرق دارد. در گفت‌وگوی اول می‌گویم چه چیزی لازم است و چه چیزی نه، و پیش از هر تعهدی درباره‌ی هزینه حرف می‌زنیم.",
  },
  {
    q: "هوش مصنوعی جای کارمندهای من را می‌گیرد؟",
    a: "معمولاً نه. کارهای خسته‌کننده را برمی‌دارد تا آدم‌ها به کارهای مهم‌تر برسند. جایی هم که به کار شما نمی‌آید، همین را صادقانه می‌گویم.",
  },
  {
    q: "باید انگلیسی بلد باشم؟",
    a: "نه. از اول تا آخر می‌توانیم فارسی حرف بزنیم.",
  },
]

export function IntroFaPage() {
  return (
    <V3Page>
      {/* ── Hero: the idea, shown ────────────────────────────────────── */}
      <PageHero
        kicker="سلام، من فرجادم."
        title="سایت، نرم‌افزار"
        accent="و هوش مصنوعی، برای کار شما."
        lead="برای کسب‌وکارهای کوچک و متوسط در کانادا سایت می‌سازم، نرم‌افزار می‌نویسم و کارهای تکراری را به هوش مصنوعی می‌سپارم؛ به زبان ساده و بی‌تعارف. ۲۲ سال است این کار را می‌کنم. همین‌جا ببینید یک مشتری ساعت ۱۱ شب چطور وقت می‌گیرد، بدون اینکه صاحب سالن بیدار باشد."
        actions={
          <>
            <V3Button href="/fa/booking" locale="fa">
              رزرو یک گفت‌وگو
            </V3Button>
            <V3Button href="#simple" locale="fa" variant="quiet">
              ببینید چه کاری از دستم برمی‌آید
            </V3Button>
          </>
        }
        aside={
          <div className="pb-12">
            <HeroChat />
          </div>
        }
      />

      {/* ── Three services ───────────────────────────────────────────── */}
      <Section
        id="simple"
        kicker="به زبان ساده"
        title="سه کار انجام می‌دهم."
        accent="هر سه برای اینکه مشتری بیشتر و دردسر کمتر داشته باشید."
      >
        <ServiceTabs />
      </Section>

      {/* ── Automation, on your own trade ────────────────────────────── */}
      <Section
        kicker="اتوماسیون یعنی چه؟"
        title="روی کار خودتان"
        accent="ببینید."
        lead="کار خودتان را انتخاب کنید و ببینید یک کار روزمره چطور خودش انجام می‌شود. روی هر مرحله بزنید تا همان‌جا بایستد."
      >
        <AutomationPicker />
      </Section>

      {/* ── Serious systems, by profession ────────────────────────── */}
      <Section
        kicker="اتوماسیون‌های پیچیده‌تر"
        title="برای متخصص‌ها: سیستم کار سنگین را می‌کند،"
        accent="تصمیم با شما می‌ماند."
        lead={
          <>
            حرفه‌ی خودتان را انتخاب کنید. مرحله‌های <B>خودکار</B> را سیستم انجام می‌دهد و مرحله‌ای که <B>کار شما</B> است،
            همان‌جایی است که تجربه‌تان لازم است. این‌ها طرح سیستم‌هایی است که می‌شود ساخت، نه گزارش پروژه‌های گذشته؛ جزئیات
            هر کدام به ابزار و روش کار خود شما بستگی دارد.
          </>
        }
      >
        <IndustryFlows />
      </Section>

      {/* ── What design changes ──────────────────────────────────────── */}
      <Section kicker="طراحی سایت" title="یک سایت خوب" accent="چه فرقی می‌کند؟">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <BeforeAfter />
          </Reveal>
          <ul className="flex flex-col gap-6 lg:col-span-5">
            {SITE_GAINS.map((g, i) => (
              <li key={g.title}>
                <Reveal delay={i * 0.08} className="flex flex-col gap-2 border-s-2 border-v3-light/60 ps-5">
                  <span className="text-xl text-v3-bone">{g.title}</span>
                  <span className="leading-loose text-v3-soft">{g.body}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Your time, in your numbers ───────────────────────────────── */}
      <Section
        kicker="حساب کنید"
        title="کارهای تکراری"
        accent="سالی چقدر از وقت شما را می‌گیرد؟"
        lead="با عددهای خودتان امتحان کنید. همه‌چیز همین‌جا در مرورگر شما حساب می‌شود و جایی ذخیره نمی‌شود."
      >
        <TimeCalculator />
      </Section>

      {/* ── Built myself ─────────────────────────────────────────────── */}
      <Section kicker="کارهای خودم" title="این‌ها را" accent="خودم ساخته‌ام.">
        <div className="mb-14 grid gap-5 sm:grid-cols-3">
          <Reveal>
            <div className="flex flex-col gap-3 border-t border-v3-light/40 pt-6">
              <CountUp to={22} suffix="+" locale="fa" className="font-v3-display text-6xl font-light text-v3-light" />
              <p className="text-lg leading-loose text-v3-soft">سال ساختن نرم‌افزار و شرکت، در ایران و کانادا</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-3 border-t border-v3-light/40 pt-6">
              <span className="font-v3-display text-4xl font-light leading-tight text-v3-light">مهندسی نرم‌افزار</span>
              <p className="text-lg leading-loose text-v3-soft">کارشناسی ارشد؛ برنامه‌نویسی کار اصلی من بوده، نه سرگرمی</p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="flex flex-col gap-3 border-t border-v3-light/40 pt-6">
              <span className="font-v3-display text-4xl font-light leading-tight text-v3-light" dir="ltr">
                ISO 27001
              </span>
              <p className="text-lg leading-loose text-v3-soft">ممیز ارشد امنیت اطلاعات؛ یعنی اطلاعات مشتری‌های شما را جدی می‌گیرم</p>
            </div>
          </Reveal>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BUILT.map((b, i) => {
            const inner = (
              <>
                <span className="text-sm text-v3-light">{b.tag}</span>
                <Headline as="h3" size="card">
                  {b.title}
                </Headline>
                <p className="text-lg leading-loose text-v3-soft">{b.body}</p>
                {b.href && (
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm text-v3-mute transition-colors group-hover:text-v3-light">
                    کدش را ببینید
                    <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                )}
              </>
            )
            const cls =
              "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-v3-line p-7 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise md:p-8"
            return (
              <li key={b.title} className="h-full">
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  {b.href ? (
                    <a href={b.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* ── Words ────────────────────────────────────────────────────── */}
      <Section
        kicker="واژه‌نامه‌ی کوچک"
        title="چند کلمه که"
        accent="زیاد می‌شنوید."
        lead="روی هر کارت بزنید تا معنی ساده‌اش را ببینید."
      >
        <FlipGlossary />
      </Section>

      {/* ── How it goes ──────────────────────────────────────────────── */}
      <Section kicker="روند کار" title="از اولین گفت‌وگو" accent="تا چیزی که کار می‌کند.">
        <ol className="relative grid gap-5 md:grid-cols-4">
          <span aria-hidden className="absolute inset-x-0 top-7 hidden h-px bg-linear-to-l from-v3-light/70 via-v3-line to-transparent md:block" />
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative h-full">
              <Reveal delay={i * 0.1} className="flex h-full flex-col gap-4">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-v3-light/70 bg-v3-ink font-v3-display text-2xl text-v3-light">
                  {s.n}
                </span>
                <h3 className="text-2xl text-v3-bone">{s.title}</h3>
                <p className="text-lg leading-loose text-v3-soft">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Questions ────────────────────────────────────────────────── */}
      <Section kicker="سؤال‌های رایج" title="چیزهایی که" accent="معمولاً می‌پرسند.">
        <V3Faq items={FAQ} />
      </Section>

      <CtaBand
        title="بگویید کجای کار وقتتان را می‌گیرد."
        accent="با هم ببینیم چه چیزی را می‌شود به نرم‌افزار سپرد."
        body="اگر این صفحه به درد کسی می‌خورد که می‌شناسید، برایش بفرستید."
        action={
          <div className="flex flex-wrap gap-3">
            <V3Button href="/fa/booking" locale="fa">
              رزرو یک گفت‌وگو
            </V3Button>
            <V3Button href="/fa/contact" locale="fa" variant="secondary">
              پیام بدهید
            </V3Button>
          </div>
        }
      />
    </V3Page>
  )
}
