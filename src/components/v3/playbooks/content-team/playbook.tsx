// ============================================================================
// File Path: src/components/v3/playbooks/content-team/playbook.tsx
// Why: Playbook 01, "A content team inside Claude Code", for /playbooks/… and
//      /fa/playbooks/…. One component for both locales. A server component:
//      every sentence is in the HTML; the interactive parts come from
//      ./widgets. The order is the playbook shape every one should follow:
//      what you end up with, the whole line, your own pipeline, prerequisites
//      and the warning, the stages one by one, the comparison, the full
//      prompt, the extra (camera moves), the mistakes, the run checklist,
//      then checks, corrections and sources.
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
import { COPY } from "./copy"
import { CAMERA, HERO, STAGE_PHOTOS } from "./photos"
import { PREREQS, SOURCES, STAGES, TOOL, TOOLS, type StageId, type ToolId } from "./data"
import { CameraMoves, CodeBlock, CompareTable, Mixed, Note, PipelineBuilder, PipelineMap, PromptBox, RunChecklist } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"

function Block({ id, kicker, title, lead, children, tone }: { id?: string; kicker?: string; title: string; lead?: string; children?: ReactNode; tone?: "beam" }) {
  return (
    <section id={id} className="relative isolate scroll-mt-20 overflow-hidden border-b border-v3-line/70">
      {tone === "beam" && <Beam className="[animation-delay:-6s]" />}
      <div className={`${WRAP} py-20 md:py-28`}>
        <Reveal className="mb-12 flex flex-col gap-4 md:mb-16">
          {kicker && <Kicker>{kicker}</Kicker>}
          <Headline className="max-w-4xl">{title}</Headline>
          {lead && <Lead className="mt-2">{lead}</Lead>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

/** A plain table. `latin` marks columns that hold names or commands. */
function Table({ head, rows, latin = [], locale }: { head: string[]; rows: string[][]; latin?: number[]; locale: Locale }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-v3-line/80">
      <table className="w-full min-w-[560px] text-start text-sm">
        <thead>
          <tr className="border-b border-v3-line/80 text-v3-mute">
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 text-start font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-v3-line/50 align-top last:border-b-0">
              {r.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className={`px-4 py-3.5 text-start font-normal text-v3-bone ${latin.includes(j) ? LATIN : ""}`}>
                    {latin.includes(j) ? <bdi dir="ltr">{cell}</bdi> : <Mixed text={cell} locale={locale} />}
                  </th>
                ) : (
                  <td key={j} className={`px-4 py-3.5 leading-relaxed text-v3-soft rtl:leading-loose ${latin.includes(j) ? LATIN : ""}`}>
                    {latin.includes(j) ? <bdi dir="ltr">{cell}</bdi> : <Mixed text={cell} locale={locale} />}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** The head of one tool inside a stage: name, link, stars, licence. */
function ToolHead({ id, locale }: { id: ToolId; locale: Locale }) {
  const tool = TOOL[id]
  const c = COPY[locale]
  const k = tool.stars < 1 ? tool.stars.toFixed(2) : tool.stars.toFixed(1)
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-v3-line/70 pt-8">
      <a href={tool.href} target="_blank" rel="noopener noreferrer" dir="ltr" className={`font-v3-display text-3xl text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light md:text-4xl ${LATIN}`}>
        {tool.name}
      </a>
      <span className="text-sm text-v3-mute">{c.stars(locale === "fa" ? localDigits(k, "fa").replace(".", "٫") : k)}</span>
      <span className={`text-sm text-v3-mute ${LATIN}`} dir="ltr">
        {tool.license}
      </span>
      <span className="text-sm text-v3-light">{tool.role[locale]}</span>
    </div>
  )
}

/** One stage of the pipeline: its number, title, lead, and the tools under it. */
function Stage({ id, n, locale, lead, children }: { id: StageId; n: number; locale: Locale; lead: string; children: ReactNode }) {
  const photo = STAGE_PHOTOS[id]
  const c = COPY[locale]
  return (
    <section id={`stage-${id}`} className="relative isolate scroll-mt-20 border-b border-v3-line/70">
      <div className={`${WRAP} grid gap-12 py-20 md:py-28 lg:grid-cols-12`}>
        <Reveal className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <span aria-hidden className="font-v3-display text-[clamp(6rem,14vw,11rem)] font-light leading-none text-v3-light drop-shadow-[0_0_50px_rgb(var(--v3-glow)/0.3)]">
            {localDigits(n, locale)}
          </span>
          <Kicker>
            {c.step} {localDigits(n, locale)} · {c.map.stages[id].name}
          </Kicker>
          <Headline size="card" className="md:text-4xl">
            {c.stepTitles[id]}
          </Headline>
          <Photo photo={photo} locale={locale} className="mt-6" ratio="4/3" sizes="(min-width: 1024px) 30vw, 100vw" />
        </Reveal>
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
          <Reveal>
            <p className="text-lg leading-relaxed text-v3-bone md:text-xl rtl:leading-loose">
              <Mixed text={lead} locale={locale} />
            </p>
          </Reveal>
          {children}
        </div>
      </div>
    </section>
  )
}

const P = ({ children, locale }: { children: string; locale: Locale }) => (
  <p className="leading-relaxed text-v3-soft md:text-lg rtl:leading-loose">
    <Mixed text={children} locale={locale} />
  </p>
)

export function ContentTeamPlaybook({ locale, meta }: { locale: Locale; meta: PlaybookMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const s = c.steps
  const fa = locale === "fa"
  const minutes = fa ? `${localDigits(meta.readMinutes, "fa")} دقیقه مطالعه` : `${meta.readMinutes} min read`
  const install = (id: ToolId) => TOOL[id].install

  const jsonLd = playbookJsonLd({
    locale,
    slug: meta.slug,
    steps: STAGES.map((st) => ({ name: c.stepTitles[st.id], text: c.map.stages[st.id].does, anchor: `stage-${st.id}` })),
    tools: TOOLS.map((t) => t.name),
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

          <Reveal immediate delay={0.06}>
            <Headline as="h1" size="hero" accent={<span className="mt-2 block">{m.tagline}</span>} className="max-w-5xl">
              {m.title}
            </Headline>
          </Reveal>

          <Reveal immediate delay={0.12}>
            <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{c.hero.lead}</p>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
            <div className="flex min-w-0 flex-col gap-5 lg:col-span-7">
            <Reveal immediate delay={0.18}>
              <Card tone="lit">
                <span className="text-sm text-v3-light">{c.hero.specs.outcome}</span>
                <p className="text-xl leading-relaxed text-v3-bone rtl:leading-loose">
                  <Mixed text={m.outcome} locale={locale} />
                </p>
                <dl className="mt-2 grid gap-5 border-t border-v3-line/60 pt-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm text-v3-mute">{c.hero.specs.level}</dt>
                    <dd className="leading-relaxed text-v3-soft rtl:leading-loose">{m.level}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm text-v3-mute">{c.hero.specs.cost}</dt>
                    <dd className="leading-relaxed text-v3-soft rtl:leading-loose">{m.cost}</dd>
                  </div>
                </dl>
              </Card>
            </Reveal>
            <Reveal immediate delay={0.24} className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <Card tone="raised">
                <span className="font-v3-display text-7xl font-light leading-none text-v3-light">{localDigits(TOOLS.length, locale)}</span>
                <span className="text-sm text-v3-mute">{c.hero.specs.tools}</span>
              </Card>
              <Card tone="raised">
                <span className="font-v3-display text-7xl font-light leading-none text-v3-bone">{localDigits(STAGES.length, locale)}</span>
                <span className="text-sm text-v3-mute">{c.hero.specs.stages}</span>
              </Card>
              <Card tone="plain" className="col-span-2 sm:col-span-1">
                <span className="text-sm text-v3-mute">{c.hero.specs.verified}</span>
                <time dateTime={meta.verified} className="text-lg text-v3-bone">
                  {formatReportDate(meta.verified, locale)}
                </time>
              </Card>
            </Reveal>
            </div>
            <Reveal immediate delay={0.3} className="min-w-0 lg:col-span-5">
              <Photo photo={HERO} locale={locale} priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
          </div>

          <Reveal immediate delay={0.3} className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="min-w-0 lg:col-span-8">
              <Note locale={locale} kind="local" title={c.hero.note.title}>
                {c.hero.note.body}
              </Note>
            </div>
            <div className="lg:col-span-4">
              <V3Button href="#builder" locale={locale}>
                {c.hero.jump}
              </V3Button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── The whole line ───────────────────────────────────────────── */}
      <Block id="map" kicker={c.map.kicker} title={c.map.title} lead={c.map.lead}>
        <PipelineMap locale={locale} />
      </Block>

      {/* ── Your pipeline ────────────────────────────────────────────── */}
      <Block id="builder" kicker={c.builder.kicker} title={c.builder.title} lead={c.builder.lead} tone="beam">
        <PipelineBuilder locale={locale} />
      </Block>

      {/* ── Prerequisites and the warning ────────────────────────────── */}
      <Block id="prereq" kicker={c.prereq.kicker} title={c.prereq.title} lead={c.prereq.lead}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="min-w-0 lg:col-span-7">
            <Table locale={locale}
              head={c.prereq.head}
              rows={[
                ...PREREQS.map((p) => [p.name, p.for[locale], p.check]),
                [fa ? "کلید API ElevenLabs" : "ElevenLabs API key", "video-use, ElevenLabs", "ELEVENLABS_API_KEY"],
              ]}
              latin={[2]}
            />
          </div>
          <Reveal className="min-w-0 lg:col-span-5">
            <Note locale={locale} kind="warn" title={c.prereq.security.title}>
              <p className="mb-4">{c.prereq.security.lead}</p>
              <ol className="flex flex-col gap-3">
                {c.prereq.security.rules.map((r, i) => (
                  <li key={i} className="flex gap-3 text-v3-bone">
                    <span className="font-v3-display text-xl leading-none text-v3-light">{localDigits(i + 1, locale)}</span>
                    <span>
                      <Mixed text={r} locale={locale} />
                    </span>
                  </li>
                ))}
              </ol>
            </Note>
          </Reveal>
        </div>
      </Block>

      {/* ── Stage 1 · Topic ──────────────────────────────────────────── */}
      <Stage id="topic" n={1} locale={locale} lead={s.topic.lead}>
        <ToolHead id="last30days" locale={locale} />
        <blockquote className="border-s-2 border-v3-light ps-5">
          <span className="block text-sm text-v3-mute">{s.topic.exampleLabel}</span>
          <p className="mt-1 text-lg leading-relaxed text-v3-bone rtl:leading-loose">
            «<Mixed text={s.topic.example} locale={locale} />»
          </p>
        </blockquote>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm text-v3-mute">{s.topic.sourcesTitle}</h3>
          <Table locale={locale} head={s.topic.head} rows={s.topic.rows} />
        </div>
        <CodeBlock code={install("last30days")} locale={locale} label={s.topic.install} />
        <Note locale={locale} kind="local" title={s.topic.note.title}>
          {s.topic.note.body}
        </Note>
      </Stage>

      {/* ── Stage 2 · Write ──────────────────────────────────────────── */}
      <Stage id="write" n={2} locale={locale} lead={s.write.lead}>
        <ToolHead id="marketingskills" locale={locale} />
        <P locale={locale}>{s.write.ms.body}</P>
        <Table locale={locale} head={s.write.ms.head} rows={s.write.ms.rows} latin={[1]} />
        <CodeBlock code={install("marketingskills")} locale={locale} label={c.installLabel} />
        <P locale={locale}>{s.write.ms.install}</P>
        <ToolHead id="humanizer" locale={locale} />
        <P locale={locale}>{s.write.hz.body}</P>
        <CodeBlock code={install("humanizer")} locale={locale} label={c.installLabel} />
        <Note locale={locale} kind="local" title={s.write.note.title}>
          {s.write.note.body}
        </Note>
      </Stage>

      {/* ── Stage 3 · Images ─────────────────────────────────────────── */}
      <Stage id="image" n={3} locale={locale} lead={s.image.lead}>
        <ToolHead id="baoyu" locale={locale} />
        <P locale={locale}>{s.image.baoyu.body}</P>
        <Table locale={locale} head={s.image.baoyu.head} rows={s.image.baoyu.rows} latin={[0]} />
        <P locale={locale}>{s.image.baoyu.engine}</P>
        <CodeBlock code={install("baoyu")} locale={locale} label={c.installLabel} />
        <p className="text-sm text-v3-mute">{s.image.baoyu.install}</p>
        <ToolHead id="slides" locale={locale} />
        <P locale={locale}>{s.image.slides.body}</P>
        <Note locale={locale} kind="fix" title={s.image.slides.fix.title}>
          {s.image.slides.fix.body}
        </Note>
        <CodeBlock code={install("slides")} locale={locale} label={s.image.slides.install} />
      </Stage>

      {/* ── Stage 4 · Video ──────────────────────────────────────────── */}
      <Stage id="video" n={4} locale={locale} lead={s.video.lead}>
        <ToolHead id="hyperframes" locale={locale} />
        <P locale={locale}>{s.video.hf.body}</P>
        <CodeBlock code={install("hyperframes")} locale={locale} label={s.video.hf.install} />
        <div className="flex flex-col gap-4">
          <h3 className="font-v3-display text-2xl text-v3-bone">{s.video.hf.lessonsTitle}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {s.video.hf.lessons.map((l, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Note locale={locale} kind="lesson" title={`${localDigits(i + 1, locale)}`}>
                  <span className="mb-2 block text-v3-bone">
                    <Mixed text={l.title} locale={locale} />
                  </span>
                  <Mixed text={l.body} locale={locale} />
                </Note>
              </Reveal>
            ))}
          </div>
        </div>
        <ToolHead id="videouse" locale={locale} />
        <P locale={locale}>{s.video.vu.body}</P>
        <ul className="flex flex-col">
          {s.video.vu.does.map((d, i) => (
            <li key={i} className="flex gap-4 border-b border-v3-line/60 py-3 leading-relaxed text-v3-bone last:border-b-0 rtl:leading-loose">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" />
              <Mixed text={d} locale={locale} />
            </li>
          ))}
        </ul>
        <P locale={locale}>{s.video.vu.setup}</P>
        <CodeBlock code={install("videouse")} locale={locale} label={s.video.vu.install} />
        <Note locale={locale} kind="local" title={s.video.remotion.title}>
          <span className="mb-4 block">
            <Mixed text={s.video.remotion.body} locale={locale} />
          </span>
          <CodeBlock code="npx skills add remotion-dev/skills -g -a claude-code" locale={locale} label={c.installLabel} />
        </Note>
      </Stage>

      {/* ── Stage 5 · Voice ──────────────────────────────────────────── */}
      <Stage id="voice" n={5} locale={locale} lead={s.voice.lead}>
        <ToolHead id="elevenlabs" locale={locale} />
        <Table locale={locale} head={s.voice.head} rows={s.voice.rows} latin={[0]} />
        <CodeBlock code={install("elevenlabs")} locale={locale} label={c.installLabel} />
        <P locale={locale}>{s.voice.install}</P>
        <div className="grid gap-4 md:grid-cols-2">
          {s.voice.notes.map((n, i) => (
            <Note key={i} kind="local" title={n.title}>
              {n.body}
            </Note>
          ))}
        </div>
      </Stage>

      {/* ── Stage 6 · Publish ────────────────────────────────────────── */}
      <Stage id="publish" n={6} locale={locale} lead={s.publish.lead}>
        <ToolHead id="postiz" locale={locale} />
        <Table locale={locale} head={s.publish.head} rows={s.publish.rows} />
        <CodeBlock code={install("postiz")} locale={locale} label={s.publish.install} />
        <div className="grid gap-4 md:grid-cols-2">
          <Note locale={locale} kind="fix" title={s.publish.fix.title}>
            {s.publish.fix.body}
          </Note>
          <Note locale={locale} kind="lesson" title={s.publish.human.title}>
            {s.publish.human.body}
          </Note>
        </div>
      </Stage>

      {/* ── Compare ──────────────────────────────────────────────────── */}
      <Block id="compare" kicker={c.compare.kicker} title={c.compare.title} lead={c.compare.lead}>
        <CompareTable locale={locale} />
      </Block>

      {/* ── The full prompt ──────────────────────────────────────────── */}
      <Block id="prompt" kicker={c.setup.kicker} title={c.setup.title} lead={c.setup.lead} tone="beam">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="min-w-0 lg:col-span-8">
            <PromptBox text={c.setup.text} locale={locale} title={c.setup.kicker} />
          </div>
          <Reveal className="min-w-0 lg:col-span-4">
            <Note locale={locale} kind="lesson" title={c.setup.why.title}>
              {c.setup.why.body}
            </Note>
          </Reveal>
        </div>
      </Block>

      {/* ── Camera moves ─────────────────────────────────────────────── */}
      <Block id="camera" kicker={c.moves.kicker} title={c.moves.title} lead={c.moves.lead}>
        <div className="flex flex-col gap-16">
          <Reveal>
            <Photo photo={CAMERA} locale={locale} ratio="21/9" sizes="(min-width: 1280px) 1200px, 100vw" />
          </Reveal>
          <div className="flex flex-col gap-4">
            <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">{c.moves.which.title}</h3>
            <Table locale={locale} head={c.moves.which.head} rows={c.moves.which.rows} />
          </div>
          <CameraMoves locale={locale} />
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="min-w-0 lg:col-span-8">
              <PromptBox text={c.moves.samples} locale={locale} title={c.moves.samplesTitle} />
            </div>
            <Reveal className="min-w-0 lg:col-span-4">
              <Note locale={locale} kind="warn" title={fa ? "قاعده‌ی طلایی" : "The golden rule"}>
                {c.moves.rule}
              </Note>
            </Reveal>
          </div>
        </div>
      </Block>

      {/* ── Mistakes ─────────────────────────────────────────────────── */}
      <Block id="mistakes" title={c.pitfalls.kicker}>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.pitfalls.items.map((p, i) => (
            <li key={i}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <Card tone="raised">
                  <span className="font-v3-display text-4xl font-light text-v3-light">{localDigits(i + 1, locale)}</span>
                  <h3 className="text-lg text-v3-bone">{p.title}</h3>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">
                    <Mixed text={p.body} locale={locale} />
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </Block>

      {/* ── Checklist ────────────────────────────────────────────────── */}
      <Block id="checklist" kicker={c.checklist.kicker} title={c.checklist.title} lead={c.checklist.lead} tone="beam">
        <RunChecklist locale={locale} />
      </Block>

      {/* ── Method ───────────────────────────────────────────────────── */}
      <Block id="method" kicker={c.method.kicker} title={c.method.title}>
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
                  <Mixed text={note} locale={locale} />
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
