// ============================================================================
// File Path: src/components/v3/pages/portal-shell.tsx
// Why: One v3 "Light" frame for the whole logged-in portal — the side
//      navigation, the page title area and a slot for content — so all
//      eleven routes in each locale share a single look instead of each
//      page carrying its own gradient card. The placeholder routes render
//      PortalPlaceholder and nothing else.
//
//      Restyle only: no page's auth guard, session check, redirect or
//      query lives here.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import { Lock } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { UserPortalNav, type PortalNavItem } from "@/components/auth/user-portal-nav"
import { Beam, Headline, Kicker, Lead, Reveal } from "@/components/v3/kit"

/** The ground and the two-column frame every portal page sits in. */
export function PortalShell({
  locale,
  active,
  isPrivileged,
  kicker,
  title,
  lead,
  actions,
  children,
}: {
  locale: Locale
  active: PortalNavItem
  isPrivileged?: boolean
  kicker?: ReactNode
  title?: ReactNode
  lead?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}) {
  const hasHeader = Boolean(kicker || title || lead || actions)
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-v3-ink font-v3-body text-v3-bone selection:bg-v3-light selection:text-v3-ink">
      <Beam className="-z-10" />
      <div className="mx-auto w-full max-w-[1600px] px-5 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          <UserPortalNav locale={locale} activeItem={active} isPrivileged={isPrivileged} />

          <div className="flex min-w-0 flex-col gap-8">
            {hasHeader && (
              <Reveal immediate className="flex flex-col gap-4 border-b border-v3-line/70 pb-8 md:flex-row md:items-end md:justify-between md:gap-8">
                <div className="flex flex-col gap-3">
                  {kicker && <Kicker>{kicker}</Kicker>}
                  {title && (
                    <Headline as="h1" size="card" className="md:text-4xl">
                      {title}
                    </Headline>
                  )}
                  {lead && <Lead className="text-base md:text-lg">{lead}</Lead>}
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
              </Reveal>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/** A bordered panel inside the portal, with its own small heading. */
export function PortalPanel({
  title,
  children,
  delay = 0,
  className,
}: {
  title?: ReactNode
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="flex h-full flex-col gap-6 rounded-2xl border border-v3-line/80 bg-v3-raise p-6 md:p-8">
        {title && <h2 className="text-sm tracking-[0.18em] text-v3-light uppercase">{title}</h2>}
        {children}
      </div>
    </Reveal>
  )
}

/**
 * The "not yet open to you" card the placeholder routes show. The words are
 * each page's own and are passed in verbatim.
 */
export function PortalLocked({ title, body }: { title: ReactNode; body: ReactNode }) {
  return (
    <Reveal delay={0.08}>
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 rounded-2xl border border-v3-line/80 bg-v3-raise p-10 text-center md:p-16">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-v3-line bg-v3-ink">
          <Lock className="h-7 w-7 text-v3-light" aria-hidden />
        </span>
        <Headline as="h2" size="card">
          {title}
        </Headline>
        <p className="max-w-md leading-relaxed text-v3-soft rtl:leading-loose">{body}</p>
      </div>
    </Reveal>
  )
}

/** Shell + locked card: the whole of a placeholder route. */
export function PortalPlaceholder({
  locale,
  active,
  isPrivileged,
  title,
  body,
}: {
  locale: Locale
  active: PortalNavItem
  isPrivileged?: boolean
  title: ReactNode
  body: ReactNode
}) {
  return (
    <PortalShell locale={locale} active={active} isPrivileged={isPrivileged}>
      <PortalLocked title={title} body={body} />
    </PortalShell>
  )
}
