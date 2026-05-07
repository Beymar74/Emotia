'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function crearUsuarioAction(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const apellido = formData.get('apellido') as string;
  const email = formData.get('email') as string;
  const telefono = formData.get('telefono') as string;
  const password = formData.get('password') as string;
  const plan = formData.get('plan') as string || 'basico';
  const tipo = formData.get('tipo') as string || 'usuario';

  try {
    // Validar que el email no exista
    const existe = await prisma.usuarios.findUnique({ where: { email } });
    if (existe) {
      return { error: "El correo electrónico ya está registrado." };
    }

    // Hashear contraseña si se proporciona
    let password_hash = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Crear el usuario incluyendo el tipo y el hash de la contraseña
    await prisma.usuarios.create({
      data: {
        nombre,
        apellido: apellido ? apellido : null,
        email,
        telefono: telefono ? telefono : null,
        password_hash,
        plan,
        tipo,
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