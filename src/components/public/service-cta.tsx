// ============================================================================
// File Path: src/components/public/service-cta.tsx
// Version: 3.0.0 — 2026-09-25
// Why: The closing block on every service page in BOTH locales, in the v3
//      "Light" look: a beam, one headline with its accent in the light, the
//      booking action, and the direct channels. Export name and props are
//      unchanged so every service page keeps importing it as before.
//
//      History: this block used to be English-only with a hardcoded
//      href="/booking", so the primary call to action on the Persian service
//      pages dropped the visitor back into the English site.
//      v3 fixes: every channel is now a real, named link (the tiles used to
//      be empty overlay anchors and the social icons had no accessible name),
//      external links open with rel="noopener noreferrer", and the email
//      address is no longer truncated. The third-party avatar image
//      (ui-avatars.com) was decorative and is gone.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import { Instagram, Link as LinkIcon, Linkedin, Mail, MessageCircle, MoveUpRight, Navigation, Youtube } from "lucide-react"
import { localePath, type Locale } from "@/lib/nav"
import { Beam, Headline, Reveal, V3Button } from "@/components/v3/kit"

const COPY = {
  en: {
    headingLead: "Ready to build something that",
    headingAccent: "survives",
    headingTail: "real life?",
    sub: 'I exist for founders who refuse to live on "what if".',
    availableNow: "Available Now",
    diagnosticTitle: "Strategic Fit Diagnostic",
    diagnosticBody:
      "Instant triage, readiness scan, and next-step recommendations. We find out if we are a match.",
    bookCall: "Book Strategy Call",
    name: "Farjad",
    tagline: "عاشق وطن، مشتاق به استارتاپ",
    bio: "An immigrant founder, patriot, and deeply passionate about building startups that survive reality.",
    online: "Online",
    readyToTalk: "Ready to talk",
    whatsapp: "WhatsApp",
    directEmail: "Direct Email",
    ashavidNote: "Innovation & Systems",
    northroadNote: "Venture Capital",
  },
  fa: {
    headingLead: "آماده‌اید چیزی بسازید که",
    headingAccent: "دوام بیاورد",
    headingTail: "در واقعیت؟",
    sub: "من برای بنیان‌گذارانی هستم که حاضر نیستند با «اگر» زندگی کنند.",
    availableNow: "ظرفیت باز است",
    diagnosticTitle: "سنجش تناسب استراتژیک",
    diagnosticBody:
      "تشخیص سریع، بررسی آمادگی و پیشنهاد قدم بعدی. معلوم می‌شود به درد هم می‌خوریم یا نه.",
    bookCall: "رزرو جلسه‌ی استراتژی",
    name: "فرجاد",
    tagline: "عاشق وطن، مشتاق به استارتاپ",
    bio: "یک بنیان‌گذار مهاجر که به ساختن استارتاپ‌هایی که در واقعیت دوام می‌آورند دل بسته است.",
    online: "آنلاین",
    readyToTalk: "آماده‌ی گفت‌وگو",
    whatsapp: "واتساپ",
    directEmail: "ایمیل مستقیم",
    ashavidNote: "نوآوری و سیستم",
    northroadNote: "سرمایه‌گذاری خطرپذیر",
  },
} as const

const SOCIALS = [
  { href: "https://t.me/FarjadTalks", label: "Telegram", icon: Navigation },
  { href: "https://instagram.com/FarjadTalks", label: "Instagram", icon: Instagram },
  { href: "https://youtube.com/@FarjadTalks", label: "YouTube", icon: Youtube },
  { href: "https://www.linkedin.com/in/farjadpourmohammad/", label: "LinkedIn", icon: Linkedin },
] as const

function Channel({
  href,
  icon,
  title,
  note,
  external = true,
}: {
  href: string
  icon: ReactNode
  title: string
  note: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex min-h-16 items-center justify-between gap-4 rounded-xl border border-v3-line/80 p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-v3-light/60 hover:bg-v3-ink"
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-v3-line text-v3-soft transition-colors duration-300 group-hover:border-v3-light/60 group-hover:text-v3-light">
          {icon}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-medium text-v3-bone">{title}</span>
          <span className="truncate text-xs text-v3-mute">{note}</span>
        </span>
      </span>
      <MoveUpRight
        aria-hidden
        className="h-4 w-4 shrink-0 text-v3-mute transition-all duration-300 group-hover:text-v3-light rtl:-scale-x-100"
      />
    </a>
  )
}

export function ServiceCta({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale]

  return (
    <section className="relative isolate overflow-hidden border-t border-v3-line/70 bg-v3-ink font-v3-body text-v3-bone">
      <Beam className="[animation-delay:-4s]" />
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-14 px-5 py-24 md:px-10 lg:px-14 lg:py-36">
        {/* ── Statement ─────────────────────────────────────────────── */}
        <Reveal className="flex flex-col gap-6">
          <Headline size="section" className="max-w-5xl md:text-7xl">
            {t.headingLead}{" "}
            <em className="text-v3-light not-italic ltr:italic">{t.headingAccent}</em> {t.headingTail}
          </Headline>
          <p className="max-w-2xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{t.sub}</p>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* ── Booking ─────────────────────────────────────────────── */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="relative flex h-full flex-col justify-between gap-12 rounded-2xl border border-v3-light/50 bg-v3-raise p-7 shadow-[0_0_60px_-30px_rgba(232,196,138,0.5)] md:p-10">
              <div className="flex flex-col gap-5">
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-v3-light/50 px-3 py-1.5 text-[13px] text-v3-light">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)]" />
                  {t.availableNow}
                </span>
                <Headline as="h3" size="card">
                  {t.diagnosticTitle}
                </Headline>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{t.diagnosticBody}</p>
              </div>
              <V3Button href={localePath(locale, "/booking")} locale={locale} className="justify-between self-stretch sm:self-start">
                {t.bookCall}
              </V3Button>
            </div>
          </Reveal>

          {/* ── Direct channels ─────────────────────────────────────── */}
          <Reveal delay={0.16} className="lg:col-span-7">
            <div className="flex h-full flex-col gap-8 rounded-2xl border border-v3-line/80 p-7 md:p-10">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div className="flex flex-col gap-3">
                  <Headline as="h3" size="card">
                    {t.name}
                  </Headline>
                  <p lang="fa" dir="rtl" className="text-sm text-v3-light">
                    {t.tagline}
                  </p>
                  <p className="max-w-md leading-relaxed text-v3-soft rtl:leading-loose">{t.bio}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-v3-line/80 px-4 py-2.5">
                  <span aria-hidden className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-v3-light/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-v3-light" />
                  </span>
                  <span className="flex flex-col text-xs leading-tight">
                    <span className="font-semibold text-v3-bone">{t.online}</span>
                    <span className="text-v3-mute">{t.readyToTalk}</span>
                  </span>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2">
                {SOCIALS.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-v3-line/80 text-v3-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-light/60 hover:text-v3-light"
                    >
                      <Icon aria-hidden className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto grid gap-3 sm:grid-cols-2">
                <Channel
                  href="https://wa.me/14376611674"
                  icon={<MessageCircle aria-hidden className="h-5 w-5" />}
                  title={t.whatsapp}
                  note={<span dir="ltr">+1 (437) 661-1674</span>}
                />
                <Channel
                  href="mailto:farjad@ashavid.ca"
                  external={false}
                  icon={<Mail aria-hidden className="h-5 w-5" />}
                  title={t.directEmail}
                  note={<span dir="ltr">farjad@ashavid.ca</span>}
                />
                <Channel
                  href="https://www.AshaVid.ca"
                  icon={<LinkIcon aria-hidden className="h-4 w-4" />}
                  title="AshaVid"
                  note={t.ashavidNote}
                />
                <Channel
                  href="https://www.NorthRoad.vc"
                  icon={<LinkIcon aria-hidden className="h-4 w-4" />}
                  title="NorthRoad VC"
                  note={t.northroadNote}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
