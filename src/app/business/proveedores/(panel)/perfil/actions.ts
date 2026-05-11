"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireProveedor } from "@/lib/auth-proveedor";

export async function obtenerPerfilProveedor() {
  try {
    const proveedorSesion = await requireProveedor();

    const proveedor = await prisma.proveedores.findUnique({
      where: {
        id: proveedorSesion.id,
      },
    });

    if (!proveedor) return null;

    return {
      id: proveedor.id,
      nombre: proveedor.nombre_negocio,
      descripcion: proveedor.descripcion || "",
      categorias: proveedor.categorias || [],
      redesSociales: proveedor.redes_sociales || [],
      telefono: proveedor.telefono || "",
      email: proveedor.email,
      direccion: proveedor.direccion || "",
      logo: proveedor.logo_url || null,
      estado: proveedor.estado,
      ventas: proveedor.total_vendido ? Number(proveedor.total_vendido) : 0,
      rating: proveedor.calificacion_prom ? Number(proveedor.calificacion_prom) : 0,
    };
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return null;
  }
}

export async function actualizarPerfilProveedor(idProveedor: number, datos: any) {
  try {
    const proveedorSesion = await requireProveedor();

    if (proveedorSesion.id !== idProveedor) {
      return {
        success: false,
        error: "No tienes permiso para editar este perfil.",
      };
    }

    await prisma.proveedores.update({
      where: {
        id: idProveedor,
      },
      data: {
        nombre_negocio: datos.nombre,
        descripcion: datos.descripcion,
        telefono: datos.telefono,
        direccion: datos.direccion,
        categorias: datos.categorias || [],
        redes_sociales: datos.redesSociales || [],
      },
    });

    revalidatePath("/business/proveedores/perfil");

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);

    return {
      success: false,
      error: "No se pudieron guardar los cambios.",
    };
  }
}