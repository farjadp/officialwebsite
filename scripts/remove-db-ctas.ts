import "dotenv/config"
import { prisma } from "../src/lib/prisma"

async function main() {
    console.log("Starting DB migration to remove hardcoded CTAs...")
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            content: true,
        }
    })

    let updatedCount = 0

    for (const post of posts) {
        if (!post.content) continue

        // Check if the old hardcoded CTA text is in the content
        if (post.content.includes("If this resonated")) {
            console.log(`Found hardcoded CTA in: "${post.title}"`)
            
            // Match the paragraph containing "If this resonated"
            const regex = /<p(?: [^>]+)?>[\s\S]*?If this resonated[\s\S]*?<\/p>/gi
            
            if (regex.test(post.content)) {
                const updatedContent = post.content.replace(regex, "").trim()
                
                await prisma.post.update({
                    where: { id: post.id },
                    data: { content: updatedContent }
                })
                console.log(`Successfully stripped CTA from: "${post.title}"`)
                updatedCount++
            } else {
                console.log(`Could not match paragraph structure in: "${post.title}", skipping string replace...`)
            }
        }
    }

    console.log(`Finished! Cleaned ${updatedCount} posts in the database.`)
}

main()
    .catch((e) => {
        console.error("Migration failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
