// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/playbook.tsx
// Why: Playbook 02, "Animated science videos with Claude Code", for
//      /playbooks/… and /fa/playbooks/…. One component for both locales. A
//      server component: every sentence is in the HTML; the player and the
//      demos come from ./player and ./widgets. The order follows the prompt:
//      see it working, the workflow, then its seven parts (look, type,
//      story, voice, architecture, render, sound), the science, the gotchas,
//      the prompt itself, a checklist, then checks and sources.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { formatReportDate } from "@/lib/reports"
import type { PlaybookMeta } from "@/lib/playbooks"
import { Beam, Card, Headline, Kicker, Lead, Reveal, Spotlight, V3Button, V3Page } from "@/components/v3/kit"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { ReportColophon } from "@/components/v3/reports/colophon"
import { Photo } from "@/components/v3/reports/photo"
import { playbookJsonLd } from "../playbook-route"
import { Checklist, CodeBlock, Mixed, Note, PromptBox } from "../shared"
import { COPY } from "./copy"
import { BEATS } from "./scene"
import { PROMPT, SOURCES } from "./data"
import { PHOTOS } from "./photos"
import { ExplainerPlayer } from "./player"
import { Arc, CaptionDemo, Clocks, Flow, MixMeter, Palette, Pipeline, ScienceTable, SfxChips, SpringLab, VoicePaths, WordSync } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"

function Block({ id, kicker, title, lead, children, tone, locale }: { id?: string; kicker?: string; title: string; lead?: string; children?: ReactNode; tone?: "beam" | "space"; locale: Locale }) {
  return (
    <section id={id} className="relative isolate scroll-mt-20 overflow-hidden border-b border-v3-line/70">
      {tone === "beam" && <Beam className="[animation-delay:-6s]" />}
      {tone === "space" && (
        // A faint wash of the prompt's nebula colours behind the section.
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_15%_10%,rgba(24,150,160,0.10),transparent),radial-gradient(50%_45%_at_90%_30%,rgba(220,95,110,0.08),transparent),radial-gradient(60%_50%_at_60%_100%,rgba(60,70,175,0.10),transparent)]" />
      )}
      <div className={`${WRAP} py-20 md:py-28`}>
        <Reveal className="mb-12 flex flex-col gap-4 md:mb-16">
          {kicker && <Kicker>{kicker}</Kicker>}
          <Headline className="max-w-4xl">{title}</Headline>
          {lead && (
            <Lead className="mt-2">
              <Mixed text={lead} locale={locale} />
            </Lead>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

export function ScienceExplainerPlaybook({ locale, meta }: { locale: Locale; meta: PlaybookMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const minutes = fa ? `${localDigits(meta.readMinutes, "fa")} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = playbookJsonLd({
    locale,
    slug: meta.slug,
    steps: [
      { name: c.look.kicker, text: c.look.title, anchor: "look" },
      { name: c.type.kicker, text: c.type.title, anchor: "type" },
      { name: c.story.kicker, text: c.story.title, anchor: "story" },
      { name: c.voice.kicker, text: c.voice.title, anchor: "voice" },
      { name: c.arch.kicker, text: c.arch.title, anchor: "architecture" },
      { name: c.render.kicker, text: c.render.title, anchor: "render" },
      { name: c.sound.kicker, text: c.sound.title, anchor: "sound" },
    ],
    tools: ["Claude Code", "Playwright", "Microsoft Edge", "ffmpeg", "ElevenLabs", "kokoro-onnx", "faster-whisper"],
    citation: SOURCES,
  })

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <ReadingProgress />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="relative isolate overflow-hidden border-b border-v3-line/70">
        <Beam />
        <Spotlight className="-z-10" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(45%_60%_at_85%_20%,rgba(255,200,87,0.16),transparent),radial-gradient(40%_50%_at_10%_90%,rgba(24,150,160,0.14),transparent)]" />
        <div className={`${WRAP} flex flex-col gap-10 py-16 md:py-24`}>
          <Reveal immediate className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-v3-mute">
            <Link href={localePath(locale, "/playbooks")} className="text-v3-light hover:underline hover:underline-offset-4">
              {c.kicker} {localDigits(String(meta.number).padStart(2, "0"), locale)}
            </Link>
            <span aria-hidden>·</span>
            <span>{m.topic}</span>
            <span aria-hidden>·</span>
            <time dateTime={meta.published}>{formatReportDate(meta.published, locale)}</time>
            <span aria-hidden>·</span>
            <span>{minutes}</span>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="flex min-w-0 flex-col gap-8 lg:col-span-7">
              <Reveal immediate delay={0.06}>
                <Headline as="h1" size="hero" accent={<span className="mt-2 block">{m.tagline}</span>}>
                  {m.title}
                </Headline>
              </Reveal>
              <Reveal immediate delay={0.12}>
                <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">
                  <Mixed text={c.hero.lead} locale={locale} />
                </p>
              </Reveal>
              <Reveal immediate delay={0.18} className="grid grid-cols-3 gap-3">
                {[
                  ["1920×1080", c.hero.stats.res, "#8fd8e6"],
                  ["30", c.hero.stats.fps, "#ffd98a"],
                  [String(BEATS.length), c.hero.stats.beats, "#ff8f4a"],
                ].map(([v, l, col]) => (
                  <div key={l} className="flex flex-col gap-1 rounded-2xl border border-v3-line/80 bg-v3-raise p-4">
                    <span className={`font-v3-display text-3xl md:text-4xl ${LATIN}`} dir="ltr" style={{ color: col }}>
                      {v}
                    </span>
                    <span className="text-xs text-v3-mute">{l}</span>
                  </div>
                ))}
              </Reveal>
            </div>
            <Reveal immediate delay={0.24} className="min-w-0 lg:col-span-5">
              <Photo photo={PHOTOS.astronaut} locale={locale} ratio="1/1" priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            <Reveal immediate delay={0.3} className="min-w-0 lg:col-span-7">
              <Card tone="lit">
                <span className="text-sm text-v3-light">{c.hero.specs.outcome}</span>
                <p className="text-xl leading-relaxed text-v3-bone rtl:leading-loose">
                  <Mixed text={m.outcome} locale={locale} />
                </p>
                <dl className="mt-2 grid gap-5 border-t border-v3-line/60 pt-5 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm text-v3-mute">{c.hero.specs.level}</dt>
                    <dd className="leading-relaxed text-v3-soft rtl:leading-loose">
                      <Mixed text={m.level} locale={locale} />
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm text-v3-mute">{c.hero.specs.cost}</dt>
                    <dd className="leading-relaxed text-v3-soft rtl:leading-loose">
                      <Mixed text={m.cost} locale={locale} />
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm text-v3-mute">{c.hero.specs.verified}</dt>
                    <dd className="text-v3-bone">
                      <time dateTime={meta.verified}>{formatReportDate(meta.verified, locale)}</time>
                    </dd>
                  </div>
                </dl>
              </Card>
            </Reveal>
            <Reveal immediate delay={0.36} className="flex min-w-0 flex-col gap-5 lg:col-span-5">
              <Note locale={locale} kind="local" title={c.hero.note.title}>
                {c.hero.note.body}
              </Note>
              <div>
                <V3Button href="#player" locale={locale}>
                  {c.hero.jump}
                </V3Button>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ── Live player ──────────────────────────────────────────────── */}
      <Block id="player" kicker={c.player.kicker} title={c.player.title} lead={c.player.lead} tone="space" locale={locale}>
        <ExplainerPlayer locale={locale} />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">{c.player.caveat}</p>
      </Block>

      {/* ── Workflow ─────────────────────────────────────────────────── */}
      <Block id="flow" kicker={c.flow.kicker} title={c.flow.title} lead={c.flow.lead} locale={locale}>
        <Flow locale={locale} />
      </Block>

      {/* ── 1 · Look ─────────────────────────────────────────────────── */}
      <Block id="look" kicker={c.look.kicker} title={c.look.title} lead={c.look.lead} tone="space" locale={locale}>
        <div className="flex flex-col gap-16">
          <Palette locale={locale} />
          <div className="flex flex-col gap-6">
            <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">{c.look.realVsDrawn}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-4">
                <Photo photo={PHOTOS.sun} locale={locale} ratio="4/3" sizes="(min-width: 768px) 45vw, 100vw" />
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">
                  <Mixed text={c.look.sunBody} locale={locale} />
                </p>
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <Photo photo={PHOTOS.earth} locale={locale} ratio="4/3" sizes="(min-width: 768px) 45vw, 100vw" />
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">
                  <Mixed text={c.look.earthBody} locale={locale} />
                </p>
              </div>
            </div>
            <Note locale={locale} kind="warn" title={c.look.rules.title}>
              {c.look.rules.body}
            </Note>
          </div>
        </div>
      </Block>

      {/* ── 2 · Character and type ───────────────────────────────────── */}
      <Block id="type" kicker={c.type.kicker} title={c.type.title} lead={c.type.lead} locale={locale}>
        <div className="flex flex-col gap-12">
          <CaptionDemo locale={locale} />
          <div className="grid gap-6 lg:grid-cols-2">
            <Note locale={locale} kind="lesson" title={c.type.mascot.title}>
              {c.type.mascot.body}
            </Note>
            <ul className="flex flex-col">
              {c.type.points.map((p, i) => (
                <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 leading-relaxed text-v3-bone last:border-b-0 rtl:leading-loose">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    <Mixed text={p} locale={locale} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Block>

      {/* ── 3 · Story ────────────────────────────────────────────────── */}
      <Block id="story" kicker={c.story.kicker} title={c.story.title} lead={c.story.lead} tone="space" locale={locale}>
        <div className="flex flex-col gap-14">
          <Arc locale={locale} />
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="min-w-0 lg:col-span-6">
              <Photo photo={PHOTOS.night} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <div className="min-w-0 lg:col-span-6">
              <Note locale={locale} kind="local" title={c.story.night.title}>
                {c.story.night.body}
              </Note>
            </div>
          </div>
        </div>
      </Block>

      {/* ── 4 · Voice ────────────────────────────────────────────────── */}
      <Block id="voice" kicker={c.voice.kicker} title={c.voice.title} lead={c.voice.lead} locale={locale}>
        <div className="flex flex-col gap-10">
          <WordSync locale={locale} />
          <VoicePaths locale={locale} />
          <div className="grid gap-6 lg:grid-cols-2">
            <ul className="flex flex-col">
              {c.voice.rules.map((r, i) => (
                <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 leading-relaxed text-v3-bone last:border-b-0 rtl:leading-loose">
                  <span className="font-v3-display text-xl leading-none text-v3-light">{localDigits(i + 1, locale)}</span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    <Mixed text={r} locale={locale} />
                  </span>
                </li>
              ))}
            </ul>
            <Note locale={locale} kind="fix" title={c.voice.fix.title}>
              {c.voice.fix.body}
            </Note>
          </div>
        </div>
      </Block>

      {/* ── 5 · Architecture ─────────────────────────────────────────── */}
      <Block id="architecture" kicker={c.arch.kicker} title={c.arch.title} lead={c.arch.lead} tone="space" locale={locale}>
        <div className="flex flex-col gap-16">
          <CodeBlock code={c.arch.code} locale={locale} label="index.html" />
          <div className="flex flex-col gap-5">
            <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">{c.arch.clocks.title}</h3>
            <p className="max-w-3xl leading-relaxed text-v3-soft md:text-lg rtl:leading-loose">{c.arch.clocks.lead}</p>
            <Clocks locale={locale} />
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">{c.arch.spring.title}</h3>
            <p className="max-w-3xl leading-relaxed text-v3-soft md:text-lg rtl:leading-loose">
              <Mixed text={c.arch.spring.lead} locale={locale} />
            </p>
            <SpringLab locale={locale} />
          </div>
        </div>
      </Block>

      {/* ── 6 · Render ───────────────────────────────────────────────── */}
      <Block id="render" kicker={c.render.kicker} title={c.render.title} lead={c.render.lead} locale={locale}>
        <div className="flex flex-col gap-10">
          <Pipeline locale={locale} />
          <div className="grid gap-6 lg:grid-cols-2">
            <Note locale={locale} kind="fix" title={c.render.gpu.title}>
              {c.render.gpu.body}
            </Note>
            <Note locale={locale} kind="local" title={c.render.crf.title}>
              {c.render.crf.body}
            </Note>
          </div>
          <CodeBlock
            locale={locale}
            label={c.render.commands}
            code={`ffmpeg -framerate 30 -i frames/%05d.png -i mix.wav -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a aac master.mp4
ffmpeg -i master.mp4 -c:v libx264 -crf 20 -af loudnorm=I=-14:TP=-2.2 delivery.mp4`}
          />
        </div>
      </Block>

      {/* ── 7 · Sound ────────────────────────────────────────────────── */}
      <Block id="sound" kicker={c.sound.kicker} title={c.sound.title} lead={c.sound.lead} tone="space" locale={locale}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="flex min-w-0 flex-col gap-8 lg:col-span-7">
            <MixMeter locale={locale} />
            <div className="flex flex-col gap-3">
              <h3 className="text-sm text-v3-mute">{c.sound.sfx}</h3>
              <SfxChips locale={locale} />
            </div>
            <Note locale={locale} kind="fix" title={c.sound.loud.title}>
              {c.sound.loud.body}
            </Note>
          </div>
          <Reveal className="min-w-0 lg:sticky lg:top-24 lg:col-span-5">
            <Photo photo={PHOTOS.aurora} locale={locale} ratio="4/5" sizes="(min-width: 1024px) 35vw, 100vw" />
          </Reveal>
        </div>
      </Block>

      {/* ── Science ──────────────────────────────────────────────────── */}
      <Block id="science" kicker={c.science.kicker} title={c.science.title} lead={c.science.lead} locale={locale}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <ScienceTable locale={locale} />
          </div>
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-4">
            <Photo photo={PHOTOS.jupiter} locale={locale} ratio="1/1" sizes="(min-width: 1024px) 30vw, 100vw" />
            <Photo photo={PHOTOS.terminator} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 30vw, 100vw" />
          </div>
        </div>
      </Block>

      {/* ── Gotchas ──────────────────────────────────────────────────── */}
      <Block id="gotchas" kicker={c.gotchas.kicker} title={c.gotchas.title} tone="space" locale={locale}>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.gotchas.items.map((g, i) => (
            <li key={i}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <Card tone="raised">
                  <span className="font-v3-display text-4xl font-light" style={{ color: ["#8fd8e6", "#ffd98a", "#ff8f4a", "#5fc47a", "#dc5f6e", "#4dc7eb"][i % 6] }}>
                    {localDigits(i + 1, locale)}
                  </span>
                  <h3 className="text-lg text-v3-bone">{g.title}</h3>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">
                    <Mixed text={g.body} locale={locale} />
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </Block>

      {/* ── The prompt ───────────────────────────────────────────────── */}
      <Block id="prompt" kicker={c.prompt.kicker} title={c.prompt.title} lead={c.prompt.lead} tone="beam" locale={locale}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="min-w-0 lg:col-span-8" dir="ltr">
            <PromptBox text={PROMPT} locale="en" title="prompt.xml" />
          </div>
          <Reveal className="min-w-0 lg:col-span-4">
            <Note locale={locale} kind="lesson" title={c.prompt.why.title}>
              {c.prompt.why.body}
            </Note>
          </Reveal>
        </div>
      </Block>

      {/* ── Checklist ────────────────────────────────────────────────── */}
      <Block id="checklist" kicker={c.checklist.kicker} title={c.checklist.title} lead={c.checklist.lead} locale={locale}>
        <Checklist items={c.checklist.items} storeKey="pb-science-explainer-checklist" reset={c.checklist.reset} locale={locale} />
      </Block>

      {/* ── Method ───────────────────────────────────────────────────── */}
      <Block id="method" kicker={c.method.kicker} title={c.method.title} locale={locale}>
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm text-v3-mute">{c.method.changelogTitle}</h3>
              <ol className="flex flex-col">
                {meta.changelog.map((e) => (
                  <li key={e.date} className="grid gap-1 border-b border-v3-line/60 py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
                    <time dateTime={e.date} className="text-sm text-v3-light">
                      {formatReportDate(e.date, locale)}
                    </time>
                    <span className="leading-relaxed text-v3-soft rtl:leading-loose">{e[locale]}</span>
                  </li>
                ))}
              </ol>
            </div>
            <ul className="flex flex-col">
              {c.method.corrections.map((note, i) => (
                <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 leading-relaxed text-v3-soft last:border-b-0 rtl:leading-loose">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" aria-hidden />
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    <Mixed text={note} locale={locale} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <h3 className="text-sm text-v3-mute">{c.method.sourcesTitle}</h3>
            <ol className={`flex list-decimal flex-col gap-2.5 ps-5 text-sm text-v3-soft marker:text-v3-mute ${LATIN}`} dir="ltr">
              {SOURCES.map((src) => (
                <li key={src.href}>
                  <a href={src.href} target="_blank" rel="noopener noreferrer" className="underline decoration-v3-line underline-offset-4 hover:text-v3-light hover:decoration-v3-light">
                    {src.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-v3-mute">{c.method.photos}</p>
          </div>
        </div>
      </Block>

      <ReportColophon
        locale={locale}
        kind="playbook"
        path={`/playbooks/${meta.slug}`}
        shareTitle={c.colophon.shareTitle}
        disclaimer={c.colophon.disclaimer}
        action={
          <V3Button href={localePath(locale, "/booking")} locale={locale}>
            {c.colophon.cta}
          </V3Button>
        }
      />
    </V3Page>
  )
}
