import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withApiLogging } from "@/lib/api-logger"

async function getHandler() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ success: true, data: testimonials })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json()
        const testimonial = await prisma.testimonial.create({
            data: {
                name: body.name,
                role: body.role,
                company: body.company,
                content: body.content,
                avatar: body.avatar,
                featured: body.featured ?? false,
            }
        })
        return NextResponse.json({ success: true, data: testimonial })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

async function patchHandler(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, ...data } = body
        
        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 })
        }

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data
        })
        return NextResponse.json({ success: true, data: testimonial })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

async function deleteHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        
        if (!id) {
            return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 })
        }

        await prisma.testimonial.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

export const GET = withApiLogging("GET", getHandler as any)
export const POST = withApiLogging("POST", postHandler as any)
export const PATCH = withApiLogging("PATCH", patchHandler as any)
export const DELETE = withApiLogging("DELETE", deleteHandler as any)
