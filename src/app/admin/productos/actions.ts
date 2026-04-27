"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function actualizarProductoAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const precio_venta = Number(formData.get('precio_venta'));
  const stock = Number(formData.get('stock'));
  const categoria_id = formData.get('categoria_id') ? Number(formData.get('categoria_id')) : null;

  try {
    await prisma.productos.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        precio_venta,
        stock,
        categoria_id
      }
    });
    revalidatePath('/admin/productos');
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return { error: "Ocurrió un error al guardar los cambios." };
  }
}

export async function toggleProducto(id: number, estadoActual: boolean) {
  try {
    await prisma.productos.update({
      where: { id },
      data: { activo: !estadoActual },
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error al cambiar estado de producto:", error);
    return { success: false };
  }
}

export async function eliminarProducto(id: number) {
  try {
    await prisma.productos.update({
      where: { id },
      data: { activo: false },
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { success: false };
  }
}

/**
 * Guarda la URL de Cloudinary como imagen_url del producto.
 * Se llama después de que el widget de Cloudinary entrega la secure_url.
 */
export async function actualizarImagenProducto(id: number, url: string | null) {
  try {
    await prisma.productos.update({
      where: { id },
      data: { imagen_url: url },
    });
    revalidatePath(`/admin/productos/${id}/editar`);
    revalidatePath('/admin/productos');
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar imagen del producto:", error);
    return { error: "No se pudo guardar la imagen del producto." };
  }
}