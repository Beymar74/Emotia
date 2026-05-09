"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function enviarRecordatorioCarrito(usuarioId: number, nombreUsuario: string) {
  await prisma.notificaciones.create({
    data: {
      usuario_id: usuarioId,
      tipo: "carrito",
      titulo: "¡Tienes productos esperándote!",
      mensaje: `Hola ${nombreUsuario}, tienes productos en tu carrito. ¡Completa tu compra antes de que se agoten!`,
      leida: false,
    },
  });
  revalidatePath("/admin/carritos");
}
