import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'sami_auth';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === 'granted';

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Runs on every route except the login page itself, the login API,
  // static/build assets, and files under /public/assets.
  matcher: ['/((?!login|api/login|_next/static|_next/image|favicon.ico|assets/).*)'],
};
