"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";

export async function toggleSuspensionProveedor(id: number, estadoActual: string) {
  try {
    const nuevoEstado = estadoActual === "aprobado" ? "suspendido" : "aprobado";

    await prisma.proveedores.update({
      where: { id },
      data: { estado: nuevoEstado },
    });

    revalidatePath("/admin/empresas/actividad");
    revalidatePath("/admin/empresas");

    return { success: true, nuevoEstado };
  } catch (error) {
    console.error("Error al cambiar estado de la empresa:", error);
    return { success: false, error: "No se pudo cambiar el estado de la empresa" };
  }
}

export async function crearProveedorAction(formData: FormData) {
  const nombre_negocio = formData.get("nombre_negocio") as string;
  const email = formData.get("email") as string;
  const telefono = formData.get("telefono") as string;
  const descripcion = formData.get("descripcion") as string;
  const password = formData.get("password") as string;

  try {
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
        estado: "aprobado",
        calificacion_prom: 0,
        total_vendido: 0
      }
    });

    revalidatePath("/admin/empresas/actividad");
    revalidatePath("/admin/empresas");
    return { success: true };
  } catch (error) {
    console.error("Error al crear empresa:", error);
    return { error: "Ocurrió un error al crear la empresa." };
  }
}

export async function actualizarProveedorAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const nombre_negocio = formData.get("nombre_negocio") as string;
  const email = formData.get("email") as string;
  const telefono = formData.get("telefono") as string;
  const descripcion = formData.get("descripcion") as string;
  const password = formData.get("password") as string;

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

    revalidatePath("/admin/empresas/actividad");
    revalidatePath("/admin/empresas");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    return { error: "Ocurrió un error al actualizar la empresa." };
  }
}

export async function actualizarLogoProveedor(id: number, url: string | null) {
  try {
    await prisma.proveedores.update({
      where: { id },
      data: { logo_url: url },
    });
    revalidatePath(`/admin/empresas/${id}/editar`);
    revalidatePath("/admin/empresas/actividad");
    revalidatePath("/admin/empresas");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar logo de la empresa:", error);
    return { error: "No se pudo guardar el logo de la empresa." };
  }
}
