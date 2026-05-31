"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- PROVEEDORES ---

// 1. NUEVA FUNCIÓN: Obtiene los que están en la "sala de espera"
export async function obtenerProveedoresPendientes() {
  try {
    const proveedores = await prisma.proveedores.findMany({
      where: {
        estado: "pendiente",
      },
      select: {
        id: true,
        nombre_negocio: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc", // Los más recientes primero
      },
    });

    return proveedores;
  } catch (error) {
    console.error("Error al obtener proveedores pendientes:", error);
    return [];
  }
}

// 2. TUS FUNCIONES EXISTENTES
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

export async function toggleSuspensionProveedor(
  id: number,
  estadoActual: string
) {
  try {
    let nuevoEstado = "aprobado";

    // Si está aprobado -> suspender
    if (estadoActual === "aprobado") {
      nuevoEstado = "suspendido";
    }

    // Si está suspendido -> activar
    if (estadoActual === "suspendido") {
      nuevoEstado = "aprobado";
    }

    // Si está pendiente -> aprobar
    if (estadoActual === "pendiente") {
      nuevoEstado = "aprobado";
    }

    await prisma.proveedores.update({
      where: { id },
      data: {
        estado: nuevoEstado,
      },
    });

    revalidatePath("/admin/empresas/actividad");

    return { success: true };
  } catch (error) {
    console.error("Error cambiando estado del proveedor:", error);
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
export async function obtenerNotificacionesAdmin() {
  const admin = await prisma.usuarios.findFirst({
    where: {
      tipo: "admin",
    },
  });

  if (!admin) return [];

  return prisma.notificaciones.findMany({
    where: {
      usuario_id: admin.id,
      leida: false,
    },
    select: {
      id: true,
      titulo: true,
      mensaje: true,
      proveedor_id: true, // 👈 importante
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}