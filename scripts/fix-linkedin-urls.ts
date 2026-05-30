import "dotenv/config"
import { prisma } from "../src/lib/prisma"

async function main() {
    console.log("Starting LinkedIn URL migration in database...")
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

        // Check if old URL variants are present
        const hasOldUrl1 = post.content.includes("linkedin.com/in/farjadp")
        const hasOldUrl2 = post.content.includes("linkedin.com/in/farjadp/")

        if (hasOldUrl1 || hasOldUrl2) {
            console.log(`Fixing post: "${post.title}" (ID: ${post.id})`)
            
            // Replace both variants safely
            let updatedContent = post.content
                .replace(/linkedin\.com\/in\/farjadp\/?/g, "linkedin.com/in/farjadpourmohammad/")
                // Make sure any links starting with https:// have the correct URL
                .replace(/linkedin\.com\/in\/farjadpourmohammad\/\//g, "linkedin.com/in/farjadpourmohammad/")

            await prisma.post.update({
                where: { id: post.id },
                data: { content: updatedContent }
            })
            updatedCount++
        }
    }

    console.log(`Finished! Updated ${updatedCount} posts in the database.`)
}

main()
    .catch((e) => {
        console.error("Migration failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
