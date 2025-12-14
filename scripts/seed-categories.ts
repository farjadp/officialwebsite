import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const categories = [
        {
            name: 'Technology',
            slug: 'technology',
            description: 'All things tech.',
            icon: 'Cpu',
            children: [
                { name: 'Web Development', slug: 'web-development', icon: 'Code', description: 'Frontend and Backend.' },
                { name: 'AI & Machine Learning', slug: 'ai-ml', icon: 'Bot', description: 'Artificial Intelligence.' },
                { name: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield', description: 'Security news.' },
            ]
        },
        {
            name: 'Business',
            slug: 'business',
            description: 'Business insights.',
            icon: 'Briefcase',
            children: [
                { name: 'Startups', slug: 'startups', icon: 'Rocket', description: 'Startup culture.' },
                { name: 'Marketing', slug: 'marketing', icon: 'Megaphone', description: 'Growth hacking.' },
            ]
        },
        {
            name: 'Lifestyle',
            slug: 'lifestyle',
            description: 'Living your best life.',
            icon: 'Coffee',
            children: [
                { name: 'Health', slug: 'health', icon: 'Heart', description: 'Wellness and fitness.' },
                { name: 'Travel', slug: 'travel', icon: 'Plane', description: 'World exploration.' },
            ]
        }
    ]

    console.log('Seeding categories...')

    for (const cat of categories) {
        const parent = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { icon: cat.icon, description: cat.description },
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                icon: cat.icon
            }
        })
        console.log(`Created parent: ${parent.name}`)

        for (const child of cat.children) {
            await prisma.category.upsert({
                where: { slug: child.slug },
                update: { icon: child.icon, description: child.description, parentId: parent.id },
                create: {
                    name: child.name,
                    slug: child.slug,
                    description: child.description,
                    icon: child.icon,
                    parentId: parent.id
                }
            })
            console.log(`  -> Created child: ${child.name}`)
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
