import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Search,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

function scoreClass(score: number | null) {
  if (score === null) return "bg-slate-100 text-slate-400";
  if (score >= 75) return "bg-emerald-50 text-emerald-700";
  if (score >= 60) return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

function formatDuration(durationMs: number) {
  return durationMs < 1000 ? `${durationMs} ms` : `${(durationMs / 1000).toFixed(1)} s`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(date);
}

export default async function WebsiteAuditsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const status = params.status === "SUCCESS" || params.status === "FAILED" ? params.status : "";
  const where = {
    ...(query
      ? {
          OR: [
            { hostname: { contains: query, mode: "insensitive" as const } },
            { requestedUrl: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [logs, total, successful, failed, todayCount, scoreAggregate] = await Promise.all([
    prisma.websiteAuditLog.findMany({ where, orderBy: { createdAt: "desc" }, take: 300 }),
    prisma.websiteAuditLog.count(),
    prisma.websiteAuditLog.count({ where: { status: "SUCCESS" } }),
    prisma.websiteAuditLog.count({ where: { status: "FAILED" } }),
    prisma.websiteAuditLog.count({ where: { createdAt: { gte: today } } }),
    prisma.websiteAuditLog.aggregate({
      where: { status: "SUCCESS" },
      _avg: { overallScore: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
            <Globe2 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Website Audit Logs</h1>
            <p className="mt-1 text-sm text-slate-500">
              Websites checked with the AI Website Readiness tool
            </p>
          </div>
        </div>
        <Link
          href="/tools/ai-website-readiness"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-violet-300 hover:text-violet-700"
        >
          Open audit tool <ExternalLink className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          {
            label: "Total scans",
            value: total,
            icon: Globe2,
            color: "bg-slate-100 text-slate-600",
          },
          {
            label: "Successful",
            value: successful,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Failed",
            value: failed,
            icon: AlertTriangle,
            color: "bg-rose-50 text-rose-600",
          },
          { label: "Today", value: todayCount, icon: Clock3, color: "bg-blue-50 text-blue-600" },
          {
            label: "Average score",
            value: Math.round(scoreAggregate._avg.overallScore || 0),
            icon: BarChart3,
            color: "bg-amber-50 text-amber-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${stat.color}`}>
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search domain or URL…"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm transition-colors outline-none focus:border-violet-400 focus:bg-white"
          />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-violet-400"
        >
          <option value="">All statuses</option>
          <option value="SUCCESS">Successful</option>
          <option value="FAILED">Failed</option>
        </select>
        <button className="h-10 cursor-pointer rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-violet-700">
          Apply filters
        </button>
        {(query || status) && (
          <Link
            href="/admin/website-audits"
            className="px-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Clear
          </Link>
        )}
      </form>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <Globe2 className="mx-auto mb-4 size-10 text-slate-200" />
          <p className="font-semibold text-slate-600">No website audits found</p>
          <p className="mt-1 text-sm text-slate-400">New scans will appear here automatically.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500">
            Showing {logs.length} most recent matching scans
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="px-5 py-3.5">Website</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Overall</th>
                  <th className="px-4 py-3.5">Access</th>
                  <th className="px-4 py-3.5">Metadata</th>
                  <th className="px-4 py-3.5">Agent</th>
                  <th className="px-4 py-3.5">Citability</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="max-w-xs px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800" title={log.hostname}>
                            {log.hostname}
                          </p>
                          <p
                            className="mt-0.5 truncate text-xs text-slate-400"
                            title={log.requestedUrl}
                          >
                            {log.requestedUrl}
                          </p>
                          {log.error && (
                            <p
                              className="mt-1 max-w-xs truncate text-xs text-rose-600"
                              title={log.error}
                            >
                              {log.error}
                            </p>
                          )}
                        </div>
                        {log.finalUrl && (
                          <a
                            href={log.finalUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${log.hostname}`}
                            className="shrink-0 text-slate-300 hover:text-violet-600"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${log.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    {[
                      log.overallScore,
                      log.accessScore,
                      log.metadataScore,
                      log.agentScore,
                      log.citabilityScore,
                    ].map((score, index) => (
                      <td key={index} className="px-4 py-4">
                        <span
                          className={`inline-flex min-w-10 justify-center rounded-md px-2 py-1 font-mono text-xs font-bold ${scoreClass(score)}`}
                        >
                          {score ?? "—"}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-4 font-mono text-xs whitespace-nowrap text-slate-500">
                      {formatDuration(log.durationMs)}
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap text-slate-500">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
