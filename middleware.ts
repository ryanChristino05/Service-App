import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request: NextRequest) => {
  const { pathname, hostname } = request.nextUrl;
  const session = request.auth;

  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.endsWith(".local");

  if (isLocalHost && pathname === "/" && !session?.user) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/"],
};
