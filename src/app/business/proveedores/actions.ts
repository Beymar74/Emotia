"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function obtenerDatosSesionNegocio() {
  try {
    const cookieStore = await cookies();
    const emailSesion = cookieStore.get("emotia_b2b_session")?.value;

    if (!emailSesion) {
      console.log("No hay cookie de sesión activa");
      return null;
    }

    const proveedor = await prisma.proveedores.findFirst({
      where: { email: emailSesion },
      select: {
        id: true,
        nombre_negocio: true,
        estado: true
      }
    });

    if (!proveedor) return null;

    // Generar iniciales con seguridad
    const nombre = proveedor.nombre_negocio || "Mi Negocio";
    const palabras = nombre.trim().split(/\s+/);
    let iniciales = "MN";
    
    if (palabras.length >= 2) {
      iniciales = (palabras[0][0] + palabras[1][0]).toUpperCase();
    } else {
      iniciales = nombre.substring(0, 2).toUpperCase();
    }

    return {
      id: proveedor.id,
      nombre: nombre,
      iniciales: iniciales,
      estado: proveedor.estado
    };
  } catch (error) {
    console.error("Error en obtenerDatosSesionNegocio:", error);
    return null;
  }
}