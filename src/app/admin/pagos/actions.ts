"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleMetodoPago(id: number, activo: boolean) {
  await prisma.metodos_pago.update({
    where: { id },
    data: { activo: !activo, updated_at: new Date() },
  });
  revalidatePath("/admin/pagos");
}
