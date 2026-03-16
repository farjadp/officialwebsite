import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORY_TREE = {
    "Insights": ["Startup Strategy", "Founder Mindset", "Product–Market Fit", "Go-To-Market"],
    "Digital Acceleration": ["Growth Systems", "Automation", "AI Infrastructure"],
    "AI & Automation": ["AI for Startups", "LLM Systems", "Workflow Automation"],
    "Marketing Systems": ["AdTech", "Growth Marketing", "Content Strategy"],
    "Founder Infrastructure": ["Productivity", "Decision Systems", "Team Operations"],
    "Mentorship & Founder Lessons": ["Founder Stories", "Startup Mentorship", "Hard Truths"]
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function main() {
    console.log("Seeding strict category tree...")

    for (const [parentName, childrenNames] of Object.entries(CATEGORY_TREE)) {
        // Upsert Parent Category
        const parentSlug = slugify(parentName)
        let parentCategory = await prisma.category.findUnique({ where: { slug: parentSlug } })
        
        if (!parentCategory) {
            parentCategory = await prisma.category.create({
                data: {
                    name: parentName,
                    slug: parentSlug,
                }
            })
            console.log(`Created parent: ${parentName}`)
        } else {
            console.log(`Parent exists: ${parentName}`)
        }

        // Upsert Children Categories under the Parent
        for (const childName of childrenNames) {
            const childSlug = slugify(childName)
            const childCategory = await prisma.category.findUnique({ where: { slug: childSlug } })
            
            if (!childCategory) {
                await prisma.category.create({
                    data: {
                        name: childName,
                        slug: childSlug,
                        parentId: parentCategory.id
                    }
                })
                console.log(`  -> Created child: ${childName}`)
            } else {
                // Ensure it's correctly linked to the parent
                if (childCategory.parentId !== parentCategory.id) {
                    await prisma.category.update({
                        where: { id: childCategory.id },
                        data: { parentId: parentCategory.id }
                    })
                    console.log(`  -> Updated parent link for child: ${childName}`)
                } else {
                    console.log(`  -> Child exists: ${childName}`)
                }
            }
        }
    }

    console.log("Done seeding categories.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
