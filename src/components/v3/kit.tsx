// ============================================================================
// File Path: src/components/v3/kit.tsx
// Why: The v3 "Light" building blocks for inner pages, so every page shares
//      one spacing scale, one type scale and one motion vocabulary with the
//      home. Server components; motion comes from ./motion. Direction-aware
//      throughout (logical start/end), so the same markup serves Persian.
//
//      Rules of the look: warm charcoal ground, bone text, ONE light accent
//      (#e8c48a) used sparingly — kickers, the accented half of a headline,
//      the primary button, rules of light. No second accent colour.
// ============================================================================

import Link from "next/link"
import type { ReactNode } from "react"
import type { Locale } from "@/components/home/v3/copy"
import { Arrow, Reveal, Spotlight } from "./motion"

export { Arrow, CountUp, LightRule, Parallax, Reveal, Spotlight } from "./motion"

const WRAP = "mx-auto w-full max-w-[1600px] px-5 md:px-10 lg:px-14"

/** The page ground. Every v3 page starts here. */
export function V3Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-v3-ink font-v3-body text-v3-bone selection:bg-v3-light selection:text-v3-ink">
      {children}
    </div>
  )
}

/** The slow diagonal light that crosses a section. */
export function Beam({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`v3-beam pointer-events-none absolute -top-1/4 start-0 h-[160%] w-72 bg-linear-to-r from-transparent via-v3-light/[0.07] to-transparent ${className ?? ""}`}
    />
  )
}

/** Small light label above a heading. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm text-v3-light ${className ?? ""}`}>{children}</p>
}

/** A headline with an optional accented tail in the light colour. */
export function Headline({
  as: Tag = "h2",
  children,
  accent,
  size = "section",
  className,
}: {
  as?: "h1" | "h2" | "h3"
  children?: ReactNode
  accent?: ReactNode
  size?: "hero" | "section" | "card"
  className?: string
}) {
  const sizes = {
    hero: "text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] tracking-[-0.02em] rtl:leading-[1.4] rtl:tracking-[-0.01em]",
    section: "text-4xl md:text-6xl leading-[1.05] tracking-[-0.015em] rtl:leading-[1.4] rtl:tracking-normal",
    card: "text-2xl md:text-3xl leading-tight rtl:leading-snug",
  }
  return (
    <Tag className={`font-v3-display font-light ${sizes[size]} ${className ?? ""}`}>
      {children}
      {accent && (
        <>
          {children ? " " : null}
          <em className="text-v3-light not-italic ltr:italic">{accent}</em>
        </>
      )}
    </Tag>
  )
}

/** Body copy at reading size. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-2xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose ${className ?? ""}`}>{children}</p>
}

/**
 * The top of an inner page: kicker, headline, lead, actions. The beam and
 * the cursor light are the home hero's, at a quieter scale.
 */
export function PageHero({
  kicker,
  title,
  accent,
  lead,
  actions,
  aside,
}: {
  kicker?: ReactNode
  title?: ReactNode
  accent?: ReactNode
  lead?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-v3-line/70">
      <Beam />
      <Spotlight className="-z-10" />
      <div className={`${WRAP} grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:items-end lg:py-32`}>
        <div className={`flex flex-col gap-8 ${aside ? "lg:col-span-7" : "lg:col-span-10"}`}>
          {kicker && (
            <Reveal immediate>
              <Kicker>{kicker}</Kicker>
            </Reveal>
          )}
          <Reveal immediate delay={0.08}>
            <Headline as="h1" size="hero" accent={accent}>
              {title}
            </Headline>
          </Reveal>
          {lead && (
            <Reveal immediate delay={0.16}>
              <Lead>{lead}</Lead>
            </Reveal>
          )}
          {actions && (
            <Reveal immediate delay={0.24} className="flex flex-wrap items-center gap-3">
              {actions}
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal immediate delay={0.3} className="lg:col-span-5">
            {aside}
          </Reveal>
        )}
      </div>
    </section>
  )
}

/** A page section with an optional header block. */
export function Section({
  id,
  kicker,
  title,
  accent,
  lead,
  children,
  className,
  bordered = true,
}: {
  id?: string
  kicker?: ReactNode
  title?: ReactNode
  accent?: ReactNode
  lead?: ReactNode
  children?: ReactNode
  className?: string
  bordered?: boolean
}) {
  const hasHeader = kicker || title || accent || lead
  return (
    <section id={id} className={`${bordered ? "border-b border-v3-line/70" : ""} ${className ?? ""}`}>
      <div className={`${WRAP} py-20 md:py-28`}>
        {hasHeader && (
          <Reveal className="mb-12 flex flex-col gap-4 md:mb-16">
            {kicker && <Kicker>{kicker}</Kicker>}
            {(title || accent) && <Headline accent={accent}>{title}</Headline>}
            {lead && <Lead className="mt-2">{lead}</Lead>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}

/** Buttons. Primary is the light; secondary is an outline; quiet is a link. */
export function V3Button({
  href,
  children,
  variant = "primary",
  locale,
  external = false,
  className,
}: {
  href: string
  children: ReactNode
  variant?: "primary" | "secondary" | "quiet"
  locale: Locale
  external?: boolean
  className?: string
}) {
  const styles = {
    primary: "rounded-full bg-v3-bone px-7 py-4 font-semibold text-v3-ink hover:-translate-y-0.5 hover:bg-v3-light",
    secondary: "rounded-full border border-v3-bone/60 px-7 py-4 font-medium text-v3-bone hover:border-v3-light hover:text-v3-light",
    quiet: "px-2 py-3 text-v3-bone underline decoration-v3-line underline-offset-8 hover:text-v3-light hover:decoration-v3-light",
  }
  const cls = `group inline-flex min-h-12 items-center gap-3 transition-all duration-300 ${styles[variant]} ${className ?? ""}`
  const inner = (
    <>
      {children}
      {variant !== "quiet" && (
        <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      )}
    </>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

/** A bordered card. Pass `href` to make the whole card a link with a hover lift. */
export function Card({
  href,
  children,
  className,
  tone = "plain",
}: {
  href?: string
  children: ReactNode
  className?: string
  tone?: "plain" | "raised" | "lit"
}) {
  const tones = {
    plain: "border border-v3-line/80",
    raised: "border border-v3-line/80 bg-v3-raise",
    lit: "border border-v3-light/50 bg-v3-raise shadow-[0_0_60px_-30px_rgba(232,196,138,0.5)]",
  }
  const base = `relative flex h-full flex-col gap-4 rounded-2xl p-7 md:p-8 ${tones[tone]} ${className ?? ""}`
  if (!href) return <div className={base}>{children}</div>
  return (
    <Link href={href} className={`group ${base} transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise`}>
      {children}
    </Link>
  )
}

/** A small rounded label. */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-v3-line px-3 py-1.5 text-[13px] text-v3-soft ${className ?? ""}`}>
      {children}
    </span>
  )
}

/** A list with a light tick (or a muted cross for "not for"). */
export function Checklist({ items, tone = "yes" }: { items: ReactNode[]; tone?: "yes" | "no" }) {
  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 border-b border-v3-line/60 py-4 last:border-b-0">
          <span
            aria-hidden
            className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "yes" ? "bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)]" : "bg-v3-mute/60"}`}
          />
          <span className={`text-lg leading-relaxed rtl:leading-loose ${tone === "yes" ? "text-v3-bone" : "text-v3-mute"}`}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** The closing band of a page: one statement, one action, a beam. */
export function CtaBand({
  title,
  accent,
  body,
  action,
}: {
  title: ReactNode
  accent?: ReactNode
  body?: ReactNode
  action: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Beam className="[animation-delay:-8s]" />
      <div className={`${WRAP} flex flex-col gap-10 py-24 lg:py-36`}>
        <Reveal>
          <Headline size="section" accent={accent} className="max-w-5xl md:text-7xl">
            {title}
          </Headline>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {body ? <Lead className="max-w-xl">{body}</Lead> : <span />}
          <div className="shrink-0">{action}</div>
        </Reveal>
      </div>
    </section>
  )
}

export { V3Faq } from "./faq"
