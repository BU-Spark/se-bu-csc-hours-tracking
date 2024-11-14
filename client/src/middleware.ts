import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPersonFromUser } from './lib/getPersonFromUser';

// Update public routes to include API endpoints needed for authentication
const isPublicRoute = (path: string): boolean => [
  '/login', 
  '/',
  '/api/get-person',
  '/auth/sso-callback',
  'welcome',
].includes(path);

export default clerkMiddleware(async (auth, req) => {

  console.log(`[Middleware] Processing request for path: ${req.nextUrl.pathname}`);
  
  // Call auth() to get the authentication context
  const { userId } = await auth();
  console.log(`[Middleware] User ID: ${userId || 'not authenticated'}`);

  // Allow public routes to proceed without authentication
  if (isPublicRoute(req.nextUrl.pathname)) {
    console.log('[Middleware] Public route detected, allowing access');
    return NextResponse.next();
  }

  // If the user is not authenticated, redirect to the login page
  if (!userId) {
    console.log('[Middleware] No user ID found, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access to person-related API endpoints without requiring a person record
  if (req.nextUrl.pathname.startsWith('/api/get-person') || 
      req.nextUrl.pathname.startsWith('/api/create-new-person')) {
    console.log('[Middleware] Allowing access to person-related API endpoint');
    return NextResponse.next();
  }

  // Fetch the Person record from your database
  const person = await getPersonFromUser(userId);
  console.log(`[Middleware] Person record found: ${person ? 'yes' : 'no'}`);

  // If the Person record doesn't exist, redirect to the login page
  if (!person) {
    console.log('[Middleware] No person record found, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Extract the user role from the Person record
  const { role } = person;
  const path = req.nextUrl.pathname;
  console.log(`[Middleware] User role: ${role}, accessing path: ${path}`);

  // Role-based access control
  if (path.startsWith('/admin') && role !== 'ADMIN') {
    console.log('[Middleware] Access denied: Non-admin user attempted to access admin route');
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (path.startsWith('/user') && role !== 'USER') {
    console.log('[Middleware] Access denied: Non-user attempted to access user route');
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (path.startsWith('/third-party') && role !== 'ORGANIZER') {
    console.log('[Middleware] Access denied: Non-organizer attempted to access third-party route');
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  console.log('[Middleware] Access granted');
  // Allow the request to proceed
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
