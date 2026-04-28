import { stackServerApp } from "./lib/stack";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que solo el admin puede ver (el operador es redirigido)
const SOLO_ADMIN = [
  "/admin/usuarios",
  "/admin/configuracion",
  "/admin/auditoria",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // COMENTA O ELIMINA ESTE BLOQUE TEMPORALMENTE
  if (pathname.startsWith("/admin")) {
    const user = await stackServerApp.getUser({ or: "return-null" });

    if (!user) {
      const loginUrl = new URL("/handler/sign-in", request.url);
      loginUrl.searchParams.set("after_auth_return_to", "/admin");
      return NextResponse.redirect(loginUrl);
    }

    const metadata = user.clientMetadata as { role?: string } | null;
    const role = metadata?.role;

    if (role !== "admin" && role !== "operador") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "operador" && SOLO_ADMIN.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Esto le dice a Next.js que use el middleware en el admin
};