'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Acción para Suspender / Activar usuario
export async function toggleEstadoUsuario(id: number, estadoActual: boolean) {
  try {
    await prisma.usuarios.update({
      where: { id },
      data: { activo: !estadoActual }
    });
    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (error) {
    return { error: "Error al cambiar el estado del usuario." };
  }
}

// Acción para Editar usuario
export async function editarUsuarioAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const nombre = formData.get('nombre') as string;
  const apellido = formData.get('apellido') as string;
  const telefono = formData.get('telefono') as string;
  const plan = formData.get('plan') as string;
  const tipo = formData.get('tipo') as string;

  try {
    await prisma.usuarios.update({
      where: { id },
      data: {
        nombre,
        apellido: apellido ? apellido : null,
        telefono: telefono ? telefono : null,
        plan,
        tipo,
      }
    });
    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el usuario." };
  }
}

/**
 * Guarda la URL de Cloudinary como foto_perfil del usuario.
 * Se llama después de que el widget de Cloudinary entrega la secure_url.
 */
export async function actualizarFotoUsuario(id: number, url: string | null) {
  try {
    await prisma.usuarios.update({
      where: { id },
      data: { foto_perfil: url },
    });
    revalidatePath(`/admin/usuarios/${id}`);
    revalidatePath('/admin/usuarios');
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar foto de perfil:", error);
    return { error: "No se pudo guardar la foto de perfil." };
  }
}
