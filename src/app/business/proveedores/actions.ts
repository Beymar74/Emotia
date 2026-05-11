"use server";

import { requireProveedor } from "@/lib/auth-proveedor";

export async function obtenerDatosSesionNegocio() {
  try {
    const proveedor = await requireProveedor();

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
      nombre,
      iniciales,
      estado: proveedor.estado,
      logo: proveedor.logo_url || null,
      email: proveedor.email,
      representante: proveedor.rep_nombre || "",
    };
  } catch (error) {
    console.error("Error en obtenerDatosSesionNegocio:", error);
    return null;
  }
}