import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function middleware(request: NextRequest) {
  //skip allowed paths
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Get auth data from Clerk
  const { userId } = getAuth(request);

  // If not logged in, redirect to login
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Fetch user data from Clerk
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  // Extract user role
  const role = user.publicMetadata.role;

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    role !== "ADMIN"
  ) {
    console.log("Permission not allowed");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/user") &&
    role !== "USER"
  ) {
    console.log("Permission not allowed");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
