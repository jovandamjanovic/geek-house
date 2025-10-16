import {NextRequest, NextResponse} from 'next/server';
import {userService} from "@/lib/domain/user-management/service";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that are allowed (not redirected to under construction)
  const allowedPaths = [
    '/clanarine',
    '/under-construction',
    '/api/',
    '/_next/',
    '/favicon.ico'
  ];

  // Check if the current path is allowed
  const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));

  // Redirect to under construction if not an allowed path
  if (!isAllowedPath && pathname !== '/') {
    return NextResponse.redirect(new URL('/under-construction', request.url));
  }

  // Redirect root path to under construction as well
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/under-construction', request.url));
  }

  // Define protected API paths
  const protectedPaths = [
    '/api/clanarine',
    '/api/clanovi'
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Check for authentication cookie
      const adminCookie = request.cookies.get('gh_admin');
      const loggedInUser = request.cookies.get('logged_in_user');
      const username = loggedInUser?.value;
      const user = username ? userService.getUserByUsername(username) : null;
      if ((user && !isUserAuthorized(user)) || !adminCookie || adminCookie.value !== '1') {
      // For API routes, return JSON error
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // For pages, redirect to login (handled by client-side auth)
      return NextResponse.redirect(new URL('/clanarine', request.url));
    }
  }

  return NextResponse.next();
}

function isUserAuthorized(user: User) {
    if (user.username === 'admin') {
        return true;
    }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};