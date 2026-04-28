"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers"; // <-- Importamos el manejador de cookies

export async function validarLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor, completa todos los campos." };
  }

  try {
    const proveedor = await prisma.proveedores.findFirst({
      where: { email: email }
    });

    if (!proveedor || proveedor.password_hash !== password) {
      return { error: "Correo o contraseña incorrectos." };
    }

    // 🔥 CREAR SESIÓN: Guardamos el correo usando 'await'
    const cookieStore = await cookies();
    cookieStore.set("emotia_b2b_session", proveedor.email, {
      path: "/", 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      maxAge: 60 * 60 * 24 * 7 
    });

    return { success: true, email: proveedor.email };

  } catch (error) {
    console.error("Error en login:", error);
    return { error: "Ocurrió un error en el servidor. Intenta de nuevo." };
  }
}