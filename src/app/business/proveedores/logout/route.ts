import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get(
        "emotia_b2b_session"
      )?.value;

    if (token) {
      await prisma.proveedor_sesiones.deleteMany({
        where: {
          token,
        },
      });
    }

    cookieStore.delete("emotia_b2b_session");

    return NextResponse.redirect(
      new URL(
        "/business/proveedores/login",
        request.url
      )
    );
  } catch (error) {
    console.error(
      "Error cerrando sesión:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/business/proveedores/login",
        request.url
      )
    );
  }
}