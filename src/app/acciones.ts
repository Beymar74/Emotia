'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function crearUsuarioAction(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const apellido = formData.get('apellido') as string;
  const email = formData.get('email') as string;
  const telefono = formData.get('telefono') as string;
  const plan = formData.get('plan') as string || 'basico';
  const tipo = formData.get('tipo') as string || 'usuario'; // <-- Nuevo campo
  const password = formData.get('password') as string;

  if (!password || password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  try {
    // Validar que el email no exista
    const existe = await prisma.usuarios.findUnique({ where: { email } });
    if (existe) {
      return { error: "El correo electrónico ya está registrado." };
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear el usuario incluyendo el tipo
    await prisma.usuarios.create({
      data: {
        nombre,
        apellido: apellido ? apellido : null,
        email,
        telefono: telefono ? telefono : null,
        plan,
        tipo, // <-- Guardamos el rol (admin o usuario)
        password_hash,
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

export async function resetUserPasswordAction(userId: number, formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  if (!password || password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await prisma.usuarios.update({
      where: { id: userId },
      data: { password_hash },
    });

    revalidatePath(`/admin/usuarios/${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return { error: "Ocurrió un error al actualizar la contraseña." };
  }
}