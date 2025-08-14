import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected paths
  const protectedPaths = [
    '/api/clanarine',
    '/api/clanovi'
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Check for authentication cookie
    const authCookie = request.cookies.get('gh_admin');
    
    if (!authCookie || authCookie.value !== '1') {
      // For API routes, return JSON error
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // For pages, redirect to login (handled by client-side auth)
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/clanarine/:path*',
    '/api/clanovi/:path*'
  ]
};