"use client"

// ============================================================================
// File Path: src/components/v3/intro/service-tabs.tsx
// Why: The three services of /fa/intro, each explained with an everyday
//      comparison and a small animated picture of what gets built: a site
//      assembling from its wireframe, code turning into a working form, and
//      a pulse of work travelling through an automation.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Bot, Code2, LayoutTemplate } from "lucide-react"
import { useState, type ReactNode } from "react"

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

type Service = {
  key: string
  icon: ReactNode
  tab: string
  like: string
  title: string
  body: string
  examples: string[]
  visual: () => ReactNode
}

const SERVICES: Service[] = [
  {
    key: "web",
    icon: <LayoutTemplate className="h-4 w-4" aria-hidden />,
    tab: "طراحی سایت",
    like: "مثل ویترین مغازه، ولی شبانه‌روز باز",
    title: "سایتی که مشتری در همان چند ثانیه‌ی اول به آن اعتماد کند.",
    body: "بیشتر مشتری‌ها قبل از اینکه زنگ بزنند، سایت شما را روی گوشی نگاه می‌کنند. اگر کند باشد، شلوغ باشد یا دکمه‌ی تماس پیدا نشود، سراغ نفر بعدی می‌روند. سایتی می‌سازم که سریع باز شود، روی گوشی درست دیده شود و مشتری بداند قدم بعدی چیست.",
    examples: ["سایت فارسی و انگلیسی", "رزرو و سفارش آنلاین", "دیده شدن در گوگل", "انیمیشن و طراحی اختصاصی"],
    visual: WebVisual,
  },
  {
    key: "code",
    icon: <Code2 className="h-4 w-4" aria-hidden />,
    tab: "برنامه‌نویسی",
    like: "مثل ابزاری که فقط برای دست شما ساخته شده",
    title: "نرم‌افزاری که دقیقاً به اندازه‌ی کار شماست.",
    body: "گاهی هیچ برنامه‌ی آماده‌ای به کار شما نمی‌خورد: یا زیادی شلوغ است، یا چیزی که لازم دارید را ندارد. آن وقت خودش را می‌نویسم؛ از یک پنل ساده برای ثبت سفارش تا اپلیکیشن موبایل یا سامانه‌ای که چند نرم‌افزار شما را به هم وصل کند.",
    examples: ["پنل مدیریت مشتری", "اپلیکیشن موبایل", "وصل کردن نرم‌افزارها به هم", "داشبورد فروش و گزارش"],
    visual: CodeVisual,
  },
  {
    key: "ai",
    icon: <Bot className="h-4 w-4" aria-hidden />,
    tab: "اتوماسیون با هوش مصنوعی",
    like: "مثل یک همکار که هیچ‌وقت خسته نمی‌شود",
    title: "کارهای تکراری را خودکار می‌کنم تا وقت شما آزاد شود.",
    body: "جواب دادن به سؤال‌های تکراری، هماهنگی وقت، نوشتن فاکتور، وارد کردن اطلاعات مشتری در اکسل، پیگیری کسی که جواب نداده. این‌ها را می‌شود به نرم‌افزار سپرد. هوش مصنوعی جای شما تصمیم نمی‌گیرد؛ فقط کار دستی را برمی‌دارد.",
    examples: ["جواب خودکار به پیام و ایمیل", "رزرو و یادآوری وقت", "فاکتور و حسابداری خودکار", "پیگیری مشتری‌ها"],
    visual: AiVisual,
  },
]

export function ServiceTabs() {
  const [active, setActive] = useState(0)
  const s = SERVICES[active]
  const Visual = s.visual

  return (
    <div className="flex flex-col gap-10">
      <div role="tablist" aria-label="سه کاری که انجام می‌دهم" className="flex flex-wrap gap-2">
        {SERVICES.map((item, i) => (
          <button
            key={item.key}
            role="tab"
            id={`svc-tab-${item.key}`}
            aria-selected={i === active}
            aria-controls={`svc-panel-${item.key}`}
            onClick={() => setActive(i)}
            className={`relative inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 text-base transition-colors ${
              i === active ? "text-v3-ink" : "text-v3-soft hover:text-v3-bone"
            }`}
          >
            {i === active && (
              <motion.span
                layoutId="svc-pill"
                className="absolute inset-0 -z-0 rounded-full bg-v3-light"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2.5">
              {item.icon}
              {item.tab}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={s.key}
          role="tabpanel"
          id={`svc-panel-${s.key}`}
          aria-labelledby={`svc-tab-${s.key}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="grid gap-10 lg:grid-cols-12 lg:items-center"
        >
          <div className="flex flex-col gap-6 lg:col-span-6">
            <p className="text-v3-light">{s.like}</p>
            <h3 className="font-v3-display text-3xl font-light leading-snug text-v3-bone md:text-4xl">{s.title}</h3>
            <p className="text-lg leading-loose text-v3-soft">{s.body}</p>
            <ul className="flex flex-wrap gap-2">
              {s.examples.map((e, i) => (
                <motion.li
                  key={e}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                  className="rounded-full border border-v3-line px-3.5 py-1.5 text-sm text-v3-bone"
                >
                  {e}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <Visual />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── Visuals ─────────────────────────────────────────────────────────── */

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-v3-line bg-v3-raise" role="img" aria-label={label}>
      <div className="flex items-center gap-1.5 border-b border-v3-line/70 px-4 py-3" dir="ltr">
        <span className="h-2.5 w-2.5 rounded-full bg-v3-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-v3-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-v3-line" />
        <span className="ms-3 h-5 flex-1 rounded-md bg-v3-ink/60" />
      </div>
      <div className="relative aspect-[16/11] p-5">{children}</div>
    </div>
  )
}

/** A wireframe that fills in with the finished design, on a loop. */
function WebVisual() {
  const reduce = useReducedMotion()
  const loop = reduce ? {} : { repeat: Infinity, repeatType: "reverse" as const, repeatDelay: 1.6 }
  const fill = (delay: number) => ({
    initial: { backgroundColor: "rgba(51,48,44,0.6)" },
    animate: { backgroundColor: ["rgba(51,48,44,0.6)", "rgb(var(--v3-glow)/0.9)"] },
    transition: { duration: 0.6, delay, ...loop, repeatDelay: 2.4 },
  })
  return (
    <Frame label="اسکلت یک سایت که به طراحی نهایی تبدیل می‌شود">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <motion.span className="h-3 w-20 rounded-full" {...fill(0)} />
          <div className="flex gap-2">
            <span className="h-2 w-8 rounded-full bg-v3-line" />
            <span className="h-2 w-8 rounded-full bg-v3-line" />
            <span className="h-2 w-8 rounded-full bg-v3-line" />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-5 gap-4">
          <div className="col-span-3 flex flex-col justify-center gap-3">
            <motion.span
              className="h-5 rounded-md bg-v3-bone/80"
              initial={{ width: "30%" }}
              animate={{ width: ["30%", "90%"] }}
              transition={{ duration: 0.8, delay: 0.3, ...loop, repeatDelay: 2.2 }}
            />
            <motion.span
              className="h-5 rounded-md bg-v3-bone/80"
              initial={{ width: "20%" }}
              animate={{ width: ["20%", "65%"] }}
              transition={{ duration: 0.8, delay: 0.45, ...loop, repeatDelay: 2.2 }}
            />
            <span className="h-2 w-4/5 rounded-full bg-v3-line" />
            <span className="h-2 w-3/5 rounded-full bg-v3-line" />
            <motion.span className="mt-2 h-9 w-28 rounded-full" {...fill(0.9)} />
          </div>
          <motion.div
            className="col-span-2 rounded-xl"
            initial={{ opacity: 0.3, scale: 0.9 }}
            animate={{ opacity: [0.3, 1], scale: [0.9, 1] }}
            transition={{ duration: 0.8, delay: 0.6, ...loop, repeatDelay: 2.2 }}
          >
            <div className="h-full w-full rounded-xl bg-linear-to-br from-v3-light/60 via-v3-light/20 to-transparent" />
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1.1, 1.25, 1.4].map((d) => (
            <motion.span
              key={d}
              className="h-12 rounded-lg border border-v3-line"
              initial={{ y: 10, opacity: 0.3 }}
              animate={{ y: [10, 0], opacity: [0.3, 1] }}
              transition={{ duration: 0.5, delay: d, ...loop, repeatDelay: 2.2 }}
            />
          ))}
        </div>
      </div>
    </Frame>
  )
}

const CODE = [
  "const booking = await db.booking.create({",
  "  name: form.name,",
  "  time: form.time,",
  "})",
  "await sendSMS(booking.phone, reminder)",
]

/** Lines of code type out, and the form they produce appears beside them. */
function CodeVisual() {
  const reduce = useReducedMotion()
  return (
    <Frame label="چند خط کد که به یک فرم رزرو تبدیل می‌شود">
      <div className="grid h-full grid-cols-2 gap-4">
        <div dir="ltr" className="flex flex-col gap-1.5 overflow-hidden rounded-lg bg-v3-ink/70 p-3 font-mono text-[10px] leading-relaxed text-v3-soft sm:text-xs">
          {CODE.map((line, i) => (
            <motion.span
              key={line}
              className="block overflow-hidden whitespace-pre"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, delay: i * 0.55, ease: "linear", repeat: reduce ? 0 : Infinity, repeatDelay: CODE.length * 0.55 + 1.5 - 0.7 }}
            >
              <span className={i === 4 ? "text-v3-light" : undefined}>{line}</span>
            </motion.span>
          ))}
        </div>
        <motion.div
          className="flex flex-col justify-center gap-3 rounded-lg border border-v3-line p-4"
          initial={reduce ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <span className="text-sm text-v3-bone">رزرو وقت</span>
          <span className="h-8 rounded-md border border-v3-line bg-v3-ink/50 px-2 text-xs leading-8 text-v3-mute">نام شما</span>
          <span className="h-8 rounded-md border border-v3-line bg-v3-ink/50 px-2 text-xs leading-8 text-v3-mute">پنجشنبه · ۴ بعدازظهر</span>
          <motion.span
            className="grid h-9 place-items-center rounded-full bg-v3-light text-xs font-semibold text-v3-ink"
            animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 2 }}
          >
            ثبت رزرو
          </motion.span>
        </motion.div>
      </div>
    </Frame>
  )
}

const NODES = ["پیام مشتری", "هوش مصنوعی می‌خواند", "جواب و رزرو", "ثبت در تقویم"]

/** A pulse of light travels through four steps of an automation. */
function AiVisual() {
  const reduce = useReducedMotion()
  return (
    <Frame label="مسیر یک کار خودکار از پیام مشتری تا ثبت در تقویم">
      <div className="relative flex h-full flex-col justify-between py-2">
        <div className="absolute inset-y-6 start-[1.1rem] w-px bg-v3-line" aria-hidden />
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute start-[0.85rem] h-3 w-3 rounded-full bg-v3-light shadow-[0_0_18px_4px_rgb(var(--v3-glow)/0.6)]"
            animate={{ top: ["6%", "88%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          />
        )}
        {NODES.map((n, i) => (
          <motion.div
            key={n}
            className="relative flex items-center gap-4"
            animate={reduce ? undefined : { opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 3.8, repeat: Infinity, delay: i * 0.8, times: [0, 0.15, 0.4] }}
          >
            <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-v3-light/60 bg-v3-ink text-sm text-v3-light">
              {["۱", "۲", "۳", "۴"][i]}
            </span>
            <span className="rounded-xl border border-v3-line bg-v3-ink/60 px-4 py-2.5 text-sm text-v3-bone">{n}</span>
          </motion.div>
        ))}
      </div>
    </Frame>
  )
}
