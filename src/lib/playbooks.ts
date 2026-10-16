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
