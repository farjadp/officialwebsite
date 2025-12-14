import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
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

    try {
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
            }
        }
        return NextResponse.json({ success: true, message: 'Seeding completed' })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    }
}
