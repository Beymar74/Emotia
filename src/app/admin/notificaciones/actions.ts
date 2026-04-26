"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function enviarNotificacionAction(formData: FormData) {
  const usuario_id = Number(formData.get("usuario_id"));
  const tipo       = (formData.get("tipo") as string).trim();
  const titulo     = (formData.get("titulo") as string).trim();
  const mensaje    = (formData.get("mensaje") as string | null)?.trim() || null;

  if (!usuario_id || !tipo || !titulo) {
    return { error: "Usuario, tipo y título son obligatorios." };
  }

  try {
    await prisma.notificaciones.create({
      data: { usuario_id, tipo, titulo, mensaje },
    });
    revalidatePath("/admin/notificaciones");
    return { success: true };
  } catch {
    return { error: "No se pudo enviar la notificación." };
  }
}

export async function marcarLeidaAction(id: number) {
  try {
    await prisma.notificaciones.update({
      where: { id },
      data: { leida: true },
    });
    revalidatePath("/admin/notificaciones");
    return { success: true };
  } catch {
    return { error: "No se pudo marcar como leída." };
  }
}
