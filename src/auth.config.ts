// ============================================================================
// Hardware Source: auth.config.ts
// Version: 1.0.0 — 2026-02-24
// Why: Authentication configuration
// Env / Identity: TypeScript Module
// ============================================================================

import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    trustHost: true,
    providers: [], // We'll add the DB-dependent credentials provider in auth.ts
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // When user first signs in, `user` object is available
            if (user) {
                token.role = user.role;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session }
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            if (session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig
