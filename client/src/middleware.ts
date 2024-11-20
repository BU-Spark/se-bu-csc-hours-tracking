import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPersonFromUser } from './lib/getPersonFromUser';

const isPublicRoute = (path: string): boolean => [
  '/login', 
  '/',
  '/api/get-person',
  '/auth/sso-callback',
  'welcome',
].includes(path);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/api/get-person') || 
      req.nextUrl.pathname.startsWith('/api/create-new-person')) {
    return NextResponse.next();
  }

  const person = await getPersonFromUser(userId);

  if (!person) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { role } = person;
  const path = req.nextUrl.pathname;

  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (path.startsWith('/user') && role !== 'USER') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (path.startsWith('/third-party') && role !== 'ORGANIZER') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/admin/:path*', '/user/:path*', '/third-party/:path*'],
};
