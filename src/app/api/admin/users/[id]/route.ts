// src/app/api/admin/users/[id]/route.ts
// PATCH — Update user role or active status
// DELETE — Remove a user

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ─── Auth guard helper ────────────────────────────────────────────────────────
async function requireOwner() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!currentUser || currentUser.role !== "OWNER") return null;
    return currentUser;
}

// ─── PATCH — update role or isActive ─────────────────────────────────────────
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const owner = await requireOwner();
    if (!owner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent owner from modifying themselves
    if (id === owner.id) {
        return NextResponse.json(
            { error: "You cannot modify your own account from here" },
            { status: 400 }
        );
    }

    // Check user exists
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { role, isActive } = body as { role?: string; isActive?: boolean };

    const validRoles = ["OWNER", "EDITOR", "USER"];
    const updateData: Record<string, unknown> = {};

    if (role !== undefined) {
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
        updateData.role = role;
    }

    if (isActive !== undefined) {
        updateData.isActive = Boolean(isActive);
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            emailVerified: true,
            createdAt: true,
            image: true,
        },
    });

    return NextResponse.json(updated);
}

// ─── DELETE — remove user ─────────────────────────────────────────────────────
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const owner = await requireOwner();
    if (!owner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent deleting yourself
    if (id === owner.id) {
        return NextResponse.json(
            { error: "You cannot delete your own account" },
            { status: 400 }
        );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
