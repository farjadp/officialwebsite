"use client"

// ============================================================================
// File Path: src/components/v3/intro/showcase.tsx
// Why: Short launch videos of real products, so a reader who has never seen
//      an AI receptionist or an AI-built site can watch one in 30 seconds.
//      None of these is Farjad's work, and the section says so.
//
//      Source: What Ships (whatships.com), an independent directory of launch
//      videos posted on X. Its terms ask that citations name the product and
//      company, link the directory entry and the original X post, and not
//      treat it as a video CDN. So: the poster frame is shown, and the video
//      plays from X's own embed, loaded only when the reader opens it.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion } from "framer-motion"
import { ExternalLink, Play, X as Close } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Dialog } from "radix-ui"

type Kind = "ai" | "web"

type Video = {
  slug: string
  product: string
  company: string
  kind: Kind
  duration: string
  title: string
  body: string
  x: string
}

const VIDEOS: Video[] = [
  {
    slug: "elevenlabs-reception",
    product: "Reception",
    company: "ElevenLabs",
    kind: "ai",
    duration: "۰:۳۳",
    title: "منشی تلفنی هوشمند برای کسب‌وکار کوچک",
    body: "به همه‌ی تماس‌ها جواب می‌دهد، سؤال‌ها را جواب می‌دهد، کار را رزرو می‌کند و پیامک تأیید می‌فرستد.",
    x: "https://x.com/ElevenLabs/status/2100262886916358361",
  },
  {
    slug: "mercury-books",
    product: "Mercury Books",
    company: "Mercury",
    kind: "ai",
    duration: "۰:۳۷",
    title: "حسابداری که خودش مرتب می‌شود",
    body: "هر خرید و فروش همان لحظه دسته‌بندی و با حساب بانکی تطبیق داده می‌شود.",
    x: "https://x.com/immad/status/2100256806413140181",
  },
  {
    slug: "omilo",
    product: "Omilo",
    company: "Omilo",
    kind: "ai",
    duration: "۰:۳۰",
    title: "دو نفر، دو زبان، یک گوشی",
    body: "هر کس به زبان خودش حرف می‌زند و ترجمه را می‌شنود. برای مشتری یا همکاری که زبانتان را بلد نیست.",
    x: "https://x.com/omiloai/status/2102057296339595282",
  },
  {
    slug: "addys-ai",
    product: "Addys AI",
    company: "Addys AI",
    kind: "ai",
    duration: "۰:۳۰",
    title: "از جلسه تا کار انجام‌شده",
    body: "جلسه‌ها و پیام‌ها را می‌خواند، کارهایی که باید انجام شود را درمی‌آورد و خودش انجامشان می‌دهد.",
    x: "https://x.com/tryaddys/status/2100596393765147010",
  },
  {
    slug: "framer-first-site",
    product: "Framer Agent",
    company: "Framer",
    kind: "web",
    duration: "۵:۵۶",
    title: "ساختن سایت با گفت‌وگو",
    body: "از اولین توضیح تا سایت منتشرشده: هوش مصنوعی صفحه را می‌سازد و طراح آن را دقیق می‌کند.",
    x: "https://x.com/framer/status/2099935530091753606",
  },
  {
    slug: "shipper-web-to-app",
    product: "Shipper",
    company: "Shipper",
    kind: "web",
    duration: "۰:۲۵",
    title: "از سایت به اپلیکیشن موبایل",
    body: "آدرس سایت را می‌دهید و نسخه‌ی اپلیکیشن آن برای اپ‌استور ساخته می‌شود.",
    x: "https://x.com/shipper_now/status/2098822916481909072",
  },
  {
    slug: "ai-autocomplete",
    product: "AI Autocomplete",
    company: "AI Autocomplete",
    kind: "web",
    duration: "۰:۴۵",
    title: "جست‌وجوی هوشمند در فروشگاه اینترنتی",
    body: "خریدار همان‌طور که تایپ می‌کند، نتیجه‌ها را فیلتر می‌کند و زودتر به کالای دلخواهش می‌رسد.",
    x: "https://x.com/bradkowalk/status/2099897698006737261",
  },
  {
    slug: "webagent",
    product: "Webagent",
    company: "AgentNet",
    kind: "web",
    duration: "۰:۱۲",
    title: "سایتی که حرف می‌زند",
    body: "از روی محتوای سایت شما دستیاری ساخته می‌شود که به سؤال بازدیدکننده‌ها جواب می‌دهد.",
    x: "https://x.com/TheAgentNet/status/2099187195345330561",
  },
]

const FILTERS: { key: "all" | Kind; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "ai", label: "اتوماسیون و هوش مصنوعی" },
  { key: "web", label: "سایت و اپلیکیشن" },
]

const entry = (slug: string) => `https://whatships.com/videos/${slug}/`
const poster = (slug: string) => `https://whatships.com/posters/${slug}-960.webp`

export function Showcase() {
  const [filter, setFilter] = useState<"all" | Kind>("all")
  const [open, setOpen] = useState<Video | null>(null)
  const list = VIDEOS.filter((v) => filter === "all" || v.kind === filter)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${
              filter === f.key ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:text-v3-bone"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((v, i) => (
            <motion.li
              key={v.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <button
                onClick={() => setOpen(v)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-v3-line text-start transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60"
              >
                <div className="relative aspect-video overflow-hidden bg-v3-raise">
                  <Image
                    src={poster(v.slug)}
                    alt={`${v.product}، ${v.company}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-v3-ink/80 to-transparent" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-v3-bone/90 text-v3-ink shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-v3-light">
                      <Play className="h-5 w-5 translate-x-0.5 fill-current" aria-hidden />
                    </span>
                  </span>
                  <span className="absolute bottom-2 end-2 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">{v.duration}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-xs text-v3-mute" dir="ltr" lang="en">
                    {v.product} · {v.company}
                  </span>
                  <span className="text-lg leading-snug text-v3-bone">{v.title}</span>
                  <span className="text-sm leading-loose text-v3-soft">{v.body}</span>
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Dialog.Root open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            dir="rtl"
            className="fixed top-1/2 left-1/2 z-50 flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-3xl border border-v3-line bg-v3-ink p-5 font-v3-body text-v3-bone shadow-2xl md:p-7"
          >
            {open && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Dialog.Title className="text-xl leading-snug">{open.title}</Dialog.Title>
                    <Dialog.Description className="text-sm text-v3-mute">
                      <span dir="ltr" lang="en">
                        {open.product} · {open.company}
                      </span>
                    </Dialog.Description>
                  </div>
                  <Dialog.Close className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-v3-line hover:border-v3-light" aria-label="بستن">
                    <Close className="h-4 w-4" aria-hidden />
                  </Dialog.Close>
                </div>
                <XEmbed url={open.x} />
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={open.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-v3-light underline-offset-4 hover:underline">
                    پست اصلی در X
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                  <a href={entry(open.slug)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-v3-soft underline-offset-4 hover:underline">
                    در What Ships
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

type Twttr = { widgets: { load: (el?: HTMLElement) => void } }

/** X's own post embed. The script loads only when a video is opened. */
function XEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const w = window as unknown as { twttr?: Twttr }
    const render = () => w.twttr?.widgets.load(el)
    if (w.twttr) {
      render()
      return
    }
    let script = document.getElementById("x-widgets") as HTMLScriptElement | null
    if (!script) {
      script = document.createElement("script")
      script.id = "x-widgets"
      script.src = "https://platform.twitter.com/widgets.js"
      script.async = true
      document.body.appendChild(script)
    }
    script.addEventListener("load", render)
    script.addEventListener("error", () => setFailed(true))
    return () => script?.removeEventListener("load", render)
  }, [url])

  return (
    <div ref={ref} className="min-h-64 [&_iframe]:!mx-auto">
      {failed ? (
        <p className="rounded-2xl border border-v3-line p-6 text-center text-v3-soft">ویدئو اینجا باز نشد. از لینک پست اصلی ببینید.</p>
      ) : (
        <blockquote className="twitter-tweet" data-theme="dark" data-dnt="true" data-conversation="none" data-lang="fa">
          <a href={url} className="text-v3-mute">
            در حال بارگذاری ویدئو…
          </a>
        </blockquote>
      )}
    </div>
  )
}
