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
                token.id = user.id;
                token.role = user.role;
                token.image = user.image;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session }
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.image = token.image as string | null | undefined;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig
