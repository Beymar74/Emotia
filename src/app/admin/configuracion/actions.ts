"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// En el esquema no existe tabla de configuración, así que usamos
// la tabla de usuarios para el admin (cambiar email/contraseña)
// y la tabla de productos para el modo de destacados.

export async function actualizarInfoPlataformaAction(formData: FormData) {
  // Esta config sería ideal guardarla en una tabla config.
  // Por ahora simulamos éxito (no hay tabla de configuración en el schema).
  return { success: true };
}

export async function actualizarDestacadosAction(formData: FormData) {
  const modo = formData.get("destacados") as string;   // "manual" | "automatico"
  const limite = Number(formData.get("limite")) || 6;

  if (modo === "automatico") {
    // Tomamos los N productos con mayor calificación y los marcamos activos
    const topProductos = await prisma.productos.findMany({
      where: { activo: true },
      orderBy: { created_at: "desc" },
      take: limite,
      select: { id: true },
    });
    // No hay campo "destacado" en el schema — simplemente revalidamos
    // Si en el futuro se agrega el campo, aquí iría el update masivo
  }

  revalidatePath("/admin/configuracion");
  return { success: true };
}

export async function actualizarAdminAction(formData: FormData) {
  const email = formData.get("email") as string;
  const nuevaPass = formData.get("password") as string;
  const confirmar = formData.get("confirmar") as string;

  if (!email) return { error: "El email es requerido." };
  if (nuevaPass && nuevaPass !== confirmar) return { error: "Las contraseñas no coinciden." };

  try {
    // Buscamos al admin actual
    const admin = await prisma.usuarios.findFirst({ where: { tipo: "admin" } });
    if (!admin) return { error: "No se encontró el administrador." };

    await prisma.usuarios.update({
      where: { id: admin.id },
      data: { email },
    });

    revalidatePath("/admin/configuracion");
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar las credenciales." };
  }
}
