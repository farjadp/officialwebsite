// ============================================================================
// Hardware Source: auth.ts
// Version: 1.0.0 — 2026-02-24
// Why: Authentication configuration
// Env / Identity: TypeScript Module
// ============================================================================

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import * as bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !(user as any).password) {
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    (user as any).password
                );

                if (passwordsMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    };
                }

                return null;
            }
        })
    ],
})

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
    interface User {
        role: string;
    }
}
