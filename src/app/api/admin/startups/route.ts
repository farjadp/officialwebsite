import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withApiLogging } from "@/lib/api-logger"

async function getHandler() {
    try {
        const startups = await prisma.mentoredStartup.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json({ success: true, data: startups })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json()
        const startup = await prisma.mentoredStartup.create({
            data: {
                name: body.name,
                industry: body.industry,
                satisfaction: body.satisfaction,
                status: body.status,
                isActive: body.isActive ?? true,
                startDate: body.startDate,
                endDate: body.endDate,
                website: body.website,
                linkedin: body.linkedin,
                logo: body.logo,
                description: body.description,
                founderName: body.founderName,
                founderPhoto: body.founderPhoto,
                order: body.order ?? 0,
            }
        })
        return NextResponse.json({ success: true, data: startup })
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

        const startup = await prisma.mentoredStartup.update({
            where: { id },
            data
        })
        return NextResponse.json({ success: true, data: startup })
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

        await prisma.mentoredStartup.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

export const GET = withApiLogging("GET", getHandler as any)
export const POST = withApiLogging("POST", postHandler as any)
export const PATCH = withApiLogging("PATCH", patchHandler as any)
export const DELETE = withApiLogging("DELETE", deleteHandler as any)
