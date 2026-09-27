// ============================================================================
// File Path: src/components/v3/pages/intro-fa.tsx
// Why: /fa/intro — a plain-language introduction for Persian speakers in
//      Canada who have never heard words like "mentor", "accelerator" or "AI
//      strategy" and so cannot tell whether Farjad's work is for them. The
//      rest of the site speaks to founders; this page speaks to a hairdresser,
//      a contractor or a newcomer with an idea. Persian only, by design: it
//      is a page to send to someone, not a translation of an English page.
//
//      Copy rules: no jargon without a translation into everyday words;
//      figures only from Farjad's own numbers (the combined $10M is never
//      stated without naming the service grants); no promise about price,
//      visas or outcomes that the booking and services pages do not make.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import Image from "next/image"
import {
  Card,
  Checklist,
  Chip,
  CountUp,
  CtaBand,
  Headline,
  Kicker,
  LightRule,
  PageHero,
  Reveal,
  Section,
  V3Button,
  V3Faq,
  V3Page,
} from "@/components/v3/kit"

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-v3-bone">{children}</strong>
)

const HELPS = [
  {
    kicker: "اگر ایده دارید",
    title: "ولی مطمئن نیستید جواب می‌دهد",
    body: "قبل از اینکه پس‌اندازتان را خرج کنید، با هم می‌سنجیم که آیا کسی واقعاً حاضر است برای این ایده پول بدهد. این کار چند هفته طول می‌کشد، نه چند سال.",
    result: "یا با خیال راحت جلو می‌روید، یا پولتان را نجات داده‌اید.",
  },
  {
    kicker: "اگر کسب‌وکار دارید",
    title: "ولی وقت سر خاراندن ندارید",
    body: "خیلی از کارهای تکراری، مثل جواب دادن به پیام مشتری، نوشتن فاکتور یا مرتب کردن اطلاعات، امروز با ابزارهای هوش مصنوعی خودکار می‌شوند. می‌گویم کدامش برای کار شما می‌ارزد و کدامش فقط خرج اضافه است.",
    result: "ساعت‌های بیشتر برای خودِ کار، و هزینه‌ی کمتر.",
  },
  {
    kicker: "اگر سر یک تصمیم مانده‌اید",
    title: "و کسی را ندارید که رک بگوید",
    body: "استخدام کنم یا نه؟ این مشتری را نگه دارم؟ برای استارتاپ ویزا اقدام کنم؟ وقتی اطرافتان کسی نیست که بی‌تعارف نظر بدهد، من هستم.",
    result: "تصمیمی که پشتش دلیل است، نه دلشوره.",
  },
]

const SOUNDS_LIKE_YOU = [
  "«یک ایده دارم، ولی نمی‌دانم از کجا شروع کنم.»",
  "«تازه به کانادا آمده‌ام و نمی‌دانم اینجا کسب‌وکار چطور کار می‌کند.»",
  "«کار خودم را دارم، ولی از صبح تا شب درگیر کارهای تکراری‌ام.»",
  "«همه از هوش مصنوعی حرف می‌زنند، ولی نمی‌دانم به کار من چه ربطی دارد.»",
  "«درباره‌ی استارتاپ ویزا حرف‌های ضدونقیض زیادی شنیده‌ام.»",
  "«کسی را ندارم که صادقانه بگوید دارم درست می‌روم یا نه.»",
]

const NOT_FOR_YOU = [
  "دنبال کسی هستید که فقط بگوید ایده‌تان عالی است.",
  "دنبال راه میان‌بری برای اقامت هستید، بدون ساختن یک کسب‌وکار واقعی.",
  "انتظار دارید کس دیگری کار را به جای شما انجام دهد.",
]

const WORDS = [
  {
    term: "استارتاپ",
    en: "Startup",
    body: "کسب‌وکار تازه‌ای که می‌خواهد سریع بزرگ شود، معمولاً با کمک فناوری. هر کسب‌وکار تازه‌ای استارتاپ نیست؛ یک نانوایی خوب هم کسب‌وکار ارزشمندی است، و من با آن هم کار می‌کنم.",
  },
  {
    term: "منتور",
    en: "Mentor",
    body: "کسی که قبلاً این راه را رفته و تجربه‌اش را در اختیار شما می‌گذارد. کار را به جای شما انجام نمی‌دهد، ولی نمی‌گذارد در چاله‌هایی بیفتید که خودش افتاده.",
  },
  {
    term: "هوش مصنوعی",
    en: "AI",
    body: "نرم‌افزارهایی مثل ChatGPT که می‌نویسند، خلاصه می‌کنند، جواب می‌دهند و کارهای تکراری را انجام می‌دهند. ابزار است، نه جادو؛ جایی به کار می‌آید و جایی نه.",
  },
  {
    term: "شتاب‌دهنده",
    en: "Accelerator",
    body: "برنامه‌ای چندماهه که به کسب‌وکارهای تازه آموزش، ارتباط و گاهی سرمایه می‌دهد. من با حدود ۲۰ برنامه‌ی این‌چنینی کار کرده‌ام و تیم‌ها را برای ورود به آن‌ها آماده کرده‌ام.",
  },
  {
    term: "استارتاپ ویزا",
    en: "Start-up Visa",
    body: "برنامه‌ی دولت کانادا برای کارآفرینانی که کسب‌وکاری نوآورانه می‌سازند. راهی به اقامت است، ولی فقط وقتی پشتش یک کسب‌وکار واقعی باشد.",
  },
  {
    term: "گرنت",
    en: "Grant",
    body: "کمکی که لازم نیست پس داده شود. گاهی پول نقد است و گاهی خدمات رایگان، مثل سرور و نرم‌افزار یا مشاوره.",
  },
]

const STEPS = [
  {
    n: "۱",
    title: "یک وقت رزرو می‌کنید",
    body: "از صفحه‌ی رزرو، زمانی را که برایتان مناسب است انتخاب می‌کنید. جلسه آنلاین است و می‌توانیم فارسی حرف بزنیم.",
  },
  {
    n: "۲",
    title: "حرف می‌زنیم",
    body: "۶۰ تا ۹۰ دقیقه. شما از وضعیتتان می‌گویید و من سؤال می‌پرسم. لازم نیست اصطلاح تخصصی بلد باشید؛ همین که بدانید کجا گیر کرده‌اید کافی است.",
  },
  {
    n: "۳",
    title: "با یک قدم مشخص بیرون می‌روید",
    body: "آخر جلسه می‌دانید کار بعدی چیست. اگر همراهی بیشتری لازم بود، با هم تصمیم می‌گیریم. اگر نه، همان یک جلسه کافی است.",
  },
]

const CREDENTIALS = [
  "دکتری انسان‌شناسی",
  "کارشناسی ارشد مهندسی نرم‌افزار",
  "ممیز ارشد ISO 27001 (استاندارد امنیت اطلاعات)",
  "دانشکده‌ی کسب‌وکار شولیک، دانشگاه یورک",
]

const FAQ = [
  {
    q: "باید انگلیسی بلد باشم؟",
    a: "نه. می‌توانیم از اول تا آخر فارسی حرف بزنیم.",
  },
  {
    q: "من استارتاپ ندارم، یک کسب‌وکار معمولی دارم. به درد من هم می‌خورد؟",
    a: "بله. آرایشگاه، شرکت ساختمانی، دفتر حسابداری یا فروشگاه اینترنتی؛ سؤال‌های اصلی یکی است: مشتری از کجا می‌آید، وقت کجا هدر می‌رود و قدم بعدی چیست.",
  },
  {
    q: "هزینه‌اش چقدر است؟",
    a: (
      <>
        هزینه‌ی جلسه را پیش از رزرو، در صفحه‌ی رزرو می‌بینید، و <B>تمام آن به خیریه‌های معتبر اهدا می‌شود</B>. اگر فعلاً
        نمی‌خواهید هزینه کنید، خودارزیابی‌های سایت و آزمایشگاه بنیان‌گذار رایگان‌اند.
      </>
    ),
  },
  {
    q: "می‌توانید اقامت یا ویزای من را تضمین کنید؟",
    a: "نه، و به کسی که چنین قولی می‌دهد شک کنید. کار من بخش کسب‌وکار است: کمک می‌کنم چیزی بسازید که واقعی و قابل‌دفاع باشد. کارهای حقوقی پرونده با وکیل یا مشاور رسمی مهاجرت است.",
  },
  {
    q: "هوش مصنوعی جای کارمندهای من را می‌گیرد؟",
    a: "معمولاً نه. بیشتر وقت‌ها کارهای خسته‌کننده را برمی‌دارد تا آدم‌ها به کارهای مهم‌تر برسند. اگر جایی به کار شما نیاید، همین را صادقانه می‌گویم.",
  },
]

export function IntroFaPage() {
  return (
    <V3Page>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        kicker="سلام، من فرجادم."
        title="کمک می‌کنم کار خودتان را در کانادا"
        accent="درست شروع کنید و درست رشد بدهید."
        lead="اگر ایده‌ای در سر دارید، یا کسب‌وکاری دارید که گیر کرده، من کسی هستم که کنارتان می‌نشیند، صادقانه نگاه می‌کند و می‌گوید قدم بعدی چیست. ۲۲ سال است خودم شرکت می‌سازم؛ اول در ایران، حالا در تورنتو."
        actions={
          <>
            <V3Button href="/fa/booking" locale="fa">
              رزرو یک گفت‌وگو
            </V3Button>
            <V3Button href="#simple" locale="fa" variant="quiet">
              اول بخوانید، بعد تصمیم بگیرید
            </V3Button>
          </>
        }
        aside={
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-v3-line/80">
            <Image
              src="/images/farjad-portrait.jpg"
              alt="پرتره‌ی فرجاد"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="v3-drift object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-v3-ink/80 via-transparent to-transparent" />
            <p className="absolute bottom-5 start-5 end-5 text-sm leading-relaxed text-v3-soft">
              مربی کسب‌وکار و مشاور هوش مصنوعی · تورنتو
            </p>
          </div>
        }
      />

      {/* ── What I do, in one picture ────────────────────────────────── */}
      <Section
        id="simple"
        kicker="به زبان ساده"
        title="کار من شبیه"
        accent="کار یک مربی است."
        lead="مربی خودش در زمین بازی نمی‌کند. ولی قبلاً بازی کرده، اشتباه‌ها را می‌شناسد و از کنار زمین چیزهایی می‌بیند که بازیکن در گرماگرم بازی نمی‌بیند. من برای صاحبان کسب‌وکار همین کار را می‌کنم."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {HELPS.map((h, i) => (
            <Reveal key={h.kicker} delay={i * 0.08} className="h-full">
              <Card tone={i === 1 ? "lit" : "raised"}>
                <Kicker>{h.kicker}</Kicker>
                <Headline as="h3" size="card">
                  {h.title}
                </Headline>
                <p className="text-lg leading-loose text-v3-soft">{h.body}</p>
                <p className="mt-auto border-t border-v3-line/70 pt-4 leading-loose text-v3-bone">
                  <span className="text-v3-light">نتیجه: </span>
                  {h.result}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Recognition ──────────────────────────────────────────────── */}
      <Section title="اگر یکی از این جمله‌ها حرف دل شماست،" accent="این صفحه برای شماست.">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Checklist items={SOUNDS_LIKE_YOU} />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Card tone="plain">
              <p className="text-lg text-v3-bone">و برای رعایت انصاف، اگر:</p>
              <Checklist items={NOT_FOR_YOU} tone="no" />
              <p className="leading-loose text-v3-mute">احتمالاً آدم مناسبی برای هم نیستیم. بهتر است همین اول بدانید.</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── A small dictionary ───────────────────────────────────────── */}
      <Section
        kicker="واژه‌نامه‌ی کوچک"
        title="چند کلمه که در کار من"
        accent="زیاد می‌شنوید."
        lead="اگر این کلمه‌ها را جای دیگری در سایت دیدید و گیج شدید، معنی ساده‌شان این است:"
      >
        <dl className="grid gap-x-10 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
          {WORDS.map((w, i) => (
            <Reveal key={w.term} delay={(i % 3) * 0.06}>
              <div className="flex h-full flex-col gap-3 border-t border-v3-line/70 py-8">
                <dt className="flex items-baseline gap-3">
                  <span className="font-v3-display text-2xl text-v3-bone">{w.term}</span>
                  <span className="text-sm text-v3-mute" dir="ltr" lang="en">
                    {w.en}
                  </span>
                </dt>
                <dd className="text-lg leading-loose text-v3-soft">{w.body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* ── Why trust me ─────────────────────────────────────────────── */}
      <Section kicker="چرا به من اعتماد کنید؟" title="این راه را" accent="خودم رفته‌ام.">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { to: 22, suffix: "+", label: "سال ساختن شرکت، در ایران و کانادا" },
            { to: 50, suffix: "+", label: "تیم کسب‌وکار که در هفت سال گذشته کنارشان بوده‌ام" },
            { to: 20, suffix: "", label: "برنامه‌ی شتاب‌دهی که با آن‌ها همکاری کرده‌ام (حدوداً)" },
          ].map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08}>
              <div className="flex flex-col gap-3 border-t border-v3-light/40 pt-6">
                <CountUp to={f.to} suffix={f.suffix} locale="fa" className="font-v3-display text-6xl font-light text-v3-light" />
                <p className="text-lg leading-loose text-v3-soft">{f.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-6 lg:col-span-7">
            <p className="text-xl leading-loose text-v3-bone md:text-2xl">
              حدود ده شرکت راه انداخته‌ام. <B>سه‌تایش موفق شد و فروخته شد.</B> بقیه شکست خورد، و راستش بیشترِ چیزهایی
              که امروز به شما می‌گویم از همان شکست‌ها آمده است.
            </p>
            <p className="text-lg leading-loose text-v3-soft">
              تیم‌هایی که همراهشان بوده‌ام نزدیک به <B>۵ میلیون دلار سرمایه</B> جذب کرده‌اند و نزدیک به ۵ میلیون دلار
              دیگر هم <B>کمک خدماتی (گرنت)</B> گرفته‌اند؛ یعنی خدماتی مثل سرور، نرم‌افزار و مشاوره که لازم نبود پولش را
              بدهند.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-4 lg:col-span-5">
            <LightRule>سوابق رسمی</LightRule>
            <div className="flex flex-wrap gap-2">
              {CREDENTIALS.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── How it starts ────────────────────────────────────────────── */}
      <Section kicker="قدم اول" title="کار با من" accent="این‌طوری شروع می‌شود.">
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="h-full">
              <li className="flex h-full flex-col gap-4 rounded-2xl border border-v3-line/80 p-7 md:p-8">
                <span className="font-v3-display text-5xl font-light text-v3-light">{s.n}</span>
                <Headline as="h3" size="card">
                  {s.title}
                </Headline>
                <p className="text-lg leading-loose text-v3-soft">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-col gap-4 rounded-2xl border border-dashed border-v3-line p-7 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-2xl text-lg leading-loose text-v3-soft">
            <span className="text-v3-bone">هنوز آماده‌ی جلسه نیستید؟</span> با یک خودارزیابی رایگان ده‌دقیقه‌ای شروع کنید،
            یا درباره‌ی آزمایشگاه بنیان‌گذار بخوانید: هشت هفته کار گروهی روی کسب‌وکار خودتان، رایگان.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <V3Button href="/fa/tools" locale="fa" variant="secondary">
              خودارزیابی رایگان
            </V3Button>
            <V3Button href="/fa/lab" locale="fa" variant="quiet">
              آزمایشگاه بنیان‌گذار
            </V3Button>
          </div>
        </Reveal>
      </Section>

      {/* ── Questions ────────────────────────────────────────────────── */}
      <Section kicker="سؤال‌های رایج" title="چیزهایی که" accent="معمولاً می‌پرسند.">
        <V3Faq items={FAQ} />
      </Section>

      <CtaBand
        title="معمولاً یک گفت‌وگو کافی است"
        accent="تا ببینید به کارتان می‌آیم یا نه."
        body="اگر این صفحه به درد کسی می‌خورد که می‌شناسید، برایش بفرستید. شاید همان چیزی باشد که دنبالش است."
        action={
          <V3Button href="/fa/booking" locale="fa">
            رزرو یک گفت‌وگو
          </V3Button>
        }
      />
    </V3Page>
  )
}
