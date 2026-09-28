"use client"

// ============================================================================
// File Path: src/components/v3/intro/project-showcase.tsx
// Why: The "built myself" section of /fa/intro, as real products the reader
//      can see: nine of Farjad's own projects, each in a browser frame with a
//      screenshot. Hovering a card tilts it toward the cursor and scrolls the
//      screenshot like a page preview; clicking opens it large with links.
//
//      Screenshots (public/images/intro/projects/) were captured on 27 Sep
//      2026 at 1440×900 from each live site; AlphaBoard from its repo run
//      locally with live market data, Gheychee Premium from its own static
//      site. Darban is a Telegram bot with no web page, so its frame shows an
//      animated mock of what it actually does (per its README) instead.
//
//      Descriptions come from each project's README and product docs. Links
//      point only at URLs that were checked to answer and to be his.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { ExternalLink, Github, Maximize2, Send, X as Close } from "lucide-react"
import Image from "next/image"
import { useState, type PointerEvent, type ReactNode } from "react"
import { Dialog } from "radix-ui"

type Kind = "ai" | "commerce" | "platform" | "bot"

type Project = {
  key: string
  name: string
  kind: Kind
  tag: string
  title: string
  body: string
  more: string
  shot?: string
  live?: { href: string; label: string }
  code?: string
}

const PROJECTS: Project[] = [
  {
    key: "contivo",
    name: "Contivo",
    kind: "ai",
    tag: "هوش مصنوعی · بازاریابی",
    title: "دستیار بازاریابی که سایت شما را می‌خواند",
    body: "آدرس سایت را می‌دهید؛ برندتان را می‌شناسد، رقبای واقعی‌تان را پیدا می‌کند و فقط محتوایی می‌نویسد که از فیلتر کیفیت رد شود.",
    more: "از سایت شما «حافظه‌ی برند» می‌سازد، نقشه‌ی رقبا و کلمه‌های کلیدی‌ای را که آن‌ها جا انداخته‌اند درمی‌آورد، ایده و محتوا تولید می‌کند و انتشارش را زمان‌بندی می‌کند. گزارش تحلیل بازار را هم به‌صورت PDF می‌دهد.",
    shot: "/images/intro/projects/contivo.webp",
    live: { href: "https://contivo-red.vercel.app", label: "دیدن سایت" },
    code: "https://github.com/farjadp/contivo",
  },
  {
    key: "upsidetree",
    name: "Upside Tree",
    kind: "commerce",
    tag: "فروشگاه اینترنتی",
    title: "فروشگاه دوزبانه برای یک برند ایرانی",
    body: "فروشگاهی فارسی و انگلیسی با پرداخت آنلاین، و سفارش‌هایی که خودکار چاپ و ارسال می‌شوند.",
    more: "پرداخت با Stripe، اتصال به Printful برای چاپ و ارسال خودکار سفارش، پنل مدیریت کامل برای محصول و مشتری، کد تخفیف و سیستم امتیاز وفاداری. طراحی‌اش از هویت فرهنگی ایران گرفته شده.",
    shot: "/images/intro/projects/upsidetree.webp",
    live: { href: "https://upside-tree.vercel.app", label: "دیدن سایت" },
    code: "https://github.com/farjadp/UpsideTree",
  },
  {
    key: "visaroads",
    name: "VisaRoads",
    kind: "platform",
    tag: "سایت · تولید محتوا",
    title: "سایت مجموعه‌ی منتورشیپ استارتاپ ویزا",
    body: "سایت مجموعه‌ای که خودم بنیان گذاشته‌ام؛ دوزبانه، با نویسنده‌ی هوش مصنوعی که مقاله و تصویر می‌سازد.",
    more: "راهنمای مسیرهای استارتاپ ویزا در دانمارک، هلند، فنلاند و کانادا. پنل مدیریت مقاله‌ها، نویسنده‌ی خودکار محتوا با تصویرسازی، و ساختار سئو برای اینکه در گوگل و موتورهای جست‌وجوی هوش مصنوعی پیدا شود.",
    shot: "/images/intro/projects/visaroads.webp",
    live: { href: "https://visaroads.com", label: "دیدن سایت" },
    code: "https://github.com/farjadp/startupvisaroads",
  },
  {
    key: "gheychee",
    name: "Gheychee Premium",
    kind: "bot",
    tag: "ربات تلگرام",
    title: "ربات دانلود، با اشتراک پولی",
    body: "لینک را به ربات می‌فرستید و فایل ویدیو یا صدا در همان چت برمی‌گردد؛ از بیش از ۱۰۰۰ سایت.",
    more: "ربات دوزبانه‌ی تلگرام با انتخاب کیفیت و جدا کردن صدا، اشتراک ماهانه، سایت معرفی و داشبورد کاربر، و پنل مدیریت برای پلن‌ها، پرداخت‌ها و پیام همگانی.",
    shot: "/images/intro/projects/gheychee.webp",
    live: { href: "https://t.me/gheychipremium_bot", label: "باز کردن ربات" },
    code: "https://github.com/farjadp/Gheychi-Premium",
  },
  {
    key: "alphaboard",
    name: "AlphaBoard",
    kind: "ai",
    tag: "هوش مصنوعی · داشبورد",
    title: "داشبورد معامله‌گری با تحلیل هوش مصنوعی",
    body: "قیمت لحظه‌ای بیش از ۶۰ دارایی در یک صفحه، و تحلیلی که وقتی شک دارد می‌گوید «صبر کن».",
    more: "کریپتو، طلا، شاخص‌ها و نفت کنار هم. موتور تحلیل با GPT-4o سطح‌های حمایت و مقاومت و محدوده‌ی ورود را درمی‌آورد و طوری تنظیم شده که به‌جای سیگنال‌های پرریسک، «صبر» پیشنهاد بدهد. ابزاری شخصی است، نه توصیه‌ی مالی.",
    shot: "/images/intro/projects/alphaboard.webp",
    code: "https://github.com/farjadp/AlphaBoard",
  },
  {
    key: "verixa",
    name: "Verixa",
    kind: "platform",
    tag: "پلتفرم · رزرو",
    title: "بازار مشاوران رسمی مهاجرت کانادا",
    body: "مراجع مشاور تأییدشده را پیدا می‌کند، نظرها را می‌بیند و همان‌جا وقت می‌گیرد.",
    more: "پروفایل‌های تأییدشده، رزرو پنج‌مرحله‌ای که تداخل وقت را غیرممکن می‌کند، پنل جدا برای مراجع، مشاور و مدیر، ایمیل‌های خودکار، و محتوایی که هوش مصنوعی برای دیده شدن در گوگل می‌سازد.",
    shot: "/images/intro/projects/verixa.webp",
    live: { href: "https://verixa-beige.vercel.app", label: "دیدن سایت" },
    code: "https://github.com/farjadp/verixa",
  },
  {
    key: "darban",
    name: "Darban",
    kind: "bot",
    tag: "ربات تلگرام",
    title: "دربان کانال‌ها و گروه‌های تلگرام",
    body: "رأی‌گیری با دکمه به‌جای ری‌اکشن، صبر برای عضوهای تازه، و هشدار حمله‌ی هماهنگ.",
    more: "ری‌اکشن‌های خود تلگرام را نمی‌شود کنترل کرد؛ دربان جایشان را با دکمه می‌گیرد تا هر رأی پیش از شمرده شدن بررسی شود. عضوهای تازه باید مدتی صبر کنند، و اگر موجی از رأی‌های هماهنگ برسد، به مدیر گزارش می‌دهد. هیچ‌کس را خودکار بیرون نمی‌کند.",
    code: "https://github.com/farjadp/Darban",
  },
  {
    key: "hubweld",
    name: "HubWeld",
    kind: "platform",
    tag: "پلتفرم · فروشگاه",
    title: "شبکه‌ی جوشکاری و ساخت فلزی",
    body: "صاحب پروژه کار ثبت می‌کند و جوشکارها و کارگاه‌های تأییدشده برایش پیشنهاد می‌دهند.",
    more: "آگهی کار، پروفایل جوشکارها، فروشگاه قطعات و ابزار جوشکاری، و بلاگی که هوش مصنوعی به‌صورت خودکار برایش مقاله می‌نویسد. قیمت‌ها به دلار کانادا نمایش داده می‌شود.",
    shot: "/images/intro/projects/hubweld.webp",
    live: { href: "https://hubweld.ca", label: "دیدن سایت" },
    code: "https://github.com/farjadp/hubweld",
  },
  {
    key: "vellamo",
    name: "Vellamo",
    kind: "platform",
    tag: "سایت · سه‌بعدی",
    title: "سایت یک شرکت فنلاندی پایش سازه",
    body: "سایت سه‌زبانه برای شرکتی که سلامت اسکله‌ها و سازه‌های دریایی را در آب یخ پایش می‌کند.",
    more: "انگلیسی، فنلاندی و سوئدی، با یک صحنه‌ی سه‌بعدی تعاملی از سازه‌ی زیر آب در صفحه‌ی اول. برای شرکتی که با حسگر و مدل فیزیکی، جای غواصی هر چند سال یک بار را می‌گیرد.",
    shot: "/images/intro/projects/vellamo.webp",
    live: { href: "https://vellamo-jet.vercel.app", label: "دیدن سایت" },
    code: "https://github.com/farjadp/vellamo",
  },
]

const FILTERS: { key: "all" | Kind; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "ai", label: "هوش مصنوعی" },
  { key: "platform", label: "پلتفرم و سایت" },
  { key: "commerce", label: "فروشگاه" },
  { key: "bot", label: "ربات تلگرام" },
]

/** What the frame's address bar shows. A Telegram link is only meaningful with its handle. */
const host = (href: string) => {
  const u = new URL(href)
  const h = u.host.replace(/^www\./, "")
  return h === "t.me" ? `${h}${u.pathname}` : h
}

export function ProjectShowcase() {
  const [filter, setFilter] = useState<"all" | Kind>("all")
  const [open, setOpen] = useState<Project | null>(null)
  const list = PROJECTS.filter((p) => filter === "all" || p.kind === filter)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`relative min-h-11 rounded-full border px-4 text-sm transition-colors ${
                filter === f.key ? "border-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:text-v3-bone"
              }`}
            >
              {filter === f.key && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full bg-v3-light"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>
        <span className="text-sm text-v3-mute">روی هر کدام بزنید تا بزرگ‌تر ببینید.</span>
      </div>

      <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.key}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard project={p} onOpen={() => setOpen(p)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Dialog.Root open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm" />
          <Dialog.Content
            dir="rtl"
            className="fixed top-1/2 left-1/2 z-50 flex max-h-[92dvh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-3xl border border-v3-line bg-v3-ink p-5 font-v3-body text-v3-bone shadow-2xl md:p-8"
          >
            {open && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm text-v3-light">{open.tag}</span>
                    <Dialog.Title className="font-v3-display text-2xl leading-snug md:text-3xl">{open.title}</Dialog.Title>
                    <span className="text-sm text-v3-mute" dir="ltr" lang="en">
                      {open.name}
                    </span>
                  </div>
                  <Dialog.Close
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-v3-line transition-colors hover:border-v3-light"
                    aria-label="بستن"
                  >
                    <Close className="h-4 w-4" aria-hidden />
                  </Dialog.Close>
                </div>
                <BrowserFrame url={open.live ? host(open.live.href) : open.name}>
                  <Screen project={open} large />
                </BrowserFrame>
                <Dialog.Description className="text-lg leading-loose text-v3-soft">{open.more}</Dialog.Description>
                <Links project={open} />
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

/** A card that leans toward the cursor and previews its page on hover. */
function TiltCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 })
  const glowX = useTransform(mx, (v) => `${v * 100}%`)
  const glowY = useTransform(my, (v) => `${v * 100}%`)
  const glow = useTransform([glowX, glowY], ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgb(var(--v3-glow)/0.16), transparent 60%)`)

  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const leave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onPointerMove={move}
      onPointerLeave={leave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-v3-line bg-v3-raise text-start transition-colors duration-500 hover:border-v3-light/60"
      aria-label={`${project.title}، ${project.name}. برای دیدن جزئیات بزنید`}
    >
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glow }} />
      <div className="p-3 pb-0">
        <BrowserFrame url={project.live ? host(project.live.href) : project.name} compact>
          <Screen project={project} />
        </BrowserFrame>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-v3-light">{project.tag}</span>
          {project.live ? (
            <span className="flex items-center gap-1.5 text-xs text-v3-mute">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              آنلاین
            </span>
          ) : (
            <span className="text-xs text-v3-mute">کد منبع باز</span>
          )}
        </div>
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-xl leading-snug text-v3-bone">{project.title}</span>
        </span>
        <span className="text-sm text-v3-mute" dir="ltr" lang="en">
          {project.name}
        </span>
        <span className="leading-loose text-v3-soft">{project.body}</span>
        <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm text-v3-mute transition-colors group-hover:text-v3-light">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          بزرگ‌تر ببینید
        </span>
      </div>
    </motion.button>
  )
}

function BrowserFrame({ url, children, compact = false }: { url: string; children: ReactNode; compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-v3-line bg-v3-ink">
      <div className={`flex items-center gap-1.5 border-b border-v3-line/70 px-3 ${compact ? "py-2" : "py-2.5"}`} dir="ltr">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
        <span className="ms-2 flex-1 truncate rounded-md bg-v3-raise px-2.5 py-0.5 text-[11px] text-v3-mute">{url}</span>
      </div>
      {children}
    </div>
  )
}

/** The screenshot, which scrolls down a little on hover like a page preview. */
function Screen({ project, large = false }: { project: Project; large?: boolean }) {
  if (!project.shot) return <DarbanMock large={large} />
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-v3-raise">
      <Image
        src={project.shot}
        alt={`تصویر صفحه‌ی اول ${project.name}`}
        fill
        sizes={large ? "(max-width: 1024px) 100vw, 900px" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        className={`object-cover object-top ${large ? "" : "transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"}`}
      />
    </div>
  )
}

/**
 * Darban has no web page. This is what it does in a Telegram channel, per its
 * README: votes through an inline keyboard, a wait for newcomers, and a
 * brigading alert that goes to an admin rather than removing anyone.
 */
function DarbanMock({ large }: { large: boolean }) {
  const reduce = useReducedMotion()
  const [up, setUp] = useState(128)
  // In the grid this sits inside the card's own <button>, and a button may
  // not contain another. Only the enlarged view gets a real, tappable vote.
  const Vote = large ? motion.button : motion.span
  return (
    <div className={`relative flex flex-col gap-2.5 overflow-hidden bg-[#17212b] p-4 ${large ? "aspect-[16/10] md:p-8" : "aspect-[16/10]"}`} dir="rtl">
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2b5278] text-[10px] text-white">د</span>
        کانال نمونه · دربان فعال است
      </div>
      <div className="max-w-[88%] rounded-2xl rounded-ss-md bg-[#182533] p-3 text-xs leading-relaxed text-white/90 ring-1 ring-white/5">
        گزارش امروز منتشر شد. نظرتان چیست؟
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <Vote
            {...(large ? { type: "button" as const, onClick: () => setUp((n) => n + 1), whileTap: { scale: 0.94 } } : {})}
            className="rounded-lg bg-[#2b5278] py-1.5 text-center text-white"
          >
            👍{" "}
            <motion.span key={up} initial={reduce ? false : { y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
              {up.toLocaleString("fa-IR")}
            </motion.span>
          </Vote>
          <span className="rounded-lg bg-[#2b5278] py-1.5 text-center text-white">👎 {(9).toLocaleString("fa-IR")}</span>
        </div>
      </div>
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="max-w-[80%] self-end rounded-xl bg-[#2b5278]/40 px-3 py-2 text-[11px] leading-relaxed text-white/80"
      >
        عضو تازه: رأی شما بعد از ۲۴ ساعت شمرده می‌شود.
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9 }}
        className="mt-auto flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-[11px] leading-relaxed text-amber-100"
      >
        <Send className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
        به مدیر: ۴۰ رأی در ۲ دقیقه از حساب‌های تازه. کسی حذف نشد؛ تصمیم با شماست.
      </motion.div>
    </div>
  )
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-3">
      {project.live && (
        <a
          href={project.live.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-v3-light px-6 font-semibold text-v3-ink transition-transform hover:-translate-y-0.5"
        >
          {project.live.label}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      )}
      {project.code && (
        <a
          href={project.code}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-v3-line px-6 text-v3-bone transition-colors hover:border-v3-light hover:text-v3-light"
        >
          <Github className="h-4 w-4" aria-hidden />
          کد در گیت‌هاب
        </a>
      )}
    </div>
  )
}
