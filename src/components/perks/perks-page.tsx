// ============================================================================
// File: src/components/perks/perks-page.tsx
// Role: The perk-partner call, rendered for either locale, in the v3 "Light"
//       look (the shared kit in src/components/v3).
// Why:  /lab/perks and /fa/lab/perks are the same page in two languages. One
//       component means a change to the terms cannot land in one language only.
//       The copy is carried over word for word; only the look changed.
//       Fixed on the way: the compass line's aria-label sat on a <p>, which
//       most screen readers ignore — it is now real screen-reader text.
// Env / Identity: React Server Component (the form is a client island)
// ============================================================================

import { ArrowDown, FileText, Mail, Send } from "lucide-react"
import type { Locale } from "@/lib/perk-offer"
import { Card, Headline, PageHero, Reveal, Section, V3Button, V3Page } from "@/components/v3/kit"
import { localDigits } from "@/lib/digits"
import { PerkForm } from "./perk-form"

export const CONTACT_EMAIL = "its@farjadp.info"
export const TELEGRAM_HANDLE = "FarjadTalks"

const COPY = {
  en: {
    eyebrow: "Astaneh · Founder Development Lab, cohort one",
    titleA: "Partner with Astaneh —",
    titleB: "for perk providers",
    introA: "Astaneh is an eight-week mentorship programme for five startup teams, from idea to pre-MVP. The programme runs on one simple path:",
    compass: ["Assumption", "Evidence", "Decision"],
    compassAria: "Assumption, then evidence, then decision",
    introB: "I am inviting companies and startups, inside and outside Iran, to give these teams something that makes building cheaper or faster.",
    ctaForm: "Send an offer",
    ctaTerms: "Terms",
    asksTitleA: "What helps",
    asksTitleB: "these teams?",
    asksNote: "A few examples. If you have something else in mind, write that instead.",
    asks: [
      ["Infrastructure credits", "Cloud, servers, databases, or any service teams build a product on."],
      ["Free tool access", "A software subscription for the length of the programme or longer."],
      ["An advisory session", "One or more sessions with your specialist: legal, financial, technical or sales."],
      ["Design and marketing work", "A UX review, brand design, or help with the first customer experiments."],
      ["Co-working space", "A desk or a meeting room for the days teams need to be together."],
    ],
    getsTitleA: "In return,",
    getsTitleB: "what do you get?",
    gets: [
      ["Real users who give honest feedback", "Astaneh teams build an assumption every week and test it against evidence. They apply that same habit to your product: their feedback is structured and does not flatter."],
      ["Credit as an Astaneh cohort one partner", "Your name and logo alongside the programme, as one of the companies that backed the teams from day one."],
    ],
    termsTitleA: "Terms,",
    termsTitleB: "plainly.",
    termsNote: "A perk is a gift, not a trade. These rules are the same for every partner.",
    terms: [
      ["Equity", "None. A perk buys you no share of the teams or of the programme."],
      ["Obligation to buy", "None. Teams are under no obligation to buy your product after the programme."],
      ["Cost to the organiser", "None. I take no payment for an introduction or a partnership."],
      ["Where it can be used", "A perk is only offered to a team whose country of operation permits its use."],
    ],
    contactTitle: "Whichever way suits you.",
    contacts: { form: "The form on this page", formNote: "Takes about five minutes", email: "Email", telegram: "Telegram" },
    formTitle: "Perk offer form",
    formNote: "The more precisely you describe it, the faster I can get the perk to the right team.",
  },
  fa: {
    eyebrow: "آستانه · کوهورت اول Founder Development Lab",
    titleA: "همکاری با آستانه —",
    titleB: "برای ارائه‌دهندگان Perk",
    introA: "آستانه یک برنامه‌ی ۸ هفته‌ای منتورشیپ برای پنج تیم استارتاپی در مرحله‌ی ایده تا پیش از MVP است. قطب‌نمای برنامه یک مسیر ساده است:",
    compass: ["فرض", "شاهد", "تصمیم"],
    compassAria: "فرض، سپس شاهد، سپس تصمیم",
    introB: "از شرکت‌ها و استارتاپ‌های ایرانی، داخل و خارج از ایران، دعوت می‌کنم چیزی به این تیم‌ها بدهند که ساختن را برایشان ارزان‌تر یا سریع‌تر کند.",
    ctaForm: "ثبت پیشنهاد",
    ctaTerms: "شرایط همکاری",
    asksTitleA: "چه چیزی",
    asksTitleB: "به کار تیم‌ها می‌آید؟",
    asksNote: "چند نمونه. اگر چیز دیگری در ذهن دارید، همان را بنویسید.",
    asks: [
      ["اعتبار زیرساخت", "کلاد، سرور، دیتابیس یا هر سرویسی که تیم‌ها با آن محصول می‌سازند."],
      ["دسترسی رایگان به ابزار", "اشتراک نرم‌افزار برای طول دوره یا بیشتر."],
      ["جلسه‌ی مشاوره", "یک یا چند جلسه با متخصص شما: حقوقی، مالی، فنی یا فروش."],
      ["خدمات طراحی و مارکتینگ", "بررسی UX، طراحی برند، یا کمک در اولین آزمایش‌های جذب مشتری."],
      ["فضای کار اشتراکی", "میز یا اتاق جلسه برای روزهایی که تیم‌ها باید کنار هم باشند."],
    ],
    getsTitleA: "در عوض،",
    getsTitleB: "چه می‌گیرید؟",
    gets: [
      ["کاربر واقعی با بازخورد صادقانه", "تیم‌های آستانه هر هفته فرض می‌سازند و با شاهد آزمایشش می‌کنند. همین عادت را روی محصول شما هم پیاده می‌کنند: بازخوردشان ساختارمند است و تعارف ندارد."],
      ["معرفی به‌عنوان شریک کوهورت اول آستانه", "نام و لوگوی شما کنار برنامه، به‌عنوان یکی از شرکت‌هایی که از روز اول پشت تیم‌ها بوده‌اند."],
    ],
    termsTitleA: "شرایط،",
    termsTitleB: "رک و راست.",
    termsNote: "Perk هدیه است، نه معامله. این قاعده‌ها برای همه‌ی شریک‌ها یکسان است.",
    terms: [
      ["سهام", "هیچ. در ازای Perk هیچ سهمی از تیم‌ها یا از برنامه به شما نمی‌رسد."],
      ["تعهد خرید", "ندارد. تیم‌ها بعد از دوره هیچ تعهدی برای خرید محصول شما ندارند."],
      ["هزینه برای برگزارکننده", "هیچ. من بابت معرفی یا همکاری پولی نمی‌گیرم."],
      ["محل استفاده", "هر Perk فقط به تیمی معرفی می‌شود که قوانین کشور محل فعالیتش اجازه‌ی استفاده از آن را بدهد."],
    ],
    contactTitle: "از هر راهی که راحت‌ترید.",
    contacts: { form: "فرم همین صفحه", formNote: "پنج دقیقه وقت می‌گیرد", email: "ایمیل", telegram: "تلگرام" },
    formTitle: "فرم پیشنهاد Perk",
    formNote: "هرچه دقیق‌تر بنویسید، سریع‌تر می‌توانم Perk را به تیم مناسب برسانم.",
  },
} as const

const LIFT = "transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise"
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-4 focus-visible:ring-offset-v3-ink"

export function PerksPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const num = (i: number) => localDigits(`0${i + 1}`, locale)

  const contacts = [
    { label: t.contacts.form, value: t.contacts.formNote, href: "#offer", Icon: FileText, external: false, ltr: false },
    { label: t.contacts.email, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail, external: false, ltr: true },
    { label: t.contacts.telegram, value: `@${TELEGRAM_HANDLE}`, href: `https://t.me/${TELEGRAM_HANDLE}`, Icon: Send, external: true, ltr: true },
  ]

  return (
    <V3Page>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <PageHero
        kicker={t.eyebrow}
        title={t.titleA}
        accent={t.titleB}
        lead={t.introA}
        actions={
          <>
            <V3Button href="#offer" locale={locale}>
              {t.ctaForm}
            </V3Button>
            <V3Button href="#terms" variant="secondary" locale={locale}>
              {t.ctaTerms}
            </V3Button>
          </>
        }
        aside={
          <Card tone="lit" className="gap-8">
            <p className="flex flex-col gap-3">
              <span className="sr-only">{t.compassAria}</span>
              {t.compass.map((step, i) => (
                <span key={step} aria-hidden className="flex items-center gap-4">
                  <span className="w-8 shrink-0 font-v3-display text-sm tabular-nums text-v3-mute">{num(i)}</span>
                  <span className="font-v3-display text-3xl font-light text-v3-bone md:text-4xl">{step}</span>
                  {i < t.compass.length - 1 && <ArrowDown className="ms-auto h-5 w-5 text-v3-light" aria-hidden />}
                </span>
              ))}
            </p>
            <p className="border-t border-v3-line/70 pt-6 text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.introB}</p>
          </Card>
        }
      />

      {/* ─── What helps ───────────────────────────────────────── */}
      <Section title={t.asksTitleA} accent={t.asksTitleB} lead={t.asksNote}>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.asks.map(([title, body], i) => (
            <li key={title}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <Card className={`group ${LIFT}`}>
                  <span className="font-v3-display text-lg text-v3-mute transition-colors duration-500 group-hover:text-v3-light">{num(i)}</span>
                  <Headline as="h3" size="card">{title}</Headline>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{body}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── What you get ─────────────────────────────────────── */}
      <Section title={t.getsTitleA} accent={t.getsTitleB}>
        <div className="grid gap-5 md:grid-cols-2">
          {t.gets.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.1} className="h-full">
              <Card tone="raised" className={`group gap-5 ${LIFT}`}>
                <span aria-hidden className="h-px w-12 bg-v3-light transition-all duration-500 group-hover:w-24" />
                <Headline as="h3" size="card">{title}</Headline>
                <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── Terms ────────────────────────────────────────────── */}
      <Section id="terms" className="scroll-mt-20" title={t.termsTitleA} accent={t.termsTitleB} lead={t.termsNote}>
        <dl className="flex flex-col border-t border-v3-line/70">
          {t.terms.map(([term, body], i) => (
            <Reveal
              key={term}
              delay={i * 0.06}
              className="grid gap-2 border-b border-v3-line/70 px-2 py-7 transition-colors duration-500 hover:bg-v3-raise md:grid-cols-12 md:items-baseline md:gap-8 md:px-6"
            >
              <dt className="font-v3-display text-2xl font-light text-v3-bone md:col-span-4">{term}</dt>
              <dd className="text-lg leading-relaxed text-v3-soft md:col-span-8 rtl:leading-loose">{body}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* ─── Ways to reach us ─────────────────────────────────── */}
      <Section title={t.contactTitle}>
        <ul className="grid gap-4 sm:grid-cols-3">
          {contacts.map(({ label, value, href, Icon, external, ltr }, i) => (
            <li key={label}>
              <Reveal delay={i * 0.08} className="h-full">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex h-full min-h-44 flex-col gap-4 rounded-2xl border border-v3-line/80 p-7 md:p-8 ${LIFT} ${FOCUS}`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-v3-line text-v3-light transition-colors duration-500 group-hover:border-v3-light/60">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-v3-display text-2xl font-light text-v3-bone transition-colors group-hover:text-v3-light">{label}</span>
                  <span dir={ltr ? "ltr" : undefined} className="mt-auto self-start break-all text-v3-soft">
                    {value}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── Form ─────────────────────────────────────────────── */}
      <Section id="offer" className="scroll-mt-20" bordered={false} title={t.formTitle} lead={t.formNote}>
        <Reveal className="max-w-4xl">
          <Card className="p-6 md:p-10">
            <PerkForm locale={locale} />
          </Card>
        </Reveal>
      </Section>
    </V3Page>
  )
}
