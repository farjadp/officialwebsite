// ============================================================================
// File Path: src/components/v3/pages/booking.tsx
// Why: /booking and /fa/booking in the v3 "Light" look, one component for
//      both locales so they cannot drift apart. The copy is the pages' own,
//      carried over word for word from the v2 files; only the look changed.
//      The Google Calendar appointment embed, its "open in new tab" fallback
//      and the Telegram link are untouched — same URLs, same new-tab targets.
//      Known and deliberately left alone: the metadata promises a 30-minute
//      call while the body describes a 60–90 minute session.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import { Clock, FileText, Globe, Handshake, Scale, ShieldAlert, Video } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import {
  Card,
  Checklist,
  Chip,
  CountUp,
  CtaBand,
  Headline,
  LightRule,
  PageHero,
  Reveal,
  Section,
  V3Button,
  V3Faq,
  V3Page,
} from "@/components/v3/kit"

/** Google Calendar appointment schedule, embedded. */
const CALENDAR_EMBED =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0c9kl9WXgD2feLxqByk8S1fPcngsfXdvOISc-dWrbhXnhNx7uVuM1RyLJfWKkT2l5XX7I3wNLf?gv=true"
/** The same schedule as a standalone page, for when the iframe is blocked. */
const CALENDAR_PAGE = "https://calendar.app.google/WNH5NUDujf7qDbAs6"
const TELEGRAM = "https://t.me/startupvisamentor"

/** A sentence with one emphasised run in the middle. */
type Emph = { before: string; strong: string; after: string }

type Copy = {
  kicker: string
  title: string
  accent: string
  lead: string
  fee: { title: string; amount: number; currency: string; note: string }
  details: { title: string; rows: { label: string; value: string }[] }
  tech: { title: string; question: string; body: Emph; telegram: string }
  schedule: { title: string; iframeTitle: string; trouble: string; open: string; end: string }
  room: {
    title: string
    accent: string
    lead: string
    steps: { when: string; title: string; body: string }[]
    receiveTitle: string
    receive: string[]
  }
  nda: {
    title: string
    sub: string
    confidential: { title: string; body: Emph }
    privacy: { title: string; body: string }
    legal: { title: string; body: string }
    agree: string
  }
  rules: { title: string; items: { n: string; title: string; body: string }[] }
  faq: { title: string; accent: string; items: { q: string; a: string }[] }
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Strategy Session",
    title: "Secure Your",
    accent: "Slot",
    lead: "We donate 100% of the session fee to verified charities. We value commitment over profit.",
    fee: {
      title: "Social Impact Fee",
      amount: 144,
      currency: "USD",
      note: "Pay directly to a charity of your choice. Send us the receipt to confirm your booking.",
    },
    details: {
      title: "Session Details",
      rows: [
        { label: "Duration:", value: "60-90 Mins" },
        { label: "Platform:", value: "Google Meet" },
        { label: "Recording:", value: "Included" },
      ],
    },
    tech: {
      title: "Tech Check",
      question: "Calendar Not Loading?",
      body: {
        before: "Due to internet restrictions, you likely need a ",
        strong: "VPN",
        after: " to see the Google Calendar embedded below.",
      },
      telegram: "Book manually via Telegram",
    },
    schedule: {
      title: "Schedule your appointment",
      iframeTitle: "Google Calendar Appointment Scheduling",
      trouble: "Having trouble viewing the calendar? ",
      open: "Open in new tab",
      end: ".",
    },
    room: {
      title: "Inside the",
      accent: '"War Room"',
      lead: "This is not a casual chat. It is a structured strategic audit. Here is the breakdown of our 60-90 minute session:",
      steps: [
        {
          when: "Min 0-15",
          title: "The Diagnostic",
          body: "We stress-test your current status. Capital verification, team structure analysis, and identifying immediate \"red flags\" in your profile.",
        },
        {
          when: "Min 15-45",
          title: "The Pivot Strategy",
          body: "We re-engineer your business concept. We explain exactly how to position your product to satisfy specific requirements and market gaps.",
        },
        {
          when: "Min 45-60",
          title: "The Execution Plan",
          body: "You leave with a clear roadmap: Which path to approach, specific budget parameters, and the estimated timeline for your goals.",
        },
      ],
      receiveTitle: "What you receive",
      receive: ["Video Recording", "Audio Transcript", "PDF Action Plan", "Resource Links"],
    },
    nda: {
      title: "Mutual NDA Protocol",
      sub: "Non-Disclosure Agreement",
      confidential: {
        title: "Strictly Confidential",
        body: {
          before: "The session recording is for your ",
          strong: "personal review only",
          after: ". It is strictly forbidden to publish, share, or upload any part of this meeting to social media.",
        },
      },
      privacy: {
        title: "Two-Way Privacy",
        body: "We respect your trade secrets. In return, you respect our intellectual property. We do not share your data, and you do not share our internal strategies publicly.",
      },
      legal: {
        title: "Legal Consequence",
        body: "Violation of this privacy policy by either party will result in immediate legal action and blacklisting from future opportunities.",
      },
      agree: "By booking a session, you automatically agree to these terms.",
    },
    rules: {
      title: "Engagement Rules",
      items: [
        { n: "01.", title: "No-Show Policy", body: "Missed calls without 24h notice are burned. No reschedules." },
        {
          n: "02.",
          title: "Donation Verification",
          body: "Email/TG the charity receipt within 6 hours of booking to avoid auto-cancellation.",
        },
      ],
    },
    faq: {
      title: "Booking",
      accent: "FAQ",
      items: [
        {
          q: "Can I bring my co-founder?",
          a: "Yes. We actually encourage all key decision-makers (up to 3 people) to join the call so everyone is aligned.",
        },
        {
          q: "What if I don't have a charity receipt yet?",
          a: "You can book the slot first to secure it, but you must send the receipt within 6 hours to confirm.",
        },
        {
          q: "Is the fee refundable?",
          a: "Since it is a direct donation to charity, we cannot refund it. However, we can reschedule your call if you notify us 24 hours in advance.",
        },
        {
          q: "Do you speak Farsi?",
          a: "Yes. The session can be conducted in your preferred language (Farsi or English).",
        },
      ],
    },
  },
  fa: {
    kicker: "جلسه‌ی استراتژی",
    title: "زمانتان را",
    accent: "رزرو کنید",
    lead: "صد درصد هزینه‌ی جلسه به خیریه‌های معتبر اهدا می‌شود. تعهد برای ما از سود مهم‌تر است.",
    fee: {
      title: "هزینه‌ی اثر اجتماعی",
      amount: 144,
      currency: "دلار",
      note: "مستقیم به خیریه‌ای که خودتان انتخاب می‌کنید پرداخت کنید و رسیدش را برای ما بفرستید تا رزرو قطعی شود.",
    },
    details: {
      title: "جزئیات جلسه",
      rows: [
        { label: "مدت:", value: "۶۰ تا ۹۰ دقیقه" },
        { label: "بستر:", value: "Google Meet" },
        { label: "ضبط جلسه:", value: "دارد" },
      ],
    },
    tech: {
      title: "بررسی فنی",
      question: "تقویم بالا نمی‌آید؟",
      body: {
        before: "به دلیل محدودیت‌های اینترنت، احتمالاً برای دیدن تقویم گوگلِ پایین صفحه به ",
        strong: "وی‌پی‌ان",
        after: " نیاز دارید.",
      },
      telegram: "رزرو دستی از طریق تلگرام",
    },
    schedule: {
      title: "زمان جلسه را انتخاب کنید",
      iframeTitle: "رزرو وقت در تقویم گوگل",
      trouble: "تقویم درست نمایش داده نمی‌شود؟ ",
      open: "در تب جدید باز کنید",
      end: ".",
    },
    room: {
      title: "داخل",
      accent: "«اتاق جنگ»",
      lead: "این یک گپ دوستانه نیست. یک ممیزی استراتژیک ساختارمند است. تفکیک جلسه‌ی ۶۰ تا ۹۰ دقیقه‌ای این‌طور است:",
      steps: [
        {
          when: "دقیقه‌ی ۰ تا ۱۵",
          title: "تشخیص",
          body: "وضعیت فعلی‌تان را زیر فشار می‌بریم: بررسی سرمایه، تحلیل ساختار تیم، و شناسایی «پرچم قرمز»های فوری در پرونده‌تان.",
        },
        {
          when: "دقیقه‌ی ۱۵ تا ۴۵",
          title: "استراتژی پیوت",
          body: "ایده‌ی کسب‌وکارتان را بازمهندسی می‌کنیم و دقیق توضیح می‌دهیم محصول را چطور جایگاه‌گذاری کنید تا با الزامات مشخص و شکاف‌های بازار جور دربیاید.",
        },
        {
          when: "دقیقه‌ی ۴۵ تا ۶۰",
          title: "برنامه‌ی اجرا",
          body: "با یک نقشه‌ی راه روشن از جلسه بیرون می‌آیید: کدام مسیر را بروید، پارامترهای مشخص بودجه، و زمان‌بندی تخمینی برای رسیدن به هدف‌هایتان.",
        },
      ],
      receiveTitle: "چه چیزی تحویل می‌گیرید",
      receive: ["فایل ویدیوی جلسه", "متن پیاده‌شده‌ی صوت", "برنامه‌ی عمل به‌صورت PDF", "لینک منابع"],
    },
    nda: {
      title: "توافق محرمانگی دوطرفه",
      sub: "قرارداد عدم افشا",
      confidential: {
        title: "کاملاً محرمانه",
        body: {
          before: "فایل ضبط‌شده‌ی جلسه فقط ",
          strong: "برای مرور شخصی خودتان",
          after: " است. انتشار، اشتراک‌گذاری یا آپلود هر بخشی از این جلسه در شبکه‌های اجتماعی اکیداً ممنوع است.",
        },
      },
      privacy: {
        title: "محرمانگی دوطرفه",
        body: "ما به اسرار تجاری شما احترام می‌گذاریم و در مقابل، شما به مالکیت فکری ما. ما داده‌های شما را جایی منتشر نمی‌کنیم و شما استراتژی‌های داخلی ما را علنی نمی‌کنید.",
      },
      legal: {
        title: "پیامد حقوقی",
        body: "نقض این توافق از سوی هر یک از دو طرف، به پیگرد حقوقی فوری و حذف از همکاری‌های آینده منجر می‌شود.",
      },
      agree: "با رزرو جلسه، این شرایط را پذیرفته‌اید.",
    },
    rules: {
      title: "قواعد همکاری",
      items: [
        {
          n: "۰۱.",
          title: "غیبت بدون اطلاع",
          body: "جلسه‌ای که بدون اطلاع ۲۴ ساعته از دست برود سوخته است و جابه‌جا نمی‌شود.",
        },
        {
          n: "۰۲.",
          title: "تأیید کمک خیریه",
          body: "رسید خیریه را ظرف ۶ ساعت پس از رزرو با ایمیل یا تلگرام بفرستید تا رزرو خودکار لغو نشود.",
        },
      ],
    },
    faq: {
      title: "پرسش‌های رایج",
      accent: "رزرو",
      items: [
        {
          q: "می‌توانم هم‌بنیان‌گذارم را هم بیاورم؟",
          a: "بله. اتفاقاً تشویق می‌کنیم همه‌ی تصمیم‌گیرنده‌های کلیدی (تا سه نفر) در جلسه باشند تا همه یک تصویر مشترک داشته باشند.",
        },
        {
          q: "اگر هنوز رسید کمک خیریه ندارم چه؟",
          a: "می‌توانید اول زمان را رزرو کنید تا از دست نرود، ولی برای قطعی شدن باید ظرف ۶ ساعت رسید را بفرستید.",
        },
        {
          q: "مبلغ قابل بازگشت است؟",
          a: "چون کمک مستقیم به خیریه است، بازگشتی نیست. ولی اگر ۲۴ ساعت قبل خبر دهید، جلسه را جابه‌جا می‌کنیم.",
        },
        {
          q: "جلسه به فارسی برگزار می‌شود؟",
          a: "بله. جلسه به هر زبانی که راحت‌ترید برگزار می‌شود، فارسی یا انگلیسی.",
        },
      ],
    },
  },
}

const SCHEDULE_ID = "schedule"
const ICONS = [Clock, Globe, Video]

function Emphasis({ text }: { text: Emph }) {
  return (
    <>
      {text.before}
      <strong className="font-semibold text-v3-bone">{text.strong}</strong>
      {text.after}
    </>
  )
}

/** One line of the NDA: an icon in a quiet ring, a title, a paragraph. */
function Term({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-v3-line text-v3-light">
        {icon}
      </span>
      <div className="flex flex-col gap-1.5">
        <h4 className="font-medium text-v3-bone">{title}</h4>
        <p className="leading-relaxed text-v3-soft rtl:leading-loose">{children}</p>
      </div>
    </div>
  )
}

export function BookingPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const toCalendar = (
    <V3Button href={`#${SCHEDULE_ID}`} locale={locale}>
      {t.schedule.title}
    </V3Button>
  )

  return (
    <V3Page>
      <PageHero
        kicker={t.kicker}
        title={t.title}
        accent={t.accent}
        lead={t.lead}
        actions={
          <>
            {toCalendar}
            <V3Button href={TELEGRAM} external variant="quiet" locale={locale}>
              {t.tech.telegram}
            </V3Button>
          </>
        }
        aside={
          <Card tone="lit" className="gap-6">
            <span className="text-sm text-v3-light">{t.fee.title}</span>
            <p className="flex items-baseline gap-3 font-v3-display font-light">
              <CountUp to={t.fee.amount} locale={locale} className="text-7xl leading-none md:text-8xl" />
              <span className="text-xl text-v3-mute">{t.fee.currency}</span>
            </p>
            <p className="border-t border-v3-line/70 pt-5 leading-relaxed text-v3-soft rtl:leading-loose">{t.fee.note}</p>
          </Card>
        }
      />

      {/* ── Details and tech check ──────────────────────────────────── */}
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card tone="raised" className="transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60">
              <Headline as="h3" size="card">
                {t.details.title}
              </Headline>
              <ul className="flex flex-col">
                {t.details.rows.map((row, i) => {
                  const Icon = ICONS[i]
                  return (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-4 border-b border-v3-line/60 py-4 last:border-b-0"
                    >
                      <span className="flex items-center gap-3 text-v3-soft">
                        {Icon && <Icon className="h-4 w-4 text-v3-light" aria-hidden />}
                        {row.label}
                      </span>
                      <Chip className="text-v3-bone">{row.value}</Chip>
                    </li>
                  )
                })}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60">
              <Headline as="h3" size="card">
                {t.tech.title}
              </Headline>
              <p className="font-medium text-v3-light">{t.tech.question}</p>
              <p className="leading-relaxed text-v3-soft rtl:leading-loose">
                <Emphasis text={t.tech.body} />
              </p>
              <div className="mt-auto pt-2">
                <V3Button href={TELEGRAM} external variant="secondary" locale={locale}>
                  {t.tech.telegram}
                </V3Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── The calendar ────────────────────────────────────────────── */}
      <Section id={SCHEDULE_ID} title={t.schedule.title} className="scroll-mt-24 bg-v3-raise/40">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-v3-light/40 bg-v3-bone shadow-[0_0_80px_-40px_rgba(232,196,138,0.55)]">
            <iframe
              src={CALENDAR_EMBED}
              width="100%"
              height="100%"
              title={t.schedule.iframeTitle}
              className="block h-[800px] w-full border-0 bg-v3-bone"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-center text-v3-mute">
            {t.schedule.trouble}
            <a
              href={CALENDAR_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light"
            >
              {t.schedule.open}
            </a>
            {t.schedule.end}
          </p>
        </Reveal>
      </Section>

      {/* ── Inside the room ─────────────────────────────────────────── */}
      <Section title={t.room.title} accent={t.room.accent} lead={t.room.lead}>
        <div className="grid gap-14 lg:grid-cols-12">
          <LightRule className="lg:col-span-7">
            <ol className="flex flex-col">
              {t.room.steps.map((step) => (
                <li
                  key={step.when}
                  className="relative grid grid-cols-[4.5rem_1fr] gap-6 py-7 md:grid-cols-[7.5rem_1fr] md:gap-10"
                >
                  <span className="pe-3 text-sm leading-snug tabular-nums text-v3-mute md:text-base">{step.when}</span>
                  <span
                    aria-hidden
                    className="absolute start-[4.5rem] top-[2.35rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2"
                  />
                  <Reveal className="flex flex-col gap-2 ps-6 md:ps-10">
                    <h3 className="font-v3-display text-2xl font-light text-v3-bone">{step.title}</h3>
                    <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </LightRule>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Card tone="raised">
              <p className="flex items-center gap-2 text-sm text-v3-light">
                <FileText className="h-4 w-4" aria-hidden />
                {t.room.receiveTitle}
              </p>
              <Checklist items={t.room.receive} />
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── NDA and rules ───────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Card tone="lit" className="gap-8">
              <div className="flex flex-col gap-3 border-b border-v3-line/70 pb-6">
                <ShieldAlert className="h-6 w-6 text-v3-light" aria-hidden />
                <Headline as="h3" size="card">
                  {t.nda.title}
                </Headline>
                <span className="text-sm text-v3-mute">{t.nda.sub}</span>
              </div>
              <div className="flex flex-col gap-7">
                <Term icon={<Video className="h-4 w-4" aria-hidden />} title={t.nda.confidential.title}>
                  <Emphasis text={t.nda.confidential.body} />
                </Term>
                <Term icon={<Handshake className="h-4 w-4" aria-hidden />} title={t.nda.privacy.title}>
                  {t.nda.privacy.body}
                </Term>
                <Term icon={<Scale className="h-4 w-4" aria-hidden />} title={t.nda.legal.title}>
                  {t.nda.legal.body}
                </Term>
              </div>
              <p className="mt-auto border-t border-v3-line/70 pt-6 text-center text-sm text-v3-mute">{t.nda.agree}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Card tone="raised">
              <Headline as="h3" size="card">
                {t.rules.title}
              </Headline>
              <ol className="flex flex-col">
                {t.rules.items.map((rule) => (
                  <li key={rule.n} className="flex gap-4 border-b border-v3-line/60 py-5 last:border-b-0">
                    <span className="font-v3-display text-lg text-v3-light">{rule.n}</span>
                    <div className="flex flex-col gap-1.5">
                      <strong className="font-medium text-v3-bone">{rule.title}</strong>
                      <span className="leading-relaxed text-v3-soft rtl:leading-loose">{rule.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <Section title={t.faq.title} accent={t.faq.accent}>
        <div className="max-w-4xl">
          <V3Faq items={t.faq.items} />
        </div>
      </Section>

      <CtaBand title={t.title} accent={t.accent} body={t.lead} action={toCalendar} />
    </V3Page>
  )
}
