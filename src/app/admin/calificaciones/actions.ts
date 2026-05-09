"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function eliminarResena(detalleId: number) {
  await prisma.detalle_pedidos.update({
    where: { id: detalleId },
    data: { calificacion: null, resena: null },
  });
  revalidatePath("/admin/calificaciones");
}
