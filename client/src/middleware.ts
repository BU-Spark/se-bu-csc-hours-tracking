import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "./lib/prisma";

export async function middleware(request: NextRequest) {
  // Skip allowed paths
  if (["/sign-up","/login", "/"].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Get auth data from Clerk
  const { userId } = getAuth(request);

  // If not logged in, redirect to login
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Fetch the Person record from your database or redirect them to the welcome apge
  let person = await prisma.person.findUnique({
    where: { clerk_id: userId },
  });

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

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};