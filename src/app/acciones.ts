'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearUsuarioAction(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const apellido = formData.get('apellido') as string;
  const email = formData.get('email') as string;
  const telefono = formData.get('telefono') as string;
  const plan = formData.get('plan') as string || 'basico';
  const tipo = formData.get('tipo') as string || 'usuario'; // <-- Nuevo campo

  try {
    // Validar que el email no exista
    const existe = await prisma.usuarios.findUnique({ where: { email } });
    if (existe) {
      return { error: "El correo electrónico ya está registrado." };
    }

    // Crear el usuario incluyendo el tipo
    await prisma.usuarios.create({
      data: {
        nombre,
        apellido: apellido ? apellido : null,
        email,
        telefono: telefono ? telefono : null,
        plan,
        tipo, // <-- Guardamos el rol (admin o usuario)
      }
    });

    // Refrescar la página para que aparezca el nuevo usuario
    revalidatePath('/usuarios'); 
    
    return { success: true };
  } catch (error) {
    console.error("Error creando usuario:", error);
    return { error: "Ocurrió un error al guardar el usuario en la base de datos." };
  }
}