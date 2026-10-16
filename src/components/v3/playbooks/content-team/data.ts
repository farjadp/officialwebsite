// ============================================================================
// File Path: src/components/v3/playbooks/content-team/data.ts
// Why: The facts behind playbook 01: the nine tools, the six stages, the
//      prerequisites, the builder's options and the 24 camera moves. Short
//      labels sit here in both languages beside the facts they describe, so
//      a star count and its label cannot drift apart; the prose is in copy.ts.
//
//      Star counts, licences and install commands were read from each
//      project's GitHub page and README on 2026-10-15 (see VERIFIED). Stars
//      move every day; the page prints them small, with that date.
// ============================================================================

import type { Locale } from "@/lib/nav"

export const VERIFIED = "2026-10-15"

type L = Record<Locale, string>

export type StageId = "topic" | "write" | "image" | "video" | "voice" | "publish"
export type ToolId =
  | "last30days"
  | "marketingskills"
  | "humanizer"
  | "baoyu"
  | "slides"
  | "hyperframes"
  | "videouse"
  | "elevenlabs"
  | "postiz"

/** "free": nothing to pay or sign up for. "key": works free, some parts need an API key. "paid": costs money past a free tier or trial. */
export type CostKind = "free" | "key" | "paid"

export type Tool = {
  id: ToolId
  name: string
  repo: string
  href: string
  /** Thousands of GitHub stars on VERIFIED. */
  stars: number
  license: string
  stage: StageId
  role: L
  install: string
  cost: CostKind
  costNote: L
  /** Environment variables or logins it needs, if any. */
  keys: string[]
  /** Local software it needs beyond Claude Code. */
  needs: ("node" | "python" | "ffmpeg")[]
}

export const TOOLS: Tool[] = [
  {
    id: "last30days",
    name: "last30days",
    repo: "mvanhorn/last30days-skill",
    href: "https://github.com/mvanhorn/last30days-skill",
    stars: 64.4,
    license: "MIT",
    stage: "topic",
    role: { en: "Finds what people discussed in the last 30 days", fa: "بحث‌های ۳۰ روز اخیر را پیدا می‌کند" },
    install: "/plugin marketplace add mvanhorn/last30days-skill\n/plugin install last30days",
    cost: "key",
    costNote: { en: "Reddit, HN, GitHub free; other networks need keys", fa: "Reddit، HN و GitHub رایگان؛ بقیه کلید می‌خواهند" },
    keys: [],
    needs: ["python"],
  },
  {
    id: "marketingskills",
    name: "marketingskills",
    repo: "coreyhaines31/marketingskills",
    href: "https://github.com/coreyhaines31/marketingskills",
    stars: 54.9,
    license: "MIT",
    stage: "write",
    role: { en: "Copywriting, editing, social posts, content strategy", fa: "کپی‌رایتینگ، ویرایش، پست شبکه‌ها، استراتژی محتوا" },
    install: "npx skills add coreyhaines31/marketingskills -g -a claude-code",
    cost: "free",
    costNote: { en: "Nothing", fa: "هیچ" },
    keys: [],
    needs: ["node"],
  },
  {
    id: "humanizer",
    name: "humanizer",
    repo: "blader/humanizer",
    href: "https://github.com/blader/humanizer",
    stars: 57.3,
    license: "MIT",
    stage: "write",
    role: { en: "Final pass that removes the marks of AI writing", fa: "ویرایش آخر؛ نشانه‌های نوشتار ماشینی را برمی‌دارد" },
    install: "/plugin marketplace add blader/humanizer\n/plugin install humanizer@humanizer",
    cost: "free",
    costNote: { en: "Nothing", fa: "هیچ" },
    keys: [],
    needs: [],
  },
  {
    id: "baoyu",
    name: "baoyu-skills",
    repo: "JimLiu/baoyu-skills",
    href: "https://github.com/JimLiu/baoyu-skills",
    stars: 26.7,
    license: "MIT",
    stage: "image",
    role: { en: "Covers, infographics, SVG diagrams", fa: "کاور، اینفوگرافیک، دیاگرام SVG" },
    install: "npx skills add jimliu/baoyu-skills -g -a claude-code",
    cost: "key",
    costNote: { en: "Covers need an image-model key; diagrams are free", fa: "کاور کلید سرویس تصویر می‌خواهد؛ دیاگرام رایگان" },
    keys: ["OPENAI_API_KEY"],
    needs: ["node"],
  },
  {
    id: "slides",
    name: "frontend-slides",
    repo: "zarazhangrui/frontend-slides",
    href: "https://github.com/zarazhangrui/frontend-slides",
    stars: 30.7,
    license: "MIT",
    stage: "image",
    role: { en: "Slides as one HTML file, exported to PDF", fa: "اسلاید در یک فایل HTML، با خروجی PDF" },
    install: "/plugin marketplace add https://github.com/zarazhangrui/frontend-slides\n/plugin install frontend-slides@frontend-slides",
    cost: "free",
    costNote: { en: "Nothing", fa: "هیچ" },
    keys: [],
    needs: ["node"],
  },
  {
    id: "hyperframes",
    name: "HyperFrames",
    repo: "heygen-com/hyperframes",
    href: "https://github.com/heygen-com/hyperframes",
    stars: 64.6,
    license: "Apache-2.0",
    stage: "video",
    role: { en: "Video from HTML, CSS and GSAP, rendered to MP4", fa: "ویدیو از HTML و CSS و GSAP، با خروجی MP4" },
    install: "npx hyperframes skills update",
    cost: "free",
    costNote: { en: "No render fees, no commercial cap", fa: "بدون هزینه‌ی رندر و سقف تجاری" },
    keys: [],
    needs: ["node", "ffmpeg"],
  },
  {
    id: "videouse",
    name: "video-use",
    repo: "browser-use/video-use",
    href: "https://github.com/browser-use/video-use",
    stars: 29.0,
    license: "MIT",
    stage: "video",
    role: { en: "Edits footage you shot into a final.mp4", fa: "فیلمی که خودت گرفته‌ای را تدوین می‌کند" },
    install: "git clone https://github.com/browser-use/video-use ~/video-use\nln -s ~/video-use ~/.claude/skills/video-use",
    cost: "paid",
    costNote: { en: "ElevenLabs Scribe for transcripts", fa: "ElevenLabs Scribe برای متن گفتار" },
    keys: ["ELEVENLABS_API_KEY"],
    needs: ["python", "ffmpeg"],
  },
  {
    id: "elevenlabs",
    name: "elevenlabs/skills",
    repo: "elevenlabs/skills",
    href: "https://github.com/elevenlabs/skills",
    stars: 0.49,
    license: "MIT",
    stage: "voice",
    role: { en: "Voice-over, music, sound effects, dubbing", fa: "گویندگی، موسیقی، افکت، دوبله" },
    install: "npx skills add elevenlabs/skills -g -a claude-code",
    cost: "paid",
    costNote: { en: "Free quota, then billed per minute", fa: "سهمیه‌ی رایگان، بعد هزینه به ازای دقیقه" },
    keys: ["ELEVENLABS_API_KEY"],
    needs: ["node"],
  },
  {
    id: "postiz",
    name: "Postiz",
    repo: "gitroomhq/postiz-app",
    href: "https://github.com/gitroomhq/postiz-app",
    stars: 37.2,
    license: "AGPL-3.0",
    stage: "publish",
    role: { en: "Schedules to 14 networks, through MCP", fa: "زمان‌بندی در ۱۴ شبکه، از طریق MCP" },
    install: "claude mcp add --transport http postiz https://mcp.postiz.com/mcp-oauth-dynamic",
    cost: "paid",
    costNote: { en: "7-day trial, then from $29/month; or self-host", fa: "۷ روز آزمایشی، بعد از ۲۹ دلار در ماه؛ یا سرور خودت" },
    keys: ["Postiz login (OAuth)"],
    needs: [],
  },
]

export const TOOL = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, Tool>

export const STAGES: { id: StageId; tools: ToolId[] }[] = [
  { id: "topic", tools: ["last30days"] },
  { id: "write", tools: ["marketingskills", "humanizer"] },
  { id: "image", tools: ["baoyu", "slides"] },
  { id: "video", tools: ["hyperframes", "videouse"] },
  { id: "voice", tools: ["elevenlabs"] },
  { id: "publish", tools: ["postiz"] },
]

/** What a reader must have before installing anything, and how to check. */
export const PREREQS: { id: string; name: string; check: string; for: L }[] = [
  { id: "claude", name: "Claude Code", check: "claude --version", for: { en: "Everything", fa: "همه" } },
  { id: "node", name: "Node.js 18+", check: "node -v", for: { en: "HyperFrames, npx skills installs", fa: "HyperFrames، نصب با npx skills" } },
  { id: "python", name: "Python 3", check: "python3 --version", for: { en: "video-use, some baoyu skills", fa: "video-use، بعضی اسکیل‌های baoyu" } },
  { id: "ffmpeg", name: "ffmpeg", check: "ffmpeg -version", for: { en: "video-use, HyperFrames", fa: "video-use، HyperFrames" } },
]

// ── The pipeline builder ────────────────────────────────────────────────────

export type NeedId = "posts" | "visuals" | "carousel" | "motion" | "footage" | "voice" | "schedule"

/** What the reader makes, and the tools each choice brings in. Topic research is always on. */
export const NEEDS: { id: NeedId; tools: ToolId[]; label: L; hint: L }[] = [
  { id: "posts", tools: ["marketingskills"], label: { en: "Written posts", fa: "پست متنی" }, hint: { en: "LinkedIn, X, Telegram, captions", fa: "لینکدین، X، تلگرام، کپشن" } },
  { id: "visuals", tools: ["baoyu"], label: { en: "Covers and infographics", fa: "کاور و اینفوگرافیک" }, hint: { en: "Images made by a model", fa: "تصویری که مدل می‌سازد" } },
  { id: "carousel", tools: ["slides"], label: { en: "Carousels and slides", fa: "کاروسل و اسلاید" }, hint: { en: "PDF for LinkedIn, images for Instagram", fa: "PDF برای لینکدین، تصویر برای اینستاگرام" } },
  { id: "motion", tools: ["hyperframes"], label: { en: "Motion video from scratch", fa: "ویدیوی موشن از صفر" }, hint: { en: "Animated text, charts, product intros", fa: "متن متحرک، نمودار، معرفی محصول" } },
  { id: "footage", tools: ["videouse"], label: { en: "Editing my own footage", fa: "تدوین فیلم خودم" }, hint: { en: "Talking to camera", fa: "حرف زدن جلوی دوربین" } },
  { id: "voice", tools: ["elevenlabs"], label: { en: "Voice-over or dubbing", fa: "گویندگی یا دوبله" }, hint: { en: "Narration, music, another language", fa: "روایت، موسیقی، زبان دیگر" } },
  { id: "schedule", tools: ["postiz"], label: { en: "Scheduling from Claude", fa: "زمان‌بندی از داخل Claude" }, hint: { en: "Drafts straight into a publishing queue", fa: "پیش‌نویس مستقیم در صف انتشار" } },
]

export type LangChoice = "fa" | "en" | "both"

// ── Camera moves ────────────────────────────────────────────────────────────

export type MoveGroup = "camera" | "time" | "transition"

/** The animation each card plays; widgets.tsx turns these into motion. */
export type MoveAnim =
  | "pan"
  | "tilt"
  | "dollyIn"
  | "zoom"
  | "tracking"
  | "orbit"
  | "crane"
  | "dollyZoom"
  | "rackFocus"
  | "handheld"
  | "fpv"
  | "dutch"
  | "slowmo"
  | "speedRamp"
  | "timelapse"
  | "freeze"
  | "jumpCut"
  | "matchCut"
  | "whipPan"
  | "dissolve"
  | "wipe"
  | "smashCut"
  | "jCut"
  | "lCut"

export const MOVES: { term: string; fa: string; group: MoveGroup; anim: MoveAnim; does: L }[] = [
  { term: "Pan", fa: "پن", group: "camera", anim: "pan", does: { en: "The camera turns left or right", fa: "دوربین به چپ یا راست می‌چرخد" } },
  { term: "Tilt", fa: "تیلت", group: "camera", anim: "tilt", does: { en: "The camera turns up or down", fa: "دوربین به بالا یا پایین می‌چرخد" } },
  { term: "Dolly in", fa: "دالی به داخل", group: "camera", anim: "dollyIn", does: { en: "The whole camera moves toward the subject", fa: "کل دوربین به سمت سوژه حرکت می‌کند" } },
  { term: "Zoom in", fa: "زوم", group: "camera", anim: "zoom", does: { en: "The lens closes in; the camera stays put", fa: "لنز نزدیک می‌شود، دوربین سر جایش می‌ماند" } },
  { term: "Tracking shot", fa: "ترکینگ", group: "camera", anim: "tracking", does: { en: "The camera moves alongside the subject", fa: "دوربین کنار سوژه حرکت می‌کند" } },
  { term: "Orbit", fa: "اوربیت", group: "camera", anim: "orbit", does: { en: "The camera circles the subject", fa: "دوربین دور سوژه می‌چرخد" } },
  { term: "Crane up", fa: "کرین", group: "camera", anim: "crane", does: { en: "The camera rises", fa: "دوربین بالا می‌رود" } },
  { term: "Dolly zoom", fa: "دالی زوم", group: "camera", anim: "dollyZoom", does: { en: "Subject holds its size, background stretches", fa: "سوژه همان اندازه، پس‌زمینه کشیده می‌شود" } },
  { term: "Rack focus", fa: "تغییر فوکوس", group: "time", anim: "rackFocus", does: { en: "Focus shifts from foreground to background", fa: "فوکوس از پیش‌زمینه به پس‌زمینه می‌رود" } },
  { term: "Handheld", fa: "دوربین روی دست", group: "time", anim: "handheld", does: { en: "A small, deliberate shake", fa: "لرزش کم و عمدی" } },
  { term: "FPV drone shot", fa: "نمای پهپادی", group: "time", anim: "fpv", does: { en: "The camera rushes forward", fa: "دوربین با سرعت به جلو می‌رود" } },
  { term: "Dutch angle", fa: "زاویه‌ی کج", group: "time", anim: "dutch", does: { en: "The frame is tilted", fa: "قاب کج است" } },
  { term: "Slow motion", fa: "اسلوموشن", group: "time", anim: "slowmo", does: { en: "Motion slows down", fa: "حرکت کند می‌شود" } },
  { term: "Speed ramp", fa: "رمپ سرعت", group: "time", anim: "speedRamp", does: { en: "Fast, then suddenly slow", fa: "تند، بعد ناگهان کند" } },
  { term: "Time-lapse", fa: "تایم‌لپس", group: "time", anim: "timelapse", does: { en: "Hours pass in seconds", fa: "زمان طولانی در چند ثانیه" } },
  { term: "Freeze frame", fa: "فریز فریم", group: "time", anim: "freeze", does: { en: "Motion stops for a moment", fa: "حرکت یک لحظه می‌ایستد" } },
  { term: "Jump cut", fa: "جامپ کات", group: "transition", anim: "jumpCut", does: { en: "Same frame, time jumps ahead", fa: "همان قاب، زمان جلو می‌پرد" } },
  { term: "Match cut", fa: "برش تطبیقی", group: "transition", anim: "matchCut", does: { en: "A shared shape links two shots", fa: "یک شکل یا حرکت مشابه، دو نما را وصل می‌کند" } },
  { term: "Whip pan", fa: "پن سریع", group: "transition", anim: "whipPan", does: { en: "A fast spin, a blur, the next shot", fa: "چرخش تند، تاری تا نمای بعد" } },
  { term: "Cross dissolve", fa: "دیزالو", group: "transition", anim: "dissolve", does: { en: "One shot melts into the next", fa: "یک نما در بعدی حل می‌شود" } },
  { term: "Wipe", fa: "وایپ", group: "transition", anim: "wipe", does: { en: "A line sweeps across the frame", fa: "یک خط روی تصویر جارو می‌کند" } },
  { term: "Smash cut", fa: "برش ضربه‌ای", group: "transition", anim: "smashCut", does: { en: "Calm scene, hard cut to the next", fa: "صحنه‌ی آرام، برش تند به صحنه‌ی بعد" } },
  { term: "J-cut", fa: "J-cut", group: "transition", anim: "jCut", does: { en: "The next shot's sound arrives first", fa: "صدای نمای بعد زودتر از تصویرش می‌آید" } },
  { term: "L-cut", fa: "L-cut", group: "transition", anim: "lCut", does: { en: "The last shot's sound carries over", fa: "صدای نمای قبل روی تصویر بعد ادامه دارد" } },
]

/** Pages read on VERIFIED. */
export const SOURCES: { label: string; href: string }[] = [
  { label: "mvanhorn/last30days-skill", href: "https://github.com/mvanhorn/last30days-skill" },
  { label: "coreyhaines31/marketingskills", href: "https://github.com/coreyhaines31/marketingskills" },
  { label: "blader/humanizer", href: "https://github.com/blader/humanizer" },
  { label: "JimLiu/baoyu-skills", href: "https://github.com/JimLiu/baoyu-skills" },
  { label: "zarazhangrui/frontend-slides", href: "https://github.com/zarazhangrui/frontend-slides" },
  { label: "heygen-com/hyperframes", href: "https://github.com/heygen-com/hyperframes" },
  { label: "browser-use/video-use", href: "https://github.com/browser-use/video-use" },
  { label: "elevenlabs/skills", href: "https://github.com/elevenlabs/skills" },
  { label: "gitroomhq/postiz-app", href: "https://github.com/gitroomhq/postiz-app" },
  { label: "Postiz: Claude Code setup", href: "https://postiz.com/claude-code" },
  { label: "Postiz docs: self-hosting", href: "https://docs.postiz.com/self-host/installation/overview" },
  { label: "remotion-dev/skills", href: "https://github.com/remotion-dev/skills" },
  { label: "Remotion licence", href: "https://github.com/remotion-dev/remotion/blob/main/LICENSE.md" },
  { label: "vercel-labs/skills (the npx skills CLI)", href: "https://github.com/vercel-labs/skills" },
  { label: "LinkedIn Help: document posts", href: "https://www.linkedin.com/help/linkedin/answer/a564109" },
  { label: "Wikipedia: Signs of AI writing", href: "https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing" },
]
