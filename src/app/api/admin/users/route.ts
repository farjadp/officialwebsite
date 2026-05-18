// src/app/api/admin/users/route.ts
// POST — Create a new user from the admin panel

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import * as bcrypt from "bcryptjs";

async function postHandler(req: NextRequest) {
    // Auth guard — only OWNER can create users
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!currentUser || currentUser.role !== "OWNER") {
        return NextResponse.json({ error: "Forbidden — only owners can create users" }, { status: 403 });
    }

    // Parse body
    const body = await req.json();
    const { name, email, password, role } = body as {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
    };

    // Validate required fields
    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!email.includes("@")) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const validRoles = ["OWNER", "EDITOR", "USER"];
    const userRole = validRoles.includes(role ?? "") ? role! : "USER";

    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await prisma.user.create({
        data: {
            name: name?.trim() || null,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: userRole as "OWNER" | "EDITOR" | "USER",
            isActive: true,
            // Mark as verified since admin is creating it manually
            emailVerified: new Date(),
        },
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

    return NextResponse.json(newUser, { status: 201 });
}

export const POST = postHandler;
