import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import { authConfig } from '@/app/(auth)/auth.config';

const auth = NextAuth(authConfig).auth;

export default async function middleware(req) {
  const session = await auth(req);
  const { pathname } = req.nextUrl;

  // Check if this is an admin route
  if (pathname.startsWith('/admin')) {
    // Redirect to login if not authenticated
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect to home if not an admin
    if (session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return auth(req);
}

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register', '/admin/:path*'],
};
