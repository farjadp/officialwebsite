// ============================================================================
// Route: /admin/jobs/boards
// Role: Which company boards are read each day, and whether each one answered.
// Note: Owner only (see ../layout.tsx).
// ============================================================================

import { formatDistanceToNowStrict } from "date-fns"
import { prisma } from "@/lib/prisma"
import { BoardForm } from "@/components/admin/jobs/board-form"
import { BoardRowActions } from "@/components/admin/jobs/board-row-actions"
import { BOARD_KIND_LABEL, type BoardKind } from "@/lib/jobs/types"

export const dynamic = "force-dynamic"

export default async function BoardsPage() {
    const boards = await prisma.jobBoard.findMany({
        orderBy: { label: "asc" },
        include: { _count: { select: { postings: true } } },
    })
    const passing = await prisma.jobPosting.groupBy({ by: ["boardId"], where: { prefilter: "PASS" }, _count: true })
    const inLanes = new Map(passing.map((row) => [row.boardId, row._count]))

    return (
        <div className="space-y-6">
            <BoardForm />

            {boards.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
                    <p className="font-semibold text-slate-600">No boards yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                        Add a company you would work for. Its open roles are read once a day.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs text-slate-500">
                            <tr>
                                <th scope="col" className="px-5 py-3 font-semibold">Board</th>
                                <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                                <th scope="col" className="px-5 py-3 text-right font-semibold">Open roles</th>
                                <th scope="col" className="px-5 py-3 text-right font-semibold">In your lanes</th>
                                <th scope="col" className="px-5 py-3 font-semibold">Last read</th>
                                <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {boards.map((board) => (
                                <tr key={board.id} className={board.enabled ? "" : "text-slate-400"}>
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-slate-900">{board.label}</p>
                                        <p className="font-mono text-xs text-slate-400">{board.token}</p>
                                    </td>
                                    <td className="px-5 py-3.5">{BOARD_KIND_LABEL[board.kind as BoardKind] ?? board.kind}</td>
                                    <td className="px-5 py-3.5 text-right tabular-nums">{board.lastCount ?? "–"}</td>
                                    <td className="px-5 py-3.5 text-right tabular-nums">{inLanes.get(board.id) ?? 0}</td>
                                    <td className="px-5 py-3.5">
                                        {!board.enabled ? (
                                            "Paused"
                                        ) : board.lastError ? (
                                            <span className="text-rose-700">{board.lastError}</span>
                                        ) : board.lastFetchedAt ? (
                                            `${formatDistanceToNowStrict(board.lastFetchedAt)} ago`
                                        ) : (
                                            "Not yet"
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <BoardRowActions
                                            id={board.id}
                                            label={board.label}
                                            enabled={board.enabled}
                                            postings={board._count.postings}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
