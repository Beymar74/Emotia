"use server";

import prisma from "@/lib/prisma";

export async function getTarjetasActivas() {
  return await prisma.tarjeta_disenos.findMany({
    where: { activo: true },
    orderBy: { id: "asc" },
  });
}
