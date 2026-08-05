"use client";

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
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { CheckStatus, WebsiteReadinessReport } from "@/lib/ai-website-readiness";

const statusConfig: Record<
  CheckStatus,
  { label: string; icon: typeof Check; className: string; iconClass: string }
> = {
  passing: {
    label: "Passing",
    icon: Check,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconClass: "bg-emerald-600 text-white",
  },
  attention: {
    label: "Needs attention",
    icon: CircleAlert,
    className: "bg-amber-50 text-amber-800 border-amber-200",
    iconClass: "bg-amber-100 text-amber-700",
  },
  missing: {
    label: "Missing",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200",
    iconClass: "bg-red-100 text-red-700",
  },
  info: {
    label: "For your info",
    icon: Info,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    iconClass: "bg-blue-100 text-blue-700",
  },
  na: {
    label: "N/A",
    icon: CircleMinus,
    className: "bg-stone-100 text-stone-500 border-stone-200",
    iconClass: "bg-stone-100 text-stone-500",
  },
};

function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="relative grid size-32 place-items-center rounded-full"
      style={{ background: `conic-gradient(#D97706 ${score * 3.6}deg, #E7E5E4 0deg)` }}
    >
      <div className="grid size-[108px] place-items-center rounded-full bg-white text-center">
        <div>
          <strong className="font-mono text-3xl text-[#0F3F35]">{score}</strong>
          <span className="text-sm text-stone-400">/100</span>
        </div>
      </div>
    </div>
  );
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
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
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
    <main className="min-h-screen bg-[#FDFBF7] pb-24 text-[#1C1917] selection:bg-[#0F3F35] selection:text-white">
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16 md:px-12 md:pt-36">
        <Link
          href="/tools"
          className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-[#0F3F35]"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Back to
          Tools Library
        </Link>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 px-3 py-1 text-xs font-bold tracking-widest text-[#D97706] uppercase">
              <Bot className="size-3.5" /> Live website diagnostic
            </div>
            <h1 className="max-w-4xl font-serif text-5xl leading-[1.05] text-[#0F3F35] md:text-7xl">
              Is your website ready <span className="text-[#D97706]">for AI?</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed font-medium text-stone-600 md:text-xl">
              See whether AI crawlers can access, understand, and cite your website—and get a
              prioritized plan to improve it.
            </p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,63,53,0.35)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#0F3F35] text-white">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="font-bold text-[#0F3F35]">28-point audit</p>
                <p className="text-xs text-stone-500">Technical + content signals</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-600">
              {["Crawler access", "Metadata", "Agent files", "Citability"].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2"
                >
                  <Check className="size-3.5 text-[#D97706]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={scan}
          className="mt-12 rounded-3xl border border-stone-200 bg-white p-3 shadow-[0_25px_70px_-35px_rgba(15,63,53,0.35)] md:flex md:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 md:px-5">
            <Search className="size-5 shrink-0 text-stone-400" />
            <label htmlFor="website-url" className="sr-only">
              Website URL
            </label>
            <input
              id="website-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="yourwebsite.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={loading}
              className="h-14 min-w-0 flex-1 bg-transparent text-base font-medium text-[#0F3F35] outline-none placeholder:text-stone-400 disabled:opacity-60 md:text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0F3F35] px-7 font-bold text-white transition-all hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {loading ? (
              <>
                <LoaderCircle className="size-5 animate-spin" /> Scanning website…
              </>
            ) : (
              <>
                Run free audit <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-stone-500">
          <span>No signup required. Public pages only.</span>
          <span>Usually takes 10–30 seconds.</span>
        </div>
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {loading && !report && (
        <section className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-8">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#0F3F35]/10">
                <FileSearch className="size-6 animate-pulse text-[#0F3F35]" />
              </div>
              <div>
                <p className="font-bold text-[#0F3F35]">Reading public website signals</p>
                <p className="mt-1 text-sm text-stone-500">
                  Checking the homepage, robots rules, sitemap, metadata, and agent files…
                </p>
              </div>
            </div>
            <div className="mt-7 h-2 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-[#D97706]" />
            </div>
          </div>
        </section>
      )}

      {report && (
        <section
          id="audit-report"
          className="scroll-mt-8 border-t border-stone-200 bg-stone-100/50 py-16"
        >
          <div className="mx-auto max-w-6xl space-y-8 px-6 md:px-12">
            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
                <ScoreRing score={report.overallScore} />
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#0F3F35] px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
                      {report.grade}
                    </span>
                    <span className="text-xs text-stone-400">
                      Scanned {new Date(report.scannedAt).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl text-[#0F3F35] md:text-4xl">
                    AI readiness report
                  </h2>
                  <a
                    href={report.finalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-1.5 truncate text-sm font-medium text-[#D97706] hover:underline"
                  >
                    {report.finalUrl}
                    <ExternalLink className="size-3.5 shrink-0" />
                  </a>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
                    {report.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReport(null);
                    setError("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-bold text-[#0F3F35] transition-colors hover:border-[#D97706] hover:text-[#D97706]"
                >
                  <RefreshCw className="size-4" /> Scan another site
                </button>
              </div>
              <div className="mt-9 grid gap-3 border-t border-stone-100 pt-7 sm:grid-cols-2 lg:grid-cols-5">
                {report.categories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className="rounded-2xl bg-stone-50 p-4 transition-colors hover:bg-stone-100"
                  >
                    <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                      {category.name}
                    </p>
                    <p className="mt-2 font-mono text-2xl font-bold text-[#0F3F35]">
                      {category.score === null ? "—" : category.score}
                      <span className="text-xs font-normal text-stone-400">
                        {category.score === null ? " Not scored" : "/100"}
                      </span>
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {!!priorities.length && (
              <div className="rounded-3xl border border-[#D97706]/20 bg-[#D97706]/5 p-7 md:p-9">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-[#D97706] text-white">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0F3F35]">Your highest-impact fixes</h2>
                    <p className="text-sm text-stone-600">Work through these first.</p>
                  </div>
                </div>
                <ol className="grid gap-3 md:grid-cols-2">
                  {priorities.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#0F3F35] font-mono text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-bold text-[#0F3F35]">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-stone-500">
                          {item.recommendation}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {report.categories.map((category) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-5 md:px-8">
                  <div>
                    <h2 className="font-serif text-2xl text-[#0F3F35]">{category.name}</h2>
                    <p className="mt-1 text-xs text-stone-500">
                      {category.checks.length} signals checked
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-2xl font-bold text-[#0F3F35]">
                      {category.score === null ? "Not scored" : `${category.score}/100`}
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-stone-100">
                  {category.checks.map((item) => {
                    const config = statusConfig[item.status];
                    const Icon = config.icon;
                    return (
                      <details key={item.id} className="group px-6 py-5 md:px-8">
                        <summary className="flex cursor-pointer list-none items-start gap-4 [&::-webkit-details-marker]:hidden">
                          <span
                            className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${config.iconClass}`}
                          >
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-stone-400">
                                {item.id}
                              </span>
                              <h3 className="font-bold text-[#0F3F35]">{item.title}</h3>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${config.className}`}
                              >
                                {config.label}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-stone-600">
                              {item.detail}
                            </p>
                          </div>
                          <ChevronDown className="mt-1 size-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
                        </summary>
                        {item.recommendation && (
                          <div className="mt-4 ml-11 rounded-xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
                            <strong className="text-[#0F3F35]">How to improve: </strong>
                            {item.recommendation}
                          </div>
                        )}
                      </details>
                    );
                  })}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border border-stone-200 bg-white p-5 text-xs leading-relaxed text-stone-500">
              This report is a point-in-time technical diagnostic, not a guarantee of ranking or
              inclusion in AI answers. AI visibility also depends on reputation, independent
              citations, source quality, and the policies of each model or search provider.
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
