import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  //skip allowed paths
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  //if not logged in block all
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if (
  //   request.nextUrl.pathname.startsWith("/admin") &&
  //   token &&
  //   token.role !== "ADMIN"
  // ) {
  //   console.log("Permission not allowed");
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  // if (
  //   request.nextUrl.pathname.startsWith("/user") &&
  //   token &&
  //   token.role !== "USER"
  // ) {
  //   console.log("Permission not allowed");
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
