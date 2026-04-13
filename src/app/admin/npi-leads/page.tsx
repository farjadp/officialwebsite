import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
// Type definitions are inlined as the module structure changed.
import { Filter, Download, Mail } from "lucide-react";

export const metadata = {
  title: "NPI Assessment Leads | Admin",
};

export default async function NPILeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; stage?: string }>
}) {
  const resolvedParams = await searchParams;
  const roleFilter = resolvedParams.role;
  const stageFilter = resolvedParams.stage;

  // Build where clause
  const where: any = { toolId: "npi-assessment" };
  if (roleFilter) where.segment = roleFilter;
  // If stage was stored in DB natively we could query it. Since it's in answers JSON, 
  // filtering by stage at the DB level in Postgres jsonb is possible but complex for MVP.
  // We will do simple filtering.

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3F35]">NPI Assessment Leads</h1>
          <p className="text-slate-500 mt-1">Manage leads generated from the NPI Personal Brand Assessment tool.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Lead Info</th>
                <th className="px-6 py-4">Role / Stage</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4">Bottleneck</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No NPI leads found yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const data = lead.answers as any;
                  const scores = data?.scores as { weakest?: string; narrative?: number; presence?: number; impact?: number } | undefined;
                  const meta = data?.meta as any;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{lead.name || "Unknown"}</div>
                        <div className="text-slate-500 text-xs">{lead.email}</div>
                        {meta?.phone && <div className="text-slate-400 text-xs mt-1">{meta.phone}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          {lead.segment}
                        </span>
                        {meta?.stage && (
                          <div className="text-slate-400 text-xs mt-1">{meta.stage}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          {lead.score}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {scores?.weakest ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 uppercase">
                            {scores.weakest}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {/* We could add resend email functionality here if requested, MVP just viewing is fine */}
                        <button className="text-slate-400 hover:text-[#0F3F35] transition-colors p-1" title="Feature coming soon">
                          <Mail className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
