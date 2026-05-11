"use server";

import { obtenerProveedorActual } from "@/lib/auth-proveedor";

export async function obtenerSesionBusinessHeader() {
  const proveedor = await obtenerProveedorActual();

  if (!proveedor) {
    return null;
  }

  return {
    id: proveedor.id,
    nombre: proveedor.nombre_negocio,
    iniciales: proveedor.nombre_negocio
      .split(" ")
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    estado: proveedor.estado,
    logo: proveedor.logo_url,
  };
}