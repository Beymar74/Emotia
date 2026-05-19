"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cambiarEstadoProveedorAction(
  id: number,
  nuevoEstado: "activo" | "pendiente" | "suspendido"
) {
  try {
    await prisma.proveedores.update({
      where: { id },
      data: {
        estado: nuevoEstado,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/proveedores");
    revalidatePath(`/admin/proveedores/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error cambiando estado proveedor:", error);
    return { error: "No se pudo cambiar el estado del proveedor." };
  }
}

export async function editarProveedorAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const nombre_negocio = String(formData.get("nombre_negocio") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const direccion = String(formData.get("direccion") || "").trim();
  const rep_nombre = String(formData.get("rep_nombre") || "").trim();
  const rep_email = String(formData.get("rep_email") || "").trim();
  const rep_telefono = String(formData.get("rep_telefono") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const estado = String(formData.get("estado") || "pendiente");

  if (!id || !nombre_negocio || !email) {
    return {
      error: "El nombre del negocio y el correo son obligatorios.",
    };
  }

  try {
    await prisma.proveedores.update({
      where: { id },
      data: {
        nombre_negocio,
        email,
        telefono: telefono || null,
        direccion: direccion || null,
        rep_nombre: rep_nombre || null,
        rep_email: rep_email || null,
        rep_telefono: rep_telefono || null,
        descripcion: descripcion || null,
        estado,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/proveedores");
    revalidatePath(`/admin/proveedores/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Error editando proveedor:", error);

    return {
      error:
        "No se pudo actualizar el proveedor. Verifica que el correo no esté repetido.",
    };
  }
}
export async function actualizarLogoProveedor(id: number, url: string | null) {
  try {
    await prisma.proveedores.update({
      where: { id },
      data: {
        logo_url: url,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/proveedores");
    revalidatePath(`/admin/proveedores/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar logo del proveedor:", error);

    return {
      error: "No se pudo guardar el logo del proveedor.",
    };
  }
}