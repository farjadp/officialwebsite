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

    // 0. Locale
    //
    // The Persian site is served from the /fa path segment. The fa.* subdomain
    // is not deployed (it answers 404 DEPLOYMENT_NOT_FOUND), but the rewrite is
    // kept so the subdomain works the moment DNS points somewhere real.
    //
    // Locale MUST be derived from the path as well as the host: without it every
    // /fa/* page renders inside the root layout as <html lang="en" dir="ltr">,
    // which is what production was doing — Persian content labelled English.
    const hostname = req.headers.get("host") || "";
    const isPersianHost = hostname.startsWith("fa.");
    const isPersianPath = url.pathname === "/fa" || url.pathname.startsWith("/fa/");
    const isPersian = isPersianHost || isPersianPath;

    // The route guards below must match on the path WITHOUT the locale segment.
    // Matching the raw pathname left /fa/admin unprotected — it does not start
    // with "/admin", so the admin dashboard (subscriber counts, leads, inbox,
    // settings, backups) was served to anyone who asked for the Persian URL.
    // Same for /fa/profile and the /fa/login redirect-away rule.
    const routePath = isPersianPath ? (url.pathname.slice(3) || "/") : url.pathname;

    // Send a visitor of the Persian site back into the Persian site.
    // On the fa.* subdomain the rewrite below already supplies /fa, so the
    // prefix is only needed for the path-based form.
    const localePrefix = isPersianPath ? "/fa" : "";
    const to = (path: string) => new URL(`${localePrefix}${path}`, req.url);

    // 1. Protect Admin Routes
    const isAdminRoute = routePath === "/admin" || routePath.startsWith("/admin/");
    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(to("/login"));
        }
        if (userRole === "USER") {
            // Regular users cannot access admin. Send to profile.
            return NextResponse.redirect(to("/profile"));
        }
    }

    // 2. Protect Profile Routes
    const isProfileRoute = routePath === "/profile" || routePath.startsWith("/profile/");
    if (isProfileRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(to("/login"));
        }
    }

    // 3. User already logged in should not access login/register
    const isAuthRoute = routePath === "/login" || routePath === "/register";
    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(to("/profile"));
    }

    // 4. Inject x-locale header for the layout to determine language / direction
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale", isPersian ? "fa" : "en");

    // Rewrite to the /fa directory if it's the Persian subdomain
    if (isPersianHost && !isPersianPath) {
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
