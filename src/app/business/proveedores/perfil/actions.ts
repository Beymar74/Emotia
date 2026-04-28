"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function obtenerPerfilProveedor() {
  try {
    // 1. Buscamos nuestra cookie de sesión (CON AWAIT)
    const cookieStore = await cookies();
    const emailSesion = cookieStore.get("emotia_b2b_session")?.value;

    if (!emailSesion) return null;

    // 2. Buscamos los datos completos del proveedor
    const proveedor = await prisma.proveedores.findFirst({
      where: { email: emailSesion }
    });

    if (!proveedor) return null;

    // 3. Retornamos los datos planos (limpios de Decimal)
    return {
      id: proveedor.id,
      nombre: proveedor.nombre_negocio,
      descripcion: proveedor.descripcion || "",
      nit: "1234567015",
      categoria: "Artesanías", 
      telefono: proveedor.telefono || "",
      email: proveedor.email,
      direccion: proveedor.direccion || "La Paz, Bolivia",
      sitioWeb: "",
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
    await prisma.proveedores.update({
      where: { id: idProveedor },
      data: {
        nombre_negocio: datos.nombre,
        descripcion: datos.descripcion,
        telefono: datos.telefono,
        direccion: datos.direccion,
      },
    });
    revalidatePath("/business/proveedores/perfil");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return { success: false, error: "No se pudieron guardar los cambios." };
  }
}