import { stackServerApp } from "./lib/stack";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const user = await stackServerApp.getUser({ or: "return-null" });

    if (!user) {
      const loginUrl = new URL("/handler/sign-in", request.url);
      loginUrl.searchParams.set("after_auth_return_to", "/admin");
      return NextResponse.redirect(loginUrl);
    }

    const metadata = user.clientMetadata as { role?: string } | null;
    if (metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};