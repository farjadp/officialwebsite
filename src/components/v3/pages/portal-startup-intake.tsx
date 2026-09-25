// ============================================================================
// File Path: src/components/v3/pages/portal-startup-intake.tsx
// Why: /profile/startup-intake and its Persian twin in the v3 "Light" look,
//      plus the wizard page's frame. One component per view for both
//      locales. The copy is the pages' own, word for word — both locales
//      already carried the same Persian wording, so both COPY entries do.
//      Fixed on the way: the Persian list linked each saved intake into the
//      English portal (`/profile/startup-intake/<id>`); every href now goes
//      through localePath().
// Env / Identity: React Server Component
// ============================================================================

import type { ComponentProps } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Plus, Rocket } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { IntakeWizard } from "@/components/startup-intake/intake-wizard"
import { Arrow, Headline, Reveal } from "@/components/v3/kit"
import { PortalShell } from "./portal-shell"

type Copy = {
  title: string
  lead: string
  create: string
  emptyTitle: string
  emptyBody: string
  emptyAction: string
  submitted: string
  draft: string
  untitled: string
  updated: string
}

const COPY: Record<Locale, Copy> = {
  en: {
    title: "استارتاپ‌های شما",
    lead: "مدیریت استارتاپ‌های ثبت شده جهت بررسی",
    create: "ثبت استارتاپ جدید",
    emptyTitle: "هنوز استارتاپی ثبت نکردید!",
    emptyBody: "شما می‌توانید چندین استارتاپ مختلف را در پروفایل خود ثبت و پیگیری کنید.",
    emptyAction: "اولین استارتاپ خود را ثبت کنید",
    submitted: "ارسال شده",
    draft: "پیش‌نویس",
    untitled: "بدون نام",
    updated: "آخرین ویرایش:",
  },
  fa: {
    title: "استارتاپ‌های شما",
    lead: "مدیریت استارتاپ‌های ثبت شده جهت بررسی",
    create: "ثبت استارتاپ جدید",
    emptyTitle: "هنوز استارتاپی ثبت نکردید!",
    emptyBody: "شما می‌توانید چندین استارتاپ مختلف را در پروفایل خود ثبت و پیگیری کنید.",
    emptyAction: "اولین استارتاپ خود را ثبت کنید",
    submitted: "ارسال شده",
    draft: "پیش‌نویس",
    untitled: "بدون نام",
    updated: "آخرین ویرایش:",
  },
}

export type PortalIntakeSummary = {
  id: string
  startupName: string | null
  status: string
  updatedAt: Date
}

const PRIMARY =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-v3-bone px-6 text-sm font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"
const SECONDARY =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-v3-bone/60 px-6 text-sm font-medium text-v3-bone transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-light hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"

/** The list of a user's saved intakes. */
export function PortalStartupIntakeList({
  locale,
  isPrivileged,
  intakes,
}: {
  locale: Locale
  isPrivileged: boolean
  intakes: PortalIntakeSummary[]
}) {
  const t = COPY[locale]
  const href = (path: string) => localePath(locale, path)

  return (
    <PortalShell
      locale={locale}
      active="startup-intake"
      isPrivileged={isPrivileged}
      title={
        <span className="flex items-center gap-3">
          <Rocket className="h-6 w-6 shrink-0 text-v3-light" aria-hidden />
          {t.title}
        </span>
      }
      lead={t.lead}
      actions={
        <Link href={href("/profile/startup-intake/new")} className={PRIMARY}>
          <Plus className="h-4 w-4" aria-hidden />
          {t.create}
        </Link>
      }
    >
      {intakes.length === 0 ? (
        <Reveal delay={0.08}>
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-v3-line bg-v3-raise p-10 text-center md:p-16">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-v3-line bg-v3-ink">
              <Rocket className="h-7 w-7 text-v3-light" aria-hidden />
            </span>
            <Headline as="h2" size="card">
              {t.emptyTitle}
            </Headline>
            <p className="max-w-md leading-relaxed text-v3-soft rtl:leading-loose">{t.emptyBody}</p>
            <Link href={href("/profile/startup-intake/new")} className={SECONDARY}>
              <Plus className="h-4 w-4" aria-hidden />
              {t.emptyAction}
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {intakes.map((intake, i) => {
            const isSubmitted = intake.status === "SUBMITTED"
            return (
              <Reveal key={intake.id} delay={(i % 4) * 0.07}>
                <Link
                  href={href(`/profile/startup-intake/${intake.id}`)}
                  className="group flex h-full flex-col gap-5 rounded-2xl border border-v3-line/80 bg-v3-raise p-6 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Headline as="h3" size="card" className="text-xl transition-colors group-hover:text-v3-light md:text-2xl">
                      {intake.startupName || t.untitled}
                    </Headline>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                        isSubmitted ? "border-v3-light/50 bg-v3-light/10 text-v3-light" : "border-v3-line text-v3-mute"
                      }`}
                    >
                      {isSubmitted ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                          {t.submitted}
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          {t.draft}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-v3-line/60 pt-4 text-sm text-v3-mute">
                    <span>
                      {t.updated} {new Date(intake.updatedAt).toLocaleDateString("fa-IR")}
                    </span>
                    <Arrow
                      locale={locale}
                      className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    />
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </PortalShell>
  )
}

/** The frame around the intake wizard. The wizard itself is untouched. */
export function PortalStartupIntakeForm({
  locale,
  isPrivileged,
  initialData,
  submitEndpoint,
  uploadEndpoint,
}: {
  locale: Locale
  isPrivileged: boolean
  initialData: ComponentProps<typeof IntakeWizard>["initialData"]
  submitEndpoint: string
  uploadEndpoint: string
}) {
  return (
    <PortalShell locale={locale} active="startup-intake" isPrivileged={isPrivileged}>
      <Reveal immediate>
        <div className="rounded-2xl border border-v3-line/80 bg-v3-raise p-6 md:p-8">
          <IntakeWizard
            mode="user"
            initialData={initialData}
            submitEndpoint={submitEndpoint}
            uploadEndpoint={uploadEndpoint}
          />
        </div>
      </Reveal>
    </PortalShell>
  )
}
