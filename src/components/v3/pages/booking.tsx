// ============================================================================
// File Path: src/components/v3/pages/booking.tsx
// Why: /booking and /fa/booking in the v3 "Light" look, one component for
//      both locales so they cannot drift apart. Both locales' copy was
//      rewritten on 27 Sep 2026: it read as a threat ("war room", "we
//      stress-test you", "burned", "immediate legal action") and spoke only
//      to startup-visa applicants. It now uses the calm, plain voice of
//      /fa/intro and fits any business owner. The fee, the rules and the NDA
//      mean exactly what they meant before.
//      The Google Calendar appointment embed, its "open in new tab" fallback
//      and the Telegram link are untouched — same URLs, same new-tab targets.
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
    kicker: "First Conversation",
    title: "Book a",
    accent: "Time",
    lead: "A calm, focused conversation about your work. The full session fee goes to verified charities; I ask for it so that both of us arrive committed.",
    fee: {
      title: "Session fee, paid to charity",
      amount: 144,
      currency: "USD",
      note: "Pay the amount directly to a charity of your choice and send me the receipt to confirm your booking.",
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
      title: "If the Calendar Won't Load",
      question: "Can't see the calendar below?",
      body: {
        before: "If you are visiting from Iran, you will probably need a ",
        strong: "VPN",
        after: " to see the Google Calendar embedded below.",
      },
      telegram: "Book through Telegram instead",
    },
    schedule: {
      title: "Choose a time",
      iframeTitle: "Google Calendar Appointment Scheduling",
      trouble: "Having trouble viewing the calendar? ",
      open: "Open in new tab",
      end: ".",
    },
    room: {
      title: "What happens",
      accent: "in the session?",
      lead: "A conversation with a clear structure, so none of your time is wasted. The 60-90 minutes run like this:",
      steps: [
        {
          when: "Min 0-15",
          title: "Understanding",
          body: "You tell me about your work and where you are stuck, and I ask questions until the real problem is clear. No technical vocabulary needed.",
        },
        {
          when: "Min 15-45",
          title: "Options",
          body: "We weigh the possible routes together, from business strategy to the website, software or automation that would actually help. I will be just as honest about what you don't need.",
        },
        {
          when: "Min 45-60",
          title: "Next Steps",
          body: "You leave with a clear plan: what to do first, on what budget, and over what timeframe.",
        },
      ],
      receiveTitle: "What you receive afterwards",
      receive: ["Video Recording", "Transcript", "PDF Action Plan", "Resource Links"],
    },
    nda: {
      title: "Confidentiality, Both Ways",
      sub: "Non-Disclosure Agreement",
      confidential: {
        title: "The recording is yours",
        body: {
          before: "The session recording is ",
          strong: "for your own review",
          after: ". Please don't publish or share any part of it on social media or elsewhere.",
        },
      },
      privacy: {
        title: "Mutual Trust",
        body: "Whatever you tell me about your business stays with me and is never published. In return, I ask you not to make public the methods and material you see in the session.",
      },
      legal: {
        title: "If It's Not Respected",
        body: "If either side breaks this agreement, the other side reserves the right to take legal action, and further work together won't be possible.",
      },
      agree: "Booking a session means accepting this agreement.",
    },
    rules: {
      title: "Two Simple Agreements",
      items: [
        {
          n: "01.",
          title: "If you can't make it",
          body: "Let me know at least 24 hours ahead and we'll move the session. A session missed without notice is not rescheduled.",
        },
        {
          n: "02.",
          title: "Charity receipt",
          body: "Send the receipt by email or Telegram within 6 hours of booking; otherwise the slot is released for someone else.",
        },
      ],
    },
    faq: {
      title: "Booking",
      accent: "Questions",
      items: [
        {
          q: "Can I bring a partner or colleague?",
          a: "Yes, and I'd encourage it. If you make decisions with someone, it helps to have them there (up to 3 people) so you all leave with the same picture.",
        },
        {
          q: "What if I don't have the charity receipt yet?",
          a: "Book the time first so you don't lose it, then you have 6 hours to send the receipt.",
        },
        {
          q: "Is the fee refundable?",
          a: "No, because it has gone straight to charity. But if you let me know 24 hours ahead, we'll reschedule.",
        },
        {
          q: "Do you speak Farsi?",
          a: "Yes. The session can be in whichever you prefer, Farsi or English.",
        },
      ],
    },
  },
  fa: {
    kicker: "گفت‌وگوی اول",
    title: "یک وقت",
    accent: "رزرو کنید",
    lead: "یک گفت‌وگوی آرام و جدی درباره‌ی کار شما. تمام هزینه‌ی جلسه به خیریه‌های معتبر می‌رسد؛ برای من مهم است که هر دو طرف با تعهد بیایند.",
    fee: {
      title: "هزینه‌ی جلسه، برای خیریه",
      amount: 144,
      currency: "دلار",
      note: "مبلغ را مستقیم به خیریه‌ای که خودتان انتخاب می‌کنید بپردازید و رسیدش را برایم بفرستید تا رزرو قطعی شود.",
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
      title: "اگر تقویم باز نشد",
      question: "تقویم پایین صفحه را نمی‌بینید؟",
      body: {
        before: "اگر از ایران وارد سایت شده‌اید، برای دیدن تقویم گوگل احتمالاً به ",
        strong: "وی‌پی‌ان",
        after: " نیاز دارید.",
      },
      telegram: "رزرو از طریق تلگرام",
    },
    schedule: {
      title: "زمان جلسه را انتخاب کنید",
      iframeTitle: "رزرو وقت در تقویم گوگل",
      trouble: "تقویم درست نمایش داده نمی‌شود؟ ",
      open: "در تب جدید باز کنید",
      end: ".",
    },
    room: {
      title: "در این جلسه",
      accent: "چه اتفاقی می‌افتد؟",
      lead: "گفت‌وگویی با یک ساختار روشن، تا وقت شما هدر نرود. جلسه‌ی ۶۰ تا ۹۰ دقیقه‌ای این‌طور پیش می‌رود:",
      steps: [
        {
          when: "دقیقه‌ی ۰ تا ۱۵",
          title: "شناخت",
          body: "شما از کارتان و جایی که گیر کرده‌اید می‌گویید، و من سؤال می‌پرسم تا روشن شود مسئله‌ی اصلی کجاست. لازم نیست اصطلاح تخصصی بلد باشید.",
        },
        {
          when: "دقیقه‌ی ۱۵ تا ۴۵",
          title: "گزینه‌ها",
          body: "راه‌های ممکن را با هم می‌سنجیم؛ از استراتژی کسب‌وکار تا سایت، نرم‌افزار یا اتوماسیونی که به کارتان می‌آید. همان‌قدر صادقانه می‌گویم چه چیزی لازم نیست.",
        },
        {
          when: "دقیقه‌ی ۴۵ تا ۶۰",
          title: "قدم‌های بعدی",
          body: "با یک برنامه‌ی روشن بیرون می‌روید: اول چه کاری، با چه بودجه‌ای، و در چه بازه‌ی زمانی.",
        },
      ],
      receiveTitle: "بعد از جلسه دریافت می‌کنید",
      receive: ["فایل ویدیوی جلسه", "متن پیاده‌شده‌ی گفت‌وگو", "برنامه‌ی عمل به‌صورت PDF", "لینک منابع"],
    },
    nda: {
      title: "محرمانگی، از هر دو طرف",
      sub: "توافق عدم افشا",
      confidential: {
        title: "فایل جلسه مال شماست",
        body: {
          before: "فایل ضبط‌شده ",
          strong: "فقط برای مرور خودتان",
          after: " است. لطفاً هیچ بخشی از آن را در شبکه‌های اجتماعی یا جای دیگری منتشر نکنید.",
        },
      },
      privacy: {
        title: "اعتماد دوطرفه",
        body: "هر چه از کارتان بگویید پیش من می‌ماند و جایی منتشر نمی‌شود. در مقابل، از شما هم می‌خواهم روش‌ها و مطالبی را که در جلسه می‌بینید علنی نکنید.",
      },
      legal: {
        title: "اگر رعایت نشود",
        body: "اگر یکی از دو طرف این توافق را رعایت نکند، حق پیگیری حقوقی برای طرف دیگر محفوظ است و همکاری بعدی ممکن نخواهد بود.",
      },
      agree: "رزرو جلسه به معنای پذیرفتن همین توافق است.",
    },
    rules: {
      title: "دو قرار ساده",
      items: [
        {
          n: "۰۱.",
          title: "اگر نمی‌توانید بیایید",
          body: "تا ۲۴ ساعت قبل خبر بدهید تا جلسه را جابه‌جا کنیم. جلسه‌ای که بدون خبر از دست برود، دوباره برگزار نمی‌شود.",
        },
        {
          n: "۰۲.",
          title: "رسید خیریه",
          body: "رسید را تا ۶ ساعت بعد از رزرو با ایمیل یا تلگرام بفرستید؛ وگرنه آن وقت برای نفر بعدی آزاد می‌شود.",
        },
      ],
    },
    faq: {
      title: "پرسش‌های رایج",
      accent: "درباره‌ی رزرو",
      items: [
        {
          q: "می‌توانم شریک یا همکارم را هم بیاورم؟",
          a: "بله، و پیشنهاد هم می‌کنم. اگر تصمیم‌ها را با کسی می‌گیرید، بهتر است او هم باشد (تا سه نفر) تا همه یک تصویر مشترک داشته باشید.",
        },
        {
          q: "اگر هنوز رسید خیریه ندارم چه؟",
          a: "اول وقت را رزرو کنید تا از دست نرود، بعد تا ۶ ساعت فرصت دارید رسید را بفرستید.",
        },
        {
          q: "مبلغ برگشت داده می‌شود؟",
          a: "نه، چون مستقیم به خیریه رفته است. ولی اگر ۲۴ ساعت قبل خبر بدهید، جلسه را جابه‌جا می‌کنیم.",
        },
        {
          q: "جلسه به فارسی است؟",
          a: "بله. به هر زبانی که راحت‌ترید، فارسی یا انگلیسی.",
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
          <div className="overflow-hidden rounded-2xl border border-v3-light/40 bg-v3-embed shadow-[0_0_80px_-40px_rgb(var(--v3-glow)/0.55)]">
            <iframe
              src={CALENDAR_EMBED}
              width="100%"
              height="100%"
              title={t.schedule.iframeTitle}
              className="block h-[800px] w-full border-0 bg-v3-embed"
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
