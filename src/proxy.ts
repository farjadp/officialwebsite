// ============================================================================
// Hardware Source: middleware.ts
// Version: 1.0.0 — 2026-02-24
// Why: Request interceptor & route guard
// Env / Identity: Edge Middleware
// ============================================================================

import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// NextAuth matches paths automatically internally, 
// here we apply our custom route protection logic
export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const url = req.nextUrl;
    // @ts-ignore
    const userRole = req.auth?.user?.role;

    // 1. Protect Admin Routes
    const isAdminRoute = url.pathname.startsWith("/admin");
    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (userRole === "USER") {
            // Regular users cannot access admin. Send to profile.
            return NextResponse.redirect(new URL("/profile", req.url));
        }
    }

    // 2. Protect Profile Routes
    const isProfileRoute = url.pathname.startsWith("/profile");
    if (isProfileRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // 3. User already logged in should not access login/register
    const isAuthRoute = url.pathname === "/login" || url.pathname === "/register";
    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    // 4. Subdomain Routing (Internationalization)
    const hostname = req.headers.get("host") || "";
    const isPersian = hostname.startsWith("fa.");
    
    // Inject x-locale header for the layout to determine language / direction
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale", isPersian ? "fa" : "en");

    // Rewrite to the /fa directory if it's the Persian subdomain
    if (isPersian && !url.pathname.startsWith("/fa")) {
        return NextResponse.rewrite(new URL(`/fa${url.pathname}`, req.url), {
            request: {
                headers: requestHeaders,
            }
        });
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
});

// Optionally configure matching purely at the edge
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
