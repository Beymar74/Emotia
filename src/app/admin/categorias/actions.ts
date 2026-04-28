"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearCategoriaAction(formData: FormData) {
  const nombre     = (formData.get("nombre") as string).trim();
  const descripcion = (formData.get("descripcion") as string | null)?.trim() || null;

  if (!nombre) return { error: "El nombre es obligatorio." };

  try {
    await prisma.categorias.create({ data: { nombre, descripcion } });
    revalidatePath("/admin/categorias");
    revalidatePath("/admin/productos");
    return { success: true };
  } catch {
    return { error: "No se pudo crear la categoría." };
  }
}

export async function editarCategoriaAction(formData: FormData) {
  const id          = Number(formData.get("id"));
  const nombre      = (formData.get("nombre") as string).trim();
  const descripcion = (formData.get("descripcion") as string | null)?.trim() || null;

  if (!nombre) return { error: "El nombre es obligatorio." };

  try {
    await prisma.categorias.update({
      where: { id },
      data: { nombre, descripcion },
    });
    revalidatePath("/admin/categorias");
    revalidatePath("/admin/productos");
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar la categoría." };
  }
}

export async function toggleCategoriaAction(id: number, activo: boolean) {
  try {
    await prisma.categorias.update({
      where: { id },
      data: { activo: !activo },
    });
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch {
    return { error: "No se pudo cambiar el estado." };
  }
}
