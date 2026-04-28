"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ESTADOS_VALIDOS = ["pendiente", "confirmado", "en_preparacion", "enviado", "entregado", "cancelado"];

export async function cambiarEstadoPedido(id: number, nuevoEstado: string) {
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    return { error: "Estado no válido." };
  }
  try {
    await prisma.pedidos.update({
      where: { id },
      data: { estado: nuevoEstado, updated_at: new Date() },
    });
    revalidatePath(`/admin/pedidos/${id}`);
    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar el estado del pedido." };
  }
}
