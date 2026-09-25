// ============================================================================
// File Path: src/components/home/v3/home-v3.tsx
// Why: The v3 "Light" home page, one component for both locales. The idea
//      is taken from the portrait itself: one diagonal light on a dark,
//      warm room. Calm and trustworthy first, alive second — the motion
//      is the light moving, never decoration for its own sake.
// Env / Identity: React Server Component; client leaves in ./motion
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import { HOME_COPY, type Locale } from "./copy"
import { instrumentSans, naskh, newsreader } from "./fonts"
import {
  Arrow,
  CountUp,
  LightRule,
  Parallax,
  Reveal,
  RoleSwitcher,
  Spotlight,
} from "./motion"

export type HomePost = {
  slug: string
  title: string
  excerpt: string | null
  readingTime: number | null
  categories: { name: string }[]
}

const LOCALE_TYPE: Record<Locale, string> = {
  en: "[--v3-display:var(--font-newsreader)] [--v3-body:var(--font-instrument)]",
  fa: "[--v3-display:var(--font-naskh)] [--v3-body:var(--font-dana)]",
}

function Beam({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`v3-beam pointer-events-none absolute -top-1/4 start-0 h-[160%] w-72 bg-linear-to-r from-transparent via-v3-light/[0.07] to-transparent ${className ?? ""}`}
    />
  )
}

export function HomeV3({ locale, posts = [] }: { locale: Locale; posts?: HomePost[] }) {
  const t = HOME_COPY[locale]
  const dir = locale === "fa" ? "rtl" : "ltr"

  return (
    <div
      dir={dir}
      lang={locale}
      className={`${newsreader.variable} ${instrumentSans.variable} ${naskh.variable} ${LOCALE_TYPE[locale]} bg-v3-ink font-v3-body text-v3-bone selection:bg-v3-light selection:text-v3-ink`}
    >
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <Beam />
        <Spotlight className="-z-10" />
        <div className="mx-auto grid max-w-[1600px] lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-12">
          <div className="flex flex-col justify-center gap-10 px-5 pb-14 pt-14 md:px-10 lg:col-span-6 lg:py-20 lg:pe-8 lg:ps-14">
            <p className="text-xs uppercase tracking-[0.14em] text-v3-mute rtl:text-sm rtl:normal-case rtl:tracking-normal">
              {t.eyebrow}
            </p>
            <RoleSwitcher roles={t.roles} label={t.rolesLabel} locale={locale} />
          </div>

          <div className="relative min-h-[520px] overflow-hidden lg:col-span-6 lg:min-h-0">
            <Image
              src="/images/farjad-portrait.jpg"
              alt={t.portraitAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="v3-drift object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-linear-to-b from-v3-ink via-transparent to-transparent lg:bg-linear-to-r lg:via-transparent rtl:lg:bg-linear-to-l" />
            <Link
              href={t.labBadge.href}
              className="group absolute bottom-8 start-5 flex flex-col gap-1.5 rounded-2xl border border-v3-line bg-v3-ink/85 px-5 py-4 text-sm backdrop-blur-sm transition-colors hover:border-v3-light md:start-10 lg:bottom-10 lg:start-12"
            >
              <span className="flex items-center gap-2.5 font-semibold">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-v3-light opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-v3-light" />
                </span>
                {t.labBadge.title}
                <Arrow locale={locale} className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </span>
              <span className="text-v3-mute">{t.labBadge.detail}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Credentials, moving ──────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-v3-line/70 py-5" aria-label={locale === "fa" ? "سوابق" : "Credentials"}>
        <ul className="v3-marquee flex w-max gap-12 whitespace-nowrap font-v3-display text-xl text-v3-mute ltr:italic">
          {[...t.marquee, ...t.marquee].map((item, i) => (
            <li key={i} className="flex items-center gap-12" aria-hidden={i >= t.marquee.length}>
              {item}
              <span className="text-v3-light/60">·</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Facts ────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-[1600px] grid-cols-1 border-b border-v3-line/70 px-5 md:grid-cols-3 md:px-10 lg:px-14">
        {t.facts.map((f, i) => (
          <Reveal
            key={f.label}
            delay={i * 0.08}
            className="flex flex-col gap-2 border-v3-line/70 py-10 md:border-s md:px-8 md:first:border-s-0 md:first:ps-0 md:py-14"
          >
            <CountUp
              to={f.value}
              prefix={f.prefix}
              suffix={f.suffix}
              locale={locale}
              className="font-v3-display text-6xl font-light text-v3-bone md:text-7xl rtl:self-start"
            />
            <span className="text-v3-mute">{f.label}</span>
          </Reveal>
        ))}
      </section>

      {/* ── Start small ──────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-[1600px] border-b border-v3-line/70 lg:grid-cols-4">
        <Reveal className="px-5 py-14 md:px-10 lg:px-14 lg:py-20">
          <h2 className="font-v3-display text-4xl leading-tight rtl:leading-relaxed">
            {t.start.title}
            <br />
            <em className="text-v3-light not-italic ltr:italic">{t.start.accent}</em>
          </h2>
        </Reveal>
        {t.start.ways.map((w, i) => (
          <Reveal key={w.title} delay={0.08 + i * 0.08}>
            <Link
              href={w.href}
              className="group flex h-full flex-col gap-3 border-t border-v3-line/70 px-5 py-12 transition-colors duration-300 hover:bg-v3-raise md:px-10 lg:border-s lg:border-t-0 lg:px-8 lg:py-20"
            >
              <span className="text-sm text-v3-mute">{w.kicker}</span>
              <span className="font-v3-display text-3xl">{w.title}</span>
              <span className="leading-relaxed text-v3-soft rtl:leading-loose">{w.body}</span>
              <Arrow
                locale={locale}
                className="mt-6 h-5 w-5 text-v3-light transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5"
              />
            </Link>
          </Reveal>
        ))}
      </section>

      {/* ── The record ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 lg:px-14 lg:py-28">
        <Reveal className="mb-14 flex flex-col gap-4">
          <p className="text-sm text-v3-light">{t.record.kicker}</p>
          <h2 className="max-w-3xl font-v3-display text-4xl font-light leading-tight md:text-6xl rtl:leading-snug">
            {t.record.title}
          </h2>
        </Reveal>
        <LightRule>
          <ol className="flex flex-col">
            {t.record.rows.map((row) => (
              <li key={row.year} className="relative grid grid-cols-[4.5rem_1fr] gap-6 py-6 md:grid-cols-[7.5rem_1fr] md:gap-10">
                <span className="font-v3-display text-xl tabular-nums text-v3-mute md:text-2xl">{row.year}</span>
                <span
                  aria-hidden
                  className="absolute start-[4.5rem] top-[2.1rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2"
                />
                <Reveal className="flex flex-col gap-1.5 ps-6 md:ps-10">
                  {row.lines.map((line) => (
                    <p key={line} className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">
                      {line}
                    </p>
                  ))}
                </Reveal>
              </li>
            ))}
          </ol>
        </LightRule>
      </section>

      {/* ── In the room ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10 lg:px-14 lg:pb-28">
        <p className="mb-8 text-sm text-v3-light">{t.evidence.kicker}</p>
        <div className="grid gap-5 md:grid-cols-5">
          {t.evidence.photos.map((p, i) => (
            <Reveal key={p.src} delay={i * 0.1} className={i === 0 ? "md:col-span-3" : "md:col-span-2"}>
              <figure className="flex flex-col gap-3">
                <Parallax className="aspect-[4/3] rounded-sm bg-v3-raise">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover grayscale transition duration-700 hover:grayscale-0"
                  />
                </Parallax>
                <figcaption className="text-sm text-v3-mute">{p.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Writing (English only: the Persian blog is closed) ───────── */}
      {t.writing && posts.length > 0 && (
        <section className="border-t border-v3-line/70">
          <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 lg:px-14 lg:py-28">
            <div className="mb-12 flex items-end justify-between gap-6">
              <h2 className="font-v3-display text-4xl font-light md:text-6xl">{t.writing.title}</h2>
              <Link href="/blog" className="group inline-flex min-h-11 items-center gap-2 text-v3-light">
                {t.writing.all}
                <Arrow locale={locale} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid gap-px bg-v3-line/70 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.08} className="bg-v3-ink">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full min-h-72 flex-col gap-4 p-8 transition-colors duration-300 hover:bg-v3-raise"
                  >
                    <span className="text-sm text-v3-mute">
                      {post.categories[0]?.name ?? "Essay"}
                      {post.readingTime ? ` · ${post.readingTime} min` : ""}
                    </span>
                    <span className="font-v3-display text-2xl leading-snug group-hover:text-v3-light">{post.title}</span>
                    {post.excerpt && <span className="line-clamp-3 text-v3-soft">{post.excerpt}</span>}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Closing ──────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-t border-v3-line/70">
        <Beam className="[animation-delay:-8s]" />
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-5 py-24 md:px-10 lg:px-14 lg:py-36">
          <Reveal>
            <h2 className="max-w-5xl font-v3-display text-5xl font-light leading-[1.05] tracking-[-0.02em] md:text-7xl rtl:leading-snug rtl:tracking-normal">
              {t.closing.title}
              <em className="text-v3-light not-italic ltr:italic">{t.closing.accent}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.closing.body}</p>
            <Link
              href={t.closing.cta.href}
              className="group inline-flex min-h-14 items-center gap-3 self-start rounded-full bg-v3-light px-8 py-4 text-lg font-semibold text-v3-ink transition-transform duration-300 hover:-translate-y-0.5 md:self-auto"
            >
              {t.closing.cta.label}
              <Arrow locale={locale} className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
