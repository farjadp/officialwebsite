// ============================================================================
// File: scripts/seo-scan-check.mts
// Role: Run the site's own AI Website Readiness analyzer from the terminal.
// Why:  The scanner grades its own site. After a deploy this is the quickest
//       way to confirm the critical checks actually pass in production, without
//       clicking through the UI.
// Use:  npx tsx scripts/seo-scan-check.mts https://www.farjadp.info
// Note: the SSRF guard rejects private addresses on purpose, so this cannot be
//       pointed at localhost. Verify local changes with curl instead.
// ============================================================================

import { analyzeWebsite } from "@/lib/ai-website-readiness"

const target = process.argv[2]
if (!target) {
    console.error("usage: npx tsx scripts/seo-scan-check.mts <url>")
    process.exit(1)
}

const report = await analyzeWebsite(target)

console.log(`\n${target}`)
console.log(`  score=${report.overallScore}  grade=${report.grade}`)
console.log(`  ${report.summary}\n`)

for (const category of report.categories) {
    console.log(`  ${category.name.padEnd(20)} ${category.score ?? "—"}`)
}

const critical = report.categories.flatMap((c) => c.checks).filter((k) => k.weight === "critical")
console.log("\n  critical checks:")
for (const k of critical) {
    console.log(`   [${k.status.padEnd(9)}] ${k.id} ${k.title}`)
    if (k.status !== "passing") console.log(`               ${k.detail}`)
}
