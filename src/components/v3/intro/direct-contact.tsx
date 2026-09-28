"use client"

// ============================================================================
// File Path: src/components/v3/intro/direct-contact.tsx
// Why: The personal way in on /fa/intro: phone, WhatsApp, email and the
//      channels, for a reader who would rather message a person than book a
//      slot. The details are the ones already public on /contact and in the
//      footer; keep them in step with those files if they change.
//      Phone and email copy to the clipboard with a small confirmation.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Instagram, Linkedin, Mail, MessageCircle, Phone, Send, Youtube } from "lucide-react"
import { useState, type ReactNode } from "react"

const PHONE = "+1 (437) 661-1674"
const PHONE_E164 = "+14376611674"
const EMAIL = "farjad@ashavid.ca"

type Channel = { href: string; label: string; handle: string; body: string; icon: ReactNode }

const CHANNELS: Channel[] = [
  {
    href: "https://t.me/FarjadTalks",
    label: "کانال تلگرام",
    handle: "@FarjadTalks",
    body: "یادداشت‌های کوتاه درباره‌ی هوش مصنوعی و کسب‌وکار، به فارسی.",
    icon: <Send className="h-5 w-5" aria-hidden />,
  },
  {
    href: "https://t.me/Heros_Journey",
    label: "سفر قهرمان",
    handle: "@Heros_Journey",
    body: "کانال تلگرام دوم؛ روایت‌ها و تجربه‌های مسیر.",
    icon: <Send className="h-5 w-5" aria-hidden />,
  },
  {
    href: "https://youtube.com/@FarjadTalks",
    label: "یوتیوب",
    handle: "@FarjadTalks",
    body: "ویدئوهای آموزشی و گفت‌وگوها.",
    icon: <Youtube className="h-5 w-5" aria-hidden />,
  },
  {
    href: "https://instagram.com/FarjadTalks",
    label: "اینستاگرام",
    handle: "@FarjadTalks",
    body: "پشت صحنه و نکته‌های کوتاه.",
    icon: <Instagram className="h-5 w-5" aria-hidden />,
  },
  {
    href: "https://www.linkedin.com/in/farjadpourmohammad/",
    label: "لینکدین",
    handle: "farjadpourmohammad",
    body: "سوابق کاری و نوشته‌های انگلیسی.",
    icon: <Linkedin className="h-5 w-5" aria-hidden />,
  },
]

export function DirectContact() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 md:grid-cols-3">
        <PrimaryCard
          icon={<Phone className="h-6 w-6" aria-hidden />}
          label="تماس تلفنی"
          value={PHONE}
          href={`tel:${PHONE_E164}`}
          action="زنگ بزنید"
          copy={PHONE}
        />
        <PrimaryCard
          icon={<MessageCircle className="h-6 w-6" aria-hidden />}
          label="واتساپ"
          value={PHONE}
          href={`https://wa.me/${PHONE_E164.slice(1)}`}
          action="پیام بدهید"
          external
          highlight
        />
        <PrimaryCard
          icon={<Mail className="h-6 w-6" aria-hidden />}
          label="ایمیل"
          value={EMAIL}
          href={`mailto:${EMAIL}`}
          action="ایمیل بزنید"
          copy={EMAIL}
        />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CHANNELS.map((c, i) => (
          <motion.li
            key={c.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-3 rounded-2xl border border-v3-line p-5 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise"
            >
              <span className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-v3-line text-v3-soft transition-colors group-hover:border-v3-light group-hover:text-v3-light">
                  {c.icon}
                </span>
                <span className="text-xs text-v3-mute" dir="ltr">
                  {c.handle}
                </span>
              </span>
              <span className="text-lg text-v3-bone">{c.label}</span>
              <span className="text-sm leading-loose text-v3-soft">{c.body}</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function PrimaryCard({
  icon,
  label,
  value,
  href,
  action,
  copy,
  external = false,
  highlight = false,
}: {
  icon: ReactNode
  label: string
  value: string
  href: string
  action: string
  copy?: string
  external?: boolean
  highlight?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const doCopy = async () => {
    if (!copy) return
    try {
      await navigator.clipboard.writeText(copy)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the value
      // is still on screen to copy by hand, so there is nothing to recover.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col gap-5 overflow-hidden rounded-3xl border p-7 transition-colors duration-500 ${
        highlight
          ? "border-v3-light/70 bg-v3-raise shadow-[0_0_80px_-30px_rgb(var(--v3-glow)/0.55)]"
          : "border-v3-line hover:border-v3-light/50"
      }`}
    >
      <span className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-v3-light/15 text-v3-light">{icon}</span>
        {copy && (
          <button
            onClick={doCopy}
            className="relative inline-flex min-h-10 items-center gap-1.5 rounded-full border border-v3-line px-3 text-xs text-v3-soft transition-colors hover:border-v3-light hover:text-v3-light"
            aria-label={`کپی ${label}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-v3-light">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  کپی شد
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  کپی
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm text-v3-mute">{label}</span>
        <span className="text-xl text-v3-bone md:text-2xl" dir="ltr">
          {value}
        </span>
      </span>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`inline-flex min-h-12 items-center justify-center rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
          highlight ? "bg-v3-light text-v3-ink" : "bg-v3-bone text-v3-ink hover:bg-v3-light"
        }`}
      >
        {action}
      </a>
    </motion.div>
  )
}
