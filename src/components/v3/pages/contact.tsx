// ============================================================================
// File Path: src/components/v3/pages/contact.tsx
// Why: /contact and /fa/contact in the v3 "Light" look, one component for
//      both locales so they cannot drift apart. The copy is the pages' own,
//      carried over word for word from the v2 files; only the look changed.
//      Fixed on the way: external links opened with target="_blank" but no
//      rel="noopener noreferrer"; the Persian email and handle now keep
//      dir="ltr"; the booking link goes through localePath.
//      Note: there is no contact form on this page (there never was); it is a
//      hub of direct channels.
// Env / Identity: React Server Component
// ============================================================================

import Image from "next/image"
import type { ReactNode } from "react"
import {
  Briefcase,
  ExternalLink,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Quote,
  Send,
  TrendingUp,
  Users,
  Youtube,
  type LucideIcon,
} from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import {
  Arrow,
  Card,
  Chip,
  CtaBand,
  Headline,
  PageHero,
  Reveal,
  Section,
  V3Button,
  V3Page,
} from "@/components/v3/kit"

type Copy = {
  kicker: string
  title: string
  accent: string
  lead: string
  portraitAlt: string
  mentorshipAlt: string
  stats: { value: string; label: string; icon: LucideIcon }[]
  social: { title: string; view: string; items: { name: string; url: string; icon: LucideIcon }[] }
  ventures: { title: string; items: { name: string; url: string; role: string; desc: string }[] }
  direct: {
    title: string
    lead: string
    phoneLabel: string
    phone: string
    emailLabel: string
    email: string
    responds: string
  }
  testimonial: { quote: string; name: string; role: string }
  youtube: { title: string; iframeTitle: string; before: string; after: string }
  closing: { title: string; body: string; book: string; note: string }
}

const PHONE = "+1 (437) 661-1674"
const EMAIL = "farjad@ashavid.ca"
const YT_EMBED = "https://www.youtube.com/embed?listType=playlist&list=UUKwrxko4YPDjWLsRSCTcTMg"
const YT_CHANNEL = "https://youtube.com/@ashavidgroup?si=elPYHivIRM87N3IN"

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Connect & Explore",
    title: "The Digital",
    accent: "Footprint.",
    lead: "Where to find me, follow my work, or get in touch directly.",
    portraitAlt: "Farjad Pourmohammad, startup advisor, in portrait",
    mentorshipAlt: "Farjad Pourmohammad mentoring a founding team",
    stats: [
      { value: "22+", label: "Years Exp.", icon: Briefcase },
      { value: "100+", label: "Founders", icon: Users },
      { value: "5", label: "Ventures", icon: Globe },
      { value: "Real", label: "Results", icon: TrendingUp },
    ],
    social: {
      title: "Social Channels",
      view: "View Profile",
      items: [
        { name: "Hero's Journey", url: "https://t.me/Heros_Journey", icon: Send },
        { name: "Farjad Talks (TG)", url: "https://t.me/FarjadTalks", icon: Send },
        { name: "Farjad Talks (IG)", url: "https://instagram.com/FarjadTalks", icon: Instagram },
        { name: "Farjad Talks (YT)", url: "https://youtube.com/@FarjadTalks", icon: Youtube },
        { name: "LinkedIn Profile", url: "https://www.linkedin.com/in/farjadpourmohammad/", icon: Linkedin },
      ],
    },
    ventures: {
      title: "Ventures & Websites",
      items: [
        { name: "Startup Visa Roads", url: "https://www.startupvisaroads.ca", role: "Consulting", desc: "Strategic immigration for founders." },
        { name: "AshaVid", url: "https://www.AshaVid.ca", role: "Advisory", desc: "Digital transformation & tech services." },
        { name: "NorthRoad VC", url: "https://www.NorthRoad.vc", role: "Investment", desc: "Venture capital for new pathways." },
        { name: "FarjadP.com", url: "https://www.farjadp.com", role: "Personal", desc: "Farsi content hub." },
      ],
    },
    direct: {
      title: "Direct Contact",
      lead: "Physical and direct lines are open for serious inquiries regarding consulting, speaking, or investment.",
      phoneLabel: "Direct Line / WhatsApp",
      phone: PHONE,
      emailLabel: "Primary Email",
      email: EMAIL,
      responds: "Responds in English",
    },
    testimonial: {
      quote: "\"Farjad doesn't just give you a checklist. He completely restructures how you approach your business logic.\"",
      name: "Amir S.",
      role: "SaaS Founder",
    },
    youtube: {
      title: "Latest from YouTube",
      iframeTitle: "AshaVid Group YouTube",
      before: "Watch full series on ",
      after: "",
    },
    closing: {
      title: "Ready to dive deep?",
      body: "If you’re a founder looking to untangle your business model, structure for North America, or plan a strategic immigration pathway, we should talk.",
      book: "Book a Strategy Session",
      note: "Limited availability • Paid Sessions Only",
    },
  },
  fa: {
    kicker: "ارتباط و آشنایی",
    title: "رد پای",
    accent: "دیجیتال",
    lead: "اینجا می‌توانید پیدایم کنید، کارم را دنبال کنید، یا مستقیم در تماس باشید.",
    portraitAlt: "فرجاد پورمحمد، مشاور استارتاپ",
    mentorshipAlt: "فرجاد پورمحمد در جلسه منتورشیپ با یک تیم بنیان‌گذار",
    stats: [
      { value: "۲۲+", label: "سال تجربه", icon: Briefcase },
      { value: "۱۰۰+", label: "بنیان‌گذار", icon: Users },
      { value: "۵", label: "کسب‌وکار", icon: Globe },
      { value: "واقعی", label: "نتیجه", icon: TrendingUp },
    ],
    social: {
      title: "کانال‌های اجتماعی",
      view: "مشاهده‌ی پروفایل",
      items: [
        { name: "سفر قهرمان", url: "https://t.me/Heros_Journey", icon: Send },
        { name: "فرجاد تاکس (تلگرام)", url: "https://t.me/FarjadTalks", icon: Send },
        { name: "فرجاد تاکس (اینستاگرام)", url: "https://instagram.com/FarjadTalks", icon: Instagram },
        { name: "فرجاد تاکس (یوتیوب)", url: "https://youtube.com/@FarjadTalks", icon: Youtube },
        { name: "پروفایل لینکدین", url: "https://www.linkedin.com/in/farjadpourmohammad/", icon: Linkedin },
      ],
    },
    ventures: {
      title: "کسب‌وکارها و سایت‌ها",
      items: [
        { name: "Startup Visa Roads", url: "https://www.startupvisaroads.ca", role: "مشاوره", desc: "مهاجرت استراتژیک برای بنیان‌گذاران." },
        { name: "AshaVid", url: "https://www.AshaVid.ca", role: "مشاوره", desc: "تحول دیجیتال و خدمات فناوری." },
        { name: "NorthRoad VC", url: "https://www.NorthRoad.vc", role: "سرمایه‌گذاری", desc: "سرمایه‌گذاری خطرپذیر برای مسیرهای تازه." },
        { name: "FarjadP.com", url: "https://www.farjadp.com", role: "شخصی", desc: "مرکز محتوای فارسی." },
      ],
    },
    direct: {
      title: "تماس مستقیم",
      lead: "خطوط مستقیم برای درخواست‌های جدی در زمینه‌ی مشاوره، سخنرانی یا سرمایه‌گذاری باز است.",
      phoneLabel: "خط مستقیم و واتساپ",
      phone: PHONE,
      emailLabel: "ایمیل اصلی",
      email: EMAIL,
      responds: "پاسخ‌گویی به انگلیسی",
    },
    testimonial: {
      quote: "«فرجاد فقط یک چک‌لیست دستت نمی‌دهد. کل نگاهت به منطق کسب‌وکارت را از نو می‌سازد.»",
      name: "امیر س.",
      role: "بنیان‌گذار SaaS",
    },
    youtube: {
      title: "تازه‌ترین‌ها در یوتیوب",
      iframeTitle: "یوتیوب گروه آشاوید",
      before: "مجموعه‌ی کامل را در ",
      after: " ببینید",
    },
    closing: {
      title: "آماده‌اید وارد عمق شویم؟",
      body: "اگر بنیان‌گذاری هستید که می‌خواهد گره مدل کسب‌وکارش را باز کند، برای بازار آمریکای شمالی ساختار بدهد، یا مسیر مهاجرتی استراتژیک بچیند، باید با هم حرف بزنیم.",
      book: "رزرو جلسه‌ی استراتژی",
      note: "ظرفیت محدود • فقط جلسه‌ی پولی",
    },
  },
}

/** A block heading with a small light icon, used inside the two columns. */
function BlockTitle({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3 border-b border-v3-line/70 pb-5">
      <Icon aria-hidden className="h-5 w-5 text-v3-light" />
      <Headline as="h2" size="card">
        {children}
      </Headline>
    </div>
  )
}

const EXTERNAL_CARD =
  "group relative flex min-h-11 rounded-2xl border border-v3-line/80 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"

export function ContactPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const href = (p: string) => localePath(locale, p)

  return (
    <V3Page>
      <PageHero
        kicker={t.kicker}
        title={t.title}
        accent={t.accent}
        lead={t.lead}
        aside={
          <div className="group relative h-[320px] w-full overflow-hidden rounded-2xl border border-v3-line/80 md:h-[380px]">
            <Image
              src="/images/farjad-personalbranding.png"
              alt={t.portraitAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>
        }
      />

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className="mx-auto w-full max-w-[1600px] px-5 py-14 md:px-10 lg:px-14">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-v3-line/70 bg-v3-line/70 grid-cols-2 md:grid-cols-4">
            {t.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.08}
                className="group flex flex-col items-center justify-center gap-2 bg-v3-ink p-7 text-center transition-colors duration-500 hover:bg-v3-raise"
              >
                <s.icon aria-hidden className="h-5 w-5 text-v3-mute transition-colors group-hover:text-v3-light" />
                <span className="font-v3-display text-4xl font-light text-v3-bone">{s.value}</span>
                <span className="text-sm text-v3-mute">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Channels, ventures, direct contact ──────────────────────── */}
      <Section>
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-16 lg:col-span-7">
            <Reveal>
              <div className="group relative h-[220px] w-full overflow-hidden rounded-2xl border border-v3-line/80">
                <Image
                  src="/images/farjad-mentorship.png"
                  alt={t.mentorshipAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover opacity-90 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>
            </Reveal>

            {/* Social channels */}
            <div>
              <Reveal>
                <BlockTitle icon={MessageCircle}>{t.social.title}</BlockTitle>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {t.social.items.map((link, i) => (
                  <Reveal key={link.url} delay={i * 0.06}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${EXTERNAL_CARD} items-center gap-4 p-5`}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-v3-line bg-v3-raise text-v3-soft transition-colors group-hover:border-v3-light/60 group-hover:text-v3-light">
                        <link.icon aria-hidden className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium text-v3-bone transition-colors group-hover:text-v3-light">{link.name}</span>
                        <span className="text-sm text-v3-mute">{t.social.view}</span>
                      </span>
                      <ExternalLink
                        aria-hidden
                        className="ms-auto h-4 w-4 text-v3-mute opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Ventures */}
            <div>
              <Reveal>
                <BlockTitle icon={Globe}>{t.ventures.title}</BlockTitle>
              </Reveal>
              <div className="flex flex-col gap-4">
                {t.ventures.items.map((site, i) => (
                  <Reveal key={site.url} delay={i * 0.06}>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${EXTERNAL_CARD} items-center justify-between gap-6 p-6 md:p-7`}
                    >
                      <span className="flex flex-col gap-2">
                        <span className="flex flex-wrap items-center gap-3">
                          <span dir="ltr" className="font-v3-display text-2xl font-light text-v3-bone transition-colors group-hover:text-v3-light">
                            {site.name}
                          </span>
                          <Chip>{site.role}</Chip>
                        </span>
                        <span className="text-v3-soft rtl:leading-loose">{site.desc}</span>
                      </span>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-v3-line text-v3-mute transition-all duration-300 group-hover:border-v3-light group-hover:bg-v3-light group-hover:text-v3-ink">
                        <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:col-span-5">
            <Reveal>
              <Card tone="lit" className="gap-8">
                <div className="flex flex-col gap-3">
                  <Headline as="h2" size="card">
                    {t.direct.title}
                  </Headline>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{t.direct.lead}</p>
                </div>

                <div className="flex flex-col gap-7">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-v3-line text-v3-light">
                      <Phone aria-hidden className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-v3-mute">{t.direct.phoneLabel}</span>
                      <span dir="ltr" className="text-lg tabular-nums text-v3-bone rtl:text-end">
                        {t.direct.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-v3-line text-v3-light">
                      <Mail aria-hidden className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-v3-mute">{t.direct.emailLabel}</span>
                      <a
                        href={`mailto:${t.direct.email}`}
                        dir="ltr"
                        className="inline-flex min-h-11 items-center self-start text-lg text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light"
                      >
                        {t.direct.email}
                      </a>
                      <span className="flex items-center gap-2 text-sm text-v3-mute">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)] motion-safe:animate-pulse" />
                        {t.direct.responds}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={0.08}>
              <figure className="flex flex-col gap-5 rounded-2xl border border-v3-line/80 border-s-2 border-s-v3-light bg-v3-raise p-7 md:p-8">
                <Quote aria-hidden className="h-7 w-7 text-v3-light/40" />
                <blockquote className="font-v3-display text-xl font-light leading-relaxed text-v3-bone ltr:italic rtl:leading-loose">
                  {t.testimonial.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full border border-v3-light/50 font-v3-display text-sm text-v3-light">
                    A
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-v3-bone">{t.testimonial.name}</span>
                    <span className="text-sm text-v3-mute">{t.testimonial.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col">
                <BlockTitle icon={Youtube}>{t.youtube.title}</BlockTitle>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-raise">
                  <iframe
                    className="absolute inset-0 h-full w-full border-0"
                    src={YT_EMBED}
                    title={t.youtube.iframeTitle}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="mt-4 text-center text-sm text-v3-mute">
                  {t.youtube.before}
                  <a
                    href={YT_CHANNEL}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="font-medium text-v3-bone underline decoration-v3-line underline-offset-4 transition-colors hover:text-v3-light hover:decoration-v3-light"
                  >
                    @ashavidgroup
                  </a>
                  {t.youtube.after}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaBand
        title={t.closing.title}
        body={t.closing.body}
        action={
          <div className="flex flex-col items-start gap-4">
            <V3Button href={href("/booking")} locale={locale}>
              {t.closing.book}
            </V3Button>
            <span className="text-sm text-v3-mute">{t.closing.note}</span>
          </div>
        }
      />
    </V3Page>
  )
}
