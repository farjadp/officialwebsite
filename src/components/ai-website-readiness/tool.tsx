"use client";

// ============================================================================
// File Path: src/components/ai-website-readiness/tool.tsx
// Why: The AI website readiness audit in the v3 "Light" look. The scan
//      request, the response handling, usage tracking and every string are
//      unchanged. Check status is told by icon shape and its label with the
//      single accent — never by red/amber/green.
// Env / Identity: Client Component (rendered inside ToolShell by the page)
// ============================================================================

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  CircleAlert,
  CircleMinus,
  ExternalLink,
  FileSearch,
  Info,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { CheckStatus, WebsiteReadinessReport } from "@/lib/ai-website-readiness";
import { ScoreRing, StepIn, ToolButton, ToolField } from "@/components/v3/tool-kit";

// Filled light = passing; outlined light = needs work (icon tells which);
// outlined line = informational. Shape and words carry the meaning.
const statusConfig: Record<
  CheckStatus,
  { label: string; icon: typeof Check; className: string; iconClass: string }
> = {
  passing: {
    label: "Passing",
    icon: Check,
    className: "border-v3-light/60 text-v3-light",
    iconClass: "bg-v3-light text-v3-ink shadow-[0_0_12px_rgba(232,196,138,0.5)]",
  },
  attention: {
    label: "Needs attention",
    icon: CircleAlert,
    className: "border-v3-light/60 text-v3-bone",
    iconClass: "border border-v3-light text-v3-light",
  },
  missing: {
    label: "Missing",
    icon: AlertCircle,
    className: "border-v3-bone/60 bg-v3-bone/5 text-v3-bone",
    iconClass: "border border-dashed border-v3-light text-v3-light",
  },
  info: {
    label: "For your info",
    icon: Info,
    className: "border-v3-line text-v3-soft",
    iconClass: "border border-v3-line text-v3-soft",
  },
  na: {
    label: "N/A",
    icon: CircleMinus,
    className: "border-v3-line text-v3-mute",
    iconClass: "border border-v3-line text-v3-mute",
  },
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function AiWebsiteReadinessTool() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<WebsiteReadinessReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function scan(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/tools/ai-website-readiness", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The scan could not be completed.");
      setReport(data);
      fetch("/api/tool-usage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ toolId: "ai-website-readiness", score: data.overallScore }),
      }).catch(() => {});
      requestAnimationFrame(() =>
        document
          .getElementById("audit-report")
          ?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "start" })
      );
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "The scan could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  const priorities =
    report?.categories
      .flatMap((category) => category.checks.map((item) => ({ ...item, category: category.name })))
      .filter((item) => item.scored && (item.status === "missing" || item.status === "attention"))
      .sort((a, b) => Number(b.status === "missing") - Number(a.status === "missing"))
      .slice(0, 5) || [];

  return (
    <div className="flex flex-col">
      <section className="flex flex-col">
        <StepIn>
          <Link
            href="/tools"
            className="group mb-12 inline-flex items-center gap-2 text-sm text-v3-mute transition-colors hover:text-v3-light"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden /> Back to
            Tools Library
          </Link>
        </StepIn>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <StepIn>
              <p className="inline-flex items-center gap-2 text-sm text-v3-light">
                <Bot className="size-4" aria-hidden /> Live website diagnostic
              </p>
            </StepIn>
            <StepIn delay={0.08}>
              <h1 className="max-w-4xl font-v3-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.04] tracking-[-0.02em] rtl:leading-[1.4] rtl:tracking-normal">
                Is your website ready <em className="text-v3-light not-italic ltr:italic">for AI?</em>
              </h1>
            </StepIn>
            <StepIn delay={0.16}>
              <p className="max-w-2xl text-lg leading-relaxed text-v3-soft md:text-xl">
                See whether AI crawlers can access, understand, and cite your website—and get a
                prioritized plan to improve it.
              </p>
            </StepIn>
          </div>
          <StepIn delay={0.24} className="rounded-3xl border border-v3-line/80 bg-v3-raise p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl border border-v3-light/60 text-v3-light">
                <ShieldCheck className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-medium text-v3-bone">28-point audit</p>
                <p className="text-xs text-v3-mute">Technical + content signals</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-v3-soft">
              {["Crawler access", "Metadata", "Agent files", "Citability"].map((label) => (
                <div key={label} className="flex items-center gap-2 rounded-lg border border-v3-line/70 px-3 py-2">
                  <Check className="size-3.5 text-v3-light" aria-hidden />
                  {label}
                </div>
              ))}
            </div>
          </StepIn>
        </div>

        <StepIn delay={0.3}>
          <form
            onSubmit={scan}
            className="mt-12 flex flex-col gap-4 rounded-3xl border border-v3-line/80 p-5 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.35)] md:flex-row md:items-end md:p-6"
          >
            <div className="min-w-0 flex-1">
              <ToolField
                id="website-url"
                label="Website URL"
                type="text"
                inputMode="url"
                autoComplete="url"
                dir="ltr"
                placeholder="yourwebsite.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={loading}
                className="disabled:opacity-60 md:text-lg"
              />
            </div>
            <ToolButton
              type="submit"
              loading={loading}
              disabled={!url.trim()}
              className="h-14 w-full md:w-auto"
            >
              {loading ? (
                "Scanning website…"
              ) : (
                <>
                  Run free audit <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </>
              )}
            </ToolButton>
          </form>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-v3-mute">
            <span>No signup required. Public pages only.</span>
            <span>Usually takes 10–30 seconds.</span>
          </div>
        </StepIn>
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-2xl border border-v3-light/60 bg-v3-light/5 p-4 text-sm text-v3-bone"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-v3-light" aria-hidden />
            <span>{error}</span>
          </div>
        )}
      </section>

      {loading && !report && (
        <StepIn className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-v3-line/80 bg-v3-raise p-8" aria-live="polite">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-2xl border border-v3-light/50">
                <FileSearch className="size-6 text-v3-light motion-safe:animate-pulse" aria-hidden />
              </div>
              <div>
                <p className="font-medium text-v3-bone">Reading public website signals</p>
                <p className="mt-1 text-sm text-v3-mute">
                  Checking the homepage, robots rules, sitemap, metadata, and agent files…
                </p>
              </div>
            </div>
            <div className="mt-7 h-px overflow-hidden bg-v3-line">
              <div className="h-full w-2/3 bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.7)] motion-safe:animate-pulse" />
            </div>
          </div>
        </StepIn>
      )}

      {report && (
        <section id="audit-report" className="mt-16 scroll-mt-28 border-t border-v3-line/70 pt-16">
          <div className="flex flex-col gap-8">
            <StepIn className="rounded-3xl border border-v3-line/80 bg-v3-raise p-7 md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
                <ScoreRing score={report.overallScore} max={100} />
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-v3-light/60 px-3 py-1 text-xs font-medium text-v3-light">
                      {report.grade}
                    </span>
                    <span className="text-xs text-v3-mute">
                      Scanned {new Date(report.scannedAt).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="font-v3-display text-3xl font-light md:text-4xl">AI readiness report</h2>
                  <a
                    href={report.finalUrl}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="mt-2 inline-flex max-w-full items-center gap-1.5 truncate text-sm text-v3-light underline decoration-v3-light/40 underline-offset-4 hover:decoration-v3-light"
                  >
                    {report.finalUrl}
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                  </a>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-v3-soft">{report.summary}</p>
                </div>
                <ToolButton
                  variant="secondary"
                  onClick={() => {
                    setReport(null);
                    setError("");
                    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" });
                  }}
                >
                  <RefreshCw className="size-4" aria-hidden /> Scan another site
                </ToolButton>
              </div>
              <div className="mt-9 grid gap-3 border-t border-v3-line/70 pt-7 sm:grid-cols-2 lg:grid-cols-5">
                {report.categories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className="rounded-2xl border border-v3-line/70 p-4 transition-colors hover:border-v3-light/60"
                  >
                    <p className="text-xs text-v3-mute">{category.name}</p>
                    <p className="mt-2 font-v3-display text-3xl font-light tabular-nums text-v3-bone" dir="ltr">
                      {category.score === null ? "—" : category.score}
                      <span className="font-v3-body text-xs text-v3-mute">
                        {category.score === null ? " Not scored" : "/100"}
                      </span>
                    </p>
                  </a>
                ))}
              </div>
            </StepIn>

            {!!priorities.length && (
              <StepIn delay={0.1} className="rounded-3xl border border-v3-light/40 p-7 shadow-[0_0_60px_-30px_rgba(232,196,138,0.5)] md:p-9">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-v3-light text-v3-ink">
                    <Sparkles className="size-5" aria-hidden />
                  </div>
                  <div>
                    <h2 className="font-v3-display text-2xl font-light">Your highest-impact fixes</h2>
                    <p className="text-sm text-v3-soft">Work through these first.</p>
                  </div>
                </div>
                <ol className="grid gap-3 md:grid-cols-2">
                  {priorities.map((item, index) => (
                    <li key={item.id} className="flex gap-4 rounded-2xl border border-v3-line/80 bg-v3-raise p-4">
                      <span className="w-6 shrink-0 font-v3-display text-xl leading-none tabular-nums text-v3-light">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-v3-bone">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-v3-mute">{item.recommendation}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </StepIn>
            )}

            {report.categories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-28 overflow-hidden rounded-3xl border border-v3-line/80"
              >
                <div className="flex items-center justify-between gap-4 border-b border-v3-line/80 bg-v3-raise px-6 py-5 md:px-8">
                  <div>
                    <h2 className="font-v3-display text-2xl font-light">{category.name}</h2>
                    <p className="mt-1 text-xs text-v3-mute">{category.checks.length} signals checked</p>
                  </div>
                  <div className="text-end">
                    <p className="font-v3-display text-2xl font-light tabular-nums text-v3-bone" dir="ltr">
                      {category.score === null ? "Not scored" : `${category.score}/100`}
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-v3-line/60">
                  {category.checks.map((item) => {
                    const config = statusConfig[item.status];
                    const Icon = config.icon;
                    return (
                      <details key={item.id} className="group px-6 py-5 md:px-8">
                        <summary className="flex cursor-pointer list-none items-start gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light [&::-webkit-details-marker]:hidden">
                          <span
                            className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${config.iconClass}`}
                          >
                            <Icon className="size-4" aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs tabular-nums text-v3-mute">{item.id}</span>
                              <h3 className="font-medium text-v3-bone">{item.title}</h3>
                              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${config.className}`}>
                                {config.label}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-v3-soft">{item.detail}</p>
                          </div>
                          <ChevronDown className="mt-1 size-4 shrink-0 text-v3-mute transition-transform group-open:rotate-180" aria-hidden />
                        </summary>
                        {item.recommendation && (
                          <div className="ms-11 mt-4 rounded-xl border-s border-v3-light/50 bg-v3-raise p-4 text-sm leading-relaxed text-v3-soft">
                            <strong className="font-medium text-v3-bone">How to improve: </strong>
                            {item.recommendation}
                          </div>
                        )}
                      </details>
                    );
                  })}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border border-v3-line/80 p-5 text-xs leading-relaxed text-v3-mute">
              This report is a point-in-time technical diagnostic, not a guarantee of ranking or
              inclusion in AI answers. AI visibility also depends on reputation, independent
              citations, source quality, and the policies of each model or search provider.
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
