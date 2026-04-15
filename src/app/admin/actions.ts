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

// --- PRODUCTOS ---
export async function toggleProducto(id: number, estadoActual: boolean) {
  try {
    await prisma.productos.update({
      where: { id },
      data: { activo: !estadoActual },
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function eliminarProducto(id: number) {
  try {
    // Soft delete para no romper historial de pedidos
    await prisma.productos.update({
      where: { id },
      data: { activo: false },
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
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