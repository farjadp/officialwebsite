import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ success: true, data: projects })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const project = await prisma.project.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                content: body.content,
                coverImage: body.coverImage,
                featured: body.featured ?? false,
                technologies: body.technologies ?? [],
                websiteUrl: body.websiteUrl,
                githubUrl: body.githubUrl,
            }
        })
        return NextResponse.json({ success: true, data: project })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, ...data } = body
        
        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 })
        }

        const project = await prisma.project.update({
            where: { id },
            data
        })
        return NextResponse.json({ success: true, data: project })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 })
        }

        await prisma.project.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
