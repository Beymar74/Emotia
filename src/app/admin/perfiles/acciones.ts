'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Acción para Suspender / Activar usuario
export async function toggleEstadoUsuario(id: number, estadoActual: boolean) {
  try {
    await prisma.usuarios.update({
      where: { id },
      data: { activo: !estadoActual } // Si está activo lo desactiva, y viceversa
    });
    revalidatePath('/perfiles'); // Ajusta a la ruta donde esté tu página
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
    revalidatePath('/perfiles');
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el usuario." };
  }
}