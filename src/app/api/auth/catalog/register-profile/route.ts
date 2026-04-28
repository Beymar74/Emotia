import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/lib/stack";

function parseBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function isAdultBirthDate(value: string) {
  const birthDate = parseBirthDate(value);
  if (!birthDate) return false;

  const limit = new Date();
  limit.setHours(0, 0, 0, 0);
  limit.setFullYear(limit.getFullYear() - 18);

  return birthDate.getTime() <= limit.getTime();
}

function buildShortDisplayName(nombres: string, apellidos: string) {
  const primerNombre = nombres.trim().split(/\s+/).filter(Boolean)[0] || "Usuario";
  const primerApellido = apellidos.trim().split(/\s+/).filter(Boolean)[0] || "";
  return [primerNombre, primerApellido].filter(Boolean).join(" ");
}

export async function POST(req: Request) {
  try {
    const currentUser = await stackServerApp.getUser({ or: "return-null" });
    if (!currentUser?.primaryEmail) {
      return NextResponse.json({ error: "No encontramos una sesion activa." }, { status: 401 });
    }

    const body = (await req.json()) as {
      nombres?: string;
      apellidos?: string;
      fechaNacimiento?: string;
    };

    const nombres = body.nombres?.trim() || "";
    const apellidos = body.apellidos?.trim() || "";
    const fechaNacimiento = body.fechaNacimiento?.trim() || "";

    if (!nombres || !apellidos || !fechaNacimiento) {
      return NextResponse.json({ error: "Completa nombres, apellidos y fecha de nacimiento." }, { status: 400 });
    }

    if (!isAdultBirthDate(fechaNacimiento)) {
      return NextResponse.json(
        { error: "Solo pueden registrarse personas mayores de 18 anos." },
        { status: 400 },
      );
    }

    const birthDate = parseBirthDate(fechaNacimiento);
    if (!birthDate) {
      return NextResponse.json({ error: "La fecha de nacimiento no es valida." }, { status: 400 });
    }

    const shortDisplayName = buildShortDisplayName(nombres, apellidos);
    await currentUser.setDisplayName(shortDisplayName);

    await prisma.usuarios.upsert({
      where: { email: currentUser.primaryEmail },
      update: {
        nombre: nombres,
        apellido: apellidos,
        fecha_nacimiento: birthDate,
        google_id: currentUser.id,
        updated_at: new Date(),
      },
      create: {
        nombre: nombres,
        apellido: apellidos,
        email: currentUser.primaryEmail,
        fecha_nacimiento: birthDate,
        google_id: currentUser.id,
        tipo: "usuario",
        plan: "basico",
        puntos: 0,
        activo: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al completar el perfil del catalogo:", error);
    return NextResponse.json({ error: "No pudimos completar el registro." }, { status: 500 });
  }
}
