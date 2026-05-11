import { stackServerApp } from "./lib/stack";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SOLO_ADMIN = [
  "/admin/usuarios",
  "/admin/configuracion",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   |--------------------------------------------------------------------------
   | ADMIN
   |--------------------------------------------------------------------------
   */

  if (pathname.startsWith("/admin")) {
    const user = await stackServerApp.getUser({ or: "return-null" });

    if (!user) {
      const loginUrl = new URL("/handler/sign-in", request.url);

      loginUrl.searchParams.set(
        "after_auth_return_to",
        "/admin"
      );

      return NextResponse.redirect(loginUrl);
    }

    const metadata = user.clientMetadata as { role?: string } | null;

    const role = metadata?.role;

    if (role !== "admin" && role !== "operador") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      role === "operador" &&
      SOLO_ADMIN.some((r) => pathname.startsWith(r))
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  /*
   |--------------------------------------------------------------------------
   | PROVEEDORES
   |--------------------------------------------------------------------------
   */

  const session = request.cookies.get("emotia_b2b_session");

  const rutasProtegidasProveedor = [
    "/business/proveedores/home",
  ];

  const rutaProveedorProtegida =
    rutasProtegidasProveedor.some((ruta) =>
      pathname.startsWith(ruta)
    );

  // Si intenta entrar al panel sin login
  if (rutaProveedorProtegida && !session) {
    return NextResponse.redirect(
      new URL("/business/proveedores/login", request.url)
    );
  }

  // Si ya tiene sesión y quiere volver al login
  if (
    session &&
    pathname.startsWith("/business/proveedores/login")
  ) {
    return NextResponse.redirect(
      new URL("/business/proveedores/home", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/business/proveedores/:path*",
  ],
};