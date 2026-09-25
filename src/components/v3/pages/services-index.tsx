// ============================================================================
// File Path: src/components/v3/pages/services-index.tsx
// Why: /services and /fa/services in the v3 "Light" look, one component for
//      both locales so they cannot drift apart. The copy is the pages' own,
//      carried over word for word from the v2 files; only the look changed.
//      Fixed on the way: the Persian service cards linked to the English
//      service pages (`/services/...` instead of `/fa/services/...`).
// Env / Identity: React Server Component
// ============================================================================

import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import {
  Card,
  Checklist,
  Chip,
  CtaBand,
  Headline,
  PageHero,
  Reveal,
  Section,
  V3Button,
  V3Faq,
  V3Page,
  Arrow,
} from "@/components/v3/kit"

type Copy = {
  kicker: string
  title: string
  accent: string
  lead: string
  book: string
  fit: { title: string; lead: string; yesTitle: string; yesNote: string; yes: string[]; noTitle: string; noNote: string; no: string[] }
  services: { title: string; lead: string; limited: string; more: string }
  list: { id: string; title: string; for: string; details: string[]; outcome: string; limited?: boolean }[]
  record: { title: string; items: { label: string; value: string; sub: string }[] }
  faq: { kicker: string; title: string; accent: string; lead: string; still: string; message: string; items: { q: string; a: string }[] }
  closing: { title: string; accent: string; body: string }
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Advisory & Mentorship",
    title: "Clarity for the builder.",
    accent: "Structure for the business.",
    lead: "I help immigrant founders and serious SMEs navigate the chaos of building. No hype. No fake numbers. Just direct, strategic engineering applied to your business.",
    book: "Book Strategy Call",
    fit: {
      title: "Are we a match?",
      lead: "I don't work with everyone. To protect both of our time, let's make sure our expectations align before we hop on a call.",
      yesTitle: "Right Fit",
      yesNote: "Who this is for",
      yes: [
        "Founders who want to build a real company, not a visa shell.",
        "Immigrants who need to understand the Canadian market code.",
        "SME owners tired of manual chaos and ready for AI.",
        "Leaders who value brutal honesty over polite lies.",
      ],
      noTitle: "Wrong Fit",
      noNote: "Who this is NOT for",
      no: [
        "People looking for guaranteed PR or 'easy' visas.",
        "Founders who want a 'Yes Man' to validate their ego.",
        "Those looking for get-rich-quick shortcuts.",
        "Anyone unwilling to do the heavy lifting themselves.",
      ],
    },
    services: {
      title: "Core Services",
      lead: "Four ways we can work together. Each designed for a specific stage of maturity.",
      limited: "Limited",
      more: "Inquire",
    },
    list: [
      {
        id: "startup-visa",
        title: "Startup Visa Strategy",
        for: "Immigrant founders needing a business case, not just a form filler.",
        details: ["Audit concept against SUV criteria.", "Roadmap to early traction.", "Mock incubator interviews."],
        outcome: "A defensible business case that stands up to scrutiny.",
      },
      {
        id: "founder-advisory",
        title: "Strategic Advisory",
        for: "Early-stage founders who need a sparring partner.",
        details: ["GTM Strategy validation.", "Business Model stress-testing.", "Prioritization frameworks."],
        outcome: "Stop building features nobody wants. Focus on revenue.",
      },
      {
        id: "digital-systems",
        title: "Digital Systems & AI",
        for: "SMEs bottlenecked by manual work.",
        details: ["Operational workflow audit.", "AI integration architecture.", "Tech stack selection."],
        outcome: "Reclaim 10+ hours/week and reduce human error.",
      },
      {
        id: "private-mentorship",
        title: "Private Mentorship",
        for: "High-potential founders.",
        details: ["Weekly 1:1 strategy calls.", "Async access (WhatsApp).", "Document review."],
        outcome: "A trusted co-pilot to navigate chaos.",
        limited: true,
      },
    ],
    record: {
      title: "The Track Record",
      items: [
        { label: "Current Role", value: "Founder & CSO at AshaVid", sub: "Toronto, Since 2025" },
        { label: "Exit / Past", value: "Founder & Director at DPF", sub: "Data Processing (17 Years)" },
        { label: "Tech Leadership", value: "Former CTO", sub: "Iran's Gov-backed Cloud Firm" },
        { label: "Education", value: "MSc Software , MA, MSc and PHD at Anthropology, DBA Branding", sub: "Rare mix of Code & Culture" },
        { label: "Global Reach", value: "Based in Newmarket, ON", sub: "Serving Global Founders" },
        { label: "Certification", value: "ISO 27001 Lead Auditor", sub: "Information Security" },
      ],
    },
    faq: {
      kicker: "Knowledge Base",
      title: "Common",
      accent: "Questions",
      lead: "Everything you need to know about the process, expectations, and how we build together.",
      still: "Still have questions?",
      message: "Send a direct message",
      items: [
        { q: "Do you guarantee immigration results?", a: "No. I am not a lawyer. I help you build a real business that meets the criteria, but the outcome is never guaranteed." },
        { q: "How do we start?", a: "Book a strategy call. We diagnose the problem in 30 minutes. If it fits, we move forward." },
        { q: "What is your hourly rate?", a: "I generally work on a retainer or project basis to ensure outcomes, not just hours spent." },
        { q: "Do you work with non-tech businesses?", a: "Yes, specifically for digital transformation and systemizing operations." },
      ],
    },
    closing: {
      title: "Ready to",
      accent: "work?",
      body: "I have limited capacity for new advisory clients. If you are serious, let's determine if we are a fit.",
    },
  },
  fa: {
    kicker: "مشاوره و منتورشیپ",
    title: "وضوح برای سازنده.",
    accent: "ساختار برای کسب‌وکار.",
    lead: "به بنیان‌گذاران مهاجر و کسب‌وکارهای کوچک و متوسط جدی کمک می‌کنم از آشوب ساختن عبور کنند. بدون هیاهو، بدون عدد ساختگی. فقط مهندسی مستقیم و استراتژیک روی کسب‌وکار شما.",
    book: "رزرو جلسه‌ی استراتژی",
    fit: {
      title: "به درد هم می‌خوریم؟",
      lead: "با همه کار نمی‌کنم. برای اینکه وقت هردومان هدر نرود، قبل از تماس مطمئن شویم انتظارهامان یکی است.",
      yesTitle: "انتخاب درست",
      yesNote: "این کار برای چه کسی است",
      yes: [
        "بنیان‌گذارانی که می‌خواهند شرکت واقعی بسازند، نه پوسته‌ای برای ویزا.",
        "مهاجرانی که باید قواعد نانوشته‌ی بازار کانادا را بفهمند.",
        "صاحبان کسب‌وکاری که از آشوب کار دستی خسته‌اند و آماده‌ی هوش مصنوعی‌اند.",
        "مدیرانی که صداقت تلخ را به دروغ مؤدبانه ترجیح می‌دهند.",
      ],
      noTitle: "انتخاب غلط",
      noNote: "این کار برای چه کسی نیست",
      no: [
        "کسانی که دنبال اقامت تضمینی یا ویزای «آسان» هستند.",
        "بنیان‌گذارانی که دنبال کسی‌اند که فقط تأییدشان کند.",
        "هرکسی که دنبال میان‌بر یک‌شبه پولدار شدن است.",
        "هرکسی که حاضر نیست بار سنگین کار را خودش بردارد.",
      ],
    },
    services: {
      title: "خدمات اصلی",
      lead: "چهار شکل همکاری. هرکدام برای مرحله‌ی مشخصی از بلوغ کسب‌وکار طراحی شده است.",
      limited: "ظرفیت محدود",
      more: "جزئیات بیشتر",
    },
    list: [
      {
        id: "startup-visa",
        title: "استراتژی استارتاپ ویزا",
        for: "بنیان‌گذاران مهاجری که به یک بیزینس‌کیس نیاز دارند، نه به کسی که فرم پر کند.",
        details: ["سنجش ایده در برابر معیارهای SUV.", "نقشه‌ی راه رسیدن به تراکشن اولیه.", "مصاحبه‌ی آزمایشی انکوباتور."],
        outcome: "بیزینس‌کیسی که زیر ذره‌بین دوام می‌آورد.",
      },
      {
        id: "founder-advisory",
        title: "مشاوره‌ی استراتژیک",
        for: "بنیان‌گذاران مرحله‌ی اولیه که به یک طرف مقابل فکری نیاز دارند.",
        details: ["اعتبارسنجی استراتژی ورود به بازار.", "تست فشار مدل کسب‌وکار.", "چارچوب‌های اولویت‌بندی."],
        outcome: "ساختن قابلیت‌های بی‌مشتری تمام می‌شود. تمرکز می‌رود روی درآمد.",
      },
      {
        id: "digital-systems",
        title: "سیستم‌های دیجیتال و هوش مصنوعی",
        for: "کسب‌وکارهای کوچک و متوسطی که کار دستی گلوگاهشان شده است.",
        details: ["ارزیابی گردش‌کار عملیاتی.", "معماری یکپارچه‌سازی هوش مصنوعی.", "انتخاب استک فناوری."],
        outcome: "بیش از ۱۰ ساعت در هفته برمی‌گردد و خطای انسانی کم می‌شود.",
      },
      {
        id: "private-mentorship",
        title: "منتورشیپ خصوصی",
        for: "بنیان‌گذاران با پتانسیل بالا.",
        details: ["جلسه‌ی استراتژی هفتگی یک‌به‌یک.", "دسترسی غیرهم‌زمان از طریق واتساپ.", "بازبینی اسناد."],
        outcome: "یک هم‌خلبان قابل‌اعتماد برای عبور از آشوب.",
        limited: true,
      },
    ],
    record: {
      title: "کارنامه",
      items: [
        { label: "نقش فعلی", value: "بنیان‌گذار و مدیر ارشد استراتژی AshaVid", sub: "تورنتو، از ۲۰۲۵" },
        { label: "کارنامه‌ی پیشین", value: "بنیان‌گذار و مدیر DPF", sub: "پردازش داده، ۱۷ سال" },
        { label: "رهبری فنی", value: "مدیر ارشد فنی سابق", sub: "نخستین شرکت ابری دولتی ایران" },
        { label: "تحصیلات", value: "کارشناسی ارشد نرم‌افزار، کارشناسی ارشد و دکتری انسان‌شناسی، DBA مدیریت برند", sub: "ترکیب کمیابِ کد و فرهنگ" },
        { label: "دامنه‌ی کار", value: "ساکن نیومارکت، انتاریو", sub: "همکاری با بنیان‌گذاران در سراسر دنیا" },
        { label: "گواهی‌نامه", value: "ممیز ارشد ISO 27001", sub: "امنیت اطلاعات" },
      ],
    },
    faq: {
      kicker: "پایگاه دانش",
      title: "پرسش‌های",
      accent: "پرتکرار",
      lead: "هرچه لازم است درباره‌ی روند کار، انتظارها و شکل همکاری بدانید.",
      still: "هنوز سؤالی دارید؟",
      message: "پیام مستقیم بفرستید",
      items: [
        { q: "نتیجه‌ی مهاجرتی را تضمین می‌کنید؟", a: "نه. من وکیل نیستم. کمک می‌کنم کسب‌وکاری واقعی بسازید که معیارها را برآورده کند، ولی نتیجه هیچ‌وقت تضمینی نیست." },
        { q: "از کجا شروع کنیم؟", a: "یک جلسه‌ی استراتژی رزرو کنید. در سی دقیقه مسئله را تشخیص می‌دهیم. اگر جور بود، جلو می‌رویم." },
        { q: "نرخ ساعتی‌تان چقدر است؟", a: "معمولاً قراردادی یا پروژه‌ای کار می‌کنم تا نتیجه تضمین شود، نه فقط ساعت‌هایی که صرف شده." },
        { q: "با کسب‌وکارهای غیرفناوری هم کار می‌کنید؟", a: "بله، مشخصاً برای تحول دیجیتال و سیستم‌مند کردن عملیات." },
      ],
    },
    closing: {
      title: "آماده‌ی کار",
      accent: "هستید؟",
      body: "ظرفیتم برای مشتری مشاوره‌ی تازه محدود است. اگر جدی هستید، بیایید ببینیم به درد هم می‌خوریم یا نه.",
    },
  },
}

export function servicesFaqSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COPY[locale].faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

export function ServicesIndex({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const href = (p: string) => localePath(locale, p)

  return (
    <V3Page>
      <PageHero
        kicker={t.kicker}
        title={t.title}
        accent={t.accent}
        lead={t.lead}
        actions={
          <V3Button href={href("/booking")} locale={locale}>
            {t.book}
          </V3Button>
        }
      />

      {/* ── Fit ─────────────────────────────────────────────────────── */}
      <Section title={t.fit.title} lead={t.fit.lead}>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card tone="lit">
              <div className="flex flex-col gap-1 border-b border-v3-line/70 pb-5">
                <Headline as="h3" size="card">{t.fit.yesTitle}</Headline>
                <span className="text-sm text-v3-mute">{t.fit.yesNote}</span>
              </div>
              <Checklist items={t.fit.yes} />
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card>
              <div className="flex flex-col gap-1 border-b border-v3-line/70 pb-5">
                <Headline as="h3" size="card" className="text-v3-soft">{t.fit.noTitle}</Headline>
                <span className="text-sm text-v3-mute">{t.fit.noNote}</span>
              </div>
              <Checklist items={t.fit.no} tone="no" />
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── Services ────────────────────────────────────────────────── */}
      <Section title={t.services.title} lead={t.services.lead}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.list.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <Card href={href(`/services/${s.id}`)} className="min-h-[440px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-v3-display text-lg text-v3-mute">{`0${i + 1}`}</span>
                  {s.limited && <Chip className="border-v3-light/50 text-v3-light">{t.services.limited}</Chip>}
                </div>
                <Headline as="h3" size="card" className="transition-colors group-hover:text-v3-light">
                  {s.title}
                </Headline>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{s.for}</p>
                <ul className="mt-auto flex flex-col gap-2 border-t border-v3-line/70 pt-5 text-sm text-v3-soft">
                  {s.details.map((d) => (
                    <li key={d} className="flex items-start gap-3">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-v3-light" />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="text-sm italic text-v3-bone rtl:not-italic">{s.outcome}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-v3-light">
                  {t.services.more}
                  <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Track record ────────────────────────────────────────────── */}
      <Section title={t.record.title}>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-v3-line/70 bg-v3-line/70 md:grid-cols-2 lg:grid-cols-3">
          {t.record.items.map((item, i) => (
            <Reveal
              key={item.label}
              delay={(i % 3) * 0.08}
              className="flex flex-col gap-3 bg-v3-ink p-7 transition-colors duration-500 hover:bg-v3-raise md:p-8"
            >
              <span className="text-sm text-v3-light">{item.label}</span>
              <span className="font-v3-display text-2xl leading-snug">{item.value}</span>
              <span className="text-sm text-v3-mute">{item.sub}</span>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-5 lg:col-span-4">
            <p className="text-sm text-v3-light">{t.faq.kicker}</p>
            <Headline accent={t.faq.accent}>{t.faq.title}</Headline>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.faq.lead}</p>
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-sm text-v3-mute">{t.faq.still}</span>
              <V3Button href="mailto:farjad@ashavid.ca" variant="quiet" locale={locale} className="self-start px-0">
                {t.faq.message}
              </V3Button>
            </div>
          </Reveal>
          <div className="lg:col-span-8">
            <V3Faq items={t.faq.items} />
          </div>
        </div>
      </Section>

      <CtaBand
        title={t.closing.title}
        accent={t.closing.accent}
        body={t.closing.body}
        action={
          <V3Button href={href("/booking")} locale={locale}>
            {t.book}
          </V3Button>
        }
      />
    </V3Page>
  )
}
