"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- PROVEEDORES ---
export async function aprobarProveedor(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.proveedores.update({
    where: { id },
    data: { estado: "aprobado" },
  });
  revalidatePath("/admin/proveedores");
}

export async function rechazarProveedor(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.proveedores.update({
    where: { id },
    data: { estado: "rechazado" },
  });
  revalidatePath("/admin/proveedores");
}


// --- PEDIDOS ---
export async function cancelarPedido(id: number) {
  try {
    await prisma.pedidos.update({
      where: { id },
      data: { estado: "cancelado" },
    });
    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}