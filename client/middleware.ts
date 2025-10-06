import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for admin session in headers or cookies
    // Since localStorage is client-side only, we'll let the client component handle the auth
    // In a real app, you'd use server-side sessions or JWT tokens

    // For now, we'll let the admin page handle its own authentication
    // but we could add additional server-side checks here
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};