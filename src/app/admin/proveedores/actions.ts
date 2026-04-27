"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";

/**
 * Alterna el estado de un proveedor entre 'aprobado' y 'suspendido'
 */
export async function toggleSuspensionProveedor(id: number, estadoActual: string) {
  try {
    const nuevoEstado = estadoActual === "aprobado" ? "suspendido" : "aprobado";
    
    await prisma.proveedores.update({
      where: { id },
      data: { estado: nuevoEstado },
    });

    revalidatePath("/admin/proveedores/actividad");
    revalidatePath("/admin/proveedores");
    
    return { success: true, nuevoEstado };
  } catch (error) {
    console.error("Error al cambiar estado del proveedor:", error);
    return { success: false, error: "No se pudo cambiar el estado del proveedor" };
  }
}

/**
 * Crea un nuevo proveedor
 */
export async function crearProveedorAction(formData: FormData) {
  const nombre_negocio = formData.get("nombre_negocio") as string;
  const email = formData.get("email") as string;
  const telefono = formData.get("telefono") as string;
  const descripcion = formData.get("descripcion") as string;
  const password = formData.get("password") as string;

  try {
    // Verificar si el email ya existe
    const existe = await prisma.proveedores.findUnique({ where: { email } });
    if (existe) return { error: "El correo electrónico ya está registrado." };

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.proveedores.create({
      data: {
        nombre_negocio,
        email,
        telefono,
        descripcion,
        password_hash,
        estado: "aprobado", // Los administradores crean proveedores ya aprobados
        calificacion_prom: 0,
        total_vendido: 0
      }
    });

    revalidatePath("/admin/proveedores/actividad");
    revalidatePath("/admin/proveedores");
    return { success: true };
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return { error: "Ocurrió un error al crear el proveedor." };
  }
}

/**
 * Actualiza la información de un proveedor existente
 */
export async function actualizarProveedorAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const nombre_negocio = formData.get("nombre_negocio") as string;
  const email = formData.get("email") as string;
  const telefono = formData.get("telefono") as string;
  const descripcion = formData.get("descripcion") as string;
  const password = formData.get("password") as string; // Opcional al editar

  try {
    const data: any = {
      nombre_negocio,
      email,
      telefono,
      descripcion,
    };

    if (password && password.trim() !== "") {
      data.password_hash = await bcrypt.hash(password, 10);
    }

    await prisma.proveedores.update({
      where: { id },
      data
    });

    revalidatePath("/admin/proveedores/actividad");
    revalidatePath("/admin/proveedores");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    return { error: "Ocurrió un error al actualizar el proveedor." };
  }
}

/**
 * Guarda la URL de Cloudinary como logo_url del proveedor.
 * Se llama después de que el widget de Cloudinary entrega la secure_url.
 */
export async function actualizarLogoProveedor(id: number, url: string | null) {
  try {
    await prisma.proveedores.update({
      where: { id },
      data: { logo_url: url },
    });
    revalidatePath(`/admin/proveedores/${id}/editar`);
    revalidatePath("/admin/proveedores/actividad");
    revalidatePath("/admin/proveedores");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar logo del proveedor:", error);
    return { error: "No se pudo guardar el logo del proveedor." };
  }
}
