"use server"

// ============================================================================
// Hardware Source: dmarc.ts
// Version: 1.0.0 — 2026-08-23
// Why: Ingest uploaded DMARC aggregate reports
// Env / Identity: Server Actions
// ============================================================================

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { extractXml, parseAggregateReport } from "@/lib/email/dmarc"

const ROOT = "/admin/newsletter/dmarc"

export interface UploadSummary {
    imported: number
    duplicates: number
    failed: { file: string; error: string }[]
    messages: number
}

async function guard(): Promise<string | null> {
    const session = await auth()
    if (!session?.user || !["OWNER", "EDITOR"].includes(session.user.role)) return "Unauthorized"
    return null
}

export async function uploadDmarcReports(
    formData: FormData
): Promise<{ success: boolean; error?: string; data?: UploadSummary }> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0)
    if (!files.length) return { success: false, error: "Choose at least one report file" }

    const summary: UploadSummary = { imported: 0, duplicates: 0, failed: [], messages: 0 }

    for (const file of files) {
        try {
            const buffer = Buffer.from(await file.arrayBuffer())
            // A zip can legitimately hold several reports
            const documents = await extractXml(file.name, buffer)

            for (const doc of documents) {
                const parsed = parseAggregateReport(doc.xml)

                // reportId is only unique per reporting organisation
                const existing = await prisma.dmarcReport.findUnique({
                    where: {
                        orgName_reportId: { orgName: parsed.orgName, reportId: parsed.reportId },
                    },
                    select: { id: true },
                })
                if (existing) {
                    summary.duplicates += 1
                    continue
                }

                await prisma.dmarcReport.create({
                    data: {
                        reportId: parsed.reportId,
                        orgName: parsed.orgName,
                        orgEmail: parsed.orgEmail,
                        domain: parsed.domain,
                        rangeBegin: parsed.rangeBegin,
                        rangeEnd: parsed.rangeEnd,
                        policyP: parsed.policyP,
                        policySp: parsed.policySp,
                        policyPct: parsed.policyPct,
                        adkim: parsed.adkim,
                        aspf: parsed.aspf,
                        totalMessages: parsed.totalMessages,
                        passCount: parsed.passCount,
                        failCount: parsed.failCount,
                        sourceFile: doc.name.slice(0, 200),
                        records: {
                            create: parsed.rows.map((row) => ({
                                sourceIp: row.sourceIp,
                                count: row.count,
                                disposition: row.disposition,
                                dkimPolicy: row.dkimPolicy,
                                spfPolicy: row.spfPolicy,
                                headerFrom: row.headerFrom,
                                dkimDomain: row.dkimDomain,
                                dkimSelector: row.dkimSelector,
                                dkimResult: row.dkimResult,
                                spfDomain: row.spfDomain,
                                spfResult: row.spfResult,
                            })),
                        },
                    },
                })

                summary.imported += 1
                summary.messages += parsed.totalMessages
            }
        } catch (error) {
            summary.failed.push({
                file: file.name,
                error: error instanceof Error ? error.message : "Could not read the file",
            })
        }
    }

    revalidatePath(ROOT)
    return { success: true, data: summary }
}

export async function deleteDmarcReport(id: string): Promise<{ success: boolean; error?: string }> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    await prisma.dmarcReport.delete({ where: { id } })
    revalidatePath(ROOT)
    return { success: true }
}

export async function clearDmarcReports(): Promise<{ success: boolean; error?: string }> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    await prisma.dmarcReport.deleteMany({})
    revalidatePath(ROOT)
    return { success: true }
}
