import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPersonFromUser } from "./lib/getPersonFromUser";

export async function middleware(request: NextRequest) {
  // Skip allowed paths
  if (["/login", "/"].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Get auth data from Clerk
  const { userId: clerk_id } = await auth();

  // If not logged in, redirect to login
  if (!clerk_id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Fetch the Person record from your database or redirect them to the welcome page
  let person = await getPersonFromUser(clerk_id);

  if (!person) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Extract user role from the Person record
  const role = person.role;

  // Role-based access control
  if (request.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    console.log("Permission not allowed");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/user") && role !== "USER") {
    console.log("Permission not allowed");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/third-party") && role !== "ORGANIZER") {
    console.log("Permission not allowed");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/third-party/:path*"],
};