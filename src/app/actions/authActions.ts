"use server"

// ============================================================================
// Hardware Source: authActions.ts
// Version: 1.0.0 — 2026-02-24
// Why: Functional module
// Env / Identity: Server Action / Module
// ============================================================================

import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters.")
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export async function registerUser(data: RegisterFormValues) {
    try {
        const validated = registerSchema.safeParse(data)

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0]?.message || "Invalid input."
            }
        }

        const { name, email, password } = validated.data

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return {
                success: false,
                error: "An account with this email already exists."
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER" // Explicitly assign standard user role
            }
        })

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    } catch (error) {
        console.error("Registration error:", error)
        return {
            success: false,
            error: "An unexpected error occurred during registration."
        }
    }
}
