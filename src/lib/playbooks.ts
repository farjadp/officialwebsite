// ============================================================================
// File Path: src/lib/playbooks.ts
// Why: The register of published playbooks, for /playbooks and /fa/playbooks.
//      The third kind of writing on the site, beside essays (why) and reports
//      (what the numbers say): a playbook is how to do one thing, step by
//      step, with commands to copy and a checkpoint at each step.
//
//      Playbooks go stale in a way reports do not: install commands, prices
//      and versions change. So each carries `verified`, the day every command
//      and figure was last checked, and a changelog the page prints.
//
//      To publish one: add an entry here and its component to
//      components/v3/playbooks/registry.tsx under the same slug. The index,
//      both routes, the sitemap and the language switcher pick it up.
// ============================================================================

import type { Locale } from "@/lib/nav"

export type PlaybookMeta = {
  slug: string
  /** Running number shown on the index: 01, 02, … */
  number: number
  /** Publication date, ISO. */
  published: string
  /** The day every command, price and figure was last checked, ISO. */
  verified: string
  /** Set when a published playbook is revised, so lastmod and dateModified move. */
  updated?: string
  readMinutes: number
  /** The one number the playbook is about, shown large on the index and the share card. */
  figure: string
  figureFa?: string
  /** What changed and when, newest first. The page prints it. */
  changelog: { date: string; en: string; fa: string }[]
  copy: Record<
    Locale,
    {
      title: string
      tagline: string
      summary: string
      topic: string
      figureLabel: string
      /** What the reader has when they finish, in one sentence. */
      outcome: string
      /** Who it is for, and what they need to know already. */
      level: string
      /** What it costs to follow, in one line. */
      cost: string
    }
  >
}

export const PLAYBOOKS: PlaybookMeta[] = [
  {
    slug: "animated-science-explainer",
    number: 2,
    published: "2026-10-26",
    verified: "2026-10-26",
    readMinutes: 16,
    figure: "8:20",
    figureFa: "۸:۲۰",
    changelog: [
      {
        date: "2026-10-26",
        en: "First edition. Model names, render flags, loudness targets and the science in the sample script checked against primary sources.",
        fa: "نسخه‌ی اول. نام مدل‌ها، تنظیمات رندر، معیار بلندی صدا و علمِ سناریوی نمونه با منبع‌های اصلی تطبیق داده شد.",
      },
    ],
    copy: {
      en: {
        title: "Animated Science Videos with Claude Code",
        tagline: "Every frame drawn in code, every move on a spoken word",
        summary:
          "A prompt that has Claude Code build a whole animated explainer: space drawn in canvas and WebGL, an original mascot, narration timed to the word, camera moves on springs, sound and a GPU render. How it works, what each part does, and a live version you can scrub on this page.",
        topic: "AI video",
        figureLabel: "the light you see left the Sun this long ago",
        outcome: "A rendered 1080p explainer video in the flat, bright style of channels like Kurzgesagt, built from one HTML file whose every frame is a function of time.",
        level: "Comfortable with a terminal, Python and Node. Expect a few rounds of fixes, not one prompt.",
        cost: "Free with the local voice (kokoro-onnx). ElevenLabs costs per character once you pass its free quota.",
      },
      fa: {
        title: "ویدیوی انیمیشنی علمی با Claude Code",
        tagline: "هر فریم با کد، هر حرکت روی یک کلمه‌ی نریشن",
        summary:
          "پرامپتی که از Claude Code می‌خواهد یک ویدیوی توضیحی انیمیشنی کامل بسازد: فضای کشیده‌شده با Canvas و WebGL، کاراکتر اختصاصی، نریشنی که کلمه‌به‌کلمه با تصویر هماهنگ است، حرکت دوربین فنری، صدا و رندر با GPU. این‌که چطور کار می‌کند، هر بخشش چه می‌کند، و یک نسخه‌ی زنده که همین‌جا می‌توانی جلو و عقبش ببری.",
        topic: "ویدیو با هوش مصنوعی",
        figureLabel: "نوری که می‌بینی این‌قدر پیش از خورشید راه افتاده",
        outcome: "یک ویدیوی توضیحی ۱۰۸۰p به سبک تخت و رنگی کانال‌هایی مثل Kurzgesagt، ساخته‌شده از یک فایل HTML که هر فریمش تابعی از زمان است.",
        level: "آشنایی با ترمینال، Python و Node. انتظار چند دور اصلاح داشته باش، نه یک پرامپت و تمام.",
        cost: "با صدای محلی (kokoro-onnx) رایگان است. ElevenLabs بعد از سهمیه‌ی رایگان به ازای هر کاراکتر پول می‌گیرد.",
      },
    },
  },
  {
    slug: "claude-code-content-team",
    number: 1,
    published: "2026-10-15",
    verified: "2026-10-15",
    readMinutes: 18,
    figure: "9",
    figureFa: "۹",
    changelog: [
      {
        date: "2026-10-15",
        en: "First edition. Install commands, star counts and prices checked against each project's own page.",
        fa: "نسخه‌ی اول. دستورهای نصب، تعداد ستاره‌ها و قیمت‌ها با صفحه‌ی خود هر پروژه تطبیق داده شد.",
      },
    ],
    copy: {
      en: {
        title: "A Content Team Inside Claude Code",
        tagline: "Nine skill sets, six stages, and you approve each one",
        summary:
          "One person with Claude Code can do the work of a content team: find the topic, write it, make the cover, the video and the voice-over, and queue it to publish. How to wire nine open-source skill sets into one pipeline without handing over the final say.",
        topic: "AI workflow",
        figureLabel: "open-source skill sets, one pipeline",
        outcome: "A working pipeline in Claude Code that takes one topic to a drafted post, cover, carousel and video, saved as drafts for you to approve.",
        level: "Comfortable in a terminal. No coding needed beyond pasting commands.",
        cost: "Free to start. Image, voice and scheduling services charge once you pass their free tiers.",
      },
      fa: {
        title: "تیم تولید محتوا در Claude Code",
        tagline: "۹ مجموعه اسکیل، ۶ مرحله، و تأیید هر مرحله با خودت",
        summary:
          "یک نفر با Claude Code می‌تواند کار یک تیم کامل محتوا را انجام دهد: پیدا کردن موضوع، نوشتن، کاور، ویدیو، صدا و انتشار. این‌که چطور ۹ مجموعه اسکیل متن‌باز را به یک خط تولید تبدیل کنی و تصمیم آخر دست خودت بماند.",
        topic: "گردش کار هوش مصنوعی",
        figureLabel: "مجموعه اسکیل متن‌باز، یک خط تولید",
        outcome: "یک خط تولید در Claude Code که یک موضوع را به پست، کاور، کاروسل و ویدیو می‌رساند و همه را برای تأیید تو پیش‌نویس می‌کند.",
        level: "آشنایی با ترمینال کافی است. لازم نیست کد بنویسی؛ فقط دستورها را کپی می‌کنی.",
        cost: "شروعش رایگان است. سرویس‌های تصویر، صدا و زمان‌بندی بعد از سهمیه‌ی رایگان پول می‌گیرند.",
      },
    },
  },
]

export function getPlaybook(slug: string): PlaybookMeta | undefined {
  return PLAYBOOKS.find((p) => p.slug === slug)
}

/** The day a playbook last changed: its revision date, else its publication. */
export function playbookModified(p: PlaybookMeta): string {
  return p.updated ?? p.published
}

/** Newest first. */
export function playbooksByDate(): PlaybookMeta[] {
  return [...PLAYBOOKS].sort((a, b) => b.published.localeCompare(a.published))
}
