"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTarjetaStatus(id: number, activeState: boolean) {
  try {
    await prisma.tarjeta_disenos.update({
      where: { id },
      data: { activo: !activeState },
    });
    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar la tarjeta:", error);
    return { success: false, message: "Error al actualizar la tarjeta" };
  }
}

export async function crearTarjeta(data: {
  nombre: string;
  design_url: string;
  color_acento: string;
  color_suave: string;
  color_marco: string;
  color_mensaje: string;
}) {
  try {
    // Check if name exists
    const exists = await prisma.tarjeta_disenos.findUnique({
      where: { nombre: data.nombre },
    });

    if (exists) {
        return { success: false, message: "Ya existe una tarjeta con ese nombre." };
    }

    await prisma.tarjeta_disenos.create({
      data: {
        ...data,
        ornamento: "none",
      },
    });

    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al crear tarjeta:", error);
    return { success: false, message: "Error al crear la tarjeta en la base de datos." };
  }
}
