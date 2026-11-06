import { NextRequest, NextResponse } from "next/server";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

// Pages that are live. Matched as whole path segments, so "/blog" allows
// "/blog" and "/blog/..." but not "/blogfoo". "/" is matched exactly.
const ALLOWED_PAGES = [
  "/blog",
  "/dogadjaji",
  "/igre",
  "/kontakt",
  "/o-klubu",
  "/rezervacija",
  "/shop",
  "/clanarine",
  "/impressum",
  "/under-construction",
];

// Non-page prefixes that are always allowed: API routes, Next internals and
// the site's static assets from /public.
const ALLOWED_PREFIXES = ["/api/", "/_next/", "/favicon.ico", "/irena/"];

function matchesSegment(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    !FEATURE_FLAGS.shop &&
    (matchesSegment(pathname, "/shop") || matchesSegment(pathname, "/api/shop"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isAllowedPath =
    pathname === "/" ||
    ALLOWED_PAGES.some((path) => matchesSegment(pathname, path)) ||
    ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Everything else (e.g. /about, /contact, /test) is not live
  if (!isAllowedPath) {
    return NextResponse.redirect(new URL("/under-construction", request.url));
  }

  // Define protected API paths
  const protectedPaths = ["/api/clanarine", "/api/clanovi"];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath) {
    // Check for authentication cookie
    const authCookie = request.cookies.get("gh_admin");
    const loggedInUser = request.cookies.get("logged_in_user");

    if (!loggedInUser && (!authCookie || authCookie.value !== "1")) {
      // For API routes, return JSON error
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 },
        );
      }

      // For pages, redirect to login (handled by client-side auth)
      return NextResponse.redirect(new URL("/clanarine", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
