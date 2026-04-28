import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/lib/stack";

function buildShortDisplayName(nombres: string | null | undefined, apellidos: string | null | undefined) {
  const primerNombre = nombres?.trim().split(/\s+/).filter(Boolean)[0] || "";
  const primerApellido = apellidos?.trim().split(/\s+/).filter(Boolean)[0] || "";
  return [primerNombre, primerApellido].filter(Boolean).join(" ");
}

export async function GET() {
  try {
    const currentUser = await stackServerApp.getUser({ or: "return-null" });
    if (!currentUser?.primaryEmail) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { email: currentUser.primaryEmail },
      select: {
        nombre: true,
        apellido: true,
        email: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({
        authenticated: true,
        shortName: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      shortName: buildShortDisplayName(usuario.nombre, usuario.apellido) || null,
      email: usuario.email,
    });
  } catch (error) {
    console.error("Error al obtener el perfil del catalogo:", error);
    return NextResponse.json({ error: "No pudimos obtener el perfil." }, { status: 500 });
  }
}
